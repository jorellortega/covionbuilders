"use client";
import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';

const pages = [
  'Home',
  'Concrete',
  'General Labor',
  'Landscaping',
  'Remodeling',
  'Residential Development',
  'Roofing',
  'Projects',
  'Careers',
];

export default function UpdatePixPage() {
  const [selectedPage, setSelectedPage] = useState(pages[0]);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabase] = useState(() => createSupabaseBrowserClient());

  function handlePageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedPage(e.target.value);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const fileName = `${selectedPage.toLowerCase().replace(/ /g, '-')}-hero.jpg`;
      const filePath = `page_images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('builderfiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, 
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error: dbError } = await supabase
        .from('files')
        .upsert({
          path: filePath,
          bucket: 'builderfiles',
          user_id: user?.id
        }, {
          onConflict: 'path'
        });

      if (dbError) {
        if (dbError.message.includes('constraint matching the ON CONFLICT')) {
          throw new Error("Database schema error: Please add a UNIQUE constraint to the 'path' column in your 'files' table.");
        }
        throw dbError;
      }

      setSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md rounded-xl border border-border/40 bg-[#141414] p-8 shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-white text-center">Update Placeholder Images</h1>
          {success ? (
            <div className="text-center">
              <div className="text-emerald-400 text-2xl font-bold mb-4">Image Updated Successfully!</div>
              <p className="text-muted-foreground mb-6">The placeholder image has been updated.</p>
              <Button onClick={() => setSuccess(false)} className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Update Another Image</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="text-red-500 text-center p-2 bg-red-900/20 rounded-md">
                  <p>Error: {error}</p>
                </div>
              )}
              <div>
                <label htmlFor="page" className="block mb-2 text-white font-semibold">Select Page</label>
                <select
                  id="page"
                  name="page"
                  value={selectedPage}
                  onChange={handlePageChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                >
                  {pages.map((page) => (
                    <option key={page} value={page}>{page}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="image" className="block mb-2 text-white font-semibold">Upload New Image</label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleFileChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                  accept="image/*"
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold" disabled={loading}>
                {loading ? 'Uploading...' : 'Update Image'}
              </Button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
} 