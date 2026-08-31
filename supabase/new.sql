-- Fix: restrict the "public by slug" policy to anon role only,
-- so it doesn't leak into authenticated dashboard queries

drop policy if exists "Public can view invitation by slug" on public.invitations;

alter table invitations
  add column if not exists has_watermark boolean not null default true;

create policy "Public can view invitation by slug"
  on public.invitations for select
  to anon
  using (true);

-- Same fix for the "mark opened" update policy — keep it anon-only too
drop policy if exists "Public can mark invitation opened" on public.invitations;

create policy "Public can mark invitation opened"
  on public.invitations for update
  to anon
  using (true)
  with check (status in ('opened','accepted'));

-- And the response insert policy, restrict to anon
drop policy if exists "Public can submit a response" on public.invitation_responses;

create policy "Public can submit a response"
  on public.invitation_responses for insert
  to anon
  with check (true);