-- Add api_access column to subscriptions table
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS api_access BOOLEAN DEFAULT FALSE;