'use client'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export default function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  const id = label?.toLowerCase().replace(/\s+/g, '-') ?? 'toggle'

  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3">
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          className="sr-only"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={[
            'h-6 w-11 rounded-full transition-colors',
            checked ? 'bg-[#1e1e23]' : 'bg-[#d1d5db]',
            disabled ? 'opacity-50' : '',
          ].join(' ')}
        />
        <div
          className={[
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </div>
      {label && (
        <span className="text-sm font-medium text-[#374151]">{label}</span>
      )}
    </label>
  )
}
