import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script" // ✅ add this
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GlobeDk Elite | Professional O-Level & A-Level Tutoring in Harare",
  description:
    "GlobeDk Elite offers expert tutoring in Mathematics, English, Computer Science, and Geography for O-Level and A-Level students in Harare and Epworth. Join online or weekend classes and achieve top grades.",
  keywords: [
    "Harare tutoring",
    "O-Level lessons",
    "A-Level lessons",
    "Mathematics tutor",
    "Computer Science tutoring",
    "English lessons",
    "Geography lessons",
    "Epworth tutor",
    "academic support",
    "Zimbabwe tutoring",
    "private tutor Harare",
  ],
  openGraph: {
    title: "GlobeDk Elite – Excel in O-Level & A-Level Studies",
    description:
      "Join GlobeDk Elite for professional tutoring in Mathematics, English, Computer Science, and Geography. Available online and in-person in Harare.",
    url: "https://www.globedk.co.zw",
    images: [
      {
        url: "/image1.png",
        width: 1200,
        height: 630,
        alt: "GlobeDk Elite Tutoring in Harare",
      },
    ],
    locale: "en_ZW",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Structured Data (JSON-LD) for Google SEO */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "GlobeDk Elite Tutoring",
              image: "https://www.globedk.co.zw/image1.png",
              url: "https://www.globedk.co.zw",
              telephone: "+263786053315", 
              email: "johnariphiosd@gmail.com or jdaka@globedk.co.zw" ,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Epworth",
                addressLocality: "Harare",
                addressCountry: "ZW",
              },
              description:
                "Professional O-Level and A-Level tutoring in Mathematics, English, Computer Science, and Geography. Available online and in-person in Harare.",
              sameAs: [
                "https://www.facebook.com/profile.php?id=61582643098304",
             
              ],
              openingHours: "Mo-Sa 08:00-18:00",
            }),
          }}
        />
      </head>

      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
