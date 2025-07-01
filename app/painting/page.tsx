import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function PaintingPage() {
  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      {/* Hero Section */}
      <section className="relative border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-blue-950/20 py-16 md:py-24 overflow-hidden">
        <div className="container relative z-20 mx-auto max-w-[800px] text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
            Professional <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Painting</span> Services
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Enhance your property with our expert interior and exterior painting services. We deliver flawless finishes for homes, offices, and commercial spaces.
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

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-[#141414]">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Painting Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-border/40 p-8 bg-black/50">
              <h3 className="text-xl font-semibold mb-4 text-white">Residential Painting</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex items-center"><span className="mr-2">•</span> Interior Walls & Ceilings</li>
                <li className="flex items-center"><span className="mr-2">•</span> Exterior Painting</li>
                <li className="flex items-center"><span className="mr-2">•</span> Trim & Doors</li>
                <li className="flex items-center"><span className="mr-2">•</span> Deck & Fence Staining</li>
              </ul>
            </div>
            <div className="rounded-xl border border-border/40 p-8 bg-black/50">
              <h3 className="text-xl font-semibold mb-4 text-white">Commercial Painting</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex items-center"><span className="mr-2">•</span> Office Spaces</li>
                <li className="flex items-center"><span className="mr-2">•</span> Retail & Storefronts</li>
                <li className="flex items-center"><span className="mr-2">•</span> Warehouses</li>
                <li className="flex items-center"><span className="mr-2">•</span> Specialty Coatings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose Our Painting Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 text-4xl">🎨</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Flawless Finish</h3>
              <p className="text-muted-foreground">Attention to detail for smooth, even coats and crisp lines</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">⏱️</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Efficient & Reliable</h3>
              <p className="text-muted-foreground">On-time project completion with minimal disruption</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">🛡️</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Quality Materials</h3>
              <p className="text-muted-foreground">Premium paints and coatings for lasting results</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#141414]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Transform Your Space?</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Contact us today to schedule your painting project or request a free estimate.
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