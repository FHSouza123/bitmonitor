import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://klscaqnzzhcsimsrbuob.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsc2NhcW56emhjc2ltc3JidW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NzU0NDEsImV4cCI6MjA2MzI1MTQ0MX0.caYRtBtVDZwxcFNzp8B-uK2FFIUgjtNLZbgWXghFNys';
export const supabase = createClient(supabaseUrl, supabaseKey); 