interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] bg-white px-8 py-6">
      <div>
        <h1 className="text-xl font-semibold text-[#1e1e23]">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-[#6b7280]">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
