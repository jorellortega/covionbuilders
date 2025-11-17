'use client';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Briefcase, User, CreditCard, PlusCircle, HelpCircle, Menu, BarChart2, Image, Users, DollarSign, Megaphone, Mail, AlertTriangle, Building2, Sparkles, Wrench, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ceoLinks = [
  { label: 'Update Placeholder Images', href: '/updatepix', icon: <Image className="h-5 w-5" /> },
  { label: 'Manage Projects', href: '/manageprojects', icon: <Briefcase className="h-5 w-5" /> },
  { label: 'Manage Services', href: '/servicesedit', icon: <Wrench className="h-5 w-5" /> },
  { label: 'Manage Service Pages', href: '/manage-service-pages', icon: <FileText className="h-5 w-5" /> },
  { label: 'Manage Users', href: '/users', icon: <Users className="h-5 w-5" /> },
  { label: 'Manage Payments', href: '/payments-invoices', icon: <DollarSign className="h-5 w-5" /> },
  { label: 'Marketing Tools', href: '/marketing', icon: <Megaphone className="h-5 w-5" /> },
  { label: 'View Communications', href: '/communications', icon: <Mail className="h-5 w-5" /> },
  { label: 'AI Settings', href: '/ai-settings', icon: <Sparkles className="h-5 w-5" /> },
  { label: 'AI Info Editor', href: '/ai-info', icon: <Sparkles className="h-5 w-5" /> },
];

