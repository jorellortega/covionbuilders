import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, MapPin } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Head from 'next/head'
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';

export default async function ProjectsPage() {
  const supabase = createSupabaseBrowserClient();
  const { data: projectsData, error } = await supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false });

  if (error) {
    return <div className="text-red-500">Error loading projects: {error.message}</div>;
  }

  // Example: first 3 as featured, rest as more projects
  const featuredProjects = projectsData?.slice(0, 3) || [];
  const projects = projectsData?.slice(3) || [];

  return (
    <>
      <Head>
        <title>Our Projects | Covion Builders Portfolio</title>
        <meta name="description" content="Explore Covion Builders' portfolio of completed construction projects across commercial, residential, and industrial sectors." />
        <meta property="og:title" content="Our Projects | Covion Builders Portfolio" />
        <meta property="og:description" content="Explore Covion Builders' portfolio of completed construction projects across commercial, residential, and industrial sectors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://covionbuilders.com/projects" />
        <meta property="og:image" content="https://covionbuilders.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Projects | Covion Builders Portfolio" />
        <meta name="twitter:description" content="Explore Covion Builders' portfolio of completed construction projects across commercial, residential, and industrial sectors." />
        <meta name="twitter:image" content="https://covionbuilders.com/og-image.jpg" />
      </Head>
      <div className="dark flex min-h-screen flex-col">
        <Header />

        {/* Hero Section */}
        <section className="relative border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/20 py-16 md:py-24">
          <div className="container relative z-10">
            <div className="mx-auto max-w-[800px] text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                Our{" "}
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Projects
                </span>
              </h1>
              <p className="mb-8 text-xl text-muted-foreground">
                Explore our portfolio of completed construction projects across various sectors, showcasing our expertise
                and commitment to excellence.
              </p>
            </div>
          </div>

          {/* Grid background */}
          <div
            className="absolute inset-0 z-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #4ade80 1px, transparent 1px), linear-gradient(to bottom, #4ade80 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </section>

        {/* Featured Projects */}
        <section className="py-16 md:py-24">
          <div className="container">
            <h2 className="mb-12 text-3xl font-bold">Featured Projects</h2>

            <div className="grid gap-12">
              {featuredProjects.map((project, index) => (
                <div
                  key={index}
                  className={`grid gap-8 rounded-xl border border-border/40 p-8 md:grid-cols-2 ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
                  style={{ backgroundColor: '#141414' }}
                >
                  <div className={`flex flex-col justify-center ${index % 2 === 1 ? "md:col-start-2" : ""}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {project.category}
                      </span>
                    </div>
                    <h3 className="mb-4 text-3xl font-bold">{project.title}</h3>
                    <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Completed: {project.year}</span>
                      </div>
                    </div>
                    <p className="mb-6 text-muted-foreground">{project.description}</p>
                    <div>
                      <Link href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
                        View Project Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-emerald-600/10 backdrop-blur-[2px]"></div>
                    <img
                      src={`/placeholder.svg?height=400&width=600&text=${project.title.replace(/\s/g, "+")}`}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Projects Grid */}
        <section className="border-t border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/10 py-16 md:py-24">
          <div className="container">
            <h2 className="mb-12 text-3xl font-bold">More Projects</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-xl border border-border/40 transition-all hover:border-primary/40"
                  style={{ backgroundColor: '#141414' }}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=300&width=500&text=${project.title.replace(/\s/g, "+")}`}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        {project.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{project.location}</span>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    <Link href={`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`} className="inline-flex items-center text-sm font-medium text-primary">
                      View Project <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-blue-900/20 via-background to-emerald-900/20 p-8 md:p-12">
              <div className="mx-auto max-w-[800px] text-center">
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Start Your Project?</h2>
                <p className="mb-8 text-xl text-muted-foreground">
                  Let's discuss how Covion Builders can bring your construction vision to life.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
                    Request a Quote
                  </Button>
                  <Button size="lg" variant="outline">
                    Contact Our Team
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}

