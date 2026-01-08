import { Request, Response } from "express";
import { clientUrl } from "../../config/secret";
import { asyncHandler } from "../../helper/async-handler";
import { successResponse } from "../../helper/response-handler";
import Click from "../click/click.model";
import Payment from "../payment/payment.model";
import { PaymentMethod, PaymentStatus } from "../payment/payment.type";
import { seedPlansService } from "../plan/plan.service";
import Plan from "../plan/plan.model";
import Subscription from "../subscription/subscription.model";
import {
  PaymentProvider,
  SubscriptionStatus,
} from "../subscription/subscription.type";
import Url from "../url/url.model";
import User from "../user/user.model";
import { UserRole } from "../user/user.type";

// Helper function to generate random date within range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper function to generate random short ID
const generateShortId = (length: number = 6): string => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Helper function to pick random item from array
const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Users seed data (12 users)
const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "Admin@123",
    role: UserRole.ADMIN,
    isEmailVerified: true,
    isActive: true,
    urlCount: 0,
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: true,
    isActive: true,
    urlCount: 0,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: true,
    isActive: true,
    urlCount: 0,
  },
  {
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: true,
    isActive: true,
    urlCount: 0,
  },
  {
    firstName: "Emily",
    lastName: "Brown",
    email: "emily@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: true,
    isActive: true,
    urlCount: 0,
  },
  {
    firstName: "David",
    lastName: "Wilson",
    email: "david@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: true,
    isActive: true,
    urlCount: 0,
  },
  {
    firstName: "Sarah",
    lastName: "Taylor",
    email: "sarah@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: true,
    isActive: true,
    urlCount: 0,
  },
  {
    firstName: "Chris",
    lastName: "Anderson",
    email: "chris@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: true,
    isActive: true,
    urlCount: 0,
  },
  {
    firstName: "Lisa",
    lastName: "Martinez",
    email: "lisa@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: false,
    isActive: true,
    urlCount: 0,
  },
  {
    firstName: "Robert",
    lastName: "Garcia",
    email: "robert@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: true,
    isActive: false,
    urlCount: 0,
  },
  {
    firstName: "Amanda",
    lastName: "Lee",
    email: "amanda@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: true,
    isActive: true,
    urlCount: 0,
  },
  {
    firstName: "James",
    lastName: "Harris",
    email: "james@example.com",
    password: "Test@123",
    role: UserRole.USER,
    isEmailVerified: true,
    isActive: true,
    urlCount: 0,
  },
];

// URL templates for generating dynamic URLs
const urlTemplates = [
  { domain: "https://github.com", paths: ["/user/repo", "/explore", "/trending", "/marketplace"] },
  { domain: "https://twitter.com", paths: ["/home", "/explore", "/notifications", "/messages"] },
  { domain: "https://linkedin.com", paths: ["/in/profile", "/jobs", "/feed", "/mynetwork"] },
  { domain: "https://youtube.com", paths: ["/watch?v=abc123", "/channel/UCxyz", "/trending", "/feed/subscriptions"] },
  { domain: "https://medium.com", paths: ["/@author/article", "/topic/technology", "/membership", "/me/lists"] },
  { domain: "https://dev.to", paths: ["/article", "/tags/javascript", "/top/week", "/search"] },
  { domain: "https://stackoverflow.com", paths: ["/questions/12345", "/tags", "/users", "/jobs"] },
  { domain: "https://amazon.com", paths: ["/dp/B0123456", "/s?k=search", "/gp/bestsellers", "/deals"] },
  { domain: "https://netflix.com", paths: ["/browse", "/title/12345", "/search", "/latest"] },
  { domain: "https://spotify.com", paths: ["/playlist/abc", "/album/xyz", "/artist/123", "/search"] },
  { domain: "https://google.com", paths: ["/search?q=test", "/maps", "/drive", "/docs"] },
  { domain: "https://facebook.com", paths: ["/profile", "/groups", "/marketplace", "/events"] },
];

