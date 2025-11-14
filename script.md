# Supabase Migration - Per-User Scoping

```sql
-- ===============================
-- Per-user scoping migration
-- ===============================

-- 1) Ensure users table exists (matches backend expectations)
CREATE TABLE IF NOT EXISTS public.users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- 2) Add user_id columns to follower-related tables (nullable for backfill)
ALTER TABLE public.whitelist
  ADD COLUMN IF NOT EXISTS user_id BIGINT;

ALTER TABLE public.non_followers
  ADD COLUMN IF NOT EXISTS user_id BIGINT;

ALTER TABLE public.ex_followers
  ADD COLUMN IF NOT EXISTS user_id BIGINT;

ALTER TABLE public.follower_counts
  ADD COLUMN IF NOT EXISTS user_id BIGINT;

-- 3) Ensure app users exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE username = 'fbersachia'
  ) THEN
    INSERT INTO public.users (username, password_hash)
    VALUES (
      'fbersachia',
      '$2b$10$40bRmpMv1Z.E1TOQZLqKdeiGyaIUlajXSMq4Pw9.VMHXQ6CQNPiAS'
    )
    ON CONFLICT (username) DO NOTHING;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.users WHERE username = 'emab'
  ) THEN
    -- Replace this hash with a real bcrypt hash for emab,
    -- or remove this block if you'll create emab via the app.
    INSERT INTO public.users (username, password_hash)
    VALUES (
      'emab',
      '$2b$10$PLACE_REAL_HASH_HERE______________'
    )
    ON CONFLICT (username) DO NOTHING;
  END IF;
END
$$;

-- 4) Backfill existing data

-- All whitelist / non_followers / ex_followers rows belong to fbersachia
UPDATE public.whitelist w
SET user_id = u.id
FROM public.users u
WHERE u.username = 'fbersachia'
  AND w.user_id IS NULL;

UPDATE public.non_followers nf
SET user_id = u.id
FROM public.users u
WHERE u.username = 'fbersachia'
  AND nf.user_id IS NULL;

UPDATE public.ex_followers ef
SET user_id = u.id
FROM public.users u
WHERE u.username = 'fbersachia'
  AND ef.user_id IS NULL;

-- follower_counts:
-- 283 followers -> emab
UPDATE public.follower_counts fc
SET user_id = ue.id
FROM public.users ue
WHERE ue.username = 'emab'
  AND fc.user_id IS NULL
  AND fc.count = 283;

-- all other follower_counts rows -> fbersachia
UPDATE public.follower_counts fc
SET user_id = uf.id
FROM public.users uf
WHERE uf.username = 'fbersachia'
  AND fc.user_id IS NULL;

-- 5) Enforce NOT NULL + foreign keys
ALTER TABLE public.whitelist
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.non_followers
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.ex_followers
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.follower_counts
  ALTER COLUMN user_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'whitelist_user_fk'
  ) THEN
    ALTER TABLE public.whitelist
      ADD CONSTRAINT whitelist_user_fk
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'non_followers_user_fk'
  ) THEN
    ALTER TABLE public.non_followers
      ADD CONSTRAINT non_followers_user_fk
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ex_followers_user_fk'
  ) THEN
    ALTER TABLE public.ex_followers
      ADD CONSTRAINT ex_followers_user_fk
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'follower_counts_user_fk'
  ) THEN
    ALTER TABLE public.follower_counts
      ADD CONSTRAINT follower_counts_user_fk
      FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
  END IF;
END
$$;

-- 6) Drop old global-username uniqueness & indexes, add per-user ones

ALTER TABLE public.whitelist
  DROP CONSTRAINT IF EXISTS whitelist_username_key;

ALTER TABLE public.non_followers
  DROP CONSTRAINT IF EXISTS non_followers_username_key;

ALTER TABLE public.ex_followers
  DROP CONSTRAINT IF EXISTS ex_followers_username_key;

DROP INDEX IF EXISTS public.idx_whitelist_username;
DROP INDEX IF EXISTS public.idx_non_followers_username;
DROP INDEX IF EXISTS public.idx_ex_followers_username;
DROP INDEX IF EXISTS public.idx_follower_counts_recorded_at;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'uniq_whitelist_user_username'
  ) THEN
    ALTER TABLE public.whitelist
      ADD CONSTRAINT uniq_whitelist_user_username
      UNIQUE (user_id, username);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'uniq_non_followers_user_username'
  ) THEN
    ALTER TABLE public.non_followers
      ADD CONSTRAINT uniq_non_followers_user_username
      UNIQUE (user_id, username);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'uniq_ex_followers_user_username'
  ) THEN
    ALTER TABLE public.ex_followers
      ADD CONSTRAINT uniq_ex_followers_user_username
      UNIQUE (user_id, username);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_whitelist_user_username
  ON public.whitelist (user_id, username);

CREATE INDEX IF NOT EXISTS idx_non_followers_user_username
  ON public.non_followers (user_id, username);

CREATE INDEX IF NOT EXISTS idx_ex_followers_user_username
  ON public.ex_followers (user_id, username);

CREATE INDEX IF NOT EXISTS idx_follower_counts_user_recorded_at
  ON public.follower_counts (user_id, recorded_at);
```

