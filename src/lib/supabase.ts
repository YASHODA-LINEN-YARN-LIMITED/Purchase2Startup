import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment and local storage configurations
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};

// Clean any trailing slashes or /rest/v1/ prefixes from the URL
export function cleanSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  return rawUrl.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');
}

const rawEnvUrl = metaEnv.VITE_SUPABASE_URL || '';
const rawEnvKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export function getStoredSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('p2s_custom_supabase_url');
    if (custom) return cleanSupabaseUrl(custom);
  }
  return cleanSupabaseUrl(rawEnvUrl);
}

export function getStoredSupabaseKey(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('p2s_custom_supabase_anon_key');
    if (custom) return custom.trim();
  }
  return rawEnvKey.trim();
}

export let supabaseUrl = getStoredSupabaseUrl();
export let supabaseAnonKey = getStoredSupabaseKey();

export function isConfigured(url = supabaseUrl, key = supabaseAnonKey): boolean {
  return Boolean(
    url &&
      key &&
      url !== 'https://your-project.supabase.co' &&
      key !== 'your-anon-key-here' &&
      !url.includes('MY_') &&
      url.startsWith('http')
  );
}

export const isSupabaseConfigured = isConfigured();

// Extract project reference from URL (e.g., https://mplutsdsmkmioyrkroez.supabase.co -> mplutsdsmkmioyrkroez)
export function getProjectRef(url: string = supabaseUrl): string {
  try {
    const parsed = new URL(url);
    const parts = parsed.hostname.split('.');
    if (parts.length > 0) return parts[0];
  } catch {
    // fallback
  }
  return '';
}

export let projectRef = getProjectRef();

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(forceRefresh = false): SupabaseClient | null {
  const currentUrl = getStoredSupabaseUrl();
  const currentKey = getStoredSupabaseKey();

  if (!isConfigured(currentUrl, currentKey)) {
    return null;
  }

  if (!supabaseInstance || forceRefresh) {
    try {
      supabaseInstance = createClient(currentUrl, currentKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return supabaseInstance;
}

export function saveSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('p2s_custom_supabase_url', cleanSupabaseUrl(url));
    localStorage.setItem('p2s_custom_supabase_anon_key', key.trim());
  }
  supabaseUrl = getStoredSupabaseUrl();
  supabaseAnonKey = getStoredSupabaseKey();
  projectRef = getProjectRef(supabaseUrl);
  supabaseInstance = null; // force recreate
  return getSupabaseClient(true);
}

export function clearSupabaseCredentials() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('p2s_custom_supabase_url');
    localStorage.removeItem('p2s_custom_supabase_anon_key');
  }
  supabaseUrl = getStoredSupabaseUrl();
  supabaseAnonKey = getStoredSupabaseKey();
  projectRef = getProjectRef(supabaseUrl);
  supabaseInstance = null;
}

export const supabase = getSupabaseClient();

export interface ConnectionTestResult {
  connected: boolean;
  tablesFound: boolean;
  missingTables: string[];
  existingTables: string[];
  latencyMs: number;
  error?: string;
  projectUrl: string;
  projectRef: string;
}

const KEY_TABLES = [
  'projects',
  'customers',
  'pending_tasks',
  'site_readiness_tasks',
  'quotations',
  'audit_logs',
];

/**
 * Checks connection to Supabase and verifies if the database tables have been created
 */
export async function testSupabaseConnection(overrideUrl?: string, overrideKey?: string): Promise<ConnectionTestResult> {
  const urlToTest = overrideUrl !== undefined ? cleanSupabaseUrl(overrideUrl) : getStoredSupabaseUrl();
  const keyToTest = overrideKey !== undefined ? overrideKey.trim() : getStoredSupabaseKey();

  const result: ConnectionTestResult = {
    connected: false,
    tablesFound: false,
    missingTables: [],
    existingTables: [],
    latencyMs: 0,
    projectUrl: urlToTest,
    projectRef: getProjectRef(urlToTest),
  };

  if (!isConfigured(urlToTest, keyToTest)) {
    result.error = 'Supabase credentials not configured in environment or settings.';
    return result;
  }

  let clientToUse: SupabaseClient | null = null;
  try {
    clientToUse = createClient(urlToTest, keyToTest, { auth: { persistSession: false } });
  } catch (e: any) {
    result.error = e?.message || 'Invalid Supabase URL or Anon key format.';
    return result;
  }

  const startTime = performance.now();

  try {
    for (const table of KEY_TABLES) {
      const { error } = await clientToUse.from(table).select('count', { count: 'exact', head: true });
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
          result.missingTables.push(table);
        } else {
          result.connected = true;
          result.existingTables.push(table);
        }
      } else {
        result.connected = true;
        result.existingTables.push(table);
      }
    }

    result.latencyMs = Math.round(performance.now() - startTime);
    result.connected = true;
    result.tablesFound = result.existingTables.includes('projects');
  } catch (err: any) {
    result.latencyMs = Math.round(performance.now() - startTime);
    result.error = err?.message || 'Network error connecting to Supabase.';
  }

  return result;
}


