import { SettingsContent } from "@/components/settings/settings-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Settings",
  description:
    "Configure platform-wide settings including general options, notifications, and security.",
  openGraph: {
    title: "Admin Settings | LinkShort",
    description: "Platform configuration and settings.",
    type: "website",
  },
};

export default function AdminSettingsPage() {
  return <SettingsContent />;
}
