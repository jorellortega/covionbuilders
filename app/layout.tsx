import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Head from 'next/head'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Covion Builders | Modern Construction Solutions",
  description: "Covion Builders delivers innovative, sustainable construction solutions for commercial, industrial, and residential projects.",
  openGraph: {
    title: 'Covion Builders | Modern Construction Solutions',
    description: 'Covion Builders delivers innovative, sustainable construction solutions for commercial, industrial, and residential projects.',
    url: 'https://covionbuilders.com',
    siteName: 'Covion Builders',
    images: [
      {
        url: 'https://covionbuilders.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Covion Builders',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@covionbuilders',
    title: 'Covion Builders | Modern Construction Solutions',
    description: 'Covion Builders delivers innovative, sustainable construction solutions for commercial, industrial, and residential projects.',
    images: ['https://covionbuilders.com/og-image.jpg'],
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Covion Builders",
              "url": "https://covionbuilders.com",
              "logo": "https://covionbuilders.com/og-image.jpg",
              "contactPoint": [{
                "@type": "ContactPoint",
                "telephone": "+1-555-123-4567",
                "contactType": "customer service",
                "email": "info@covionbuilders.com"
              }],
              "sameAs": [
                "https://twitter.com/covionbuilders",
                "https://linkedin.com/company/covionbuilders",
                "https://facebook.com/covionbuilders"
              ]
            })
          }}
        />
      </Head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'