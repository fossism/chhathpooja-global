-- Supabase schema for ChhathMahaparv (v1, no eco module, no toilet/food columns)
create table if not exists ghats (
  id text primary key,
  name text not null check (char_length(name) between 1 and 120),
  city text not null check (char_length(city) between 1 and 80),
  country text not null check (char_length(country) between 1 and 80),
  -- Community proposals may not know coordinates yet; do not force 0,0.
  lat double precision check (lat is null or (lat between -90 and 90)),
  lng double precision check (lng is null or (lng between -180 and 180)),
  river_or_pond text check (river_or_pond is null or char_length(river_or_pond) <= 120),
  parking boolean default false,
  lighting boolean default false,
  police_help boolean default false,
  first_aid boolean default false,
  drinking_water boolean default false,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Idempotent migration for existing projects created before coordinates were
-- allowed to be unknown.
alter table ghats alter column lat drop not null;
alter table ghats alter column lng drop not null;

create table if not exists photos (
  id uuid primary key default gen_random_uuid(),
  city text check (city is null or char_length(city) <= 80),
  country text check (country is null or char_length(country) <= 80),
  lat double precision check (lat is null or (lat between -90 and 90)),
  lng double precision check (lng is null or (lng between -180 and 180)),
  image_path text not null check (char_length(image_path) <= 512),
  caption text check (caption is null or char_length(caption) <= 280),
  moderated boolean default false,
  created_at timestamptz default now()
);

-- Row Level Security: deny-by-default. Without this, anon key can read/write
-- everything once the tables are exposed via PostgREST.
alter table ghats enable row level security;
alter table photos enable row level security;

-- Ghats: public can read VERIFIED rows only. Pending community rows stay
-- hidden until a moderator (service_role) flips verified=true.
drop policy if exists "ghats_public_read_verified" on ghats;
create policy "ghats_public_read_verified"
  on ghats for select
  to anon, authenticated
  using (verified = true);

-- Community submissions go through the Next.js API, which validates input,
-- enforces proof-of-work/rate limits, and inserts with the server-only
-- service_role key. Do not grant INSERT to anon/authenticated: the anon key is
-- public, so such a policy lets anyone bypass every API control via PostgREST.
drop policy if exists "ghats_auth_insert_unverified" on ghats;
drop policy if exists "ghats_public_insert_unverified" on ghats;
revoke insert on table ghats from anon, authenticated;

-- No public update/delete. Moderation happens with service_role key only.

-- Photos: public can read MODERATED rows only.
drop policy if exists "photos_public_read_moderated" on photos;
create policy "photos_public_read_moderated"
  on photos for select
  to anon, authenticated
  using (moderated = true);

-- Photos are also written only by the server API with the service_role key.
drop policy if exists "photos_auth_insert_unmoderated" on photos;
drop policy if exists "photos_public_insert_unmoderated" on photos;
revoke insert on table photos from anon, authenticated;

-- No public update/delete on photos either.

-- Storage bucket: chhath-wall.
-- Do NOT enable a public/anon INSERT policy. Upload through a server route or
-- Edge Function that validates the decoded image (magic bytes, MIME, pixel
-- dimensions, byte size), re-encodes it, and writes with the service_role key.
-- Also set the bucket's file-size limit and allowed MIME types in the Supabase
-- dashboard; bucket RLS policies cannot reliably enforce MIME type alone.
--
-- Public read can be granted once uploads are server-validated:
-- drop policy if exists "wall_public_read" on storage.objects;
-- create policy "wall_public_read" on storage.objects for select
--   to anon, authenticated using (bucket_id = 'chhath-wall');
--
-- No public insert/update/delete on storage.objects.
