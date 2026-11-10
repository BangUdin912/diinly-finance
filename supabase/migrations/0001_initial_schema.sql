-- DiinLy Finance: run this file in Supabase SQL Editor.
create extension if not exists pgcrypto;
create table if not exists public.accounts (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, type text not null check (type in ('bank','ewallet','cash')), provider text,
 balance numeric(16,2) not null default 0 check (balance >= 0), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.transactions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 type text not null check (type in ('income','expense','transfer')), category text not null, amount numeric(16,2) not null check (amount > 0),
 description text, transaction_date date not null default current_date,
 account_id uuid references public.accounts(id) on delete set null,
 to_account_id uuid references public.accounts(id) on delete set null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 constraint transfer_accounts_check check (type <> 'transfer' or (account_id is not null and to_account_id is not null and account_id <> to_account_id))
);
create table if not exists public.budgets (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 category text not null, amount numeric(16,2) not null check (amount > 0), month text not null check (month ~ '^[0-9]{4}-[0-9]{2}$'), created_at timestamptz not null default now(),
 unique(user_id,category,month)
);
create table if not exists public.savings_goals (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 name text not null, target_amount numeric(16,2) not null check (target_amount > 0), saved_amount numeric(16,2) not null default 0 check (saved_amount >= 0), target_date date, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists transactions_user_date_idx on public.transactions(user_id, transaction_date desc);
create index if not exists accounts_user_idx on public.accounts(user_id);
create index if not exists budgets_user_month_idx on public.budgets(user_id,month);
create index if not exists savings_goals_user_idx on public.savings_goals(user_id);
alter table public.accounts enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.savings_goals enable row level security;
create policy "accounts_select_own" on public.accounts for select to authenticated using ((select auth.uid())=user_id);
create policy "accounts_insert_own" on public.accounts for insert to authenticated with check ((select auth.uid())=user_id);
create policy "accounts_update_own" on public.accounts for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "accounts_delete_own" on public.accounts for delete to authenticated using ((select auth.uid())=user_id);
create policy "transactions_select_own" on public.transactions for select to authenticated using ((select auth.uid())=user_id);
create policy "transactions_insert_own" on public.transactions for insert to authenticated with check ((select auth.uid())=user_id);
create policy "transactions_update_own" on public.transactions for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "transactions_delete_own" on public.transactions for delete to authenticated using ((select auth.uid())=user_id);
create policy "budgets_select_own" on public.budgets for select to authenticated using ((select auth.uid())=user_id);
create policy "budgets_insert_own" on public.budgets for insert to authenticated with check ((select auth.uid())=user_id);
create policy "budgets_update_own" on public.budgets for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "budgets_delete_own" on public.budgets for delete to authenticated using ((select auth.uid())=user_id);
create policy "goals_select_own" on public.savings_goals for select to authenticated using ((select auth.uid())=user_id);
create policy "goals_insert_own" on public.savings_goals for insert to authenticated with check ((select auth.uid())=user_id);
create policy "goals_update_own" on public.savings_goals for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "goals_delete_own" on public.savings_goals for delete to authenticated using ((select auth.uid())=user_id);
-- Ensure an account referenced by a transaction belongs to the same user.
create or replace function public.check_transaction_account_owner() returns trigger language plpgsql set search_path=public as $$
begin
 if new.account_id is not null and not exists(select 1 from public.accounts a where a.id=new.account_id and a.user_id=new.user_id) then raise exception 'Akun sumber tidak valid untuk pengguna ini'; end if;
 if new.to_account_id is not null and not exists(select 1 from public.accounts a where a.id=new.to_account_id and a.user_id=new.user_id) then raise exception 'Akun tujuan tidak valid untuk pengguna ini'; end if;
 return new;
end; $$;
drop trigger if exists transactions_check_account_owner on public.transactions;
create trigger transactions_check_account_owner before insert or update on public.transactions for each row execute function public.check_transaction_account_owner();

-- Keep account balances in sync with posted transactions (including transfers).
create or replace function public.apply_transaction_balance() returns trigger
language plpgsql set search_path=public as $$
begin
 if tg_op in ('UPDATE','DELETE') then
   if old.account_id is not null then
     if old.type='income' then update public.accounts set balance=balance-old.amount where id=old.account_id and user_id=old.user_id;
     elsif old.type='expense' then update public.accounts set balance=balance+old.amount where id=old.account_id and user_id=old.user_id;
     elsif old.type='transfer' then
       update public.accounts set balance=balance+old.amount where id=old.account_id and user_id=old.user_id;
       if old.to_account_id is not null then update public.accounts set balance=balance-old.amount where id=old.to_account_id and user_id=old.user_id; end if;
     end if;
   end if;
 end if;
 if tg_op in ('INSERT','UPDATE') then
   if new.account_id is not null then
     if new.type='income' then update public.accounts set balance=balance+new.amount where id=new.account_id and user_id=new.user_id;
     elsif new.type='expense' then update public.accounts set balance=balance-new.amount where id=new.account_id and user_id=new.user_id;
     elsif new.type='transfer' then
       update public.accounts set balance=balance-new.amount where id=new.account_id and user_id=new.user_id;
       update public.accounts set balance=balance+new.amount where id=new.to_account_id and user_id=new.user_id;
     end if;
   end if;
 end if;
 if tg_op='DELETE' then return old; else return new; end if;
end; $$;
drop trigger if exists transactions_apply_balance on public.transactions;
create trigger transactions_apply_balance after insert or update or delete on public.transactions for each row execute function public.apply_transaction_balance();

-- Data API permissions; RLS remains the row-level security boundary.
grant select, insert, update, delete on public.accounts, public.transactions, public.budgets, public.savings_goals to authenticated;
