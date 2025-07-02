'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { ArrowRight } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const ICONS: Record<string, any> = {
  Building2: require('lucide-react').Building2,
  HardHat: require('lucide-react').HardHat,
  Hammer: require('lucide-react').Hammer,
  Ruler: require('lucide-react').Ruler,
  Shield: require('lucide-react').Shield,
  Layers: require('lucide-react').Layers,
};

export default function ServiceDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    project_details: '',
  });
  const [optional, setOptional] = useState({
    project_size: '',
    project_location: '',
    project_timeline: '',
    budget: '',
    company: '',
    additional_comments: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (!id) return;
    const fetchService = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('services').select('*').eq('id', id).single();
      if (!error && data) setService(data);
      setLoading(false);
    };
    fetchService();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleOptionalChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setOptional({ ...optional, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.project_details) {
      setError('Please fill in all required fields.');
      return;
    }
    // Insert quote request (customize table/fields as needed)
    const { error } = await supabase.from('quote_requests').insert({
      first_name: form.name,
      email: form.email,
      phone: form.phone,
      project_description: form.project_details,
      project_type: service?.title || '',
      services: service?.title || '',
      project_size: optional.project_size || null,
      project_location: optional.project_location || null,
      project_timeline: optional.project_timeline || null,
      budget: optional.budget || null,
      company: optional.company || null,
      additional_comments: optional.additional_comments || null,
    });
    if (error) { setError(error.message); return; }
    setSubmitted(true);
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!service) return <div className="min-h-screen flex items-center justify-center text-red-500">Service not found.</div>;

  const Icon = ICONS[service.icon as string] || ICONS.Building2;

  return (
    <div className="dark flex min-h-screen flex-col">
      <Header />
      <section className="py-16 md:py-24">
        <div className="container max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-1">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/20 to-emerald-600/20 text-primary">
                <Icon className="h-8 w-8" />
              </div>
              <h1 className="mb-4 text-3xl font-bold text-white">{service.title}</h1>
              <p className="mb-6 text-muted-foreground">{service.description}</p>
              {service.features && Array.isArray(service.features) && (
                <div className="mb-6">
                  <h3 className="mb-3 text-lg font-medium">Key Features:</h3>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {service.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="flex-1 bg-[#181818] rounded-xl p-8 border border-border/40 shadow-lg w-full max-w-md mx-auto">
              <h2 className="text-2xl font-bold mb-4 text-white">Request a Quote</h2>
              {submitted ? (
                <div className="text-green-400 font-semibold text-center">Thank you! Your quote request has been submitted.</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-white font-semibold">Service</label>
                    <Input value={service.title} disabled className="bg-black/30 text-white" />
                  </div>
                  <div>
                    <label className="block mb-1 text-white font-semibold">Name</label>
                    <Input name="name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block mb-1 text-white font-semibold">Email</label>
                    <Input name="email" type="email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className="block mb-1 text-white font-semibold">Phone</label>
                    <Input name="phone" value={form.phone} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block mb-1 text-white font-semibold">Project Details</label>
                    <textarea name="project_details" value={form.project_details} onChange={handleChange} className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white" rows={3} required />
                  </div>
                  <Accordion type="single" collapsible className="mb-4">
                    <AccordionItem value="optional">
                      <AccordionTrigger className="text-white font-semibold">Add Optional Project Details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 mt-2">
                          <div>
                            <label className="block mb-1 text-white font-semibold">Project Size</label>
                            <Input name="project_size" value={optional.project_size} onChange={handleOptionalChange} />
                          </div>
                          <div>
                            <label className="block mb-1 text-white font-semibold">Project Location</label>
                            <Input name="project_location" value={optional.project_location} onChange={handleOptionalChange} />
                          </div>
                          <div>
                            <label className="block mb-1 text-white font-semibold">Project Timeline</label>
                            <Input name="project_timeline" value={optional.project_timeline} onChange={handleOptionalChange} />
                          </div>
                          <div>
                            <label className="block mb-1 text-white font-semibold">Budget</label>
                            <Input name="budget" value={optional.budget} onChange={handleOptionalChange} />
                          </div>
                          <div>
                            <label className="block mb-1 text-white font-semibold">Company</label>
                            <Input name="company" value={optional.company} onChange={handleOptionalChange} />
                          </div>
                          <div>
                            <label className="block mb-1 text-white font-semibold">Additional Comments</label>
                            <textarea name="additional_comments" value={optional.additional_comments} onChange={handleOptionalChange} className="w-full rounded-md border border-border/40 bg-black/30 p-2 text-white" rows={2} />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold w-full">Submit Quote Request <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
} 