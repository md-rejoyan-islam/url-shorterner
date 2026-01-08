"use client";

import {
  ArrowUpRight,
  CheckCircle2,
  CreditCard,
  Loader2,
  Plus,
  Receipt,
  Trash2,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState, PageHeader, StatsCard } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/format";
import {
  useAddCardMutation,
  useDeletePaymentMethodMutation,
  useGetPaymentHistoryQuery,
  useGetPaymentMethodsQuery,
  useGetSetupIntentMutation,
} from "@/store/api/payment-api";
import { useGetCurrentSubscriptionQuery } from "@/store/api/subscription-api";
import { getErrorMessage } from "@/types/api";
import { IPayment, ISavedCard, PaymentStatus } from "@/types/payment";
import { IPlan } from "@/types/plan";

// Helper to check if plan is populated object
const isPlanObject = (plan: string | IPlan | undefined): plan is IPlan => {
  return typeof plan === "object" && plan !== null && "name" in plan;
};

// Helper to get status badge variant
const getStatusBadgeVariant = (status: PaymentStatus) => {
  switch (status) {
    case PaymentStatus.SUCCEEDED:
      return "default";
    case PaymentStatus.PENDING:
      return "secondary";
    case PaymentStatus.FAILED:
      return "destructive";
    case PaymentStatus.REFUNDED:
      return "outline";
    default:
      return "secondary";
  }
};

// Helper to format currency
const formatAmount = (amount: number, currency: string = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
};

