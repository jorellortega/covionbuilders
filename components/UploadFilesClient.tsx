"use client";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function UploadFilesClient({ projectId, existingFiles }: { projectId: string, existingFiles: string[] }) {
  const [files, setFiles] = useState(existingFiles);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${projectId}-${Date.now()}.${fileExt}`;
    const path = `project_additional_files/${fileName}`;
    const { error: uploadError } = await supabase.storage.from('builderfiles').upload(path, file, { upsert: true });
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('builderfiles').getPublicUrl(path);
    const newFiles = [...files, publicUrlData.publicUrl];
    setFiles(newFiles);
    await supabase.from('projects').update({ additional_files: newFiles }).eq('id', projectId);
    setUploading(false);
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-white mb-4">Upload Additional Photos or Files</h2>
      <input type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} className="mb-4" />
      {uploading && <div className="text-blue-400 mb-2">Uploading...</div>}
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {files.length === 0 && <div className="text-muted-foreground italic">No files uploaded yet.</div>}
        {files.map((url, idx) => (
          <div key={idx} className="bg-zinc-900 rounded-lg p-4 flex flex-col items-center">
            {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
              <img src={url} alt="Uploaded" className="w-full max-h-48 object-contain mb-2 rounded" />
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline mb-2">Download File</a>
            )}
            <span className="text-xs break-all text-muted-foreground">{url.split('/').pop()}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 