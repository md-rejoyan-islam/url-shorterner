import { BillingContent } from "@/components/settings/billing-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
  description:
    "Manage your subscription, payment methods, and view billing history.",
  openGraph: {
    title: "Billing | LinkShort",
    description: "Manage your subscription and payment methods.",
    type: "website",
  },
};

export default function BillingPage() {
  return <BillingContent />;
}
