import { createClient } from '@/lib/supabase/client'
import type { Json } from '@/types/database.types'
import type { SettingsKey, SettingsValue } from '@/types/admin-cms.types'
import { AppError } from '@/lib/errors'

export async function getSetting<K extends SettingsKey>(
  key: K
): Promise<SettingsValue<K> | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // row not found
    throw new AppError(500, 'Failed to load setting', 'DB_QUERY_SETTING_NOT_FOUND', error)
  }

  // The value column is JSONB — cast through unknown as the shape is controlled by SettingsKey
  return data.value as unknown as SettingsValue<K>
}

export async function upsertSetting<K extends SettingsKey>(
  key: K,
  value: SettingsValue<K>
): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('ruff_settings').upsert(
    {
      key,
      // Cast through Json: the value is always a JSON-serialisable object matching SettingsValue<K>
      value: value as unknown as Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'key' }
  )

  if (error) {
    throw new AppError(500, 'Failed to save setting', 'DB_UPSERT_SETTING_FAILED', error)
  }

  // Notify the website to clear its cache so the change is visible immediately.
  // Fails silently — a failed revalidation is not a blocker for the save.
  await triggerWebsiteRevalidation()
}

/**
 * Calls the Next.js website's /api/revalidate endpoint so it serves
 * fresh CMS data on the next page load.
 */
async function triggerWebsiteRevalidation(): Promise<void> {
  const websiteUrl = process.env.WEBSITE_URL
  const secret     = process.env.WEBSITE_REVALIDATE_SECRET

  if (!websiteUrl || !secret) return

  try {
    await fetch(`${websiteUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'x-revalidate-secret': secret },
      // Short timeout — don't hold up the admin save response
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    // Non-fatal — the website will serve fresh data on the next natural cache expiry
    console.warn('[admin] Website revalidation ping failed — website may show stale data briefly')
  }
}
