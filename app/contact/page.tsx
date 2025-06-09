import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MapPin, Phone } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ContactPage() {
  const offices = [
    {
      city: "New York",
      address: "123 Broadway, Suite 500",
      cityState: "New York, NY 10001",
      phone: "(212) 555-1234",
      email: "newyork@covionbuilders.com",
    },
    {
      city: "Los Angeles",
      address: "456 Sunset Blvd",
      cityState: "Los Angeles, CA 90028",
      phone: "(310) 555-5678",
      email: "la@covionbuilders.com",
    },
    {
      city: "Chicago",
      address: "789 Michigan Ave, Floor 12",
      cityState: "Chicago, IL 60611",
      phone: "(312) 555-9012",
      email: "chicago@covionbuilders.com",
    },
    {
      city: "Seattle",
      address: "321 Pine Street",
      cityState: "Seattle, WA 98101",
      phone: "(206) 555-3456",
      email: "seattle@covionbuilders.com",
    },
  ]

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />

      {/* Hero Section */}
      <section className="relative border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/20 py-16 md:py-24">
        <div className="container relative z-10">
          <div className="mx-auto max-w-[800px] text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
              Get in{" "}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              Have a question or ready to start your next project? Contact our team today.
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

      {/* Contact Form and Info */}
      <section className="py-16 md:py-24">
        <div className="container flex justify-center">
          <div className="w-full max-w-xl">
              <h2 className="mb-6 text-3xl font-bold">Contact Us</h2>
              <p className="mb-8 text-muted-foreground">
                Fill out the form below and one of our team members will get back to you within 24 hours.
              </p>

              <form className="space-y-6">
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
                  <Input id="phone" type="tel" placeholder="(555) 123-4567" />
                </div>

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
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Tell us about your project or inquiry..." rows={5} required />
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
                  Send Message
                </Button>
              </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/10 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-[800px]">
            <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {[
                {
                  question: "What types of projects does Covion Builders handle?",
                  answer:
                    "Covion Builders handles a wide range of construction projects including commercial buildings, residential developments, industrial facilities, renovations, and infrastructure projects. We work with projects of all sizes, from small renovations to large-scale developments.",
                },
                {
                  question: "How do I get a quote for my construction project?",
                  answer:
                    "You can request a quote by filling out the contact form on this page, calling our main office, or emailing us directly. We'll arrange a consultation to discuss your project requirements and provide a detailed estimate.",
                },
                {
                  question: "What geographic areas do you serve?",
                  answer:
                    "We primarily serve the New York, Los Angeles, Chicago, and Seattle metropolitan areas, but we also take on projects in other locations depending on scope and requirements. Contact us to discuss your specific location.",
                },
                {
                  question: "How long does a typical construction project take?",
                  answer:
                    "Project timelines vary greatly depending on size, complexity, and scope. A small renovation might take a few weeks, while a large commercial building could take 12-18 months. During our initial consultation, we'll provide a projected timeline for your specific project.",
                },
                {
                  question: "Do you handle permits and regulatory approvals?",
                  answer:
                    "Yes, we manage all necessary permits, inspections, and regulatory approvals as part of our comprehensive service. Our team is experienced in navigating local building codes and requirements to ensure your project proceeds smoothly.",
                },
              ].map((faq, index) => (
                <div key={index} className="rounded-xl border border-border/40 bg-card/30 p-6">
                  <h3 className="mb-3 text-lg font-medium">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

