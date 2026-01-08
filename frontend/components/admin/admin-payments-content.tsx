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
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate, formatNumber } from "@/lib/format";
import { useAdminGetPaymentsQuery } from "@/store/api/payment-api";
import {
  CheckCircle,
  CreditCard,
  DollarSign,
  Download,
  Search,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function AdminPaymentsContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isFetching } = useAdminGetPaymentsQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const payments = data?.data?.payments || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Calculate stats
  const totalRevenue = payments.reduce(
    (acc: number, p: any) => acc + (p.status === "succeeded" ? p.amount : 0),
    0
  );
  const successfulPayments = payments.filter(
    (p: any) => p.status === "succeeded"
  ).length;
  const failedPayments = payments.filter(
    (p: any) => p.status === "failed"
  ).length;

  // Table columns
  const columns = [
    <span key="num" className="w-12">
      #
    </span>,
    "User",
    "Amount",
    "Status",
    <span key="date" className="hidden md:table-cell">
      Date
    </span>,
  ];

  // Table rows
  const rows = payments.map((payment: any, index: number) => [
    // Index
    <span key="index" className="font-medium text-muted-foreground">
      {(page - 1) * limit + index + 1}
    </span>,
    // User
    <div key="user">
      <Link
        href={`/admin/users/${payment.user?.id || payment.user?._id}`}
        className="font-medium text-brand hover:underline"
      >
        {payment.user?.firstName} {payment.user?.lastName}
      </Link>
      <p className="text-sm text-muted-foreground">{payment.user?.email}</p>
    </div>,
    // Amount
    <span key="amount" className="font-semibold text-brand">
      ${formatNumber(payment.amount / 100)}
    </span>,
    // Status
    <StatusBadge key="status" status={payment.status} />,
    // Date
    <span key="date" className="hidden md:block text-muted-foreground">
      {formatDate(payment.createdAt)}
    </span>,
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Payments Management"
        badge={{ icon: CreditCard, text: "Admin Panel" }}
        description="View all platform payment transactions"
        actions={
          <Button
            size="lg"
            className="bg-white text-brand hover:bg-white/90 shadow-lg"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Payments"
          value={formatNumber(total)}
          icon={CreditCard}
          color="brand"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${formatNumber(totalRevenue / 100)}`}
          icon={DollarSign}
          color="emerald"
          isLoading={isLoading}
        />
        <StatsCard
          title="Successful"
          value={formatNumber(successfulPayments)}
          icon={CheckCircle}
          color="blue"
          isLoading={isLoading}
        />
        <StatsCard
          title="Failed"
          value={formatNumber(failedPayments)}
          icon={XCircle}
          color="rose"
          isLoading={isLoading}
        />
      </div>

      {/* Payments Table */}
      <DataCard
        title="All Payments"
        description="View all payment transactions"
        icon={CreditCard}
        color="brand"
        isLoading={isLoading}
        isEmpty={payments.length === 0}
        emptyState={{
          icon: CreditCard,
          message: search
            ? "No payments found matching your search"
            : "No payments yet",
        }}
      >
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-brand/20 focus-visible:ring-brand/30"
            />
          </div>
        </div>

        {!isLoading && payments.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={CreditCard}
              title={search ? "No payments found" : "No payments yet"}
              description={
                search
                  ? "Try adjusting your search"
                  : "Payments will appear here once users make transactions"
              }
            />
          </div>
        ) : (
          <SimpleTable
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            notFoundMessage="No payments found"
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
