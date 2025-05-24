-- SQL to add current_billing_cycle_signature_count to subscriptions table
ALTER TABLE subscriptions
ADD COLUMN current_billing_cycle_signature_count INTEGER DEFAULT 0 NOT NULL;

COMMENT ON COLUMN subscriptions.current_billing_cycle_signature_count IS 'Tracks the number of signatures sent by the user in the current billing cycle. Resets on subscription renewal.';
