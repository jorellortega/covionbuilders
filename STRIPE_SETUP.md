# Stripe Payment Integration Setup

## Overview
Stripe has been integrated into the payment system to allow clients to pay for their invoices securely.

## Environment Variables Required

Add these environment variables to your `.env.local` file:

```env
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe Secret Key (starts with sk_test_ for test mode, sk_live_ for production)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe Publishable Key (starts with pk_test_ for test mode, pk_live_ for production)
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret (for local development, get from Stripe CLI)
```

## Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** > **API keys**
3. Copy your **Publishable key** and **Secret key**
4. For testing, use the **Test mode** keys (they start with `pk_test_` and `sk_test_`)
5. For production, use the **Live mode** keys (they start with `pk_live_` and `sk_live_`)

## Features Implemented

### ✅ Payment Processing
- Stripe Payment Intents API integration
- Secure payment form using Stripe Elements
- Real-time payment processing
- Automatic receipt emails

### ✅ API Routes
- `/api/create-payment-intent` - Creates a payment intent for a quote
- `/api/confirm-payment` - Confirms payment and updates database
- `/api/webhook` - Handles Stripe webhook events (payment confirmations)

### ✅ Payment Pages
- `/payments` - Search for invoices by name, email, or invoice number
- `/pay/[id]` - Payment page with Stripe checkout form

### ✅ Database Integration
- Updates `final_payment_status` to 'paid' after successful payment
- Stores payment metadata in Stripe

## How It Works

1. Client searches for their invoice on `/payments`
2. Client clicks "Pay Now" on their invoice
3. System creates a Stripe Payment Intent via API
4. Client enters payment details using Stripe Elements
5. Payment is processed securely through Stripe
6. Database is updated with payment status
7. Client receives confirmation email from Stripe

## Local Webhook Listener Setup

For local development, you can use the Stripe CLI to forward webhook events to your local server.

### Prerequisites

1. Install the Stripe CLI:
   - macOS: `brew install stripe/stripe-cli/stripe`
   - Windows: Download from [Stripe CLI releases](https://github.com/stripe/stripe-cli/releases)
   - Linux: See [Stripe CLI installation guide](https://stripe.com/docs/stripe-cli)

### Setup Steps

1. **Log in to Stripe CLI:**
   ```bash
   stripe login
   ```
   This will open your browser to authenticate with your Stripe account.

2. **Forward events to your local webhook endpoint:**
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   
   This will:
   - Start listening for events in your Stripe account
   - Forward them to `http://localhost:3000/api/webhook`
   - Display a webhook signing secret (starts with `whsec_`)

3. **Copy the webhook signing secret:**
   - The CLI will output something like: `Ready! Your webhook signing secret is whsec_...`
   - Copy this secret and add it to your `.env.local`:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_...
     ```
   - Restart your Next.js dev server after adding the secret

4. **Test the webhook (optional):**
   ```bash
   stripe trigger payment_intent.succeeded
   ```
   This will trigger a test payment event to verify your webhook is working.

### How It Works

- When a payment succeeds, Stripe sends a webhook event to your endpoint
- The webhook endpoint verifies the event signature using the webhook secret
- If valid, it automatically updates the database with the payment status
- This ensures your database stays in sync even if the client-side confirmation fails

## Testing

### Test Cards (Test Mode Only)

Use these test card numbers in Stripe test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any:
- Future expiration date (e.g., 12/34)
- Any 3-digit CVC
- Any ZIP code

### Testing Flow

1. Make sure you're using test mode keys
2. Search for an invoice with `estimated_price` set
3. Click "Pay Now"
4. Use test card `4242 4242 4242 4242`
5. Complete the payment
6. Verify the invoice status is updated in the database

## Security Notes

- Never commit your Stripe secret keys to version control
- Always use environment variables for sensitive keys
- The secret key is only used server-side in API routes
- The publishable key is safe to expose in client-side code
- All payment processing happens securely through Stripe's servers

## Production Checklist

Before going live:

- [ ] Switch to live mode Stripe keys
- [ ] Update environment variables in production
- [ ] Test with real payment methods
- [ ] Set up webhook endpoints for payment events (optional)
- [ ] Configure email receipts in Stripe dashboard
- [ ] Review Stripe's security best practices

## Troubleshooting

### Payment form not loading
- Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
- Verify the key starts with `pk_test_` or `pk_live_`

### Payment intent creation fails
- Check that `STRIPE_SECRET_KEY` is set correctly
- Verify the key starts with `sk_test_` or `sk_live_`
- Check server logs for detailed error messages

### Payment succeeds but database not updated
- Check API route logs
- Verify Supabase connection
- Check that `final_payment_status` column exists in `quote_requests` table

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Elements](https://stripe.com/docs/stripe-js/react)
- [Payment Intents API](https://stripe.com/docs/payments/payment-intents)

