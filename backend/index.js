const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
  res.send('Signhey API is running!');
});

// Auth Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Stripe Routes
// IMPORTANT: The webhook route needs raw body, so it's mounted BEFORE express.json()
// or express.json() is not applied globally if it interferes.
// However, other Stripe routes might expect JSON.
// A common pattern is to apply express.json() globally, and then for the webhook route specifically,
// ensure it's defined before the global JSON parser or use a specific raw body parser for it.

// Let's ensure Stripe webhook uses raw body, other routes use JSON.
const stripeRoutes = require('./routes/stripe');

// Mount other Stripe routes that expect JSON payloads first
// We will apply express.json() generally, then ensure the webhook uses express.raw()
// The express.raw() is applied within stripe.js for the specific /webhook route.
app.use('/api/stripe', stripeRoutes);

// BoldSign Routes
const boldsignRoutes = require('./routes/boldsign');
// The /api/boldsign/webhook route uses express.json() specifically.
// Other boldsign routes like /send-document use multer, which handles its own body parsing.
// Global app.use(express.json()) is fine.
app.use('/api/boldsign', boldsignRoutes);

// Profile Routes
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);

// Packages Routes
const packageRoutes = require('./routes/packages');
app.use('/api/packages', packageRoutes);

// Credits Routes
const creditRoutes = require('./routes/credits');
app.use('/api/credits', creditRoutes);

// Signer Flow Routes
const signerFlowRoutes = require('./routes/signerflow');
app.use('/api/signerflow', signerFlowRoutes);

// Subscription Status Routes
const subscriptionRoutes = require('./routes/subscriptions');
app.use('/api/subscriptions', subscriptionRoutes);

// Billing History Routes
const billingRoutes = require('./routes/billing');
app.use('/api/billing', billingRoutes);

// Dashboard Stats Routes
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

// Admin Routes
const adminUserRoutes = require('./routes/adminUsers');
const adminReportRoutes = require('./routes/adminReports');
app.use('/api/admin', adminUserRoutes); // Mounts user management under /api/admin/users/*
app.use('/api/admin', adminReportRoutes); // Mounts reports under /api/admin/credits-overview and /api/admin/billing-reports


// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Supabase Client (will be used later)
/*
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env file.');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);
*/

module.exports = app; // For potential testing or modularization
