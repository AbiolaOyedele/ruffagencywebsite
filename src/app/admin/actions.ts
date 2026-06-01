'use server'

/**
 * Admin Server Actions
 *
 * All writes use the Supabase SERVICE ROLE key — this bypasses RLS
 * and ensures saves always succeed regardless of session state.
 * The service role key is never sent to the browser.
 */

import { createClient } from '@supabase/supabase-js'
import type { SettingsKey, SettingsValue } from '@/types/admin-cms.types'
import type { Json } from '@/types/database.types'

// ── Admin Supabase client (service role) ─────────────────────────────────────

function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase admin credentials not configured.')
  return createClient(url, key, { auth: { persistSession: false } })
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function saveSettingAction<K extends SettingsKey>(
  key: K,
  value: SettingsValue<K>,
): Promise<void> {
  const supabase = getAdminSupabase()

  const { error } = await supabase.from('ruff_settings').upsert(
    { key, value: value as unknown as Json, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  )
  if (error) throw new Error(`Failed to save "${key}": ${error.message}`)

  await pingRevalidate()
}

// ── Logos ─────────────────────────────────────────────────────────────────────

export async function createLogoAction(
  logo: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('ruff_client_logos')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(logo as any)
    .select()
    .single()
  if (error) throw new Error(`Failed to create logo: ${error.message}`)
  await pingRevalidate()
  return data as Record<string, unknown>
}

export async function updateLogoAction(
  id: string,
  updates: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('ruff_client_logos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Failed to update logo: ${error.message}`)
  await pingRevalidate()
  return data as Record<string, unknown>
}

export async function deleteLogoAction(id: string): Promise<void> {
  const supabase = getAdminSupabase()
  const { error } = await supabase.from('ruff_client_logos').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete logo: ${error.message}`)
  await pingRevalidate()
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function updateProjectAction(
  id: string,
  updates: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('ruff_projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Failed to update project: ${error.message}`)
  await pingRevalidate()
  return data as Record<string, unknown>
}

export async function deleteProjectAction(id: string): Promise<void> {
  const supabase = getAdminSupabase()
  const { error } = await supabase.from('ruff_projects').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete project: ${error.message}`)
  await pingRevalidate()
}

export async function upsertProjectAction(
  project: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('ruff_projects')
    .upsert(project as any)
    .select()
    .single()
  if (error) throw new Error(`Failed to save project: ${error.message}`)
  await pingRevalidate()
  return data as Record<string, unknown>
}

// ── Testimonials ──────────────────────────────────────────────────────────────

export async function createTestimonialAction(
  item: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('ruff_testimonials')
    .insert(item as any)
    .select()
    .single()
  if (error) throw new Error(`Failed to create testimonial: ${error.message}`)
  await pingRevalidate()
  return data as Record<string, unknown>
}

export async function updateTestimonialAction(
  id: string,
  updates: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('ruff_testimonials')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Failed to update testimonial: ${error.message}`)
  await pingRevalidate()
  return data as Record<string, unknown>
}

export async function deleteTestimonialAction(id: string): Promise<void> {
  const supabase = getAdminSupabase()
  const { error } = await supabase.from('ruff_testimonials').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete testimonial: ${error.message}`)
  await pingRevalidate()
}

// ── Scoops ────────────────────────────────────────────────────────────────────

export async function createScoopAction(
  item: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('ruff_scoops')
    .insert(item as any)
    .select()
    .single()
  if (error) throw new Error(`Failed to create scoop: ${error.message}`)
  await pingRevalidate()
  return data as Record<string, unknown>
}

export async function updateScoopAction(
  id: string,
  updates: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('ruff_scoops')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(`Failed to update scoop: ${error.message}`)
  await pingRevalidate()
  return data as Record<string, unknown>
}

export async function deleteScoopAction(id: string): Promise<void> {
  const supabase = getAdminSupabase()
  const { error } = await supabase.from('ruff_scoops').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete scoop: ${error.message}`)
  await pingRevalidate()
}

// ── Revalidation helper ───────────────────────────────────────────────────────

async function pingRevalidate(): Promise<void> {
  const url = process.env.WEBSITE_URL
  const secret = process.env.WEBSITE_REVALIDATE_SECRET
  if (!url || !secret) return
  await fetch(`${url}/api/revalidate`, {
    method: 'POST',
    headers: { 'x-revalidate-secret': secret },
    signal: AbortSignal.timeout(5000),
  }).catch(() => {})
}
