import { SubscriptionContent } from "@/components/subscription/subscription-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription",
  description:
    "Manage your subscription, view usage statistics, and track your plan features.",
  openGraph: {
    title: "Subscription | LinkShort",
    description: "Manage your subscription and view usage statistics.",
    type: "website",
  },
};

export default function SubscriptionPage() {
  return <SubscriptionContent />;
}
