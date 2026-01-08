import { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailWithToken } from "@/components/auth/verify-email-with-token";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your LinkShort email address",
};

interface VerifyEmailPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function VerifyEmailTokenPage({ params }: VerifyEmailPageProps) {
  const { token } = await params;

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyEmailWithToken token={token} />
    </Suspense>
  );
}
