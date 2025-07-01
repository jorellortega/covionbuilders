"use client";
import Header from '@/components/header';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PayQuotePage() {
  const params = useParams();
  let id = '';
  if (params && typeof params.id === 'string') id = params.id;
  else if (params && Array.isArray(params.id)) id = params.id[0];
  id = id.trim();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      if (!id) return;
      setLoading(true);
      const supabase = (await import('@/lib/supabaseClient')).createSupabaseBrowserClient();
      const { data, error } = await supabase.from('quote_requests').select('*').eq('id', id).single();
      setQuote(data || null);
      setLoading(false);
    }
    fetchQuote();
  }, [id]);

  return (
    <div className="dark min-h-screen flex flex-col bg-black">
      <Header />
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Pay for Your Project</h1>
        {loading ? (
          <div className="text-white text-center">Loading...</div>
        ) : !quote ? (
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-white text-center">Quote not found.</div>
        ) : (
          <div className="max-w-xl mx-auto bg-[#141414] p-8 rounded-xl border border-border/40 text-white shadow-lg space-y-6">
            <div className="text-lg mb-2"><b>Name:</b> {quote.first_name} {quote.last_name}</div>
            <div className="text-lg mb-2"><b>Email:</b> {quote.email}</div>
            <div className="text-lg mb-2"><b>Status:</b> {quote.status}</div>
            <div className="text-2xl font-bold text-emerald-400 mb-4">Amount Due: {quote.estimated_price ? `$${Number(quote.estimated_price).toLocaleString()}` : 'N/A'}</div>
            {/* TODO: Integrate payment provider here */}
            <div className="bg-[#222] p-4 rounded-lg border border-border/40 text-white text-center">Payment integration coming soon...</div>
          </div>
        )}
      </div>
    </div>
  );
} 