import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xtilpfcqhecqhifftrop.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0aWxwZmNxaGVjcWhpZmZ0cm9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5MTc0NjAsImV4cCI6MjEwNTQ5MzQ2MH0.76pYQvln0KgL-_DcsJN-cAWEXMgnDtn3eD9g56Noemo";

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
