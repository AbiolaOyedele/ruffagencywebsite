'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '@/components/admin/features/PageHeader'
import Card, { CardHeader, CardTitle } from '@/components/admin/ui/Card'
import Button from '@/components/admin/ui/Button'
import Input from '@/components/admin/ui/Input'
import Textarea from '@/components/admin/ui/Textarea'
import Toggle from '@/components/admin/ui/Toggle'
import Badge from '@/components/admin/ui/Badge'
import { getScoops, createScoop, updateScoop, deleteScoop } from '@/repositories/scoops.repository'
import type { Scoop } from '@/types/admin-cms.types'

const EMPTY_SCOOP: Omit<Scoop, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  type: 'job',
  category: '',
  description: '',
  href: '',
  sort_order: 0,
  published: true,
}

export default function ScoopsItemsPage() {
  const [items, setItems] = useState<Scoop[]>([])
  const [loading, setLoading] = useState(true)
  const [addingNew, setAddingNew] = useState(false)
  const [newItem, setNewItem] = useState({ ...EMPTY_SCOOP })
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editItem, setEditItem] = useState<Partial<Scoop>>({})

  const load = useCallback(async () => {
    try {
      setItems(await getScoops())
    } catch {
      toast.error('Failed to load scoops.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  async function handleCreate() {
    if (!newItem.title.trim()) {
      toast.error('Title is required.')
      return
    }
    setSaving(true)
    try {
      const item = await createScoop({ ...newItem, sort_order: items.length })
      setItems((prev) => [...prev, item])
      setNewItem({ ...EMPTY_SCOOP })
      setAddingNew(false)
      toast.success('Scoop added.')
    } catch {
      toast.error('Failed to add scoop.')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(id: string) {
    setSaving(true)
    try {
      const updated = await updateScoop(id, editItem)
      setItems((prev) => prev.map((s) => (s.id === id ? updated : s)))
      setEditingId(null)
      setEditItem({})
      toast.success('Scoop updated.')
    } catch {
      toast.error('Failed to update scoop.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(item: Scoop) {
    try {
      const updated = await updateScoop(item.id, { published: !item.published })
      setItems((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    } catch {
      toast.error('Failed to update.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this scoop?')) return
    try {
      await deleteScoop(id)
      setItems((prev) => prev.filter((s) => s.id !== id))
      toast.success('Scoop deleted.')
    } catch {
      toast.error('Failed to delete.')
    }
  }

  function ScoopFormFields({
    values,
    onChange,
  }: {
    values: Partial<Omit<Scoop, 'id' | 'created_at' | 'updated_at'>>
    onChange: (updates: Partial<Omit<Scoop, 'id' | 'created_at' | 'updated_at'>>) => void
  }) {
    return (
      <div className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Title"
            value={values.title ?? ''}
            onChange={(e) => onChange({ title: e.target.value })}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151]">Type</label>
            <div className="flex gap-2">
              {(['job', 'news'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onChange({ type: t })}
                  className={[
                    'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors capitalize',
                    values.type === t
                      ? 'border-[#1e1e23] bg-[#1e1e23] text-white'
                      : 'border-[#d1d5db] bg-white text-[#374151] hover:border-[#9ca3af]',
                  ].join(' ')}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={values.type === 'job' ? 'Category (e.g. Animation, Design)' : 'Date (e.g. April 2026)'}
            value={values.category ?? ''}
            onChange={(e) => onChange({ category: e.target.value })}
          />
          <Input
            label="Link (href)"
            value={values.href ?? ''}
            onChange={(e) => onChange({ href: e.target.value })}
            hint='Leave blank to show no link, or use "#" for a placeholder.'
          />
        </div>
        <Textarea
          label="Description"
          value={values.description ?? ''}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={2}
        />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Scoops Items"
        description="Job listings and news items on the Scoops page."
        actions={
          <Button variant="primary" size="sm" onClick={() => setAddingNew(true)}>
            + Add scoop
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
            <CardHeader><div><CardTitle>New Scoop</CardTitle></div></CardHeader>
            <ScoopFormFields
              values={newItem}
              onChange={(updates) => setNewItem((prev) => ({ ...prev, ...updates }))}
            />
            <div className="mt-4 flex gap-3">
              <Button variant="primary" size="sm" loading={saving} onClick={() => void handleCreate()}>
                Save
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setAddingNew(false)}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {items.map((item) => (
          <Card key={item.id} padding="sm">
            {editingId === item.id ? (
              <div>
                <ScoopFormFields
                  values={editItem}
                  onChange={(updates) => setEditItem((prev) => ({ ...prev, ...updates }))}
                />
                <div className="mt-4 flex gap-2">
                  <Button variant="primary" size="sm" loading={saving} onClick={() => void handleUpdate(item.id)}>
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setEditItem({}) }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant={item.type === 'job' ? 'purple' : 'success'}>
                      {item.type === 'job' ? 'Job' : 'News'}
                    </Badge>
                    {item.category && (
                      <span className="text-xs text-[#9ca3af]">{item.category}</span>
                    )}
                    {!item.published && <Badge variant="warning">Draft</Badge>}
                  </div>
                  <p className="font-medium text-[#1e1e23] leading-snug">{item.title}</p>
                  {item.description && (
                    <p className="mt-1 text-sm text-[#6b7280] line-clamp-1">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <Toggle
                    checked={item.published}
                    onChange={() => void handleToggle(item)}
                    label={item.published ? 'Live' : 'Draft'}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingId(item.id)
                      setEditItem({
                        title: item.title,
                        type: item.type,
                        category: item.category ?? '',
                        description: item.description ?? '',
                        href: item.href ?? '',
                      })
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => void handleDelete(item.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}

        {!loading && items.length === 0 && !addingNew && (
          <Card className="py-16 text-center">
            <p className="text-[#9ca3af]">No scoops yet.</p>
          </Card>
        )}
      </div>
    </>
  )
}
