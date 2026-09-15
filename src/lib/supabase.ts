import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mbnwtelvfzjofeeviutg.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ibnd0ZWx2Znpqb2ZlZXZpdXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMzU2MzksImV4cCI6MjEwMzkxMTYzOX0.M7sQ4UXvEQAPfL5z_Ne07MH8WwK1KpXGywcQ4UEu8ws';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
