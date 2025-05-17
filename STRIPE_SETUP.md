# Stripe Integration Setup for Smart Cart

This guide explains how to set up Stripe integration for the Smart Cart checkout process.

## Prerequisites

1. A Stripe account. You can sign up at [stripe.com](https://stripe.com)
2. Your Stripe API keys from the Stripe Dashboard

## Environment Variables

Add these variables to your `.env` file:

```
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_test_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, use:
```
STRIPE_SECRET_KEY=sk_live_your_live_key_here
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

## How the Stripe Integration Works

Smart Cart uses Stripe Checkout Sessions for payment processing:

1. The user adds items to their cart and provides shipping details
2. We create a Stripe Checkout Session with the cart items and a 20% shipping fee
3. The user is redirected to Stripe's hosted checkout page to complete payment
4. On successful payment, Stripe redirects back to our success URL
5. We verify the payment with Stripe and create the order in our database

## Webhook Setup (Optional but Recommended)

For additional security and reliability, set up Stripe webhooks:

1. In your Stripe Dashboard, go to Developers > Webhooks
2. Add an endpoint with your URL: `https://your-domain.com/api/webhooks/stripe`
3. Select the following events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Add the webhook secret to your environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

## Testing

1. Use Stripe test cards for testing:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - See [Stripe testing docs](https://stripe.com/docs/testing) for more test cards

2. Verify that orders are created in your database after successful payments

## Troubleshooting

1. Check Stripe Dashboard > Events for detailed logs of payment attempts
2. Ensure your success and cancel URLs are correctly formatted
3. For webhook issues, use the Stripe CLI to test locally:
   ```
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ``` 