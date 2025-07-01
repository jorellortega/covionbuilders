"use client";
import Header from '@/components/header';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

export default function AllQuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuotes() {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false });
      setQuotes(data || []);
      setLoading(false);
    }
    fetchQuotes();
  }, []);

  return (
    <div className="dark min-h-screen flex flex-col bg-black">
      <Header />
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-white mb-8">All Quotes Dashboard</h1>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : quotes.length === 0 ? (
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-white">No quotes found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#141414] rounded-xl border border-border/40 text-white">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr key={q.id} className="border-t border-border/40">
                    <td className="px-4 py-2 font-mono text-xs">{q.id}</td>
                    <td className="px-4 py-2">{q.first_name} {q.last_name}</td>
                    <td className="px-4 py-2">{q.email}</td>
                    <td className="px-4 py-2">{q.status || 'pending'}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <Link href={`/quotes/${q.id}`}><Button size="sm" variant="outline">Staff View</Button></Link>
                      <Link href={`/viewquote/${q.id}`}><Button size="sm" variant="secondary">Client View</Button></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 