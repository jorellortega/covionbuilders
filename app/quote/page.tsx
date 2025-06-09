import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, FileText, HardHat, Ruler } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function QuotePage() {
  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />

      {/* Hero Section */}
      <section className="relative border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/20 py-16 md:py-24">
        <div className="container relative z-10">
          <div className="mx-auto max-w-[800px] text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
              Request a{" "}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Quote</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Fill out the form below to get a detailed estimate for your construction project.
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

      {/* Quote Form */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-[800px]">
            <div className="mb-12 grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: FileText,
                  title: "1. Submit Request",
                  description: "Fill out the form with your project details",
                },
                {
                  icon: Ruler,
                  title: "2. Project Assessment",
                  description: "Our team will review your requirements",
                },
                {
                  icon: HardHat,
                  title: "3. Detailed Quote",
                  description: "Receive a comprehensive project estimate",
                },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/20 to-emerald-600/20 text-primary">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border/40 p-8" style={{ backgroundColor: '#141414' }}>
              <h2 className="mb-6 text-2xl font-bold">Project Information</h2>

              <form className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="mb-4 text-lg font-medium">Contact Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="first-name" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input id="first-name" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="last-name" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="last-name" placeholder="Doe" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="project-description" className="text-sm font-medium">
                        Project Description
                      </label>
                      <Textarea
                        id="project-description"
                        placeholder="Please provide details about your project, including specific requirements, goals, and any challenges..."
                        rows={5}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Project Details, Services Needed, Additional Information as Accordion */}
                <Accordion type="multiple" className="mt-8">
                  <AccordionItem value="project-details">
                    <AccordionTrigger>Project Details</AccordionTrigger>
                    <AccordionContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                        {/* Project Details fields (except Project Description) */}
                    <div className="space-y-2">
                      <label htmlFor="project-type" className="text-sm font-medium">
                        Project Type
                      </label>
                      <Select>
                        <SelectTrigger id="project-type">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="commercial">Commercial Construction</SelectItem>
                          <SelectItem value="residential">Residential Development</SelectItem>
                          <SelectItem value="industrial">Industrial Projects</SelectItem>
                          <SelectItem value="renovation">Renovation & Retrofitting</SelectItem>
                          <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="project-size" className="text-sm font-medium">
                        Estimated Project Size (sq ft)
                      </label>
                      <Input id="project-size" type="number" placeholder="5000" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="project-location" className="text-sm font-medium">
                        Project Location
                      </label>
                      <Input id="project-location" placeholder="City, State" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="project-timeline" className="text-sm font-medium">
                        Desired Timeline
                      </label>
                      <Select>
                        <SelectTrigger id="project-timeline">
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-3">1-3 months</SelectItem>
                          <SelectItem value="3-6">3-6 months</SelectItem>
                          <SelectItem value="6-12">6-12 months</SelectItem>
                          <SelectItem value="12+">12+ months</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="budget" className="text-sm font-medium">
                        Estimated Budget Range
                      </label>
                      <Select>
                        <SelectTrigger id="budget">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                              <SelectItem value="under-1k">Under $1,000</SelectItem>
                              <SelectItem value="1k-5k">$1,000 – $5,000</SelectItem>
                              <SelectItem value="5k-10k">$5,000 – $10,000</SelectItem>
                              <SelectItem value="10k-25k">$10,000 – $25,000</SelectItem>
                              <SelectItem value="25k-50k">$25,000 – $50,000</SelectItem>
                              <SelectItem value="50k-100k">$50,000 – $100,000</SelectItem>
                              <SelectItem value="over-100k">Over $100,000</SelectItem>
                          <SelectItem value="undetermined">Not yet determined</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                          <label htmlFor="company" className="text-sm font-medium">
                            Company (if applicable)
                      </label>
                          <Input id="company" placeholder="Company Name" />
                    </div>
                  </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="services-needed">
                    <AccordionTrigger>Services Needed</AccordionTrigger>
                    <AccordionContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                        {["Architectural Design","Construction Management","General Contracting","Interior Design","Demolition","Site Preparation","Structural Engineering","Mechanical/Electrical/Plumbing","Sustainability Consulting","Permit Acquisition","Project Financing","Post-Construction Services",].map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox id={`service-${index}`} />
                            <label htmlFor={`service-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="additional-info">
                    <AccordionTrigger>Additional Information</AccordionTrigger>
                    <AccordionContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="additional-comments" className="text-sm font-medium">
                        Additional Comments or Questions
                      </label>
                          <Textarea id="additional-comments" placeholder="Any other information you'd like to share..." rows={3} />
                    </div>
                  </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">
                      terms and conditions
                    </a>
                  </label>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white"
                >
                  Submit Quote Request
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="border-t border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/10 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-[800px]">
            <h2 className="mb-8 text-center text-3xl font-bold">What to Expect</h2>

            <div className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-border/40 bg-card/30 p-6">
                  <h3 className="mb-3 text-lg font-medium">Response Time</h3>
                  <p className="text-muted-foreground">
                    We'll acknowledge your quote request within 24 hours and provide a detailed estimate within 3-5
                    business days, depending on project complexity.
                  </p>
                </div>
                <div className="rounded-xl border border-border/40 bg-card/30 p-6">
                  <h3 className="mb-3 text-lg font-medium">Consultation</h3>
                  <p className="text-muted-foreground">
                    For most projects, we'll schedule a consultation (in-person or virtual) to discuss your needs in
                    detail before finalizing the quote.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border/40 bg-card/30 p-6">
                <h3 className="mb-3 text-lg font-medium">Our Quote Includes:</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-4 w-4 text-primary" />
                    <span>Detailed breakdown of costs for materials, labor, and other expenses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-4 w-4 text-primary" />
                    <span>Projected timeline with key milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-4 w-4 text-primary" />
                    <span>Scope of work and deliverables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-4 w-4 text-primary" />
                    <span>Payment schedule and terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-1 h-4 w-4 text-primary" />
                    <span>Any assumptions or exclusions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

