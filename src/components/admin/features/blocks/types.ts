/**
 * Admin block types — stored as JSONB in Supabase.
 * Compatible with BlockRenderer (uses `html` field for rich text).
 */

export type AdminBlockType =
  | 'textBlock'
  | 'imageBlock'
  | 'imageTextBlock'
  | 'twoColumnText'
  | 'videoBlock'
  | 'imageGallery'

export interface TextBlock {
  _key: string
  _type: 'textBlock'
  html: string
}

export interface ImageBlock {
  _key: string
  _type: 'imageBlock'
  imageUrl: string
  caption: string
  size: 'contained' | 'full-width'
}

export interface ImageTextBlock {
  _key: string
  _type: 'imageTextBlock'
  imageUrl: string
  html: string
  layout: 'image-left' | 'image-right'
}

export interface TwoColumnText {
  _key: string
  _type: 'twoColumnText'
  leftHtml: string
  rightHtml: string
}

export interface VideoBlock {
  _key: string
  _type: 'videoBlock'
  url: string
  caption: string
}

export interface ImageGallery {
  _key: string
  _type: 'imageGallery'
  images: string[]
  columns: 2 | 3 | 4
}

export type AdminBlock =
  | TextBlock
  | ImageBlock
  | ImageTextBlock
  | TwoColumnText
  | VideoBlock
  | ImageGallery

export function makeKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function defaultBlock(type: AdminBlockType): AdminBlock {
  const key = makeKey()
  switch (type) {
    case 'textBlock':      return { _key: key, _type: 'textBlock', html: '' }
    case 'imageBlock':     return { _key: key, _type: 'imageBlock', imageUrl: '', caption: '', size: 'contained' }
    case 'imageTextBlock': return { _key: key, _type: 'imageTextBlock', imageUrl: '', html: '', layout: 'image-left' }
    case 'twoColumnText':  return { _key: key, _type: 'twoColumnText', leftHtml: '', rightHtml: '' }
    case 'videoBlock':     return { _key: key, _type: 'videoBlock', url: '', caption: '' }
    case 'imageGallery':   return { _key: key, _type: 'imageGallery', images: [], columns: 2 }
  }
}


export const BLOCK_LABELS: Record<AdminBlockType, string> = {
  textBlock:      'Text',
  imageBlock:     'Image',
  imageTextBlock: 'Image + Text',
  twoColumnText:  'Two Columns',
  videoBlock:     'Video',
  imageGallery:   'Image Gallery',
}

