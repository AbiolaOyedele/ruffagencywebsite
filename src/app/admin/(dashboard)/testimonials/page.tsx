'use client'

import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import PageHeader from '@/components/admin/features/PageHeader'
import Card, { CardHeader, CardTitle } from '@/components/admin/ui/Card'
import Button from '@/components/admin/ui/Button'
import Input from '@/components/admin/ui/Input'
import Textarea from '@/components/admin/ui/Textarea'
import Toggle from '@/components/admin/ui/Toggle'
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/repositories/testimonials.repository'
import type { Testimonial } from '@/types/admin-cms.types'

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [addingNew, setAddingNew] = useState(false)
  const [newQuote, setNewQuote] = useState('')
  const [newCredit, setNewCredit] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuote, setEditQuote] = useState('')
  const [editCredit, setEditCredit] = useState('')

  const load = useCallback(async () => {
    try {
      setItems(await getTestimonials())
    } catch {
      toast.error('Failed to load testimonials.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void load() }, [load])

  async function handleCreate() {
    if (!newQuote.trim() || !newCredit.trim()) {
      toast.error('Quote and credit are required.')
      return
    }
    setSaving(true)
    try {
      const item = await createTestimonial({
        quote: newQuote,
        credit: newCredit,
        sort_order: items.length,
        published: true,
      })
      setItems((prev) => [...prev, item])
      setNewQuote('')
      setNewCredit('')
      setAddingNew(false)
      toast.success('Testimonial added.')
    } catch {
      toast.error('Failed to add testimonial.')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(id: string) {
    setSaving(true)
    try {
      const updated = await updateTestimonial(id, { quote: editQuote, credit: editCredit })
      setItems((prev) => prev.map((t) => (t.id === id ? updated : t)))
      setEditingId(null)
      toast.success('Testimonial updated.')
    } catch {
      toast.error('Failed to update testimonial.')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(item: Testimonial) {
    try {
      const updated = await updateTestimonial(item.id, { published: !item.published })
      setItems((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } catch {
      toast.error('Failed to update.')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return
    try {
      await deleteTestimonial(id)
      setItems((prev) => prev.filter((t) => t.id !== id))
      toast.success('Testimonial deleted.')
    } catch {
      toast.error('Failed to delete.')
    }
  }

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Client quotes shown in the rotating section on the home page."
        actions={
          <Button variant="primary" size="sm" onClick={() => setAddingNew(true)}>
            + Add testimonial
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
            <CardHeader><div><CardTitle>New Testimonial</CardTitle></div></CardHeader>
            <div className="grid gap-4">
              <Textarea
                label="Quote"
                value={newQuote}
                onChange={(e) => setNewQuote(e.target.value)}
                rows={3}
                placeholder="The Ruff Agency are animation wizards…"
                required
              />
              <Input
                label="Credit"
                value={newCredit}
                onChange={(e) => setNewCredit(e.target.value)}
                placeholder="Jonathan Lee, Meta"
                required
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

        {items.map((item) => (
          <Card key={item.id} padding="sm">
            {editingId === item.id ? (
              <div className="grid gap-3">
                <Textarea
                  label="Quote"
                  value={editQuote}
                  onChange={(e) => setEditQuote(e.target.value)}
                  rows={3}
                />
                <Input
                  label="Credit"
                  value={editCredit}
                  onChange={(e) => setEditCredit(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" loading={saving} onClick={() => void handleUpdate(item.id)}>
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1e1e23] leading-relaxed line-clamp-2">{item.quote}</p>
                  <p className="mt-1 text-xs font-medium text-[#6b7280]">— {item.credit}</p>
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
                      setEditQuote(item.quote)
                      setEditCredit(item.credit)
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
            <p className="text-[#9ca3af]">No testimonials yet.</p>
          </Card>
        )}
      </div>
    </>
  )
}
