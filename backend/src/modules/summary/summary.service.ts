import createError from "http-errors";
import Click from "../click/click.model";
import Payment from "../payment/payment.model";
import { PaymentStatus } from "../payment/payment.type";
import { revokeAllUserTokensService } from "../refresh-token/refresh-token.service";
import Subscription from "../subscription/subscription.model";
import { SubscriptionStatus } from "../subscription/subscription.type";
import Url from "../url/url.model";
import User from "../user/user.model";
import { UserRole } from "../user/user.type";

// Get start of today
const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

// Get admin dashboard stats
export const getAdminStatsService = async () => {
  const startOfToday = getStartOfToday();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Run all queries in parallel for performance
  const [
    totalUsers,
    totalUrls,
    totalClicks,
    newUsersToday,
    newUrlsToday,
    clicksToday,
    activeSubscriptions,
    successfulPayments,
    recentClicksData,
  ] = await Promise.all([
    // Total counts
    User.countDocuments(),
    Url.countDocuments(),
    Click.countDocuments(),

    // Today's counts
    User.countDocuments({ createdAt: { $gte: startOfToday } }),
    Url.countDocuments({ createdAt: { $gte: startOfToday } }),
    Click.countDocuments({ timestamp: { $gte: startOfToday } }),

    // Active subscriptions
    Subscription.countDocuments({ status: SubscriptionStatus.ACTIVE }),

    // Total revenue (sum of successful payments)
    Payment.aggregate([
      { $match: { status: PaymentStatus.SUCCEEDED } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),

    // Recent clicks for chart (last 30 days, grouped by date)
    Click.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: "$_id",
          clicks: "$count",
          _id: 0,
        },
      },
    ]),
  ]);

  // Calculate total revenue (amount is in cents, convert to dollars)
  const totalRevenue =
    successfulPayments.length > 0 ? successfulPayments[0].total / 100 : 0;

  // Fill in missing dates for the chart (last 30 days)
  const recentClicks: { date: string; clicks: number }[] = [];
  const clicksMap = new Map(
    recentClicksData.map((item: { date: string; clicks: number }) => [
      item.date,
      item.clicks,
    ])
  );

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    recentClicks.push({
      date: dateStr,
      clicks: (clicksMap.get(dateStr) as number) || 0,
    });
  }

  return {
    totalUsers,
    totalUrls,
    totalClicks,
    totalRevenue,
    newUsersToday,
    newUrlsToday,
    clicksToday,
    activeSubscriptions,
    recentClicks,
  };
};

