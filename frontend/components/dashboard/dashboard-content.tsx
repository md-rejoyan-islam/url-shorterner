"use client";

import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { RecentLinks } from "@/components/dashboard/recent-links";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { formatNumber } from "@/lib/format";
import { useGetAnalyticsQuery } from "@/store/api/click-api";
import { useGetMySubscriptionQuery } from "@/store/api/subscription-api";
import { useGetUrlsQuery } from "@/store/api/url-api";
import { PaginatedResponse } from "@/types/api";
import { IAnalytics } from "@/types/click";
import { IPlan } from "@/types/plan";
import { ISubscription } from "@/types/subscription";
import { IUrl } from "@/types/url";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Crown,
  Link2,
  LucideIcon,
  MousePointerClick,
  Plus,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";

// Type for dashboard stats
interface DashboardStat {
  title: string;
  icon: LucideIcon;
  gradient: string;
  value: string;
  description: string;
  trend?: string;
  isPlan?: boolean;
}

// Stats card skeleton for loading state
function StatsCardSkeleton({
  title,
  icon: Icon,
  gradient,
}: Pick<DashboardStat, "title" | "icon" | "gradient">) {
  return (
    <Card className="relative overflow-hidden border border-primary/15  shadow-none bg-white transition-all duration-300 group hover:-translate-y-1 py-4">
      <CardHeader className="relative flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={`p-2.5 rounded-xl bg-linear-to-br ${gradient} shadow-lg`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative pt-0">
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-3 w-20 mt-2" />
      </CardContent>
    </Card>
  );
}

// Helper to check if plan is a populated object
const isPlanObject = (plan: string | IPlan | undefined): plan is IPlan => {
  return typeof plan === "object" && plan !== null && "name" in plan;
};

