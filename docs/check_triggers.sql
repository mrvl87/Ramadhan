-- Run this in your Supabase SQL Editor to find HIDDEN triggers
select 
    trigger_schema,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
from information_schema.triggers
where event_object_schema = 'auth'
  and event_object_table = 'users';

-- Check if there are any Auth Hooks configured
select * from information_schema.tables 
where table_schema = 'supabase_functions' 
  and table_name = 'hooks';
