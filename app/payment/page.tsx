"use client";
import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const mockProjects = [
  'Riverside Apartments',
  'Tech Innovation Hub',
  'Sunset Plaza',
];

export default function PaymentPage() {
  const [form, setForm] = useState({
    project: mockProjects[0],
    amount: '',
    method: 'card',
  });
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;
    setSuccess(true);
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-md rounded-xl border border-border/40 bg-[#141414] p-8 shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-white text-center">Make a Payment</h1>
          {success ? (
            <div className="text-center">
              <div className="text-emerald-400 text-2xl font-bold mb-4">Payment Successful!</div>
              <p className="text-muted-foreground mb-6">Thank you for your payment.</p>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Back to Dashboard</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="project" className="block mb-2 text-white font-semibold">Project</label>
                <select
                  id="project"
                  name="project"
                  value={form.project}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                >
                  {mockProjects.map((proj) => (
                    <option key={proj} value={proj}>{proj}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="amount" className="block mb-2 text-white font-semibold">Amount</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                  min="1"
                  required
                />
              </div>
              <div>
                <label htmlFor="method" className="block mb-2 text-white font-semibold">Payment Method</label>
                <select
                  id="method"
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="ach">ACH Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Pay Now</Button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
} 