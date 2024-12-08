create table api_keys (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  api_key text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_used_at timestamp with time zone,
  is_active boolean default true
);

-- Add RLS policies
alter table api_keys enable row level security;

create policy "Users can only view their own API keys"
  on api_keys for select
  using (auth.uid() = user_id);

create policy "Users can only insert their own API keys"
  on api_keys for insert
  with check (auth.uid() = user_id);

create policy "Users can only update their own API keys"
  on api_keys for update
  using (auth.uid() = user_id);

-- Create function to generate secure API keys
create or replace function generate_api_key()
returns text
language plpgsql
as $$
declare
  chars text[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result text := 'sk_';
  i integer := 0;
begin
  for i in 1..32 loop
    result := result || chars[1+random()*(array_length(chars, 1)-1)];
  end loop;
  return result;
end;
$$;