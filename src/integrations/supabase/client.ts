// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://dihvcgtshzhuwnfxhfnu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaHZjZ3RzaHpodXduZnhoZm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MTc0ODAsImV4cCI6MjA0OTE5MzQ4MH0.6eBm1nNjSwEosKFGkMisTg1HXI7GmtbJvB5ouSVDOT8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);