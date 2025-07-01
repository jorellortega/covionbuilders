import Link from "next/link"
import { Building2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 py-12 md:py-16">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Covion Builders</span>
            </div>
            <p className="mb-4 text-muted-foreground">
              Building the future with innovative construction solutions and sustainable practices.
            </p>
            <div className="flex space-x-4">
              {["Twitter", "LinkedIn", "Instagram", "Facebook"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="rounded-full bg-background p-2 text-foreground/80 transition-colors hover:text-primary"
                >
                  <span className="sr-only">{social}</span>
                  <div className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Services</h3>
            <ul className="space-y-2">
              {[
                { name: "Concrete", path: "/concrete" },
                { name: "General Labor", path: "/general-labor" },
                { name: "Painting", path: "/painting" },
                { name: "Roofing", path: "/roofing" },
                { name: "Remodeling", path: "/remodeling" },
                { name: "Landscaping", path: "/landscaping" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-muted-foreground transition-colors hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              {[
                { name: "About Us", path: "/about" },
                { name: "Projects", path: "/projects" },
                { name: "Careers", path: "/careers" },
                { name: "Contact", path: "/contact" },
                { name: "Login", path: "/login" },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.path} className="text-muted-foreground transition-colors hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <address className="not-italic text-muted-foreground">
              <p>123 Construction Way</p>
              <p>Building City, BC 12345</p>
              <p className="mt-2">info@covionbuilders.com</p>
              <p>(555) 123-4567</p>
            </address>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <p>© {new Date().getFullYear()} Covion Builders. All rights reserved. <span className="text-xs text-muted-foreground">Developed by JOR.</span></p>
            <a
              href="/login"
              className="inline-block rounded-md bg-gradient-to-r from-blue-600 to-emerald-500 px-4 py-2 text-white font-semibold shadow hover:from-blue-700 hover:to-emerald-600 transition-colors mt-2"
            >
              Login / Signup
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

