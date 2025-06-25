"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { toast } from "sonner"

export default function ReplyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [message, setMessage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetchMessage = async () => {
      setLoading(true)
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', id)
        .single()
      setMessage(data)
      setReply(data?.reply || "")
      setLoading(false)
    }
    fetchMessage()
  }, [id])

  const handleSaveReply = async () => {
    setSaving(true)
    console.log('Saving reply:', reply)
    const supabase = createSupabaseBrowserClient()
    const { error } = await supabase
      .from('quote_requests')
      .update({ reply })
      .eq('id', id)
    setSaving(false)
    if (error) {
      toast.error("Failed to save reply.")
    } else {
      toast.success("Reply saved!")
      const { data } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('id', id)
        .single()
      setMessage(data)
    }
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <main className="flex-1 container py-12 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">View & Reply</h1>
        {loading ? (
          <div>Loading...</div>
        ) : !message ? (
          <div>Message not found.</div>
        ) : (
          <div className="space-y-6 bg-background border border-border/40 rounded-xl p-6">
            <div className="text-xs text-muted-foreground mb-2">{message.created_at && new Date(message.created_at).toLocaleString()}</div>
            <div className="font-semibold mb-1">{message.first_name} {message.last_name}</div>
            <div className="mb-1 text-sm">{message.email} {message.phone && <>| {message.phone}</>}</div>
            <div className="mb-2 text-sm">
              <span className="font-medium">Type:</span> {message.request_type || 'quote'}
            </div>
            <div className="mb-2 text-sm">
              <span className="font-medium">Message:</span> {message.project_description || message.additional_comments || <span className="italic text-muted-foreground">(No message)</span>}
            </div>
            <div className="mb-2 text-green-500 text-sm">
              <span className="font-medium">Reply:</span> {message.reply || <span className="italic text-muted-foreground">(No reply yet)</span>}
            </div>
            <div className="space-y-2">
              <label htmlFor="reply" className="text-sm font-medium">Write a Reply</label>
              <Textarea
                id="reply"
                placeholder="Type your reply here..."
                rows={4}
                value={reply}
                onChange={e => setReply(e.target.value)}
              />
            </div>
            <Button onClick={handleSaveReply} disabled={saving} className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
              {saving ? "Saving..." : "Save Reply"}
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
} 