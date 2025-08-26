"use client";
import Link from "next/link"
import { Building2 } from "lucide-react"
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [aboutPageVisible, setAboutPageVisible] = useState(true);
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data?.session?.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Fetch about page visibility setting
    const fetchAboutPageVisibility = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data } = await supabase
          .from('site_settings')
          .select('setting_value')
          .eq('setting_key', 'about_page_visible')
          .single();
        
        if (data) {
          setAboutPageVisible(data.setting_value === 'true');
        }
      } catch (err) {
        // Default to visible if setting not found
        setAboutPageVisible(true);
      }
    };
    fetchAboutPageVisibility();
  }, []);

  const companyLinks = [
    ...(aboutPageVisible ? [{ name: "About Us", path: "/about" }] : []),
    { name: "Projects", path: "/projects" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
    { name: "Login", path: "/login", hideWhenLoggedIn: true },
  ];

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
                "Concrete",
                "General Labor",
                "Painting",
                "Roofing",
                "Remodeling",
                "Landscaping",
              ].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-muted-foreground transition-colors hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              {companyLinks
                .filter(item => !(item.hideWhenLoggedIn && isLoggedIn))
                .map((item) => (
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
            <div className="text-muted-foreground">
              <p className="mb-2">Serving California</p>
              <p className="mb-2">covionbuilders@gmail.com</p>
              <p className="mb-2">(951) 723-4052</p>
              <p><Link href="/contact" className="text-primary hover:underline">Contact Us</Link></p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Covion Builders. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
