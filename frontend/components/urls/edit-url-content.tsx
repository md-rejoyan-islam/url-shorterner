"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Activity,
  ArrowLeft,
  BarChart2,
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  Link2,
  Loader2,
  MousePointerClick,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorState, PageHeader, StatsCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { formatDate, formatNumber, getFullShortUrl } from "@/lib/format";
import { cn } from "@/lib/utils";
import { UpdateUrlFormData, updateUrlSchema } from "@/lib/validations/url";
import { useGetUrlQuery, useUpdateUrlMutation } from "@/store/api/url-api";
import { getErrorMessage } from "@/types/api";

interface EditUrlContentProps {
  id: string;
}

export function EditUrlContent({ id }: EditUrlContentProps) {

  const { data, isLoading, error } = useGetUrlQuery(id);
  const [updateUrl, { isLoading: isUpdating }] = useUpdateUrlMutation();

  const form = useForm<UpdateUrlFormData>({
    resolver: zodResolver(updateUrlSchema),
    defaultValues: {
      originalUrl: "",
      customCode: "",
      isActive: true,
      expiresAt: undefined,
    },
  });

  const url = data?.data?.url;

  useEffect(() => {
    if (url) {
      form.reset({
        originalUrl: url.originalUrl,
        customCode: url.shortId,
        isActive: url.isActive,
        expiresAt: url.expiresAt ? new Date(url.expiresAt) : undefined,
      });
    }
  }, [url, form]);

  async function onSubmit(formData: UpdateUrlFormData) {
    try {
      await updateUrl({
        id,
        data: {
          originalUrl: formData.originalUrl,
          customCode: formData.customCode || undefined,
          isActive: formData.isActive,
          expiresAt: formData.expiresAt
            ? formData.expiresAt.toISOString()
            : null,
        },
      }).unwrap();
      toast.success("Link Updated", {
        description: "Your changes have been saved successfully.",
      });
    } catch (err: unknown) {
      toast.error("Update Failed", {
        description: getErrorMessage(err, "Unable to update link"),
      });
    }
  }

  // Show error state only after loading completes and no url found
  if (!isLoading && (error || !url)) {
    return (
      <div className="space-y-4">
        <ErrorState
          title="Link not found"
          message="The link you're looking for doesn't exist or you don't have access to it."
        />
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard/urls">Back to Links</Link>
          </Button>
        </div>
      </div>
    );
  }

  const shortUrl = url
    ? url.shortUrl || getFullShortUrl(url.shortId || "")
    : "";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Edit Link"
        badge={{ icon: Link2, text: "Link Settings" }}
        description={
          isLoading ? (
            <Skeleton className="h-5 w-64 bg-white/20" />
          ) : (
            <p className="truncate max-w-md">{shortUrl}</p>
          )
        }
        actions={
          <>
            <Button
              size="lg"
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              asChild
            >
              <Link href="/dashboard/urls">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Links
              </Link>
            </Button>
            <Button
              size="lg"
              className="bg-white text-brand hover:bg-white/90"
              asChild
            >
              <Link href={"/dashboard/urls/" + id + "/analytics"}>
                <BarChart2 className="mr-2 h-4 w-4" />
                Analytics
              </Link>
            </Button>
          </>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Clicks"
          value={formatNumber(url?.clickCount || 0)}
          subtitle="All time"
          icon={MousePointerClick}
          color="brand"
          isLoading={isLoading}
        />
        <StatsCard
          title="Status"
          value={url?.isActive ? "Active" : "Inactive"}
          subtitle="Current state"
          icon={Activity}
          color="emerald"
          isLoading={isLoading}
          valueClassName={url?.isActive ? "text-emerald-600" : "text-red-600"}
        />
        <StatsCard
          title="Created"
          value={formatDate(url?.createdAt, "MMM d")}
          subtitle={isLoading ? "" : formatDate(url?.createdAt, "yyyy")}
          icon={CalendarIcon}
          color="violet"
          isLoading={isLoading}
        />
        <StatsCard
          title="Expires"
          value={
            url?.expiresAt ? (
              formatDate(url.expiresAt, "MMM d")
            ) : (
              <span className="text-muted-foreground">Never</span>
            )
          }
          subtitle={
            isLoading
              ? ""
              : url?.expiresAt
              ? formatDate(url.expiresAt, "yyyy")
              : "No expiration"
          }
          icon={Clock}
          color="amber"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Card */}
        <Card className="lg:col-span-2 py-5 border border-primary/15 shadow-none bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand/10">
                <Link2 className="h-4 w-4 text-brand" />
              </div>
              Link Details
            </CardTitle>
            <CardDescription>
              Update the destination URL or short code for this link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-56" />
                </div>
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-10 w-32" />
              </div>
            ) : (
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
                          <Input
                            placeholder="https://example.com/very-long-url"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The URL users will be redirected to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Code</FormLabel>
                        <FormControl>
                          <div className="flex items-center">
                            <span className="text-sm text-muted-foreground mr-2">
                              {process.env.NEXT_PUBLIC_SHORT_URL_BASE ||
                                "linkshort.io"}
                              /
                            </span>
                            <Input placeholder="custom-code" {...field} />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Only letters, numbers, and hyphens allowed
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
                                  "w-full pl-3 text-left font-normal border-primary/20 hover:border-primary/40",
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
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Link will stop working after this date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border border-primary/15 p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <FormDescription>
                            Disable to return 404 for this link
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

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        {/* Short URL Card */}
        <div className="space-y-6">
          <Card className="border py-5 border-primary/15 shadow-none bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10">
                  <ExternalLink className="h-4 w-4 text-emerald-600" />
                </div>
                Short URL
              </CardTitle>
              <CardDescription>Your shortened link</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-12 w-full rounded-lg" />
              ) : (
                <div className="flex items-center gap-2 p-3 bg-brand/5 border border-brand/10 rounded-lg">
                  <span className="text-sm font-medium truncate flex-1 text-brand">
                    {shortUrl}
                  </span>
                  <CopyButton text={shortUrl} size="sm" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 hover:bg-brand/10"
                    asChild
                  >
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 text-brand" />
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border py-5 border-primary/15 shadow-none bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-500/10">
                  <Link2 className="h-4 w-4 text-violet-600" />
                </div>
                Original URL
              </CardTitle>
              <CardDescription>Destination link</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-12 w-full rounded-lg" />
              ) : (
                <div className="p-3 bg-muted/50 border border-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground break-all">
                    {url?.originalUrl}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile Actions */}
          <div className="sm:hidden">
            <Button className="w-full" asChild>
              <Link href={"/dashboard/urls/" + id + "/analytics"}>
                <BarChart2 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
