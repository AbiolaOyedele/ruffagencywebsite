'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'
import PageHeader from '@/components/admin/features/PageHeader'
import Button from '@/components/admin/ui/Button'
import Badge from '@/components/admin/ui/Badge'
import Card from '@/components/admin/ui/Card'
import Toggle from '@/components/admin/ui/Toggle'
import { getProjects } from '@/repositories/projects.repository'
import { updateProjectAction, deleteProjectAction } from '@/app/admin/actions'
import type { Project } from '@/types/admin-cms.types'

const CATEGORY_LABELS: Record<string, string> = {
  featured: 'Featured',
  ads: 'Ads & Explainers',
  design: 'Design',
  brand: 'Brand Systems',
  mascots: 'Mascots',
  '3d': '3D',
  studio: 'Studio',
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await getProjects()
      setProjects(data)
    } catch {
      toast.error('Failed to load projects.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function handleTogglePublished(project: Project) {
    try {
      const updated = await updateProjectAction(project.id, { published: !project.published })
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated as unknown as Project : p)))
      toast.success(updated.published ? 'Project published.' : 'Project unpublished.')
    } catch {
      toast.error('Failed to update project.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this project? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteProjectAction(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      toast.success('Project deleted.')
    } catch {
      toast.error('Failed to delete project.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Projects"
        description="All work projects shown on the Work page and Home page."
        actions={
          <Link href="/projects/new">
            <Button variant="primary" size="sm">+ New project</Button>
          </Link>
        }
      />

      <div className="p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#1e1e23]" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="py-16 text-center">
            <p className="text-[#9ca3af]">No projects yet.</p>
            <Link href="/projects/new" className="mt-4 inline-block">
              <Button variant="primary" size="sm">Add first project</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <Card key={project.id} padding="sm">
                <div className="flex items-center gap-4">
                  {/* Color swatch */}
                  <div
                    className="h-12 w-12 flex-shrink-0 rounded-lg border border-[#e5e7eb]"
                    style={{ backgroundColor: project.bg_color }}
                  />

                  {/* Thumbnail */}
                  {project.image_url && (
                    <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded border border-[#e5e7eb]">
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                        unoptimized
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-[#1e1e23] truncate">{project.title}</p>
                      {project.is_featured && <Badge variant="purple">Featured</Badge>}
                      {!project.published && <Badge variant="warning">Draft</Badge>}
                    </div>
                    <p className="text-sm text-[#6b7280]">{project.client}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {project.categories.map((cat) => (
                        <Badge key={cat} variant="default">
                          {CATEGORY_LABELS[cat] ?? cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Sort order */}
                  <div className="hidden lg:flex flex-col items-center text-xs text-[#9ca3af] flex-shrink-0">
                    <span>Order</span>
                    <span className="font-mono font-bold">{project.sort_order}</span>
                  </div>

                  {/* Published toggle */}
                  <div className="flex-shrink-0">
                    <Toggle
                      checked={project.published}
                      onChange={() => void handleTogglePublished(project)}
                      label={project.published ? 'Live' : 'Draft'}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="secondary" size="sm">Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      loading={deletingId === project.id}
                      onClick={() => void handleDelete(project.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
