import { AdminUserDetailsContent } from "@/components/admin/admin-user-details-content";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminUserDetailsContent userId={id} />;
}
