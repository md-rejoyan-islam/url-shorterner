"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { resetPasswordSchema, ResetPasswordFormData } from "@/lib/validations/auth";
import { useResetPasswordMutation } from "@/store/api/auth-api";
import { getErrorMessage } from "@/types/api";

interface ResetPasswordWithTokenProps {
  token: string;
}

export function ResetPasswordWithToken({ token }: ResetPasswordWithTokenProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      await resetPassword({ token, password: data.password }).unwrap();
      toast.success("Password Reset", {
        description: "Your password has been reset successfully!",
      });
      router.push("/login");
    } catch (error: unknown) {
      toast.error("Password Reset Failed", {
        description: getErrorMessage(error, "Unable to reset password"),
      });
    }
  }

  if (!token) {
    return (
      <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 bg-red-100 text-red-700">
                <KeyRound className="h-3.5 w-3.5" />
                Invalid Link
              </Badge>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Invalid Link</h1>
              <p className="text-muted-foreground mt-1">
                This password reset link is invalid or has expired.
              </p>
            </div>
            <Button
              asChild
              className="w-full bg-linear-to-r from-[#e6560f] to-[#ff7a3d] hover:from-[#d14e0e] hover:to-[#e6560f] text-white"
            >
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl bg-card/95 backdrop-blur-sm">
      <CardContent className="pt-8 pb-8 px-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <KeyRound className="h-3.5 w-3.5" />
                Reset Password
              </Badge>
            </div>
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="text-muted-foreground mt-1">Enter your new password below</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-linear-to-r from-[#e6560f] to-[#ff7a3d] hover:from-[#d14e0e] hover:to-[#e6560f] text-white"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </form>
          </Form>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" className="text-[#e6560f] hover:underline font-medium">
              Back to login
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
