-- Add foreign key constraint to subscriptions table
ALTER TABLE public.subscriptions
    ADD CONSTRAINT subscriptions_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Create profiles view to access auth.users data
CREATE OR REPLACE VIEW public.profiles AS
    SELECT id, email, email_confirmed_at
    FROM auth.users;