import {
  AnimatedBackground,
  CardBackgroundDecoration,
  CountUp,
  GradientText,
  HoverGradient,
} from "@/components/shared";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CreditCard,
  Gift,
  Globe,
  Rocket,
  Shield,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about LinkShort and our mission to simplify link management",
};

const stats = [
  { value: "2019", label: "Founded" },
  { value: "50K+", label: "Active Users" },
  { value: "500M+", label: "Links Shortened" },
  { value: "99.9%", label: "Uptime" },
];

const milestones = [
  {
    year: "2019",
    title: "Company Founded",
    description: "Started with a simple idea",
  },
  {
    year: "2020",
    title: "10K Users",
    description: "Reached our first major milestone",
  },
  {
    year: "2021",
    title: "Series A",
    description: "$5M raised to expand the team",
  },
  {
    year: "2022",
    title: "Enterprise Launch",
    description: "Released business features",
  },
  {
    year: "2023",
    title: "Global Expansion",
    description: "Offices in 3 continents",
  },
  {
    year: "2024",
    title: "50K+ Users",
    description: "Growing stronger than ever",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-28 md:py-32">
        <AnimatedBackground variant="hero" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-6 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 hover:bg-[#e6560f]/15 px-5 py-2 text-sm font-medium shadow-lg shadow-[#e6560f]/5">
              <Sparkles className="h-4 w-4 mr-2" />
              Our Story
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Making Links <GradientText>Work Smarter</GradientText>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              We started LinkShort with a simple mission: to help people and
              businesses share links more effectively. Today, we&apos;re trusted
              by thousands of users worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-[#e6560f]/2 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className="bg-white dark:bg-zinc-900 border border-[#e6560f]/10 shadow-lg hover:shadow-xl hover:shadow-[#e6560f]/10 transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-[#e6560f] to-orange-500 bg-clip-text text-transparent mb-2">
                    <CountUp value={stat.value} />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5">
                <Globe className="h-4 w-4 mr-2" />
                Our Journey
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our <GradientText>Story</GradientText>
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  LinkShort was born out of frustration. As marketers and
                  developers, we were tired of clunky link management tools that
                  were either too complicated or too limited.
                </p>
                <p>
                  We set out to build something different—a platform that
                  combines powerful features with an intuitive interface. A tool
                  that scales from individual creators to enterprise teams.
                </p>
                <p>
                  Since our launch in 2019, we&apos;ve helped over 50,000 users
                  shorten more than 500 million links. And we&apos;re just
                  getting started.
                </p>
              </div>
              <Button
                asChild
                size="lg"
                className="mt-8 bg-linear-to-r from-[#e6560f] to-orange-500 hover:from-[#d14d0d] hover:to-orange-600 shadow-lg shadow-[#e6560f]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <Link href="/register">
                  Join Our Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-[#e6560f]/20 to-amber-400/20 rounded-3xl blur-3xl" />
              <Card className="relative bg-white dark:bg-zinc-900 border border-[#e6560f]/10 shadow-2xl overflow-hidden">
                <CardContent className="p-8 flex items-center justify-center min-h-75">
                  {/* Animated background inside card */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-50 h-50 rounded-full bg-[#e6560f]/10 blur-3xl animate-pulse" />
                    <div className="absolute top-0 right-0 w-37.5 h-37.5 rounded-full bg-orange-400/10 blur-2xl animate-[pulse_4s_ease-in-out_infinite]" />
                  </div>
                  <div className="relative text-center">
                    <div className="h-24 w-24 rounded-full bg-linear-to-br from-[#e6560f] to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#e6560f]/30">
                      <Rocket className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-lg font-semibold">
                      Building the future of links
                    </p>
                    <p className="text-muted-foreground">One click at a time</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-white dark:bg-zinc-950">
        <AnimatedBackground variant="section" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#e6560f]/10 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5">
              <TrendingUp className="h-4 w-4 mr-2" />
              Milestones
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <GradientText>Journey</GradientText>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Key moments that shaped who we are today.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {milestones.map((milestone) => (
                <Card
                  key={milestone.year}
                  className="group bg-white dark:bg-zinc-900 border border-[#e6560f]/10 shadow-lg hover:shadow-xl hover:shadow-[#e6560f]/10 transition-all duration-300 hover:-translate-y-2"
                >
                  <CardContent className="p-6 relative overflow-hidden">
                    <HoverGradient className="w-24 h-24" />

                    <Badge className="mb-3 bg-linear-to-r from-[#e6560f] to-orange-500 text-white border-0 shadow-lg shadow-[#e6560f]/20">
                      {milestone.year}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-[#e6560f] transition-colors">
                      {milestone.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {milestone.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section  */}
      <section className="py-20 md:py-28 relative overflow-hidden">
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
                  Join Us on Our Journey
                </Badge>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
                Be Part of <GradientText>50,000+ Users</GradientText>
              </h2>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Join thousands who trust LinkShort for their link management
                needs.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button
                  asChild
                  size="lg"
                  className="text-lg px-10 h-14 bg-linear-to-r from-[#e6560f] to-orange-500 hover:from-[#d14d0d] hover:to-orange-600 text-white shadow-xl shadow-[#e6560f]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#e6560f]/30 border-0"
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
                  className="text-lg px-10 h-14 border-[#e6560f]/30 hover:bg-[#e6560f]/5 hover:border-[#e6560f]/50 transition-all duration-300"
                >
                  <Link href="/contact">Contact Us</Link>
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
