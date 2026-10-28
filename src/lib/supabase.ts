import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Storage keys for browser-configured settings
const STORAGE_URL_KEY = "prajjval_portfolio_supabase_url";
const STORAGE_ANON_KEY = "prajjval_portfolio_supabase_anon_key";

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || "";
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  const storedUrl = typeof window !== "undefined" ? localStorage.getItem(STORAGE_URL_KEY) || "" : "";
  const storedKey = typeof window !== "undefined" ? localStorage.getItem(STORAGE_ANON_KEY) || "" : "";

  return {
    url: envUrl || storedUrl,
    anonKey: envKey || storedKey,
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window !== "undefined") {
    if (url.trim()) localStorage.setItem(STORAGE_URL_KEY, url.trim());
    else localStorage.removeItem(STORAGE_URL_KEY);

    if (anonKey.trim()) localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
    else localStorage.removeItem(STORAGE_ANON_KEY);
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(
    url &&
    anonKey &&
    url.startsWith("https://") &&
    url.includes("supabase.co") &&
    !url.includes("your-project-id")
  );
}

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = "";
let lastUsedKey = "";

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseCredentials();

  if (!url || !anonKey || !isSupabaseConfigured()) {
    return null;
  }

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}
