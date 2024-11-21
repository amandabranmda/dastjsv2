import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://supab-js.wpp-app.com/'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzMwNTE2NDAwLAogICJleHAiOiAxODg4MjgyODAwCn0.iILecVtVGXHXB7s75F2tkd_u05vOL_kcJdiegX9ZpcI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})