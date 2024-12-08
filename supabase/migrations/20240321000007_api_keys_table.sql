-- Create api_keys table if it doesn't exist
create table if not exists api_keys (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users not null,
    key_value text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    last_used_at timestamp with time zone,
    is_active boolean default true,
    unique(user_id, is_active)
);

-- Add RLS policies
alter table api_keys enable row level security;

create policy "Users can view their own API keys"
    on api_keys for select
    using (auth.uid() = user_id);

create policy "Edge functions can manage API keys"
    on api_keys for all
    using (true)
    with check (true);