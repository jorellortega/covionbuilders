"use client";
console.log("CLIENT ENV:", process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    // Fetch user role
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
      if (data?.role === 'ceo') {
        router.push('/ceo');
        return;
      }
    }
    router.push('/dashboard');
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md rounded-xl border border-border/40 bg-[#141414] p-8 shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-white text-center">Log In</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-white font-semibold">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-white font-semibold">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Log In</Button>
            <div className="text-center mt-4">
              <Link href="/signup" className="text-blue-400 hover:underline">Don't have an account? Sign up</Link>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
} 