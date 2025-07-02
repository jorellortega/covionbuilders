"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import Header from '@/components/header';
import Footer from '@/components/footer';

const STATUS_STEPS = [
  { key: 'deposit_status', label: 'Deposit' },
  { key: 'contract_status', label: 'Contract' },
  { key: 'schedule_status', label: 'Scheduling' },
  { key: 'work_status', label: 'Work' },
  { key: 'inspection_status', label: 'Inspection' },
  { key: 'final_payment_status', label: 'Final Payment' },
  { key: 'warranty_status', label: 'Warranty' },
];

const STATUS_LABELS: Record<string, Record<string, string>> = {
  deposit_status: {
    required: 'Deposit Required',
    waived: 'Deposit Waived',
    paid: 'Deposit Paid',
  },
  contract_status: {
    awaiting: 'Awaiting Signature',
    signed: 'Contract Signed',
  },
  schedule_status: {
    awaiting: 'Awaiting Scheduling',
    scheduled: 'Scheduled',
  },
  work_status: {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    completed: 'Completed',
  },
  inspection_status: {
    pending: 'Pending',
    passed: 'Passed',
  },
  final_payment_status: {
    pending: 'Pending',
    paid: 'Paid',
  },
  warranty_status: {
    active: 'Active',
    expired: 'Expired',
  },
};

export default function ProjectStatusPage() {
  const params = useParams();
  const id = params?.id as string;
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchQuote = async () => {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', id)
        .single();
      setQuote(data);
      setLoading(false);
    };
    fetchQuote();
  }, [id]);

  // Determine current step
  const currentStep = STATUS_STEPS.findIndex(
    step => !quote || !quote[step.key] || ["required", "awaiting", "not_started", "pending", "active"].includes(quote[step.key])
  );

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <main className="flex-1 container py-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">Project Status</h1>
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : !quote ? (
          <div className="text-red-500">Project not found.</div>
        ) : (
          <>
            {/* Visual Progress Bar */}
            <div className="w-full h-3 bg-gray-800 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${((currentStep + 1) / STATUS_STEPS.length) * 100}%` }}
              />
            </div>
            {/* Status Bar */}
            <div className="flex items-center justify-between mb-8">
              {STATUS_STEPS.map((step, idx) => {
                const isComplete = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2
                        ${isComplete ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'}`}
                    >
                      {idx + 1}
                    </div>
                    <div className={`text-xs text-center ${isCurrent ? 'text-blue-400 font-semibold' : isComplete ? 'text-emerald-400' : 'text-gray-400'}`}>{step.label}</div>
                  </div>
                );
              })}
            </div>
            {/* Step Details */}
            <div className="bg-[#181c20] rounded-xl p-6 border border-border/40 shadow space-y-6">
              {STATUS_STEPS.map((step, idx) => (
                <div key={step.key} className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${idx < currentStep ? 'bg-emerald-400' : idx === currentStep ? 'bg-blue-400' : 'bg-gray-500'}`}></div>
                  <div className="flex-1">
                    <div className="font-semibold text-white">{step.label}</div>
                    <div className="text-sm text-gray-300">
                      {quote[step.key] && STATUS_LABELS[step.key]?.[quote[step.key]]
                        ? STATUS_LABELS[step.key][quote[step.key]]
                        : 'Not started'}
                    </div>
                    {/* Show extra info for certain steps */}
                    {step.key === 'deposit_status' && quote.deposit_amount && (
                      <div className="text-xs text-gray-400">Amount: ${quote.deposit_amount}</div>
                    )}
                    {step.key === 'deposit_status' && quote.deposit_paid_at && (
                      <div className="text-xs text-gray-400">Paid at: {new Date(quote.deposit_paid_at).toLocaleString()}</div>
                    )}
                    {step.key === 'contract_status' && quote.contract_signed_at && (
                      <div className="text-xs text-gray-400">Signed at: {new Date(quote.contract_signed_at).toLocaleString()}</div>
                    )}
                    {step.key === 'schedule_status' && quote.scheduled_date && (
                      <div className="text-xs text-gray-400">Scheduled for: {new Date(quote.scheduled_date).toLocaleDateString()}</div>
                    )}
                    {step.key === 'schedule_status' && quote.key_received && (
                      <div className="text-xs text-gray-400">Key received</div>
                    )}
                    {step.key === 'work_status' && quote.work_started_at && (
                      <div className="text-xs text-gray-400">Started: {new Date(quote.work_started_at).toLocaleString()}</div>
                    )}
                    {step.key === 'work_status' && quote.work_completed_at && (
                      <div className="text-xs text-gray-400">Completed: {new Date(quote.work_completed_at).toLocaleString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Project Details */}
            <div className="mt-8 bg-[#23272e] rounded-xl p-6 border border-border/40 shadow">
              <div className="font-bold text-white mb-2">Project Details</div>
              <div className="text-gray-300 text-sm mb-1">Type: {quote.project_type}</div>
              <div className="text-gray-300 text-sm mb-1">Budget: {quote.budget}</div>
              <div className="text-gray-300 text-sm mb-1">Location: {quote.project_location}</div>
              <div className="text-gray-300 text-sm mb-1">Timeline: {quote.project_timeline}</div>
              <div className="text-gray-300 text-sm mb-1">Status: {quote.status}</div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
} 