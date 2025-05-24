const express = require('express');
const router = express.Router();
const { stripe, PRO_PLAN_PRICE_ID, getOrCreateStripeCustomer, SIGNATURE_PACK_PRICE_IDS, SIGNATURE_PACK_CREDITS } = require('../services/stripeService');
const { createClient } = require('@supabase/supabase-js');

// Supabase client (ensure these are set in your .env for the backend)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Using anon key for server-side can be okay if RLS is strong.
                                                    // Consider using a service role key if more privileged access is needed here.
                                                    // For user-specific actions, typically the user's JWT is passed and Supabase client uses that.
                                                    // However, for creating subscriptions/payments, we often need the user's ID from an authenticated session.

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for stripe routes. Please check your .env file.');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Middleware to simulate user authentication (replace with actual auth middleware)
// This is a placeholder. In a real app, you'd have middleware that verifies JWT
// and attaches user information (like user_id and email) to req.user.
const authenticateUser = (req, res, next) => {
  // For demonstration, we'll expect 'x-user-id' and 'x-user-email' headers.
  // In a real app, this would come from a decoded JWT token.
  const userId = req.headers['x-user-id'];
  const userEmail = req.headers['x-user-email'];

  if (!userId || !userEmail) {
    return res.status(401).json({ error: 'User not authenticated. Missing x-user-id or x-user-email header.' });
  }
  req.user = { id: userId, email: userEmail };
  next();
};


// Create Subscription Checkout Session (Pro Plan)
router.post('/create-subscription', authenticateUser, async (req, res) => {
  const { priceId } = req.body; // priceId for the subscription (e.g., PRO_PLAN_PRICE_ID)
  const userId = req.user.id;
  const userEmail = req.user.email;

  if (!priceId) {
    return res.status(400).json({ error: 'Price ID is required.' });
  }

  // For subscriptions, it's good practice to ensure it's a known subscription price ID
  if (priceId !== PRO_PLAN_PRICE_ID) {
    // This check can be more sophisticated, e.g., fetching valid plan IDs from Stripe or DB
    return res.status(400).json({ error: 'Invalid Price ID for subscription.' });
  }

  try {
    const stripeCustomerId = await getOrCreateStripeCustomer(userId, userEmail, supabase);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Crucial: metadata to link this session and subsequent webhook events to your user and plan
      metadata: {
        supabase_user_id: userId,
        stripe_price_id: priceId,
        // Add any other relevant info, e.g., plan_type: 'pro_monthly'
      },
      // Define success and cancel URLs - these should be frontend routes
      // The frontend will handle the actual success/failure display based on these.
      // Stripe will append session_id={CHECKOUT_SESSION_ID} to the success_url.
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=subscription`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`, // Or specific subscription page
    });

    res.json({ sessionId: session.id });

  } catch (error) {
    console.error('Error creating subscription checkout session:', error);
    res.status(500).json({ error: `Failed to create subscription session: ${error.message}` });
  }
});

// Create Checkout Session for One-Time Signature Pack Purchase
router.post('/create-checkout-session-for-packs', authenticateUser, async (req, res) => {
  const { priceId, quantity = 1 } = req.body; // priceId for the signature pack
  const userId = req.user.id;
  const userEmail = req.user.email;

  if (!priceId) {
    return res.status(400).json({ error: 'Price ID for the signature pack is required.' });
  }

  // Validate if the priceId is a known signature pack price ID
  if (!Object.values(SIGNATURE_PACK_PRICE_IDS).includes(priceId)) {
    return res.status(400).json({ error: 'Invalid Price ID for signature pack.' });
  }

  const creditsToPurchase = SIGNATURE_PACK_CREDITS[priceId];
  if (!creditsToPurchase) {
    return res.status(400).json({ error: 'Credit amount not defined for this price ID.' });
  }

  try {
    const stripeCustomerId = await getOrCreateStripeCustomer(userId, userEmail, supabase);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment', // 'payment' mode for one-time purchases
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: parseInt(quantity, 10) || 1,
        },
      ],
      metadata: {
        supabase_user_id: userId,
        stripe_price_id: priceId, // Store the Stripe Price ID
        credits_purchased: creditsToPurchase.toString(), // Ensure it's a string for metadata
        purchase_type: 'signature_pack', // Differentiate from subscription
      },
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=signature_pack`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`, // Or a specific credits purchase page
    });

    res.json({ sessionId: session.id });

  } catch (error) {
    console.error('Error creating signature pack checkout session:', error);
    res.status(500).json({ error: `Failed to create signature pack session: ${error.message}` });
  }
});

