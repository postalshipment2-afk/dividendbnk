import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// This is the ONLY place createClient should ever exist
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // Ensure only one tab manages storage if needed
    storageKey: "doksanlar-bank-auth",
  },
});
