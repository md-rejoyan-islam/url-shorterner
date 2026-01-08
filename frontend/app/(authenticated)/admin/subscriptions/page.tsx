import { AdminSubscriptionsContent } from "@/components/admin/admin-subscriptions-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Subscriptions | Admin",
  description:
    "View and manage all platform subscriptions. Monitor user plans, extend or cancel subscriptions.",
  openGraph: {
    title: "Manage Subscriptions | Admin | LinkShort",
    description: "Administrative subscription management dashboard.",
    type: "website",
  },
};

export default function AdminSubscriptionsPage() {
  return <AdminSubscriptionsContent />;
}
