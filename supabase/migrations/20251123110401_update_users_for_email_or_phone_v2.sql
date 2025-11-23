/*
  # Update users table to support email OR phone authentication

  1. Changes
    - Make email nullable (optional)
    - Add phone column (optional, unique)
    - Add constraint to ensure at least email OR phone is provided

  2. Security
    - RLS policies remain the same
    - Both email and phone must be unique if provided
*/

ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text UNIQUE;

ALTER TABLE users ADD CONSTRAINT email_or_phone_required 
CHECK (email IS NOT NULL OR phone IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
