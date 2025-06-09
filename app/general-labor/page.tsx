import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function GeneralLaborPage() {
  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black z-10" />
        <div className="absolute inset-0 bg-[url('/general-labor-hero.jpg')] bg-cover bg-center" />
        <div className="container relative z-20 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl text-white">
            Professional General Labor Services
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Skilled and general labor for construction, site preparation, and support tasks. Our team ensures your project runs smoothly from start to finish.
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
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Our General Labor Services</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-xl border border-border/40 p-8 bg-black/50">
              <h3 className="text-xl font-semibold mb-4 text-white">Site Preparation & Support</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Site Cleanup & Maintenance
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Material Handling & Transport
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Equipment Setup & Support
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Safety Monitoring
                </li>
              </ul>
            </div>
            <div className="rounded-xl border border-border/40 p-8 bg-black/50">
              <h3 className="text-xl font-semibold mb-4 text-white">Construction Support</h3>
              <ul className="text-muted-foreground space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Demolition Assistance
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  General Construction Support
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Waste Removal
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Site Security
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose Our General Labor Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 text-4xl">👷</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Skilled Workforce</h3>
              <p className="text-muted-foreground">Experienced and trained professionals for all your labor needs</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Efficient Service</h3>
              <p className="text-muted-foreground">Quick response and reliable support when you need it</p>
            </div>
            <div className="text-center">
              <div className="mb-4 text-4xl">🛡️</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Safety First</h3>
              <p className="text-muted-foreground">Committed to maintaining the highest safety standards</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#141414]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Need Reliable Labor Support?</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Contact us today to discuss your project requirements
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