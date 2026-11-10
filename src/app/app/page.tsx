import { FinanceApp } from '@/components/finance-app';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
export default async function AppPage(){const supabase=await createClient();const {data,error}=await supabase.auth.getClaims();if(error||!data?.claims)redirect('/login');return <FinanceApp email={String(data.claims.email??'')} userId={String(data.claims.sub??'')}/>}
