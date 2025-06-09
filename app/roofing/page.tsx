import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function RoofingPage() {
  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black z-10" />
        <div className="absolute inset-0 bg-[url('/roofing-hero.jpg')] bg-cover bg-center" />
        <div className="container relative z-20 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl text-white">
            Professional Roofing Services
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Expert roofing solutions for residential and commercial properties. From installation to maintenance, we ensure your roof provides lasting protection and peace of mind.
          </p>
          <Link href="/quote">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              Get a Free Quote
            </Button>
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-[#141414]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Roofing Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-border/40 p-8 bg-black/50">
              <h3 className="text-xl font-semibold mb-4 text-white">Installation & Replacement</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  New Roof Installation
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Complete Roof Replacement
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Flat & Pitched Roofs
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Metal & Shingle Roofing
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-border/40 p-8 bg-black/50">
              <h3 className="text-xl font-semibold mb-4 text-white">Maintenance & Repair</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Roof Inspections
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Emergency Repairs
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Preventative Maintenance
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Roof Coatings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose Our Roofing Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 text-4xl">👷</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Expert Team</h3>
              <p className="text-muted-foreground">Licensed and experienced roofing professionals</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">🛡️</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Quality Materials</h3>
              <p className="text-muted-foreground">Premium roofing materials and products</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Quick Response</h3>
              <p className="text-muted-foreground">Fast service for repairs and emergencies</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#141414]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Need Roofing Services?</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Contact us today for a free inspection and estimate
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