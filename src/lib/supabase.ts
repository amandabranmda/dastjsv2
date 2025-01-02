import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supadb.wpp-app.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqeGt2a3Bkd2Jya2FwbWxpcWNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4MjI2NDUsImV4cCI6MjAyMDM5ODY0NX0.RzY_KsK-VSXYm9cUkHT_SSj-T_ZtZhqRX5LAHbjQXKg';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});