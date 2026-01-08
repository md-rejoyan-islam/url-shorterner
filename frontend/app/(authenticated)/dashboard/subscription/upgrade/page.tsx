import { UpgradeContent } from "@/components/subscription/upgrade-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upgrade Plan",
  description:
    "Choose the perfect plan for your needs. Compare features and pricing to unlock more links, clicks, and premium features.",
  openGraph: {
    title: "Upgrade Plan | LinkShort",
    description: "Choose the perfect plan for your link management needs.",
    type: "website",
  },
};

export default function UpgradePage() {
  return <UpgradeContent />;
}
