'use client';
import { useState, useEffect, useRef } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Button } from './ui/button';

const PLACEHOLDER_URL = '/placeholder.svg?height=300&width=450&text=Project+Image';

export function ProjectGallery({ project }: { project: any }) {
  const [isCeo, setIsCeo] = useState(false);
  const [images, setImages] = useState<string[]>(project.images || []);
  const [uploading, setUploading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const fileInputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await supabase.from('users').select('role').eq('id', userId).single();
        if (data?.role === 'ceo') setIsCeo(true);
      }
    }
    checkRole();
  }, []);

  async function handleUpload(idx: number, file: File) {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${project.title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}-${idx}.${fileExt}`;
    const path = `project_images/${fileName}`;
    const { error } = await supabase.storage.from('builderfiles').upload(path, file, { upsert: true });
    if (!error) {
      const { data: publicUrlData } = supabase.storage.from('builderfiles').getPublicUrl(path);
      const newImages = [...images];
      newImages[idx] = publicUrlData.publicUrl;
      setImages(newImages);
      await supabase.from('projects').update({ images: newImages }).eq('id', project.id);
    }
    setUploading(false);
  }

  async function handleDelete(idx: number) {
    const newImages = [...images];
    newImages[idx] = '';
    setImages(newImages);
    await supabase.from('projects').update({ images: newImages }).eq('id', project.id);
  }

  function handleFileChange(idx: number, e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleUpload(idx, e.target.files[0]);
    }
  }

  function triggerFileInput(idx: number) {
    fileInputRefs[idx].current?.click();
  }

  // Always show 2 slots
  const slots = [0, 1];

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-white mb-4">Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {slots.map((idx) => {
          const url = images[idx] || '';
          return (
            <div key={idx} className="relative group">
              <img
                src={url || PLACEHOLDER_URL}
                alt={project.title + ' gallery ' + (idx + 1)}
                className="w-full rounded-lg border border-border/40 object-cover"
                style={{ minHeight: 200 }}
              />
              {isCeo && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-80 group-hover:opacity-100">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRefs[idx]}
                    style={{ display: 'none' }}
                    onChange={e => handleFileChange(idx, e)}
                  />
                  <Button size="sm" variant="outline" onClick={() => triggerFileInput(idx)} disabled={uploading}>
                    {url ? 'Replace' : 'Add'}
                  </Button>
                  {url && (
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(idx)} disabled={uploading}>
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {uploading && <div className="text-blue-400 mt-2">Uploading...</div>}
    </div>
  );
}

export function ProjectMainImage({ project }: { project: any }) {
  const [isCeo, setIsCeo] = useState(false);
  const [image, setImage] = useState<string>(project.image_url || '');
  const [uploading, setUploading] = useState(false);
  const supabase = createSupabaseBrowserClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function checkRole() {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (userId) {
        const { data } = await supabase.from('users').select('role').eq('id', userId).single();
        if (data?.role === 'ceo') setIsCeo(true);
      }
    }
    checkRole();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${project.title.replace(/\s+/g, '-').toLowerCase()}-main-${Date.now()}.${fileExt}`;
    const path = `project_images/${fileName}`;
    const { error } = await supabase.storage.from('builderfiles').upload(path, file, { upsert: true });
    if (!error) {
      const { data: publicUrlData } = supabase.storage.from('builderfiles').getPublicUrl(path);
      setImage(publicUrlData.publicUrl);
      await supabase.from('projects').update({ image_url: publicUrlData.publicUrl }).eq('id', project.id);
    }
    setUploading(false);
  }

  async function handleDelete() {
    setImage('');
    await supabase.from('projects').update({ image_url: '' }).eq('id', project.id);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  }

  function triggerFileInput() {
    fileInputRef.current?.click();
  }

  const url = image || '/placeholder.svg?height=400&width=600&text=Project+Image';

  return (
    <div className="mb-8 relative group">
      <img
        src={url}
        alt={project.title}
        className="w-full rounded-xl border border-border/40 mb-6"
      />
      {isCeo && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-80 group-hover:opacity-100">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button size="sm" variant="outline" onClick={triggerFileInput} disabled={uploading}>
            {image ? 'Replace' : 'Add'}
          </Button>
          {image && (
            <Button size="sm" variant="destructive" onClick={handleDelete} disabled={uploading}>
              Delete
            </Button>
          )}
        </div>
      )}
      {uploading && <div className="text-blue-400 mt-2">Uploading...</div>}
    </div>
  );
} 