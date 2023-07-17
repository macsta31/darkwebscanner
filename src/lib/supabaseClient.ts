import { createClient } from '@supabase/supabase-js'

// console.log(env.SECRET_SUPABASEANON, env.SECRET_SUPABASEURL)

export const supabase = createClient("https://izeiladsjnpvparvnxoe.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6ZWlsYWRzam5wdnBhcnZueG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2MTI4MDksImV4cCI6MjAwNTE4ODgwOX0.M-noIDQKHu4U030DSTZlMzPN3o9rZmKg7Y1VU5nB4Mw")