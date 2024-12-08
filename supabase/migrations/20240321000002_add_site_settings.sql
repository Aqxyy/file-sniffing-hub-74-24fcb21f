create table public.site_settings (
    id bigint primary key generated always as identity,
    api_enabled boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default settings
insert into public.site_settings (api_enabled) values (true);