"use client";

import { AnalyticsChart } from "@/components/analytics/analytics-chart";
import { AnalyticsPieChart } from "@/components/analytics/analytics-pie-chart";
import {
  ChartCard,
  DataCard,
  ErrorState,
  PageHeader,
  SimpleTable,
  StatsCard,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatNumber, getFullShortUrl } from "@/lib/format";
import { useGetUrlClicksQuery } from "@/store/api/click-api";
import { useGetUrlQuery } from "@/store/api/url-api";
import type { IClick } from "@/types";
import {
  Activity,
  ArrowLeft,
  BarChart2,
  Chrome,
  Globe,
  MousePointerClick,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function UrlAnalyticsPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: urlData,
    isLoading: urlLoading,
    error: urlError,
  } = useGetUrlQuery(id);
  const { data: clicksData, isLoading: clicksLoading } =
    useGetUrlClicksQuery(id);

  const url = urlData?.data?.url;
  const clicks: IClick[] = clicksData?.data?.clicks || [];

  // Show error state only after loading completes and no url found
  if (!urlLoading && (urlError || !url)) {
    return (
      <div className="space-y-4">
        <ErrorState
          title="Link not found"
          message="The link you're looking for doesn't exist."
        />
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/dashboard/urls">Back to Links</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Process click data for charts
  const dailyClicks = processClicksByDate(clicks);
  const deviceStats = processClicksByDevice(clicks);
  const browserStats = processClicksByBrowser(clicks);
  const countryStats = processClicksByCountry(clicks);

  const shortUrl = url?.shortUrl || getFullShortUrl(url?.shortId || "");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Analytics"
        badge={{ icon: BarChart2, text: "Link Analytics" }}
        description={
          urlLoading ? (
            <Skeleton className="h-5 w-48 bg-white/20" />
          ) : (
            <p className="truncate max-w-md">{shortUrl}</p>
          )
        }
        actions={
          <Button
            size="lg"
            variant="ghost"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            asChild
          >
            <Link href={"/dashboard/urls/" + id}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Link
            </Link>
          </Button>
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
          isLoading={urlLoading}
        />
        <StatsCard
          title="Unique Countries"
          value={countryStats.length}
          subtitle="Geographic reach"
          icon={Globe}
          color="emerald"
          isLoading={clicksLoading}
        />
        <StatsCard
          title="Top Device"
          value={deviceStats[0]?.name || "N/A"}
          subtitle={clicksLoading ? "" : `${deviceStats[0]?.value || 0} clicks`}
          icon={Smartphone}
          color="violet"
          isLoading={clicksLoading}
        />
        <StatsCard
          title="Top Browser"
          value={browserStats[0]?.name || "N/A"}
          subtitle={
            clicksLoading ? "" : `${browserStats[0]?.value || 0} clicks`
          }
          icon={Chrome}
          color="amber"
          isLoading={clicksLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Clicks Over Time"
          description="Track your link performance over time"
          icon={TrendingUp}
          color="brand"
          isLoading={clicksLoading}
          skeletonHeight="h-75"
          fullWidth
        >
          <AnalyticsChart data={dailyClicks} />
        </ChartCard>

        <ChartCard
          title="Devices"
          description="Device breakdown of your visitors"
          icon={Smartphone}
          color="violet"
          isLoading={clicksLoading}
        >
          <AnalyticsPieChart data={deviceStats} />
        </ChartCard>

        <ChartCard
          title="Browsers"
          description="Browser usage of your visitors"
          icon={Chrome}
          color="amber"
          isLoading={clicksLoading}
        >
          <AnalyticsPieChart data={browserStats} />
        </ChartCard>
      </div>

      {/* Countries Table */}
      <DataCard
        title="Top Countries"
        description="Geographic distribution of your visitors"
        icon={Globe}
        color="emerald"
        isLoading={clicksLoading}
        isEmpty={countryStats.length === 0}
        emptyState={{
          icon: Globe,
          message: "No click data available",
        }}
      >
        <div className="divide-y divide-primary/10">
          {countryStats.slice(0, 10).map((country, index) => (
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
          ))}
        </div>
      </DataCard>

      {/* Recent Clicks */}
      <DataCard
        title="Recent Clicks"
        description="Latest visitor activity on your link"
        icon={Activity}
        color="brand"
        isLoading={false}
      >
        <SimpleTable
          columns={[
            "Date",
            "Country",
            "City",
            <span key="device" className="hidden md:table-cell">
              Device
            </span>,
            <span key="browser" className="hidden lg:table-cell">
              Browser
            </span>,
            <span key="os" className="hidden lg:table-cell">
              OS
            </span>,
          ]}
          rows={clicks.slice(0, 20).map((click: IClick) => [
            <span key="date" className="text-muted-foreground text-sm">
              {formatDate(click.createdAt)}
            </span>,
            <span key="country" className="font-medium">
              {click.location?.country || "Unknown"}
            </span>,
            <span key="city">{click.location?.city || "Unknown"}</span>,
            <span key="device" className="hidden md:table-cell">
              {click.device?.type || "Unknown"}
            </span>,
            <span key="browser" className="hidden lg:table-cell">
              {click.device?.browser || "Unknown"}
            </span>,
            <span key="os" className="hidden lg:table-cell">
              {click.device?.os || "Unknown"}
            </span>,
          ])}
          isLoading={clicksLoading}
          notFoundMessage="No clicks recorded yet"
        />
      </DataCard>
    </div>
  );
}

// Helper functions to process click data
function processClicksByDate(clicks: IClick[]) {
  const dateMap = new Map<string, number>();
  clicks.forEach((click) => {
    const date = new Date(click.createdAt).toISOString().split("T")[0];
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });
  return Array.from(dateMap.entries())
    .map(([date, clicks]) => ({ date, clicks }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function processClicksByDevice(clicks: IClick[]) {
  const deviceMap = new Map<string, number>();
  clicks.forEach((click) => {
    const device = click.device?.type || "Unknown";
    deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
  });
  return Array.from(deviceMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function processClicksByBrowser(clicks: IClick[]) {
  const browserMap = new Map<string, number>();
  clicks.forEach((click) => {
    const browser = click.device?.browser || "Unknown";
    browserMap.set(browser, (browserMap.get(browser) || 0) + 1);
  });
  return Array.from(browserMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function processClicksByCountry(clicks: IClick[]) {
  const countryMap = new Map<string, number>();
  clicks.forEach((click) => {
    const country = click.location?.country || "Unknown";
    countryMap.set(country, (countryMap.get(country) || 0) + 1);
  });
  return Array.from(countryMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
