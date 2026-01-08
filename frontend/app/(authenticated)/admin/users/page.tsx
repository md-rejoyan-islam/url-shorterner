import { AdminUsersContent } from "@/components/admin/admin-users-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Users | Admin",
  description:
    "View and manage all registered users on the platform. Update roles, activate/deactivate accounts, and more.",
  openGraph: {
    title: "Manage Users | Admin | LinkShort",
    description: "Administrative user management dashboard.",
    type: "website",
  },
};

export default function AdminUsersPage() {
  return <AdminUsersContent />;
}
