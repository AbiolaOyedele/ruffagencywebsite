'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { animate } from 'motion'
import type { Project } from '@/types/cms'

interface ProjectCardProps {
  project: Project
  /** When true, card spans 2 columns at sm+ with 16:9 aspect ratio */
  featured?: boolean
}

/**
 * Interactive project card with image scale + overlay slide-up on hover.
 * Exact port of the Alpine cardAnimation() component.
 */
export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  function handleMouseEnter() {
    if (!imageRef.current) return
    void animate(imageRef.current, { scale: 0.58, y: 0 }, { type: 'spring', bounce: 0.2, duration: 0.3 })
    void animate(overlayRef.current!, { height: '45%' }, { type: 'spring', bounce: 0.2, duration: 0.3 })
    void animate(textRef.current!, { transform: 'translateY(0)' }, { type: 'spring', bounce: 0.3, duration: 0.3, delay: 0.1 })
  }

  function handleMouseLeave() {
    if (!imageRef.current) return
    void animate(imageRef.current, { scale: 1, y: 0 }, { duration: 0.8, easing: [0.05, 0.13, 0.01, 0.99] as [number, number, number, number] })
    void animate(overlayRef.current!, { height: '0%' }, { duration: 0.8, easing: [0.05, 0.13, 0.01, 0.99] as [number, number, number, number] })
    void animate(textRef.current!, { transform: 'translateY(5rem)' }, { duration: 0.8, easing: [0.05, 0.13, 0.01, 0.99] as [number, number, number, number] })
  }

  return (
    <a
      href={project.href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`~rounded-[.625rem]/[1.25rem] overflow-hidden group block ${
        featured
          ? 'sm:col-span-2 aspect-w-16 aspect-h-9'
          : 'aspect-w-5 aspect-h-6 lg:aspect-w-[6] lg:aspect-h-[7]'
      }`}
      style={{ backgroundColor: project.bg_color }}
    >
      {/* Project image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={imageRef}
          className="relative w-auto h-full scale-[0.68] lg:scale-100"
          style={{ aspectRatio: '3/2', transformOrigin: 'center top' }}
        >
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 45vw"
          />
        </div>
      </div>

      {/* Slide-up overlay with title/client */}
      <div
        ref={overlayRef}
        className="~rounded-t-[.625rem]/[1.25rem] absolute !top-auto bottom-0 left-0 right-0 h-2/5 lg:h-0"
        style={{ backgroundColor: project.bg_color }}
      >
        <div
          ref={textRef}
          className="~p-4/11 flex flex-col justify-between gap-y-4 h-full lg:translate-y-20"
        >
          <p className="text-2xl sm:text-3xl lg:~text-4xl/6xl lg:leading-none tracking-tight max-w-3xl text-brand-black">
            {project.description}
          </p>
          <h3 className="text-xl lg:~text-xl/[2.5rem] lg:leading-none font-medium text-right text-brand-black">
            {project.client}
          </h3>
        </div>
      </div>
    </a>
  )
}
