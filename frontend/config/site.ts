export const siteConfig = {
  name: "LinkShort",
  description: "Professional URL shortener with analytics and link management",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/linkshort",
    github: "https://github.com/linkshort",
  },
  creator: "LinkShort Team",
};

export type SiteConfig = typeof siteConfig;