// Get admin users with stats
export const getAdminUsersService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}) => {
  const { page = 1, limit = 10, search, role, isActive } = query;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: {
    $or?: Array<
      | { firstName?: { $regex: string; $options: string } }
      | { lastName?: { $regex: string; $options: string } }
      | { email?: { $regex: string; $options: string } }
    >;
    role?: string;
    isActive?: boolean;
  } = {};

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .populate("currentPlan")
      .populate("subscription")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get admin URLs with stats
export const getAdminUrlsService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}) => {
  const { page = 1, limit = 10, search, isActive } = query;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: {
    $or?: Array<
      | { shortId?: { $regex: string; $options: string } }
      | { originalUrl?: { $regex: string; $options: string } }
    >;
    isActive?: boolean;
  } = {};

  if (search) {
    filter.$or = [
      { shortId: { $regex: search, $options: "i" } },
      { originalUrl: { $regex: search, $options: "i" } },
    ];
  }

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  const [urls, total, totalUrls, activeUrls, totalClicks] = await Promise.all([
    Url.find(filter)
      .populate("user", "firstName lastName email")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Url.countDocuments(filter),
    Url.countDocuments(),
    Url.countDocuments({ isActive: true }),
    Click.countDocuments(),
  ]);

  return {
    urls,
    total,
    stats: {
      totalUrls,
      activeUrls,
      totalClicks,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get admin subscriptions
export const getAdminSubscriptionsService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: { status?: string } = {};

  if (status) {
    filter.status = status;
  }

  const [subscriptions, total] = await Promise.all([
    Subscription.find(filter)
      .populate("user", "firstName lastName email")
      .populate("plan", "name price")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Subscription.countDocuments(filter),
  ]);

  return {
    subscriptions,
    total,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get admin payments
export const getAdminPaymentsService = async (query: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: { status?: string } = {};

  if (status) {
    filter.status = status;
  }

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate("user", "firstName lastName email")
      .populate("plan", "name price")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Payment.countDocuments(filter),
  ]);

  return {
    payments,
    total,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single user details with all related data (admin)
export const getUserDetailsService = async (userId: string) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Get user with populated fields
  const user = await User.findById(userId)
    .select("-password")
    .populate("currentPlan")
    .populate("subscription");

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Get user's URLs
  const urls = await Url.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20);

  // Get URL IDs for click queries
  const urlIds = urls.map((url) => url._id);

  // Get user's total clicks and recent click data
  const [totalClicks, recentClicksData, payments, subscription] =
    await Promise.all([
      // Total clicks across all user's URLs
      Click.countDocuments({ url: { $in: urlIds } }),

      // Recent clicks for chart (last 30 days)
      Click.aggregate([
        {
          $match: {
            url: { $in: urlIds },
            timestamp: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            date: "$_id",
            clicks: "$count",
            _id: 0,
          },
        },
      ]),

      // User's payments
      Payment.find({ user: userId })
        .populate("plan", "name price")
        .sort({ createdAt: -1 })
        .limit(10),

      // User's active subscription
      Subscription.findOne({
        user: userId,
        status: SubscriptionStatus.ACTIVE,
      }).populate("plan"),
    ]);

  // Fill in missing dates for the chart (last 30 days)
  const recentClicks: { date: string; clicks: number }[] = [];
  const clicksMap = new Map(
    recentClicksData.map((item: { date: string; clicks: number }) => [
      item.date,
      item.clicks,
    ])
  );

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    recentClicks.push({
      date: dateStr,
      clicks: (clicksMap.get(dateStr) as number) || 0,
    });
  }

  // Calculate stats
  const totalUrls = urls.length;
  const activeUrls = urls.filter((url) => url.isActive).length;

  return {
    user,
    urls,
    stats: {
      totalUrls,
      activeUrls,
      totalClicks,
      recentClicks,
    },
    subscription,
    payments,
  };
};

// Update user (admin)
export const updateUserService = async (
  userId: string,
  updateData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: UserRole;
    isActive?: boolean;
    isEmailVerified?: boolean;
    avatar?: string;
  }
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Check if email is being changed and if it's already taken
  if (updateData.email && updateData.email !== user.email) {
    const emailExists = await User.isEmailTaken(updateData.email, userId);
    if (emailExists) {
      throw createError.Conflict("Email already in use");
    }
  }

  // Update fields
  Object.assign(user, updateData);
  await user.save();

  return user;
};

// Delete user (admin)
export const deleteUserService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw createError.NotFound("User not found");
  }

  // Revoke all refresh tokens
  await revokeAllUserTokensService(userId);

  // Hard delete
  await User.findByIdAndDelete(userId);

  return { message: "User deleted successfully" };
};

// Update URL (admin)
export const updateUrlService = async (
  urlId: string,
  updateData: {
    isActive?: boolean;
    expiresAt?: Date | null;
  }
) => {
  const url = await Url.findById(urlId);

  if (!url) {
    throw createError.NotFound("URL not found");
  }

  Object.assign(url, updateData);
  await url.save();

  return url;
};

// Delete URL (admin)
export const deleteUrlService = async (urlId: string) => {
  const url = await Url.findById(urlId);

  if (!url) {
    throw createError.NotFound("URL not found");
  }

  // Delete all clicks associated with this URL
  await Click.deleteMany({ url: urlId });

  // Delete the URL
  await Url.findByIdAndDelete(urlId);

  // Decrement user's URL count if user exists
  if (url.user) {
    await User.findByIdAndUpdate(url.user, { $inc: { urlCount: -1 } });
  }

  return { message: "URL deleted successfully" };
};
