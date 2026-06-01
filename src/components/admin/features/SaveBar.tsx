'use client'

import Button from '@/components/admin/ui/Button'

interface SaveBarProps {
  isDirty: boolean
  saving: boolean
  onSave: () => void
  onReset: () => void
}

export default function SaveBar({ isDirty, saving, onSave, onReset }: SaveBarProps) {
  if (!isDirty && !saving) return null

  return (
    <div className="fixed bottom-0 left-60 right-0 z-50 border-t border-[#e5e7eb] bg-white px-8 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6b7280]">You have unsaved changes.</p>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onReset} disabled={saving}>
            Discard
          </Button>
          <Button variant="primary" size="sm" loading={saving} onClick={onSave}>
            Save changes
          </Button>
        </div>
      </div>
    </div>
  )
}
