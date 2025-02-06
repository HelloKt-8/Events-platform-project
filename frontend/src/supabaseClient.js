import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xuxdrvauvgtomykhujkj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eGRydmF1dmd0b215a2h1amtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0OTY4ODIsImV4cCI6MjA1MzA3Mjg4Mn0.wUtEfx7WqNxrxj24mmx_v8xq-1ZEyxg1ng_ZUe44JB0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;

