import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://uicpxdjkiielsbzbvqbc.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_sm4KUmveDKckQSV7F0kHBw_hPoTCzDd"

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
)