export function BillingContent() {
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  const { data: subscriptionData, isLoading: subLoading } =
    useGetCurrentSubscriptionQuery();
  const { data: paymentMethodsData, isLoading: paymentMethodsLoading } =
    useGetPaymentMethodsQuery();
  const { data: paymentHistoryData, isLoading: historyLoading } =
    useGetPaymentHistoryQuery();
  const [deletePaymentMethod, { isLoading: isDeleting }] =
    useDeletePaymentMethodMutation();
  const [getSetupIntent, { isLoading: isGettingSetupIntent }] =
    useGetSetupIntentMutation();
  const [addCard, { isLoading: isAddingCard }] = useAddCardMutation();

  const subscription = subscriptionData?.data;
  const paymentMethods = paymentMethodsData?.data || [];
  const paymentHistory = paymentHistoryData?.data?.payments || [];

  // Get plan object if populated
  const plan =
    subscription && isPlanObject(subscription.plan) ? subscription.plan : null;

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      await deletePaymentMethod(id).unwrap();
      toast.success("Payment Method Removed", {
        description: "The payment method has been removed from your account.",
      });
    } catch (error: unknown) {
      toast.error("Remove Failed", {
        description: getErrorMessage(error, "Unable to remove payment method"),
      });
    }
  };

  const resetCardForm = () => {
    setCardNumber("");
    setExpiry("");
    setCvc("");
    setCardholderName("");
  };

  const handleOpenAddCardModal = () => {
    resetCardForm();
    setShowAddCardModal(true);
  };

  const handleCloseAddCardModal = () => {
    setShowAddCardModal(false);
    resetCardForm();
  };

  // Format card number with spaces (e.g., 4242 4242 4242 4242)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Format expiry date (MM/YY)
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleAddCard = async () => {
    // Validate inputs
    if (!cardNumber || !expiry || !cvc || !cardholderName) {
      toast.error("Missing Information", {
        description: "Please fill in all card details.",
      });
      return;
    }

    // Parse expiry
    const [expMonth, expYear] = expiry.split("/");
    if (
      !expMonth ||
      !expYear ||
      expMonth.length !== 2 ||
      expYear.length !== 2
    ) {
      toast.error("Invalid Expiry", {
        description: "Please enter expiry in MM/YY format.",
      });
      return;
    }

    try {
      // Get setup intent from server
      const setupIntentResponse = await getSetupIntent().unwrap();
      const clientSecret = setupIntentResponse.data?.clientSecret;

      if (!clientSecret) {
        toast.error("Setup Failed", {
          description: "Unable to create payment setup. Please try again.",
        });
        return;
      }

      // For now, we'll simulate adding a card by calling the addCard API
      // In a real implementation, you would use Stripe.js to confirm the setup intent
      // and then send the payment method ID to your server

      // This is a simplified version - in production you'd use Stripe Elements
      // For demo purposes, we'll create a mock payment method ID
      const mockPaymentMethodId = `pm_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;

      await addCard({
        paymentMethodId: mockPaymentMethodId,
        setAsDefault: paymentMethods.length === 0,
      }).unwrap();

      toast.success("Card Added", {
        description: "Your payment method has been added successfully.",
      });
      handleCloseAddCardModal();
    } catch (error: unknown) {
      toast.error("Add Card Failed", {
        description: getErrorMessage(error, "Unable to add payment method"),
      });
    }
  };

  const isAddingCardLoading = isGettingSetupIntent || isAddingCard;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Billing"
        badge={{ icon: Receipt, text: "Payments & Plans" }}
        description="Manage your subscription, payment methods, and billing history"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Current Plan"
          value={plan?.name || "Free"}
          subtitle={subscription?.status === "active" ? "Active" : "No plan"}
          icon={Wallet}
          color="brand"
          isLoading={subLoading}
        />
        <StatsCard
          title="Links"
          value={
            plan?.maxLinks === -1 ? "Unlimited" : String(plan?.maxLinks || "10")
          }
          subtitle="Max links"
          icon={Receipt}
          color="emerald"
          isLoading={subLoading}
        />
        <StatsCard
          title="Clicks/mo"
          value={
            plan?.maxClicks === -1
              ? "Unlimited"
              : String(plan?.maxClicks || "1000")
          }
          subtitle="Max clicks"
          icon={CreditCard}
          color="violet"
          isLoading={subLoading}
        />
        <StatsCard
          title="Payment Methods"
          value={paymentMethods.length}
          subtitle="Cards saved"
          icon={CreditCard}
          color="amber"
          isLoading={paymentMethodsLoading}
        />
      </div>

      {/* Current Plan */}
      <Card className="border border-primary/15 shadow-none bg-white py-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand/10">
              <Receipt className="h-4 w-4 text-brand" />
            </div>
            Current Plan
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {subLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {plan?.name || "Free"} Plan
                </h3>
                <p className="text-muted-foreground">
                  {subscription?.status === "active"
                    ? `Renews on ${formatDate(subscription.currentPeriodEnd)}`
                    : "No active subscription"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/dashboard/subscription/upgrade">
                    Upgrade Plan
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                {subscription && (
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/subscription">Manage</Link>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Plan Features */}
          {plan && (
            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Plan Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">Links</span>
                  <p className="font-semibold">
                    {plan.maxLinks === -1 ? "Unlimited" : plan.maxLinks}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">
                    Clicks/month
                  </span>
                  <p className="font-semibold">
                    {plan.maxClicks === -1 ? "Unlimited" : plan.maxClicks}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">
                    Custom Codes
                  </span>
                  <p className="font-semibold">
                    {plan.features?.customCodes ? "Yes" : "No"}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <span className="text-sm text-muted-foreground">
                    Analytics
                  </span>
                  <p className="font-semibold">
                    {plan.features?.analytics ? "Advanced" : "Basic"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="border border-primary/15 shadow-none bg-white py-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-500/10">
                  <CreditCard className="h-4 w-4 text-violet-600" />
                </div>
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </div>
            <Button size="sm" onClick={handleOpenAddCardModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Card
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {paymentMethodsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : paymentMethods.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title="No payment methods"
              description="Add a payment method to upgrade your plan"
            />
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method: ISavedCard) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-primary/10 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-16 bg-muted rounded-lg flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Expires {method.expMonth}/{method.expYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <span className="text-xs font-medium bg-brand/10 text-brand px-3 py-1.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Default
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      disabled={isDeleting}
                      className="hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border border-primary/15 shadow-none bg-white py-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <Receipt className="h-4 w-4 text-emerald-600" />
            </div>
            Billing History
          </CardTitle>
          <CardDescription>
            View your past invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {historyLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : paymentHistory.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No billing history"
              description="Your payment history will appear here"
            />
          ) : (
            <div className="space-y-3">
              {paymentHistory.map((payment: IPayment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-4 rounded-xl border border-primary/10 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {payment.description ||
                          `${
                            typeof payment.plan === "object"
                              ? payment.plan.name
                              : "Plan"
                          } - ${payment.billingCycle}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusBadgeVariant(payment.status)}>
                      {payment.status}
                    </Badge>
                    <span className="font-semibold">
                      {formatAmount(payment.amount, payment.currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Card Modal */}
      <Dialog open={showAddCardModal} onOpenChange={setShowAddCardModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand" />
              Add Payment Method
            </DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                disabled={isAddingCardLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value))
                }
                maxLength={19}
                disabled={isAddingCardLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  disabled={isAddingCardLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) =>
                    setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  maxLength={4}
                  disabled={isAddingCardLoading}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={handleCloseAddCardModal}
              disabled={isAddingCardLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCard} disabled={isAddingCardLoading}>
              {isAddingCardLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Card
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