export default function CeoDashboardPage() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState<{ [id: string]: string }>({});
  const [saving, setSaving] = useState<{ [id: string]: boolean }>({});
  const [error, setError] = useState('');
  const [staffQuoteId, setStaffQuoteId] = useState('');
  const [clientQuoteId, setClientQuoteId] = useState('');
  const [replies, setReplies] = useState<{ [messageId: string]: any[] }>({});
  const [newQuotesCount, setNewQuotesCount] = useState(0);
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [homepageProjectsVisible, setHomepageProjectsVisible] = useState(true);
  const [updatingVisibility, setUpdatingVisibility] = useState(false);
  const [homepageViewProjectsButtonVisible, setHomepageViewProjectsButtonVisible] = useState(true);
  const [updatingButtonVisibility, setUpdatingButtonVisibility] = useState(false);
  const [aboutPageVisible, setAboutPageVisible] = useState(true);
  const [updatingAboutVisibility, setUpdatingAboutVisibility] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('userMessages');
      if (stored) {
        const msgs = JSON.parse(stored);
        const unread = msgs.filter((msg: any) => msg.reply && !msg.read).length;
        setUnreadCount(unread);
      }
    }
  }, []);

  useEffect(() => {
    const fetchMessagesAndReplies = async () => {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      // Fetch messages with user info
      const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select('*, users(name, email)')
        .order('created_at', { ascending: false });
      if (msgError) setError('Failed to load messages.');
      setMessages(messagesData || []);
      // Fetch all replies
      const { data: repliesData, error: repError } = await supabase
        .from('message_replies')
        .select('*, users(name, email)')
        .order('created_at', { ascending: true });
      if (!repError && repliesData) {
        // Group replies by message_id
        const grouped: { [messageId: string]: any[] } = {};
        for (const rep of repliesData) {
          if (!grouped[rep.message_id]) grouped[rep.message_id] = [];
          grouped[rep.message_id].push(rep);
        }
        setReplies(grouped);
      }
      setLoading(false);
    };
    fetchMessagesAndReplies();
  }, []);

  useEffect(() => {
    // Fetch count of new (pending) quotes
    const fetchNewQuotes = async () => {
      const supabase = createSupabaseBrowserClient();
      const { count } = await supabase
        .from('quote_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
      setNewQuotesCount(count || 0);
    };
    fetchNewQuotes();
  }, []);

  useEffect(() => {
    // Fetch last 3 quotes (any status)
    const fetchRecentQuotes = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from('quote_requests')
        .select('id, created_at, project_id, user_id, status, project_type, budget, files')
        .order('created_at', { ascending: false })
        .limit(3);
      setRecentQuotes(data || []);
    };
    fetchRecentQuotes();
  }, []);

  useEffect(() => {
    // Fetch homepage projects visibility setting
    const fetchHomepageProjectsVisibility = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'homepage_projects_visible')
        .single();
      
      if (data) {
        setHomepageProjectsVisible(data.setting_value === 'true');
      }
    };
    fetchHomepageProjectsVisibility();
  }, []);

  useEffect(() => {
    // Fetch homepage "View Our Projects" button visibility setting
    const fetchHomepageViewProjectsButtonVisibility = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'homepage_view_projects_button_visible')
        .single();
      
      if (data) {
        setHomepageViewProjectsButtonVisible(data.setting_value === 'true');
      }
    };
    fetchHomepageViewProjectsButtonVisibility();
  }, []);

  useEffect(() => {
    // Fetch about page visibility setting
    const fetchAboutPageVisibility = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'about_page_visible')
        .single();
      
      if (data) {
        setAboutPageVisible(data.setting_value === 'true');
      }
    };
    fetchAboutPageVisibility();
  }, []);

  const toggleHomepageProjectsVisibility = async () => {
    setUpdatingVisibility(true);
    const supabase = createSupabaseBrowserClient();
    const newValue = !homepageProjectsVisible;
    
    const { error } = await supabase
      .from('site_settings')
      .update({ setting_value: newValue.toString() })
      .eq('setting_key', 'homepage_projects_visible');
    
    if (!error) {
      setHomepageProjectsVisible(newValue);
    }
    setUpdatingVisibility(false);
  };

  const toggleHomepageViewProjectsButtonVisibility = async () => {
    setUpdatingButtonVisibility(true);
    const supabase = createSupabaseBrowserClient();
    const newValue = !homepageViewProjectsButtonVisible;
    
    const { error } = await supabase
      .from('site_settings')
      .update({ setting_value: newValue.toString() })
      .eq('setting_key', 'homepage_view_projects_button_visible');
    
    if (!error) {
      setHomepageViewProjectsButtonVisible(newValue);
    }
    setUpdatingButtonVisibility(false);
  };

  const toggleAboutPageVisibility = async () => {
    setUpdatingAboutVisibility(true);
    const supabase = createSupabaseBrowserClient();
    const newValue = !aboutPageVisible;
    
    const { error } = await supabase
      .from('site_settings')
      .update({ setting_value: newValue.toString() })
      .eq('setting_key', 'about_page_visible');
    
    if (!error) {
      setAboutPageVisible(newValue);
    }
    setUpdatingAboutVisibility(false);
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
      .insert({ message_id: id, body: reply })
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

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-[#141414] border-r border-border/40 p-6 min-h-screen">
          <button
            className="mb-6 px-4 py-2 rounded-lg bg-[#232323] text-white font-semibold shadow hover:bg-blue-900/40 transition-colors"
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              router.push('/login');
            }}
          >
            Logout
          </button>
          <nav className="flex flex-col gap-2">
            {ceoLinks.map(link => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-blue-900/40 transition-all">
                {link.icon}
                <span className="font-semibold">{link.label}</span>
                {link.label === 'View Communications' && unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-400">{unreadCount} new</span>
                )}
              </Link>
            ))}
          </nav>
        </aside>
        {/* Mobile Sidebar Toggle */}
        <button className="md:hidden fixed top-4 left-4 z-50 bg-[#141414] p-2 rounded-full border border-border/40" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="h-6 w-6 text-white" />
        </button>
        {/* Mobile Sidebar Drawer */}
        {sidebarOpen && (
          <aside className="fixed inset-0 z-40 bg-black/70 flex">
            <div className="w-64 bg-[#141414] border-r border-border/40 p-6 min-h-screen flex flex-col">
              <button
                className="mb-6 px-4 py-2 rounded-lg bg-[#232323] text-white font-semibold shadow hover:bg-blue-900/40 transition-colors"
                onClick={() => {
                  localStorage.removeItem('isLoggedIn');
                  router.push('/login');
                }}
              >
                Logout
              </button>
              <nav className="flex flex-col gap-2">
                {ceoLinks.map(link => (
                  <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-blue-900/40 transition-all">
                    {link.icon}
                    <span className="font-semibold">{link.label}</span>
                    {link.label === 'View Communications' && unreadCount > 0 && (
                      <span className="ml-auto rounded-full bg-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-400">{unreadCount} new</span>
                    )}
                  </Link>
                ))}
              </nav>
              <button className="mt-8 text-white underline" onClick={() => setSidebarOpen(false)}>Close</button>
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </aside>
        )}
        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="mb-8 text-4xl font-bold text-white text-center">CEO Dashboard</h1>
          
          {/* Quick Actions - Prominent Create Quote Button */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-900/30 to-emerald-900/30 rounded-xl border border-blue-500/40">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Quick Actions</h2>
              <p className="text-muted-foreground mb-6">Most frequently used functions</p>
              <Link href="/create-quote">
                <Button className="bg-gradient-to-r from-emerald-600 to-blue-500 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:from-emerald-700 hover:to-blue-600 transition-all">
                  <Building2 className="mr-2 h-6 w-6" />
                  Create New Quote
                </Button>
              </Link>
            </div>
          </div>
          
          {/* New Quotes Alert */}
          {newQuotesCount > 0 && (
            <div className="mb-8 p-4 bg-[#181c20] border-l-4 border-blue-500 rounded-xl flex flex-col gap-3 shadow">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-blue-400 h-6 w-6" />
                  <span className="text-white font-semibold">{newQuotesCount} new quote request{newQuotesCount > 1 ? 's' : ''} submitted!</span>
                </div>
                <a
                  href="/allquotes"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded font-semibold shadow hover:from-blue-700 hover:to-emerald-600 transition-colors"
                >
                  View Quotes
                </a>
              </div>
              {/* Compact list of last 3 quotes */}
              <div className="mt-2">
                <div className="text-xs text-blue-300 font-semibold mb-1">Recent Submissions:</div>
                <ul className="space-y-2">
                  {recentQuotes.map(q => (
                    <li key={q.id} className="bg-[#23272e] rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <a href={`/quotes/${q.id}`} className="text-blue-400 hover:underline text-sm font-medium truncate max-w-[120px]">
                          {q.project_type || 'No Project'}
                        </a>
                        <span className="text-xs text-gray-300 truncate max-w-[80px]">{q.user_id}</span>
                        <span className="text-xs text-gray-400">{q.created_at && new Date(q.created_at).toLocaleString()}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${q.status === 'pending' ? 'bg-yellow-600 text-white' : q.status === 'approved' ? 'bg-emerald-700 text-white' : 'bg-gray-700 text-gray-200'}`}>{q.status}</span>
                      </div>
                      {/* Show uploaded files/images */}
                      {q.files && q.files.length > 0 && (
                        <div className="flex gap-1">
                          {q.files.slice(0, 3).map((fileUrl: string, index: number) => {
                            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
                            return (
                              <div key={index} className="relative group">
                                {isImage ? (
                                  <img
                                    src={fileUrl}
                                    alt={`File ${index + 1}`}
                                    className="w-8 h-8 object-cover rounded border border-border/40 cursor-pointer hover:scale-110 transition-transform"
                                    onClick={() => window.open(fileUrl, '_blank')}
                                    title="Click to view full size"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gray-700 rounded border border-border/40 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                )}
                                {index === 2 && q.files.length > 3 && (
                                  <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    +{q.files.length - 3}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-white">Total Projects</h2>
              <p className="text-3xl font-bold text-emerald-400">12</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-white">Total Users</h2>
              <p className="text-3xl font-bold text-emerald-400">45</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-white">Total Payments</h2>
              <p className="text-3xl font-bold text-emerald-400">$50,000</p>
            </div>
            <div className="rounded-xl border border-border/40 bg-gradient-to-r from-blue-900/60 to-emerald-900/40 shadow-lg p-6 flex flex-col justify-between">
              <div>
                <div className="text-2xl font-bold text-white mb-1">Messages</div>
                <div className="flex flex-wrap gap-4 items-center text-sm mb-2">
                  <span className="rounded-full bg-blue-900/40 px-3 py-1 text-xs font-medium text-blue-400">Unread</span>
                  {unreadCount > 0 && <span className="rounded-full bg-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-400">{unreadCount} new</span>}
                </div>
                <div className="text-muted-foreground text-lg">
                  {unreadCount > 0 ? `You have ${unreadCount} new message${unreadCount > 1 ? 's' : ''}.` : 'Send and view your messages and replies.'}
                </div>
              </div>
              <Link href="/messages/ceo" className="mt-4">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold px-8 py-3 text-lg shadow w-full">View Messages</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Homepage Projects</h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-muted-foreground">Hidden</span>
                <button
                  onClick={toggleHomepageProjectsVisibility}
                  disabled={updatingVisibility}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    homepageProjectsVisible ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      homepageProjectsVisible ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-muted-foreground">Visible</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {homepageProjectsVisible ? 'Featured projects section is currently visible on homepage' : 'Featured projects section is currently hidden from homepage'}
              </p>
              {updatingVisibility && (
                <div className="mt-2 text-blue-400 text-sm">Updating...</div>
              )}
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Homepage "View Our Projects" Button</h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-muted-foreground">Hidden</span>
                <button
                  onClick={toggleHomepageViewProjectsButtonVisibility}
                  disabled={updatingButtonVisibility}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    homepageViewProjectsButtonVisible ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      homepageViewProjectsButtonVisible ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs text-muted-foreground">Visible</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {homepageViewProjectsButtonVisible ? '"View Our Projects" button is currently visible on homepage' : '"View Our Projects" button is currently hidden from homepage'}
              </p>
              {updatingButtonVisibility && (
                <div className="mt-2 text-blue-400 text-sm">Updating...</div>
              )}
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg text-center">
              <h2 className="text-2xl font-bold text-white mb-4">About Us Page</h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-muted-foreground">Hidden</span>
                <button
                  onClick={toggleAboutPageVisibility}
                  disabled={updatingAboutVisibility}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    aboutPageVisible ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      aboutPageVisible ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs text-muted-foreground">Visible</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {aboutPageVisible ? 'About Us page is currently visible to visitors' : 'About Us page is currently hidden from visitors'}
              </p>
              {updatingAboutVisibility && (
                <div className="mt-2 text-blue-400 text-sm">Updating...</div>
              )}
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Update Placeholder Images</h2>
              <p className="mb-4 text-muted-foreground">Select a page and update placeholder images.</p>
              <Link href="/updatepix">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Go to Update Images</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Manage Projects</h2>
              <p className="mb-4 text-muted-foreground">View and manage all projects.</p>
              <Link href="/manageprojects">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Manage Projects</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Manage Users</h2>
              <p className="mb-4 text-muted-foreground">View and manage user accounts.</p>
              <Link href="/users">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Manage Users</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Manage Payments</h2>
              <p className="mb-4 text-muted-foreground">View and manage payment records, invoices, and paid receipts.</p>
              <Link href="/payments-invoices">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Manage Payments</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Marketing Tools</h2>
              <p className="mb-4 text-muted-foreground">Access marketing features like QR code generation and more.</p>
              <Link href="/marketing">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Go to Marketing</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">View Communications</h2>
              <p className="mb-4 text-muted-foreground">See all messages submitted from the contact page.</p>
              <Link href="/communications">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Go to Communications</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Edit Projects</h2>
              <p className="mb-4 text-muted-foreground">Edit, update, or remove projects from the portfolio.</p>
              <Link href="/projectsedit">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Edit Projects</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Manage Services</h2>
              <p className="mb-4 text-muted-foreground">Add, edit, or remove construction services.</p>
              <Link href="/servicesedit">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Manage Services</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">Contract Library</h2>
              <p className="mb-4 text-muted-foreground">Manage contract templates, upload contracts, and track signed agreements.</p>
              <Link href="/contracts">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Manage Contracts</Button>
              </Link>
            </div>
            <div className="rounded-xl border border-border/40 bg-[#141414] p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-bold text-white">AI Settings</h2>
              <p className="mb-4 text-muted-foreground">Configure API keys for AI services like OpenAI and Anthropic.</p>
              <Link href="/ai-settings">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Configure AI
                </Button>
              </Link>
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Quote Management</h2>
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <div className="flex gap-4">
                <Link href="/allquotes">
                  <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Go to All Quotes Dashboard</Button>
                </Link>
                <Link href="/create-quote">
                  <Button className="bg-gradient-to-r from-emerald-600 to-blue-500 text-white font-semibold">Create New Quote</Button>
                </Link>
              </div>
              <form onSubmit={e => { e.preventDefault(); if (staffQuoteId) router.push(`/quotes/${staffQuoteId}`); }} className="flex gap-2 items-center">
                <input type="text" placeholder="Quote ID" value={staffQuoteId || ''} onChange={e => setStaffQuoteId(e.target.value)} className="rounded-lg px-3 py-2 bg-[#232323] text-white border border-border/40" />
                <Button type="submit" className="bg-blue-600 text-white font-semibold">View as Staff</Button>
              </form>
              <form onSubmit={e => { e.preventDefault(); if (clientQuoteId) router.push(`/viewquote/${clientQuoteId}`); }} className="flex gap-2 items-center">
                <input type="text" placeholder="Quote ID" value={clientQuoteId || ''} onChange={e => setClientQuoteId(e.target.value)} className="rounded-lg px-3 py-2 bg-[#232323] text-white border border-border/40" />
                <Button type="submit" className="bg-emerald-600 text-white font-semibold">View as Client</Button>
              </form>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-3xl font-bold mb-4">Inbox: User Messages</h2>
            {loading ? (
              <div>Loading...</div>
            ) : messages.length === 0 ? (
              <div>No messages found.</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {messages.map((msg) => (
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
                          <div className="font-bold text-green-400 mb-1">Replies:</div>
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
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
} 