import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Hammer, HardHat, Layers, Ruler, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Covion Builders</span>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              {["Services", "Projects", "About", "Sustainability", "Careers"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-foreground/80 transition-colors hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:inline-flex" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white" asChild>
              <Link href="/quote">Get Quote</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/20 pt-16 md:pt-24">
        <div className="container relative z-10 grid gap-8 pb-16 pt-4 md:grid-cols-2 md:pb-24">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
              Your Vision.
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Our Expertise.
              </span>
            </h1>
            <p className="max-w-[600px] text-xl text-muted-foreground">
              From concept to completion, we deliver quality construction solutions tailored to your needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white" asChild>
                <Link href="/quote">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/projects">
                  View Our Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute -left-20 -top-20 h-[350px] w-[350px] rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-[350px] w-[350px] rounded-full bg-emerald-500/20 blur-3xl"></div>
            <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-border/40 p-2 backdrop-blur-sm" style={{ backgroundColor: '#141414' }}>
              <div className="h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-900/40 to-emerald-900/40">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Modern construction project"
                  className="h-full w-full object-cover opacity-80"
                />
              </div>
            </div>
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

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-[800px] text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Construction Services</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive solutions for projects of any scale, from residential to commercial and industrial.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Concrete",
                description: "Expert concrete work for foundations, driveways, sidewalks, and more.",
              },
              {
                icon: HardHat,
                title: "General Labor",
                description: "Skilled and general labor for construction, site preparation, and support tasks.",
              },
              {
                icon: Hammer,
                title: "Residential Development",
                description: "Custom homes, multi-family units, and residential communities.",
              },
              {
                icon: Ruler,
                title: "Roofing",
                description: "Professional roofing installation, repair, and maintenance for all building types.",
              },
              {
                icon: Shield,
                title: "Remodeling",
                description: "Modernizing existing structures while preserving their character and integrity.",
              },
              {
                icon: Layers,
                title: "Landscaping",
                description: "Professional landscaping services to enhance outdoor spaces and curb appeal.",
              },
            ].map((service, index) => (
              <Link
                key={index}
                href={`/${service.title.toLowerCase().replace(/ /g, '-')}`}
                className="group relative overflow-hidden rounded-xl border border-border/40 p-6 transition-all hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{ backgroundColor: '#141414', display: 'block', textDecoration: 'none' }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/20 to-emerald-600/20 text-primary">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-t border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/10 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Featured Projects</h2>
              <p className="max-w-[600px] text-xl text-muted-foreground">
                Explore our portfolio of completed construction projects across various sectors.
              </p>
            </div>
            <Button variant="outline" className="w-full md:w-auto" asChild>
              <Link href="/projects">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Azure Tower",
                category: "Commercial",
                location: "New York, NY",
              },
              {
                title: "Emerald Heights",
                category: "Residential",
                location: "Seattle, WA",
              },
              {
                title: "Oceanic Research Center",
                category: "Institutional",
                location: "San Diego, CA",
              },
            ].map((project, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-xl border border-border/40 transition-all hover:border-primary/40"
                style={{ backgroundColor: '#141414' }}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={`/placeholder.svg?height=300&width=500&text=Project+${index + 1}`}
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
                  <Link href="/projects" className="inline-flex items-center text-sm font-medium text-primary">
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
          <div className="overflow-hidden rounded-2xl border border-border/40 p-8 md:p-12" style={{ backgroundColor: '#141414' }}>
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Build Your Vision?</h2>
              <p className="mb-8 text-xl text-muted-foreground">
                Contact our team today to discuss your project requirements and get a detailed quote.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white" asChild>
                  <Link href="/quote">Request a Quote</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Contact Our Team</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 py-12 md:py-16">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Covion Builders</span>
              </div>
              <p className="mb-4 text-muted-foreground">
                Building the future with innovative construction solutions and sustainable practices.
              </p>
              <div className="flex space-x-4">
                {["Twitter", "LinkedIn", "Instagram", "Facebook"].map((social) => (
                  <Link
                    key={social}
                    href="#"
                    className="rounded-full bg-background p-2 text-foreground/80 transition-colors hover:text-primary"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Services</h3>
              <ul className="space-y-2">
                {[
                  "Commercial Construction",
                  "Industrial Projects",
                  "Residential Development",
                  "Roofing",
                  "Renovation",
                  "Infrastructure",
                ].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Projects", "Sustainability", "Careers", "News", "Contact"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">Contact</h3>
              <address className="not-italic text-muted-foreground">
                <p>123 Construction Way</p>
                <p>Building City, BC 12345</p>
                <p className="mt-2">info@covionbuilders.com</p>
                <p>(555) 123-4567</p>
              </address>
            </div>
          </div>

          <div className="mt-12 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Covion Builders. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

