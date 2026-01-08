"use client";

import {
  DataCard,
  EmptyState,
  PageHeader,
  SimpleTable,
  StatsCard,
  StatusBadge,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate, formatNumber } from "@/lib/format";
import { useAdminGetUrlsQuery } from "@/store/api/url-api";
import { IUrl } from "@/types/url";
import { CheckCircle, Link2, MousePointerClick, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function AdminUrlsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get initial values from URL params
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "all";
  const initialPage = Number(searchParams.get("page")) || 1;
  const initialLimit = Number(searchParams.get("limit")) || 10;

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const debouncedSearch = useDebounce(search, 300);

  // Update URL params
  const updateSearchParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === "" ||
          value === "all" ||
          (key === "page" && value === 1) ||
          (key === "limit" && value === 10)
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  // Sync search with URL params
  useEffect(() => {
    updateSearchParams({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, updateSearchParams]);

  // Sync status with URL params
  useEffect(() => {
    updateSearchParams({ status, page: 1 });
  }, [status, updateSearchParams]);

  // Sync page and limit with URL params
  useEffect(() => {
    updateSearchParams({ page, limit });
  }, [page, limit, updateSearchParams]);

  const { data, isLoading, isFetching } = useAdminGetUrlsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
    isActive: status === "all" ? undefined : status === "active",
  });

  const urls = data?.data?.urls || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Calculate stats from available data
  const totalUrls = total || 0;
  const activeUrls = urls.filter((u: IUrl) => u.isActive).length;
  const totalClicks = urls.reduce(
    (acc: number, u: IUrl) => acc + (u.clickCount || 0),
    0
  );

  // Table columns
  const columns = [
    <span key="num" className="w-12">
      #
    </span>,
    "Short URL",
    <span key="owner" className="hidden md:table-cell">
      Owner
    </span>,
    "Clicks",
    <span key="status" className="hidden sm:table-cell">
      Status
    </span>,
    <span key="created" className="hidden lg:table-cell">
      Created
    </span>,
  ];

  // Table rows
  const rows = urls.map((url: IUrl, index: number) => {
    const user = typeof url.user === "object" ? url.user : null;
    return [
      // Index
      <span key="index" className="font-medium text-muted-foreground">
        {(page - 1) * limit + index + 1}
      </span>,
      // Short URL
      <div key="url" className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand/10">
          <Link2 className="h-4 w-4 text-brand" />
        </div>
        <div>
          <Link
            href={url.shortUrl}
            target="_blank"
            title={url.shortUrl}
            className="font-medium text-brand hover:underline truncate max-w-50 block"
          >
            {url.shortId}
          </Link>
          <p className="text-xs text-muted-foreground truncate max-w-50">
            {url.originalUrl}
          </p>
        </div>
      </div>,
      // Owner
      <div key="owner" className="hidden md:block">
        <p className="text-sm font-medium">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>,
      // Clicks
      <div
        key="clicks"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 font-medium text-sm text-brand"
      >
        <MousePointerClick className="h-3.5 w-3.5" />
        {formatNumber(url.clickCount)}
      </div>,
      // Status
      <span key="status" className="hidden sm:block">
        <StatusBadge status={url.isActive ? "active" : "inactive"} />
      </span>,
      // Created
      <span key="created" className="hidden lg:block text-muted-foreground">
        {formatDate(url.createdAt)}
      </span>,
    ];
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="URLs Management"
        badge={{ icon: Link2, text: "Admin Panel" }}
        description="View and manage all shortened URLs on the platform"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total URLs"
          value={formatNumber(totalUrls)}
          icon={Link2}
          color="brand"
          isLoading={isLoading}
        />
        <StatsCard
          title="Active URLs"
          value={formatNumber(activeUrls)}
          icon={CheckCircle}
          color="emerald"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Clicks"
          value={formatNumber(totalClicks)}
          icon={MousePointerClick}
          color="violet"
          isLoading={isLoading}
        />
      </div>

      {/* URLs Table */}
      <DataCard
        title="All URLs"
        description="View and manage all shortened URLs"
        icon={Link2}
        color="brand"
        isLoading={false}
        isEmpty={!isLoading && urls.length === 0}
        emptyState={{
          icon: Link2,
          message: search
            ? "No URLs found matching your search"
            : "No URLs created yet",
        }}
      >
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between p-4 border-b">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search URLs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-brand/20 focus-visible:ring-brand/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-35 border-brand/20">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {(search || status !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatus("all");
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {!isLoading && urls.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Link2}
              title={search ? "No URLs found" : "No URLs yet"}
              description={
                search
                  ? "Try adjusting your search"
                  : "URLs will appear here once users create them"
              }
            />
          </div>
        ) : (
          <SimpleTable
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            notFoundMessage="No URLs found"
            pagination={{
              page,
              totalPages,
              total,
              limit,
              onPageChange: setPage,
              onLimitChange: setLimit,
              isFetching,
            }}
          />
        )}
      </DataCard>
    </div>
  );
}
