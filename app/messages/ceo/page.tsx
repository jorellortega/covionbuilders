"use client";
import { useEffect, useState } from "react";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';

export default function CeoMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [replies, setReplies] = useState<{ [messageId: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState<{ [id: string]: string }>({});
  const [saving, setSaving] = useState<{ [id: string]: boolean }>({});
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [latestQuote, setLatestQuote] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      // Get current user and check role
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = '/login';
        return;
      }
      setUser(user);
      // Check role
      const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
      if (userData?.role !== 'ceo') {
        window.location.href = '/messages';
        return;
      }
      // Fetch all messages with user info
      const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select('*, users(name, email)')
        .order('created_at', { ascending: false });
      if (msgError) setError('Failed to load messages.');
      setMessages(messagesData || []);
      // Build user list from messages
      const userMap: { [id: string]: { id: string, name: string, email: string, count: number } } = {};
      (messagesData || []).forEach((msg: any) => {
        if (!msg.users) return;
        if (!userMap[msg.user_id]) {
          userMap[msg.user_id] = { id: msg.user_id, name: msg.users.name || 'Unknown', email: msg.users.email, count: 0 };
        }
        userMap[msg.user_id].count++;
      });
      setUsers(Object.values(userMap));
      if (!selectedUserId && Object.values(userMap).length > 0) {
        setSelectedUserId(Object.values(userMap)[0].id);
      }
      // Fetch all replies
      const { data: repliesData, error: repError } = await supabase
        .from('message_replies')
        .select('*, users(name, email)')
        .order('created_at', { ascending: true });
      if (!repError && repliesData) {
        const grouped: { [messageId: string]: any[] } = {};
        for (const rep of repliesData) {
          if (!grouped[rep.message_id]) grouped[rep.message_id] = [];
          grouped[rep.message_id].push(rep);
        }
        setReplies(grouped);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fetch latest quote for selected user
  useEffect(() => {
    if (!selectedUserId) return;
    const fetchQuote = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*, projects(name)')
        .eq('user_id', selectedUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      setLatestQuote(data || null);
    };
    fetchQuote();
  }, [selectedUserId]);

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
    if (error) setError('Failed to save reply.');
    setReplies(r => ({
      ...r,
      [id]: [...(r[id] || []), data],
    }));
    setSaving(s => ({ ...s, [id]: false }));
    setReplying(r => ({ ...r, [id]: '' }));
  };

  // Filter users by search
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Messages for selected user
  const userMessages = messages.filter(m => m.user_id === selectedUserId);

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <main className="flex-1 container py-16 max-w-6xl mx-auto flex gap-8">
        {/* Sidebar: User List */}
        <aside className="w-80 bg-[#181c20] rounded-xl p-4 border border-border/40 h-fit self-start">
          <h2 className="text-xl font-bold text-white mb-4">Users</h2>
          <Input
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {filteredUsers.length === 0 && <div className="text-gray-400">No users found.</div>}
            {filteredUsers.map(u => (
              <div
                key={u.id}
                className={`p-3 rounded cursor-pointer ${selectedUserId === u.id ? 'bg-blue-900/40 text-white' : 'bg-[#232323] text-gray-200'} hover:bg-blue-900/60`}
                onClick={() => setSelectedUserId(u.id)}
              >
                <div className="font-semibold">{u.name}</div>
                <div className="text-xs text-gray-400">{u.email}</div>
                <div className="text-xs text-gray-400">Messages: {u.count}</div>
              </div>
            ))}
          </div>
        </aside>
        {/* Main: Messages for selected user */}
        <section className="flex-1">
          <h1 className="text-3xl font-bold mb-8 text-white text-center">CEO: All User Messages</h1>
          {/* Show latest quote/project info */}
          {latestQuote && (
            <div className="mb-8 p-4 bg-[#181c20] rounded-xl border border-border/40">
              <div className="font-bold text-white mb-1">Latest Quote</div>
              <div className="text-gray-200 mb-1">Project: {latestQuote.projects?.name || 'N/A'}</div>
              <div className="text-gray-200 mb-1">Status: {latestQuote.status}</div>
              <div className="text-gray-200 mb-1">Budget: {latestQuote.budget}</div>
              <div className="text-gray-400 mb-2 text-xs">Submitted: {latestQuote.created_at && new Date(latestQuote.created_at).toLocaleString()}</div>
              
              {/* Show uploaded files/images */}
              {latestQuote.files && latestQuote.files.length > 0 && (
                <div className="mt-3">
                  <div className="text-gray-200 mb-2 text-sm font-medium">Uploaded Files:</div>
                  <div className="flex gap-2 flex-wrap">
                    {latestQuote.files.map((fileUrl: string, index: number) => {
                      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
                      return (
                        <div key={index} className="relative group">
                          {isImage ? (
                            <img
                              src={fileUrl}
                              alt={`File ${index + 1}`}
                              className="w-16 h-16 object-cover rounded border border-border/40 cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => window.open(fileUrl, '_blank')}
                              title="Click to view full size"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-700 rounded border border-border/40 flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {index + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {latestQuote.project_id && (
                <a
                  href={`/viewproject/${latestQuote.project_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  View Project
                </a>
              )}
            </div>
          )}
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : userMessages.length === 0 ? (
            <div className="text-gray-400">No messages for this user.</div>
          ) : (
            <div className="space-y-8">
              {userMessages.map(msg => (
                <Card key={msg.id} className="bg-background border-border/40">
                  <CardContent className="p-4">
                    <div className="mb-2 text-xs text-muted-foreground">{msg.created_at && new Date(msg.created_at).toLocaleString()}</div>
                    <div className="font-semibold mb-1">{msg.users?.name || 'Unknown User'}</div>
                    <div className="mb-1 text-sm">{msg.users?.email}</div>
                    <div className="mb-2 text-sm">
                      <span className="font-medium">Subject:</span> {msg.subject}
                    </div>
                    <div className="mb-2 text-sm">
                      <span className="font-medium">Message:</span> {msg.body}
                    </div>
                    {/* Show all replies for this message */}
                    {replies[msg.id] && replies[msg.id].length > 0 && (
                      <div className="mb-2">
                        <div className="font-bold text-green-400 mb-1">Conversation:</div>
                        <div className="space-y-2">
                          {replies[msg.id].map((rep: any) => (
                            <div key={rep.id} className="p-2 bg-green-900/30 border-l-4 border-green-400 rounded">
                              <div className="text-xs text-green-200 mb-1">{rep.users?.name || 'Admin'} • {new Date(rep.created_at).toLocaleString()}</div>
                              <div className="text-white">{rep.body}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replying[msg.id] ?? ''}
                        onChange={e => handleReplyChange(msg.id, e.target.value)}
                        className="mb-2 text-white"
                        rows={2}
                      />
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                        onClick={() => handleReplySave(msg.id)}
                        disabled={saving[msg.id] || !replying[msg.id]}
                      >
                        {saving[msg.id] ? 'Saving...' : 'Send Reply'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </section>
      </main>
      <Footer />
    </div>
  );
} 