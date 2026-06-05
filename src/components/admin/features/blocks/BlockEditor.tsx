'use client'

import ImageUpload from '@/components/admin/ui/ImageUpload'
import Input from '@/components/admin/ui/Input'
import RichTextEditor from './RichTextEditor'
import type { AdminBlock } from './types'

interface Props {
  block: AdminBlock
  onChange: (block: AdminBlock) => void
}

export default function BlockEditor({ block, onChange }: Props) {
  function update(patch: Partial<AdminBlock>) {
    onChange({ ...block, ...patch } as AdminBlock)
  }

  switch (block._type) {
    case 'textBlock':
      return (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af] mb-2">Text</p>
          <RichTextEditor
            value={block.html}
            onChange={(html) => update({ html })}
            placeholder="Write your content here..."
          />
        </div>
      )

    case 'imageBlock':
      return (
        <div className="grid gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Image</p>
          <ImageUpload
            label="Image"
            value={block.imageUrl}
            onChange={(imageUrl) => update({ imageUrl })}
          />
          <Input
            label="Caption (optional)"
            value={block.caption}
            onChange={(e) => update({ caption: e.target.value })}
            placeholder="Image caption"
          />
          <div>
            <p className="text-sm font-medium text-[#374151] mb-2">Size</p>
            <div className="flex gap-3">
              {(['contained', 'full-width'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => update({ size: s })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    block.size === s
                      ? 'bg-[#1e1e23] text-white border-[#1e1e23]'
                      : 'text-[#374151] border-[#d1d5db] hover:border-[#9ca3af]'
                  }`}
                >
                  {s === 'contained' ? 'Contained' : 'Full width'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )

    case 'imageTextBlock':
      return (
        <div className="grid gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Image + Text</p>
          <div>
            <p className="text-sm font-medium text-[#374151] mb-2">Image position</p>
            <div className="flex gap-3">
              {(['image-left', 'image-right'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => update({ layout: l })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    block.layout === l
                      ? 'bg-[#1e1e23] text-white border-[#1e1e23]'
                      : 'text-[#374151] border-[#d1d5db] hover:border-[#9ca3af]'
                  }`}
                >
                  {l === 'image-left' ? '← Image left' : 'Image right →'}
                </button>
              ))}
            </div>
          </div>
          <ImageUpload
            label="Image"
            value={block.imageUrl}
            onChange={(imageUrl) => update({ imageUrl })}
          />
          <div>
            <p className="text-sm font-medium text-[#374151] mb-2">Text</p>
            <RichTextEditor
              value={block.html}
              onChange={(html) => update({ html })}
              placeholder="Write the text content..."
            />
          </div>
        </div>
      )

    case 'twoColumnText':
      return (
        <div className="grid gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Two Column Text</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-[#374151] mb-2">Left column</p>
              <RichTextEditor
                value={block.leftHtml}
                onChange={(leftHtml) => update({ leftHtml })}
                placeholder="Left column content..."
              />
            </div>
            <div>
              <p className="text-sm font-medium text-[#374151] mb-2">Right column</p>
              <RichTextEditor
                value={block.rightHtml}
                onChange={(rightHtml) => update({ rightHtml })}
                placeholder="Right column content..."
              />
            </div>
          </div>
        </div>
      )

    case 'videoBlock':
      return (
        <div className="grid gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Video</p>
          <Input
            label="Video URL"
            value={block.url}
            onChange={(e) => update({ url: e.target.value })}
            placeholder="https://youtube.com/watch?v=..."
            hint="YouTube or Vimeo URL"
          />
          <Input
            label="Caption (optional)"
            value={block.caption}
            onChange={(e) => update({ caption: e.target.value })}
            placeholder="Video caption"
          />
        </div>
      )

    case 'imageGallery': {
      return (
        <div className="grid gap-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#9ca3af]">Image Gallery</p>
          <div>
            <p className="text-sm font-medium text-[#374151] mb-2">Columns</p>
            <div className="flex gap-3">
              {([2, 3, 4] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update({ columns: c })}
                  className={`w-10 h-8 rounded text-sm font-medium border transition-colors ${
                    block.columns === c
                      ? 'bg-[#1e1e23] text-white border-[#1e1e23]'
                      : 'text-[#374151] border-[#d1d5db] hover:border-[#9ca3af]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3">
            <p className="text-sm font-medium text-[#374151]">Images</p>
            {block.images.map((url, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex-1">
                  <ImageUpload
                    label={`Image ${i + 1}`}
                    value={url}
                    onChange={(v) => {
                      const images = [...block.images]
                      images[i] = v
                      update({ images })
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const images = block.images.filter((_, idx) => idx !== i)
                    update({ images })
                  }}
                  className="mt-6 text-[#9ca3af] hover:text-[#ef4444] transition-colors text-lg font-medium"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => update({ images: [...block.images, ''] })}
              className="text-sm font-medium text-[#1e1e23] hover:underline text-left"
            >
              + Add image
            </button>
          </div>
        </div>
      )
    }
  }
}
