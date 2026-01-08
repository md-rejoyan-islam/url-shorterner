"use client";

import {
  ConfirmDialog,
  EmptyState,
  PageHeader,
  StatsCard,
  StatusBadge,
} from "@/components/shared";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatNumber } from "@/lib/format";
import { useDeletePlanMutation, useGetPlansQuery } from "@/store/api/plan-api";
import { getErrorMessage } from "@/types/api";
import { IPlan } from "@/types/plan";
import {
  Check,
  CheckCircle,
  Crown,
  MoreVertical,
  Package,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export function AdminPlansContent() {
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);

  const { data, isLoading } = useGetPlansQuery({});
  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation();

  const plans = data?.data?.plans || data?.data?.data || (Array.isArray(data?.data) ? data?.data : []);

  const handleDelete = async () => {
    if (!deletePlanId) return;
    try {
      await deletePlan(deletePlanId).unwrap();
      toast.success("Plan Deleted", {
        description: "The plan has been removed successfully.",
      });
      setDeletePlanId(null);
    } catch (error: unknown) {
      toast.error("Delete Failed", {
        description: getErrorMessage(error, "Unable to delete plan"),
      });
    }
  };

  const totalSubscribers = plans.reduce(
    (acc: number, plan: IPlan) => acc + (plan._count?.subscriptions || 0),
    0
  );
  const activePlans = plans.filter((p: IPlan) => p.isActive).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Plans Management"
        badge={{ icon: Package, text: "Admin Panel" }}
        description="Manage subscription plans and pricing"
        actions={
          <Button
            asChild
            size="lg"
            className="bg-white text-brand hover:bg-white/90 shadow-lg"
          >
            <Link href="/admin/plans/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Plan
            </Link>
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Plans"
          value={formatNumber(plans.length)}
          icon={Package}
          color="brand"
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Plans"
          value={formatNumber(activePlans)}
          icon={CheckCircle}
          color="emerald"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Subscribers"
          value={formatNumber(totalSubscribers)}
          icon={Users}
          color="violet"
          isLoading={isLoading}
        />
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-primary/15 shadow-none bg-white py-4">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20 mb-4" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : plans.length === 0 ? (
        <Card className="border border-primary/15 shadow-none bg-white py-4">
          <CardContent className="p-8">
            <EmptyState
              icon={Package}
              title="No plans yet"
              description="Create your first subscription plan to get started"
              action={
                <Button asChild className="mt-4 bg-brand hover:bg-brand/90">
                  <Link href="/admin/plans/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Plan
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan: IPlan) => {
            const isPopular = plan.name.toLowerCase() === "pro";
            // Handle price - can be number or object {monthly, yearly}
            const displayPrice = typeof plan.price === "number"
              ? plan.price
              : (plan.interval === "year" ? plan.price?.yearly : plan.price?.monthly) || 0;
            return (
              <Card
                key={plan._id || plan.id}
                className={`relative border shadow-md hover:shadow-lg transition-all duration-300 py-4 ${
                  isPopular
                    ? "ring-2 ring-brand border-brand/20"
                    : "border-brand/10"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-linear-to-r from-brand to-orange-500 text-white px-3 py-0.5 shadow-lg">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader
                  className={`flex flex-row items-start justify-between pb-2 ${
                    isPopular ? "pt-6" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown
                        className={`h-5 w-5 ${
                          isPopular ? "text-brand" : "text-muted-foreground"
                        }`}
                      />
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/plans/${plan._id || plan.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeletePlanId(plan._id || plan.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">${displayPrice}</span>
                      <span className="text-muted-foreground">
                        /{plan.interval || "month"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <StatusBadge
                      status={plan.isActive ? "active" : "inactive"}
                    />
                    <Badge
                      variant="outline"
                      className="text-xs border-brand/20"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {plan._count?.subscriptions || 0} subscribers
                    </Badge>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span>
                        <strong>
                          {plan.maxLinks === -1
                            ? "Unlimited"
                            : formatNumber(plan.maxLinks)}
                        </strong>{" "}
                        links
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span>
                        <strong>
                          {plan.maxClicks === -1
                            ? "Unlimited"
                            : formatNumber(plan.maxClicks)}
                        </strong>{" "}
                        clicks/month
                      </span>
                    </div>
                    {plan.features?.customCodes && (
                      <div className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span>Custom short codes</span>
                      </div>
                    )}
                    {plan.features?.analytics && (
                      <div className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span>Advanced analytics</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletePlanId}
        onOpenChange={(open) => !open && setDeletePlanId(null)}
        title="Delete Plan"
        description="Are you sure you want to delete this plan? Existing subscribers will retain their access until their subscription expires."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
