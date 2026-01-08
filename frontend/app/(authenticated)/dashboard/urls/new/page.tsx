import { CreateUrlContent } from "@/components/urls/create-url-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Link",
  description:
    "Create a new shortened URL. Add custom short codes, track clicks, and generate QR codes for your links.",
  openGraph: {
    title: "Create Link | LinkShort",
    description:
      "Create a new shortened URL with custom short codes and tracking.",
    type: "website",
  },
};

export default function CreateUrlPage() {
  return <CreateUrlContent />;
}
