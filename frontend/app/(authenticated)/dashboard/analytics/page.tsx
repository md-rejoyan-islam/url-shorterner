import { AnalyticsContent } from "@/components/analytics/analytics-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "Track your link performance with detailed analytics. Monitor clicks, geographic distribution, device types, and browser statistics.",
  openGraph: {
    title: "Analytics | LinkShort",
    description:
      "Track your link performance with detailed analytics and insights.",
    type: "website",
  },
};

export default function AnalyticsPage() {
  return <AnalyticsContent />;
}
