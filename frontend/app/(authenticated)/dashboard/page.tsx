import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard ",
  description:
    "Manage your shortened URLs, track click analytics, and monitor your link performance all in one place.",
  openGraph: {
    title: "Dashboard | LinkShort",
    description:
      "Manage your shortened URLs, track click analytics, and monitor your link performance.",
    type: "website",
  },
};

export default function DashboardPage() {
  return <DashboardContent />;
}
