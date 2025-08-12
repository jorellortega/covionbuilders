"use client";
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreditCard, DollarSign, CheckCircle, AlertTriangle, Clock, Download, Eye } from 'lucide-react';
import { useState } from 'react';

const mockPayments = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    project: 'Riverside Apartments',
    amount: 50000,
    status: 'Paid',
    dueDate: '2024-08-15',
    paidDate: '2024-08-10',
    description: 'Foundation and structural work - Phase 1',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    project: 'Tech Innovation Hub',
    amount: 120000,
    status: 'Paid',
    dueDate: '2024-05-01',
    paidDate: '2024-04-28',
    description: 'Complete project payment - Final invoice',
    paymentMethod: 'Credit Card'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-003',
    project: 'Sunset Plaza Retail Center',
    amount: 25000,
    status: 'Pending',
    dueDate: '2024-09-20',
    paidDate: null,
    description: 'Site preparation and permits - Initial payment',
    paymentMethod: null
  },
  {
    id: 4,
    invoiceNumber: 'INV-2024-004',
    project: 'Heritage Home Renovation',
    amount: 35000,
    status: 'Overdue',
    dueDate: '2024-07-15',
    paidDate: null,
    description: 'Structural repairs and foundation work',
    paymentMethod: null
  },
  {
    id: 5,
    invoiceNumber: 'INV-2024-005',
    project: 'Riverside Apartments',
    amount: 75000,
    status: 'Upcoming',
    dueDate: '2024-10-01',
    paidDate: null,
    description: 'Framing and electrical - Phase 2',
    paymentMethod: null
  }
];

export default function PaymentsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredPayments = selectedStatus === 'all' 
    ? mockPayments 
    : mockPayments.filter(payment => payment.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-900/40 text-emerald-400';
      case 'Pending': return 'bg-yellow-900/40 text-yellow-400';
      case 'Overdue': return 'bg-red-900/40 text-red-400';
      case 'Upcoming': return 'bg-blue-900/40 text-blue-400';
      default: return 'bg-gray-900/40 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="h-4 w-4" />;
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'Upcoming': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const totalPaid = mockPayments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = mockPayments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = mockPayments.filter(p => p.status === 'Overdue').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <div className="container mx-auto py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Payments & Invoices</h1>
            <p className="text-muted-foreground">Manage your project payments and view invoice history</p>
          </div>
          <Link href="/payment">
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              Make Payment
            </Button>
          </Link>
        </div>

        {/* Payment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{mockPayments.length}</div>
                <div className="text-muted-foreground text-sm">Total Invoices</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
              <div>
                <div className="text-2xl font-bold text-white">${totalPaid.toLocaleString()}</div>
                <div className="text-muted-foreground text-sm">Total Paid</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">${totalPending.toLocaleString()}</div>
                <div className="text-muted-foreground text-sm">Pending</div>
              </div>
            </div>
          </div>
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-white">${totalOverdue.toLocaleString()}</div>
                <div className="text-muted-foreground text-sm">Overdue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {['all', 'Paid', 'Pending', 'Overdue', 'Upcoming'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#232323] text-muted-foreground hover:text-white'
              }`}
            >
              {status === 'all' ? 'All Payments' : status}
            </button>
          ))}
        </div>

        {/* Payments Table */}
        <div className="bg-[#141414] rounded-xl border border-border/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Invoice</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Project</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Due Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border/20 hover:bg-black/10">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{payment.invoiceNumber}</div>
                      <div className="text-sm text-muted-foreground">{payment.description}</div>
                    </td>
                    <td className="px-6 py-4 text-white">{payment.project}</td>
                    <td className="px-6 py-4 text-white font-medium">${payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{payment.dueDate}</div>
                      {payment.paidDate && (
                        <div className="text-sm text-emerald-400">Paid: {payment.paidDate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        {payment.status === 'Pending' && (
                          <Link href="/payment">
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                              Pay Now
                            </Button>
                          </Link>
                        )}
                        {payment.status === 'Overdue' && (
                          <Link href="/payment">
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              Pay Overdue
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No payments found with the selected status.</div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="mt-8 bg-[#141414] p-6 rounded-xl border border-border/40">
          <h3 className="text-xl font-bold text-white mb-4">Payment Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border/40 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="h-6 w-6 text-blue-400" />
                <span className="text-white font-medium">Credit Card</span>
              </div>
              <p className="text-sm text-muted-foreground">Visa, Mastercard, American Express</p>
            </div>
            <div className="p-4 border border-border/40 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-6 w-6 text-emerald-400" />
                <span className="text-white font-medium">Bank Transfer</span>
              </div>
              <p className="text-sm text-muted-foreground">Direct deposit to our business account</p>
            </div>
            <div className="p-4 border border-border/40 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-6 w-6 text-purple-400" />
                <span className="text-white font-medium">Check</span>
              </div>
              <p className="text-sm text-muted-foreground">Mail check to our office address</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 