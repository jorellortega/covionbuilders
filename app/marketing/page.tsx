"use client";
import { useState, useEffect } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Phone } from "lucide-react";

export default function MarketingPage() {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Concrete', path: '/concrete' },
    { name: 'General Labor', path: '/general-labor' },
    { name: 'Landscaping', path: '/landscaping' },
    { name: 'Remodeling', path: '/remodeling' },
    { name: 'Residential Development', path: '/residential-development' },
    { name: 'Roofing', path: '/roofing' },
    { name: 'Projects', path: '/projects' },
    { name: 'Careers', path: '/careers' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'CEO Dashboard', path: '/ceo' },
    { name: 'Payments', path: '/payments' },
    { name: 'Marketing', path: '/marketing' },
  ];
  const [selectedPage, setSelectedPage] = useState(pages[0].path);
  const [barcodeUrl, setBarcodeUrl] = useState("");
  const [phone, setPhone] = useState<string>("");
  const [inputPhone, setInputPhone] = useState<string>("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ctaPhone');
      if (stored) setPhone(stored);
    }
  }, []);

  const handleGenerateBarcode = () => {
    if (selectedPage) {
      const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${selectedPage}` : selectedPage;
      setBarcodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`);
    }
  };

  const handlePhoneChange = () => {
    setPhone(inputPhone);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ctaPhone', inputPhone);
    }
    setInputPhone("");
  };

  return (
    <div className="dark flex min-h-screen flex-col" style={{ backgroundColor: '#000000' }}>
      <Header />
      <main className="flex-1 container py-16">
        <h1 className="text-4xl font-bold mb-8 text-white">Marketing Tools</h1>
        {/* Barcode Generator */}
        <section className="mb-12 bg-[#141414] p-8 rounded-xl border border-border/40 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Generate QR Code for Platform Page</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <select
              value={selectedPage}
              onChange={e => setSelectedPage(e.target.value)}
              className="w-full md:w-1/2 rounded-md border border-border/40 bg-black/30 p-2 text-white"
            >
              {pages.map(page => (
                <option key={page.path} value={page.path}>{page.name}</option>
              ))}
            </select>
            <button
              onClick={handleGenerateBarcode}
              className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold px-6 py-2 rounded-md shadow hover:from-blue-700 hover:to-emerald-600 transition-colors"
            >
              Generate QR Code
            </button>
          </div>
          {barcodeUrl && (
            <div className="mt-6 flex flex-col items-center">
              <img src={barcodeUrl} alt="QR Code" className="w-40 h-40" />
              <p className="mt-2 text-muted-foreground break-all">
                {typeof window !== 'undefined' ? `${window.location.origin}${selectedPage}` : selectedPage}
              </p>
            </div>
          )}
        </section>
        {/* Add a card for changing the phone number */}
        <section className="mb-12 bg-[#141414] p-8 rounded-xl border border-border/40 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Change Call-to-Action Phone Number</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="tel"
              placeholder="Enter new phone number (e.g. +15551234567)"
              value={inputPhone}
              onChange={e => setInputPhone(e.target.value)}
              className="w-full md:w-1/2 rounded-md border border-border/40 bg-black/30 p-2 text-white"
            />
            <button
              onClick={handlePhoneChange}
              className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-semibold px-6 py-2 rounded-md shadow hover:from-blue-700 hover:to-emerald-600 transition-colors"
              type="button"
            >
              Update Phone Number
            </button>
          </div>
          {phone && (
            <div className="mt-4 text-muted-foreground">Current CTA Phone: <span className="text-white font-bold">{phone}</span></div>
          )}
        </section>
        {/* Placeholder for other marketing features */}
        <section className="bg-[#141414] p-8 rounded-xl border border-border/40 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-white">Other Marketing Features (Coming Soon)</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            <li>Email Campaign Builder</li>
            <li>Social Media Post Generator</li>
            <li>SEO Analyzer</li>
            <li>Analytics Dashboard</li>
            <li>And more...</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
} 