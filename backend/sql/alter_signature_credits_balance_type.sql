-- SQL to change the data type of signature_credits.balance to support decimals
-- Assuming the table is named 'signature_credits' and column 'balance'
-- Using NUMERIC for precision, e.g., NUMERIC(10, 2) for up to 10 digits with 2 decimal places.
ALTER TABLE signature_credits
ALTER COLUMN balance TYPE NUMERIC(10, 2);

-- If the column previously had a DEFAULT value (e.g., DEFAULT 0),
-- you might need to re-apply it after changing the type,
-- or ensure the new type is compatible with the old default or update the default.
-- For example, if it was an INTEGER default:
-- ALTER TABLE signature_credits
-- ALTER COLUMN balance SET DEFAULT 0.00;

COMMENT ON COLUMN signature_credits.balance IS 'User''s available signature credits. Can be fractional due to tiered pricing.';