// Stripe Webhook Handler
// Use `express.raw({ type: 'application/json' })` for the webhook route specifically,
// as Stripe sends the payload as a raw JSON body.
// This needs to be configured in index.js where routes are mounted.
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe Webhook Secret is not configured.');
    return res.status(500).send('Webhook secret not configured.');
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  console.log(`Received Stripe event: ${event.type}`, event.data.object);

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const userId = session.metadata.supabase_user_id;
      const purchaseType = session.metadata.purchase_type; // 'subscription' or 'signature_pack'
      const stripePriceId = session.metadata.stripe_price_id;

      if (!userId) {
        console.error('Webhook Error: supabase_user_id missing from checkout session metadata.');
        return res.status(400).json({ error: 'User ID missing in webhook metadata.' });
      }
      
      console.log(`Processing checkout.session.completed for user ${userId}, type: ${purchaseType || 'N/A'}, session ID: ${session.id}`);

      if (session.payment_status === 'paid') {
        if (session.mode === 'subscription') {
          // Subscription purchase
          const stripeSubscriptionId = session.subscription; // Stripe Subscription ID
          const stripeCustomerId = session.customer; // Stripe Customer ID

          // Retrieve subscription details to get current period
          const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

          const { error: subError } = await supabase
            .from('subscriptions')
            .upsert({
              // id: generated by db, or use a specific UUID if you have one
              user_id: userId,
              stripe_subscription_id: stripeSubscriptionId,
              plan_name: stripePriceId === PRO_PLAN_PRICE_ID ? 'Pro' : 'Unknown Plan', // Enhance if more plans
              status: subscription.status, // e.g., 'active'
              current_period_start: new Date(subscription.current_period_start * 1000),
              current_period_end: new Date(subscription.current_period_end * 1000),
              // updated_at will be set by db trigger
            }, {
              onConflict: 'stripe_subscription_id', // Upsert based on stripe_subscription_id
            });

          if (subError) {
            console.error(`Supabase error updating subscription for user ${userId}: ${subError.message}`);
            // Don't return 500 to Stripe, as that might cause retries for a db issue.
            // Log and monitor.
          } else {
            console.log(`Subscription created/updated for user ${userId}, subscription ID ${stripeSubscriptionId}`);
          }
        } else if (session.mode === 'payment' && purchaseType === 'signature_pack') {
          // Signature pack purchase
          const creditsPurchased = parseInt(session.metadata.credits_purchased, 10);

          if (isNaN(creditsPurchased) || creditsPurchased <= 0) {
            console.error(`Webhook Error: Invalid credits_purchased value in metadata for user ${userId}.`);
            return res.status(400).json({ error: 'Invalid credits purchased value.' });
          }

          // Update user's credit balance
          // This should ideally be a transaction or an RPC call to ensure atomicity
          const { data: currentCredits, error: fetchError } = await supabase
            .from('signature_credits')
            .select('balance')
            .eq('user_id', userId)
            .single();

          if (fetchError) {
            console.error(`Supabase error fetching credits for user ${userId}: ${fetchError.message}`);
            return res.status(500).json({ error: 'Failed to fetch current credits.' }); // Internal error
          }

          const newBalance = (currentCredits ? currentCredits.balance : 0) + creditsPurchased;

          // Start a transaction if your Supabase client/pg driver supports it easily,
          // otherwise, ensure monitoring for failures between these two operations.
          const { error: updateError } = await supabase
            .from('signature_credits')
            .update({
              balance: newBalance,
              last_purchased_at: new Date(),
              // updated_at handled by trigger
            })
            .eq('user_id', userId);

          if (updateError) {
            console.error(`Supabase error updating credits for user ${userId}: ${updateError.message}`);
            // If this fails, we might not want to record the purchase, or mark it as problematic.
          } else {
            console.log(`Signature credits updated for user ${userId}. New balance: ${newBalance}`);
            
            // Log the credit purchase in credit_purchases table
            const { error: purchaseLogError } = await supabase
              .from('credit_purchases')
              .insert({
                user_id: userId,
                credits_purchased: creditsPurchased,
                amount_paid: session.amount_total, // amount_total from session is in cents
                currency: session.currency.toLowerCase(),
                stripe_charge_id: session.payment_intent, // payment_intent is the charge ID
                description: `Purchase of ${creditsPurchased} Signature Credits`,
                // purchase_date and created_at handled by DB default
              });

            if (purchaseLogError) {
              console.error(`Supabase error logging credit purchase for user ${userId}: ${purchaseLogError.message}`);
              // This is a logging failure, credit update was successful. Monitor this.
            } else {
              console.log(`Credit purchase logged for user ${userId}, charge ID ${session.payment_intent}`);
            }
          }
        } else if (session.mode === 'payment' && purchaseType === 'package_payment_by_signer') {
          // Payment made by a signer for a package
          const packageId = session.metadata.package_id;
          if (!packageId) {
            console.error('Webhook Error: package_id missing from checkout session metadata for signer payment.');
            return res.status(400).json({ error: 'Package ID missing in webhook metadata for signer payment.' });
          }
          // Create a record in the payments table
          const { error: paymentError } = await supabase
            .from('payments')
            .insert({
              package_id: packageId,
              stripe_charge_id: session.payment_intent, // payment_intent is the charge ID for checkout sessions in payment mode
              amount: session.amount_total, // amount_total from session is in cents
              currency: session.currency.toLowerCase(),
              status: 'succeeded', // Since checkout.session.completed and payment_status === 'paid'
              // created_at is handled by DB default
            });

          if (paymentError) {
            console.error(`Supabase error creating payment record for package ${packageId}: ${paymentError.message}`);
          } else {
            console.log(`Payment record created for package ${packageId}, charge ID ${session.payment_intent}`);
            // Update overall package status
            const { updatePackageOverallStatus } = require('../services/packageService');
            try {
              await updatePackageOverallStatus(packageId);
            } catch (statusUpdateError) {
              console.error(`Error updating overall package status after payment for ${packageId}:`, statusUpdateError);
            }
          }
        }
      }
      break;

    case 'invoice.payment_succeeded':
      // For recurring subscription payments
      const invoice = event.data.object;
      const stripeSubscriptionId = invoice.subscription; // Stripe Subscription ID
      
      if (invoice.billing_reason === 'subscription_cycle' || invoice.billing_reason === 'subscription_create') {
          if (!stripeSubscriptionId) {
              console.log('Webhook: invoice.payment_succeeded with no subscription ID (e.g. one-time payment invoice). Skipping subscription update.');
              break;
          }
        const subscriptionDetails = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        
        const { error: subUpdateError } = await supabase
          .from('subscriptions')
          .update({
            status: subscriptionDetails.status, // Should be 'active'
            current_period_start: new Date(subscriptionDetails.current_period_start * 1000),
            current_period_end: new Date(subscriptionDetails.current_period_end * 1000),
            current_billing_cycle_signature_count: 0, // Reset signature count on renewal
            // updated_at will be set by db trigger
          })
          .eq('stripe_subscription_id', stripeSubscriptionId);

        if (subUpdateError) {
          console.error(`Supabase error updating subscription period for ${stripeSubscriptionId}: ${subUpdateError.message}`);
        } else {
            console.log(`Subscription period updated for ${stripeSubscriptionId}`);
        }
      }
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      const subIdForFailure = failedInvoice.subscription;
       if (!subIdForFailure) {
            console.log('Webhook: invoice.payment_failed with no subscription ID. Skipping subscription update.');
            break;
        }
      const { error: subFailError } = await supabase
        .from('subscriptions')
        .update({ status: 'past_due' }) // Or 'unpaid' depending on your desired states
        .eq('stripe_subscription_id', subIdForFailure);

      if (subFailError) {
        console.error(`Supabase error updating subscription status to past_due for ${subIdForFailure}: ${subFailError.message}`);
      } else {
        console.log(`Subscription status updated to past_due for ${subIdForFailure}`);
      }
      break;

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': // Handles cancellations initiated by user or Stripe
      const updatedSubscription = event.data.object;
      const status = updatedSubscription.status; // e.g., 'active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'trialing'
      // If 'deleted', status might not be present; use a specific status like 'cancelled'.
      // Stripe sends 'customer.subscription.deleted' when a subscription is canceled immediately or at period end.
      const effectiveStatus = event.type === 'customer.subscription.deleted' ? 'cancelled' : status;

      const { error: subEventError } = await supabase
        .from('subscriptions')
        .update({
          status: effectiveStatus,
          // Update period_end if it's a cancellation at period end
          current_period_end: updatedSubscription.cancel_at_period_end 
            ? new Date(updatedSubscription.current_period_end * 1000) 
            : (updatedSubscription.ended_at ? new Date(updatedSubscription.ended_at * 1000) : null),
        })
        .eq('stripe_subscription_id', updatedSubscription.id);

      if (subEventError) {
        console.error(`Supabase error updating subscription status for ${updatedSubscription.id}: ${subEventError.message}`);
      } else {
        console.log(`Subscription status updated to ${effectiveStatus} for ${updatedSubscription.id}`);
      }
      break;

    default:
      console.log(`Unhandled Stripe event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
});


module.exports = router;
