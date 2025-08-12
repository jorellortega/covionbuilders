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
      
      if (error) {
        console.error('Error fetching quotes:', error);
      } else {
        console.log('Fetched quotes:', data);
        console.log('Sample quote files:', data?.[0]?.files);
      }
      
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
                  <th className="px-4 py-2 text-left">Files</th>
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
                    <td className="px-4 py-2">
                      {q.files && q.files.length > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                          {q.files.map((fileUrl: string, index: number) => {
                            console.log('Processing file:', fileUrl);
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
                            return (
                              <div key={index} className="relative group">
                                {isImage ? (
                                  <img
                                    src={fileUrl}
                                    alt={`File ${index + 1}`}
                                    className="w-12 h-12 object-cover rounded border border-border/40 cursor-pointer hover:scale-110 transition-transform"
                                    onClick={() => window.open(fileUrl, '_blank')}
                                    title="Click to view full size"
                                    onError={(e) => console.error('Image failed to load:', fileUrl)}
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-700 rounded border border-border/40 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                )}
                                <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {index + 1}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">No files</span>
                      )}
                    </td>
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