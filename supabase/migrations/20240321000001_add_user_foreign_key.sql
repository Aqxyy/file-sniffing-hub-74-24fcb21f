alter table public.subscriptions
    add constraint subscriptions_user_id_fkey
    foreign key (user_id)
    references auth.users(id)
    on delete cascade;