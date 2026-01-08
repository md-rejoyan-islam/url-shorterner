import { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your LinkShort email address",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyEmailForm />
    </Suspense>
  );
}
