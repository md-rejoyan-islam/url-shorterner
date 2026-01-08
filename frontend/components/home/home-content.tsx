"use client";

import {
  AnimatedBackground,
  CardBackgroundDecoration,
  GradientText,
} from "@/components/shared";
import { CountUp } from "@/components/shared/count-up";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  BarChart3,
  Clock,
  CreditCard,
  Gift,
  Link2,
  MessageSquare,
  QrCode,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const features = [
  {
    icon: Link2,
    title: "Shorten URLs Instantly",
    description:
      "Transform long URLs into clean, shareable links in seconds with our lightning-fast shortener.",
  },
  {
    icon: BarChart3,
    title: "Powerful Analytics",
    description:
      "Track clicks, locations, devices, and referrers with detailed real-time insights.",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description:
      "Automatically generate customizable QR codes for all your shortened links.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized global CDN ensures your links redirect in milliseconds.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with SSL encryption and 99.9% uptime guarantee.",
  },
  {
    icon: Clock,
    title: "Link Expiration",
    description:
      "Set custom expiration dates for your links to control access and maintain security.",
  },
];

const stats = [
  { value: "10M+", label: "Links Created" },
  { value: "500M+", label: "Clicks Tracked" },
  { value: "50K+", label: "Happy Users" },
  { value: "99.9%", label: "Uptime" },
];

const testimonials = [
  {
    quote:
      "LinkShort has transformed how we manage our marketing campaigns. The analytics are incredible!",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechCorp",
    avatar: "SJ",
  },
  {
    quote:
      "Simple, fast, and reliable. Exactly what we needed for our team's link management.",
    author: "Michael Chen",
    role: "Product Manager",
    company: "StartupXYZ",
    avatar: "MC",
  },
  {
    quote:
      "The custom domain feature has been a game-changer for our brand consistency.",
    author: "Emily Rodriguez",
    role: "Brand Manager",
    company: "MediaGroup",
    avatar: "ER",
  },
  {
    quote:
      "We've seen a 40% increase in click-through rates since switching to LinkShort.",
    author: "David Park",
    role: "Growth Lead",
    company: "ScaleUp Inc",
    avatar: "DP",
  },
  {
    quote:
      "The API integration was seamless. Our developers had it up and running in under an hour.",
    author: "Lisa Wang",
    role: "CTO",
    company: "DevFlow",
    avatar: "LW",
  },
  {
    quote:
      "Best URL shortener I've used. The QR code feature alone is worth the subscription.",
    author: "James Miller",
    role: "Digital Strategist",
    company: "Creative Agency",
    avatar: "JM",
  },
];

