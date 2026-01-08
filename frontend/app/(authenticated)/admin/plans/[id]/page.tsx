import { EditPlanContent } from "@/components/admin/edit-plan-content";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlanPage({ params }: PageProps) {
  const { id } = await params;
  return <EditPlanContent planId={id} />;
}
