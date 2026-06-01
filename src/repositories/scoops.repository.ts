import { createClient } from '@/lib/supabase/client'
import type { Scoop } from '@/types/admin-cms.types'
import { AppError } from '@/lib/errors'

export async function getScoops(): Promise<Scoop[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_scoops')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    throw new AppError(500, 'Failed to load scoops', 'DB_QUERY_SCOOPS_FAILED', error)
  }

  return (data ?? []) as Scoop[]
}

export async function createScoop(
  scoop: Omit<Scoop, 'id' | 'created_at' | 'updated_at'>
): Promise<Scoop> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_scoops')
    .insert({ ...scoop, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) {
    throw new AppError(500, 'Failed to create scoop', 'DB_INSERT_SCOOP_FAILED', error)
  }

  return data as Scoop
}

export async function updateScoop(
  id: string,
  updates: Partial<Omit<Scoop, 'id' | 'created_at'>>
): Promise<Scoop> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_scoops')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new AppError(500, 'Failed to update scoop', 'DB_UPDATE_SCOOP_FAILED', error)
  }

  return data as Scoop
}

export async function deleteScoop(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('ruff_scoops').delete().eq('id', id)

  if (error) {
    throw new AppError(500, 'Failed to delete scoop', 'DB_DELETE_SCOOP_FAILED', error)
  }
}
