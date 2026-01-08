import { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordWithToken } from "@/components/auth/reset-password-with-token";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Create a new password for your LinkShort account",
};

interface ResetPasswordPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordTokenPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordWithToken token={token} />
    </Suspense>
  );
}
