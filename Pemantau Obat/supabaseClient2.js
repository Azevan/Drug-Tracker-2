import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";
const supabaseURL = 'https://blkcrsbwxtamuviehkpj.supabase.co';
const supKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa2Nyc2J3eHRhbXV2aWVoa3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyODM1MDEsImV4cCI6MjA2NTg1OTUwMX0.kvWHOY_7CbHZWobcwJ7vbjYtIrljpEpGPLlOnNyeMOw';
export const supabase = createClient(supabaseURL, supKey);