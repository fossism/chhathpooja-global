-- Supabase schema for ChhathMahaparv (v1, no eco module, no toilet/food columns)
create table if not exists ghats (
  id text primary key,
  name text not null,
  city text not null,
  country text not null,
  lat double precision not null,
  lng double precision not null,
  river_or_pond text,
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
  city text,
  country text,
  lat double precision,
  lng double precision,
  image_path text not null,
  caption text,
  moderated boolean default false,
  created_at timestamptz default now()
);

-- Storage bucket: chhath-wall (public read, authenticated write)
-- insert into storage.buckets (id, name, public) values ('chhath-wall','chhath-wall', true);
