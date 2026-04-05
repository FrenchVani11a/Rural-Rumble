-- Trash Talk Board - Run in Supabase SQL Editor
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  author_name text not null check (char_length(author_name) between 1 and 50),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table chat_messages enable row level security;

create policy "Allow all access to chat_messages"
  on chat_messages for all
  using (true)
  with check (true);

alter publication supabase_realtime add table chat_messages;
