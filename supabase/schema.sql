create extension if not exists "pgcrypto";

create table birds (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  common_name text not null,
  scientific_name text not null,
  family text not null,
  is_native boolean not null default false,
  geography text not null default '',
  description text not null default '',
  habitat text not null default '',
  feeding text not null default '',
  behavior text not null default '',
  breeding text not null default '',
  size text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table photos (
  id uuid primary key default gen_random_uuid(),
  bird_id uuid not null references birds(id) on delete cascade,
  title text,
  alt text not null,
  camera text not null default '',
  lens text not null default '',
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table photo_variants (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid not null references photos(id) on delete cascade,
  variant_type text not null check (variant_type in ('card', 'large')),
  storage_path text not null,
  public_url text not null,
  width integer not null,
  height integer not null,
  size_bytes integer not null,
  format text not null default 'webp',
  created_at timestamptz not null default now(),
  unique (photo_id, variant_type)
);

create index photos_bird_id_idx on photos(bird_id);
create index photos_uploaded_at_idx on photos(uploaded_at desc);
create index photo_variants_photo_id_idx on photo_variants(photo_id);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_birds_updated_at
before update on birds
for each row
execute function update_updated_at_column();

create trigger update_photos_updated_at
before update on photos
for each row
execute function update_updated_at_column();