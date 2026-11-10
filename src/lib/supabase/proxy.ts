import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, { cookies: { getAll: () => request.cookies.getAll(), setAll(cookiesToSet, headers) {
      // Supabase SSR versions/adapters may omit the optional response headers.
      // Always process cookie updates, and only copy headers when supplied.
      cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
      response = NextResponse.next({ request });
      cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      for (const [name, value] of Object.entries(headers ?? {})) {
        response.headers.set(name, value);
      }
    } } });
  const { data } = await supabase.auth.getClaims();
  const loggedIn = !!data?.claims;
  const path = request.nextUrl.pathname;
  if (!loggedIn && path.startsWith('/app')) { const u=request.nextUrl.clone(); u.pathname='/login'; return NextResponse.redirect(u); }
  if (loggedIn && (path==='/login'||path==='/register')) { const u=request.nextUrl.clone(); u.pathname='/app'; return NextResponse.redirect(u); }
  return response;
}
