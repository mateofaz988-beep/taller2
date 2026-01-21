import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    'https://eoagcrwjzxnohmainmdc.supabase.co',
    'sb_publishable_d3ac8knqfSUbxfJI2YiV7w_V8Yyau6C'
)