// Location data for clicks
const locations = [
  { country: "USA", city: "New York", latitude: 40.7128, longitude: -74.006 },
  { country: "USA", city: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
  { country: "USA", city: "Chicago", latitude: 41.8781, longitude: -87.6298 },
  { country: "UK", city: "London", latitude: 51.5074, longitude: -0.1278 },
  { country: "UK", city: "Manchester", latitude: 53.4808, longitude: -2.2426 },
  { country: "Germany", city: "Berlin", latitude: 52.52, longitude: 13.405 },
  { country: "Germany", city: "Munich", latitude: 48.1351, longitude: 11.582 },
  { country: "France", city: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { country: "Japan", city: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { country: "Japan", city: "Osaka", latitude: 34.6937, longitude: 135.5023 },
  { country: "India", city: "Mumbai", latitude: 19.076, longitude: 72.8777 },
  { country: "India", city: "Bangalore", latitude: 12.9716, longitude: 77.5946 },
  { country: "Canada", city: "Toronto", latitude: 43.6532, longitude: -79.3832 },
  { country: "Australia", city: "Sydney", latitude: -33.8688, longitude: 151.2093 },
  { country: "Brazil", city: "Sao Paulo", latitude: -23.5505, longitude: -46.6333 },
];

// Device data for clicks
const devices = [
  { type: "desktop" as const, os: "Windows", browser: "Chrome" },
  { type: "desktop" as const, os: "Windows", browser: "Firefox" },
  { type: "desktop" as const, os: "Windows", browser: "Edge" },
  { type: "desktop" as const, os: "macOS", browser: "Safari" },
  { type: "desktop" as const, os: "macOS", browser: "Chrome" },
  { type: "desktop" as const, os: "Linux", browser: "Firefox" },
  { type: "mobile" as const, os: "Android", browser: "Chrome" },
  { type: "mobile" as const, os: "Android", browser: "Firefox" },
  { type: "mobile" as const, os: "iOS", browser: "Safari" },
  { type: "mobile" as const, os: "iOS", browser: "Chrome" },
  { type: "tablet" as const, os: "iOS", browser: "Safari" },
  { type: "tablet" as const, os: "Android", browser: "Chrome" },
];

// Referrer sources
const referrers = [
  "https://google.com",
  "https://twitter.com",
  "https://facebook.com",
  "https://linkedin.com",
  "https://reddit.com",
  "https://email.com",
  null, // Direct traffic
];

// Generate dynamic URLs data
const generateUrlsData = (count: number) => {
  const urls = [];
  for (let i = 0; i < count; i++) {
    const template = randomItem(urlTemplates);
    const path = randomItem(template.paths);
    urls.push({
      originalUrl: `${template.domain}${path}`,
      shortId: generateShortId(6),
      clickCount: Math.floor(Math.random() * 50),
    });
  }
  return urls;
};

// Generate clicks data for URLs
const generateClicksData = (
  urlId: string,
  shortId: string,
  count: number,
  userId: string | null
) => {
  const clicks = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    clicks.push({
      url: urlId,
      user: userId,
      timestamp: randomDate(thirtyDaysAgo, now),
      location: randomItem(locations),
      device: randomItem(devices),
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      referrer: randomItem(referrers),
    });
  }
  return clicks;
};

export const seedUsers = asyncHandler(async (_req: Request, res: Response) => {
  // Delete all users data
  await User.deleteMany({});

  // Insert new data
  await User.insertMany(users);

  successResponse(res, {
    statusCode: 200,
    message: `${users.length} users seeded successfully`,
  });
});

export const seedUrls = asyncHandler(async (_req: Request, res: Response) => {
  // Delete all URLs and clicks data
  await Url.deleteMany({});
  await Click.deleteMany({});

  // Get verified users for URL ownership
  const verifiedUsers = await User.find({
    isEmailVerified: true,
    isActive: true,
    role: UserRole.USER,
  });

  if (verifiedUsers.length === 0) {
    return successResponse(res, {
      statusCode: 400,
      message: "No verified users found. Please seed users first.",
    });
  }

  // Generate 15 URLs
  const urlsData = generateUrlsData(15);
  let allClicks: ReturnType<typeof generateClicksData> = [];

  // Create URLs with user ownership
  const urlDocs = urlsData.map((url, index) => {
    const user = verifiedUsers[index % verifiedUsers.length];
    return {
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      shortUrl: `${clientUrl}/r/${url.shortId}`,
      clickCount: url.clickCount,
      user: user._id,
      isActive: true,
    };
  });

  const createdUrls = await Url.insertMany(urlDocs);

  // Generate clicks for each URL
  for (const url of createdUrls) {
    const clickCount = Math.floor(Math.random() * 20) + 1;
    const urlDoc = urlDocs.find((u) => u.shortId === url.shortId);
    const clicks = generateClicksData(
      url._id.toString(),
      url.shortId,
      clickCount,
      urlDoc?.user?.toString() || null
    );
    allClicks = allClicks.concat(clicks);

    // Update URL click count
    await Url.findByIdAndUpdate(url._id, { clickCount });
  }

  await Click.insertMany(allClicks);

  // Update user URL counts
  for (const user of verifiedUsers) {
    const urlCount = await Url.countDocuments({ user: user._id });
    await User.findByIdAndUpdate(user._id, { urlCount });
  }

  successResponse(res, {
    statusCode: 200,
    message: `${createdUrls.length} URLs and ${allClicks.length} clicks seeded successfully`,
  });
});

// Seed plans
export const seedPlans = asyncHandler(async (_req: Request, res: Response) => {
  const result = await seedPlansService();

  successResponse(res, {
    statusCode: 200,
    message: result.message,
    payload: { seeded: result.seeded },
  });
});

// Seed subscriptions
export const seedSubscriptions = asyncHandler(
  async (_req: Request, res: Response) => {
    // Delete existing subscriptions
    await Subscription.deleteMany({});

    // Get users and plans
    const verifiedUsers = await User.find({
      isEmailVerified: true,
      isActive: true,
      role: UserRole.USER,
    });

    const plans = await Plan.find({ isActive: true });

    if (verifiedUsers.length === 0 || plans.length === 0) {
      return successResponse(res, {
        statusCode: 400,
        message: "No verified users or plans found. Please seed users and plans first.",
      });
    }

    const freePlan = plans.find((p) => p.slug === "free");
    const basicPlan = plans.find((p) => p.slug === "basic");
    const proPlan = plans.find((p) => p.slug === "pro");
    const enterprisePlan = plans.find((p) => p.slug === "enterprise");

    const now = new Date();
    const subscriptions = [];

    // Assign subscriptions to users
    for (let i = 0; i < verifiedUsers.length; i++) {
      const user = verifiedUsers[i];
      let plan;
      let status = SubscriptionStatus.ACTIVE;
      const billingCycle = randomItem(["monthly", "yearly"] as const);

      // Distribute plans: 40% free, 30% basic, 20% pro, 10% enterprise
      const rand = Math.random();
      if (rand < 0.4) {
        plan = freePlan;
      } else if (rand < 0.7) {
        plan = basicPlan;
      } else if (rand < 0.9) {
        plan = proPlan;
      } else {
        plan = enterprisePlan;
      }

      if (!plan) continue;

      // Some subscriptions have different statuses
      if (i % 7 === 0) status = SubscriptionStatus.CANCELLED;
      if (i % 11 === 0) status = SubscriptionStatus.EXPIRED;

      const periodStart = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const periodEnd = new Date(
        periodStart.getTime() +
          (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
      );

      subscriptions.push({
        user: user._id,
        plan: plan._id,
        status,
        billingCycle,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: status === SubscriptionStatus.CANCELLED,
        cancelledAt: status === SubscriptionStatus.CANCELLED ? now : null,
        paymentProvider:
          plan.slug === "free" ? null : PaymentProvider.STRIPE,
        externalSubscriptionId:
          plan.slug === "free" ? null : `sub_${generateShortId(14)}`,
      });

      // Update user with current plan and subscription reference
      await User.findByIdAndUpdate(user._id, { currentPlan: plan._id });
    }

    const createdSubscriptions = await Subscription.insertMany(subscriptions);

    // Update users with subscription references
    for (const sub of createdSubscriptions) {
      await User.findByIdAndUpdate(sub.user, { subscription: sub._id });
    }

    successResponse(res, {
      statusCode: 200,
      message: `${createdSubscriptions.length} subscriptions seeded successfully`,
    });
  }
);

// Seed payments
export const seedPayments = asyncHandler(async (_req: Request, res: Response) => {
  // Delete existing payments
  await Payment.deleteMany({});

  // Get subscriptions with populated data
  const subscriptions = await Subscription.find({
    paymentProvider: PaymentProvider.STRIPE,
  })
    .populate("user")
    .populate("plan");

  if (subscriptions.length === 0) {
    return successResponse(res, {
      statusCode: 400,
      message: "No paid subscriptions found. Please seed subscriptions first.",
    });
  }

  const payments = [];
  const now = new Date();

  for (const subscription of subscriptions) {
    const plan = subscription.plan as any;
    const billingCycle = subscription.billingCycle as "monthly" | "yearly";
    const amount =
      billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;

    // Generate 1-3 payments per subscription
    const paymentCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < paymentCount; i++) {
      const paymentDate = new Date(
        now.getTime() - i * (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
      );

      // Most payments succeed
      let status = PaymentStatus.SUCCEEDED;
      if (Math.random() < 0.1) status = PaymentStatus.FAILED;
      if (Math.random() < 0.05) status = PaymentStatus.REFUNDED;

      payments.push({
        user: subscription.user,
        plan: subscription.plan,
        subscription: subscription._id,
        amount: amount * 100, // Convert to cents
        currency: "usd",
        status,
        paymentMethod: PaymentMethod.CARD,
        stripePaymentIntentId: `pi_${generateShortId(24)}`,
        stripeCustomerId: `cus_${generateShortId(14)}`,
        stripePaymentMethodId: `pm_${generateShortId(24)}`,
        billingCycle,
        description: `${plan.name} plan - ${billingCycle} subscription`,
        failureReason: status === PaymentStatus.FAILED ? "Card declined" : undefined,
        refundedAt: status === PaymentStatus.REFUNDED ? now : undefined,
        createdAt: paymentDate,
        updatedAt: paymentDate,
      });
    }
  }

  await Payment.insertMany(payments);

  successResponse(res, {
    statusCode: 200,
    message: `${payments.length} payments seeded successfully`,
  });
});

// Seed all data
export const seedAll = asyncHandler(async (_req: Request, res: Response) => {
  // Seed plans first
  await seedPlansService();
  const plans = await Plan.find({ isActive: true });

  // Delete existing data
  await User.deleteMany({});
  await Url.deleteMany({});
  await Click.deleteMany({});
  await Subscription.deleteMany({});
  await Payment.deleteMany({});

  // Insert users
  await User.insertMany(users);

  // Get verified users for URL ownership
  const verifiedUsers = await User.find({
    isEmailVerified: true,
    isActive: true,
    role: UserRole.USER,
  });

  // Generate and insert URLs
  const urlsData = generateUrlsData(15);
  let allClicks: ReturnType<typeof generateClicksData> = [];

  const urlDocs = urlsData.map((url, index) => {
    const user = verifiedUsers[index % verifiedUsers.length];
    return {
      originalUrl: url.originalUrl,
      shortId: url.shortId,
      shortUrl: `${clientUrl}/r/${url.shortId}`,
      clickCount: 0,
      user: user._id,
      isActive: true,
    };
  });

  const createdUrls = await Url.insertMany(urlDocs);

  // Generate clicks for each URL
  for (const url of createdUrls) {
    const clickCount = Math.floor(Math.random() * 20) + 1;
    const urlDoc = urlDocs.find((u) => u.shortId === url.shortId);
    const clicks = generateClicksData(
      url._id.toString(),
      url.shortId,
      clickCount,
      urlDoc?.user?.toString() || null
    );
    allClicks = allClicks.concat(clicks);

    // Update URL click count
    await Url.findByIdAndUpdate(url._id, { clickCount });
  }

  await Click.insertMany(allClicks);

  // Update user URL counts
  for (const user of verifiedUsers) {
    const urlCount = await Url.countDocuments({ user: user._id });
    await User.findByIdAndUpdate(user._id, { urlCount });
  }

  // Create subscriptions
  const freePlan = plans.find((p) => p.slug === "free");
  const basicPlan = plans.find((p) => p.slug === "basic");
  const proPlan = plans.find((p) => p.slug === "pro");
  const enterprisePlan = plans.find((p) => p.slug === "enterprise");

  const now = new Date();
  const subscriptions = [];

  for (let i = 0; i < verifiedUsers.length; i++) {
    const user = verifiedUsers[i];
    let plan;
    let status = SubscriptionStatus.ACTIVE;
    const billingCycle = randomItem(["monthly", "yearly"] as const);

    const rand = Math.random();
    if (rand < 0.4) {
      plan = freePlan;
    } else if (rand < 0.7) {
      plan = basicPlan;
    } else if (rand < 0.9) {
      plan = proPlan;
    } else {
      plan = enterprisePlan;
    }

    if (!plan) continue;

    if (i % 7 === 0) status = SubscriptionStatus.CANCELLED;
    if (i % 11 === 0) status = SubscriptionStatus.EXPIRED;

    const periodStart = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const periodEnd = new Date(
      periodStart.getTime() +
        (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
    );

    subscriptions.push({
      user: user._id,
      plan: plan._id,
      status,
      billingCycle,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: status === SubscriptionStatus.CANCELLED,
      cancelledAt: status === SubscriptionStatus.CANCELLED ? now : null,
      paymentProvider: plan.slug === "free" ? null : PaymentProvider.STRIPE,
      externalSubscriptionId:
        plan.slug === "free" ? null : `sub_${generateShortId(14)}`,
    });

    await User.findByIdAndUpdate(user._id, { currentPlan: plan._id });
  }

  const createdSubscriptions = await Subscription.insertMany(subscriptions);

  for (const sub of createdSubscriptions) {
    await User.findByIdAndUpdate(sub.user, { subscription: sub._id });
  }

  // Create payments for paid subscriptions
  const paidSubscriptions = createdSubscriptions.filter(
    (s) => s.paymentProvider === PaymentProvider.STRIPE
  );

  const payments = [];

  for (const subscription of paidSubscriptions) {
    const plan = plans.find((p) => p._id.toString() === subscription.plan.toString());
    if (!plan) continue;

    const billingCycle = subscription.billingCycle as "monthly" | "yearly";
    const amount =
      billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;

    const paymentCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < paymentCount; i++) {
      const paymentDate = new Date(
        now.getTime() - i * (billingCycle === "monthly" ? 30 : 365) * 24 * 60 * 60 * 1000
      );

      let status = PaymentStatus.SUCCEEDED;
      if (Math.random() < 0.1) status = PaymentStatus.FAILED;
      if (Math.random() < 0.05) status = PaymentStatus.REFUNDED;

      payments.push({
        user: subscription.user,
        plan: subscription.plan,
        subscription: subscription._id,
        amount: amount * 100,
        currency: "usd",
        status,
        paymentMethod: PaymentMethod.CARD,
        stripePaymentIntentId: `pi_${generateShortId(24)}`,
        stripeCustomerId: `cus_${generateShortId(14)}`,
        stripePaymentMethodId: `pm_${generateShortId(24)}`,
        billingCycle,
        description: `${plan.name} plan - ${billingCycle} subscription`,
        failureReason: status === PaymentStatus.FAILED ? "Card declined" : undefined,
        refundedAt: status === PaymentStatus.REFUNDED ? now : undefined,
        createdAt: paymentDate,
        updatedAt: paymentDate,
      });
    }
  }

  await Payment.insertMany(payments);

  successResponse(res, {
    statusCode: 200,
    message: "All data seeded successfully",
    payload: {
      users: users.length,
      urls: createdUrls.length,
      clicks: allClicks.length,
      subscriptions: createdSubscriptions.length,
      payments: payments.length,
    },
  });
});
