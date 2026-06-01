import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/features/PageHeader'
import ProjectForm from '@/components/admin/features/ProjectForm'
import type { Project } from '@/types/admin-cms.types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('ruff_projects').select('*').eq('id', id).single()

  if (!data) notFound()

  return (
    <>
      <PageHeader
        title={`Edit: ${(data as Project).title}`}
        description={`Client: ${(data as Project).client}`}
      />
      <ProjectForm initial={data as Project} />
    </>
  )
}
