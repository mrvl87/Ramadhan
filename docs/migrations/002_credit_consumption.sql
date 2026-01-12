-- Migration: 002_credit_consumption
-- Goal: Implement usage_log and consume_credit transformation

-- 1. Create usage_log table
create table if not exists public.usage_log (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  feature_name text not null,
  cost integer not null default 1,
  created_at timestamp with time zone default now()
);

-- Secure usage_log: No one can read/write directly from client
alter table public.usage_log enable row level security;
-- No policies created means DENY ALL by default for client. 
-- Functions with SECURITY DEFINER can still write to it.

-- 2. Create consume_credit function
create or replace function public.consume_credit(target_user_id uuid, feature_name text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  entitlement jsonb;
  current_credits int;
  user_is_pro boolean;
  new_credits int;
    txn_cost int := 1; -- Cost is fixed at 1 for now
begin
  -- 1. Security Check
  if auth.uid() is null or auth.uid() <> target_user_id then
    raise exception 'Access Denied: You can only consume your own credits.';
  end if;

  -- 2. Lock User Row & Get Entitlement
  -- We lock the row to prevent race conditions (double spending)
  perform 1 from public.users where id = target_user_id for update;
  
  -- Get current status
  entitlement := public.get_user_entitlement(target_user_id);
  user_is_pro := (entitlement->>'is_pro')::boolean;
  current_credits := (entitlement->>'credits')::int;
  
  -- 3. Check Eligibility
  if (entitlement->>'can_generate')::boolean = false then
    raise exception 'Insufficient entitlement: Please upgrade or buy credits.';
  end if;

  -- 4. Process Consumption
  if user_is_pro then
    -- Pro users don't spend credits
    new_credits := current_credits;
  else
    -- Free users spend credits
    if current_credits < txn_cost then
       raise exception 'Insufficient credits.';
    end if;
    
    new_credits := current_credits - txn_cost;
    
    update public.users 
    set credits = new_credits 
    where id = target_user_id;
  end if;

  -- 5. Log Usage
  insert into public.usage_log (user_id, feature_name, cost)
  values (target_user_id, feature_name, txn_cost);

  -- 6. Return Result
  return jsonb_build_object(
    'is_pro', user_is_pro,
    'remaining_credits', new_credits,
    'consumed', txn_cost
  );
end;
$$;
