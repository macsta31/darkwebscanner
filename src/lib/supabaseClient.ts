import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASEANON, PUBLIC_SUPABASEURL } from '$env/static/public'

// console.log(env.SECRET_SUPABASEANON, env.SECRET_SUPABASEURL)

export const supabase = createClient(PUBLIC_SUPABASEURL, PUBLIC_SUPABASEANON)