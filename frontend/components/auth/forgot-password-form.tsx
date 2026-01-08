"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, KeyRound, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/lib/validations/auth";
import { useForgotPasswordMutation } from "@/store/api/auth-api";
import { getErrorMessage } from "@/types/api";

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    try {
      await forgotPassword(data).unwrap();
      toast.success("Email Sent", {
        description: "Check your inbox for a password reset link.",
      });
      form.reset();
    } catch (error: unknown) {
      toast.error("Request Failed", {
        description: getErrorMessage(error, "Unable to send reset email"),
      });
    }
  }

  return (
    <Card className="border-[#e6560f]/10 shadow-xl shadow-[#e6560f]/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="space-y-3 text-center">
            <Badge className="bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5 font-medium">
              <KeyRound className="h-3.5 w-3.5 mr-1.5" />
              Password Recovery
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Forgot password?
            </h1>
            <p className="text-muted-foreground">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-900 dark:text-white font-medium">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="name@example.com"
                          className="pl-10 h-11 bg-white dark:bg-zinc-900 border-[#e6560f]/20 focus:border-[#e6560f] focus:ring-2 focus:ring-[#e6560f]/20 focus:ring-offset-2 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-linear-to-r from-[#e6560f] to-orange-500 hover:from-[#d14d0d] hover:to-orange-600 text-white shadow-lg shadow-[#e6560f]/25 hover:shadow-xl hover:shadow-[#e6560f]/30 transition-all duration-300 hover:-translate-y-0.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-[#e6560f] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
