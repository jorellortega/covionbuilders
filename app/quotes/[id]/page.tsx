"use client";
import Header from '@/components/header';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function QuoteDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<any[]>([]);
  const [selectedContractId, setSelectedContractId] = useState<string>('');
  const [savingContract, setSavingContract] = useState(false);
  const [attachSuccess, setAttachSuccess] = useState('');
  const [price, setPrice] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);
  const [priceSuccess, setPriceSuccess] = useState('');
  const [startingProject, setStartingProject] = useState(false);
  const [projectId, setProjectId] = useState(quote?.project_id || '');
  const [projectSuccess, setProjectSuccess] = useState('');
  const [projectError, setProjectError] = useState('');

  useEffect(() => {
    async function fetchQuoteAndContracts() {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      const [{ data: quoteData }, { data: contractsData }] = await Promise.all([
        supabase.from('quote_requests').select('*').eq('id', id).single(),
        supabase.from('contracts').select('*').order('created_at', { ascending: false })
      ]);
      setQuote(quoteData || null);
      setContracts(contractsData || []);
      setSelectedContractId(quoteData?.contract_id || '');
      setPrice(quoteData?.estimated_price ? String(quoteData.estimated_price) : '');
      setProjectId(quoteData?.project_id || '');
      setLoading(false);
    }
    if (id) fetchQuoteAndContracts();
  }, [id]);

  async function handleAttachContract(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedContractId) return;
    setSavingContract(true);
    setAttachSuccess('');
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from('quote_requests').update({ contract_id: selectedContractId }).eq('id', id);
    if (!error) {
      setAttachSuccess('Contract attached!');
      setQuote((q: any) => ({ ...q, contract_id: selectedContractId }));
    }
    setSavingContract(false);
  }

  async function handleSavePrice(e: React.FormEvent) {
    e.preventDefault();
    setSavingPrice(true);
    setPriceSuccess('');
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from('quote_requests').update({ estimated_price: price }).eq('id', id);
    if (!error) {
      setPriceSuccess('Price updated!');
      setQuote((q: any) => ({ ...q, estimated_price: price }));
    }
    setSavingPrice(false);
  }

  async function handleStartProject() {
    setStartingProject(true);
    setProjectSuccess('');
    setProjectError('');
    try {
      const supabase = createSupabaseBrowserClient();
      // Copy relevant fields from quote to project
      const { data: projectData, error: insertError } = await supabase.from('projects').insert([
        {
          title: quote.project_description || `${quote.first_name} ${quote.last_name} Project`,
          category: quote.project_type || '',
          location: quote.project_location || '',
          year: new Date().getFullYear().toString(),
          description: quote.project_description || '',
          estimated_price: quote.estimated_price || null,
          highlights: [],
          image_url: '',
          // Add more fields as needed
        }
      ]).select().single();
      if (insertError) {
        setProjectError('Failed to create project: ' + insertError.message);
        setStartingProject(false);
        return;
      }
      // Link project to quote
      const { error: updateError } = await supabase.from('quote_requests').update({ project_id: projectData.id }).eq('id', id);
      if (updateError) {
        setProjectError('Failed to link project: ' + updateError.message);
        setStartingProject(false);
        return;
      }
      setProjectId(projectData.id);
      setProjectSuccess('Project started!');
    } catch (err: any) {
      setProjectError('Unexpected error: ' + err.message);
    }
    setStartingProject(false);
  }

  const attachedContract = contracts.find(c => c.id === (quote?.contract_id || selectedContractId));

  return (
    <div className="dark min-h-screen flex flex-col bg-black">
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex justify-end mb-4 gap-2">
          <Link href={`/viewquote/${id}`} target="_blank">
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">View as Client</Button>
          </Link>
          {projectId && (
            <Link href={`/uploadfiles/${projectId}`} target="_blank">
              <Button className="bg-gradient-to-r from-emerald-600 to-blue-500 text-white font-semibold">Upload Project Files</Button>
            </Link>
          )}
        </div>
        <h1 className="text-4xl font-bold text-white mb-8">Quote Details (Staff/Admin)</h1>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : !quote ? (
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-white">Quote not found.</div>
        ) : (
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-white space-y-4">
            <div><b>ID:</b> <span className="font-mono text-xs">{quote.id}</span></div>
            <div><b>Name:</b> {quote.first_name} {quote.last_name}</div>
            <div><b>Email:</b> {quote.email}</div>
            <div><b>Phone:</b> {quote.phone}</div>
            <div><b>Status:</b> {quote.status || 'pending'}</div>
            <div><b>Project Description:</b> {quote.project_description}</div>
            <div><b>Project Type:</b> {quote.project_type}</div>
            <div><b>Project Size:</b> {quote.project_size}</div>
            <div><b>Project Location:</b> {quote.project_location}</div>
            <div><b>Project Timeline:</b> {quote.project_timeline}</div>
            <div><b>Budget:</b> {quote.budget}</div>
            <div><b>Company:</b> {quote.company}</div>
            <div><b>Services:</b> {Array.isArray(quote.services) ? quote.services.join(', ') : ''}</div>
            <div><b>Additional Comments:</b> {quote.additional_comments}</div>
            {/* Contract Attachment Section */}
            <div className="mt-8 p-4 rounded-xl border border-border/40 bg-gradient-to-br from-blue-900/30 to-emerald-900/20">
              <h3 className="text-xl font-bold text-white mb-2">Attach Contract</h3>
              <form className="flex flex-col md:flex-row gap-4 items-center" onSubmit={handleAttachContract}>
                <select
                  className="rounded-lg px-3 py-2 bg-[#232323] text-white border border-border/40 min-w-[200px]"
                  value={selectedContractId}
                  onChange={e => setSelectedContractId(e.target.value)}
                >
                  <option value="">Select a contract...</option>
                  {contracts.map(c => (
                    <option key={c.id} value={c.id}>{c.title} ({c.type === 'pdf' ? 'PDF' : 'Text'})</option>
                  ))}
                </select>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold" disabled={savingContract || !selectedContractId}>
                  {savingContract ? 'Attaching...' : 'Attach'}
                </Button>
                {attachSuccess && <span className="text-green-400 ml-2">{attachSuccess}</span>}
              </form>
              {attachedContract && (
                <div className="mt-4">
                  <span className="font-semibold text-white">Attached Contract:</span>{' '}
                  {attachedContract.type === 'pdf' && attachedContract.pdf_url ? (
                    <a href={attachedContract.pdf_url} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">View PDF</a>
                  ) : attachedContract.type === 'text' ? (
                    <Button size="sm" variant="secondary" className="ml-2" onClick={() => alert(attachedContract.contract_text)}>View Text</Button>
                  ) : null}
                </div>
              )}
            </div>
            {/* End Contract Attachment Section */}
            {/* Set Price Section */}
            <div className="mt-8 p-4 rounded-xl border border-border/40 bg-gradient-to-br from-blue-900/30 to-emerald-900/20">
              <h3 className="text-xl font-bold text-white mb-2">Set Estimated Price</h3>
              <form className="flex flex-col md:flex-row gap-4 items-center" onSubmit={handleSavePrice}>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="rounded-lg px-3 py-2 bg-[#232323] text-white border border-border/40 min-w-[120px]"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="Enter price"
                />
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold" disabled={savingPrice}>
                  {savingPrice ? 'Saving...' : 'Save Price'}
                </Button>
                {priceSuccess && <span className="text-green-400 ml-2">{priceSuccess}</span>}
              </form>
              {quote?.estimated_price && (
                <div className="mt-2 text-muted-foreground">Current Price: <span className="font-semibold text-white">${Number(quote.estimated_price).toLocaleString()}</span></div>
              )}
            </div>
            {/* End Set Price Section */}
            {/* Show Quote Status */}
            <div className="mt-6 text-lg text-center">
              <span className="font-semibold text-white">Quote Status:</span>{' '}
              <span className="text-blue-400">{quote.status}</span>
            </div>
            {/* Start Project Button */}
            {quote.status === 'approved' && !projectId && (
              <div className="mt-8 flex flex-col items-center">
                <Button
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold px-8 py-3 text-lg shadow"
                  onClick={handleStartProject}
                  disabled={startingProject}
                >
                  {startingProject ? 'Starting Project...' : 'Start Project'}
                </Button>
                {projectSuccess && <div className="text-green-400 mt-2">{projectSuccess}</div>}
                {projectError && <div className="text-red-400 mt-2">{projectError}</div>}
              </div>
            )}
            {/* Project Link */}
            {projectId && (
              <div className="mt-6 text-center">
                <span className="font-semibold text-white">Project Started:</span>{' '}
                <a href={`/projects/${projectId}`} className="underline text-emerald-400" target="_blank" rel="noopener noreferrer">View Project</a>
              </div>
            )}
            <div className="mt-6 flex gap-4">
              <Button variant="outline">Set Price</Button>
              <Button variant="outline">Send to Client</Button>
              <Button variant="secondary">Other Actions</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 