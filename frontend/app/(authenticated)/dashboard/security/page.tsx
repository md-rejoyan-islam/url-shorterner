import { SecurityContent } from "@/components/settings/security-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Manage your account security, change your password, and view active sessions.",
  openGraph: {
    title: "Security | LinkShort",
    description: "Manage your account security and password settings.",
    type: "website",
  },
};

export default function SecurityPage() {
  return <SecurityContent />;
}
