'use client'

import { useState } from 'react'
import { ProjectCard } from '@/components/features/home/ProjectCard'
import type { Project } from '@/types/cms'

interface WorkGridProps {
  projects: Project[]
}

type FilterKey = 'all' | 'featured' | 'ads' | 'design' | 'brand' | 'mascots' | '3d' | 'studio'

const FILTER_LABELS: Record<FilterKey, string> = {
  all:      'All',
  featured: 'Featured',
  ads:      'Ads & Explainers',
  design:   'Design',
  brand:    'Brand Systems',
  mascots:  'Mascots',
  '3d':     '3D',
  studio:   'Studio',
}

const FILTERS = Object.keys(FILTER_LABELS) as FilterKey[]

export function WorkGrid({ projects }: WorkGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [showFilters, setShowFilters] = useState(false)

  const visible = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.categories.includes(activeFilter))

  function setFilter(f: FilterKey) {
    setActiveFilter(f)
    setShowFilters(false)
  }

  return (
    <>
      {/* Filter bar */}
      <div className="relative bg-base-bg z-20 ~pb-10/16">
        <div className="page-container">
          <div className="lg:px-page flex items-center justify-between gap-3">
            {/* Active chip */}
            <div className="flex items-center gap-3">
              {activeFilter !== 'all' && (
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className="pill bg-[#c4ff00] border-[#c4ff00] text-brand-black transition-colors duration-200"
                >
                  {FILTER_LABELS[activeFilter]}
                </button>
              )}
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(v => !v)}
              className={`pill transition-colors duration-200 ml-auto ${
                showFilters
                  ? 'bg-accent-fg border-accent-fg text-base-bg'
                  : 'border-accent-fg text-accent-fg hover:bg-accent-fg hover:text-base-bg'
              }`}
            >
              {showFilters ? '− Filter' : '+ Filter'}
            </button>
          </div>

          {/* Expandable panel */}
          {showFilters && (
            <div className="lg:px-page mt-4 flex flex-wrap ~gap-3/4">
              {FILTERS.map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`pill transition-colors duration-200 ${
                    f === 'featured'
                      ? activeFilter === f
                        ? 'bg-[#c4ff00] border-[#c4ff00] text-brand-black'
                        : 'border-[#c4ff00] text-[#c4ff00] hover:bg-[#c4ff00] hover:text-brand-black'
                      : activeFilter === f
                        ? 'bg-accent-fg border-accent-fg text-base-bg'
                        : 'border-accent-fg text-accent-fg hover:bg-accent-fg hover:text-base-bg'
                  }`}
                >
                  {FILTER_LABELS[f]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-y-blocks relative bg-base-bg z-20 pb-blocks">
        <div className="relative">
          <div className="page-container text-accent-fg">
            {visible.length > 0 ? (
              <div className="grid gap-gutter sm:grid-cols-2">
                {visible.map((project, index) => {
                  const isFeaturedWide = project.is_featured && index === 0
                  return (
                    <ProjectCard
                      key={project.id ?? project.slug}
                      project={project}
                      featured={isFeaturedWide}
                    />
                  )
                })}
              </div>
            ) : (
              <p className="text-center py-20 text-accent-fg/50 ~text-lg/2xl">
                No projects in this category yet — check back soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
