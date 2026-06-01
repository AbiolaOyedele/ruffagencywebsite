import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types/cms'

interface ProjectsGridProps {
  projects: Project[]
}

/**
 * 2-column grid of the 4 featured homepage projects.
 */
export function ProjectsGrid({ projects }: ProjectsGridProps) {
  const featured = projects.slice(0, 4)

  return (
    <div className="grid gap-y-blocks relative bg-base-bg z-20 pb-blocks">
      {/* Cards grid */}
      <div className="relative">
        <div className="page-container text-accent-fg">
          {featured.length > 0 ? (
            <div className="grid gap-gutter sm:grid-cols-2">
              {featured.map((project) => (
                <ProjectCard key={project.id ?? project.slug} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-center py-20 text-accent-fg/50 ~text-lg/2xl">
              No projects yet — check back soon.
            </p>
          )}
        </div>
      </div>

      {/* All projects CTA */}
      <div className="relative mt-10 lg:mt-14">
        <div className="page-container text-center">
          <a
            href="/work"
            className="border-accent-fg text-accent-fg hover:bg-accent-fg hover:text-base-bg hover:scale-105 inline-flex items-center justify-center text-base lg:text-xl leading-none cursor-pointer border-2 px-6 py-2 lg:px-8 lg:py-3 font-semibold transition rounded-full"
          >
            All projects
          </a>
        </div>
      </div>
    </div>
  )
}
