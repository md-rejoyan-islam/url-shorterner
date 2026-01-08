"use client";

import { QRCodeDisplay } from "@/components/qr/qr-code-display";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { SimpleTable } from "@/components/shared/simple-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate, formatNumber, getFullShortUrl } from "@/lib/format";
import {
  useDeleteUrlMutation,
  useGetUrlsQuery,
  useGetUrlSummaryQuery,
  useUpdateUrlMutation,
} from "@/store/api/url-api";
import { getErrorMessage } from "@/types/api";
import { IUrl } from "@/types/url";
import {
  BarChart2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Link2,
  MoreVertical,
  MousePointerClick,
  Pencil,
  Plus,
  QrCode,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const LIMIT_OPTIONS = [2, 10, 20, 50, 100];

export function UrlsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get values from URL or use defaults
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const statusFilter = searchParams.get("status") || "all";
  const sortOption = searchParams.get("sort") || "createdAt-desc";
  const [sortBy, sortOrder] = sortOption.split("-") as [string, "asc" | "desc"];

  const [searchInput, setSearchInput] = useState(search);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Update URL params
  const updateParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === "" ||
          (key === "status" && value === "all") ||
          (key === "sort" && value === "createdAt-desc") ||
          (key === "page" && value === 1) ||
          (key === "limit" && value === 10)
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : "/dashboard/urls", {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  const [qrDialogUrl, setQrDialogUrl] = useState<{
    shortUrl: string;
    shortCode: string;
    qrCodeUrl?: string;
  } | null>(null);
  const debouncedSearchInput = useDebounce(searchInput, 300);

  // Update URL when debounced search changes
  useEffect(() => {
    if (debouncedSearchInput !== search) {
      updateParams({ search: debouncedSearchInput, page: 1 });
    }
  }, [debouncedSearchInput, search, updateParams]);

  const { data, isLoading, isFetching } = useGetUrlsQuery(
    {
      page,
      limit,
      search: search || undefined,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
      sortBy,
      sortOrder,
    },
    {
      // Refetch when window regains focus to get updated click counts
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );
  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetUrlSummaryQuery(undefined, {
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    });
  const [deleteUrl, { isLoading: isDeleting }] = useDeleteUrlMutation();
  const [updateUrl] = useUpdateUrlMutation();

  // Get summary stats from API
  const summary = summaryData?.data;

  const handleToggleStatus = async (urlId: string, currentStatus: boolean) => {
    try {
      await updateUrl({
        id: urlId,
        data: { isActive: !currentStatus },
      }).unwrap();
      toast.success(currentStatus ? "Link Deactivated" : "Link Activated", {
        description: currentStatus
          ? "The link is now inactive and will return a 404 error."
          : "The link is now active and ready to use.",
      });
    } catch (error: unknown) {
      toast.error("Update Failed", {
        description: getErrorMessage(error, "Unable to update link status"),
      });
    }
  };

  const urls = data?.data?.urls || [];
  const pagination = data?.data?.pagination;
  const total = pagination?.total || 0;
  const totalPages = pagination?.totalPages || 1;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteUrl(deleteId).unwrap();
      toast.success("Link Deleted", {
        description: "The link has been permanently removed.",
      });
      setDeleteId(null);
    } catch (error) {
      toast.error("Delete Failed", {
        description: getErrorMessage(error, "Unable to delete link"),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header - Premium Style (matching Dashboard banner) */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-brand/90 via-brand to-brand-light/80 p-6 md:p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        {/* Animated rings */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10 animate-[ping_4s_ease-out_infinite] hidden lg:block" />
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5 animate-[ping_4s_ease-out_infinite_1s] hidden lg:block" />

        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              <span className="text-sm font-medium text-white/80">
                Link Management
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">My Links</h1>
            <p className="text-white/80">
              Manage, track and analyze all your shortened links in one place
            </p>
          </div>
          <Button
            size="lg"
            className="bg-white text-brand hover:bg-white/90 shadow-lg shadow-black/10"
            asChild
          >
            <Link href="/dashboard/urls/new">
              <Plus className="mr-2 h-4 w-4" />
              Create New Link
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-primary/15  shadow-none bg-white py-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Links</p>
                {isSummaryLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatNumber(summary?.totalLinks ?? 0)}
                  </p>
                )}
              </div>
              <div className="p-2 rounded-xl bg-brand/10">
                <Link2 className="h-5 w-5 text-brand" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-primary/15  shadow-none bg-white py-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                {isSummaryLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatNumber(summary?.activeLinks ?? 0)}
                  </p>
                )}
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-primary/15  shadow-none bg-white py-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                {isSummaryLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatNumber(summary?.totalClicks ?? 0)}
                  </p>
                )}
              </div>
              <div className="p-2 rounded-xl bg-violet-500/10">
                <MousePointerClick className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-primary/15  shadow-none bg-white py-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Clicks</p>
                {isSummaryLoading ? (
                  <Skeleton className="h-8 w-12 mt-1" />
                ) : (
                  <p className="text-2xl font-bold">
                    {formatNumber(summary?.avgClicks ?? 0)}
                  </p>
                )}
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10">
                <BarChart2 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Matching Click Analytics card design */}
      <Card className="border gap-0 border-primary/15 shadow-none bg-white overflow-hidden pt-0 pb-0">
        <CardHeader className=" pt-4 pb-4 from-brand/5 to-transparent">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-brand/10">
                    <Link2 className="h-4 w-4 text-brand" />
                  </div>
                  All Links
                </CardTitle>
                <CardDescription>
                  View and manage all your shortened URLs
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-brand/20 hover:border-brand/40 hover:bg-brand/5"
                asChild
              >
                <Link href="/dashboard/analytics">
                  View Analytics
                  <BarChart2 className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by destination URL or short code..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 bg-background border-brand/20 focus-visible:ring-brand/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    updateParams({ status: value, page: 1 });
                  }}
                >
                  <SelectTrigger className="w-30 border-brand/20">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={sortOption}
                  onValueChange={(value) => {
                    updateParams({ sort: value, page: 1 });
                  }}
                >
                  <SelectTrigger className="w-45 border-brand/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt-desc">
                      Date (Newest)
                    </SelectItem>
                    <SelectItem value="createdAt-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="clicks-desc">
                      Clicks (High to Low)
                    </SelectItem>
                    <SelectItem value="clicks-asc">
                      Clicks (Low to High)
                    </SelectItem>
                    <SelectItem value="originalUrl-asc">URL (A-Z)</SelectItem>
                    <SelectItem value="originalUrl-desc">URL (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 border-t border-primary/15">
          {!isLoading && urls.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={Link2}
                title={search ? "No links found" : "Create your first link"}
                description={
                  search
                    ? "Try adjusting your search query"
                    : "Start shortening URLs and track their performance with detailed analytics"
                }
                action={
                  !search && (
                    <Button
                      size="lg"
                      className="mt-4 bg-brand hover:bg-brand-hover"
                      asChild
                    >
                      <Link href="/dashboard/urls/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Link
                      </Link>
                    </Button>
                  )
                }
              />
            </div>
          ) : (
            <SimpleTable
              columns={[
                <span key="num" className="w-12 text-center">
                  #
                </span>,
                "Short ID",
                "Short Link",
                <span key="dest" className="hidden md:table-cell">
                  Destination
                </span>,
                <span key="qr" className="hidden sm:table-cell text-center">
                  QR Code
                </span>,
                <span key="clicks" className="text-center">
                  Clicks
                </span>,
                <span key="status" className="hidden sm:table-cell text-center">
                  Status
                </span>,
                <span key="created" className="hidden lg:table-cell">
                  Created
                </span>,
                <span key="expires" className="hidden lg:table-cell">
                  Expires
                </span>,
                <span key="actions" className="text-center">
                  Actions
                </span>,
              ]}
              rows={urls.map((url: IUrl, index: number) => {
                const shortUrl = url.shortUrl || getFullShortUrl(url.shortId);
                const urlId = url.id || url._id;
                const shortId = url.shortId;
                return [
                  <span
                    key="num"
                    className="text-center text-muted-foreground font-medium"
                  >
                    {(page - 1) * limit + index + 1}
                  </span>,
                  <code
                    key="shortId"
                    className="px-2 py-1 rounded bg-muted text-sm font-mono"
                  >
                    {shortId}
                  </code>,
                  <div key="shortLink" className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand/10 group-hover:bg-brand/20 transition-colors">
                      <Link2 className="h-4 w-4 text-brand" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <a
                          href={shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-brand truncate max-w-50 hover:underline text-sm"
                        >
                          {shortUrl}
                        </a>
                        <CopyButton text={shortUrl} size="sm" showOnHover />
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-50 md:hidden">
                        {url.originalUrl}
                      </p>
                    </div>
                  </div>,
                  <div
                    key="dest"
                    className="hidden md:flex items-center gap-2 max-w-64"
                  >
                    <span className="truncate text-muted-foreground text-sm">
                      {url.originalUrl}
                    </span>
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground hover:text-brand" />
                    </a>
                  </div>,
                  <div key="qr" className="hidden sm:flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg bg-muted/50 hover:bg-brand/10"
                      onClick={() =>
                        setQrDialogUrl({
                          shortUrl,
                          shortCode: shortId,
                          qrCodeUrl: url.qrCodeUrl,
                        })
                      }
                    >
                      <QrCode className="h-5 w-5 text-muted-foreground hover:text-brand" />
                    </Button>
                  </div>,
                  <div key="clicks" className="flex justify-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand/10 font-medium text-sm text-brand">
                      <MousePointerClick className="h-3.5 w-3.5" />
                      {formatNumber(url.clickCount ?? 0)}
                    </div>
                  </div>,
                  <div key="status" className="hidden sm:flex justify-center">
                    <Switch
                      checked={url.isActive}
                      onCheckedChange={() =>
                        handleToggleStatus(urlId, url.isActive)
                      }
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>,
                  <span
                    key="created"
                    className="hidden lg:block text-muted-foreground text-sm"
                  >
                    {formatDate(url.createdAt)}
                  </span>,
                  <div key="expires" className="hidden lg:block text-sm">
                    {url.expiresAt ? (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span
                          className={
                            new Date(url.expiresAt) < new Date()
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }
                        >
                          {formatDate(url.expiresAt)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </div>,
                  <div key="actions" className="flex justify-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/urls/${urlId}`}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Link
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/urls/${urlId}/analytics`}
                            className="cursor-pointer"
                          >
                            <BarChart2 className="mr-2 h-4 w-4" />
                            View Analytics
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer p-0">
                          <CopyButton
                            text={shortUrl}
                            variant="button"
                            label="Copy Short URL"
                            className="w-full justify-start border-0 shadow-none hover:bg-transparent"
                          />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive cursor-pointer focus:text-destructive"
                          onClick={() => setDeleteId(urlId)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>,
                ];
              })}
              isLoading={isLoading}
              notFoundMessage="No links found"
              pagination={{
                page,
                totalPages,
                total,
                limit,
                onPageChange: (newPage) => updateParams({ page: newPage }),
                onLimitChange: (newLimit) =>
                  updateParams({ limit: newLimit, page: 1 }),
                limitOptions: LIMIT_OPTIONS,
                isFetching,
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Link"
        description="Are you sure you want to delete this link? This action cannot be undone and all analytics data will be lost."
        confirmText="Delete Link"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />

      {/* QR Code Dialog */}
      <Dialog
        open={!!qrDialogUrl}
        onOpenChange={(open) => !open && setQrDialogUrl(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-brand" />
              QR Code
            </DialogTitle>
            <DialogDescription>
              Scan this QR code to open the short link
            </DialogDescription>
          </DialogHeader>
          {qrDialogUrl && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="p-4 bg-white rounded-xl border shadow-sm">
                <QRCodeDisplay
                  url={qrDialogUrl.shortUrl}
                  qrCodeUrl={qrDialogUrl.qrCodeUrl}
                  size={280}
                  showDownload={true}
                  fileName={`qr-${qrDialogUrl.shortCode}`}
                />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-medium text-brand">
                  {qrDialogUrl.shortUrl}
                </p>
                <p className="text-xs text-muted-foreground">
                  /{qrDialogUrl.shortCode}
                </p>
              </div>
              <div className="flex gap-2">
                <CopyButton
                  text={qrDialogUrl.shortUrl}
                  variant="button"
                  label="Copy URL"
                  size="md"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
