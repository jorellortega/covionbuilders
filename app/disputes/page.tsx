"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { AlertTriangle, Upload, X, FileText, Image, Video, File, Loader2, CheckCircle, User, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

type SubmissionType = 'dispute' | 'update';

interface UploadedFile {
  file: File;
  preview?: string;
  url?: string;
}

export default function DisputesPage() {
  const [submissionType, setSubmissionType] = useState<SubmissionType>('update');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    projectId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    description: '',
    category: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkAuth() {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setIsAuthenticated(true);
        setUser(session.user);
        
        // Get user info
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userData) {
          setFormData(prev => ({
            ...prev,
            firstName: userData.name?.split(' ')[0] || '',
            lastName: userData.name?.split(' ').slice(1).join(' ') || '',
            email: session.user.email || '',
            phone: userData.phone || '',
          }));
        }

        // Get user's projects/quotes
        const [quotesResult, projectsResult] = await Promise.all([
          supabase
            .from('quote_requests')
            .select('id, project_description, estimated_price, status, created_at, project_id')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('projects')
            .select('id, title, description, estimated_price, created_at')
            .order('created_at', { ascending: false })
        ]);

        const allProjects: any[] = [];
        
        // Add quotes
        if (quotesResult.data) {
          quotesResult.data.forEach(quote => {
            allProjects.push({
              id: quote.id,
              name: quote.project_description || `Quote ${quote.id.slice(0, 8)}`,
              type: 'quote',
              status: quote.status,
              created_at: quote.created_at
            });
          });
        }
        
        // Add projects (if user has any linked projects)
        if (projectsResult.data && quotesResult.data) {
          const userProjectIds = quotesResult.data
            .filter(q => q.project_id)
            .map(q => q.project_id);
          
          projectsResult.data
            .filter(p => userProjectIds.includes(p.id))
            .forEach(project => {
              allProjects.push({
                id: project.id,
                name: project.title || project.description || `Project ${project.id}`,
                type: 'project',
                status: 'active',
                created_at: project.created_at
              });
            });
        }

        // Sort by created_at
        allProjects.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setUserProjects(allProjects);
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const files = Array.from(e.target.files);
    const newFiles: UploadedFile[] = files.map(file => {
      const fileObj: UploadedFile = { file };
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        fileObj.preview = URL.createObjectURL(file);
      }
      
      return fileObj;
    });
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    const file = uploadedFiles[index];
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (file.type.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (file.type === 'application/pdf') return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!isAuthenticated) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError('Please fill in all required fields.');
        return;
      }
    }
    
    if (!formData.description) {
      setError('Please provide a description.');
      return;
    }

    setSubmitting(true);
    setUploading(true);

    try {
      const supabase = createSupabaseBrowserClient();
      let fileUrls: string[] = [];

      // Upload files
      if (uploadedFiles.length > 0) {
        for (const fileObj of uploadedFiles) {
          try {
            const sanitizedName = fileObj.file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${submissionType}-${Date.now()}-${sanitizedName}`;
            const path = `disputes/${fileName}`;
            
            const { error: uploadError } = await supabase
              .storage
              .from('builderfiles')
              .upload(path, fileObj.file, { upsert: true });
            
            if (uploadError) {
              console.error('File upload error:', uploadError);
              toast.error(`Failed to upload ${fileObj.file.name}`);
              continue;
            }
            
            const { data: publicUrlData } = supabase
              .storage
              .from('builderfiles')
              .getPublicUrl(path);
            
            if (publicUrlData?.publicUrl) {
              fileUrls.push(publicUrlData.publicUrl);
            }
          } catch (fileError) {
            console.error('File upload error:', fileError);
            toast.error(`Failed to upload ${fileObj.file.name}`);
          }
        }
      }

      setUploading(false);

      // Insert dispute/update
      const { error: insertError } = await supabase
        .from('disputes')
        .insert({
          type: submissionType,
          user_id: isAuthenticated ? user?.id : null,
          project_id: formData.projectId || null,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          description: formData.description,
          category: formData.category || null,
          files: fileUrls,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        console.error('Error submitting dispute:', insertError);
        setError('Failed to submit. Please try again.');
        return;
      }

      // Success
      toast.success(
        submissionType === 'dispute' 
          ? 'Dispute submitted successfully! We will review and respond shortly.'
          : 'Update submitted successfully! Thank you for your feedback.'
      );

      // Reset form
      setFormData({
        projectId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        description: '',
        category: '',
      });
      setUploadedFiles([]);
      
      // Clean up preview URLs
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });

    } catch (err: any) {
      console.error('Error submitting dispute:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="dark flex min-h-screen flex-col bg-black">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dark flex min-h-screen flex-col bg-black">
      <Header />
      <div className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2 text-center">
            {submissionType === 'dispute' ? 'Submit a Dispute' : 'Submit an Update'}
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            {submissionType === 'dispute' 
              ? 'Report issues with your project, payment, or service'
              : 'Share updates, feedback, or information about your project'}
          </p>

          {/* Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#141414] p-1 rounded-lg border border-border/40 inline-flex">
              <button
                onClick={() => setSubmissionType('dispute')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  submissionType === 'dispute'
                    ? 'bg-red-600 text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Dispute
              </button>
              <button
                onClick={() => setSubmissionType('update')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  submissionType === 'update'
                    ? 'bg-blue-600 text-white'
                    : 'text-muted-foreground hover:text-white'
                }`}
              >
                <CheckCircle className="h-4 w-4 inline mr-2" />
                Update
              </button>
            </div>
          </div>

          {/* Auth Status */}
          {isAuthenticated && (
            <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-emerald-400">
                <User className="h-5 w-5" />
                <span className="font-semibold">Signed in as: {user?.email}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-[#141414] p-8 rounded-xl border border-border/40 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {/* Project Selection (if authenticated) */}
            {isAuthenticated && (
              <div>
                <label className="block text-white font-semibold mb-2">
                  Related Project (Optional)
                </label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                >
                  <option value="">Select a project...</option>
                  {userProjects.length > 0 ? (
                    userProjects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} {project.type === 'quote' ? `(${project.status})` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No projects found</option>
                  )}
                </select>
                {userProjects.length === 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    You don't have any projects yet. You can still submit without selecting a project.
                  </p>
                )}
              </div>
            )}

            {/* Contact Information (if not authenticated) */}
            {!isAuthenticated && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="bg-black/30 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="bg-black/30 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-black/30 text-white"
                  />
                </div>
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Phone (Optional)
                  </label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-black/30 text-white"
                  />
                </div>
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
              >
                <option value="">Select a category...</option>
                {submissionType === 'dispute' ? (
                  <>
                    <option value="payment">Payment Issue</option>
                    <option value="quality">Quality Concern</option>
                    <option value="timeline">Timeline/Delay</option>
                    <option value="staff">Staff Behavior</option>
                    <option value="communication">Communication Issue</option>
                    <option value="other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="progress">Progress Update</option>
                    <option value="feedback">Feedback</option>
                    <option value="question">Question</option>
                    <option value="change_request">Change Request</option>
                    <option value="other">Other</option>
                  </>
                )}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Subject (Optional)
              </label>
              <Input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Brief summary of your issue or update"
                className="bg-black/30 text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                placeholder={`Please provide details about your ${submissionType}...`}
                className="bg-black/30 text-white"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Attach Files (Optional)
              </label>
              <p className="text-sm text-muted-foreground mb-3">
                Upload photos, PDFs, documents, or videos to support your {submissionType}
              </p>
              <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-white font-medium">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-sm text-muted-foreground">
                    PDF, DOC, DOCX, Images, Videos
                  </span>
                </label>
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {uploadedFiles.map((fileObj, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-black/30 rounded-lg border border-border/40"
                    >
                      <div className="text-emerald-400">
                        {getFileIcon(fileObj.file)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">{fileObj.file.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatFileSize(fileObj.file.size)}
                        </p>
                      </div>
                      {fileObj.preview && (
                        <img
                          src={fileObj.preview}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting || uploading}
              className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading files...
                </>
              ) : submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  {submissionType === 'dispute' ? (
                    <>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Submit Dispute
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit Update
                    </>
                  )}
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

