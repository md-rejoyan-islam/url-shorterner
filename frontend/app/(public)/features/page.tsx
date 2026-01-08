import {
  AnimatedBackground,
  CardBackgroundDecoration,
  GradientText,
  HoverGradient,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  CreditCard,
  Gift,
  Globe,
  Link2,
  Lock,
  QrCode,
  Rocket,
  Shield,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features",
  description: "Discover all the powerful features of LinkShort URL shortener",
};

const features = [
  {
    icon: Link2,
    title: "Instant URL Shortening",
    description:
      "Transform any long URL into a clean, shareable short link in milliseconds. No signup required for basic usage.",
    color: "from-[#e6560f] to-orange-600",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track every click with detailed insights including location, device type, browser, referrer, and more.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description:
      "Automatically generate downloadable QR codes for every shortened link. Perfect for print materials and offline marketing.",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description:
      "Use your own branded domain for short links. Build trust and increase click-through rates with recognizable URLs.",
    color: "from-[#e6560f] to-red-500",
  },
  {
    icon: Target,
    title: "Custom Short Codes",
    description:
      "Create memorable, branded short codes instead of random strings. Make your links meaningful and recognizable.",
    color: "from-orange-600 to-[#e6560f]",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite team members, assign roles, and collaborate on link management with shared workspaces.",
    color: "from-amber-600 to-orange-500",
  },
  {
    icon: Clock,
    title: "Link Expiration",
    description:
      "Set expiration dates for your links. Perfect for time-sensitive promotions and limited offers.",
    color: "from-[#e6560f] to-orange-600",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption, SSO integration, and advanced permission controls keep your data safe.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast Redirects",
    description:
      "Global CDN ensures your links redirect in under 50ms, anywhere in the world. No lag, no delays.",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description:
      "Fully responsive dashboard and mobile apps let you manage links on the go from any device.",
    color: "from-[#e6560f] to-red-500",
  },
  {
    icon: TrendingUp,
    title: "UTM Builder",
    description:
      "Built-in UTM parameter builder helps you track campaign performance across all your marketing channels.",
    color: "from-orange-600 to-[#e6560f]",
  },
  {
    icon: Lock,
    title: "Password Protection",
    description:
      "Add password protection to sensitive links. Control who can access your content.",
    color: "from-amber-600 to-orange-500",
  },
];

const highlights = [
  "No credit card required",
  "Free plan available",
  "99.9% uptime guarantee",
  "GDPR compliant",
];

export default function FeaturesPage() {
  return (
    <>
      {/* Hero Section  */}
      <section className="relative overflow-hidden pt-28 pb-20 md:pt-32 md:pb-24">
        <AnimatedBackground variant="hero" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 hover:bg-[#e6560f]/15 px-5 py-2 text-sm font-medium shadow-lg shadow-[#e6560f]/5">
              <Sparkles className="h-4 w-4 mr-2" />
              Powerful Features
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Everything You Need for{" "}
              <GradientText>Modern Link Management</GradientText>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Everything you need to create, manage, and track your links. Built
              for marketers, developers, and businesses of all sizes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 px-10 text-lg bg-linear-to-r from-[#e6560f] to-orange-500 hover:from-[#d14d0d] hover:to-orange-600 shadow-xl shadow-[#e6560f]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e6560f]/30"
              >
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg border-[#e6560f]/30 hover:bg-[#e6560f]/5 hover:border-[#e6560f]/50 transition-all duration-300"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6560f]/5 border border-[#e6560f]/15 text-sm"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#e6560f]" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid  */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#e6560f]/2 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5">
              <Rocket className="h-4 w-4 mr-2" />
              Full Feature Set
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              All the <GradientText>Tools You Need</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From basic link shortening to advanced analytics and team
              collaboration.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group bg-white dark:bg-zinc-900 border border-[#e6560f]/10 shadow-lg hover:shadow-xl hover:shadow-[#e6560f]/10 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <CardContent className="p-6 relative">
                  <HoverGradient />

                  <div
                    className={`h-14 w-14 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-[#e6560f] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section  */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5">
                <Zap className="h-4 w-4 mr-2" />
                Why Choose Us
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                More Than Just <GradientText>Link Shortening</GradientText>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We&apos;ve built a complete link management platform that grows
                with your needs. From simple short links to enterprise-grade
                analytics.
              </p>
              <div className="space-y-4">
                {[
                  "Global CDN with 99.9% uptime",
                  "Real-time analytics dashboard",
                  "Custom branded domains",
                  "Team collaboration tools",
                  "API access for developers",
                  "24/7 customer support",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full bg-[#e6560f]/10 border border-[#e6560f]/20">
                      <CheckCircle2 className="h-4 w-4 text-[#e6560f]" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-[#e6560f]/20 to-amber-400/20 rounded-3xl blur-3xl" />
              <Card className="relative border border-[#e6560f]/10 shadow-2xl bg-linear-to-br from-zinc-900 to-zinc-800 text-white overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="text-gray-400"># Shorten a URL</div>
                    <div className="text-green-400">
                      $ linkshort create https://example.com/very-long-url
                    </div>
                    <div className="text-gray-300 pl-4">
                      <span className="text-[#e6560f]">→</span>{" "}
                      https://lnk.sh/abc123
                    </div>
                    <div className="text-gray-400 mt-4"># Get analytics</div>
                    <div className="text-green-400">
                      $ linkshort stats abc123
                    </div>
                    <div className="text-gray-300 pl-4">
                      <span className="text-[#e6560f]">→</span> 1,234 clicks ·
                      45 countries
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section  */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-white dark:bg-zinc-950">
        <AnimatedBackground variant="cta" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Premium Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-[#e6560f]/10 shadow-2xl shadow-[#e6560f]/5 p-8 md:p-12 lg:p-16 relative overflow-hidden">
            <CardBackgroundDecoration />

            <div className="relative text-center">
              {/* Badge */}
              <div className="inline-block mb-8">
                <Badge className="bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-5 py-2 font-medium shadow-lg shadow-[#e6560f]/5">
                  <Rocket className="h-4 w-4 mr-2" />
                  Ready to Experience These Features?
                </Badge>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
                Start with Our <GradientText>Free Plan</GradientText> Today
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                No credit card required. Upgrade anytime as your needs grow.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-10 h-14 bg-linear-to-r from-[#e6560f] to-orange-500 hover:from-[#d14d0d] hover:to-orange-600 text-white shadow-xl shadow-[#e6560f]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e6560f]/30 border-0"
                >
                  <Link href="/register">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 h-14 border-[#e6560f]/30 hover:bg-[#e6560f]/5 hover:border-[#e6560f]/50 transition-all duration-300"
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>

              {/* Benefits */}
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                {[
                  { icon: Gift, text: "Free forever plan" },
                  { icon: CreditCard, text: "No credit card required" },
                  { icon: Shield, text: "Cancel anytime" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6560f]/5 border border-[#e6560f]/15 text-zinc-700 dark:text-zinc-300 text-sm"
                  >
                    <item.icon className="h-4 w-4 text-[#e6560f]" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
