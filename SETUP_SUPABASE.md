# Enable cross-device profiles (Supabase) — ~2 minutes

The app works out of the box in **local mode** (profiles saved in the browser,
one device only). To make profiles sync across PCs — pick a name like
`KayuuWow` on any computer and continue where you left off — connect a free
Supabase backend.

> The two values you'll paste (Project URL + **anon** key) are **public by
> design** and safe to commit. They are not admin secrets.

## 1. Create a free project
1. Go to <https://supabase.com> → sign up (free) → **New project**.
2. Pick a name and a database password (you won't need the password again here).
3. Wait ~1 minute for it to provision.

## 2. Create the table + access policies
Open **SQL Editor** in the Supabase dashboard, paste this, and click **Run**:

```sql
create table if not exists public.bt_profiles (
  name        text primary key,
  data        jsonb       not null,
  updated_at  timestamptz not null default now()
);

alter table public.bt_profiles enable row level security;

-- No-password model: anyone with the app can read/write profiles by name.
create policy "public read"   on public.bt_profiles for select using (true);
create policy "public insert" on public.bt_profiles for insert with check (true);
create policy "public update" on public.bt_profiles for update using (true) with check (true);
```

## 3. Grab your two values
In the dashboard: **Project Settings → API**
- **Project URL** → e.g. `https://abcdefgh.supabase.co`
- **Project API keys → `anon` `public`** → a long `eyJ...` string

## 4. Plug them in
Create a file named `.env` in the project root (copy from `.env.example`):

```
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key...
```

## 5. Rebuild & redeploy
```bash
npm run deploy
```

Open the live site → the profile dialog now shows **“Cloud sync on”**.
Create `KayuuWow`, build a tree, then open the same site on another PC, pick
`KayuuWow`, and your work is right there.

---

### How it stays safe
- Only the **anon** key ships to the browser — never a service-role/admin key.
- Row Level Security is on; the policies above are deliberately open because you
  asked for a **no-password** model (the profile name is the only identity).
- If you later want real privacy, add Supabase Auth and tighten the policies to
  `auth.uid()` — the data layer in `src/services/persistence.ts` is the only
  file that would change.
