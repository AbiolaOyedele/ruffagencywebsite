import { type NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

/**
 * POST /api/revalidate
 * Called by the admin panel after any content save.
 * Clears the Next.js cache so the next page load serves fresh CMS data.
 *
 * Requires header: x-revalidate-secret matching REVALIDATE_SECRET env var.
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-revalidate-secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Revalidate every page — layout covers shared nav/footer
  revalidatePath('/', 'layout')

  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() })
}
