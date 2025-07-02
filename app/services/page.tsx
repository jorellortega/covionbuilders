'use client';
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import React, { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import Link from "next/link"

const ICONS: Record<string, any> = {
  Building2: require('lucide-react').Building2,
  HardHat: require('lucide-react').HardHat,
  Hammer: require('lucide-react').Hammer,
  Ruler: require('lucide-react').Ruler,
  Shield: require('lucide-react').Shield,
  Layers: require('lucide-react').Layers,
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.from('services').select('*').order('title');
      if (!error && data) setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(search.toLowerCase()) ||
    service.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dark flex min-h-screen flex-col">
      <Header />
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
            <div className="mb-8 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-black/60 border-border/40 text-white"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading services...</div>
          ) : (
            <div className="grid gap-12">
              {filteredServices.map((service, index) => {
                const Icon = ICONS[service.icon as string] || ICONS.Building2;
                return (
                  <div
                    key={service.id}
                    className={`grid gap-8 rounded-xl border border-border/40 bg-card/30 p-8 md:grid-cols-2 ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
                  >
                    <div className={`flex flex-col justify-center ${index % 2 === 1 ? "md:col-start-2" : ""}`}>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/20 to-emerald-600/20 text-primary">
                        <Icon className="h-8 w-8" />
                      </div>
                      <h2 className="mb-4 text-3xl font-bold">{service.title}</h2>
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
                      <div>
                        <Link href={`/service/${service.id}`}>
                          <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
                            Request a Quote <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-center overflow-hidden rounded-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-emerald-600/10 backdrop-blur-[2px]"></div>
                      <img
                        src={`/placeholder.svg?height=400&width=600&text=${encodeURIComponent(service.title)}`}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                );
              })}
              {filteredServices.length === 0 && (
                <div className="text-center text-muted-foreground">No services found.</div>
              )}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

