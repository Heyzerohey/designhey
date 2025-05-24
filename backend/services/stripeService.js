const Stripe = require('stripe');
require('dotenv').config(); // Ensures .env variables are loaded

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Stripe Secret Key is missing. Please check your .env file in the backend directory.');
  // Optionally, throw an error to prevent the app from starting without Stripe config
  // throw new Error('Stripe Secret Key is missing.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use a recent API version
});

// Placeholder Price IDs - these should be created in your Stripe Dashboard
// and their IDs stored in .env or a config file.
const PRO_PLAN_PRICE_ID = process.env.PRO_PLAN_PRICE_ID || 'price_placeholder_pro_plan';

// Signature Pack Price IDs - assuming these are also stored in .env
// Example: SIGNATURE_PACK_PRICE_ID_5, SIGNATURE_PACK_PRICE_ID_10, etc.
// For simplicity in this example, we'll assume a structure or a way to fetch them.
// A more robust solution would involve fetching these from Stripe or a config.
const SIGNATURE_PACK_PRICE_IDS = {
  '5_credits': process.env.SIGNATURE_PACK_PRICE_ID_5 || 'price_placeholder_pack_5',
  '10_credits': process.env.SIGNATURE_PACK_PRICE_ID_10 || 'price_placeholder_pack_10',
  '25_credits': process.env.SIGNATURE_PACK_PRICE_ID_25 || 'price_placeholder_pack_25',
  '50_credits': process.env.SIGNATURE_PACK_PRICE_ID_50 || 'price_placeholder_pack_50',
  '100_credits': process.env.SIGNATURE_PACK_PRICE_ID_100 || 'price_placeholder_pack_100',
};

// Corresponding credits for each pack - this should align with your Stripe product setup
const SIGNATURE_PACK_CREDITS = {
  [SIGNATURE_PACK_PRICE_IDS['5_credits']]: 5,
  [SIGNATURE_PACK_PRICE_IDS['10_credits']]: 10,
  [SIGNATURE_PACK_PRICE_IDS['25_credits']]: 25,
  [SIGNATURE_PACK_PRICE_IDS['50_credits']]: 50,
  [SIGNATURE_PACK_PRICE_IDS['100_credits']]: 100,
};


// Function to get or create a Stripe customer
// Supabase client will be passed to interact with the database
const getOrCreateStripeCustomer = async (userId, email, supabase) => {
  if (!userId || !email || !supabase) {
    throw new Error('User ID, email, and Supabase client are required to get or create Stripe customer.');
  }

  // Check if user already has a stripe_customer_id in profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (profileError && profileError.code !== 'PGRST116') { // PGRST116: row not found
    console.error('Error fetching profile for Stripe customer creation:', profileError);
    throw profileError;
  }

  if (profile && profile.stripe_customer_id) {
    // Verify customer exists in Stripe to prevent errors if it was deleted in Stripe
    try {
      const customer = await stripe.customers.retrieve(profile.stripe_customer_id);
      if (customer && !customer.deleted) {
        return customer.id;
      }
    } catch (e) {
      // Customer likely deleted in Stripe, proceed to create a new one
      console.warn(`Failed to retrieve Stripe customer ${profile.stripe_customer_id}, creating a new one. Error: ${e.message}`);
    }
  }

  // Create new Stripe customer
  try {
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        supabase_user_id: userId,
      },
    });

    // Store the new Stripe Customer ID in the user's profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile with new Stripe Customer ID:', updateError);
      // Don't throw here, as customer creation was successful. Log and handle reconciliation if needed.
    }
    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};


module.exports = {
  stripe,
  PRO_PLAN_PRICE_ID,
  SIGNATURE_PACK_PRICE_IDS,
  SIGNATURE_PACK_CREDITS,
  getOrCreateStripeCustomer,
};
