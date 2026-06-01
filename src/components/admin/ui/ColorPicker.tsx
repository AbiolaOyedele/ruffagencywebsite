'use client'

import { useState, useEffect } from 'react'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  error?: string
  /** If true, value is stored as "r g b" space-separated. If false, stored as "#rrggbb" */
  rgbMode?: boolean
}

/** Convert "#rrggbb" → "r g b" */
function hexToRgbStr(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '30 30 35'
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ].join(' ')
}

/** Convert "r g b" → "#rrggbb" */
function rgbStrToHex(rgb: string): string {
  const parts = rgb.trim().split(' ').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return '#1e1e23'
  return '#' + parts.map((x) => x.toString(16).padStart(2, '0')).join('')
}

export default function ColorPicker({
  label,
  value,
  onChange,
  hint,
  error,
  rgbMode = false,
}: ColorPickerProps) {
  const hexValue = rgbMode ? rgbStrToHex(value) : value

  const [inputText, setInputText] = useState(hexValue)

  useEffect(() => {
    setInputText(rgbMode ? rgbStrToHex(value) : value)
  }, [value, rgbMode])

  function handleColorChange(hex: string) {
    setInputText(hex)
    onChange(rgbMode ? hexToRgbStr(hex) : hex)
  }

  function handleTextChange(raw: string) {
    setInputText(raw)
    const cleaned = raw.startsWith('#') ? raw : '#' + raw
    if (/^#[0-9a-fA-F]{6}$/.test(cleaned)) {
      onChange(rgbMode ? hexToRgbStr(cleaned) : cleaned)
    }
  }

  const id = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[#374151]">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="relative flex-shrink-0">
          <input
            type="color"
            id={id}
            value={hexValue}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-9 w-9 cursor-pointer rounded-lg border border-[#d1d5db] p-0.5 bg-white"
            style={{ WebkitAppearance: 'none' }}
          />
        </div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="#000000"
          maxLength={7}
          className={[
            'flex-1 rounded-lg border px-3 py-2 text-sm font-mono text-[#1e1e23] transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-[#1e1e23] focus:ring-offset-1',
            error ? 'border-[#E92038] bg-[#fff5f5]' : 'border-[#d1d5db] bg-white hover:border-[#9ca3af]',
          ].join(' ')}
        />
        <div
          className="h-9 w-9 flex-shrink-0 rounded-lg border border-[#d1d5db]"
          style={{ backgroundColor: hexValue }}
          aria-hidden="true"
        />
      </div>
      {rgbMode && (
        <p className="text-xs text-[#9ca3af]">
          Stored as: <code className="font-mono">{value}</code>
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-[#6b7280]">{hint}</p>
      )}
      {error && (
        <p role="alert" className="text-xs text-[#E92038]">{error}</p>
      )}
    </div>
  )
}
