"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, MapPin, Phone } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"
import Head from 'next/head';

const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().min(5, "Message must be at least 5 characters"),
  terms: z.boolean().refine((val) => val === true, "You must agree to the terms and conditions"),
})

type ContactFormData = z.infer<typeof contactFormSchema>

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

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      terms: false,
    },
  })

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id ?? null)
    })
  }, [])

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { error } = await supabase
        .from('quote_requests')
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            additional_comments: data.message,
            status: 'pending',
            created_at: new Date().toISOString(),
            user_id: userId,
            request_type: 'contact',
          }
        ])
      if (error) {
        console.error('Error submitting contact:', error)
        toast.error("Failed to submit contact request. Please try again.")
        return
      }
      toast.success("Your message has been sent! We'll get back to you soon.")
      setIsSubmitted(true)
      reset()
    } catch (error) {
      console.error('Error submitting contact:', error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>Contact Covion Builders | Get in Touch</title>
          <meta name="description" content="Contact Covion Builders for project inquiries, quotes, or questions. Our team is ready to help you start your next construction project." />
          <meta property="og:title" content="Contact Covion Builders | Get in Touch" />
          <meta property="og:description" content="Contact Covion Builders for project inquiries, quotes, or questions. Our team is ready to help you start your next construction project." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://covionbuilders.com/contact" />
          <meta property="og:image" content="https://covionbuilders.com/og-image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Contact Covion Builders | Get in Touch" />
          <meta name="twitter:description" content="Contact Covion Builders for project inquiries, quotes, or questions. Our team is ready to help you start your next construction project." />
          <meta name="twitter:image" content="https://covionbuilders.com/og-image.jpg" />
        </Head>
        <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
          <Header />
          <section className="flex-1 flex items-center justify-center py-16 md:py-24">
            <div className="container">
              <div className="mx-auto max-w-[600px] text-center">
                <div className="mb-8 flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="mb-4 text-3xl font-bold">Thank You!</h1>
                <p className="mb-8 text-xl text-muted-foreground">
                  Your message has been sent. We'll review your inquiry and get back to you as soon as possible.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-8 bg-gradient-to-r from-blue-600 to-emerald-500"
                >
                  Send Another Message
                </Button>
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </>
    )
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Head>
        <title>Contact Covion Builders | Get in Touch</title>
        <meta name="description" content="Contact Covion Builders for project inquiries, quotes, or questions. Our team is ready to help you start your next construction project." />
        <meta property="og:title" content="Contact Covion Builders | Get in Touch" />
        <meta property="og:description" content="Contact Covion Builders for project inquiries, quotes, or questions. Our team is ready to help you start your next construction project." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://covionbuilders.com/contact" />
        <meta property="og:image" content="https://covionbuilders.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Covion Builders | Get in Touch" />
        <meta name="twitter:description" content="Contact Covion Builders for project inquiries, quotes, or questions. Our team is ready to help you start your next construction project." />
        <meta name="twitter:image" content="https://covionbuilders.com/og-image.jpg" />
      </Head>
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
            <div className="rounded-xl border border-border/40 p-8" style={{ backgroundColor: '#141414' }}>
              <h2 className="mb-6 text-2xl font-bold">Contact Us</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName")}
                      className={errors.firstName ? "border-red-500" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName")}
                      className={errors.lastName ? "border-red-500" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      {...register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="project-type" className="text-sm font-medium">
                      Project Type
                    </label>
                    <Select value={watch("projectType")} onValueChange={(value) => setValue("projectType", value)}>
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
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you?"
                      rows={5}
                      {...register("message")}
                      className={errors.message ? "border-red-500" : ""}
                    />
                    {errors.message && (
                      <p className="text-sm text-red-500">{errors.message.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    {...register("terms")}
                    checked={watch("terms")}
                    onChange={e => setValue("terms", e.target.checked)}
                  />
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
                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms.message}</p>
                )}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
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

