import { createClient } from '@supabase/supabase-js';

const defaultUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const defaultAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export function getSupabaseClient(customUrl?: string, customKey?: string) {
  const url = customUrl || defaultUrl;
  const key = customKey || defaultAnonKey;

  try {
    return createClient(url, key);
  } catch (error) {
    console.warn('Supabase client initialization note:', error);
    return null;
  }
}
