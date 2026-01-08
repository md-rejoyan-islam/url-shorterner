"use client";

import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { AnalyticsPieChart } from "@/components/analytics/analytics-pie-chart";
import {
  ChartCard,
  DataCard,
  PageHeader,
  StatsCard,
} from "@/components/shared";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/lib/format";
import { useGetClickStatsQuery } from "@/store/api/click-api";
import {
  BarChart3,
  Calendar,
  Chrome,
  Globe,
  MousePointerClick,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export function AnalyticsContent() {
  const [period, setPeriod] = useState("30");

  const { data, isLoading } = useGetClickStatsQuery({
    days: parseInt(period),
  });

  const stats = data?.data;
  const dailyClicks = stats?.dailyClicks || [];
  const deviceStats = stats?.deviceStats || [];
  const browserStats = stats?.browserStats || [];
  const countryStats = stats?.countryStats || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Analytics"
        badge={{ icon: BarChart3, text: "Performance Insights" }}
        description="Track your link performance across all URLs"
        actions={
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Clicks"
          value={formatNumber(stats?.totalClicks || 0)}
          subtitle="All time"
          icon={MousePointerClick}
          color="brand"
          isLoading={isLoading}
        />
        <StatsCard
          title="Clicks Today"
          value={formatNumber(stats?.todayClicks || 0)}
          subtitle="Last 24 hours"
          icon={TrendingUp}
          color="emerald"
          isLoading={isLoading}
        />
        <StatsCard
          title="Unique Countries"
          value={countryStats.length}
          subtitle="Geographic reach"
          icon={Globe}
          color="violet"
          isLoading={isLoading}
        />
        <StatsCard
          title="Top Device"
          value={deviceStats[0]?.name || "N/A"}
          subtitle={
            isLoading ? "" : `${formatNumber(deviceStats[0]?.value || 0)} clicks`
          }
          icon={Smartphone}
          color="amber"
          isLoading={isLoading}
        />
      </div>

      {/* Main Chart */}
      <ChartCard
        title="Clicks Over Time"
        description="Daily click activity for the selected period"
        icon={TrendingUp}
        color="brand"
        isLoading={isLoading}
        skeletonHeight="h-75"
      >
        <AnalyticsChart data={dailyClicks} />
      </ChartCard>

      {/* Distribution Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Devices"
          description="Device breakdown of your visitors"
          icon={Smartphone}
          color="violet"
          isLoading={isLoading}
        >
          <AnalyticsPieChart data={deviceStats} />
        </ChartCard>

        <ChartCard
          title="Browsers"
          description="Browser usage of your visitors"
          icon={Chrome}
          color="amber"
          isLoading={isLoading}
        >
          <AnalyticsPieChart data={browserStats} />
        </ChartCard>
      </div>

      {/* Top Countries */}
      <DataCard
        title="Top Countries"
        description="Geographic distribution of your visitors"
        icon={Globe}
        color="emerald"
        isLoading={isLoading}
        isEmpty={countryStats.length === 0}
        emptyState={{
          icon: Globe,
          message: "No click data available",
        }}
      >
        <div className="divide-y divide-primary/10">
          {countryStats
            .slice(0, 10)
            .map(
              (country: { name: string; value: number }, index: number) => (
                <div
                  key={country.name}
                  className="flex items-center justify-between py-3 px-6 hover:bg-brand/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground w-6 text-sm">
                      {index + 1}
                    </span>
                    <span className="font-medium">{country.name}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 font-medium text-sm text-brand">
                    <MousePointerClick className="h-3.5 w-3.5" />
                    {formatNumber(country.value)}
                  </div>
                </div>
              )
            )}
        </div>
      </DataCard>
    </div>
  );
}
