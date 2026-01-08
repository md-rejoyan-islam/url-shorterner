"use client";

import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import {
  ChartCard,
  PageHeader,
  StatsCard,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/format";
import { useAdminGetStatsQuery } from "@/store/api/user-api";
import {
  Activity,
  BarChart3,
  CreditCard,
  Link2,
  MousePointerClick,
  Package,
  Shield,
  Sparkles,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";

export function AdminDashboardContent() {
  const { data, isLoading } = useAdminGetStatsQuery();

  const stats = data?.data || {
    totalUsers: 0,
    totalUrls: 0,
    totalClicks: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    newUrlsToday: 0,
    clicksToday: 0,
    recentClicks: [],
    activeSubscriptions: 0,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Platform Overview"
        badge={{ icon: Shield, text: "Admin Panel" }}
        description="Monitor platform health, manage users, and track key metrics all in one place."
        actions={
          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="bg-white text-brand hover:bg-white/90 shadow-lg"
              asChild
            >
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              asChild
            >
              <Link href="/admin/plans">
                <Package className="mr-2 h-4 w-4" />
                Manage Plans
              </Link>
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={formatNumber(stats.totalUsers)}
          subtitle={`+${stats.newUsersToday} today`}
          icon={Users}
          color="blue"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Links"
          value={formatNumber(stats.totalUrls)}
          subtitle={`+${stats.newUrlsToday} today`}
          icon={Link2}
          color="emerald"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Clicks"
          value={formatNumber(stats.totalClicks)}
          subtitle={`+${stats.clicksToday} today`}
          icon={MousePointerClick}
          color="violet"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${formatNumber(stats.totalRevenue)}`}
          subtitle="All time"
          icon={CreditCard}
          color="amber"
          isLoading={isLoading}
        />
      </div>

      {/* Platform Activity Chart */}
      <ChartCard
        title="Platform Activity"
        description="Click activity over the past 30 days"
        icon={Activity}
        color="brand"
        isLoading={isLoading}
        skeletonHeight="h-75"
      >
        <DashboardChart data={stats.recentClicks || []} />
      </ChartCard>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Active Subscriptions"
          value={formatNumber(stats.activeSubscriptions || 0)}
          subtitle="Paid users"
          icon={Package}
          color="emerald"
          isLoading={isLoading}
        />
        <StatsCard
          title="Average Links/User"
          value={
            stats.totalUsers > 0
              ? (stats.totalUrls / stats.totalUsers).toFixed(1)
              : "0"
          }
          subtitle="Links per user"
          icon={BarChart3}
          color="blue"
          isLoading={isLoading}
        />
        <StatsCard
          title="Click Rate"
          value={
            stats.totalUrls > 0
              ? (stats.totalClicks / stats.totalUrls).toFixed(1)
              : "0"
          }
          subtitle="Clicks per link"
          icon={TrendingUp}
          color="violet"
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <Card className="border border-primary/15 shadow-none bg-white py-4">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand" />
                Quick Actions
              </h3>
              <p className="text-sm text-muted-foreground">
                Common administrative tasks
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-brand/20 hover:border-brand/40"
                asChild
              >
                <Link href="/admin/users">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Users
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-brand/20 hover:border-brand/40"
                asChild
              >
                <Link href="/admin/urls">
                  <Link2 className="h-4 w-4 mr-1" />
                  URLs
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-brand/20 hover:border-brand/40"
                asChild
              >
                <Link href="/admin/plans">
                  <Package className="h-4 w-4 mr-1" />
                  Plans
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
