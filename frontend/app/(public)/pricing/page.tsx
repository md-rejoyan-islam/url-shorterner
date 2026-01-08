import { PricingContent } from "@/components/pricing/pricing-content";
import { AnimatedBackground, GradientText } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, HelpCircle, Shield, Sparkles, Zap } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the perfect plan for your link management needs",
};

const faqs = [
  {
    q: "Can I change plans later?",
    a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing.",
  },
  {
    q: "What happens when I reach my link limit?",
    a: "On the free plan, you won't be able to create new links until the next month. Consider upgrading to Pro for unlimited links.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes! Both Pro and Business plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Hero Section  */}
      <section className="relative overflow-hidden py-28 md:py-32">
        <AnimatedBackground variant="hero" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 hover:bg-[#e6560f]/15 px-5 py-2 text-sm font-medium shadow-lg shadow-[#e6560f]/5">
              <Sparkles className="h-4 w-4 mr-2" />
              Simple, transparent pricing
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Choose Your <GradientText>Perfect Plan</GradientText>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Start for free and upgrade as you grow. No hidden fees, no
              surprises. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="pb-12 pt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[
              {
                icon: Shield,
                text: "Secure Payments",
                color: "text-[#e6560f]",
              },
              { icon: Clock, text: "Cancel Anytime", color: "text-orange-500" },
              {
                icon: Zap,
                text: "Instant Activation",
                color: "text-amber-500",
              },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6560f]/5 border border-[#e6560f]/15"
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards - Dynamic from API */}
      <section className="pb-20 md:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PricingContent />
        </div>
      </section>

      {/* FAQ Section  */}
      <section className="py-12 md:py-16 relative overflow-hidden bg-white dark:bg-zinc-950">
        <AnimatedBackground variant="section" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked <GradientText>Questions</GradientText>
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about our pricing and plans.
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card
                  key={faq.q}
                  className="bg-white dark:bg-zinc-900 border border-[#e6560f]/10 shadow-lg hover:shadow-xl hover:shadow-[#e6560f]/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
