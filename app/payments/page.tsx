"use client";
import { useState } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';

const mockPayments = [
  { id: 1, amount: 1000, project: 'Riverside Apartments', date: '2023-10-01' },
  { id: 2, amount: 2000, project: 'Tech Innovation Hub', date: '2023-10-02' },
  { id: 3, amount: 1500, project: 'Sunset Plaza', date: '2023-10-03' },
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(mockPayments);

  function handleDelete(id: number) {
    setPayments(payments.filter(payment => payment.id !== id));
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="flex flex-1 items-center justify-center py-16">
        <div className="w-full max-w-4xl rounded-xl border border-border/40 bg-[#141414] p-8 shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-white text-center">Manage Payments</h1>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center p-4 border border-border/40 rounded-md">
                <div>
                  <h2 className="text-xl font-bold text-white">${payment.amount}</h2>
                  <p className="text-muted-foreground">{payment.project} - {payment.date}</p>
                </div>
                <div className="space-x-2">
                  <Button className="bg-blue-600 text-white">View Details</Button>
                  <Button onClick={() => handleDelete(payment.id)} className="bg-red-600 text-white">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 