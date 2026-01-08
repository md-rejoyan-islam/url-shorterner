import { AdminPaymentsContent } from "@/components/admin/admin-payments-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments | Admin",
  description:
    "View all platform payment transactions. Monitor revenue and payment status.",
  openGraph: {
    title: "Payments | Admin | LinkShort",
    description: "Administrative payment transaction dashboard.",
    type: "website",
  },
};

export default function AdminPaymentsPage() {
  return <AdminPaymentsContent />;
}
