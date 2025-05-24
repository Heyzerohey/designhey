-- Supabase Auth already provides a users table. We will reference auth.users.id.
-- We assume that email, phone, etc. are handled by Supabase Auth.

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    business_name TEXT,
    logo_url TEXT,
    contact_info TEXT,
    stripe_customer_id TEXT UNIQUE
);

-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles table
CREATE TRIGGER set_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    plan_name TEXT NOT NULL, -- e.g., 'Pro', 'Free'
    status TEXT NOT NULL, -- e.g., 'active', 'cancelled', 'past_due', 'trialing'
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    stripe_subscription_id TEXT UNIQUE
);

-- Trigger for subscriptions table
CREATE TRIGGER set_subscriptions_timestamp
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE signature_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    balance INTEGER DEFAULT 0 NOT NULL,
    last_purchased_at TIMESTAMPTZ
);

-- Trigger for signature_credits table
CREATE TRIGGER set_signature_credits_timestamp
BEFORE UPDATE ON signature_credits
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pro_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- User who created the package
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    name TEXT NOT NULL,
    agreement_details JSONB, -- { original_document_link_boldsign: "...", ... }
    document_request_details JSONB, -- { requested: true, document_name: "Proof of ID", description: "..." }
    payment_request_details JSONB, -- { requested: true, amount: 50000, currency: "USD", description: "..." }
    status TEXT NOT NULL DEFAULT 'draft', -- e.g., 'draft', 'sent', 'viewed', 'partially_signed', 'signed', 'completed', 'declined'
    signer_link_id TEXT UNIQUE NOT NULL -- Generated for sharing with the signer
);

-- Trigger for packages table
CREATE TRIGGER set_packages_timestamp
BEFORE UPDATE ON packages
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    boldsign_document_id TEXT UNIQUE NOT NULL,
    original_file_name TEXT,
    status TEXT, -- From BoldSign: 'Sent', 'Viewed', 'Signed', 'Declined', 'Expired', 'Revoked'
    signed_document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger for agreements table
CREATE TRIGGER set_agreements_timestamp
BEFORE UPDATE ON agreements
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TABLE uploaded_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    -- uploader_user_id can be NULL if the signer is not a registered user
    uploader_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    storage_path TEXT NOT NULL, -- Path in Supabase Storage
    file_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
-- No updated_at needed for uploaded_documents as they are typically immutable once uploaded.

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    stripe_charge_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL, -- in cents
    currency TEXT NOT NULL, -- e.g., 'USD'
    status TEXT NOT NULL, -- e.g., 'succeeded', 'pending', 'failed'
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    -- No updated_at for payments as they are typically immutable once created.
);

-- Add indexes for frequently queried columns
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_signature_credits_user_id ON signature_credits(user_id);
CREATE INDEX idx_packages_pro_user_id ON packages(pro_user_id);
CREATE INDEX idx_packages_signer_link_id ON packages(signer_link_id);
CREATE INDEX idx_agreements_package_id ON agreements(package_id);
CREATE INDEX idx_uploaded_documents_package_id ON uploaded_documents(package_id);
CREATE INDEX idx_uploaded_documents_uploader_user_id ON uploaded_documents(uploader_user_id);
CREATE INDEX idx_payments_package_id ON payments(package_id);

-- RLS (Row Level Security) Policies will be defined later.
-- For now, ensure you have a SUPERUSER or appropriate role to create these.
-- Also, ensure the 'auth.users' table exists as these tables reference it.
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Grant usage on schema public and auth to postgres and anon role (or authenticated role)
-- This might be needed depending on your Supabase setup, often handled by Supabase itself.
-- GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated;
-- GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated;

-- Grant usage on schema auth to postgres (and possibly other roles if they need to query auth.users)
-- GRANT USAGE ON SCHEMA auth TO postgres;
-- GRANT SELECT ON auth.users TO postgres; -- Or specific roles that need to read user data.

-- Note on `auth.users.id`:
-- Supabase's `auth.users` table already provides an `id` (UUID) for users.
-- We don't need additional user-specific fields in a separate `users` table for now,
-- unless requirements change (e.g., fields not suitable for `auth.user_metadata`).
-- The `profiles` table is designed to hold additional public or app-specific user data,
-- linked via the `auth.users.id`.
