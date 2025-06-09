"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, CreditCard, CheckCircle, AlertTriangle, User, PlusCircle, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane.doe@email.com',
};

const mockProjects = [
  {
    name: 'Riverside Apartments',
    status: 'In Progress',
    payment: 'Paid',
    due: '2024-08-15',
    progress: 60,
  },
  {
    name: 'Tech Innovation Hub',
    status: 'Completed',
    payment: 'Paid',
    due: '2024-05-01',
    progress: 100,
  },
  {
    name: 'Sunset Plaza',
    status: 'In Progress',
    payment: 'Unpaid',
    due: '2024-09-10',
    progress: 30,
  },
];

const mockPayments = [
  { date: '2024-06-01', project: 'Riverside Apartments', amount: '$50,000', status: 'Completed' },
  { date: '2024-05-10', project: 'Tech Innovation Hub', amount: '$120,000', status: 'Completed' },
  { date: '2024-04-20', project: 'Sunset Plaza', amount: '$10,000', status: 'Pending' },
];

const stats = [
  {
    label: 'Active Projects',
    value: mockProjects.filter(p => p.status === 'In Progress').length,
    icon: <Briefcase className="h-6 w-6 text-blue-400" />,
  },
  {
    label: 'Pending Payments',
    value: mockProjects.filter(p => p.payment === 'Unpaid').length,
    icon: <AlertTriangle className="h-6 w-6 text-yellow-400" />,
  },
  {
    label: 'Total Paid',
    value: '$' + mockPayments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + Number(p.amount.replace(/[^\d]/g, '')), 0).toLocaleString(),
    icon: <CreditCard className="h-6 w-6 text-emerald-400" />,
  },
];

export default function DashboardPage() {
  const activeProjects = mockProjects.filter(p => p.status === 'In Progress');
  const [selectedActive, setSelectedActive] = useState(activeProjects[0]?.name || '');
  const selectedProject = activeProjects.find(p => p.name === selectedActive) || activeProjects[0];

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="py-10 md:py-16 flex-1">
        <div className="container mx-auto max-w-3xl flex flex-col gap-8">
          {/* Main Dashboard Content (single column) */}
          {/* Welcome Card at the very top */}
          <div className="rounded-xl border border-border/40 bg-gradient-to-br from-blue-900/30 to-emerald-900/20 p-8 flex flex-col md:flex-row md:items-center md:justify-between mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {mockUser.name}!</h1>
              <p className="text-muted-foreground text-lg">Here's your latest project and payment activity.</p>
            </div>
          </div>
          {/* Active Project Status Bar directly below welcome card */}
          {activeProjects.length > 0 && (
            <div className="rounded-xl border border-border/40 bg-gradient-to-r from-blue-900/40 to-emerald-900/30 p-6 mb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
                {activeProjects.length > 1 && (
                  <select
                    value={selectedActive}
                    onChange={e => setSelectedActive(e.target.value)}
                    className="rounded-md border border-border/40 bg-black/30 p-2 text-white mb-2 md:mb-0"
                  >
                    {activeProjects.map((p) => (
                      <option key={p.name} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                )}
                <div className="flex-1">
                  <div className="text-lg font-bold text-white mb-1">{selectedProject.name}</div>
                  <div className="flex flex-wrap gap-4 items-center text-sm mb-2">
                    <span className="rounded-full bg-blue-900/40 px-3 py-1 text-xs font-medium text-blue-400">{selectedProject.status}</span>
                    <span className={selectedProject.payment === 'Paid' ? 'rounded-full bg-emerald-900/40 px-3 py-1 text-xs font-medium text-emerald-400' : 'rounded-full bg-yellow-900/40 px-3 py-1 text-xs font-medium text-yellow-400'}>{selectedProject.payment}</span>
                    <span className="rounded-full bg-background/20 px-3 py-1 text-xs font-medium text-muted-foreground">Due: {selectedProject.due}</span>
                  </div>
                  <div className="w-full bg-background/30 rounded h-3 overflow-hidden">
                    <div
                      className="h-3 rounded bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${selectedProject.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Project Progress: {selectedProject.progress}%</div>
                </div>
              </div>
            </div>
          )}
          {/* Quick Stats below status bar */}
          <div className="rounded-xl border border-border/40 bg-[#141414] p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="flex flex-col gap-4">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {stat.icon}
                  <div>
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-muted-foreground text-xs">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Make a Payment Card */}
          <div className="rounded-xl border border-blue-600 bg-gradient-to-r from-blue-900/60 to-emerald-900/40 p-8 flex flex-col items-center text-center shadow-lg">
            <h3 className="text-2xl font-bold text-white mb-2">Make a Payment</h3>
            <p className="text-muted-foreground mb-6">Pay outstanding balances securely and instantly.</p>
            <Link href="/payment">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold px-8 py-3 text-lg shadow">
                Go to Payment
              </Button>
            </Link>
          </div>

          {/* Projects Overview */}
          <div className="rounded-xl border border-border/40 bg-[#141414] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">My Projects</h2>
              <Link href="/projects">
                <Button variant="outline" className="font-semibold">View All</Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b border-border/40">
                    <th className="py-2 px-4">Project</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Payment</th>
                    <th className="py-2 px-4">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {mockProjects.map((proj, idx) => (
                    <tr key={idx} className="border-b border-border/20 hover:bg-black/10">
                      <td className="py-2 px-4 text-white font-medium">{proj.name}</td>
                      <td className="py-2 px-4">
                        <span className={
                          proj.status === 'Completed'
                            ? 'inline-flex items-center gap-1 text-emerald-400'
                            : proj.status === 'In Progress'
                            ? 'inline-flex items-center gap-1 text-blue-400'
                            : 'inline-flex items-center gap-1 text-yellow-400'
                        }>
                          {proj.status === 'Completed' && <CheckCircle className="h-4 w-4" />}
                          {proj.status === 'In Progress' && <Briefcase className="h-4 w-4" />}
                          {proj.status === 'Pending' && <AlertTriangle className="h-4 w-4" />}
                          {proj.status}
                        </span>
                      </td>
                      <td className={
                        proj.payment === 'Paid' ? 'py-2 px-4 text-emerald-400' : 'py-2 px-4 text-red-400'
                      }>{proj.payment}</td>
                      <td className="py-2 px-4 text-muted-foreground">{proj.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments Widget */}
          <div className="rounded-xl border border-border/40 bg-[#141414] p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-white">Recent Payments</h2>
              <Link href="/payments">
                <Button variant="outline" className="font-semibold">View All</Button>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-muted-foreground border-b border-border/40">
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Project</th>
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPayments.map((pay, idx) => (
                    <tr key={idx} className="border-b border-border/20 hover:bg-black/10">
                      <td className="py-2 px-4 text-white">{pay.date}</td>
                      <td className="py-2 px-4 text-white">{pay.project}</td>
                      <td className="py-2 px-4 text-emerald-400">{pay.amount}</td>
                      <td className={
                        pay.status === 'Completed' ? 'py-2 px-4 text-emerald-400' : 'py-2 px-4 text-yellow-400'
                      }>{pay.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 