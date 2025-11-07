'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardHref, setDashboardHref] = useState("/dashboard");
  const [aboutPageVisible, setAboutPageVisible] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(async ({ data }) => {
      setIsLoggedIn(!!data?.session?.user);
      if (data?.session?.user) {
        // Check role
        const { data: userData } = await supabase.from('users').select('role').eq('id', data.session.user.id).single();
        if (userData?.role === 'ceo') {
          setDashboardHref("/ceo");
        } else {
          setDashboardHref("/dashboard");
        }
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        supabase.from('users').select('role').eq('id', session.user.id).single().then(({ data: userData }) => {
          if (userData?.role === 'ceo') {
            setDashboardHref("/ceo");
          } else {
            setDashboardHref("/dashboard");
          }
        });
      } else {
        setDashboardHref("/dashboard");
      }
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

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Covion Builders</span>
            </Link>
          </div>

          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              {[
                { name: "Services", path: "/services" },
                { name: "Projects", path: "/projects" },
                ...(aboutPageVisible ? [{ name: "About", path: "/about" }] : []),
                { name: "Careers", path: "/careers" },
                { name: "Contact", path: "/contact" },
                { name: "Infinito AI", path: "/infinito-ai" },
              ]
                .concat(isLoggedIn ? [{ name: "Dashboard", path: dashboardHref }] : [{ name: "Login", path: "/login" }])
                .map((item) => (
                  <li key={item.name}>
                    <Link href={item.path} className="text-foreground/80 transition-colors hover:text-primary">
                      {item.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="hidden md:inline-flex" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white" asChild>
              <Link href="/quote">Get Quote</Link>
            </Button>
            {isLoggedIn && (
              <Button variant="ghost" onClick={handleLogout} className="text-foreground/80 hover:text-red-500">
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

