import { AdminUrlsContent } from "@/components/admin/admin-urls-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage URLs | Admin",
  description:
    "View and manage all shortened URLs on the platform. Monitor clicks, activate/deactivate links, and more.",
  openGraph: {
    title: "Manage URLs | Admin | LinkShort",
    description: "Administrative URL management dashboard.",
    type: "website",
  },
};

export default function AdminUrlsPage() {
  return <AdminUrlsContent />;
}
