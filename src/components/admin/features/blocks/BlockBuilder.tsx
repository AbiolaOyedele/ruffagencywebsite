'use client'

import { useState } from 'react'
import {
  Type,
  Image,
  LayoutTemplate,
  Columns2,
  Play,
  Grid2X2,
  ChevronUp,
  ChevronDown,
  X,
  Plus,
  type LucideIcon,
} from 'lucide-react'
import BlockEditor from './BlockEditor'
import { BLOCK_LABELS, defaultBlock, type AdminBlock, type AdminBlockType } from './types'

interface BlockBuilderProps {
  blocks: AdminBlock[]
  onChange: (blocks: AdminBlock[]) => void
}

const BLOCK_TYPES: AdminBlockType[] = [
  'textBlock',
  'imageBlock',
  'imageTextBlock',
  'twoColumnText',
  'videoBlock',
  'imageGallery',
]

const BLOCK_ICONS: Record<AdminBlockType, LucideIcon> = {
  textBlock:      Type,
  imageBlock:     Image,
  imageTextBlock: LayoutTemplate,
  twoColumnText:  Columns2,
  videoBlock:     Play,
  imageGallery:   Grid2X2,
}

export default function BlockBuilder({ blocks, onChange }: BlockBuilderProps) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  function addBlock(type: AdminBlockType) {
    const block = defaultBlock(type)
    onChange([...blocks, block])
    setOpenKey(block._key)
    setShowAddMenu(false)
  }

  function updateBlock(key: string, updated: AdminBlock) {
    onChange(blocks.map(b => b._key === key ? updated : b))
  }

  function removeBlock(key: string) {
    onChange(blocks.filter(b => b._key !== key))
    if (openKey === key) setOpenKey(null)
  }

  function moveBlock(key: string, dir: 'up' | 'down') {
    const idx = blocks.findIndex(b => b._key === key)
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === blocks.length - 1) return
    const next = [...blocks]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {/* Empty state */}
      {blocks.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-[#e5e7eb] p-8 text-center">
          <p className="text-sm text-[#9ca3af]">No content blocks yet.</p>
          <p className="text-xs text-[#9ca3af] mt-1">Click &ldquo;Add block&rdquo; to start building.</p>
        </div>
      )}

      {/* Block list */}
      {blocks.map((block, idx) => {
        const isOpen = openKey === block._key
        const Icon = BLOCK_ICONS[block._type]

        return (
          <div key={block._key} className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
            {/* Block header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#f9fafb] border-b border-[#e5e7eb]">
              <Icon className="w-4 h-4 text-[#6b7280] flex-shrink-0" />
              <span className="text-sm font-medium text-[#1e1e23] flex-1">
                {BLOCK_LABELS[block._type]}
              </span>

              {/* Move up/down */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => moveBlock(block._key, 'up')}
                  disabled={idx === 0}
                  className="w-7 h-7 flex items-center justify-center rounded text-[#9ca3af] hover:text-[#1e1e23] hover:bg-[#e5e7eb] disabled:opacity-30 transition-colors"
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(block._key, 'down')}
                  disabled={idx === blocks.length - 1}
                  className="w-7 h-7 flex items-center justify-center rounded text-[#9ca3af] hover:text-[#1e1e23] hover:bg-[#e5e7eb] disabled:opacity-30 transition-colors"
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Expand/collapse */}
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : block._key)}
                className="text-xs font-medium text-[#6b7280] hover:text-[#1e1e23] transition-colors px-2 py-1 rounded hover:bg-[#e5e7eb]"
              >
                {isOpen ? 'Collapse' : 'Edit'}
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => { if (confirm('Remove this block?')) removeBlock(block._key) }}
                className="w-7 h-7 flex items-center justify-center rounded text-[#9ca3af] hover:text-[#ef4444] hover:bg-red-50 transition-colors"
                title="Remove block"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Block editor */}
            {isOpen && (
              <div className="p-4">
                <BlockEditor
                  block={block}
                  onChange={(updated) => updateBlock(block._key, updated)}
                />
              </div>
            )}
          </div>
        )
      })}

      {/* Add block button */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full rounded-xl border-2 border-dashed border-[#d1d5db] py-3 text-sm font-medium text-[#6b7280] hover:border-[#1e1e23] hover:text-[#1e1e23] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add block
        </button>

        {showAddMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowAddMenu(false)} />
            <div className="absolute bottom-full mb-2 left-0 right-0 z-20 bg-white rounded-xl border border-[#e5e7eb] shadow-lg overflow-hidden">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#9ca3af] border-b border-[#e5e7eb]">
                Choose a block type
              </p>
              <div className="grid grid-cols-2 gap-px bg-[#e5e7eb]">
                {BLOCK_TYPES.map(type => {
                  const Icon = BLOCK_ICONS[type]
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => addBlock(type)}
                      className="bg-white px-4 py-3 text-left hover:bg-[#f9fafb] transition-colors flex items-center gap-3"
                    >
                      <Icon className="w-4 h-4 text-[#6b7280] flex-shrink-0" />
                      <span className="text-sm font-medium text-[#1e1e23]">{BLOCK_LABELS[type]}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
