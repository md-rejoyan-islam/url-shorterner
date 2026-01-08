"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Rocket,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { RegisterFormData, registerSchema } from "@/lib/validations/auth";
import { useRegisterMutation } from "@/store/api/auth-api";
import { getErrorMessage } from "@/types/api";

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await register(registerData).unwrap();
      toast.success("Registration Successful", {
        description:
          response.message ||
          "Your account has been created! Please check your email to verify your account.",
      });
      router.push("/login");
    } catch (error: unknown) {
      toast.error("Registration Failed", {
        description: getErrorMessage(error, "Unable to create account"),
      });
    }
  }

  return (
    <Card className="border-[#e6560f]/10 shadow-xl shadow-[#e6560f]/5 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="space-y-3 text-center">
            <Badge className="bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5 font-medium">
              <Rocket className="h-3.5 w-3.5 mr-1.5" />
              Get started free
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Start shortening and tracking your links today
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-900 dark:text-white font-medium">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="John"
                            className="pl-10 h-11 bg-white dark:bg-zinc-900 border-[#e6560f]/20 focus:border-[#e6560f] focus:ring-2 focus:ring-[#e6560f]/20 focus:ring-offset-2 transition-all"
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
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-900 dark:text-white font-medium">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Doe"
                            className="pl-10 h-11 bg-white dark:bg-zinc-900 border-[#e6560f]/20 focus:border-[#e6560f] focus:ring-2 focus:ring-[#e6560f]/20 focus:ring-offset-2 transition-all"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-900 dark:text-white font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          className="pl-10 pr-12 h-11 bg-white dark:bg-zinc-900 border-[#e6560f]/20 focus:border-[#e6560f] focus:ring-2 focus:ring-[#e6560f]/20 focus:ring-offset-2 transition-all"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-900 dark:text-white font-medium">
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm your password"
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
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
                Already a member?
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#e6560f] hover:text-[#d14d0d] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
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
