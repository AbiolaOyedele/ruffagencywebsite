'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder ?? 'Write something...' }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[120px] px-4 py-3 text-sm text-[#1e1e23] focus:outline-none',
      },
    },
  })

  // Sync external value changes (e.g. when switching blocks)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="rounded-lg border border-[#d1d5db] overflow-hidden focus-within:ring-2 focus-within:ring-[#1e1e23]">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-[#e5e7eb] bg-[#f9fafb]">
        {[
          { label: 'B', title: 'Bold', action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive('bold') },
          { label: 'I', title: 'Italic', action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive('italic') },
        ].map(({ label, title, action, active }) => (
          <button
            key={label}
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); action() }}
            className={`w-7 h-7 rounded text-sm font-medium transition-colors ${
              active ? 'bg-[#1e1e23] text-white' : 'text-[#374151] hover:bg-[#e5e7eb]'
            }`}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-4 bg-[#e5e7eb] mx-1" />
        {[
          { label: 'H2', title: 'Heading 2', action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive('heading', { level: 2 }) },
          { label: 'H3', title: 'Heading 3', action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive('heading', { level: 3 }) },
        ].map(({ label, title, action, active }) => (
          <button
            key={label}
            type="button"
            title={title}
            onMouseDown={(e) => { e.preventDefault(); action() }}
            className={`px-2 h-7 rounded text-xs font-medium transition-colors ${
              active ? 'bg-[#1e1e23] text-white' : 'text-[#374151] hover:bg-[#e5e7eb]'
            }`}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-4 bg-[#e5e7eb] mx-1" />
        <button
          type="button"
          title="Bullet list"
          onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBulletList().run() }}
          className={`px-2 h-7 rounded text-xs font-medium transition-colors ${
            editor?.isActive('bulletList') ? 'bg-[#1e1e23] text-white' : 'text-[#374151] hover:bg-[#e5e7eb]'
          }`}
        >
          • List
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
