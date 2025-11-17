'use client';
import { useState, useEffect } from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

export default function GeneralLaborPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('service_pages')
        .select('*')
        .eq('slug', 'general-labor')
        .eq('is_active', true)
        .single();

      if (!error && data) {
        setPageData(data);
      }
    } catch (err) {
      console.error('Error loading page data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Default content if no database data
  const defaultData = {
    title: 'Professional General Labor Services',
    subtitle: 'Skilled and general labor for construction, site preparation, and support tasks. Our team ensures your project runs smoothly from start to finish.',
    services_section_title: 'Our General Labor Services',
    services_content: {
      left: {
        title: 'Site Preparation & Support',
        items: [
          'Site Cleanup & Maintenance',
          'Material Handling & Transport',
          'Equipment Setup & Support',
          'Safety Monitoring',
        ],
      },
      right: {
        title: 'Construction Support',
        items: [
          'Demolition Assistance',
          'General Construction Support',
          'Waste Removal',
          'Site Security',
        ],
      },
    },
    why_choose_title: 'Why Choose Our General Labor Services',
    why_choose_content: [
      { icon: '👷', title: 'Skilled Workforce', description: 'Experienced and trained professionals for all your labor needs' },
      { icon: '⚡', title: 'Efficient Service', description: 'Quick response and reliable support when you need it' },
      { icon: '🛡️', title: 'Safety First', description: 'Committed to maintaining the highest safety standards' },
    ],
    cta_title: 'Need Reliable Labor Support?',
    cta_description: 'Contact us today to discuss your project requirements',
  };

  const data = pageData || defaultData;

  if (loading) {
    return (
      <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="relative border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/20 py-16 md:py-24 overflow-hidden">
        {data.hero_image_url && (
          <div className="absolute inset-0 z-0">
            <img src={data.hero_image_url} alt={data.title} className="w-full h-full object-cover opacity-20" />
          </div>
        )}
        <div className="container relative z-20 mx-auto max-w-[800px] text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
            {data.title.split(' ').map((word: string, i: number) => 
              i === data.title.split(' ').length - 2 ? (
                <span key={i} className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            {data.subtitle}
          </p>
        </div>
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #4ade80 1px, transparent 1px), linear-gradient(to bottom, #4ade80 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </section>

      {/* Gallery Section */}
      {data.gallery_images && data.gallery_images.length > 0 && (
        <section className="py-12 bg-[#181818]">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold mb-6 text-white">Project Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.gallery_images.map((url: string, index: number) => (
                <img key={index} src={url} alt={`Project ${index + 1}`} className="rounded-xl w-full h-64 object-cover" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {data.video_url && (
        <section className="py-12 bg-[#141414]">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-6 text-white">Watch Our Work</h2>
            <div className="aspect-w-16 aspect-h-9 w-full rounded-xl overflow-hidden mx-auto">
              <iframe
                src={data.video_url}
                title="Service Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-72 md:h-96"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-[#141414]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">{data.services_section_title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {data.services_content?.left && (
              <div className="rounded-xl border border-border/40 p-8 bg-black/50">
                <h3 className="text-xl font-semibold mb-4 text-white">{data.services_content.left.title}</h3>
                <ul className="text-muted-foreground space-y-3">
                  {data.services_content.left.items?.map((item: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.services_content?.right && (
              <div className="rounded-xl border border-border/40 p-8 bg-black/50">
                <h3 className="text-xl font-semibold mb-4 text-white">{data.services_content.right.title}</h3>
                <ul className="text-muted-foreground space-y-3">
                  {data.services_content.right.items?.map((item: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <span className="mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {data.why_choose_content && data.why_choose_content.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">{data.why_choose_title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {data.why_choose_content.map((item: any, index: number) => (
                <div key={index} className="text-center">
                  <div className="mb-4 text-4xl">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#141414]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">{data.cta_title}</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            {data.cta_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                Get a Free Quote
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 