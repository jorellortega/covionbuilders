"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';

function ApplyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    position: searchParams.get('position') || '',
    coverLetter: '',
    resume: null as File | null,
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, files } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, send form data to backend here
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-xl">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter text-center md:text-5xl lg:text-6xl text-white">Apply for a Job</h1>
          {submitted ? (
            <div className="rounded-xl border border-border/40 p-8 text-center bg-[#141414]">
              <h2 className="mb-4 text-2xl font-semibold text-white">Application Submitted!</h2>
              <p className="text-muted-foreground mb-4">Thank you for applying. We will review your application and contact you if you are selected for an interview.</p>
              <Button onClick={() => router.push('/careers')}>Back to Careers</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl border border-border/40 p-8 bg-[#141414] space-y-6">
              <div>
                <label className="block mb-2 text-white font-semibold" htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                  required
                  readOnly={!!searchParams.get('position')}
                />
              </div>
              <div>
                <label className="block mb-2 text-white font-semibold" htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-white font-semibold" htmlFor="email">Email</label>
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
                <label className="block mb-2 text-white font-semibold" htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-white font-semibold" htmlFor="coverLetter">Cover Letter</label>
                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={form.coverLetter}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                  rows={5}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-white font-semibold" htmlFor="resume">Resume (PDF, DOC, etc.)</label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white">Submit Application</Button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function ApplyPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplyPage />
    </Suspense>
  );
} 