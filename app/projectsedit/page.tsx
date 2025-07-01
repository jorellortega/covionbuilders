"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Trash2, Edit, Save, Plus, UploadCloud } from "lucide-react";
import Header from '@/components/header';

type Project = {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image_url: string;
  highlights: string[];
};

type ProjectForm = {
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  image_url: string;
  highlights: string;
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
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ title: "", category: "", location: "", year: "", description: "", image_url: "", highlights: "" });
    setImageFile(null);
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
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
          <div className="flex items-end">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold" disabled={uploading}>
              <Save className="inline-block mr-2 h-5 w-5" /> Add Project
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
                      <a href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`} target="_blank" rel="noopener noreferrer">
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
    </div>
  );
} 