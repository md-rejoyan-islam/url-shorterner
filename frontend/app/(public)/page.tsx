import { HomeContent } from "@/components/home/home-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkShort - Shorten, Share & Track Your Links",
  description:
    "Transform long URLs into powerful short links. Get detailed analytics, custom branding, QR codes, and enterprise-grade reliability. Trusted by 50,000+ users worldwide.",
  keywords: [
    "URL shortener",
    "link shortener",
    "short links",
    "link analytics",
    "QR code generator",
    "link management",
    "link tracking",
    "custom short URLs",
    "branded links",
  ],
  openGraph: {
    title: "LinkShort - Shorten, Share & Track Your Links",
    description:
      "Transform long URLs into powerful short links. Get detailed analytics, custom branding, and enterprise-grade reliability.",
    type: "website",
    siteName: "LinkShort",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkShort - URL Shortener",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkShort - Shorten, Share & Track Your Links",
    description:
      "Transform long URLs into powerful short links. Get detailed analytics, custom branding, and enterprise-grade reliability.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function HomePage() {
  return <HomeContent />;
}
