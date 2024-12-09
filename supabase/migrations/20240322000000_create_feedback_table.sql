-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create feedback table
create table public.feedback (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Add a unique constraint on user_id to ensure one feedback per user
    constraint one_feedback_per_user unique (user_id)
);

-- Enable RLS
alter table public.feedback enable row level security;

-- Create policy to allow users to insert their own feedback
create policy "Users can insert their own feedback"
    on public.feedback
    for insert
    with check (auth.uid() = user_id);

-- Create policy to allow users to read all feedback
create policy "Users can read all feedback"
    on public.feedback
    for select
    using (true);