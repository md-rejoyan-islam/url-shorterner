"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2, Mail, Settings, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} from "@/store/api/auth-api";
import { getErrorMessage } from "@/types/api";

// Schema for the form - email is displayed but won't be sent to API
const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50),
  email: z.string().email("Please enter a valid email address"),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export function SettingsContent() {
  const { user } = useAuth();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploading }] = useUploadAvatarMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user, form]);

  async function onSubmit(data: ProfileFormData) {
    try {
      // Only send firstName and lastName - email cannot be updated via this endpoint
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
      }).unwrap();
      toast.success("Profile Updated", {
        description: "Your profile has been updated successfully.",
      });
    } catch (error: unknown) {
      console.error("Profile update error:", error);
      toast.error("Update Failed", {
        description: getErrorMessage(error, "Unable to update profile"),
      });
    }
  }

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", {
        description: "Please select an image file.",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", {
        description: "Please select an image smaller than 5MB.",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await uploadAvatar(formData).unwrap();
      toast.success("Avatar Updated", {
        description: "Your profile photo has been updated successfully.",
      });
    } catch (error: unknown) {
      toast.error("Upload Failed", {
        description: getErrorMessage(error, "Unable to upload avatar"),
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const initials = user
    ? `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`
    : "U";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Settings"
        badge={{ icon: Settings, text: "Profile Settings" }}
        description="Manage your account settings and preferences"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Photo Card */}
        <Card className="border border-primary/15 shadow-none bg-white lg:col-span-1 py-4">
          <CardHeader className="text-center pb-2">
            <CardTitle className="flex items-center justify-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-brand/10">
                <User className="h-4 w-4 text-brand" />
              </div>
              Profile Photo
            </CardTitle>
            <CardDescription>Your public profile image</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center pt-4">
            {/* Hidden file input for avatar upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                <AvatarImage src={user?.avatar || undefined} alt={user?.firstName} />
                <AvatarFallback className="text-3xl font-semibold bg-linear-to-br from-brand to-brand-light text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-10 w-10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleAvatarClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="mt-4 text-center">
              <h3 className="font-semibold text-lg">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 border-brand/20 hover:border-brand/40"
              onClick={handleAvatarClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Camera className="h-4 w-4 mr-2" />
              )}
              {isUploading ? "Uploading..." : "Change Photo"}
            </Button>
          </CardContent>
        </Card>

        {/* Profile Form Card */}
        <Card className="border border-primary/15 shadow-none bg-white lg:col-span-2 py-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand/10">
                <User className="h-4 w-4 text-brand" />
              </div>
              Personal Information
            </CardTitle>
            <CardDescription>
              Update your personal details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
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
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            className="pl-10 bg-muted/50 cursor-not-allowed"
                            disabled
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Email address cannot be changed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading} size="lg">
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
