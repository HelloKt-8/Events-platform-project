import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://xuxdrvauvgtomykhujkj.supabase.co"; 
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1eGRydmF1dmd0b215a2h1amtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0OTY4ODIsImV4cCI6MjA1MzA3Mjg4Mn0.wUtEfx7WqNxrxj24mmx_v8xq-1ZEyxg1ng_ZUe44JB0"; 

export const supabase = createClient(supabaseUrl, supabaseKey);
