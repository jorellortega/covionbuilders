'use client';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Briefcase, User, CreditCard, PlusCircle, HelpCircle, Menu, BarChart2, Image, Users, DollarSign, Megaphone, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import { Card, CardContent } from "@/components/ui/card"

const ceoLinks = [
  { label: 'Update Placeholder Images', href: '/updatepix', icon: <Image className="h-5 w-5" /> },
  { label: 'Manage Projects', href: '/manageprojects', icon: <Briefcase className="h-5 w-5" /> },
  { label: 'Manage Users', href: '/users', icon: <Users className="h-5 w-5" /> },
  { label: 'Manage Payments', href: '/payments', icon: <DollarSign className="h-5 w-5" /> },
  { label: 'Marketing Tools', href: '/marketing', icon: <Megaphone className="h-5 w-5" /> },
  { label: 'View Communications', href: '/communications', icon: <Mail className="h-5 w-5" /> },
];

export default function CeoDashboardPage() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [staffQuoteId, setStaffQuoteId] = useState('');
  const [clientQuoteId, setClientQuoteId] = useState('');

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
    const fetchMessages = async () => {
      setLoading(true)
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false })
      setMessages(data || [])
      setLoading(false)
    }
    fetchMessages()
  }, [])

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
              <Link href="/messages" className="mt-4">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold px-8 py-3 text-lg shadow w-full">View Messages</Button>
              </Link>
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
              <p className="mb-4 text-muted-foreground">View and manage payment records.</p>
              <Link href="/payments">
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
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Quote Management</h2>
            <div className="flex flex-wrap gap-4 items-center mb-4">
              <Link href="/allquotes">
                <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold">Go to All Quotes Dashboard</Button>
              </Link>
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
            <h2 className="text-3xl font-bold mb-4">Inbox: Contact & Quote Messages</h2>
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
                      <div className="font-semibold mb-1">{msg.first_name} {msg.last_name}</div>
                      <div className="mb-1 text-sm">{msg.email} {msg.phone && <>| {msg.phone}</>}</div>
                      <div className="mb-2 text-sm">
                        <span className="font-medium">Type:</span> {msg.request_type || 'quote'}
                      </div>
                      <div className="mb-2 text-sm">
                        <span className="font-medium">Message:</span> {msg.project_description || msg.additional_comments || <span className="italic text-muted-foreground">(No message)</span>}
                      </div>
                      {msg.reply && (
                        <div className="mb-2 text-green-500 text-sm">
                          <span className="font-medium">Reply:</span> {msg.reply}
                        </div>
                      )}
                      <Button asChild className="w-full mt-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
                        <Link href={`/reply/${msg.id}`}>View & Reply</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
} 