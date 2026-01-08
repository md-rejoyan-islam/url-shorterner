"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { AlertTriangle, ArrowLeft, CalendarIcon, Globe, Link2, Loader2, Plus, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CreateUrlFormData, createUrlSchema } from "@/lib/validations/url";
import { useCreateUrlMutation } from "@/store/api/url-api";
import { useGetMySubscriptionQuery } from "@/store/api/subscription-api";
import { getErrorMessage } from "@/types/api";
import { IPlan } from "@/types/plan";

export function CreateUrlContent() {
  const router = useRouter();
  const [createUrl, { isLoading }] = useCreateUrlMutation();
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useGetMySubscriptionQuery();

  // Get subscription and plan info
  const subscription = subscriptionData?.data;
  const plan = subscription?.plan as IPlan | undefined;
  const usage = subscription?.usage;

  // Check if user can create links
  const urlLimit = plan?.maxLinks ?? plan?.features?.urlLimit ?? 100;
  const currentLinks = usage?.links ?? 0;
  const isUnlimited = urlLimit === -1;
  const hasReachedLimit = !isUnlimited && currentLinks >= urlLimit;

  // Check subscription status (free plan has status "free", paid has "active")
  const subscriptionStatus = subscription?.status;
  const isSubscriptionActive = subscriptionStatus === "free" || subscriptionStatus === "active";

  // Determine if creation is allowed
  const canCreateLink = isSubscriptionActive && !hasReachedLimit;

  const form = useForm<CreateUrlFormData>({
    resolver: zodResolver(createUrlSchema),
    defaultValues: {
      originalUrl: "",
      customAlias: "",
      expiresAt: undefined,
      isActive: true,
    },
  });

  async function onSubmit(data: CreateUrlFormData) {
    try {
      const payload = {
        originalUrl: data.originalUrl,
        customAlias: data.customAlias || undefined,
        expiresAt: data.expiresAt ? data.expiresAt.toISOString() : undefined,
        isActive: data.isActive,
      };
      const response = await createUrl(payload).unwrap();
      // Handle response structures: data.url contains the IUrl object
      const url = response.data?.url;
      const urlId = url?.id || url?._id;

      toast.success("Link Created", {
        description: "Your new short link is ready to use.",
      });

      if (urlId) {
        router.push(`/dashboard/urls/${urlId}`);
      } else {
        router.push("/dashboard/urls");
      }
    } catch (error: unknown) {
      toast.error("Create Failed", {
        description: getErrorMessage(error, "Unable to create link"),
      });
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header - Premium Style (matching URLs page banner) */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand/90 via-brand to-brand-light/80 p-6 md:p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        {/* Animated rings */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10 animate-[ping_4s_ease-out_infinite] hidden lg:block" />
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5 animate-[ping_4s_ease-out_infinite_1s] hidden lg:block" />

        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 hover:bg-white/20 text-white"
              asChild
            >
              <Link href="/dashboard/urls">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                <span className="text-sm font-medium text-white/80">
                  New Link
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">Create Link</h1>
              <p className="text-white/80 max-w-md">
                Shorten a new URL and start tracking clicks instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Card - Matching URLs table card design */}
        <Card className="lg:col-span-2 border border-primary/15 shadow-none bg-white overflow-hidden pt-0 pb-4">
          <CardHeader className="border-b [.border-b]:pb-2 bg-linear-to-r pt-4 from-brand/5 to-transparent">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand/10">
                <Link2 className="h-4 w-4 text-brand" />
              </div>
              <div>
                <CardTitle>Link Details</CardTitle>
                <CardDescription>
                  Enter the URL you want to shorten. You can optionally set a
                  custom short code.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Loading State */}
            {isLoadingSubscription && (
              <div className="space-y-4 mb-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            )}

            {/* Limit Reached Alert */}
            {!isLoadingSubscription && hasReachedLimit && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Link Limit Reached</AlertTitle>
                <AlertDescription>
                  You have used {currentLinks} of {urlLimit} links allowed in your {plan?.name || "current"} plan.{" "}
                  <Link href="/dashboard/subscription/upgrade" className="font-medium underline">
                    Upgrade your plan
                  </Link>{" "}
                  to create more links.
                </AlertDescription>
              </Alert>
            )}

            {/* Subscription Inactive Alert */}
            {!isLoadingSubscription && !isSubscriptionActive && (
              <Alert variant="destructive" className="mb-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Subscription Inactive</AlertTitle>
                <AlertDescription>
                  Your subscription is {subscriptionStatus || "inactive"}. Please{" "}
                  <Link href="/dashboard/subscription/upgrade" className="font-medium underline">
                    renew or upgrade your subscription
                  </Link>{" "}
                  to create links.
                </AlertDescription>
              </Alert>
            )}

            {/* Usage Info */}
            {!isLoadingSubscription && canCreateLink && !isUnlimited && (
              <div className="mb-6 p-4 rounded-lg bg-brand/5 border border-brand/10">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{currentLinks}</span> of{" "}
                  <span className="font-medium text-foreground">{urlLimit}</span> links used in your{" "}
                  <span className="font-medium text-brand">{plan?.name || "Free"}</span> plan
                </p>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="originalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="https://example.com/very-long-url-that-needs-shortening"
                            className="pl-10 border-brand/20 focus-visible:ring-brand/30"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        The original URL that users will be redirected to
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customAlias"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom ID (Optional)</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground px-3 py-2 rounded-lg bg-muted">
                            {process.env.NEXT_PUBLIC_SHORT_URL_BASE ||
                              "linkshort.io"}
                            /
                          </span>
                          <Input
                            placeholder="my-custom-id"
                            className="flex-1 border-brand/20 focus-visible:ring-brand/30"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Leave empty to generate a random ID. Only letters,
                        numbers, hyphens, and underscores allowed.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiresAt"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiration Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal border-brand/20 hover:border-brand/40",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Set an expiration date for this link. Leave empty for no
                        expiration.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-xl border border-brand/10 p-4 bg-linear-to-r from-brand/5 to-transparent">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base font-medium">
                          Active
                        </FormLabel>
                        <FormDescription>
                          When disabled, the link will return a 404 error
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || isLoadingSubscription || !canCreateLink}
                    size="lg"
                    className="bg-brand hover:bg-brand-hover shadow-lg shadow-brand/20"
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    <Sparkles className="mr-2 h-4 w-4" />
                    Create Link
                  </Button>
                  <Button type="button" variant="outline" size="lg" asChild>
                    <Link href="/dashboard/urls">Cancel</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <div className="space-y-4">
          <Card className="border border-primary/15  shadow-none bg-white py-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4 text-primary" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 mt-0.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    1
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">Use descriptive codes</p>
                  <p className="text-xs text-muted-foreground">
                    Custom codes like "summer-sale" are easier to remember
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30 mt-0.5">
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                    2
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">Track performance</p>
                  <p className="text-xs text-muted-foreground">
                    View detailed analytics after creating your link
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30 mt-0.5">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    3
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">Generate QR codes</p>
                  <p className="text-xs text-muted-foreground">
                    Each link gets a downloadable QR code automatically
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/15  shadow-none bg-white py-4">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Sparkles className="h-8 w-8 text-brand mx-auto" />
                <h3 className="font-semibold">Need more features?</h3>
                <p className="text-sm text-muted-foreground">
                  Upgrade to unlock bulk URL creation, custom domains, and more.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 border-brand/20 hover:border-brand/40"
                  asChild
                >
                  <Link href="/dashboard/subscription/upgrade">View Plans</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
