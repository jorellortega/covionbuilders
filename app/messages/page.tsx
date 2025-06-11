'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface UserMessage {
  id: string;
  subject: string;
  body: string;
  timestamp: string;
  reply?: string;
}

export default function MessagesPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [messages, setMessages] = useState<UserMessage[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('userMessages');
    if (stored) setMessages(JSON.parse(stored));
  }, []);

  const sendMessage = () => {
    if (!subject || !body) return;
    const newMsg: UserMessage = {
      id: Date.now().toString(),
      subject,
      body,
      timestamp: new Date().toISOString(),
    };
    const updated = [newMsg, ...messages];
    setMessages(updated);
    localStorage.setItem('userMessages', JSON.stringify(updated));
    setSubject('');
    setBody('');
  };

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <main className="flex-1 container py-16 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-white">Send a Message</h1>
        <div className="mb-6 p-4 border rounded bg-white">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Message"
            value={body}
            onChange={e => setBody(e.target.value)}
            className="border p-2 mb-2 w-full"
            rows={5}
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded w-full">Send</button>
        </div>
        <h2 className="text-xl font-bold mb-2 text-white">Your Sent Messages</h2>
        <ul>
          {messages.length === 0 && <li className="text-gray-500">No messages sent yet.</li>}
          {messages.map(msg => (
            <li key={msg.id} className="mb-4 p-4 border rounded bg-gray-50">
              <div className="text-xs text-gray-400 mb-1">{new Date(msg.timestamp).toLocaleString()}</div>
              <div className="font-semibold mb-1">{msg.subject}</div>
              <div className="mb-2 whitespace-pre-line">{msg.body}</div>
              {msg.reply && (
                <div className="mt-2 p-2 bg-green-100 border-l-4 border-green-400">
                  <div className="font-bold text-green-700">Reply:</div>
                  <div>{msg.reply}</div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
} 