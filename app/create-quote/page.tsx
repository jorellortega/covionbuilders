"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Save, Send, Eye } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import { toast } from "sonner"

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

export default function CreateQuotePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [createdQuoteId, setCreatedQuoteId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectDescription: '',
    projectType: 'General Construction',
    projectSize: '',
    projectLocation: '',
    projectTimeline: '',
    budget: '',
    services: [] as string[],
    additionalComments: '',
    estimatedPrice: '',
    status: 'quoted' as 'pending' | 'reviewed' | 'quoted' | 'contacted' | 'closed'
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleServiceToggle = (service: string) => {
    const currentServices = formData.services
    const newServices = currentServices.includes(service)
      ? currentServices.filter(s => s !== service)
      : [...currentServices, service]
    setFormData(prev => ({ ...prev, services: newServices }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createSupabaseBrowserClient()
      
      const { data, error } = await supabase
        .from('quote_requests')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            company: formData.company || null,
            project_description: formData.projectDescription,
            project_type: formData.projectType,
            project_size: formData.projectSize || 'Not specified',
            project_location: formData.projectLocation,
            project_timeline: formData.projectTimeline,
            budget: formData.budget || 'Not specified',
            services: formData.services,
            additional_comments: formData.additionalComments || null,
            status: formData.status,
            estimated_price: formData.estimatedPrice ? parseFloat(formData.estimatedPrice) : null,
            created_at: new Date().toISOString(),
            files: []
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating quote:', error)
        toast.error(`Failed to create quote: ${error.message}`)
        return
      }
      
      setCreatedQuoteId(data.id)
      toast.success("Quote created successfully!")
      setIsSubmitted(true)
      
    } catch (error) {
      console.error('Error creating quote:', error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewQuote = () => {
    if (createdQuoteId) {
      window.open(`/viewquote/${createdQuoteId}`, '_blank')
    }
  }

  const handleCreateAnother = () => {
    setIsSubmitted(false)
    setCreatedQuoteId(null)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      projectDescription: '',
      projectType: 'General Construction',
      projectSize: '',
      projectLocation: '',
      projectTimeline: '',
      budget: '',
      services: [],
      additionalComments: '',
      estimatedPrice: '',
      status: 'quoted'
    })
  }

  if (isSubmitted) {
    return (
      <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
        <Header />
        <section className="flex-1 flex items-center justify-center py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-[600px] text-center">
              <div className="mb-8 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <h1 className="mb-4 text-3xl font-bold text-white">Quote Created Successfully!</h1>
              <p className="mb-8 text-xl text-muted-foreground">
                The quote has been created and is ready to share with your customer.
              </p>
              <div className="space-y-4">
                <div className="bg-[#141414] p-4 rounded-lg border border-border/40">
                  <p className="text-sm text-muted-foreground mb-2">Quote ID:</p>
                  <p className="font-mono text-white text-lg">{createdQuoteId}</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={handleViewQuote}
                    className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Quote
                  </Button>
                  <Button 
                    onClick={handleCreateAnother}
                    variant="outline"
                  >
                    Create Another Quote
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Share this quote ID with your customer, or send them the direct link:</p>
                  <p className="font-mono text-blue-400 mt-2">
                    {typeof window !== 'undefined' ? `${window.location.origin}/viewquote/${createdQuoteId}` : ''}
                  </p>
                </div>
              </div>
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
      <section className="flex-1 py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-4xl font-bold text-white">Create Quote for Customer</h1>
              <p className="text-xl text-muted-foreground">
                Create a new quote request on behalf of your customer
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="bg-[#141414] rounded-xl p-6 border border-border/40">
                <h2 className="text-2xl font-bold text-white mb-4">Customer Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-white font-semibold">First Name *</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                      className="bg-black/30 border-border/40 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-white font-semibold">Last Name *</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                      className="bg-black/30 border-border/40 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-white font-semibold">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="bg-black/30 border-border/40 text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-white font-semibold">Phone *</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                      className="bg-black/30 border-border/40 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-2 text-white font-semibold">Company</label>
                    <Input
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="bg-black/30 border-border/40 text-white"
                      placeholder="Optional"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-[#141414] rounded-xl p-6 border border-border/40">
                <h2 className="text-2xl font-bold text-white mb-4">Project Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-white font-semibold">Project Description *</label>
                    <Textarea
                      value={formData.projectDescription}
                      onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                      required
                      rows={4}
                      className="bg-black/30 border-border/40 text-white"
                      placeholder="Describe the project in detail..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-white font-semibold">Project Type *</label>
                      <Select value={formData.projectType} onValueChange={(value) => handleInputChange('projectType', value)}>
                        <SelectTrigger className="bg-black/30 border-border/40 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Construction">General Construction</SelectItem>
                          <SelectItem value="Residential">Residential</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Renovation">Renovation</SelectItem>
                          <SelectItem value="New Build">New Build</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Project Size</label>
                      <Input
                        value={formData.projectSize}
                        onChange={(e) => handleInputChange('projectSize', e.target.value)}
                        className="bg-black/30 border-border/40 text-white"
                        placeholder="e.g., 2000 sq ft"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Location *</label>
                      <Input
                        value={formData.projectLocation}
                        onChange={(e) => handleInputChange('projectLocation', e.target.value)}
                        required
                        className="bg-black/30 border-border/40 text-white"
                        placeholder="City, State or Address"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Timeline</label>
                      <Input
                        value={formData.projectTimeline}
                        onChange={(e) => handleInputChange('projectTimeline', e.target.value)}
                        className="bg-black/30 border-border/40 text-white"
                        placeholder="e.g., 3-6 months"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Budget Range</label>
                      <Input
                        value={formData.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        className="bg-black/30 border-border/40 text-white"
                        placeholder="e.g., $50k-$100k"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-white font-semibold">Status</label>
                      <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                        <SelectTrigger className="bg-black/30 border-border/40 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="quoted">Quoted</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="bg-[#141414] rounded-xl p-6 border border-border/40">
                <h2 className="text-2xl font-bold text-white mb-4">Services Required</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <Checkbox
                        id={service}
                        checked={formData.services.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                        className="border-border/40"
                      />
                      <label htmlFor={service} className="text-sm text-white cursor-pointer">
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-[#141414] rounded-xl p-6 border border-border/40">
                <h2 className="text-2xl font-bold text-white mb-4">Pricing</h2>
                <div>
                  <label className="block mb-2 text-white font-semibold">Estimated Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">$</span>
                    <Input
                      type="number"
                      value={formData.estimatedPrice}
                      onChange={(e) => handleInputChange('estimatedPrice', e.target.value)}
                      required
                      className="bg-black/30 border-border/40 text-white pl-8"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will be the amount the customer sees and needs to pay
                  </p>
                </div>
              </div>

              {/* Additional Comments */}
              <div className="bg-[#141414] rounded-xl p-6 border border-border/40">
                <h2 className="text-2xl font-bold text-white mb-4">Additional Information</h2>
                <div>
                  <label className="block mb-2 text-white font-semibold">Additional Comments</label>
                  <Textarea
                    value={formData.additionalComments}
                    onChange={(e) => handleInputChange('additionalComments', e.target.value)}
                    rows={3}
                    className="bg-black/30 border-border/40 text-white"
                    placeholder="Any additional notes, special requirements, or conditions..."
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold px-8 py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Save className="mr-2 h-5 w-5 animate-spin" />
                      Creating Quote...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Create Quote
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/allquotes')}
                  className="px-8 py-3 text-lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
