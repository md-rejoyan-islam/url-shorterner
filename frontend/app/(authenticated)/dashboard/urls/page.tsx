import { UrlsListContent } from "@/components/urls/urls-list-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Links",
  description:
    "View and manage all your shortened URLs. Track clicks, edit links, generate QR codes, and analyze performance.",
  openGraph: {
    title: "My Links | LinkShort",
    description:
      "View and manage all your shortened URLs. Track clicks and analyze performance.",
    type: "website",
  },
};

export default function UrlsPage() {
  return <UrlsListContent />;
}
