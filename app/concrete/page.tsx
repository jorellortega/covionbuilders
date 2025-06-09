import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function ConcretePage() {
  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black z-10" />
        <div className="absolute inset-0 bg-[url('/concrete-hero.jpg')] bg-cover bg-center" />
        <div className="container relative z-20 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl text-white">
            Professional Concrete Solutions
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Expert concrete work for foundations, driveways, sidewalks, retaining walls, and more. Our skilled team delivers durable, high-quality results for every project.
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
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Concrete Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-border/40 p-8 bg-black/50">
              <h3 className="text-xl font-semibold mb-4 text-white">Residential Services</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Driveways & Patios
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Sidewalks & Walkways
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Foundation Work
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Garage Floors
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-border/40 p-8 bg-black/50">
              <h3 className="text-xl font-semibold mb-4 text-white">Commercial Services</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Parking Lots
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Warehouse Floors
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Industrial Slabs
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Retaining Walls
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose Our Concrete Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 text-4xl">🏗️</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Expert Craftsmanship</h3>
              <p className="text-muted-foreground">Skilled professionals with years of experience in concrete work</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Quality Materials</h3>
              <p className="text-muted-foreground">Premium concrete mixes and materials for lasting results</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">📅</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Timely Service</h3>
              <p className="text-muted-foreground">Efficient project completion with minimal disruption</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#141414]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Start Your Project?</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Contact us today for a free consultation and estimate
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