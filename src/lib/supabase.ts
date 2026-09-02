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

// Check local storage overrides if user customized in-app
const customUrl = typeof window !== 'undefined' ? localStorage.getItem('p2s_custom_supabase_url') : null;
const customKey = typeof window !== 'undefined' ? localStorage.getItem('p2s_custom_supabase_anon_key') : null;

export const supabaseUrl = cleanSupabaseUrl(customUrl || rawEnvUrl);
export const supabaseAnonKey = (customKey || rawEnvKey).trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key-here' &&
    !supabaseUrl.includes('MY_') &&
    supabaseUrl.startsWith('http')
);

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

export const projectRef = getProjectRef();

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
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

export const supabase = isSupabaseConfigured ? getSupabaseClient() : null;

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
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const result: ConnectionTestResult = {
    connected: false,
    tablesFound: false,
    missingTables: [],
    existingTables: [],
    latencyMs: 0,
    projectUrl: supabaseUrl,
    projectRef,
  };

  if (!isSupabaseConfigured || !supabase) {
    result.error = 'Supabase credentials not configured in environment or settings.';
    return result;
  }

  const startTime = performance.now();

  try {
    // Check key tables
    for (const table of KEY_TABLES) {
      const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
          result.missingTables.push(table);
        } else {
          // Connected, but possibly table exists with another error (e.g. permission or empty)
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

