-- SQL for credit_purchases table

CREATE TABLE credit_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    purchase_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    credits_purchased INTEGER NOT NULL,
    amount_paid INTEGER NOT NULL, -- Amount in cents
    currency TEXT NOT NULL, -- e.g., 'USD'
    stripe_charge_id TEXT, -- Store the Stripe Charge ID (or Payment Intent ID)
    description TEXT, -- e.g., "Purchase of 50 Signature Credits"
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL 
    -- No trigger needed for updated_at if records are immutable after creation
);

-- Add indexes for frequently queried columns
CREATE INDEX idx_credit_purchases_user_id ON credit_purchases(user_id);
CREATE INDEX idx_credit_purchases_purchase_date ON credit_purchases(purchase_date);

-- Optional: Add a trigger for updated_at if records can be updated later,
-- though typically purchase records are immutable.
-- CREATE TRIGGER set_credit_purchases_timestamp
-- BEFORE UPDATE ON credit_purchases
-- FOR EACH ROW
-- EXECUTE FUNCTION trigger_set_timestamp(); -- Assuming trigger_set_timestamp() function exists from previous schema

-- Note: The `trigger_set_timestamp()` function was defined in `backend/schema.sql` (Task 1).
-- If this file is run independently, that function needs to be available or created.
-- For this project, assume it's available.

COMMENT ON TABLE credit_purchases IS 'Logs purchases of signature credit packs by users.';
COMMENT ON COLUMN credit_purchases.amount_paid IS 'Amount in the smallest currency unit (e.g., cents for USD).';
