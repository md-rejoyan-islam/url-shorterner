import { AdminPlansContent } from "@/components/admin/admin-plans-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Plans | Admin",
  description:
    "Create and manage subscription plans. Set pricing, features, and limits for each plan tier.",
  openGraph: {
    title: "Manage Plans | Admin | LinkShort",
    description: "Administrative plan management dashboard.",
    type: "website",
  },
};

export default function AdminPlansPage() {
  return <AdminPlansContent />;
}
