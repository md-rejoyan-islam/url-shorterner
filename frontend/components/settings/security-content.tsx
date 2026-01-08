"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { History, Key, Loader2, Lock, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { deleteCookie } from "@/app/actions";
import { DataCard, PageHeader } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/lib/validations/user";
import {
  useChangePasswordMutation,
  useLogoutAllMutation,
} from "@/store/api/auth-api";
import { baseApi } from "@/store/api/base-api";
import { useAppDispatch } from "@/store/hooks";
import { getErrorMessage } from "@/types/api";

export function SecurityContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [logoutAll, { isLoading: isLoggingOutAll }] = useLogoutAllMutation();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: ChangePasswordFormData) {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success("Password Changed", {
        description: "Your password has been updated successfully.",
      });
      form.reset();
    } catch (error: unknown) {
      toast.error("Change Failed", {
        description: getErrorMessage(error, "Unable to change password"),
      });
    }
  }

  async function handleLogoutAllSessions() {
    try {
      await logoutAll().unwrap();
      toast.success("Sessions Signed Out", {
        description: "All sessions have been signed out. Redirecting to login...",
      });
    } catch (error: unknown) {
      toast.error("Sign Out Failed", {
        description: getErrorMessage(error, "Unable to sign out sessions"),
      });
      return;
    }

    // Clear cookies and redirect to login since all sessions (including current) are logged out
    await deleteCookie(AUTH_TOKEN_KEY);
    await deleteCookie(REFRESH_TOKEN_KEY);
    dispatch(baseApi.util.resetApiState());
    router.push("/login");
  }

  const securityTips = [
    "Use a unique password that you don't use anywhere else",
    "Include a mix of uppercase, lowercase, numbers, and symbols",
    "Avoid using personal information in your password",
    "Consider using a password manager",
    "Change your password periodically",
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Security"
        badge={{ icon: Shield, text: "Account Security" }}
        description="Manage your password and security settings"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Change Password */}
        <Card className=" border border-primary/15 shadow-none bg-white py-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand/10">
                <Key className="h-4 w-4 text-brand" />
              </div>
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 w-full"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Enter current password"
                            className="pl-10"
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
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        At least 8 characters with uppercase, lowercase, and
                        number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        {/* Session History */}
        <DataCard
          title="Active Sessions"
          description="Manage your active login sessions"
          icon={History}
          color="brand"
          noPadding={false}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-500/20 bg-emerald-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100">
                  <Shield className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-muted-foreground">
                    This device · Last active now
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">
                Active
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogoutAllSessions}
              disabled={isLoggingOutAll}
            >
              {isLoggingOutAll && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Out All Other Sessions
            </Button>
          </div>
        </DataCard>
      </div>
    </div>
  );
}
