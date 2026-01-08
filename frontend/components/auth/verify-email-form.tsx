"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyEmailMutation } from "@/store/api/auth-api";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail({ token }).unwrap();
        setStatus("success");
        setMessage("Your email has been verified successfully!");
      } catch (error: any) {
        setStatus("error");
        setMessage(error?.data?.message || "Verification failed. The link may have expired.");
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <div className="space-y-6 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <div>
            <h1 className="text-2xl font-bold">Verifying your email</h1>
            <p className="text-muted-foreground mt-1">Please wait...</p>
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Email Verified!</h1>
            <p className="text-muted-foreground mt-1">{message}</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/login">Continue to Login</Link>
          </Button>
        </>
      )}

      {status === "error" && (
        <>
          <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Verification Failed</h1>
            <p className="text-muted-foreground mt-1">{message}</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/login">Go to Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/register">Create New Account</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
