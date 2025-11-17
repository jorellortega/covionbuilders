"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Image as ImageIcon, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

const SERVICE_PAGES = [
  { slug: 'general-labor', name: 'General Labor' },
  { slug: 'concrete', name: 'Concrete' },
  { slug: 'painting', name: 'Painting' },
  { slug: 'roofing', name: 'Roofing' },
  { slug: 'remodeling', name: 'Remodeling' },
  { slug: 'landscaping', name: 'Landscaping' },
  { slug: 'residential-development', name: 'Residential Development' },
];

export default function ManageServicePagesPage() {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isCEO, setIsCEO] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    hero_image_url: '',
    gallery_images: [] as string[],
    video_url: '',
    services_section_title: '',
    services_content: {
      left: { title: '', items: [] as string[] },
      right: { title: '', items: [] as string[] },
    },
    why_choose_title: '',
    why_choose_content: [] as Array<{ icon: string; title: string; description: string }>,
    cta_title: '',
    cta_description: '',
    meta_description: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedSlug) {
      loadServicePage();
    }
  }, [selectedSlug]);

  const checkAuth = async () => {
    const supabase = createSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (userData?.role !== 'ceo') {
      toast.error('Access denied. CEO role required.');
      router.push('/dashboard');
      return;
    }

    setIsCEO(true);
    setLoading(false);
  };

  const loadServicePage = async () => {
    if (!selectedSlug) return;
    
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('service_pages')
        .select('*')
        .eq('slug', selectedSlug)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          hero_image_url: data.hero_image_url || '',
          gallery_images: data.gallery_images || [],
          video_url: data.video_url || '',
          services_section_title: data.services_section_title || '',
          services_content: data.services_content || {
            left: { title: '', items: [] },
            right: { title: '', items: [] },
          },
          why_choose_title: data.why_choose_title || '',
          why_choose_content: data.why_choose_content || [],
          cta_title: data.cta_title || '',
          cta_description: data.cta_description || '',
          meta_description: data.meta_description || '',
        });
      } else {
        // Initialize with defaults
        setFormData({
          title: '',
          subtitle: '',
          hero_image_url: '',
          gallery_images: [],
          video_url: '',
          services_section_title: '',
          services_content: {
            left: { title: '', items: [] },
            right: { title: '', items: [] },
          },
          why_choose_title: '',
          why_choose_content: [],
          cta_title: '',
          cta_description: '',
          meta_description: '',
        });
      }
    } catch (err: any) {
      console.error('Error loading service page:', err);
      toast.error('Failed to load service page');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedSlug) {
      toast.error('Please select a service page');
      return;
    }

    setSaving(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from('service_pages')
        .upsert({
          slug: selectedSlug,
          title: formData.title,
          subtitle: formData.subtitle,
          hero_image_url: formData.hero_image_url,
          gallery_images: formData.gallery_images,
          video_url: formData.video_url,
          services_section_title: formData.services_section_title,
          services_content: formData.services_content,
          why_choose_title: formData.why_choose_title,
          why_choose_content: formData.why_choose_content,
          cta_title: formData.cta_title,
          cta_description: formData.cta_description,
          meta_description: formData.meta_description,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'slug',
        });

      if (error) throw error;
      toast.success('Service page saved successfully!');
    } catch (err: any) {
      console.error('Error saving service page:', err);
      toast.error('Failed to save service page');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (type: 'hero' | 'gallery') => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const supabase = createSupabaseBrowserClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `service-page-${selectedSlug}-${type}-${Date.now()}.${fileExt}`;
        const path = `service_pages/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('builderfiles')
          .upload(path, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('builderfiles')
          .getPublicUrl(path);

        if (type === 'hero') {
          setFormData(prev => ({ ...prev, hero_image_url: publicUrl }));
        } else {
          setFormData(prev => ({
            ...prev,
            gallery_images: [...prev.gallery_images, publicUrl],
          }));
        }

        toast.success('Image uploaded successfully!');
      } catch (err: any) {
        console.error('Error uploading image:', err);
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
    };
    fileInput.click();
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));
  };

  const addServiceItem = (side: 'left' | 'right') => {
    setFormData(prev => ({
      ...prev,
      services_content: {
        ...prev.services_content,
        [side]: {
          ...prev.services_content[side],
          items: [...prev.services_content[side].items, ''],
        },
      },
    }));
  };

  const updateServiceItem = (side: 'left' | 'right', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      services_content: {
        ...prev.services_content,
        [side]: {
          ...prev.services_content[side],
          items: prev.services_content[side].items.map((item, i) => i === index ? value : item),
        },
      },
    }));
  };

  const removeServiceItem = (side: 'left' | 'right', index: number) => {
    setFormData(prev => ({
      ...prev,
      services_content: {
        ...prev.services_content,
        [side]: {
          ...prev.services_content[side],
          items: prev.services_content[side].items.filter((_, i) => i !== index),
        },
      },
    }));
  };

  const addWhyChooseItem = () => {
    setFormData(prev => ({
      ...prev,
      why_choose_content: [...prev.why_choose_content, { icon: '⭐', title: '', description: '' }],
    }));
  };

  const updateWhyChooseItem = (index: number, field: 'icon' | 'title' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      why_choose_content: prev.why_choose_content.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeWhyChooseItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      why_choose_content: prev.why_choose_content.filter((_, i) => i !== index),
    }));
  };

  if (loading && !isCEO) {
    return (
      <div className="dark flex min-h-screen flex-col bg-black">
        <Header />
        <div className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isCEO) {
    return null;
  }

  return (
    <div className="dark flex min-h-screen flex-col bg-black">
      <Header />
      <div className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">Manage Service Pages</h1>

          {/* Service Page Selector */}
          <Card className="bg-[#141414] border-border/40 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Select Service Page</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
              >
                <option value="">-- Select a service page --</option>
                {SERVICE_PAGES.map(page => (
                  <option key={page.slug} value={page.slug}>{page.name}</option>
                ))}
              </select>
            </CardContent>
          </Card>

          {selectedSlug && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="bg-[#141414] border-border/40">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block mb-2 text-white font-semibold">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-black/30 text-white border-border/40"
                      placeholder="Page Title"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-white font-semibold">Subtitle</label>
                    <Textarea
                      value={formData.subtitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="bg-black/30 text-white border-border/40 min-h-[100px]"
                      placeholder="Page subtitle/description"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-white font-semibold">Meta Description</label>
                    <Textarea
                      value={formData.meta_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                      className="bg-black/30 text-white border-border/40"
                      placeholder="SEO meta description"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Hero Image */}
              <Card className="bg-[#141414] border-border/40">
                <CardHeader>
                  <CardTitle className="text-white">Hero Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.hero_image_url && (
                    <div className="relative">
                      <img src={formData.hero_image_url} alt="Hero" className="w-full h-64 object-cover rounded-lg" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600"
                        onClick={() => setFormData(prev => ({ ...prev, hero_image_url: '' }))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Button
                    onClick={() => handleImageUpload('hero')}
                    disabled={uploading}
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        {formData.hero_image_url ? 'Replace Hero Image' : 'Upload Hero Image'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Gallery Images */}
              <Card className="bg-[#141414] border-border/40">
                <CardHeader>
                  <CardTitle className="text-white">Gallery Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.gallery_images.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 h-6 w-6"
                          onClick={() => removeGalleryImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleImageUpload('gallery')}
                    disabled={uploading}
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Gallery Image
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Video URL */}
              <Card className="bg-[#141414] border-border/40">
                <CardHeader>
                  <CardTitle className="text-white">Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="block mb-2 text-white font-semibold">Video URL (YouTube embed URL)</label>
                    <Input
                      value={formData.video_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                      className="bg-black/30 text-white border-border/40"
                      placeholder="https://www.youtube.com/embed/..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Services Section */}
              <Card className="bg-[#141414] border-border/40">
                <CardHeader>
                  <CardTitle className="text-white">Services Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block mb-2 text-white font-semibold">Section Title</label>
                    <Input
                      value={formData.services_section_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, services_section_title: e.target.value }))}
                      className="bg-black/30 text-white border-border/40"
                      placeholder="Our Services"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {(['left', 'right'] as const).map(side => (
                      <div key={side} className="space-y-4">
                        <div>
                          <label className="block mb-2 text-white font-semibold">{side === 'left' ? 'Left Column' : 'Right Column'} Title</label>
                          <Input
                            value={formData.services_content[side].title}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              services_content: {
                                ...prev.services_content,
                                [side]: { ...prev.services_content[side], title: e.target.value },
                              },
                            }))}
                            className="bg-black/30 text-white border-border/40"
                            placeholder="Column Title"
                          />
                        </div>
                        <div>
                          <label className="block mb-2 text-white font-semibold">Items</label>
                          {formData.services_content[side].items.map((item, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                              <Input
                                value={item}
                                onChange={(e) => updateServiceItem(side, index, e.target.value)}
                                className="bg-black/30 text-white border-border/40"
                                placeholder="Service item"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => removeServiceItem(side, index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addServiceItem(side)}
                            className="mt-2 border-emerald-500/50 text-emerald-400"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Item
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Why Choose Us Section */}
              <Card className="bg-[#141414] border-border/40">
                <CardHeader>
                  <CardTitle className="text-white">Why Choose Us Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block mb-2 text-white font-semibold">Section Title</label>
                    <Input
                      value={formData.why_choose_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, why_choose_title: e.target.value }))}
                      className="bg-black/30 text-white border-border/40"
                      placeholder="Why Choose Us"
                    />
                  </div>
                  {formData.why_choose_content.map((item, index) => (
                    <div key={index} className="border border-border/40 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-semibold">Item {index + 1}</label>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300"
                          onClick={() => removeWhyChooseItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        value={item.icon}
                        onChange={(e) => updateWhyChooseItem(index, 'icon', e.target.value)}
                        className="bg-black/30 text-white border-border/40"
                        placeholder="Icon (emoji or text)"
                      />
                      <Input
                        value={item.title}
                        onChange={(e) => updateWhyChooseItem(index, 'title', e.target.value)}
                        className="bg-black/30 text-white border-border/40"
                        placeholder="Title"
                      />
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateWhyChooseItem(index, 'description', e.target.value)}
                        className="bg-black/30 text-white border-border/40"
                        placeholder="Description"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addWhyChooseItem}
                    className="border-emerald-500/50 text-emerald-400"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Why Choose Item
                  </Button>
                </CardContent>
              </Card>

              {/* CTA Section */}
              <Card className="bg-[#141414] border-border/40">
                <CardHeader>
                  <CardTitle className="text-white">Call to Action Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block mb-2 text-white font-semibold">CTA Title</label>
                    <Input
                      value={formData.cta_title}
                      onChange={(e) => setFormData(prev => ({ ...prev, cta_title: e.target.value }))}
                      className="bg-black/30 text-white border-border/40"
                      placeholder="Ready to Start?"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-white font-semibold">CTA Description</label>
                    <Textarea
                      value={formData.cta_description}
                      onChange={(e) => setFormData(prev => ({ ...prev, cta_description: e.target.value }))}
                      className="bg-black/30 text-white border-border/40"
                      placeholder="Contact us today..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <Card className="bg-[#141414] border-border/40">
                <CardContent className="pt-6">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Service Page
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

