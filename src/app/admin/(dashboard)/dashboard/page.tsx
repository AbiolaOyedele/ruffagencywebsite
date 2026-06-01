import Link from 'next/link'
import PageHeader from '@/components/admin/features/PageHeader'
import Card, { CardTitle, CardDescription } from '@/components/admin/ui/Card'

const quickLinks = [
  { label: 'Global Settings', href: '/admin/global', description: 'Site name, social links, footer, navigation', color: '#1e1e23' },
  { label: 'Home Page', href: '/admin/pages/home', description: 'Hero image, intro text, colors, marquee', color: '#FEB3D2' },
  { label: 'Work Page', href: '/admin/pages/work', description: 'Intro text and page colors', color: '#E92038' },
  { label: 'About Page', href: '/admin/pages/about', description: 'Team, capabilities, images and colors', color: '#2DC05E' },
  { label: 'Contact Page', href: '/admin/pages/contact', description: 'Contact details, section text and colors', color: '#FD7B33' },
  { label: 'Scoops Page', href: '/admin/pages/scoops', description: 'Intro text, speculative CTA and colors', color: '#7C65FE' },
  { label: 'Projects', href: '/admin/projects', description: 'All work projects — add, edit, reorder', color: '#634DFF' },
  { label: 'Testimonials', href: '/admin/testimonials', description: 'Client quotes on the home page', color: '#2DC05E' },
  { label: 'Client Logos', href: '/admin/logos', description: 'Marquee logos on home and work pages', color: '#FFCD00' },
  { label: 'Scoops Items', href: '/admin/scoops-items', description: 'Job listings and news items', color: '#7C65FE' },
]

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Manage all content for The Ruff Agency website."
      />
      <div className="p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="h-full transition-shadow hover:shadow-md cursor-pointer group">
                <div className="flex items-start gap-3">
                  <div
                    className="h-3 w-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: link.color }}
                  />
                  <div>
                    <CardTitle className="group-hover:text-[#634DFF] transition-colors">
                      {link.label}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {link.description}
                    </CardDescription>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
