"use client";
import Header from '@/components/header';
import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, CheckCircle, Download, Building2 } from 'lucide-react';
import { generateReceiptPDF } from '@/lib/generateReceipt';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ quote, clientSecret }: { quote: any; clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || 'An error occurred');
        setProcessing(false);
        return;
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/pay/${quote.id}?success=true`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
      } else {
        // Payment succeeded - get the payment intent
        const paymentIntent = await stripe.retrievePaymentIntent(clientSecret);
        
        if (paymentIntent.paymentIntent?.status === 'succeeded') {
          setSuccess(true);
          
          // Confirm payment in our database
          try {
            const response = await fetch('/api/confirm-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentIntentId: paymentIntent.paymentIntent.id,
                quoteId: quote.id,
              }),
            });

            if (!response.ok) {
              console.error('Failed to confirm payment in database');
            }
          } catch (err) {
            console.error('Error confirming payment:', err);
          }

          // Redirect after 2 seconds
          setTimeout(() => {
            router.push(`/pay/${quote.id}?success=true`);
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground mb-6">Thank you for your payment. You will receive a confirmation email shortly.</p>
        <Button
          onClick={() => router.push('/')}
          className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
        >
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && (
        <div className="p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold"
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay ${Number(quote.estimated_price).toLocaleString()}
          </>
        )}
      </Button>
    </form>
  );
}

export default function PayQuotePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get('success') === 'true';
  
  let id = '';
  if (params && typeof params.id === 'string') id = params.id;
  else if (params && Array.isArray(params.id)) id = params.id[0];
  id = id.trim();
  
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuoteAndCreatePayment() {
      if (!id) return;
      setLoading(true);
      
      try {
        const supabase = (await import('@/lib/supabaseClient')).createSupabaseBrowserClient();
        const { data, error: quoteError } = await supabase
          .from('quote_requests')
          .select('*')
          .eq('id', id)
          .single();
        
        if (quoteError || !data) {
          setError('Quote not found.');
          setLoading(false);
          return;
        }

        setQuote(data);

        // Check if already paid
        if (data.final_payment_status === 'paid') {
          setError('This invoice has already been paid.');
          setLoading(false);
          return;
        }

        // Check if estimated_price exists
        if (!data.estimated_price) {
          setError('No amount due for this quote.');
          setLoading(false);
          return;
        }

        // Create payment intent
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quoteId: id,
            amount: Number(data.estimated_price),
            email: data.email,
            name: `${data.first_name} ${data.last_name}`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to initialize payment');
          setLoading(false);
          return;
        }

        const { clientSecret: secret } = await response.json();
        setClientSecret(secret);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchQuoteAndCreatePayment();
  }, [id]);

  const handleDownloadReceipt = () => {
    if (!quote) return;
    
    // Use the payment date from the quote if available, otherwise use current date
    const paymentDate = quote.updated_at && quote.final_payment_status === 'paid' 
      ? new Date(quote.updated_at) 
      : new Date();
    
    generateReceiptPDF({
      invoiceNumber: quote.id.slice(0, 8).toUpperCase(),
      customerName: `${quote.first_name} ${quote.last_name}`,
      customerEmail: quote.email,
      amount: Number(quote.estimated_price),
      projectDescription: quote.project_description || 'N/A',
      paymentDate: paymentDate,
      paymentMethod: 'Credit/Debit Card',
    });
  };

  if (success && quote) {
    const paymentDate = quote.updated_at && quote.final_payment_status === 'paid' 
      ? new Date(quote.updated_at) 
      : new Date();
    
    return (
      <div className="dark min-h-screen flex flex-col bg-black">
        <Header />
        <div className="container mx-auto py-12 px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Success Message Card */}
            <div className="bg-[#141414] p-8 rounded-xl border border-border/40 text-white shadow-lg">
              <div className="text-center py-4">
                <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your payment of ${Number(quote.estimated_price).toLocaleString()}. 
                  You will receive a confirmation email shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownloadReceipt}
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt
                  </Button>
                  <Button
                    onClick={() => router.push('/')}
                    variant="outline"
                    className="border-border/40 text-white hover:bg-[#1a1a1a]"
                  >
                    Return to Home
                  </Button>
                </div>
              </div>
            </div>

            {/* Receipt Card */}
            <div className="bg-[#141414] p-8 rounded-xl border border-border/40 text-white shadow-lg">
              <div className="mb-6 pb-4 border-b border-border/40">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="h-6 w-6 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">Covion Builders</h3>
                </div>
                <p className="text-sm text-muted-foreground">Modern Construction Solutions</p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-bold text-emerald-400 mb-4">PAYMENT RECEIPT</h4>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Invoice Number:</span>
                    <span className="font-semibold">{quote.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-semibold">
                      {paymentDate.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-semibold">
                      {paymentDate.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer Name:</span>
                    <span className="font-semibold">{quote.first_name} {quote.last_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer Email:</span>
                    <span className="font-semibold text-sm">{quote.email}</span>
                  </div>
                </div>

                <div className="my-6 pt-4 border-t border-border/40">
                  <h5 className="font-bold text-white mb-3">Project Details</h5>
                  <p className="text-muted-foreground">
                    {quote.project_description || 'N/A'}
                  </p>
                </div>

                <div className="my-6 pt-4 border-t border-border/40">
                  <h5 className="font-bold text-white mb-3">Payment Summary</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span className="text-2xl font-bold text-emerald-400">
                        ${Number(quote.estimated_price).toLocaleString('en-US', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-semibold">Credit/Debit Card</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-semibold text-emerald-400">Paid</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/40">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-semibold text-white">Covion Builders</p>
                  <p>covionbuilders@gmail.com</p>
                  <p>(951) 723-4052</p>
                  <p>Serving California</p>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-right">
                  This is a computer-generated receipt. No signature required.
                </p>
                <div className="mt-6 pt-4 border-t border-border/40">
                  <Button
                    onClick={handleDownloadReceipt}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Receipt PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen flex flex-col bg-black">
      <Header />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Pay for Your Project</h1>
        {loading ? (
          <div className="text-white text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading payment information...</p>
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto bg-[#141414] p-6 rounded-xl border border-border/40 text-white text-center">
            <div className="text-red-400 mb-4">{error}</div>
            <Button
              onClick={() => router.push('/payments')}
              className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
            >
              Back to Payments
            </Button>
          </div>
        ) : quote && clientSecret ? (
          <div className="max-w-xl mx-auto bg-[#141414] p-8 rounded-xl border border-border/40 text-white shadow-lg space-y-6">
            <div className="space-y-3 pb-6 border-b border-border/40">
              <div className="text-lg"><b>Name:</b> {quote.first_name} {quote.last_name}</div>
              <div className="text-lg"><b>Email:</b> {quote.email}</div>
              {quote.project_description && (
                <div className="text-lg"><b>Project:</b> {quote.project_description}</div>
              )}
              <div className="text-2xl font-bold text-emerald-400 pt-2">
                Amount Due: ${Number(quote.estimated_price).toLocaleString()}
              </div>
            </div>
            
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#10b981',
                    colorBackground: '#141414',
                    colorText: '#ffffff',
                    colorDanger: '#ef4444',
                    fontFamily: 'system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '8px',
                  },
                },
              }}
            >
              <CheckoutForm quote={quote} clientSecret={clientSecret} />
            </Elements>
          </div>
        ) : (
          <div className="bg-[#141414] p-6 rounded-xl border border-border/40 text-white text-center">
            Quote not found.
          </div>
        )}
      </div>
    </div>
  );
} 