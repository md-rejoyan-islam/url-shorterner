"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { setCookie } from "@/app/actions";
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
import { Separator } from "@/components/ui/separator";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import { LoginFormData, loginSchema } from "@/lib/validations/auth";
import { useLoginMutation } from "@/store/api/auth-api";
import { baseApi } from "@/store/api/base-api";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/auth-slice";
import { getErrorMessage } from "@/types/api";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await login(data).unwrap();

      if (response.data) {
        const { user, accessToken, refreshToken } = response.data;

        // Set cookies via server action
        await setCookie(AUTH_TOKEN_KEY, accessToken);
        await setCookie(REFRESH_TOKEN_KEY, refreshToken);

        // Update Redux store immediately to prevent auth provider from redirecting
        dispatch(setUser(user));
        // Invalidate any cached auth queries to ensure fresh state
        dispatch(baseApi.util.invalidateTags(["User"]));

        toast.success("Login Successful", { description: "Welcome back!" });

        // Redirect based on user role
        const isAdmin = user?.role === "admin";
        const redirectPath = isAdmin ? "/admin" : "/dashboard";

        // Use replace to prevent back navigation to login page
        router.replace(redirectPath);
      }
    } catch (error: unknown) {
      toast.error("Login Failed", {
        description: getErrorMessage(error, "Invalid credentials"),
      });
    }
  }

  return (
    <Card className="border-[#e6560f]/10 shadow-xl shadow-[#e6560f]/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="space-y-3 text-center">
            <Badge className="bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5 font-medium">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Welcome back
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Sign in to your account
            </h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                          className="pl-10 h-12 bg-white dark:bg-zinc-900 border-[#e6560f]/20 focus:border-[#e6560f] focus:ring-2 focus:ring-[#e6560f]/20 focus:ring-offset-2 transition-all"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-zinc-900 dark:text-white font-medium">
                        Password
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-[#e6560f] hover:text-[#d14d0d] font-medium transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-12 h-12 bg-white dark:bg-zinc-900 border-[#e6560f]/20 focus:border-[#e6560f] focus:ring-2 focus:ring-[#e6560f]/20 focus:ring-offset-2 transition-all"
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
                            <EyeOff className="h-4 w-4 text-muted-foreground hover:text-[#e6560f] transition-colors" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground hover:text-[#e6560f] transition-colors" />
                          )}
                        </Button>
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-zinc-900 px-2 text-muted-foreground">
                New to LinkShort?
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Don&apos;t have an account yet?
            </p>
            <Button
              variant="outline"
              className="w-full h-11 border-[#e6560f]/30 hover:bg-[#e6560f]/5 hover:border-[#e6560f]/50 hover:text-[#e6560f] transition-all"
              asChild
            >
              <Link href="/register">
                Create an account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-[#e6560f] hover:text-[#d14d0d] hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-[#e6560f] hover:text-[#d14d0d] hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
