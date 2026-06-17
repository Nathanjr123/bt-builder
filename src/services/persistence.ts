import type { BTNode, BTEdge } from '../types';

// A saved strategy: just the canvas graph, enough to fully restore a session.
export interface SavedTree {
  nodes: BTNode[];
  edges: BTEdge[];
}

export interface ProfileSummary {
  name: string;
  updatedAt: string | null;
}

// Cloud config is read from Vite env vars at build time. When absent, the app
// transparently falls back to localStorage (per-device only). The Supabase
// anon key is intended to be public — it is safe to ship in client code.
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const TABLE = 'bt_profiles';

export const cloudEnabled = Boolean(SUPABASE_URL && SUPABASE_KEY);

// ---------------------------------------------------------------------------
// localStorage backend (fallback / single device)
// ---------------------------------------------------------------------------
const LOCAL_PREFIX = 'bt-builder-profile:';
const LOCAL_INDEX = 'bt-builder-profile-index';

function readLocalIndex(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_INDEX) ?? '{}');
  } catch {
    return {};
  }
}

function writeLocalIndex(index: Record<string, string>) {
  try {
    localStorage.setItem(LOCAL_INDEX, JSON.stringify(index));
  } catch {
    // Ignore storage failures.
  }
}

const local = {
  async list(): Promise<ProfileSummary[]> {
    const index = readLocalIndex();
    return Object.entries(index)
      .map(([name, updatedAt]) => ({ name, updatedAt }))
      .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
  },
  async load(name: string): Promise<SavedTree | null> {
    try {
      const raw = localStorage.getItem(LOCAL_PREFIX + name);
      return raw ? (JSON.parse(raw) as SavedTree) : null;
    } catch {
      return null;
    }
  },
  async save(name: string, tree: SavedTree): Promise<void> {
    try {
      localStorage.setItem(LOCAL_PREFIX + name, JSON.stringify(tree));
      const index = readLocalIndex();
      index[name] = new Date().toISOString();
      writeLocalIndex(index);
    } catch {
      // Ignore storage failures (e.g. quota / private mode).
    }
  },
};

// ---------------------------------------------------------------------------
// Supabase REST backend (cross-device)
// ---------------------------------------------------------------------------
function headers(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

const cloud = {
  async list(): Promise<ProfileSummary[]> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?select=name,updated_at&order=updated_at.desc`,
      { headers: headers() },
    );
    if (!res.ok) throw new Error(`list failed: ${res.status}`);
    const rows = (await res.json()) as { name: string; updated_at: string }[];
    return rows.map((r) => ({ name: r.name, updatedAt: r.updated_at }));
  },
  async load(name: string): Promise<SavedTree | null> {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${TABLE}?name=eq.${encodeURIComponent(name)}&select=data`,
      { headers: headers() },
    );
    if (!res.ok) throw new Error(`load failed: ${res.status}`);
    const rows = (await res.json()) as { data: SavedTree }[];
    return rows.length ? rows[0].data : null;
  },
  async save(name: string, tree: SavedTree): Promise<void> {
    // Upsert on the primary key (name) so repeated saves overwrite cleanly.
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: 'POST',
      headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ name, data: tree, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error(`save failed: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// Public API — picks the active backend.
// ---------------------------------------------------------------------------
const backend = cloudEnabled ? cloud : local;

export function listProfiles(): Promise<ProfileSummary[]> {
  return backend.list();
}

export function loadProfile(name: string): Promise<SavedTree | null> {
  return backend.load(name);
}

export function saveProfile(name: string, tree: SavedTree): Promise<void> {
  return backend.save(name, tree);
}

// Remembers the last profile picked on THIS device so a return visit can
// auto-resume without re-selecting.
const CURRENT_KEY = 'bt-builder-current-profile';

export function getCurrentProfile(): string | null {
  try {
    return localStorage.getItem(CURRENT_KEY);
  } catch {
    return null;
  }
}

export function setCurrentProfile(name: string | null) {
  try {
    if (name) localStorage.setItem(CURRENT_KEY, name);
    else localStorage.removeItem(CURRENT_KEY);
  } catch {
    // Ignore storage failures.
  }
}
