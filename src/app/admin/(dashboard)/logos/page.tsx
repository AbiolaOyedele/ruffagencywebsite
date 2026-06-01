'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import toast from 'react-hot-toast'
import PageHeader from '@/components/admin/features/PageHeader'
import Card from '@/components/admin/ui/Card'
import Button from '@/components/admin/ui/Button'
import Input from '@/components/admin/ui/Input'
import Toggle from '@/components/admin/ui/Toggle'
import ImageUpload from '@/components/admin/ui/ImageUpload'
import { getLogos } from '@/repositories/logos.repository'
import { createLogoAction, updateLogoAction, deleteLogoAction } from '@/app/admin/actions'
import type { ClientLogo } from '@/types/admin-cms.types'

export default function LogosPage() {
  const [logos, setLogos] = useState<ClientLogo[]>([])
  const [loading, setLoading] = useState(true)
  const [addingNew, setAddingNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      setLogos(await getLogos())
    } catch {
      toast.error('Failed to load logos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  async function handleCreate() {
    if (!newTitle.trim() || !newUrl.trim()) {
      toast.error('Title and image URL are required.')
      return
    }
    setSaving(true)
    try {
      const logo = await createLogoAction({
        title: newTitle,
        image_url: newUrl,
        sort_order: logos.length,
        published: true,
      })
      setLogos((prev) => [...prev, logo as unknown as ClientLogo])
      setNewTitle('')
      setNewUrl('')
      setAddingNew(false)
      toast.success('Logo added.')
    } catch {
      toast.error('Failed to add logo.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(logo: ClientLogo) {
    try {
      const updated = await updateLogoAction(logo.id, { published: !logo.published })
      setLogos((prev) => prev.map((l) => (l.id === updated.id ? updated as unknown as ClientLogo : l)))
    } catch {
      toast.error('Failed to update.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this logo from the marquee?')) return
    try {
      await deleteLogoAction(id)
      setLogos((prev) => prev.filter((l) => l.id !== id))
      toast.success('Logo removed.')
    } catch {
      toast.error('Failed to delete.')
    }
  }

  return (
    <>
      <PageHeader
        title="Client Logos"
        description="Logos shown in the marquee strip on the home and work pages."
        actions={
          <Button variant="primary" size="sm" onClick={() => setAddingNew(true)}>
            + Add logo
          </Button>
        }
      />

      <div className="p-8 space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e5e7eb] border-t-[#1e1e23]" />
          </div>
        )}

        {addingNew && (
          <Card>
            <p className="mb-4 font-medium text-[#1e1e23]">New Logo</p>
            <div className="grid gap-4">
              <Input
                label="Client name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Google"
              />
              <ImageUpload
                label="Logo image (SVG or PNG recommended)"
                value={newUrl}
                onChange={setNewUrl}
                hint="SVG recommended for crisp display at all sizes."
              />
              <div className="flex gap-3">
                <Button variant="primary" size="sm" loading={saving} onClick={() => void handleCreate()}>
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setAddingNew(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {logos.map((logo) => (
            <Card key={logo.id} padding="sm">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-16 flex-shrink-0 overflow-hidden rounded border border-[#e5e7eb] bg-white">
                  <Image
                    src={logo.image_url}
                    alt={logo.title}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1e1e23] truncate">{logo.title}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Toggle
                    checked={logo.published}
                    onChange={() => void handleToggle(logo)}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => void handleDelete(logo.id)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {!loading && logos.length === 0 && !addingNew && (
          <Card className="py-16 text-center">
            <p className="text-[#9ca3af]">No logos yet.</p>
          </Card>
        )}
      </div>
    </>
  )
}
