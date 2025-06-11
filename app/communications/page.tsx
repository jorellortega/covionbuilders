"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Communication {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
  timestamp: string;
}

export default function CommunicationsPage() {
  const [messages, setMessages] = useState<Communication[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('communications');
      if (stored) setMessages(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <main className="flex-1 container py-16">
        <h1 className="text-4xl font-bold mb-8 text-white">Communications</h1>
        {messages.length === 0 ? (
          <div className="text-muted-foreground text-center">No messages yet.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {messages.map((msg, idx) => (
              <div key={idx} className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
                <div className="mb-2 text-xs text-muted-foreground text-right">{new Date(msg.timestamp).toLocaleString()}</div>
                <div className="mb-2 font-semibold text-white">{msg.firstName} {msg.lastName}</div>
                <div className="mb-2 text-muted-foreground">Email: {msg.email}</div>
                <div className="mb-2 text-muted-foreground">Phone: {msg.phone}</div>
                <div className="mb-2 text-muted-foreground">Project Type: {msg.projectType}</div>
                <div className="mb-2 text-muted-foreground">Message:</div>
                <div className="text-white whitespace-pre-line">{msg.message}</div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 