import Header from '@/components/header';
import Footer from '@/components/footer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const allProjects = [
  // Featured projects
  {
    slug: 'azure-tower',
    title: 'Azure Tower',
    category: 'Commercial',
    location: 'New York, NY',
    year: '2023',
    description: 'A 32-story commercial tower featuring state-of-the-art office spaces, retail areas, and sustainable design elements including solar panels and rainwater harvesting systems.',
  },
  {
    slug: 'emerald-heights',
    title: 'Emerald Heights',
    category: 'Residential',
    location: 'Seattle, WA',
    year: '2022',
    description: 'A luxury residential community with 120 units, featuring modern amenities, green spaces, and energy-efficient design that achieved LEED Gold certification.',
  },
  {
    slug: 'oceanic-research-center',
    title: 'Oceanic Research Center',
    category: 'Institutional',
    location: 'San Diego, CA',
    year: '2023',
    description: 'A cutting-edge marine research facility with laboratories, conference spaces, and specialized equipment for oceanographic studies.',
  },
  // More projects
  {
    slug: 'riverside-apartments',
    title: 'Riverside Apartments',
    category: 'Residential',
    location: 'Portland, OR',
    year: '2022',
    description: 'A modern apartment complex with 85 units overlooking the river, featuring community spaces and sustainable design.',
  },
  {
    slug: 'tech-innovation-hub',
    title: 'Tech Innovation Hub',
    category: 'Commercial',
    location: 'Austin, TX',
    year: '2021',
    description: 'A collaborative workspace designed for technology startups, featuring flexible office layouts and advanced connectivity.',
  },
  {
    slug: 'central-hospital-expansion',
    title: 'Central Hospital Expansion',
    category: 'Healthcare',
    location: 'Chicago, IL',
    year: '2023',
    description: 'A 45,000 sq ft expansion of an existing hospital, adding new patient rooms, surgical suites, and diagnostic facilities.',
  },
  {
    slug: 'mountain-view-resort',
    title: 'Mountain View Resort',
    category: 'Hospitality',
    location: 'Denver, CO',
    year: '2022',
    description: 'A luxury mountain resort with 200 rooms, spa facilities, restaurants, and conference spaces designed to blend with the natural environment.',
  },
  {
    slug: 'sunset-plaza',
    title: 'Sunset Plaza',
    category: 'Retail',
    location: 'Los Angeles, CA',
    year: '2021',
    description: 'An open-air shopping center featuring 30 retail spaces, dining options, and public gathering areas with sustainable landscaping.',
  },
  {
    slug: 'harbor-bridge',
    title: 'Harbor Bridge',
    category: 'Infrastructure',
    location: 'Boston, MA',
    year: '2023',
    description: 'A 500-foot suspension bridge connecting two urban districts, designed for vehicle, bicycle, and pedestrian traffic.',
  },
];

const highlightsMock = [
  'LEED Gold certified for sustainability and energy efficiency',
  'Completed 2 months ahead of schedule',
  'Integrated smart building technology',
  'Awarded "Best Urban Project" in 2023',
];

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const project = allProjects.find(
    (p) => p.slug === id
  );

  if (!project) return notFound();

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/projects">
              <Button variant="outline">&larr; Back to Projects</Button>
            </Link>
          </div>
          <div className="mb-8">
            <img
              src={`/placeholder.svg?height=400&width=600&text=${project.title.replace(/\s/g, '+')}`}
              alt={project.title}
              className="w-full rounded-xl border border-border/40 mb-6"
            />
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mr-2">
              {project.category}
            </span>
            <span className="text-xs text-muted-foreground">{project.location}</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white">{project.title}</h1>
          <div className="mb-4 text-muted-foreground">Completed: {project.year}</div>
          <p className="text-lg text-muted-foreground mb-8">{project.description}</p>

          {/* Estimated Price */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-2">Estimated Price</h2>
            <div className="text-3xl font-bold text-emerald-400 mb-2">$2,500,000</div>
            <div className="text-muted-foreground text-sm mb-4">Contact us for a custom quote for your project.</div>
            <Link href={{ pathname: '/quote', query: { project: project.title } }}>
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-lg font-semibold shadow-lg">
                I Want a Project Like This
              </Button>
            </Link>
          </div>

          {/* Project Highlights */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Project Highlights</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              {highlightsMock.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Gallery */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <img
                src={`/placeholder.svg?height=300&width=450&text=${project.title.replace(/\s/g, '+')}+1`}
                alt={project.title + ' gallery 1'}
                className="w-full rounded-lg border border-border/40"
              />
              <img
                src={`/placeholder.svg?height=300&width=450&text=${project.title.replace(/\s/g, '+')}+2`}
                alt={project.title + ' gallery 2'}
                className="w-full rounded-lg border border-border/40"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 