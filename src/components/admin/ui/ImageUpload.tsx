'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Button from './Button'

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
  error?: string
  /** Cloudinary upload preset */
  uploadPreset?: string
}

export default function ImageUpload({
  label,
  value,
  onChange,
  hint,
  error,
  uploadPreset,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const preset = uploadPreset ?? process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? 'ruff_admin'
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be under 10 MB.')
      return
    }

    setUploadError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', preset)
      formData.append('folder', 'ruff-agency')

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      )

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`)
      }

      const data = (await res.json()) as { secure_url: string }
      onChange(data.secure_url)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed.'
      setUploadError(message)
    } finally {
      setUploading(false)
    }
  }

  const id = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#374151]">
        {label}
      </label>

      {value && (
        <div className="relative w-full overflow-hidden rounded-lg border border-[#d1d5db] bg-[#f9fafb]" style={{ aspectRatio: '16/9', maxHeight: '240px' }}>
          <Image
            src={value}
            alt="Uploaded image preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            unoptimized={value.startsWith('http') && !value.includes('cloudinary')}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#E92038] shadow hover:bg-white transition"
            aria-label="Remove image"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={fileRef}
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleFile(file)
            e.target.value = ''
          }}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {value ? 'Replace image' : 'Upload image'}
        </Button>

        {value && (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image URL"
            className="flex-1 rounded-lg border border-[#d1d5db] px-3 py-1.5 text-xs text-[#1e1e23] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1e1e23] focus:ring-offset-1"
          />
        )}
      </div>

      {!value && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL"
          className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm text-[#1e1e23] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#1e1e23] focus:ring-offset-1"
        />
      )}

      {hint && !error && !uploadError && (
        <p className="text-xs text-[#6b7280]">{hint}</p>
      )}
      {(error ?? uploadError) && (
        <p role="alert" className="text-xs text-[#E92038]">
          {error ?? uploadError}
        </p>
      )}
    </div>
  )
}
