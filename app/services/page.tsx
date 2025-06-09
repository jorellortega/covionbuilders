import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Hammer, HardHat, Layers, Ruler, Shield } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ServicesPage() {
  const services = [
    {
      icon: Building2,
      title: "Concrete",
      description:
        "Expert concrete work for foundations, driveways, sidewalks, and more.",
      features: [
        "Foundations",
        "Driveways",
        "Sidewalks",
        "Retaining Walls",
        "Slabs & Pads",
      ],
    },
    {
      icon: HardHat,
      title: "General Labor",
      description:
        "Skilled and general labor for construction, site preparation, and support tasks.",
      features: [
        "Site Cleanup",
        "Material Handling",
        "Demolition Support",
        "General Construction Assistance",
        "Safety Monitoring",
      ],
    },
    {
      icon: Hammer,
      title: "Residential Development",
      description:
        "Custom homes, multi-family units, and residential communities built with attention to detail and quality craftsmanship. From luxury single-family homes to apartment complexes, we create living spaces that people love.",
      features: [
        "Custom Homes",
        "Multi-Family Housing",
        "Apartment Complexes",
        "Condominiums",
        "Residential Communities",
      ],
    },
    {
      icon: Ruler,
      title: "Roofing",
      description:
        "Professional roofing installation, repair, and maintenance for all building types.",
      features: [
        "New Roof Installation",
        "Roof Repairs",
        "Flat & Pitched Roofs",
        "Roof Inspections",
        "Maintenance & Coatings",
      ],
    },
    {
      icon: Shield,
      title: "Remodeling",
      description:
        "Modernizing existing structures while preserving their character and integrity.",
      features: [
        "Historic Preservation",
        "Commercial Renovations",
        "Residential Remodeling",
        "Seismic Retrofitting",
        "Energy Efficiency Upgrades",
      ],
    },
    {
      icon: Layers,
      title: "Landscaping",
      description:
        "Professional landscaping services to enhance outdoor spaces and curb appeal.",
      features: [
        "Garden Design",
        "Lawn Installation",
        "Irrigation Systems",
        "Tree & Shrub Planting",
        "Outdoor Lighting",
      ],
    },
  ]

  return (
    <div className="dark flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/20 py-16 md:py-24">
        <div className="container relative z-10">
          <div className="mx-auto max-w-[800px] text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
              Our Construction{" "}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Comprehensive construction solutions tailored to your specific needs, delivered with expertise and
              precision.
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

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12">
            {services.map((service, index) => (
              <div
                key={index}
                className={`grid gap-8 rounded-xl border border-border/40 bg-card/30 p-8 md:grid-cols-2 ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
              >
                <div className={`flex flex-col justify-center ${index % 2 === 1 ? "md:col-start-2" : ""}`}>
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/20 to-emerald-600/20 text-primary">
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h2 className="mb-4 text-3xl font-bold">{service.title}</h2>
                  <p className="mb-6 text-muted-foreground">{service.description}</p>
                  <div className="mb-6">
                    <h3 className="mb-3 text-lg font-medium">Key Features:</h3>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
                      Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-emerald-600/10 backdrop-blur-[2px]"></div>
                  <img
                    src={`/placeholder.svg?height=400&width=600&text=${service.title.replace(/\s/g, "+")}`}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background via-background/95 to-blue-950/10">
        <div className="container">
          <div className="overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-blue-900/20 via-background to-emerald-900/20 p-8 md:p-12">
            <div className="mx-auto max-w-[800px] text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">Need a Custom Solution?</h2>
              <p className="mb-8 text-xl text-muted-foreground">
                Our team can develop tailored construction services to meet your specific project requirements.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
                  Schedule a Consultation
                </Button>
                <Button size="lg" variant="outline">
                  View Our Projects
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

