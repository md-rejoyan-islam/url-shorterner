"use client";

import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Check,
  CreditCard,
  Crown,
  Link2,
  Loader2,
  MousePointerClick,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  ConfirmDialog,
  DataCard,
  InfoCard,
  InfoCardRow,
  PageHeader,
  StatsCard,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatNumber } from "@/lib/format";
import { useConfirmCheckoutSessionMutation } from "@/store/api/payment-api";
import { useGetPlansQuery } from "@/store/api/plan-api";
import {
  useCancelSubscriptionMutation,
  useGetCurrentSubscriptionQuery,
} from "@/store/api/subscription-api";
import { getErrorMessage } from "@/types/api";
import { IPlan } from "@/types/plan";
import { SubscriptionStatus } from "@/types/subscription";
import { toast } from "sonner";

// Helper to get plan price as number
const getPlanPrice = (plan: IPlan | undefined): number => {
  if (!plan) return 0;
  if (typeof plan.price === "number") return plan.price;
  return plan.price?.monthly || 0;
};

export function SubscriptionContent() {
  const searchParams = useSearchParams();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const hasConfirmedRef = useRef(false);
  const { data, isLoading, refetch } = useGetCurrentSubscriptionQuery();
  const { data: plansData } = useGetPlansQuery();
  const [cancelSubscription, { isLoading: isCanceling }] =
    useCancelSubscriptionMutation();
  const [confirmCheckoutSession, { isLoading: isConfirming }] =
    useConfirmCheckoutSessionMutation();

  // Check for success redirect from Stripe and confirm the session
  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");

    // Only run once using ref to prevent re-runs
    if (success === "true" && sessionId && !hasConfirmedRef.current) {
      hasConfirmedRef.current = true;

      // Clear URL params immediately to prevent re-triggers
      window.history.replaceState({}, "", "/dashboard/subscription");

      confirmCheckoutSession({ sessionId })
        .unwrap()
        .then(() => {
          toast.success("Payment Successful!", {
            description: "Your subscription has been activated.",
          });
          refetch();
        })
        .catch((error) => {
          // Check if it's a 409 conflict (subscription already exists)
          const errorMsg = getErrorMessage(error, "");
          if (errorMsg.includes("already has an active subscription")) {
            toast.success("Subscription Active", {
              description: "Your subscription is already active.",
            });
            refetch();
          } else {
            toast.error("Activation Failed", {
              description: getErrorMessage(
                error,
                "Unable to activate subscription. Please contact support."
              ),
            });
          }
        });
    }
  }, [searchParams, confirmCheckoutSession, refetch]);

  const subscription = data?.data;

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();
      toast.success("Subscription Cancelled", {
        description: "Your subscription has been cancelled successfully.",
      });
      setShowCancelDialog(false);
      refetch();
    } catch (error: unknown) {
      toast.error("Cancellation Failed", {
        description: getErrorMessage(error, "Unable to cancel subscription"),
      });
    }
  };

  // Extract plan object (handle both populated and non-populated cases)
  const plan: IPlan | undefined =
    subscription?.plan && typeof subscription.plan === "object"
      ? (subscription.plan as IPlan)
      : undefined;
  const usage = subscription?.usage || { links: 0, clicks: 0 };
  const planPrice = getPlanPrice(plan);
  const isPremium = plan?.name !== "Free" && planPrice > 0;

  // Check if user is on the highest plan (based on price)
  const allPlans: IPlan[] =
    (plansData?.data as { plans?: IPlan[]; data?: IPlan[] })?.plans ||
    (plansData?.data as { plans?: IPlan[]; data?: IPlan[] })?.data ||
    [];
  const highestPlanPrice =
    allPlans.length > 0
      ? Math.max(
          ...allPlans
            .filter((p: IPlan) => p.isActive)
            .map((p: IPlan) => getPlanPrice(p))
        )
      : 0;
  const isOnHighestPlan = isPremium && planPrice >= highestPlanPrice;

  // Show loading overlay while confirming payment
  if (isConfirming) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-brand" />
        <h2 className="text-xl font-semibold">
          Activating Your Subscription...
        </h2>
        <p className="text-muted-foreground">
          Please wait while we confirm your payment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Subscription"
        badge={{
          icon: Crown,
          text: isPremium ? plan?.name || "Premium" : "Free Tier",
        }}
        description={
          isOnHighestPlan
            ? "You're on our best plan with all premium features"
            : isPremium
            ? "Enjoy all premium features and priority support"
            : "Upgrade to unlock more links, clicks, and premium features"
        }
        actions={
          !isLoading && !isOnHighestPlan ? (
            <Button
              size="lg"
              className="bg-white text-brand hover:bg-white/90 shadow-lg"
              asChild
            >
              <Link href="/dashboard/subscription/upgrade">
                <Sparkles className="mr-2 h-4 w-4" />
                {isPremium ? "Change Plan" : "Upgrade Now"}
              </Link>
            </Button>
          ) : undefined
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Current Plan"
          value={plan?.name || "Free"}
          subtitle={
            isPremium
              ? `$${Math.round(planPrice)}/${plan?.interval || "month"}`
              : "No cost"
          }
          icon={Crown}
          color="brand"
          isLoading={isLoading}
        />
        <StatsCard
          title="Links Used"
          value={formatNumber(usage.links)}
          subtitle={`of ${
            plan?.maxLinks === -1
              ? "Unlimited"
              : formatNumber(plan?.maxLinks || 100)
          }`}
          icon={Link2}
          color="blue"
          isLoading={isLoading}
        />
        <StatsCard
          title="Clicks Tracked"
          value={formatNumber(usage.clicks)}
          subtitle={`of ${
            plan?.maxClicks === -1
              ? "Unlimited"
              : formatNumber(plan?.maxClicks || 10000)
          }`}
          icon={MousePointerClick}
          color="emerald"
          isLoading={isLoading}
        />
        <StatsCard
          title="Status"
          value={
            subscription?.cancelAtPeriodEnd
              ? "Cancelling"
              : subscription?.status === SubscriptionStatus.ACTIVE
              ? "Active"
              : subscription?.status || "Free"
          }
          subtitle={
            subscription?.currentPeriodEnd
              ? `Until ${formatDate(subscription.currentPeriodEnd)}`
              : "No expiry"
          }
          icon={Shield}
          color={
            subscription?.cancelAtPeriodEnd
              ? "amber"
              : subscription?.status === SubscriptionStatus.ACTIVE
              ? "emerald"
              : "amber"
          }
          isLoading={isLoading}
        />
      </div>

      {/* Subscription Status Card - Shows which plan is activated */}
      <Card className="border border-primary/15 shadow-none bg-white py-4">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${
                subscription?.cancelAtPeriodEnd
                  ? "bg-amber-500/10"
                  : subscription?.status === SubscriptionStatus.ACTIVE
                  ? "bg-emerald-500/10"
                  : subscription?.status === SubscriptionStatus.CANCELLED
                  ? "bg-amber-500/10"
                  : "bg-blue-500/10"
              }`}
            >
              {subscription?.cancelAtPeriodEnd ? (
                <AlertCircle className="h-6 w-6 text-amber-600" />
              ) : subscription?.status === SubscriptionStatus.ACTIVE ? (
                <Check className="h-6 w-6 text-emerald-600" />
              ) : subscription?.status === SubscriptionStatus.CANCELLED ? (
                <AlertCircle className="h-6 w-6 text-amber-600" />
              ) : (
                <Crown className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {subscription?.cancelAtPeriodEnd
                  ? "Cancellation Pending"
                  : subscription?.status === SubscriptionStatus.ACTIVE
                  ? `${plan?.name || "Premium"} Plan Active`
                  : subscription?.status === SubscriptionStatus.CANCELLED
                  ? "Subscription Cancelled"
                  : "Free Plan"}
              </h3>
              <p className="text-muted-foreground">
                {subscription?.cancelAtPeriodEnd
                  ? `Your ${plan?.name} plan will be cancelled on ${formatDate(
                      subscription.currentPeriodEnd
                    )}`
                  : subscription?.status === SubscriptionStatus.ACTIVE
                  ? `Your ${plan?.name} subscription renews on ${formatDate(
                      subscription.currentPeriodEnd
                    )}`
                  : subscription?.status === SubscriptionStatus.CANCELLED
                  ? `Access to ${plan?.name} until ${formatDate(
                      subscription?.currentPeriodEnd
                    )}`
                  : "Upgrade to unlock premium features"}
              </p>
            </div>
            {subscription?.status === SubscriptionStatus.ACTIVE &&
              isPremium &&
              !subscription?.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                  className="border-brand/20 hover:border-brand/40"
                >
                  Cancel Plan
                </Button>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <DataCard
        title="Plan Features"
        description={`What's included in your ${plan?.name || "Free"} plan`}
        icon={Zap}
        color="brand"
        isLoading={isLoading}
        noPadding={false}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-muted/50"
              >
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {plan?.maxLinks === -1
                      ? "Unlimited"
                      : plan?.maxLinks || 100}{" "}
                    Links
                  </p>
                  <p className="text-xs text-muted-foreground">Maximum links</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {plan?.maxClicks === -1
                      ? "Unlimited"
                      : formatNumber(plan?.maxClicks || 10000)}{" "}
                    Clicks
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Monthly tracked
                  </p>
                </div>
              </div>
              {plan?.features &&
                Object.entries(plan.features).map(
                  ([key, value]) =>
                    value && (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-4 rounded-xl bg-muted/50"
                      >
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                          <Check className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Included
                          </p>
                        </div>
                      </div>
                    )
                )}
            </>
          )}
        </div>
      </DataCard>

      {/* Billing Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <InfoCard
          title="Billing Period"
          description="Current billing cycle dates"
          icon={Calendar}
          color="violet"
        >
          <div className="space-y-1">
            <InfoCardRow
              label="Started"
              value={
                subscription?.currentPeriodStart
                  ? formatDate(subscription.currentPeriodStart)
                  : "N/A"
              }
              isLoading={isLoading}
              hasBorder
            />
            <InfoCardRow
              label="Ends"
              value={
                subscription?.currentPeriodEnd
                  ? formatDate(subscription.currentPeriodEnd)
                  : "N/A"
              }
              isLoading={isLoading}
            />
          </div>
        </InfoCard>

        <InfoCard
          title="Payment Method"
          description="Manage your billing details"
          icon={CreditCard}
          color="rose"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Secured by Stripe</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-brand/20 hover:border-brand/40"
              asChild
            >
              <Link href="/dashboard/billing">
                Manage
                <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          </div>
        </InfoCard>
      </div>

      {/* Upgrade CTA for Free Users (only show if not on highest plan) */}
      {!isOnHighestPlan && (
        <Card className="border border-primary/15 shadow-none bg-white py-4">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-brand/10">
                  <Sparkles className="h-6 w-6 text-brand" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
                    {isPremium ? "Want more features?" : "Ready to upgrade?"}
                  </h3>
                  <p className="text-muted-foreground">
                    {isPremium
                      ? "Upgrade to a higher plan for more links and features"
                      : "Unlock unlimited links, advanced analytics, and more"}
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-brand hover:bg-brand/90 shadow-lg shadow-brand/20"
                asChild
              >
                <Link href="/dashboard/subscription/upgrade">
                  View Plans
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Dialog */}
      <ConfirmDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        title="Cancel Subscription"
        description="Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period."
        confirmText="Cancel Subscription"
        variant="destructive"
        onConfirm={handleCancel}
        isLoading={isCanceling}
      />
    </div>
  );
}
