import { createClient } from "@supabase/supabase-js";

// These come from Supabase: Project Settings -> API
const SUPABASE_URL = "https://svfbjnqtmzxurynfzkuf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable__iBY1coaoSC2lrLKR67oEg_aJO3qihp";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // stay logged in across visits, like most normal apps
    autoRefreshToken: true, // keeps the session alive in the background
    detectSessionInUrl: true, // needed so email-confirmation links log the person in
  },
});
