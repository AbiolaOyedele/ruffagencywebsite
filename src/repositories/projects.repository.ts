import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/types/admin-cms.types'
import { AppError } from '@/lib/errors'

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    throw new AppError(500, 'Failed to load projects', 'DB_QUERY_PROJECTS_FAILED', error)
  }

  return (data ?? []) as Project[]
}

export async function getProject(id: string): Promise<Project | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new AppError(500, 'Failed to load project', 'DB_QUERY_PROJECT_NOT_FOUND', error)
  }

  return data as Project
}

export async function createProject(
  project: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_projects')
    .insert({ ...project, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) {
    throw new AppError(500, 'Failed to create project', 'DB_INSERT_PROJECT_FAILED', error)
  }

  return data as Project
}

export async function updateProject(
  id: string,
  updates: Partial<Omit<Project, 'id' | 'created_at'>>
): Promise<Project> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new AppError(500, 'Failed to update project', 'DB_UPDATE_PROJECT_FAILED', error)
  }

  return data as Project
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('ruff_projects').delete().eq('id', id)

  if (error) {
    throw new AppError(500, 'Failed to delete project', 'DB_DELETE_PROJECT_FAILED', error)
  }
}

export async function updateProjectOrder(
  updates: Array<{ id: string; sort_order: number }>
): Promise<void> {
  const supabase = createClient()

  const promises = updates.map(({ id, sort_order }) =>
    supabase.from('ruff_projects').update({ sort_order, updated_at: new Date().toISOString() }).eq('id', id)
  )

  const results = await Promise.all(promises)
  const failed = results.find(({ error }) => error)

  if (failed?.error) {
    throw new AppError(500, 'Failed to reorder projects', 'DB_UPDATE_PROJECT_ORDER_FAILED', failed.error)
  }
}
