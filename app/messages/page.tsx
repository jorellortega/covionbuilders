'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Send, MessageSquare, Reply, Clock, User } from 'lucide-react';

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
      <main className="flex-1 container py-16 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">Messages</h1>
          <p className="text-muted-foreground">Stay connected with our team and track your conversations</p>
        </div>

        {/* Send Message Form */}
        <div className="mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-400" />
              Send a New Message
            </h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <textarea
                  placeholder="Write your message here..."
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  className="w-full px-4 py-3 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-muted-foreground"
                  rows={5}
                />
              </div>
              <div className="flex justify-end">
                <Button 
                  onClick={sendMessage} 
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-6 py-3 flex items-center gap-2"
                  disabled={!subject || !body}
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </div>
              {error && <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/20">{error}</div>}
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-emerald-400" />
            Your Messages
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Loading your messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">No messages sent yet.</div>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                onClick={() => document.getElementById('send-message')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Send Your First Message
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map(msg => (
                <div key={msg.id} className="bg-[#141414] p-6 rounded-xl border border-border/40">
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{msg.subject}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(msg.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {replies[msg.id]?.length || 0} replies
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="mb-4">
                    <div className="text-muted-foreground mb-2">Message:</div>
                    <div className="p-4 bg-[#232323] rounded-lg border border-border/40">
                      <div className="text-white whitespace-pre-line">{msg.body}</div>
                    </div>
                  </div>

                  {/* Replies Section */}
                  {replies[msg.id] && replies[msg.id].length > 0 && (
                    <div className="mb-6">
                      <div className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                        <Reply className="h-4 w-4" />
                        Conversation ({replies[msg.id].length} replies)
                      </div>
                      <div className="space-y-3">
                        {replies[msg.id].map((rep: any) => (
                          <div key={rep.id} className="p-4 bg-[#232323] border-l-4 border-emerald-500 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-emerald-400" />
                              <span className="text-sm font-medium text-emerald-400">
                                {rep.users?.name || 'Admin'}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(rep.created_at).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-white">{rep.body}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reply Form */}
                  <div className="border-t border-border/40 pt-4">
                    <div className="text-sm font-medium text-white mb-3">Add a reply:</div>
                    <div className="space-y-3">
                      <textarea
                        placeholder="Write your reply..."
                        value={replying[msg.id] ?? ''}
                        onChange={e => handleReplyChange(msg.id, e.target.value)}
                        className="w-full px-4 py-3 bg-[#232323] border border-border/40 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-muted-foreground"
                        rows={3}
                      />
                      <div className="flex justify-end">
                        <Button
                          className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-6 py-2 flex items-center gap-2"
                          onClick={() => handleReplySave(msg.id)}
                          disabled={saving[msg.id] || !replying[msg.id]}
                        >
                          <Reply className="h-4 w-4" />
                          {saving[msg.id] ? 'Sending...' : 'Send Reply'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
} 