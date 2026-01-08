"use client";

import {
  DataCard,
  EmptyState,
  PageHeader,
  SimpleTable,
  StatsCard,
  StatusBadge,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate, formatNumber } from "@/lib/format";
import { useAdminGetSubscriptionsQuery } from "@/store/api/subscription-api";
import { CheckCircle, Receipt, Search, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AdminSubscriptionsContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isFetching } = useAdminGetSubscriptionsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const subscriptions = data?.data?.subscriptions || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Calculate stats
  const activeSubscriptions = subscriptions.filter(
    (sub: any) => sub.status === "active"
  ).length;
  const cancelledSubscriptions = subscriptions.filter(
    (sub: any) => sub.status === "cancelled"
  ).length;

  // Table columns
  const columns = [
    <span key="num" className="w-12">
      #
    </span>,
    "User",
    "Plan",
    "Status",
    <span key="period" className="hidden md:table-cell">
      Period End
    </span>,
  ];

  // Table rows
  const rows = subscriptions.map((sub: any, index: number) => [
    // Index
    <span key="index" className="font-medium text-muted-foreground">
      {(page - 1) * limit + index + 1}
    </span>,
    // User
    <div key="user">
      <Link
        href={`/admin/users/${sub.user?.id || sub.user?._id}`}
        className="font-medium text-brand hover:underline"
      >
        {sub.user?.firstName} {sub.user?.lastName}
      </Link>
      <p className="text-sm text-muted-foreground">{sub.user?.email}</p>
    </div>,
    // Plan
    <Badge key="plan" variant="outline" className="border-brand/20">
      {sub.plan?.name}
    </Badge>,
    // Status
    <StatusBadge key="status" status={sub.status} />,
    // Period End
    <span key="period" className="hidden md:block text-muted-foreground">
      {formatDate(sub.currentPeriodEnd)}
    </span>,
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Subscriptions Management"
        badge={{ icon: Receipt, text: "Admin Panel" }}
        description="View and manage all platform subscriptions"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Subscriptions"
          value={formatNumber(total)}
          icon={Receipt}
          color="brand"
          isLoading={isLoading}
        />
        <StatsCard
          title="Active"
          value={formatNumber(activeSubscriptions)}
          icon={CheckCircle}
          color="emerald"
          isLoading={isLoading}
        />
        <StatsCard
          title="Cancelled"
          value={formatNumber(cancelledSubscriptions)}
          icon={XCircle}
          color="rose"
          isLoading={isLoading}
        />
      </div>

      {/* Subscriptions Table */}
      <DataCard
        title="All Subscriptions"
        description="View and manage all subscriptions"
        icon={Receipt}
        color="brand"
        isLoading={isLoading}
        isEmpty={subscriptions.length === 0}
        emptyState={{
          icon: Receipt,
          message: search
            ? "No subscriptions found matching your search"
            : "No subscriptions yet",
        }}
      >
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-brand/20 focus-visible:ring-brand/30"
            />
          </div>
        </div>

        {!isLoading && subscriptions.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Receipt}
              title={search ? "No subscriptions found" : "No subscriptions yet"}
              description={
                search
                  ? "Try adjusting your search"
                  : "Subscriptions will appear here once users subscribe"
              }
            />
          </div>
        ) : (
          <SimpleTable
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            notFoundMessage="No subscriptions found"
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
