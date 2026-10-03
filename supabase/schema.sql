-- Supabase schema for ChhathMahaparv (v1, no eco module, no toilet/food columns)
create table if not exists ghats (
  id text primary key,
  name text not null check (char_length(name) between 1 and 120),
  city text not null check (char_length(city) between 1 and 80),
  country text not null check (char_length(country) between 1 and 80),
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180),
  river_or_pond text check (river_or_pond is null or char_length(river_or_pond) <= 120),
  parking boolean default false,
  lighting boolean default false,
  police_help boolean default false,
  first_aid boolean default false,
  drinking_water boolean default false,
  verified boolean default false,
  created_at timestamptz default now()
);

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

-- Authenticated users may propose new ghats, but never self-verify.
drop policy if exists "ghats_auth_insert_unverified" on ghats;
create policy "ghats_auth_insert_unverified"
  on ghats for insert
  to authenticated
  with check (verified = false);

-- No public update/delete. Moderation happens with service_role key only.

-- Photos: public can read MODERATED rows only.
drop policy if exists "photos_public_read_moderated" on photos;
create policy "photos_public_read_moderated"
  on photos for select
  to anon, authenticated
  using (moderated = true);

-- Authenticated users may upload rows, but never self-moderate.
drop policy if exists "photos_auth_insert_unmoderated" on photos;
create policy "photos_auth_insert_unmoderated"
  on photos for insert
  to authenticated
  with check (moderated = false);

-- No public update/delete on photos either.

-- Storage bucket: chhath-wall (public read, authenticated write)
-- insert into storage.buckets (id, name, public) values ('chhath-wall','chhath-wall', true);

-- Storage policies (run after creating the bucket):
-- public read of wall images:
-- drop policy if exists "wall_public_read" on storage.objects;
-- create policy "wall_public_read" on storage.objects for select
--   to anon, authenticated using (bucket_id = 'chhath-wall');
--
-- authenticated write, 3 MB cap + image MIME only (defense in depth with
-- the client-side checks in WallClient.tsx):
-- drop policy if exists "wall_auth_write_images" on storage.objects;
-- create policy "wall_auth_write_images" on storage.objects for insert
--   to authenticated
--   with check (
--     bucket_id = 'chhath-wall'
--     and (octet_length(name) < 512)
--   );
-- NOTE: enforce content-type/size in an Edge Function or via
-- storage size limits — bucket policies alone can't check MIME reliably.
-- No public update/delete on storage.objects.
