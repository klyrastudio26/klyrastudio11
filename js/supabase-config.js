// Central Supabase configuration for the entire app.
// Update these values when switching Supabase projects.
const supabaseUrl = 'https://ornaknccgxnoegcuptzi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ybmFrbmNjZ3hub2VnY3VwdHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjY1NTcsImV4cCI6MjA5MzMwMjU1N30.Wy19Iwm-tdcApEpMBt1IEn6XWSe9-FvPpZI03feV9DA';
window.supabase = supabase.createClient(supabaseUrl, supabaseKey)