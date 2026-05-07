-- ============================================================
-- daily-growth-log: Initial Schema
-- 6 tables: users, posts, cheers, activities, reports, invite_codes
-- ============================================================

-- ========== ENUMS ==========

create type auth_provider as enum ('kakao', 'google');
create type subscription_tier as enum ('free', 'premium');
create type activity_type as enum (
  'daily_login',
  'post',
  'first_post_bonus',
  'cheer_received',
  'cheer_sent',
  'streak_3',
  'streak_7',
  'invite_bonus',
  'invited_bonus'
);
create type report_status as enum ('pending', 'reviewed', 'dismissed');

-- ========== USERS ==========

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text unique not null check (char_length(nickname) between 2 and 10),
  email text,
  auth_provider auth_provider not null default 'kakao',
  points integer not null default 0 check (points >= 0),
  level integer not null default 1 check (level between 1 and 6),
  streak integer not null default 0 check (streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_active_date date,
  subscription_tier subscription_tier not null default 'free',
  is_private boolean not null default false,
  push_enabled boolean not null default true,
  invited_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.users is '유저 프로필 및 성장 데이터';

-- ========== POSTS ==========

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 60),
  image_url text,
  is_private boolean not null default false,
  cheers_count integer not null default 0 check (cheers_count >= 0),
  reported boolean not null default false,
  date date not null default current_date,
  created_at timestamptz not null default now(),

  -- 하루 1개 기록 제한
  unique (user_id, date)
);

comment on table public.posts is '매일 한 줄 기록';

create index idx_posts_user_id on public.posts(user_id);
create index idx_posts_date on public.posts(date desc);
create index idx_posts_created_at on public.posts(created_at desc);

-- ========== CHEERS (응원 🌱) ==========

create table public.cheers (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),

  -- 중복 응원 방지
  unique (post_id, user_id)
);

comment on table public.cheers is '응원 (🌱) - 유저 → 기록';

create index idx_cheers_post_id on public.cheers(post_id);

-- ========== ACTIVITIES (포인트 이력) ==========

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  type activity_type not null,
  points integer not null,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

comment on table public.activities is '포인트 획득 이력';

create index idx_activities_user_id on public.activities(user_id);
create index idx_activities_date on public.activities(user_id, date);

-- ========== REPORTS (신고) ==========

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  reason text not null,
  status report_status not null default 'pending',
  created_at timestamptz not null default now(),

  -- 중복 신고 방지
  unique (reporter_id, post_id)
);

comment on table public.reports is '부적절 기록 신고';

-- ========== INVITE CODES (초대 코드) ==========

create table public.invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null check (char_length(code) = 8),
  creator_id uuid not null references public.users(id) on delete cascade,
  used_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

comment on table public.invite_codes is '초대 코드 (Lv.4 해금)';

create index idx_invite_codes_creator on public.invite_codes(creator_id);
create index idx_invite_codes_code on public.invite_codes(code);

-- ========== AUTO-UPDATE updated_at ==========

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated
  before update on public.users
  for each row execute function public.handle_updated_at();

-- ========== AUTO-UPDATE cheers_count ==========

create or replace function public.handle_cheers_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set cheers_count = cheers_count + 1 where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.posts set cheers_count = cheers_count - 1 where id = old.post_id;
    return old;
  end if;
end;
$$ language plpgsql;

create trigger on_cheers_changed
  after insert or delete on public.cheers
  for each row execute function public.handle_cheers_count();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.cheers enable row level security;
alter table public.activities enable row level security;
alter table public.reports enable row level security;
alter table public.invite_codes enable row level security;

-- ===== USERS RLS =====

create policy "users: anyone can read public profiles"
  on public.users for select
  using (not is_private or id = auth.uid());

create policy "users: owner can update own profile"
  on public.users for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "users: owner can insert own profile"
  on public.users for insert
  with check (id = auth.uid());

-- ===== POSTS RLS =====

create policy "posts: anyone can read public posts"
  on public.posts for select
  using (not is_private or user_id = auth.uid());

create policy "posts: owner can insert"
  on public.posts for insert
  with check (user_id = auth.uid());

create policy "posts: owner can delete"
  on public.posts for delete
  using (user_id = auth.uid());

-- cheers_count trigger가 update하므로 service role은 별도 처리 필요
-- 클라이언트에서는 posts update 불가 (수정 불가 정책)

-- ===== CHEERS RLS =====

create policy "cheers: anyone can read"
  on public.cheers for select
  using (true);

create policy "cheers: authenticated can insert"
  on public.cheers for insert
  with check (user_id = auth.uid());

create policy "cheers: owner can delete"
  on public.cheers for delete
  using (user_id = auth.uid());

-- ===== ACTIVITIES RLS =====

create policy "activities: owner can read own"
  on public.activities for select
  using (user_id = auth.uid());

create policy "activities: owner can insert"
  on public.activities for insert
  with check (user_id = auth.uid());

-- ===== REPORTS RLS =====

create policy "reports: owner can read own"
  on public.reports for select
  using (reporter_id = auth.uid());

create policy "reports: authenticated can insert"
  on public.reports for insert
  with check (reporter_id = auth.uid());

-- ===== INVITE CODES RLS =====

create policy "invite_codes: owner can read own"
  on public.invite_codes for select
  using (creator_id = auth.uid());

create policy "invite_codes: owner can insert"
  on public.invite_codes for insert
  with check (creator_id = auth.uid());

create policy "invite_codes: anyone can use code"
  on public.invite_codes for update
  using (used_by is null)
  with check (used_by = auth.uid());

-- invite_codes: 코드 조회용 (가입 시 코드 유효성 확인)
create policy "invite_codes: anyone can check code validity"
  on public.invite_codes for select
  using (used_by is null);

-- ============================================================
-- STORAGE: post-images bucket
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  5242880, -- 5MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

create policy "post-images: authenticated can upload"
  on storage.objects for insert
  with check (
    bucket_id = 'post-images'
    and auth.uid() is not null
  );

create policy "post-images: anyone can read"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "post-images: owner can delete"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