export function HomeContent() {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

  return (
    <>
      {/* Hero Section - Clean White with Primary Accent */}
      <section className="relative bg-white dark:bg-zinc-950 pb-20 pt-28 md:py-28 lg:py-32 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f1f1_1px,transparent_1px),linear-gradient(to_bottom,#f1f1f1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[4rem_4rem]" />

        {/* Primary Color Accent */}
        <div className="absolute top-0 right-0 w-150 h-10 bg-[#e6560f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-[#e6560f]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Trust Badge */}
            <Badge className="mb-8 bg-white dark:bg-zinc-900 text-[#e6560f] border border-[#e6560f]/20 px-4 py-2 text-sm font-medium shadow-sm">
              <Users className="h-4 w-4 mr-2" />
              Trusted by <CountUp
                value="50,000+"
                className="font-bold mx-1"
              />{" "}
              users worldwide
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
              Shorten, Share &{" "}
              <span className="text-[#e6560f]">Track Your Links</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform long URLs into powerful short links. Get detailed
              analytics, custom branding, and enterprise-grade reliability.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 h-14 bg-[#e6560f] hover:bg-[#d14d0d] text-white shadow-lg shadow-[#e6560f]/25 transition-all hover:shadow-xl hover:shadow-[#e6560f]/30 hover:-translate-y-0.5"
              >
                <Link href="/register">
                  Start for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-lg px-8 h-14 border-2 border-zinc-200 dark:border-zinc-800 hover:border-[#e6560f] hover:text-[#e6560f] bg-white dark:bg-zinc-900 transition-all"
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#e6560f]" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-[#e6560f]" />
                Free plan available
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#e6560f]" />
                Setup in 30 seconds
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#e6560f] py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <CountUp
                  value={stat.value}
                  className="block text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1"
                />
                <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-zinc-950 py-12 md:py-16 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e6560f08_1px,transparent_1px),linear-gradient(to_bottom,#e6560f08_1px,transparent_1px)] bg-size-[4rem_4rem]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#e6560f]/10 text-[#e6560f] border-0 px-4 py-1.5 font-medium">
              <Sparkles className="h-4 w-4 mr-1.5" />
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Everything You Need to{" "}
              <span className="text-[#e6560f]">Succeed</span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Powerful features designed to help you create, manage, and
              optimize your links effectively.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white dark:bg-zinc-900 shadow-background rounded-2xl p-8  hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-[#e6560f]/15"
              >
                {/* Dot Grid on Card */}
                <div className="absolute inset-0 bg-[radial-gradient(#e6560f_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.1]" />

                {/* Content */}
                <div className="relative text-center">
                  <div className="flex justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-[#e6560f]" />
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3 group-hover:text-[#e6560f] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works  */}
      <section className="bg-transparent py-12 md:py-16 relative overflow-hidden">
        {/* Animated Radial Background */}
        <div className="absolute inset-0">
          {/* Center intense gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 rounded-full bg-[#e6560f]/25 blur-2xl animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 rounded-full bg-[#e6560f]/15 blur-3xl animate-pulse" />
          {/* Outer fade gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full bg-linear-to-r from-[#e6560f]/8 via-orange-400/4 to-transparent blur-3xl animate-pulse" />

          {/* Floating orbs */}
          <div className="absolute top-20 left-[10%] w-28 h-28 rounded-full bg-[#e6560f]/5 blur-2xl animate-[pulse_4s_ease-in-out_infinite]" />
          <div className="absolute bottom-20 right-[10%] w-36 h-36 rounded-full bg-orange-400/5 blur-2xl animate-[pulse_5s_ease-in-out_infinite_0.5s]" />

          {/* Wave border rings */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-62.5 h-62.5 rounded-full border border-[#e6560f]/15 animate-[ping_3s_ease-out_infinite]"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 rounded-full border border-[#e6560f]/12 animate-[ping_3s_ease-out_infinite_0.5s]"
            style={{ animationDuration: "3.5s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-137.5 rounded-full border border-[#e6560f]/10 animate-[ping_3s_ease-out_infinite_1s]"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-175 rounded-full border border-[#e6560f]/8 animate-[ping_3s_ease-out_infinite_1.5s]"
            style={{ animationDuration: "4.5s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-212.5 h-212.5 rounded-full border border-[#e6560f]/5 animate-[ping_3s_ease-out_infinite_2s]"
            style={{ animationDuration: "5s" }}
          />
        </div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#e6560f_0.5px,transparent_0.5px)] bg-size-[24px_24px] opacity-[0.04]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white dark:bg-zinc-800 text-[#e6560f] border border-[#e6560f]/20 px-4 py-1.5 font-medium shadow-sm">
              <Zap className="h-4 w-4 mr-1.5" />
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Get Started in{" "}
              <span className="text-[#e6560f]">3 Simple Steps</span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Creating short links has never been easier. Follow these simple
              steps to get started.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Paste Your Link",
                description:
                  "Copy and paste any long URL into our shortener. We support all types of links.",
                icon: Link2,
              },
              {
                step: "02",
                title: "Customize (Optional)",
                description:
                  "Add a custom alias, set expiration dates, or password protect your link.",
                icon: Sparkles,
              },
              {
                step: "03",
                title: "Share & Track",
                description:
                  "Get your short link instantly and start tracking clicks and analytics.",
                icon: BarChart3,
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="group relative bg-white dark:bg-zinc-800 shadow-lg hover:shadow-xl border border-[#e6560f]/10 hover:border-[#e6560f]/30 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 text-center"
              >
                {/* Step Badge */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-[#e6560f] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    STEP {item.step}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-[#e6560f]/10 border border-[#e6560f]/20 flex items-center justify-center mb-6 mt-2 mx-auto group-hover:bg-[#e6560f] transition-all duration-300">
                  <item.icon className="h-7 w-7 text-[#e6560f] group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3 group-hover:text-[#e6560f] transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>

                {/* Arrow for connection (visible on md+) */}
                {index < 2 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-[#e6560f] flex items-center justify-center shadow-md">
                      <ArrowRight className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section  */}
      <section className="bg-white dark:bg-zinc-950 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-[#e6560f]/10 text-[#e6560f] border-0 px-4 py-1.5 font-medium">
              <MessageSquare className="h-4 w-4 mr-1.5" />
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Loved by <span className="text-[#e6560f]">Thousands</span> of
              Users
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              See what our customers have to say about their experience with
              LinkShort.
            </p>
          </div>

          <div className="relative">
            <Carousel
              plugins={[plugin.current]}
              className="w-full max-w-6xl mx-auto"
              opts={{
                align: "start",
                loop: true,
              }}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="ml-0">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="h-full bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-[#e6560f]/10 hover:border-[#e6560f]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#e6560f]/5 relative overflow-hidden group">
                      {/* Premium gradient overlay */}
                      <div className="absolute inset-0 bg-linear-to-br from-[#e6560f]/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Quotation mark */}
                      <div className="absolute top-4 right-4 text-[#e6560f]/10 group-hover:text-[#e6560f]/20 transition-colors">
                        <svg
                          className="h-10 w-10"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                        </svg>
                      </div>

                      {/* Content */}
                      <div className="relative">
                        {/* Stars */}
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-[#e6560f] text-[#e6560f]"
                            />
                          ))}
                        </div>

                        {/* Quote */}
                        <p className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed text-sm pr-8">
                          &ldquo;{testimonial.quote}&rdquo;
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#e6560f]/10">
                          <div className="h-10 w-10 rounded-full bg-linear-to-br from-[#e6560f] to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-zinc-900 dark:text-white text-sm">
                              {testimonial.author}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {testimonial.role} at {testimonial.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Centered Navigation Buttons - Half inside, half outside */}
              <CarouselPrevious className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2  rounded-full border-2 border-primary/20 bg-white/50 dark:bg-zinc-900 text-[#e6560f]/40 hover:text-[#e6560f] hover:border-[#e6560f] hover:bg-white shadow-lg transition-all duration-300" />
              <CarouselNext className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2  rounded-full border-2 border-primary/20 bg-white/50 dark:bg-zinc-900 text-[#e6560f]/40 hover:text-[#e6560f] hover:border-[#e6560f] hover:bg-white shadow-lg transition-all duration-300" />
            </Carousel>
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
                  Get Started Today
                </Badge>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-6 leading-tight">
                Ready to <GradientText>Supercharge</GradientText> Your Links?
              </h2>

              <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of marketers, creators, and businesses who trust
                LinkShort for their link management needs.
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
                  className="text-lg px-10 h-14 border-2 border-[#e6560f]/30 text-[#e6560f] hover:bg-[#e6560f]/5 hover:border-[#e6560f]/50 transition-all duration-300"
                >
                  <Link href="/contact">Contact Sales</Link>
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
