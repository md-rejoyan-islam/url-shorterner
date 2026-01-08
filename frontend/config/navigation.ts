import {
  LayoutDashboard,
  Link2,
  BarChart3,
  Settings,
  CreditCard,
  Users,
  FileText,
  Shield,
  Receipt,
  Layers,
  Sparkles,
  Tag,
  Info,
  Home,
  type LucideIcon,
} from "lucide-react";

export const publicNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Features", href: "/features", icon: Sparkles },
  { label: "Pricing", href: "/pricing", icon: Tag },
  { label: "About", href: "/about", icon: Info },
];

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My URLs",
    href: "/dashboard/urls",
    icon: Link2,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Subscription",
    href: "/dashboard/subscription",
    icon: CreditCard,
  },
  {
    label: "Billing",
    href: "/dashboard/billing",
    icon: Receipt,
  },
  {
    label: "Security",
    href: "/dashboard/security",
    icon: Shield,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "URLs",
    href: "/admin/urls",
    icon: Link2,
  },
  {
    label: "Plans",
    href: "/admin/plans",
    icon: Layers,
  },
  {
    label: "Subscriptions",
    href: "/admin/subscriptions",
    icon: FileText,
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: Receipt,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Shield,
  },
];
