"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import Link from "next/link"

const quickQuoteSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone required"),
  projectDescription: z.string().min(10, "Project description required"),
})

type QuickQuoteData = z.infer<typeof quickQuoteSchema>

export function QuickQuoteForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuickQuoteData>({
    resolver: zodResolver(quickQuoteSchema),
  })

  const onSubmit = async (data: QuickQuoteData) => {
    setLoading(true)
    setUploading(true)
    let fileUrls: string[] = []
    try {
      const supabase = createSupabaseBrowserClient()
      if (uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          const fileExt = file.name.split('.').pop()
          const fileName = `${data.firstName}-${data.lastName}-${Date.now()}-${file.name}`
          const path = `quote_files/${fileName}`
          const { error: uploadError } = await supabase.storage.from('builderfiles').upload(path, file, { upsert: true })
          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage.from('builderfiles').getPublicUrl(path)
            fileUrls.push(publicUrlData.publicUrl)
          }
        }
      }
      await supabase.from('quote_requests').insert([
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          project_description: data.projectDescription,
          project_type: 'Quick Quote',
          project_size: 'Not specified',
          project_location: 'Not specified',
          project_timeline: 'Not specified',
          budget: 'Not specified',
          company: null,
          services: [],
          additional_comments: null,
          status: 'pending',
          created_at: new Date().toISOString(),
          files: fileUrls,
        }
      ])
      setSubmitted(true)
      reset()
      setUploadedFiles([])
    } catch (e) {
      alert("There was an error submitting your request. Please try again.")
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <div className="text-green-500 text-lg font-semibold">Thank you! We'll contact you soon.</div>
        <Link href="/quote?expandDetails=1" className="text-primary underline">Add more project details</Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">First Name</label>
          <Input {...register("firstName")}/>
          {errors.firstName && <div className="text-red-500 text-sm">{errors.firstName.message}</div>}
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Last Name</label>
          <Input {...register("lastName")}/>
          {errors.lastName && <div className="text-red-500 text-sm">{errors.lastName.message}</div>}
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block mb-1 font-medium">Email</label>
          <Input {...register("email")}/>
          {errors.email && <div className="text-red-500 text-sm">{errors.email.message}</div>}
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-medium">Phone</label>
          <Input {...register("phone")}/>
          {errors.phone && <div className="text-red-500 text-sm">{errors.phone.message}</div>}
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium">Project Description</label>
        <textarea
          {...register("projectDescription")}
          className="w-full rounded-lg border border-border/40 bg-black text-white p-2 min-h-[80px]"
        />
        {errors.projectDescription && <div className="text-red-500 text-sm">{errors.projectDescription.message}</div>}
      </div>
      <div>
        <label className="block mb-1 font-medium">
          <span className="hidden md:inline">Upload Photos or Files (optional)</span>
          <span className="md:hidden">optional</span>
        </label>
        <input
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          multiple
          onChange={e => setUploadedFiles(e.target.files ? Array.from(e.target.files) : [])}
          className="w-full rounded-lg border border-border/40 bg-black text-white p-2"
          disabled={uploading || loading}
        />
        {uploadedFiles.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1">{uploadedFiles.length} file(s) selected</div>
        )}
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white" disabled={loading}>
        {loading ? "Submitting..." : "Request Quote"}
      </Button>
      <div className="text-center mt-2">
        <Link href="/quote?expandDetails=1" className="text-primary underline">Want to provide more details?</Link>
      </div>
    </form>
  )
} 