"use client";
import Header from '@/components/header';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function ManageContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [contractText, setContractText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    fetchContracts();
  }, []);

  async function fetchContracts() {
    setLoading(true);
    const { data, error } = await supabase.from('contracts').select('*').order('created_at', { ascending: false });
    setContracts(data || []);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title) {
      setError('Title is required.');
      return;
    }
    if (!pdfFile && !contractText) {
      setError('Please upload a PDF or enter contract text.');
      return;
    }
    setUploading(true);
    let pdfUrl = null;
    let type = '';
    if (pdfFile) {
      type = 'pdf';
      const fileExt = pdfFile.name.split('.').pop();
      const fileName = `${title.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${fileExt}`;
      const path = `contracts/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('builderfiles').upload(path, pdfFile, { upsert: true });
      if (uploadError) {
        setError('Failed to upload PDF.');
        setUploading(false);
        return;
      }
      const { data: publicUrlData } = supabase.storage.from('builderfiles').getPublicUrl(path);
      pdfUrl = publicUrlData.publicUrl;
    } else {
      type = 'text';
    }
    const { error: insertError } = await supabase.from('contracts').insert([
      {
        title,
        type,
        pdf_url: pdfUrl,
        contract_text: contractText || null,
      },
    ]);
    if (insertError) {
      setError('Failed to save contract.');
    } else {
      setSuccess('Contract saved!');
      setTitle('');
      setPdfFile(null);
      setContractText('');
      fetchContracts();
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    setUploading(false);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this contract?')) return;
    await supabase.from('contracts').delete().eq('id', id);
    fetchContracts();
  }

  function startEdit(contract: any) {
    setEditingId(contract.id);
    setEditTitle(contract.title);
    setEditText(contract.contract_text || '');
  }

  async function handleEditSave(id: string) {
    await supabase.from('contracts').update({ title: editTitle, contract_text: editText }).eq('id', id);
    setEditingId(null);
    fetchContracts();
  }

  return (
    <div className="dark min-h-screen flex flex-col bg-black">
      <Header />
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Contract Library</h1>
        <div className="mb-12 flex flex-col md:flex-row gap-8 justify-center items-stretch">
          <div className="flex-1 max-w-xl mx-auto rounded-xl border border-border/40 bg-gradient-to-br from-blue-900/30 to-emerald-900/20 p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-white">Add New Contract</h2>
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block mb-1 font-medium">Contract Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-[#232323] text-white border border-border/40" placeholder="Enter contract title" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Upload PDF</label>
                <input type="file" accept="application/pdf" ref={fileInputRef} onChange={e => setPdfFile(e.target.files?.[0] || null)} className="w-full" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Or Enter Contract Text</label>
                <textarea value={contractText} onChange={e => setContractText(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-[#232323] text-white border border-border/40 min-h-[120px]" placeholder="Paste or type contract text here..." />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              {success && <div className="text-green-500">{success}</div>}
              <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold w-full mt-2" disabled={uploading}>{uploading ? 'Saving...' : 'Save Contract'}</Button>
            </form>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">All Contracts</h2>
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : contracts.length === 0 ? (
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-white text-center">No contracts found.</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {contracts.map((c) => (
              <div key={c.id} className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between">
                <div>
                  {editingId === c.id ? (
                    <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="rounded-lg px-2 py-1 bg-[#232323] text-white border border-border/40 w-full mb-2" />
                  ) : (
                    <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                  )}
                  <div className="mb-2 text-sm text-muted-foreground">{c.type === 'pdf' ? 'PDF Contract' : 'Text Contract'}</div>
                  {c.type === 'pdf' && c.pdf_url && (
                    <a href={c.pdf_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="secondary" className="w-full mb-2">View/Download PDF</Button>
                    </a>
                  )}
                  {c.type === 'text' && (
                    editingId === c.id ? (
                      <textarea value={editText} onChange={e => setEditText(e.target.value)} className="rounded-lg px-2 py-1 bg-[#232323] text-white border border-border/40 w-full min-h-[60px] mb-2" />
                    ) : (
                      <Button size="sm" variant="secondary" className="w-full mb-2" onClick={() => alert(c.contract_text)}>View Text</Button>
                    )
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  {editingId === c.id ? (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditSave(c.id)}>Save</Button>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => startEdit(c)}>Edit</Button>
                  )}
                  <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleDelete(c.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 