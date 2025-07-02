'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

interface UserMessage {
  id: string;
  user_id: string;
  subject: string;
  body: string;
  created_at: string;
  reply?: string;
  is_read?: boolean;
  replied_at?: string;
}

export default function MessagesPage() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const [replies, setReplies] = useState<{ [messageId: string]: any[] }>({});
  const [replying, setReplying] = useState<{ [id: string]: string }>({});
  const [saving, setSaving] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        window.location.href = '/login';
        return;
      }
      setUser(data.user);
      // Fetch messages for this user
      supabase
        .from('messages')
        .select('*')
        .eq('user_id', data.user.id)
        .order('created_at', { ascending: false })
        .then(async ({ data: msgs, error }) => {
          if (error) setError('Failed to load messages.');
          else setMessages(msgs || []);
          setLoading(false);
          // Fetch all replies for these messages
          if (msgs && msgs.length > 0) {
            const ids = msgs.map(m => m.id);
            const { data: repliesData, error: repError } = await supabase
              .from('message_replies')
              .select('*, users(name, email)')
              .in('message_id', ids)
              .order('created_at', { ascending: true });
            if (!repError && repliesData) {
              const grouped: { [messageId: string]: any[] } = {};
              for (const rep of repliesData) {
                if (!grouped[rep.message_id]) grouped[rep.message_id] = [];
                grouped[rep.message_id].push(rep);
              }
              setReplies(grouped);
            }
          }
        });
    });
  }, []);

  const sendMessage = async () => {
    if (!subject || !body || !user) return;
    setError('');
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from('messages')
      .insert({
        user_id: user.id,
        subject,
        body,
      })
      .select()
      .single();
    if (error) {
      setError('Failed to send message.');
      return;
    }
    setMessages([data, ...messages]);
    setSubject('');
    setBody('');
  };

  const handleReplyChange = (id: string, value: string) => {
    setReplying(r => ({ ...r, [id]: value }));
  };

  const handleReplySave = async (id: string) => {
    setSaving(s => ({ ...s, [id]: true }));
    setError('');
    const supabase = createSupabaseBrowserClient();
    const reply = replying[id];
    const { error, data } = await supabase
      .from('message_replies')
      .insert({ message_id: id, body: reply, user_id: user.id })
      .select('*, users(name, email)')
      .single();
    if (error) setError('Failed to send reply.');
    setReplies(r => ({
      ...r,
      [id]: [...(r[id] || []), data],
    }));
    setSaving(s => ({ ...s, [id]: false }));
    setReplying(r => ({ ...r, [id]: '' }));
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
            className="border p-2 mb-2 w-full text-black"
          />
          <textarea
            placeholder="Message"
            value={body}
            onChange={e => setBody(e.target.value)}
            className="border p-2 mb-2 w-full text-black"
            rows={5}
          />
          <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded w-full">Send</button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
        <h2 className="text-xl font-bold mb-2 text-white">Your Sent Messages</h2>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <ul>
            {messages.length === 0 && <li className="text-gray-500">No messages sent yet.</li>}
            {messages.map(msg => (
              <li key={msg.id} className="mb-4 p-4 border rounded bg-gray-50 text-black">
                <div className="text-xs text-gray-400 mb-1">{new Date(msg.created_at).toLocaleString()}</div>
                <div className="font-semibold mb-1">{msg.subject}</div>
                <div className="mb-2 whitespace-pre-line">{msg.body}</div>
                {/* Show all replies for this message */}
                {replies[msg.id] && replies[msg.id].length > 0 && (
                  <div className="mb-2">
                    <div className="font-bold text-green-700 mb-1">Conversation:</div>
                    <div className="space-y-2">
                      {replies[msg.id].map((rep: any) => (
                        <div key={rep.id} className="p-2 bg-green-100 border-l-4 border-green-400 rounded">
                          <div className="text-xs text-green-700 mb-1">{rep.users?.name || 'Admin'} • {new Date(rep.created_at).toLocaleString()}</div>
                          <div>{rep.body}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-2">
                  <textarea
                    placeholder="Write a reply..."
                    value={replying[msg.id] ?? ''}
                    onChange={e => handleReplyChange(msg.id, e.target.value)}
                    className="mb-2 w-full border rounded p-2 text-black"
                    rows={2}
                  />
                  <button
                    className="w-full bg-blue-500 text-white p-2 rounded"
                    onClick={() => handleReplySave(msg.id)}
                    disabled={saving[msg.id] || !replying[msg.id]}
                  >
                    {saving[msg.id] ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
} 