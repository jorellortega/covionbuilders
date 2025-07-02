'use client';
import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import Header from '@/components/header';
import Footer from '@/components/footer';

const ICON_OPTIONS = [
  'Building2',
  'HardHat',
  'Hammer',
  'Ruler',
  'Shield',
  'Layers',
];

export default function ServicesEditPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    features: '', // comma separated
    icon: 'Building2',
    image_url: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('title');
    if (!error && data) setServices(data);
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.title) { setError('Title is required'); return; }
    const { error } = await supabase.from('services').insert({
      title: form.title,
      description: form.description,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
      icon: form.icon,
      image_url: form.image_url,
    });
    if (error) { setError(error.message); return; }
    setForm({ title: '', description: '', features: '', icon: 'Building2', image_url: '' });
    fetchServices();
  }

  function startEdit(service: any) {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      features: (service.features || []).join(', '),
      icon: service.icon || 'Building2',
      image_url: service.image_url || '',
    });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setError('');
    const { error } = await supabase.from('services').update({
      title: form.title,
      description: form.description,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
      icon: form.icon,
      image_url: form.image_url,
    }).eq('id', editingId);
    if (error) { setError(error.message); return; }
    setEditingId(null);
    setForm({ title: '', description: '', features: '', icon: 'Building2', image_url: '' });
    fetchServices();
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    fetchServices();
  }

  function handleCancel() {
    setEditingId(null);
    setForm({ title: '', description: '', features: '', icon: 'Building2', image_url: '' });
    setError('');
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${form.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExt}`;
    const path = `services_images/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('builderfiles').upload(path, file, { upsert: true });
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage.from('builderfiles').getPublicUrl(path);
      setForm(f => ({ ...f, image_url: publicUrlData.publicUrl }));
    } else {
      setError(uploadError.message);
    }
    setUploading(false);
  }

  async function handleImageDelete() {
    if (!form.image_url) return;
    const path = form.image_url.split('/').slice(-2).join('/'); // get services_images/filename.ext
    await supabase.storage.from('builderfiles').remove([path]);
    setForm(f => ({ ...f, image_url: '' }));
  }

  return (
    <div className="dark flex min-h-screen flex-col bg-black/90">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl bg-[#181818] rounded-xl p-8 border border-border/40 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-white text-center">Manage Services</h1>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="space-y-4 mb-8">
            <div>
              <label className="block mb-1 text-white font-semibold">Title</label>
              <Input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-1 text-white font-semibold">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white" rows={2} />
            </div>
            <div>
              <label className="block mb-1 text-white font-semibold">Features (comma separated)</label>
              <Input name="features" value={form.features} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 text-white font-semibold">Icon</label>
              <select name="icon" value={form.icon} onChange={handleChange} className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white">
                {ICON_OPTIONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-white font-semibold">Image</label>
              {form.image_url ? (
                <div className="mb-2 flex flex-col gap-2">
                  <img src={form.image_url} alt="Service" className="w-32 h-32 object-cover rounded border border-border/40" />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>Replace</Button>
                    <Button type="button" variant="destructive" onClick={handleImageDelete} disabled={uploading}>Delete</Button>
                  </div>
                </div>
              ) : (
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading}>Upload Image</Button>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <div className="text-blue-400 mt-2">Uploading...</div>}
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-2">
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">
                {editingId ? 'Update Service' : 'Add Service'}
              </Button>
              {editingId && <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>}
            </div>
          </form>
          <h2 className="text-xl font-bold mb-4 text-white">All Services</h2>
          {loading ? <div className="text-muted-foreground">Loading...</div> : (
            <div className="space-y-4">
              {services.map(service => (
                <div key={service.id} className="flex flex-col md:flex-row md:items-center md:justify-between bg-black/30 rounded-lg p-4 border border-border/40">
                  <div>
                    <div className="font-semibold text-white">{service.title}</div>
                    <div className="text-muted-foreground text-sm mb-1">{service.description}</div>
                    <div className="text-xs text-muted-foreground mb-1">Features: {(service.features || []).join(', ')}</div>
                    <div className="text-xs text-muted-foreground">Icon: {service.icon}</div>
                    {service.image_url && <img src={service.image_url} alt="Service" className="w-20 h-20 object-cover rounded border border-border/40 mt-2" />}
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Button size="sm" variant="outline" onClick={() => startEdit(service)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(service.id)}>Delete</Button>
                  </div>
                </div>
              ))}
              {services.length === 0 && <div className="text-muted-foreground">No services found.</div>}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
} 