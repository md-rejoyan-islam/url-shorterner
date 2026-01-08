"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVerifyEmailMutation } from "@/store/api/auth-api";
import { getErrorMessage } from "@/types/api";

interface VerifyEmailWithTokenProps {
  token: string;
}

export function VerifyEmailWithToken({ token }: VerifyEmailWithTokenProps) {
  const [verifyEmail] = useVerifyEmailMutation();
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
      } catch (error: unknown) {
        setStatus("error");
        setMessage(getErrorMessage(error, "Verification failed. The link may have expired."));
      }
    };

    verify();
  }, [token, verifyEmail]);

  return (
    <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-sm">
      <CardContent className="pt-8 pb-8 px-8">
        <div className="space-y-6 text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center">
                <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verifying
                </Badge>
              </div>
              <Loader2 className="h-16 w-16 animate-spin text-[#e6560f] mx-auto" />
              <div>
                <h1 className="text-2xl font-bold">Verifying your email</h1>
                <p className="text-muted-foreground mt-1">Please wait...</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center">
                <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 bg-green-100 text-green-700">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Verified
                </Badge>
              </div>
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Email Verified!</h1>
                <p className="text-muted-foreground mt-1">{message}</p>
              </div>
              <Button
                asChild
                className="w-full bg-linear-to-r from-[#e6560f] to-[#ff7a3d] hover:from-[#d14e0e] hover:to-[#e6560f] text-white"
              >
                <Link href="/login">Continue to Login</Link>
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center">
                <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 bg-red-100 text-red-700">
                  <XCircle className="h-3.5 w-3.5" />
                  Failed
                </Badge>
              </div>
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Verification Failed</h1>
                <p className="text-muted-foreground mt-1">{message}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  asChild
                  className="w-full bg-linear-to-r from-[#e6560f] to-[#ff7a3d] hover:from-[#d14e0e] hover:to-[#e6560f] text-white"
                >
                  <Link href="/login">Go to Login</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/register">Create New Account</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
