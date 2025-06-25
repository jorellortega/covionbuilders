"use client";

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function TestPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState<any[]>([]);

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    // Check for existing session
    checkUser();
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Check your email for the confirmation link!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function testDatabaseConnection() {
    try {
      // Try to create a test table if it doesn't exist
      const { error: createError } = await supabase
        .from('test_table')
        .insert([{ name: 'Test Entry', created_at: new Date().toISOString() }])
        .select();

      if (createError) {
        // If table doesn't exist, show error
        toast.error('Test table might not exist. Please create it in your Supabase dashboard.');
        return;
      }

      // Fetch test data
      const { data, error } = await supabase
        .from('test_table')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setTestData(data || []);
      toast.success('Database connection successful!');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Test Page</h1>

      {/* Debug Section */}
      <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 rounded">
        <h2 className="font-bold mb-2">Debug Info</h2>
        <div className="text-xs">
          <div><b>NEXT_PUBLIC_SUPABASE_URL:</b> {process.env.NEXT_PUBLIC_SUPABASE_URL?.toString() || 'undefined'}</div>
          <div><b>NEXT_PUBLIC_SUPABASE_ANON_KEY:</b> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 8) + '...' || 'undefined'}</div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Auth Section */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="mb-2">Current User:</p>
                <pre className="bg-gray-100 p-2 rounded">
                  {user ? JSON.stringify(user, null, 2) : 'Not signed in'}
                </pre>
              </div>

              <form className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSignIn}
                    disabled={loading}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleSignUp}
                    disabled={loading}
                    variant="outline"
                  >
                    Sign Up
                  </Button>
                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                  >
                    Sign Out
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Database Test Section */}
        <Card>
          <CardHeader>
            <CardTitle>Database Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={testDatabaseConnection}>
                Test Database Connection
              </Button>

              {testData.length > 0 && (
                <div>
                  <p className="mb-2">Recent Test Data:</p>
                  <pre className="bg-gray-100 p-2 rounded">
                    {JSON.stringify(testData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 