import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aquhgtvoczbwirvxpmzv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxdWhndHZvY3pid2lydnhwbXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5ODc2ODMsImV4cCI6MjEwMDU2MzY4M30.6guoGm92lvKYW1jMZCot4KIB7xHiAnO8b6kK4mp0fcQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
