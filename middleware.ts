import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware — runs on every request.
 *
 * Public routes (/, /work, /about, /contact, /scoops, /api/revalidate)
 * are let through with no auth check.
 *
 * /admin/* routes are protected — unauthenticated visitors are
 * redirected to /admin/login.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Not an admin route — pass straight through ────────────
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // ── Admin login & auth callback — always public ───────────
  if (pathname === '/admin/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // ── All other /admin/* routes require Supabase auth ───────
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static assets.
     * Public site routes pass through immediately (no auth check).
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf|woff2)$).*)',
  ],
}
