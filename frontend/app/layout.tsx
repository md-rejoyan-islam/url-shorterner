import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import { AuthProvider } from "@/providers/auth-provider";
import { StoreProvider } from "@/providers/store-provider";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "URL shortener",
    "link shortener",
    "short links",
    "link management",
    "analytics",
    "QR codes",
  ],
  authors: [{ name: siteConfig.creator }],
  creator: siteConfig.creator,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check for auth cookies server-side
  const cookieStore = await cookies();
  const hasAccessToken = !!cookieStore.get(AUTH_TOKEN_KEY)?.value;
  const hasRefreshToken = !!cookieStore.get(REFRESH_TOKEN_KEY)?.value;
  const hasAuthCookies = hasAccessToken || hasRefreshToken;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <StoreProvider>
          <AuthProvider hasAuthCookies={hasAuthCookies}>
            {children}
            <Toaster
              position="top-right"
              closeButton
              toastOptions={{
                classNames: {
                  error: "bg-red-500/80! text-white! border-red-600!",
                  success: "bg-green-500! text-white! border-green-600!",
                },
              }}
            />
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
