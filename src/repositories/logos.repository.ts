import { createClient } from '@/lib/supabase/client'
import type { ClientLogo } from '@/types/admin-cms.types'
import { AppError } from '@/lib/errors'

export async function getLogos(): Promise<ClientLogo[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_client_logos')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    throw new AppError(500, 'Failed to load logos', 'DB_QUERY_LOGOS_FAILED', error)
  }

  return (data ?? []) as ClientLogo[]
}

export async function createLogo(
  logo: Omit<ClientLogo, 'id' | 'created_at' | 'updated_at'>
): Promise<ClientLogo> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_client_logos')
    .insert({ ...logo, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) {
    throw new AppError(500, 'Failed to create logo', 'DB_INSERT_LOGO_FAILED', error)
  }

  return data as ClientLogo
}

export async function updateLogo(
  id: string,
  updates: Partial<Omit<ClientLogo, 'id' | 'created_at'>>
): Promise<ClientLogo> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_client_logos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new AppError(500, 'Failed to update logo', 'DB_UPDATE_LOGO_FAILED', error)
  }

  return data as ClientLogo
}

export async function deleteLogo(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('ruff_client_logos').delete().eq('id', id)

  if (error) {
    throw new AppError(500, 'Failed to delete logo', 'DB_DELETE_LOGO_FAILED', error)
  }
}
