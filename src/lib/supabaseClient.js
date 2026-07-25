import { createClient } from '@supabase/supabase-js';

// Default Supabase project credentials (replaceable via .env or VITE_SUPABASE_URL)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://voicedrop-cloud.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvaWNlZHJvcCIsInJvbGUiOiJhb24iLCJpYXQiOjE3NTM0NTk4MDAsImV4cCI6MjA2OTAzNTgwMH0.demoKey';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
