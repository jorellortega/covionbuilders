import { Button } from "@/components/ui/button"
import { Award, Building2, Clock, Users } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Head from 'next/head'

export default function AboutPage() {
  const stats = [
    { value: "25+", label: "Years of Experience" },
    { value: "500+", label: "Projects Completed" },
    { value: "150+", label: "Team Members" },
    { value: "98%", label: "Client Satisfaction" },
  ]

  const values = [
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for excellence in every aspect of our work, from planning and design to construction and delivery.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We believe in the power of collaboration, working closely with clients, architects, engineers, and subcontractors.",
    },
    {
      icon: Building2,
      title: "Sustainability",
      description:
        "We are committed to sustainable building practices that minimize environmental impact and maximize efficiency.",
    },
    {
      icon: Clock,
      title: "Reliability",
      description:
        "We deliver projects on time and within budget, maintaining transparent communication throughout the process.",
    },
  ]

  const team = [
    {
      name: "Michael Reynolds",
      position: "Founder & CEO",
      bio: "With over 30 years in the construction industry, Michael founded Covion Builders with a vision to create a company focused on quality, innovation, and client satisfaction.",
    },
    {
      name: "Sarah Chen",
      position: "Chief Operations Officer",
      bio: "Sarah oversees all operations, ensuring projects are delivered efficiently and to the highest standards. Her background in civil engineering and project management brings valuable expertise to the team.",
    },
    {
      name: "David Martinez",
      position: "Head of Architecture",
      bio: "David leads our architectural team, bringing creative vision and technical expertise to every project. His award-winning designs balance aesthetics, functionality, and sustainability.",
    },
    {
      name: "Aisha Johnson",
      position: "Sustainability Director",
      bio: "Aisha ensures our projects incorporate the latest sustainable building practices and technologies, helping clients achieve their environmental goals while reducing long-term operating costs.",
    },
  ]

  return (
    <>
      <Head>
        <title>About Covion Builders | Excellence in Construction</title>
        <meta name="description" content="Learn about Covion Builders, our values, leadership, and commitment to sustainable, high-quality construction." />
        <meta property="og:title" content="About Covion Builders | Excellence in Construction" />
        <meta property="og:description" content="Learn about Covion Builders, our values, leadership, and commitment to sustainable, high-quality construction." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://covionbuilders.com/about" />
        <meta property="og:image" content="https://covionbuilders.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Covion Builders | Excellence in Construction" />
        <meta name="twitter:description" content="Learn about Covion Builders, our values, leadership, and commitment to sustainable, high-quality construction." />
        <meta name="twitter:image" content="https://covionbuilders.com/og-image.jpg" />
      </Head>
      <div className="dark flex min-h-screen flex-col">
        <Header />

        {/* Hero Section */}
        <section className="relative border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/20 py-16 md:py-24">
          <div className="container relative z-10">
            <div className="mx-auto max-w-[800px] text-center">
              <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                About{" "}
                <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  Covion Builders
                </span>
              </h1>
              <p className="mb-8 text-xl text-muted-foreground">
                Building excellence through innovation, quality craftsmanship, and sustainable practices since 1998.
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

        {/* Our Story */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="flex flex-col justify-center">
                <h2 className="mb-6 text-3xl font-bold">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 1998, Covion Builders began as a small residential construction company with a big vision:
                    to transform the construction industry through a commitment to quality, innovation, and client
                    satisfaction.
                  </p>
                  <p>
                    Over the past 25 years, we've grown into a full-service construction firm handling projects of all
                    sizes across commercial, residential, and industrial sectors. Throughout our growth, we've maintained
                    our founding principles and hands-on approach.
                  </p>
                  <p>
                    Today, Covion Builders is recognized as an industry leader, known for delivering exceptional projects
                    that stand the test of time. Our team of over 150 professionals brings expertise, creativity, and
                    dedication to every project we undertake.
                  </p>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="absolute -left-10 -top-10 h-[250px] w-[250px] rounded-full bg-blue-500/20 blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 h-[250px] w-[250px] rounded-full bg-emerald-500/20 blur-3xl"></div>
                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-border/40 bg-card/30 p-2 backdrop-blur-sm">
                  <div className="h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-blue-900/40 to-emerald-900/40">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Our+Story"
                      alt="Covion Builders history"
                      className="h-full w-full object-cover opacity-80"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/10 py-16 md:py-24">
          <div className="container">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary md:text-5xl">{stat.value}</div>
                  <div className="mt-2 text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-[800px] text-center">
              <h2 className="mb-4 text-3xl font-bold">Our Values</h2>
              <p className="text-xl text-muted-foreground">
                The core principles that guide everything we do at Covion Builders.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center rounded-xl border border-border/40 bg-card/30 p-6 text-center transition-all hover:border-primary/40"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/20 to-emerald-600/20 text-primary">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="border-t border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/10 py-16 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-[800px] text-center">
              <h2 className="mb-4 text-3xl font-bold">Our Leadership Team</h2>
              <p className="text-xl text-muted-foreground">
                Meet the experienced professionals who guide our company's vision and operations.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-border/40 bg-card/30 transition-all hover:border-primary/40"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={`/placeholder.svg?height=300&width=300&text=${member.name.replace(/\s/g, "+")}`}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                    <p className="mb-4 text-sm text-primary">{member.position}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
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
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">Join Our Team</h2>
                <p className="mb-8 text-xl text-muted-foreground">
                  We're always looking for talented individuals to join our growing team of construction professionals.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
                    View Career Opportunities
                  </Button>
                  <Button size="lg" variant="outline">
                    Learn More About Us
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

