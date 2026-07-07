import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yjcjaysxznmjuvjyhslt.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZcMDCIAzcgzuh-0D7iEPiQ_aGOSvn4G';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);