"use client";
import Header from '@/components/header';
import { useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function ViewQuotePage() {
  const params = useParams();
  let id = '';
  if (params && typeof params.id === 'string') id = params.id;
  else if (params && Array.isArray(params.id)) id = params.id[0];
  id = id.trim();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState<any[]>([]);
  const [approving, setApproving] = useState(false);
  const [approveSuccess, setApproveSuccess] = useState('');
  const [approveError, setApproveError] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchQuote() {
      if (!id) return;
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.from('quote_requests').select('*').eq('id', id).single();
      setQuote(data || null);
      setLoading(false);
    }
    fetchQuote();
  }, [id]);

  useEffect(() => {
    async function fetchContracts() {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.from('contracts').select('*');
      setContracts(data || []);
    }
    fetchContracts();
  }, []);

  const attachedContract = contracts.find(c => c.id === quote?.contract_id);

  async function handleApprove() {
    setApproving(true);
    setApproveSuccess('');
    setApproveError('');
    console.log('ID being sent to Supabase:', id, typeof id);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.from('quote_requests').update({ status: 'approved' }).eq('id', id);
    if (error) {
      setApproveError('Error: ' + error.message);
      console.log('Supabase error:', error);
      setApproving(false);
      return;
    }
    setApproveSuccess('Quote approved!');
    setQuote((q: any) => ({ ...q, status: 'approved' }));
    setTimeout(() => {
      router.push(`/pay/${id}`);
    }, 1000);
    setApproving(false);
  }

  return (
    <div className="dark min-h-screen flex flex-col bg-black">
      <Header />
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Your Quote & Contract</h1>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : !quote ? (
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-white mb-6">Quote not found.</div>
        ) : (
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-white mb-6 space-y-4">
            <div><b>Name:</b> {quote.first_name} {quote.last_name}</div>
            <div><b>Email:</b> {quote.email}</div>
            <div><b>Status:</b> {quote.status || 'pending'}</div>
            <div><b>Project Description:</b> {quote.project_description}</div>
            {quote.project_type && quote.project_type !== 'General Construction' && (
              <div><b>Project Type:</b> {quote.project_type}</div>
            )}
            {quote.project_size && quote.project_size !== 'Not specified' && (
              <div><b>Project Size:</b> {quote.project_size}</div>
            )}
            {quote.project_location && quote.project_location !== 'Not specified' && (
              <div><b>Project Location:</b> {quote.project_location}</div>
            )}
            {quote.project_timeline && quote.project_timeline !== 'Not specified' && (
              <div><b>Project Timeline:</b> {quote.project_timeline}</div>
            )}
            {quote.budget && quote.budget !== 'Not specified' && (
              <div><b>Budget:</b> {quote.budget}</div>
            )}
            {quote.company && (
              <div><b>Company:</b> {quote.company}</div>
            )}
            {quote.services && Array.isArray(quote.services) && quote.services.length > 0 && (
              <div><b>Services:</b> {quote.services.join(', ')}</div>
            )}
            {quote.additional_comments && (
              <div><b>Additional Comments:</b> {quote.additional_comments}</div>
            )}
            
            {/* Uploaded Files Section */}
            {quote.files && quote.files.length > 0 && (
              <div className="mt-6 p-4 rounded-xl border border-border/40 bg-black">
                <h3 className="text-xl font-bold text-white mb-4">Uploaded Files & Images</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {quote.files.map((fileUrl: string, index: number) => {
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
                    return (
                      <div key={index} className="relative group">
                        {isImage ? (
                          <div className="space-y-2">
                            <img
                              src={fileUrl}
                              alt={`File ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg border border-border/40 cursor-pointer hover:scale-105 transition-transform shadow-lg"
                              onClick={() => window.open(fileUrl, '_blank')}
                              title="Click to view full size"
                            />
                            <div className="text-center space-y-2">
                              <span className="text-sm text-gray-300">Image {index + 1}</span>
                              <div className="flex gap-2 justify-center">
                                <a 
                                  href={fileUrl} 
                                  download
                                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="w-full h-48 bg-gray-700 rounded-lg border border-border/40 flex items-center justify-center">
                              <div className="text-center">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="text-sm text-gray-300">Document</div>
                                <div className="text-xs text-gray-400 truncate">{fileUrl.split('/').pop()}</div>
                              </div>
                            </div>
                            <div className="text-center space-y-2">
                              <div className="flex gap-2 justify-center">
                                <a 
                                  href={fileUrl} 
                                  download
                                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-400">
                    {quote.files.length} file{quote.files.length !== 1 ? 's' : ''} uploaded
                  </span>
                </div>
              </div>
            )}
            
            {/* Show Estimated Price */}
            {quote.estimated_price && (
              <div className="mt-6 p-4 rounded-xl border border-border/40 bg-gradient-to-br from-blue-900/30 to-emerald-900/20">
                <span className="font-semibold text-white text-lg">Estimated Price:</span>{' '}
                <span className="text-emerald-400 text-2xl font-bold">${Number(quote.estimated_price).toLocaleString()}</span>
              </div>
            )}
            {/* Show Attached Contract */}
            {quote.contract_id && (
              <div className="mt-6 p-4 rounded-xl border border-border/40 bg-gradient-to-br from-blue-900/30 to-emerald-900/20">
                <span className="font-semibold text-white text-lg">Attached Contract:</span>{' '}
                {attachedContract ? (
                  attachedContract.type === 'pdf' && attachedContract.pdf_url ? (
                    <a href={attachedContract.pdf_url} target="_blank" rel="noopener noreferrer" className="underline text-blue-400">View PDF</a>
                  ) : attachedContract.type === 'text' ? (
                    <Button size="sm" variant="secondary" className="ml-2" onClick={() => alert(attachedContract.contract_text)}>View Text</Button>
                  ) : null
                ) : (
                  <span className="text-muted-foreground">Contract not found.</span>
                )}
              </div>
            )}
            {/* TODO: Show contract, e-sign, payment, etc. */}
            <div className="mt-6 bg-[#222] p-4 rounded-lg border border-border/40 text-white">Contract, e-sign, and payment features coming soon...</div>
            {/* Approve Button */}
            <div className="mt-8 flex flex-col items-center">
              <Button
                className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold px-8 py-3 text-lg shadow"
                onClick={handleApprove}
                disabled={approving || quote.status === 'approved'}
              >
                {quote.status === 'approved' ? 'Approved' : approving ? 'Approving...' : 'Approve Quote'}
              </Button>
              {approveSuccess && <div className="text-green-400 mt-2">{approveSuccess}</div>}
              {approveError && <div className="text-red-400 mt-2">{approveError}</div>}
            </div>
            {/* End Approve Button */}
          </div>
        )}
        <div className="bg-[#222] p-4 rounded-lg border border-border/40 text-white mt-6">Manage this quote/job &mdash; <button className="underline text-blue-400">Create an account</button></div>
      </div>
    </div>
  );
} 