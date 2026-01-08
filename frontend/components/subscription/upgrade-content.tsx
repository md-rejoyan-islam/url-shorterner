"use client";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Crown,
  HelpCircle,
  Loader2,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateCheckoutMutation } from "@/store/api/payment-api";
import { useGetPlansQuery } from "@/store/api/plan-api";
import {
  useCreateSubscriptionMutation,
  useGetCurrentSubscriptionQuery,
} from "@/store/api/subscription-api";
import { getErrorMessage } from "@/types/api";
import { IPlan } from "@/types/plan";

export function UpgradeContent() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const { data: plansData, isLoading: plansLoading } = useGetPlansQuery();
  const { data: currentSub } = useGetCurrentSubscriptionQuery();
  const [createCheckout, { isLoading: isCreatingCheckout }] =
    useCreateCheckoutMutation();
  const [createSubscription, { isLoading: isCreatingSubscription }] =
    useCreateSubscriptionMutation();

  const isCreating = isCreatingCheckout || isCreatingSubscription;

  // Handle multiple possible response structures
  const plans: IPlan[] =
    (plansData?.data as { plans?: IPlan[]; data?: IPlan[] })?.plans ||
    (plansData?.data as { plans?: IPlan[]; data?: IPlan[] })?.data ||
    (Array.isArray(plansData?.data) ? (plansData?.data as IPlan[]) : []);

  // Filter to only show active plans
  const activePlans = plans.filter((p) => p.isActive);

  // Get current plan ID (handle both populated and non-populated cases)
  const currentPlan = currentSub?.data?.plan;
  const currentPlanId =
    currentPlan && typeof currentPlan === "object"
      ? (currentPlan as IPlan)._id || (currentPlan as IPlan).id
      : currentPlan;

  const handleUpgrade = async (
    planId: string,
    billingCycle: "monthly" | "yearly" = "monthly",
    isFree: boolean = false
  ) => {
    setSelectedPlan(planId);
    try {
      // For free plans, create subscription directly without payment
      if (isFree) {
        await createSubscription({ planId, billingCycle }).unwrap();
        toast.success("Subscription Updated", {
          description: "You have been switched to the free plan.",
        });
        router.push("/dashboard/subscription");
        return;
      }

      // For paid plans, create checkout session and redirect to Stripe hosted checkout
      const response = await createCheckout({ planId, billingCycle }).unwrap();

      if (response.data?.checkoutUrl) {
        // Redirect to Stripe's hosted checkout page
        window.location.assign(response.data.checkoutUrl);
      } else {
        toast.error("Checkout Failed", {
          description: "Unable to create checkout session",
        });
        setSelectedPlan(null);
      }
    } catch (error: unknown) {
      toast.error("Upgrade Failed", {
        description: getErrorMessage(error, "Unable to process upgrade"),
      });
      setSelectedPlan(null);
    }
  };

  const faqs = [
    {
      q: "Can I change plans anytime?",
      a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges.",
    },
    {
      q: "What happens to my links if I downgrade?",
      a: "Your existing links will remain active. However, you won't be able to create new links if you exceed your plan's limit.",
    },
    {
      q: "Is there a contract or commitment?",
      a: "No, all plans are month-to-month with no long-term commitment. Cancel anytime with no penalties.",
    },
    {
      q: "How does billing work?",
      a: "You'll be billed at the start of each billing period. We accept all major credit cards through our secure Stripe integration.",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Upgrade Your Plan"
        badge={{ icon: Sparkles, text: "Choose Your Plan" }}
        description="Unlock powerful features to grow your business. Choose the plan that fits your needs."
        actions={
          <Button
            variant="ghost"
            size="lg"
            asChild
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <Link href="/dashboard/subscription">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Subscription
            </Link>
          </Button>
        }
      />

      {/* Trust Indicators */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-12">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="text-sm">Secure Payments</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className="text-sm">Cancel Anytime</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Zap className="h-5 w-5 text-amber-500" />
          <span className="text-sm">Instant Activation</span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 pt-6 gap-6 lg:gap-8 max-w-6xl mx-auto">
        {plansLoading
          ? // Skeleton plan cards
            Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={index}
                className="relative flex flex-col border border-brand/10 shadow-lg py-4"
              >
                <CardHeader className="pb-4 pt-8">
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent className="flex-1 pt-6">
                  <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                      <Skeleton className="h-12 w-20" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-3 w-24 mt-2" />
                  </div>
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-6">
                  <Skeleton className="h-12 w-full rounded-md" />
                </CardFooter>
              </Card>
            ))
          : activePlans.map((plan: IPlan) => {
              const planId = plan._id || plan.id;
              const isCurrentPlan = planId === currentPlanId;
              const isPopular = plan.name.toLowerCase() === "pro";
              const isLoading = isCreating && selectedPlan === planId;
              // Handle price - can be number or object {monthly, yearly}
              const displayPrice =
                typeof plan.price === "number"
                  ? plan.price
                  : (plan.interval === "year"
                      ? plan.price?.yearly
                      : plan.price?.monthly) || 0;

              return (
                <Card
                  key={planId}
                  className={`relative flex flex-col border shadow-lg hover:shadow-xl transition-all duration-300 py-4 ${
                    isPopular
                      ? "ring-2 ring-brand shadow-brand/20 scale-[1.02] md:scale-105 border-brand/20"
                      : isCurrentPlan
                      ? "ring-2 ring-green-500 shadow-green-500/20 border-green-500/20"
                      : "border-brand/10"
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-linear-to-r from-brand to-orange-500 text-white px-4 py-1 shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  {isCurrentPlan && !isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-green-500 text-white px-4 py-1 shadow-lg">
                        <Check className="h-3 w-3 mr-1" />
                        Current Plan
                      </Badge>
                    </div>
                  )}

                  <CardHeader
                    className={`pb-4 pt-8 ${
                      isPopular
                        ? "bg-linear-to-br from-brand/5 to-brand/10"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Crown
                        className={`h-5 w-5 ${
                          isPopular ? "text-brand" : "text-muted-foreground"
                        }`}
                      />
                      <h3 className="text-xl font-bold">{plan.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="flex-1 pt-6">
                    <div className="mb-8">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold">
                          ${displayPrice}
                        </span>
                        <span className="text-muted-foreground">
                          /{plan.interval || "month"}
                        </span>
                      </div>
                      {displayPrice > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Billed {plan.interval || "month"}ly
                        </p>
                      )}
                    </div>

                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 mt-0.5">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm">
                          <strong>
                            {plan.maxLinks === -1 ? "Unlimited" : plan.maxLinks}
                          </strong>{" "}
                          links
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 mt-0.5">
                          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-sm">
                          <strong>
                            {plan.maxClicks === -1
                              ? "Unlimited"
                              : plan.maxClicks.toLocaleString()}
                          </strong>{" "}
                          clicks/month
                        </span>
                      </li>
                      {plan.features &&
                        Object.entries(plan.features).map(
                          ([key, value]) =>
                            value && (
                              <li key={key} className="flex items-start gap-3">
                                <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 mt-0.5">
                                  <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                </div>
                                <span className="text-sm capitalize">
                                  {key.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                              </li>
                            )
                        )}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-6">
                    <Button
                      className={`w-full h-12 text-base font-semibold ${
                        isPopular
                          ? "bg-linear-to-r from-brand to-orange-500 hover:from-brand/90 hover:to-orange-600 shadow-lg"
                          : ""
                      }`}
                      variant={isPopular ? "default" : "outline"}
                      disabled={isCurrentPlan || isLoading}
                      onClick={() =>
                        handleUpgrade(
                          planId,
                          plan.interval === "year" ? "yearly" : "monthly",
                          displayPrice === 0
                        )
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : isCurrentPlan ? (
                        "Current Plan"
                      ) : displayPrice === 0 ? (
                        "Downgrade to Free"
                      ) : (
                        <>
                          Upgrade to {plan.name}
                          <Sparkles className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="border border-brand/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer py-4"
              onClick={() =>
                setExpandedFaq(expandedFaq === index ? null : index)
              }
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{faq.q}</h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                {expandedFaq === index && (
                  <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                    {faq.a}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
