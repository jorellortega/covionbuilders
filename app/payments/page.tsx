"use client";
import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import Link from 'next/link';
import { Search, Loader2, CreditCard, FileText, User, Mail } from 'lucide-react';

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setSearching(true);
    setError('');
    setResults([]);

    try {
      const supabase = createSupabaseBrowserClient();
      const query = searchQuery.trim();

      // Check if query looks like a UUID (invoice ID)
      // UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(query);

      // Run all searches in parallel, but handle errors individually
      const searchPromises = [];

      // Always search by email
      searchPromises.push(
        supabase
          .from('quote_requests')
          .select('*')
          .ilike('email', `%${query}%`)
          .order('created_at', { ascending: false })
          .then(({ data, error }) => ({ data: data || [], error, type: 'email' }))
          .catch(err => ({ data: [], error: err, type: 'email' }))
      );

      // Always search by first name
      searchPromises.push(
        supabase
          .from('quote_requests')
          .select('*')
          .ilike('first_name', `%${query}%`)
          .order('created_at', { ascending: false })
          .then(({ data, error }) => ({ data: data || [], error, type: 'first_name' }))
          .catch(err => ({ data: [], error: err, type: 'first_name' }))
      );

      // Always search by last name
      searchPromises.push(
        supabase
          .from('quote_requests')
          .select('*')
          .ilike('last_name', `%${query}%`)
          .order('created_at', { ascending: false })
          .then(({ data, error }) => ({ data: data || [], error, type: 'last_name' }))
          .catch(err => ({ data: [], error: err, type: 'last_name' }))
      );

      // Only search by ID if it looks like a UUID
      if (isUUID) {
        searchPromises.push(
          supabase
            .from('quote_requests')
            .select('*')
            .eq('id', query)
            .order('created_at', { ascending: false })
            .then(({ data, error }) => ({ data: data || [], error, type: 'id' }))
            .catch(err => ({ data: [], error: err, type: 'id' }))
        );
      }

      const searchResults = await Promise.all(searchPromises);

      // Check for critical errors (but don't fail if some searches fail)
      const hasCriticalError = searchResults.some(result => result.error && result.error.code !== 'PGRST116');
      if (hasCriticalError) {
        console.error('Search errors:', searchResults.filter(r => r.error).map(r => ({ type: r.type, error: r.error })));
      }

      // Combine all results
      const allResults = searchResults.flatMap(result => result.data || []);

      // Remove duplicates by ID
      const uniqueResults = Array.from(
        new Map(allResults.map(item => [item.id, item])).values()
      );

      // Filter to only show quotes with estimated_price (invoices that can be paid)
      const payableQuotes = uniqueResults.filter(quote => quote.estimated_price);

      setResults(payableQuotes);

      if (payableQuotes.length === 0) {
        setError('No payable invoices found. Make sure you entered the correct name, email, or invoice number.');
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="flex flex-1 items-center justify-center py-16 px-4">
        <div className="w-full max-w-4xl rounded-xl border border-border/40 bg-[#141414] p-8 shadow-lg">
          <h1 className="mb-2 text-3xl font-bold text-white text-center">Make a Payment</h1>
          <p className="mb-6 text-muted-foreground text-center">
            Search for your invoice by name, email, or invoice number
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Enter name, email, or invoice number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  disabled={searching}
                />
              </div>
              <Button 
                type="submit" 
                disabled={searching}
                className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold"
              >
                {searching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-400">
              {error}
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white mb-4">
                Found {results.length} invoice{results.length !== 1 ? 's' : ''}
              </h2>
              {results.map((quote) => (
                <Card key={quote.id} className="bg-[#1a1a1a] border-border/40">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Invoice #{quote.id.slice(0, 8).toUpperCase()}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            {quote.first_name} {quote.last_name}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Mail className="h-4 w-4" />
                            {quote.email}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-400">
                          ${Number(quote.estimated_price).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Amount Due
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-white">Project:</span> {quote.project_description || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-semibold text-white">Status:</span> {quote.status || 'pending'}
                      </div>
                      {quote.created_at && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-semibold text-white">Created:</span>{' '}
                          {new Date(quote.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <Link href={`/pay/${quote.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {!searching && results.length === 0 && searchQuery && !error && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No results found. Try a different search term.</p>
            </div>
          )}

          {/* Initial State */}
          {!searching && results.length === 0 && !searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Enter your name, email, or invoice number above to find your invoice.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
} 