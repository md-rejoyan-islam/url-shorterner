"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useCreateCheckoutMutation } from "@/store/api/payment-api";
import { useGetPlansQuery } from "@/store/api/plan-api";
import { IPlan } from "@/types/plan";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function PricingContent() {
  const { data, isLoading, error } = useGetPlansQuery();
  const { user, isAuthenticated } = useAuth();
  const [createCheckout] = useCreateCheckoutMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const isLoggedIn = isAuthenticated;

  // Handle currentPlan being either a string ID or a populated object
  const userCurrentPlan = user?.currentPlan;
  const userCurrentPlanId =
    typeof userCurrentPlan === "string"
      ? userCurrentPlan
      : userCurrentPlan?._id;

  // Extract plans from response - handle multiple possible structures
  const plans: IPlan[] =
    data?.data?.plans ||
    data?.data?.data ||
    (Array.isArray(data?.data) ? data?.data : []);

  // Sort plans by sortOrder or price
  const sortedPlans = [...plans]
    .filter((plan) => plan.isActive)
    .sort((a, b) => {
      if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
        return a.sortOrder - b.sortOrder;
      }
      const priceA =
        typeof a.price === "number" ? a.price : a.price?.monthly || 0;
      const priceB =
        typeof b.price === "number" ? b.price : b.price?.monthly || 0;
      return priceA - priceB;
    });

  // Determine which plan is "popular" (middle plan or Pro plan)
  const getIsPopular = (plan: IPlan, index: number) => {
    if (plan.type === "pro" || plan.slug === "pro") return true;
    if (sortedPlans.length === 3 && index === 1) return true;
    return false;
  };

  // Check if this is the user's current plan
  const getIsCurrentPlan = (plan: IPlan) => {
    if (!userCurrentPlanId) return false;
    return plan._id === userCurrentPlanId || plan.id === userCurrentPlanId;
  };

  const getPrice = (plan: IPlan) => {
    const price =
      typeof plan.price === "number" ? plan.price : plan.price?.monthly || 0;
    // Format to remove unnecessary decimals (show 9.99 but not 9.990)
    return Number.isInteger(price) ? price : parseFloat(price.toFixed(2));
  };

  const getInterval = (plan: IPlan) => {
    return plan.interval || "month";
  };

  const getCtaText = (plan: IPlan) => {
    const isCurrentPlan = getIsCurrentPlan(plan);

    // Current plan
    if (isCurrentPlan) return "Current Plan";

    // Free plan
    if (plan.type === "free" || plan.slug === "free") return "Get Started";

    // Paid plans
    return "Choose Plan";
  };

  const getCtaHref = (plan: IPlan) => {
    const isCurrentPlan = getIsCurrentPlan(plan);
    if (isCurrentPlan) return "/dashboard/billing";

    // Non-logged in users go to register
    if (plan.type === "free" || plan.slug === "free") return "/register";
    return `/register?plan=${plan.slug}`;
  };

  // Handle checkout for logged-in users
  const handleCheckout = async (plan: IPlan) => {
    const planId = plan._id || plan.id;
    if (!planId) return;

    setLoadingPlanId(planId);
    try {
      const result = await createCheckout({
        planId,
        billingCycle: plan.interval === "year" ? "yearly" : "monthly",
      }).unwrap();

      if (result.data?.checkoutUrl) {
        window.location.assign(result.data.checkoutUrl);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setLoadingPlanId(null);
    }
  };

  // Check if plan requires checkout (paid plan for logged-in user)
  const needsCheckout = (plan: IPlan) => {
    if (!isLoggedIn) return false;
    if (getIsCurrentPlan(plan)) return false;
    if (plan.type === "free" || plan.slug === "free") return false;
    return true;
  };

  // Get features list
  const getFeaturesList = (plan: IPlan): string[] => {
    // If featuresList is provided, use it
    if (plan.featuresList && plan.featuresList.length > 0) {
      // Create a copy before sorting to avoid mutating read-only Redux state
      return [...plan.featuresList]
        .sort((a, b) => a.order - b.order)
        .map((f) => f.text);
    }

    // Otherwise, build from features object
    const features: string[] = [];
    const f = plan.features;

    if (f.urlLimit === -1) {
      features.push("Unlimited links");
    } else if (f.urlLimit) {
      features.push(`${f.urlLimit} links per month`);
    }

    if (f.analyticsEnabled || f.analytics) {
      features.push("Advanced analytics");
    }

    if (f.customAliasAllowed || f.customCodes) {
      features.push("Custom short codes");
    }

    if (f.qrCodeEnabled) {
      features.push("QR code generation");
    }

    if (f.apiAccessEnabled || f.apiAccess) {
      features.push("API access");
    }

    if (f.maxDevices) {
      features.push(`Up to ${f.maxDevices} devices`);
    }

    if (f.supportLevel === "priority" || f.prioritySupport) {
      features.push("Priority support");
    } else if (f.supportLevel === "dedicated") {
      features.push("Dedicated support");
    } else {
      features.push("Standard support");
    }

    return features;
  };

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white border border-zinc-200 rounded-2xl">
            <CardHeader className="p-8 pb-0">
              <Skeleton className="h-5 w-20 mb-4" />
              <Skeleton className="h-10 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-8 pt-0">
              <Skeleton className="h-11 w-full rounded-lg" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error || sortedPlans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Unable to load pricing plans. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {sortedPlans.map((plan, index) => {
        const isPopular = getIsPopular(plan, index);
        const isCurrentPlan = getIsCurrentPlan(plan);
        const price = getPrice(plan);
        const interval = getInterval(plan);
        const features = getFeaturesList(plan);
        const ctaText = getCtaText(plan);

        return (
          <Card
            key={plan._id || plan.id}
            className={`relative flex flex-col bg-white dark:bg-zinc-950 rounded-2xl transition-all duration-300 ${
              isCurrentPlan
                ? "border-2 border-green-500 shadow-xl"
                : isPopular
                ? "border-2 border-[#e6560f] shadow-xl"
                : "border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-lg"
            }`}
          >
            {/* Current Plan Badge */}
            {isCurrentPlan && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-green-500 hover:bg-green-500 text-white px-4 py-1 text-xs font-medium rounded-full">
                  Current Plan
                </Badge>
              </div>
            )}

            {/* Popular Badge (only show if not current plan) */}
            {isPopular && !isCurrentPlan && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#e6560f] hover:bg-[#e6560f] text-white px-4 py-1 text-xs font-medium rounded-full">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardHeader className="p-8 pb-0">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                  ${price}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 text-sm">
                  /{interval}
                </span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {plan.description}
              </p>
            </CardHeader>

            <CardContent className="p-8 flex-1">
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-[#e6560f] shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-8 pt-0">
              {needsCheckout(plan) ? (
                <Button
                  onClick={() => handleCheckout(plan)}
                  disabled={loadingPlanId === (plan._id || plan.id)}
                  className={`w-full h-11 text-sm font-medium rounded-lg transition-colors ${
                    isPopular
                      ? "bg-[#e6560f] hover:bg-[#d14d0d] text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900"
                  }`}
                >
                  {loadingPlanId === (plan._id || plan.id) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    ctaText
                  )}
                </Button>
              ) : (
                <Button
                  asChild={!isCurrentPlan}
                  disabled={isCurrentPlan}
                  className={`w-full h-11 text-sm font-medium rounded-lg transition-colors ${
                    isCurrentPlan
                      ? "bg-green-500 hover:bg-green-500 text-white cursor-default"
                      : isPopular
                      ? "bg-[#e6560f] hover:bg-[#d14d0d] text-white"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900"
                  }`}
                >
                  {isCurrentPlan ? (
                    ctaText
                  ) : (
                    <Link href={getCtaHref(plan)}>{ctaText}</Link>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
