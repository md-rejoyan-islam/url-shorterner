import { AdminDashboardContent } from "@/components/admin/admin-dashboard-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard ",
  description:
    "Monitor platform health, manage users, and track key metrics across the LinkShort platform.",
  openGraph: {
    title: "Admin Dashboard | LinkShort",
    description: "Platform overview and administrative controls.",
    type: "website",
  },
};

export default function AdminDashboardPage() {
  return <AdminDashboardContent />;
}
