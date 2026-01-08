"use client";

import {
  ChartCard,
  DataCard,
  PageHeader,
  SimpleTable,
  StatsCard,
  StatusBadge,
} from "@/components/shared";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { formatDate, formatNumber } from "@/lib/format";
import { useAdminGetUserDetailsQuery } from "@/store/api/user-api";
import { useAdminUpdateUrlMutation } from "@/store/api/url-api";
import { IUrl } from "@/types/url";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  Link2,
  Mail,
  MousePointerClick,
  Package,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface AdminUserDetailsContentProps {
  userId: string;
}

export function AdminUserDetailsContent({
  userId,
}: AdminUserDetailsContentProps) {
  const { data, isLoading } = useAdminGetUserDetailsQuery(userId);
  const [updateUrl, { isLoading: isUpdating }] = useAdminUpdateUrlMutation();

  const handleToggleStatus = async (url: IUrl) => {
    try {
      await updateUrl({
        id: url._id,
        data: { isActive: !url.isActive },
      }).unwrap();
      toast.success(`URL ${url.isActive ? "deactivated" : "activated"} successfully`);
    } catch {
      toast.error("Failed to update URL status");
    }
  };

  const userData = data?.data;
  const user = userData?.user;
  const urls = userData?.urls || [];
  const stats = userData?.stats || {
    totalUrls: 0,
    activeUrls: 0,
    totalClicks: 0,
    recentClicks: [],
  };
  const subscription = userData?.subscription;
  const payments = userData?.payments || [];

  if (!isLoading && !user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">User not found</p>
          <Button asChild variant="outline">
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Table columns for URLs
  const urlColumns = [
    <span key="num" className="w-12">
      #
    </span>,
    "Short Code",
    "Destination",
    <span key="clicks" className="text-center">
      Clicks
    </span>,
    "Status",
    "Active",
    "Created",
  ];

  // Table rows for URLs
  const urlRows = urls.map((url: IUrl, index: number) => [
    <span key="index" className="font-medium text-muted-foreground">
      {index + 1}
    </span>,
    <Link
      key="shortCode"
      href={url.shortUrl}
      target="_blank"
      title={url.shortUrl}
      className="font-medium text-brand hover:underline"
    >
      {url.shortId}
    </Link>,
    <span key="dest" className="text-muted-foreground truncate max-w-50">
      {url.originalUrl}
    </span>,
    <span key="clicks" className="text-center font-medium text-brand">
      {formatNumber(url.clickCount)}
    </span>,
    <StatusBadge key="status" status={url.isActive ? "active" : "inactive"} />,
    <Switch
      key="toggle"
      checked={url.isActive}
      onCheckedChange={() => handleToggleStatus(url)}
      disabled={isUpdating}
    />,
    <span key="created" className="text-muted-foreground">
      {formatDate(url.createdAt)}
    </span>,
  ]);

  // Table columns for Payments
  const paymentColumns = [
    <span key="num" className="w-12">
      #
    </span>,
    "Amount",
    "Plan",
    "Payment Method",
    "Status",
    "Date",
  ];

  // Table rows for Payments
  const paymentRows = payments.map((payment: any, index: number) => [
    <span key="index" className="font-medium text-muted-foreground">
      {index + 1}
    </span>,
    <span key="amount" className="font-semibold text-brand">
      ${(payment.amount / 100).toFixed(2)}
    </span>,
    <span key="plan">{payment.plan?.name || "N/A"}</span>,
    <Badge key="method" variant="outline" className="capitalize">
      {payment.paymentMethod === "card" ? "Card" : payment.paymentMethod?.replace("_", " ") || "N/A"}
    </Badge>,
    <StatusBadge key="status" status={payment.status} />,
    <span key="date" className="text-muted-foreground">
      {formatDate(payment.createdAt)}
    </span>,
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title={isLoading ? "Loading..." : `${user?.firstName} ${user?.lastName}`}
        badge={{ icon: User, text: "User Profile" }}
        description={isLoading ? "" : user?.email}
        actions={
          <Button
            asChild
            variant="outline"
            className="bg-white/90 hover:bg-white"
          >
            <Link href="/admin/users">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Link>
          </Button>
        }
      />

      {/* User Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="border border-primary/15 shadow-none bg-white py-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-brand/10">
                <User className="h-4 w-4 text-brand" />
              </div>
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-brand/20">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-brand text-white text-xl">
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge
                        status={user?.role === "admin" ? "admin" : "user"}
                      />
                      <StatusBadge
                        status={user?.isActive ? "active" : "inactive"}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user?.email}</span>
                    {user?.isEmailVerified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {formatDate(user?.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{user?.role}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="border border-primary/15 shadow-none bg-white py-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-violet-500/10">
                <Package className="h-4 w-4 text-violet-500" />
              </div>
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ) : subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <Badge className="bg-brand/10 text-brand border-brand/20">
                    {subscription.plan?.name || "Unknown"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusBadge status={subscription.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Renews On
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground text-sm">
                  No active subscription
                </p>
                <Badge variant="outline" className="mt-2">
                  Free Plan
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Plan Limits Card */}
        <Card className="border border-primary/15 shadow-none bg-white py-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-emerald-500/10">
                <CreditCard className="h-4 w-4 text-emerald-500" />
              </div>
              Plan Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Links Created
                  </span>
                  <span className="font-semibold">
                    {stats.totalUrls} /{" "}
                    {user?.currentPlan?.maxLinks === -1
                      ? "∞"
                      : user?.currentPlan?.maxLinks || 10}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Clicks</span>
                  <span className="font-semibold">
                    {formatNumber(stats.totalClicks)} /{" "}
                    {user?.currentPlan?.maxClicks === -1
                      ? "∞"
                      : formatNumber(user?.currentPlan?.maxClicks || 1000)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Custom Codes
                  </span>
                  <Badge
                    variant={
                      user?.currentPlan?.features?.customCodes
                        ? "default"
                        : "secondary"
                    }
                    className={
                      user?.currentPlan?.features?.customCodes
                        ? "bg-emerald-500"
                        : ""
                    }
                  >
                    {user?.currentPlan?.features?.customCodes
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Links"
          value={formatNumber(stats.totalUrls)}
          icon={Link2}
          color="brand"
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Links"
          value={formatNumber(stats.activeUrls)}
          icon={CheckCircle}
          color="emerald"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Clicks"
          value={formatNumber(stats.totalClicks)}
          icon={MousePointerClick}
          color="violet"
          isLoading={isLoading}
        />
        <StatsCard
          title="Payments"
          value={formatNumber(payments.length)}
          icon={CreditCard}
          color="blue"
          isLoading={isLoading}
        />
      </div>

      {/* Click Analytics Chart */}
      <ChartCard
        title="Click Activity"
        description="Last 30 days click activity"
        icon={MousePointerClick}
        color="brand"
        isLoading={isLoading}
        skeletonHeight="h-75"
      >
        <DashboardChart data={stats.recentClicks || []} />
      </ChartCard>

      {/* User URLs */}
      <DataCard
        title="User Links"
        description={`All links created by ${user?.firstName || "user"}`}
        icon={Link2}
        color="brand"
        isLoading={isLoading}
        isEmpty={!isLoading && urls.length === 0}
        emptyState={{
          icon: Link2,
          message: "This user hasn't created any links yet",
        }}
      >
        {!isLoading && urls.length > 0 && (
          <SimpleTable
            columns={urlColumns}
            rows={urlRows}
            isLoading={false}
            notFoundMessage="No links found"
          />
        )}
      </DataCard>

      {/* Payment History */}
      {(isLoading || payments.length > 0) && (
        <DataCard
          title="Payment History"
          description="All payment transactions"
          icon={CreditCard}
          color="violet"
          isLoading={isLoading}
          isEmpty={!isLoading && payments.length === 0}
        >
          {!isLoading && payments.length > 0 && (
            <SimpleTable
              columns={paymentColumns}
              rows={paymentRows}
              isLoading={false}
              notFoundMessage="No payments found"
            />
          )}
        </DataCard>
      )}
    </div>
  );
}
