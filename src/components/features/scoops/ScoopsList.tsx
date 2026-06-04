'use client'

import { useState } from 'react'
import type { ScoopItem } from '@/types/cms'

type Filter = 'all' | 'job' | 'news'

interface ScoopsListProps {
  items: ScoopItem[]
}

export function ScoopsList({ items }: ScoopsListProps) {
  const [filter, setFilter] = useState<Filter>('all')

  const visible = filter === 'all' ? items : items.filter(item => item.type === filter)

  return (
    <>
      {/* Filter tabs */}
      <div className="relative bg-base-bg z-20 ~pb-8/12">
        <div className="page-container">
          <div className="lg:px-page flex flex-wrap ~gap-3/4">
            {(['all', 'job', 'news'] as Filter[]).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`pill transition ${
                  filter === f
                    ? 'bg-accent-fg text-base-bg border-accent-fg'
                    : 'text-accent-fg border-accent-fg hover:bg-accent-fg hover:text-base-bg'
                }`}
              >
                {f === 'all' ? 'All' : f === 'job' ? 'Jobs' : 'News'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listing */}
      <div className="relative">
        <div className="page-container text-accent-fg">
          <div className="lg:px-page grid gap-y-0 divide-y divide-base-fg/10">
            {visible.map(item => (
              <a
                key={item.id}
                href={item.slug ? `/scoops/${item.slug}` : (item.href || '#')}
                target={item.slug ? undefined : (item.href && item.href !== '#' ? '_blank' : undefined)}
                rel={item.slug ? undefined : 'noopener noreferrer'}
                className="group flex items-start justify-between gap-x-6 ~py-6/10 hover:text-accent-fg transition"
              >
                <div className="flex flex-col ~gap-y-2/3">
                  <div className="flex flex-wrap items-center ~gap-x-3/4 ~gap-y-2/3">
                    <span className="pill text-xs border-accent-fg text-accent-fg">
                      {item.type === 'job' ? 'Job' : 'News'}
                    </span>
                    <span className="text-base-fg/50 ~text-sm/base">{item.category}</span>
                  </div>
                  <h3 className="~text-xl/3xl font-semibold tracking-tight leading-snug group-hover:text-accent-fg transition">
                    {item.title}
                  </h3>
                  <p className="~text-base/lg text-base-fg/70 max-w-prose">{item.description}</p>
                </div>
                <div className="flex-shrink-0 ~mt-1/2">
                  <svg
                    className="~w-6/8 ~h-6/8 text-accent-fg transition group-hover:translate-x-1 group-hover:-translate-y-1 duration-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 17L17 7M17 7H7M17 7V17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </a>
            ))}

            {visible.length === 0 && (
              <p className="py-16 text-center text-base-fg/50 ~text-base/lg">
                Nothing here yet — check back soon.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
