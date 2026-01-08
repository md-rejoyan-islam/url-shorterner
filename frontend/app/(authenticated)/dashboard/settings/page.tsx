import { SettingsContent } from "@/components/settings/settings-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Manage your account settings, update your profile information, and customize your preferences.",
  openGraph: {
    title: "Settings | LinkShort",
    description: "Manage your account settings and preferences.",
    type: "website",
  },
};

export default function SettingsPage() {
  return <SettingsContent />;
}
