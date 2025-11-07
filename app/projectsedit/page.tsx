"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Trash2, Edit, Save, Plus, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import Header from '@/components/header';
import Footer from '@/components/footer';

type Project = {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image_url: string;
  highlights: string[];
  is_featured?: boolean;
};

type ProjectForm = {
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image_url: string;
  highlights: string;
  is_featured: boolean;
};

export default function ProjectsEditPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>({
    title: "",
    category: "",
    location: "",
    year: "",
    description: "",
    image_url: "",
    highlights: "",
    is_featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    const { data, error } = await supabase.from("projects").select("*").order("year", { ascending: false });
    if (!error && data) setProjects(data as Project[]);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setForm({
      ...project,
      highlights: Array.isArray(project.highlights) ? project.highlights.join("\n") : "",
      is_featured: project.is_featured || false,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ title: "", category: "", location: "", year: "", description: "", image_url: "", highlights: "", is_featured: false });
    setImageFile(null);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this project? This will also unlink it from any associated quotes.")) return;
    
    try {
      // First, check if project is referenced by any quotes
      const { data: quotesWithProject, error: checkError } = await supabase
        .from("quote_requests")
        .select("id")
        .eq("project_id", id);
      
      const quoteCount = quotesWithProject?.length || 0;
      
      // Unlink this project from any quote_requests that reference it
      if (quoteCount > 0) {
        const { error: unlinkError } = await supabase
          .from("quote_requests")
          .update({ project_id: null })
          .eq("project_id", id);
        
        if (unlinkError) {
          console.error("Error unlinking quotes:", unlinkError);
          // If RLS prevents update, we need to handle this differently
          // Check if it's a permission error
          if (unlinkError.code === '42501' || unlinkError.message.includes('permission') || unlinkError.message.includes('policy')) {
            toast.error(`Cannot delete: Project is linked to ${quoteCount} quote(s) and you don't have permission to unlink them. Please unlink manually first.`);
            return;
          }
          toast.warning("Could not unlink from quotes, attempting to delete anyway...");
        } else {
          toast.info(`Unlinked project from ${quoteCount} quote(s)`);
        }
      }
      
      // Then delete the project
      const { error: deleteError } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);
      
      if (deleteError) {
        console.error("Delete error:", deleteError);
        // Provide more helpful error message
        if (deleteError.code === '23503' || deleteError.message.includes('foreign key')) {
          toast.error("Cannot delete: Project is still referenced by other records. Please unlink it from quotes first.");
        } else if (deleteError.code === '42501' || deleteError.message.includes('permission')) {
          toast.error("Permission denied: You don't have permission to delete projects.");
        } else {
          toast.error(`Failed to delete project: ${deleteError.message}`);
        }
        return;
      }
      
      toast.success("Project deleted successfully!");
      // Refresh the projects list
      fetchProjects();
    } catch (err: any) {
      console.error("Error deleting project:", err);
      toast.error(`Error deleting project: ${err.message}`);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let imageUrl = form.image_url;
    if (imageFile) {
      setUploading(true);
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${form.title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from('builderfiles').upload(`projects/${fileName}`, imageFile, { upsert: true });
      if (!error) {
        const { data: publicUrlData } = supabase.storage.from('builderfiles').getPublicUrl(`projects/${fileName}`);
        imageUrl = publicUrlData.publicUrl;
      }
      setUploading(false);
    }
    const highlightsArr = form.highlights.split("\n").map(h => h.trim()).filter(Boolean);
    if (editingId) {
      await supabase.from("projects").update({ ...form, image_url: imageUrl, highlights: highlightsArr }).eq("id", editingId);
    } else {
      await supabase.from("projects").insert([{ ...form, image_url: imageUrl, highlights: highlightsArr }]);
    }
    cancelEdit();
    fetchProjects();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  }

  return (
    <div className="dark min-h-screen flex flex-col bg-black">
      <Header />
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Edit Projects</h1>
        <form onSubmit={handleSave} className="mb-8 grid gap-4 md:grid-cols-2 bg-[#141414] p-6 rounded-xl border border-border/40">
          <div>
            <label className="block text-white font-semibold mb-1">Title</label>
            <Input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Category</label>
            <Input name="category" value={form.category} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Location</label>
            <Input name="location" value={form.location} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Year</label>
            <Input name="year" value={form.year} onChange={handleChange} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-white font-semibold mb-1">Description</label>
            <Textarea name="description" value={form.description} onChange={handleChange} rows={3} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-white font-semibold mb-1">Highlights (one per line)</label>
            <Textarea name="highlights" value={form.highlights} onChange={handleChange} rows={3} />
          </div>
          <div>
            <label className="block text-white font-semibold mb-1">Image</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {form.image_url && <img src={form.image_url} alt="Project" className="mt-2 rounded-lg w-full max-w-xs" />}
            {uploading && <div className="text-blue-400 mt-2">Uploading...</div>}
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-white">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                className="rounded"
              />
              <span className="font-semibold">Featured Project</span>
            </label>
          </div>
          <div className="flex items-end">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold" disabled={uploading}>
              <Save className="inline-block mr-2 h-5 w-5" /> {editingId ? "Update Project" : "Add Project"}
            </Button>
          </div>
        </form>
        <h2 className="text-2xl font-bold text-white mb-4">All Projects</h2>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div key={project.id} className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg flex flex-col">
                {editingId === project.id ? (
                  <form onSubmit={handleSave} className="grid gap-4">
                    <div>
                      <label className="block text-white font-semibold mb-1">Title</label>
                      <Input name="title" value={form.title} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1">Category</label>
                      <Input name="category" value={form.category} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1">Location</label>
                      <Input name="location" value={form.location} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1">Year</label>
                      <Input name="year" value={form.year} onChange={handleChange} required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1">Description</label>
                      <Textarea name="description" value={form.description} onChange={handleChange} rows={3} required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1">Highlights (one per line)</label>
                      <Textarea name="highlights" value={form.highlights} onChange={handleChange} rows={3} />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-1">Image</label>
                      <Input type="file" accept="image/*" onChange={handleFileChange} />
                      {form.image_url && <img src={form.image_url} alt="Project" className="mt-2 rounded-lg w-full max-w-xs" />}
                      {uploading && <div className="text-blue-400 mt-2">Uploading...</div>}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={form.is_featured}
                          onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                          className="rounded"
                        />
                        <span className="font-semibold">Featured Project</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold" disabled={uploading}>
                        <Save className="inline-block mr-2 h-5 w-5" /> Update Project
                      </Button>
                      <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {project.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{project.location}</span>
                      {project.is_featured && (
                        <span className="rounded-full bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">{project.title}</h3>
                    <div className="mb-2 text-muted-foreground">{project.year}</div>
                    <p className="mb-2 text-muted-foreground line-clamp-2">{project.description}</p>
                    {project.image_url && <img src={project.image_url} alt={project.title} className="rounded-lg mb-2 w-full max-h-40 object-cover" />}
                    {Array.isArray(project.highlights) && project.highlights.length > 0 && (
                      <ul className="mb-2 text-xs text-muted-foreground list-disc pl-4">
                        {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
                      </ul>
                    )}
                    <div className="mt-auto flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(project)}><Edit className="h-4 w-4 mr-1" />Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}><Trash2 className="h-4 w-4 mr-1" />Delete</Button>
                      <a href={`/projects/${project.id}`} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="secondary"><ArrowRight className="h-4 w-4 mr-1" />View Details</Button>
                      </a>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 