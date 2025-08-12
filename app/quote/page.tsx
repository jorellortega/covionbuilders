"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, FileText, HardHat, Ruler, CheckCircle, AlertCircle, Phone } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import { toast } from "sonner"
import { useRouter, useSearchParams } from 'next/navigation';

// Form validation schema
const quoteFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  projectDescription: z.string(),
  projectType: z.string().optional(),
  projectSize: z.string().optional(),
  projectLocation: z.string().optional(),
  projectTimeline: z.string().optional(),
  budget: z.string().optional(),
  company: z.string().optional(),
  services: z.array(z.string()).optional(),
  additionalComments: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, "You must agree to the terms and conditions"),
})

type QuoteFormData = z.infer<typeof quoteFormSchema>

const services = [
  "Architectural Design",
  "Construction Management", 
  "General Contracting",
  "Interior Design",
  "Demolition",
  "Site Preparation",
  "Structural Engineering",
  "Mechanical/Electrical/Plumbing",
  "Sustainability Consulting",
  "Permit Acquisition",
  "Project Financing",
  "Post-Construction Services",
]

export default function QuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      services: [],
      terms: false,
    },
  })

  const selectedServices = watch("services")

  // Detect signed-in user on mount
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id ?? null)
    })
  }, [])

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true)
    setUploading(true)
    let fileUrls: string[] = [];
    
    console.log('Submitting quote data:', data);
    console.log('Uploaded files:', uploadedFiles);
    
    try {
      const supabase = createSupabaseBrowserClient()
      
      // Handle file uploads if any files were selected
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          try {
            // Sanitize the filename to remove spaces and special characters
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${data.firstName.replace(/\s+/g, '_')}-${data.lastName.replace(/\s+/g, '_')}-${Date.now()}-${sanitizedName}`;
            const path = `quote_files/${fileName}`;
            const { error: uploadError } = await supabase.storage.from('builderfiles').upload(path, file, { upsert: true });
            if (uploadError) {
              console.error('File upload error:', uploadError);
              toast.error(`Failed to upload ${file.name}. Please try again.`);
              return;
            }
            const { data: publicUrlData } = supabase.storage.from('builderfiles').getPublicUrl(path);
            if (publicUrlData?.publicUrl) {
              fileUrls.push(publicUrlData.publicUrl);
            }
          } catch (fileError) {
            console.error('File upload error:', fileError);
            toast.error(`Failed to upload ${file.name}. Please try again.`);
            return;
          }
        }
      }
      
      const { error } = await supabase
        .from('quote_requests')
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            project_description: data.projectDescription,
            project_type: data.projectType || 'General Construction',
            project_size: data.projectSize || 'Not specified',
            project_location: data.projectLocation || 'Not specified',
            project_timeline: data.projectTimeline || 'Not specified',
            budget: data.budget || 'Not specified',
            company: data.company || null,
            services: data.services || [],
            additional_comments: data.additionalComments || null,
            status: 'pending',
            created_at: new Date().toISOString(),
            files: fileUrls,
          }
        ])

      if (error) {
        console.error('Error submitting quote:', error)
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast.error(`Failed to submit quote request: ${error.message}`)
        return
      }
      
      console.log('Quote submitted successfully!');
      console.log('Files saved:', fileUrls);
      console.log('Files array length:', fileUrls.length);

      toast.success("Quote request submitted successfully! We'll get back to you within 1-3 business days.")
      setIsSubmitted(true)
      reset()
      setUploadedFiles([])
    } catch (error) {
      console.error('Error submitting quote:', error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
      setUploading(false)
    }
  }

  const handleServiceToggle = (service: string) => {
    const currentServices = selectedServices || []
    const newServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service]
    setValue("services", newServices)
  }

  if (isSubmitted) {
    return (
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
                Your quote request has been submitted successfully. We'll review your project details and get back to you within 1-3 business days with a detailed estimate.
              </p>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>What happens next:</strong>
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• We'll acknowledge your request within 1-3 business days</li>
                  <li>• Our team will review your project requirements</li>
                  <li>• You'll receive a detailed quote within 3-5 business days</li>
                  <li>• We may schedule a consultation to discuss your needs</li>
                </ul>
              </div>
              <Button
                onClick={() => setIsSubmitted(false)}
                className="mt-8 bg-gradient-to-r from-blue-600 to-emerald-500"
              >
                Submit Another Quote Request
              </Button>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

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
            
            {/* Call Button */}
            <div className="flex flex-col justify-center items-center mb-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-6 py-3 flex items-center gap-2 mb-3"
                onClick={() => window.location.href = 'tel:+15551234567'}
              >
                <Phone className="h-5 w-5" />
                Call Us Now
              </Button>
              <p className="text-muted-foreground text-center">or fill out form below</p>
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

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="mb-4 text-lg font-medium">Contact Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        {...register("firstName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        {...register("lastName")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john.doe@example.com" 
                        {...register("email")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone
                      </label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="(555) 123-4567" 
                        {...register("phone")}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label htmlFor="projectDescription" className="text-sm font-medium">
                        Project Description
                      </label>
                      <Textarea
                        id="projectDescription"
                        placeholder="Please provide details about your project, including specific requirements, goals, and any challenges..."
                        rows={5}
                        {...register("projectDescription")}
                        className="w-full rounded-lg border border-border/40 bg-black text-white p-2 min-h-[80px]"
                      />
                      {errors.projectDescription && <div className="text-red-500 text-sm">{errors.projectDescription.message}</div>}
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2">
                      <label className="block mb-1 font-medium">Upload Photos or Files (optional)</label>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        multiple
                        onChange={e => setUploadedFiles(e.target.files ? Array.from(e.target.files) : [])}
                        className="w-full rounded-lg border border-border/40 bg-black text-white p-2"
                        disabled={uploading || isSubmitting}
                      />
                      {uploadedFiles.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">{uploadedFiles.length} file(s) selected</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Details, Services Needed, Additional Information as Accordion */}
                <Accordion type="multiple" className="mt-8">
                  <AccordionItem value="project-details">
                    <AccordionTrigger>Project Details</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="projectType" className="text-sm font-medium">
                            Project Type
                          </label>
                          <Select onValueChange={(value) => setValue("projectType", value)}>
                            <SelectTrigger id="projectType">
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
                          <label htmlFor="projectSize" className="text-sm font-medium">
                            Estimated Project Size (sq ft)
                          </label>
                          <Input 
                            id="projectSize" 
                            type="number" 
                            placeholder="5000" 
                            {...register("projectSize")}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="projectLocation" className="text-sm font-medium">
                            Project Location
                          </label>
                          <Input 
                            id="projectLocation" 
                            placeholder="City, State" 
                            {...register("projectLocation")}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="projectTimeline" className="text-sm font-medium">
                            Desired Timeline
                          </label>
                          <Select onValueChange={(value) => setValue("projectTimeline", value)}>
                            <SelectTrigger id="projectTimeline">
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
                          <Select onValueChange={(value) => setValue("budget", value)}>
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
                          <Input 
                            id="company" 
                            placeholder="Company Name" 
                            {...register("company")}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="services-needed">
                    <AccordionTrigger>Services Needed</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {services.map((service, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`service-${index}`}
                              checked={selectedServices?.includes(service)}
                              onCheckedChange={() => handleServiceToggle(service)}
                            />
                            <label 
                              htmlFor={`service-${index}`} 
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
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
                          <label htmlFor="additionalComments" className="text-sm font-medium">
                            Additional Comments or Questions
                          </label>
                          <Textarea 
                            id="additionalComments" 
                            placeholder="Any other information you'd like to share..." 
                            rows={3} 
                            {...register("additionalComments")}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={watch("terms")}
                    onCheckedChange={(checked) => setValue("terms", checked as boolean)}
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

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Quote Request"}
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
                    We'll acknowledge your quote request within 1-3 business days and provide a detailed estimate within 3-5
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

      {/* Sign Up Section */}
      <section className="border-t border-border/40 bg-gradient-to-br from-blue-950/20 via-background/95 to-background py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="mb-6 text-3xl font-bold">Stay Connected with Your Project</h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Create a free account to get real-time updates, track progress, and manage everything in one place.
            </p>
            
            <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-blue-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Live Updates</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Project Tracking</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/20 text-purple-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Quotes & Receipts</span>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600/20 text-orange-400">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">Easy Payments</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                With your account, you can:
              </p>
              <ul className="mx-auto max-w-[600px] space-y-2 text-muted-foreground">
                <li className="flex items-center justify-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Get real-time project updates and notifications</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>View all your projects, quotes, and receipts in one dashboard</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Make secure payments and track payment history</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  <span>Communicate directly with our team</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white" asChild>
                <Link href="/signup">Create Free Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Already have an account? Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

