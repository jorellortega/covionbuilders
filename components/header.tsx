'use client';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { useEffect, useState } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
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
                { name: "About", path: "/about" },
                { name: "Careers", path: "/careers" },
                { name: "Contact", path: "/contact" },
              ]
                .concat(isLoggedIn ? [{ name: "Dashboard", path: "/dashboard" }] : [{ name: "Login", path: "/login" }])
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

