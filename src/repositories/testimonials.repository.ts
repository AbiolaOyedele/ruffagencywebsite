import { createClient } from '@/lib/supabase/client'
import type { Testimonial } from '@/types/admin-cms.types'
import { AppError } from '@/lib/errors'

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_testimonials')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    throw new AppError(500, 'Failed to load testimonials', 'DB_QUERY_TESTIMONIALS_FAILED', error)
  }

  return (data ?? []) as Testimonial[]
}

export async function createTestimonial(
  testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
): Promise<Testimonial> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_testimonials')
    .insert({ ...testimonial, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) {
    throw new AppError(500, 'Failed to create testimonial', 'DB_INSERT_TESTIMONIAL_FAILED', error)
  }

  return data as Testimonial
}

export async function updateTestimonial(
  id: string,
  updates: Partial<Omit<Testimonial, 'id' | 'created_at'>>
): Promise<Testimonial> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('ruff_testimonials')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new AppError(500, 'Failed to update testimonial', 'DB_UPDATE_TESTIMONIAL_FAILED', error)
  }

  return data as Testimonial
}

export async function deleteTestimonial(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('ruff_testimonials').delete().eq('id', id)

  if (error) {
    throw new AppError(500, 'Failed to delete testimonial', 'DB_DELETE_TESTIMONIAL_FAILED', error)
  }
}
