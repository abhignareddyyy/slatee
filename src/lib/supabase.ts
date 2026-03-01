import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    console.warn(
        'Supabase credentials not found. The app will run in demo mode.\n' +
        'To enable Supabase, create a .env.local file with:\n' +
        '  VITE_SUPABASE_URL=your-project-url\n' +
        '  VITE_SUPABASE_ANON_KEY=your-anon-key'
    );
}

// Create client only if credentials exist, otherwise create a placeholder
export const supabase: SupabaseClient<Database> = isSupabaseConfigured
    ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
    : createClient<Database>('https://placeholder.supabase.co', 'placeholder-key');
