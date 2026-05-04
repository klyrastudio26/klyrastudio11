// Central Supabase configuration for the entire app.
// Update these values when switching Supabase projects.
const supabaseUrl = 'https://tnwkqhatfjtepfulxsoy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRud2txaGF0Zmp0ZXBmdWx4c295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4ODE3NDIsImV4cCI6MjA5MzQ1Nzc0Mn0.B9Lyt_hSTiuyAX3h2XoObh-ZDwh1ZGX-qbFNIF6UVws';

window.supabase = supabase.createClient(supabaseUrl, supabaseKey);