// Helper to format trend value with + or - prefix
const formatTrend = (value: number | undefined): string | undefined => {
  if (value === undefined || value === 0) return undefined;
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${Math.round(value)}%`;
};

export function DashboardContent() {
  const { user } = useAuth();

  const { data: urlsData, isLoading: urlsLoading } = useGetUrlsQuery({
    page: 1,
    limit: 3,
  });
  const { data: statsData, isLoading: statsLoading } = useGetAnalyticsQuery();
  const { data: subscriptionData, isLoading: subLoading } =
    useGetMySubscriptionQuery();

  // Parse URLs response with proper types
  const urlsResponse = urlsData?.data as PaginatedResponse<IUrl> | undefined;
  const urls: IUrl[] = urlsResponse?.data || urlsResponse?.urls || [];
  const totalUrls =
    urlsResponse?.pagination?.total || urlsResponse?.total || urls.length;

  // Parse analytics/click stats with proper types
  const clickStats = statsData?.data as IAnalytics | undefined;

  // Parse subscription with proper types
  const subscription = subscriptionData?.data as ISubscription | undefined;
  const planName = isPlanObject(subscription?.plan)
    ? subscription.plan.name
    : "Free";
  const isPremium = planName !== "Free";

  const stats: DashboardStat[] = [
    {
      title: "Total Links",
      value: formatNumber(totalUrls),
      icon: Link2,
      description: "Links created",
      trend: formatTrend(clickStats?.linksTrend),
      gradient: "from-[#e6560f] to-orange-500",
    },
    {
      title: "Total Clicks",
      value: formatNumber(clickStats?.totalClicks || 0),
      icon: MousePointerClick,
      description: "All time clicks",
      trend: formatTrend(clickStats?.percentageChange),
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Clicks Today",
      value: formatNumber(clickStats?.todayClicks || 0),
      icon: TrendingUp,
      description: "vs yesterday",
      trend: formatTrend(clickStats?.todayClicksTrend),
      gradient: "from-violet-500 to-violet-600",
    },
    {
      title: "Current Plan",
      value: planName,
      icon: Crown,
      description:
        subscription?.status === "active"
          ? "Active subscription"
          : "Upgrade available",
      isPlan: true,
      gradient: "from-amber-500 to-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner - Premium Style (Always visible) */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#e6560f]/90 via-[#e6560f] to-orange-500/80 p-6 md:p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        {/* Animated rings */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10 animate-[ping_4s_ease-out_infinite] hidden lg:block" />
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5 animate-[ping_4s_ease-out_infinite_1s] hidden lg:block" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium text-white/80">
                Welcome back
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {user?.firstName ? `Hello, ${user.firstName}!` : "Dashboard"}
            </h1>
            <p className="text-white/80 max-w-md">
              Track your links performance and manage your URL shortening all in
              one place.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="bg-white text-[#e6560f] hover:bg-white/90 shadow-lg shadow-black/10"
              asChild
            >
              <Link href="/dashboard/urls/new">
                <Plus className="mr-2 h-4 w-4" />
                Create New Link
              </Link>
            </Button>
            {!subLoading && !isPremium && (
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                asChild
              >
                <Link href="/dashboard/subscription/upgrade">
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {urlsLoading || statsLoading
          ? // Show skeletons using same stats array for consistent structure
            stats.map((stat) => (
              <StatsCardSkeleton
                key={stat.title}
                title={stat.title}
                icon={stat.icon}
                gradient={stat.gradient}
              />
            ))
          : // Show actual data
            stats.map((stat) => (
              <Card
                key={stat.title}
                className="relative overflow-hidden border border-primary/15 shadow-none bg-white transition-all duration-300 group hover:-translate-y-1 py-4"
              >
                <CardHeader className="relative flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={`p-2.5 rounded-xl bg-linear-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight">
                      {stat.value}
                    </span>
                    {stat.trend && (
                      <Badge
                        variant="secondary"
                        className={
                          stat.trend.startsWith("-")
                            ? "bg-red-100 text-red-700"
                            : "bg-emerald-100 text-emerald-700"
                        }
                      >
                        {stat.trend.startsWith("-") ? (
                          <ArrowDownRight className="h-3 w-3 mr-0.5" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        )}
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                  {stat.isPlan && !isPremium && (
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0 mt-1 h-auto text-xs text-[#e6560f] hover:text-[#d14d0d]"
                      asChild
                    >
                      <Link href="/dashboard/subscription/upgrade">
                        Upgrade now <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>

      {/* Charts and Recent Links */}
      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 border overflow-hidden border-primary/15 shadow-none pb-4 pt-0 bg-white ">
          <CardHeader className="border-b [.border-b]:pb-0 bg-linear-to-r pt-4  from-[#e6560f]/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#e6560f]/10">
                    <Activity className="h-4 w-4 text-[#e6560f]" />
                  </div>
                  Click Analytics
                </CardTitle>
                <CardDescription>
                  Track your link performance over time
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[#e6560f]/20 hover:border-[#e6560f]/40 hover:bg-[#e6560f]/5"
                asChild
              >
                <Link href="/dashboard/analytics">
                  View Details
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {statsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-50 w-full" />
              </div>
            ) : (
              <DashboardChart data={clickStats?.dailyClicks || []} />
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border border-primary/15 shadow-none bg-white overflow-hidden pt-0 pb-4">
          <CardHeader className="border-b [.border-b]:pb-2  pt-4 bg-linear-to-r from-[#e6560f]/5 to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-[#e6560f]/10">
                    <Link2 className="h-4 w-4 text-[#e6560f]" />
                  </div>
                  Recent Links
                </CardTitle>
                <CardDescription>Your latest shortened URLs</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[#e6560f]/20 hover:border-[#e6560f]/40 hover:bg-[#e6560f]/5"
                asChild
              >
                <Link href="/dashboard/urls">
                  View All
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {urlsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : urls.length === 0 ? (
              <EmptyState
                icon={Link2}
                title="No links yet"
                description="Create your first short link to get started tracking clicks"
                action={
                  <Button
                    asChild
                    className="mt-2 bg-[#e6560f] hover:bg-[#d14d0d]"
                  >
                    <Link href="/dashboard/urls/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Link
                    </Link>
                  </Button>
                }
              />
            ) : (
              <RecentLinks urls={urls} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions (Always visible) */}
      <Card className="border border-primary/15  shadow-none bg-white overflow-hidden py-4">
        <div className="relative">
          <CardContent className="relative p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-linear-to-br from-[#e6560f] to-orange-500 shadow-lg shadow-[#e6560f]/20">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quick Actions</h3>
                  <p className="text-sm text-muted-foreground">
                    Common tasks to help you manage your links
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#e6560f]/20 hover:border-[#e6560f] hover:bg-[#e6560f]/5 hover:text-[#e6560f]"
                  asChild
                >
                  <Link href="/dashboard/urls/new">
                    <Plus className="h-4 w-4 mr-1" />
                    New Link
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#e6560f]/20 hover:border-[#e6560f] hover:bg-[#e6560f]/5 hover:text-[#e6560f]"
                  asChild
                >
                  <Link href="/dashboard/analytics">
                    <Activity className="h-4 w-4 mr-1" />
                    Analytics
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#e6560f]/20 hover:border-[#e6560f] hover:bg-[#e6560f]/5 hover:text-[#e6560f]"
                  asChild
                >
                  <Link href="/dashboard/settings">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Settings
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
