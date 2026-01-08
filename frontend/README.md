<p align="center">
  <img src="https://img.icons8.com/fluency/96/link.png" alt="URL Shortener Logo" width="80" height="80">
</p>

<h1 align="center">URL Shortener Client</h1>

<p align="center">
  A modern, responsive web application for URL shortening with analytics dashboard, subscription management, and admin panel.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.x-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?style=flat-square&logo=redux" alt="Redux Toolkit">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License">
</p>

---

## 📑 Table of Contents

<details>
<summary>Click to expand</summary>

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Components](#-components)
- [State Management](#-state-management)
- [Styling](#-styling)
- [Form Validation](#-form-validation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

</details>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔗 URL Management

- **Create Short URLs** - Shorten any URL with optional custom alias
- **Custom Aliases** - Create memorable, branded short links
- **Link Expiration** - Set expiry dates for temporary links
- **QR Code Generation** - Generate downloadable QR codes
- **Bulk Management** - View, edit, and delete URLs

</td>
<td width="50%">

### 📊 Analytics Dashboard

- **Click Tracking** - Real-time click statistics
- **Geographic Data** - Country and city breakdown
- **Device Analytics** - Browser, OS, and device types
- **Time-based Charts** - Daily/weekly/monthly trends
- **Referrer Tracking** - Traffic source analysis

</td>
</tr>
<tr>
<td width="50%">

### 👤 User Features

- **Authentication** - Login, register, password reset
- **Email Verification** - Secure account activation
- **Profile Management** - Avatar upload, settings
- **Device Sessions** - Manage logged-in devices
- **Dark/Light Mode** - Theme preferences

</td>
<td width="50%">

### 💳 Subscription & Billing

- **Plan Selection** - Free, Basic, Pro, Enterprise
- **Stripe Payments** - Secure checkout
- **Card Management** - Save multiple cards
- **Usage Tracking** - Monitor limits
- **Billing History** - View past payments

</td>
</tr>
</table>

### 🛡️ Admin Panel

| Feature                        | Description                        |
| ------------------------------ | ---------------------------------- |
| 👥 **User Management**         | View, edit, delete users           |
| 🔗 **URL Management**          | Monitor all URLs in system         |
| 📋 **Plan Management**         | Create and edit subscription plans |
| 💰 **Payment Management**      | View payments, process refunds     |
| 📊 **Subscription Management** | Monitor user subscriptions         |

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
<br>Next.js 16
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
<br>React 19
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
<br>Tailwind 4
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=redux" width="48" height="48" alt="Redux" />
<br>RTK Query
</td>
</tr>
</table>

| Category             | Technology      | Description                     |
| :------------------- | :-------------- | :------------------------------ |
| **Framework**        | Next.js 16      | React framework with App Router |
| **Language**         | TypeScript 5    | Type-safe JavaScript            |
| **Styling**          | Tailwind CSS 4  | Utility-first CSS               |
| **State Management** | Redux Toolkit   | Global state + RTK Query        |
| **Forms**            | React Hook Form | Performant form handling        |
| **Validation**       | Zod             | Schema-based validation         |
| **UI Components**    | Radix UI        | Accessible primitives           |
| **Charts**           | Recharts        | Data visualization              |
| **Animations**       | tw-animate-css  | Tailwind animations             |
| **Notifications**    | Sonner          | Toast notifications             |
| **Icons**            | Lucide React    | Beautiful icons                 |
| **Date Handling**    | date-fns        | Date utilities                  |
| **Drag & Drop**      | dnd-kit         | Drag and drop                   |
| **Theming**          | next-themes     | Dark/Light mode                 |

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version              |
| ----------- | -------------------- |
| Node.js     | >= 18.0.0            |
| pnpm        | >= 8.0.0             |
| Backend API | Running on port 5080 |

### Installation

1️⃣ **Clone the repository**

```bash
git clone https://github.com/md-rejoyan-islam/url-shortener-client.git
cd url-shortener-client
```

2️⃣ **Install dependencies**

```bash
pnpm install
```

3️⃣ **Set up environment variables**

```bash
cp .env.example .env.local
```

4️⃣ **Start the development server**

```bash
pnpm dev
```

5️⃣ **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5080/api/v1
NEXT_PUBLIC_SHORT_URL_BASE=http://localhost:5080

# App Configuration
NEXT_PUBLIC_APP_NAME=URL Shortener
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (for client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📁 Project Structure

```
client/
├── 📂 app/                          # Next.js App Router
│   ├── 📂 (auth)/                   # Auth route group
│   │   ├── 📂 login/                # Login page
│   │   ├── 📂 register/             # Registration page
│   │   ├── 📂 forgot-password/      # Password recovery
│   │   ├── 📂 reset-password/       # Password reset
│   │   │   └── 📂 [token]/          # Token-based reset
│   │   ├── 📂 verify-email/         # Email verification
│   │   │   └── 📂 [token]/          # Token-based verify
│   │   └── layout.tsx               # Auth layout
│   │
│   ├── 📂 (public)/                 # Public route group
│   │   ├── 📂 about/                # About page
│   │   ├── 📂 contact/              # Contact page
│   │   ├── 📂 features/             # Features page
│   │   ├── 📂 pricing/              # Pricing page
│   │   ├── layout.tsx               # Public layout
│   │   └── page.tsx                 # Home page
│   │
│   ├── 📂 (authenticated)/          # Protected route group
│   │   ├── 📂 dashboard/            # User dashboard
│   │   │   ├── 📂 analytics/        # Analytics page
│   │   │   ├── 📂 billing/          # Billing page
│   │   │   ├── 📂 security/         # Security settings
│   │   │   ├── 📂 settings/         # User settings
│   │   │   ├── 📂 subscription/     # Subscription page
│   │   │   │   └── 📂 upgrade/      # Upgrade page
│   │   │   ├── 📂 urls/             # URL management
│   │   │   │   ├── 📂 new/          # Create URL
│   │   │   │   └── 📂 [id]/         # Edit URL
│   │   │   │       └── 📂 analytics/# URL analytics
│   │   │   └── page.tsx             # Dashboard home
│   │   │
│   │   ├── 📂 admin/                # Admin panel
│   │   │   ├── 📂 users/            # User management
│   │   │   │   └── 📂 [id]/         # User details
│   │   │   ├── 📂 urls/             # URL management
│   │   │   ├── 📂 plans/            # Plan management
│   │   │   │   ├── 📂 add/          # Add plan
│   │   │   │   └── 📂 [id]/         # Edit plan
│   │   │   ├── 📂 subscriptions/    # Subscription mgmt
│   │   │   ├── 📂 payments/         # Payment management
│   │   │   ├── 📂 settings/         # Admin settings
│   │   │   └── page.tsx             # Admin dashboard
│   │   └── layout.tsx               # Authenticated layout
│   │
│   ├── error.tsx                    # Error boundary
│   ├── loading.tsx                  # Loading state
│   ├── not-found.tsx                # 404 page
│   └── layout.tsx                   # Root layout
│
├── 📂 components/                   # React components
│   ├── 📂 admin/                    # Admin components
│   │   ├── admin-dashboard-content.tsx
│   │   ├── admin-users-content.tsx
│   │   ├── admin-urls-content.tsx
│   │   ├── admin-plans-content.tsx
│   │   ├── admin-payments-content.tsx
│   │   ├── admin-subscriptions-content.tsx
│   │   ├── admin-user-details-content.tsx
│   │   ├── add-plan-content.tsx
│   │   ├── edit-plan-content.tsx
│   │   └── plan-form.tsx
│   │
│   ├── 📂 analytics/                # Analytics components
│   │   ├── analytics-content.tsx
│   │   ├── analytics-chart.tsx
│   │   ├── analytics-pie-chart.tsx
│   │   └── clicks-table.tsx
│   │
│   ├── 📂 auth/                     # Auth components
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   ├── forgot-password-form.tsx
│   │   ├── reset-password-form.tsx
│   │   ├── reset-password-with-token.tsx
│   │   ├── verify-email-form.tsx
│   │   └── verify-email-with-token.tsx
│   │
│   ├── 📂 contact/                  # Contact components
│   │   └── contact-form.tsx
│   │
│   ├── 📂 dashboard/                # Dashboard components
│   │   ├── dashboard-content.tsx
│   │   ├── dashboard-chart.tsx
│   │   └── recent-links.tsx
│   │
│   ├── 📂 home/                     # Home page components
│   │   └── home-content.tsx
│   │
│   ├── 📂 layout/                   # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── sidebar.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── authenticated-header.tsx
│   │   ├── authenticated-sidebar.tsx
│   │   ├── admin-header.tsx
│   │   ├── admin-sidebar.tsx
│   │   └── dashboard-header.tsx
│   │
│   ├── 📂 payment/                  # Payment components
│   │   └── (payment related files)
│   │
│   ├── 📂 pricing/                  # Pricing components
│   │   └── pricing-content.tsx
│   │
│   ├── 📂 qr/                       # QR Code components
│   │   └── qr-code-display.tsx
│   │
│   ├── 📂 settings/                 # Settings components
│   │   ├── settings-content.tsx
│   │   ├── security-content.tsx
│   │   └── billing-content.tsx
│   │
│   ├── 📂 shared/                   # Shared components
│   │   ├── animated-background.tsx
│   │   ├── chart-card.tsx
│   │   ├── confirm-dialog.tsx
│   │   ├── count-up.tsx
│   │   ├── data-card.tsx
│   │   ├── empty-state.tsx
│   │   ├── error-state.tsx
│   │   ├── info-card.tsx
│   │   ├── loading-spinner.tsx
│   │   ├── logo.tsx
│   │   ├── page-header.tsx
│   │   ├── search-input.tsx
│   │   ├── simple-table.tsx
│   │   ├── stats-card.tsx
│   │   ├── status-badge.tsx
│   │   ├── usage-card.tsx
│   │   └── user-menu.tsx
│   │
│   ├── 📂 subscription/             # Subscription components
│   │   ├── subscription-content.tsx
│   │   └── upgrade-content.tsx
│   │
│   ├── 📂 ui/                       # UI primitives (Radix)
│   │   ├── alert.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── copy-button.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   │
│   └── 📂 urls/                     # URL components
│       ├── create-url-content.tsx
│       ├── edit-url-content.tsx
│       └── urls-list-content.tsx
│
├── 📂 config/                       # Configuration
│   └── (config files)
│
├── 📂 hooks/                        # Custom React hooks
│   ├── use-auth.ts                  # Authentication hook
│   ├── use-copy.ts                  # Copy to clipboard
│   ├── use-count-up.ts              # Animated counter
│   ├── use-debounce.ts              # Debounce hook
│   └── use-media-query.ts           # Responsive hook
│
├── 📂 lib/                          # Utility libraries
│   ├── constants.ts                 # App constants
│   ├── format.ts                    # Formatting utilities
│   ├── utils.ts                     # General utilities
│   └── 📂 validations/              # Zod schemas
│       ├── auth.ts                  # Auth validation
│       ├── contact.ts               # Contact validation
│       ├── plan.ts                  # Plan validation
│       ├── url.ts                   # URL validation
│       └── user.ts                  # User validation
│
├── 📂 public/                       # Static assets
│   └── (images, icons, etc.)
│
├── 📂 store/                        # Redux store
│   ├── index.ts                     # Store configuration
│   ├── hooks.ts                     # Typed hooks
│   ├── 📂 api/                      # RTK Query APIs
│   │   ├── base-api.ts              # Base API config
│   │   ├── auth-api.ts              # Auth endpoints
│   │   ├── url-api.ts               # URL endpoints
│   │   ├── click-api.ts             # Analytics endpoints
│   │   ├── plan-api.ts              # Plan endpoints
│   │   ├── subscription-api.ts      # Subscription endpoints
│   │   ├── payment-api.ts           # Payment endpoints
│   │   └── user-api.ts              # User endpoints
│   └── 📂 slices/                   # Redux slices
│       └── auth-slice.ts            # Auth state
│
├── 📂 types/                        # TypeScript types
│   ├── index.ts                     # Type exports
│   ├── api.ts                       # API types
│   ├── auth.ts                      # Auth types
│   ├── click.ts                     # Analytics types
│   ├── payment.ts                   # Payment types
│   ├── plan.ts                      # Plan types
│   ├── subscription.ts              # Subscription types
│   ├── url.ts                       # URL types
│   └── user.ts                      # User types
│
├── .env.example                     # Environment template
├── .env.local                       # Local environment
├── next.config.ts                   # Next.js config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json                    # TypeScript config
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## 🗺️ Pages & Routes

### Public Routes

| Route       | Page     | Description        |
| :---------- | :------- | :----------------- |
| `/`         | Home     | Landing page       |
| `/about`    | About    | About the service  |
| `/features` | Features | Feature showcase   |
| `/pricing`  | Pricing  | Subscription plans |
| `/contact`  | Contact  | Contact form       |

### Authentication Routes

| Route                     | Page            | Description           |
| :------------------------ | :-------------- | :-------------------- |
| `/login`                  | Login           | User login            |
| `/register`               | Register        | New user registration |
| `/forgot-password`        | Forgot Password | Request reset link    |
| `/reset-password/[token]` | Reset Password  | Set new password      |
| `/verify-email`           | Verify Email    | Resend verification   |
| `/verify-email/[token]`   | Verify Token    | Confirm email         |

### Dashboard Routes (Protected)

| Route                             | Page          | Description          |
| :-------------------------------- | :------------ | :------------------- |
| `/dashboard`                      | Dashboard     | Overview & stats     |
| `/dashboard/urls`                 | URLs List     | Manage short URLs    |
| `/dashboard/urls/new`             | Create URL    | Create new short URL |
| `/dashboard/urls/[id]`            | Edit URL      | Edit URL settings    |
| `/dashboard/urls/[id]/analytics`  | URL Analytics | Per-URL analytics    |
| `/dashboard/analytics`            | Analytics     | Overall analytics    |
| `/dashboard/settings`             | Settings      | User profile         |
| `/dashboard/security`             | Security      | Password & sessions  |
| `/dashboard/billing`              | Billing       | Payment methods      |
| `/dashboard/subscription`         | Subscription  | Current plan         |
| `/dashboard/subscription/upgrade` | Upgrade       | Change plan          |

### Admin Routes (Admin Only)

| Route                  | Page            | Description        |
| :--------------------- | :-------------- | :----------------- |
| `/admin`               | Admin Dashboard | Admin overview     |
| `/admin/users`         | Users           | User management    |
| `/admin/users/[id]`    | User Details    | Single user        |
| `/admin/urls`          | URLs            | All URLs in system |
| `/admin/plans`         | Plans           | Subscription plans |
| `/admin/plans/add`     | Add Plan        | Create new plan    |
| `/admin/plans/[id]`    | Edit Plan       | Edit plan          |
| `/admin/subscriptions` | Subscriptions   | All subscriptions  |
| `/admin/payments`      | Payments        | Payment history    |
| `/admin/settings`      | Settings        | Admin settings     |

---

## 🧩 Components

### Component Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Page (Route)                      │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                  Layout Component                    │
│  (Header, Sidebar, Footer)                          │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                 Content Component                    │
│  (dashboard-content, analytics-content, etc.)       │
└─────────────────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Shared     │ │     UI       │ │   Feature    │
│  Components  │ │  Components  │ │  Components  │
└──────────────┘ └──────────────┘ └──────────────┘
```

### UI Components (Radix-based)

All UI components are built on **Radix UI** primitives for accessibility:

| Component      | Description                       |
| :------------- | :-------------------------------- |
| `Button`       | Interactive buttons with variants |
| `Card`         | Content containers                |
| `Dialog`       | Modal dialogs                     |
| `DropdownMenu` | Dropdown menus                    |
| `Form`         | Form wrapper with validation      |
| `Input`        | Text inputs                       |
| `Select`       | Select dropdowns                  |
| `Table`        | Data tables                       |
| `Tabs`         | Tab navigation                    |
| `Toast`        | Notifications (Sonner)            |

### Shared Components

| Component        | Description               |
| :--------------- | :------------------------ |
| `StatsCard`      | Statistics display card   |
| `ChartCard`      | Chart container           |
| `DataCard`       | Data display card         |
| `EmptyState`     | Empty data placeholder    |
| `ErrorState`     | Error display             |
| `LoadingSpinner` | Loading indicator         |
| `PageHeader`     | Page title and breadcrumb |
| `SearchInput`    | Search with debounce      |
| `StatusBadge`    | Status indicators         |
| `ConfirmDialog`  | Confirmation modal        |
| `UserMenu`       | User dropdown menu        |

---

## 🗃️ State Management

### RTK Query APIs

The application uses **RTK Query** for data fetching and caching:

```typescript
// API Structure
store/
└── api/
    ├── base-api.ts       // Base configuration
    ├── auth-api.ts       // Authentication
    ├── url-api.ts        // URL management
    ├── click-api.ts      // Analytics
    ├── plan-api.ts       // Plans
    ├── subscription-api.ts
    ├── payment-api.ts
    └── user-api.ts
```

### API Features

| Feature                | Description                     |
| :--------------------- | :------------------------------ |
| **Auto Caching**       | Automatic response caching      |
| **Invalidation**       | Smart cache invalidation        |
| **Optimistic Updates** | Instant UI updates              |
| **Error Handling**     | Built-in error states           |
| **Loading States**     | Automatic loading tracking      |
| **Refetching**         | Auto refetch on focus/reconnect |

### Usage Example

```typescript
import { useGetUrlsQuery, useCreateUrlMutation } from "@/store/api/url-api";

function UrlList() {
  const { data, isLoading, error } = useGetUrlsQuery({ page: 1 });
  const [createUrl, { isLoading: isCreating }] = useCreateUrlMutation();

  // Render component...
}
```

### Redux Slices

| Slice       | Description               |
| :---------- | :------------------------ |
| `authSlice` | User authentication state |

---

## 🎨 Styling

### Tailwind CSS 4

The project uses **Tailwind CSS 4** with custom configuration:

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      animation: {
        // Custom animations
      }
    }
  }
}
```

### CSS Custom Properties

Theme colors use CSS variables for dark/light mode:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  /* ... */
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

### Theming

Dark/Light mode is managed by **next-themes**:

```typescript
import { useTheme } from "next-themes";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Toggle implementation...
}
```

---

## ✅ Form Validation

### Zod Schemas

All forms use **Zod** for schema validation:

```typescript
// lib/validations/url.ts
import { z } from "zod";

export const createUrlSchema = z.object({
  originalUrl: z.string().url("Please enter a valid URL"),
  customAlias: z
    .string()
    .min(3, "Alias must be at least 3 characters")
    .optional(),
  expiresAt: z.date().optional(),
});
```

### React Hook Form Integration

Forms are built with **React Hook Form** + **Zod**:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUrlSchema } from "@/lib/validations/url";

function CreateUrlForm() {
  const form = useForm({
    resolver: zodResolver(createUrlSchema),
    defaultValues: { originalUrl: "" },
  });
  // Form implementation...
}
```

### Validation Schemas

| Schema          | Location                     | Description               |
| :-------------- | :--------------------------- | :------------------------ |
| `authSchema`    | `lib/validations/auth.ts`    | Login, register, password |
| `urlSchema`     | `lib/validations/url.ts`     | URL creation/update       |
| `userSchema`    | `lib/validations/user.ts`    | User profile              |
| `planSchema`    | `lib/validations/plan.ts`    | Subscription plans        |
| `contactSchema` | `lib/validations/contact.ts` | Contact form              |

---

## 🐳 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_SHORT_URL_BASE=https://short.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 📜 Scripts

```bash
# Development
pnpm dev              # Start dev server (0.0.0.0:3000)

# Production
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors

# Type Checking
pnpm type-check       # Run TypeScript compiler
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Commit Convention

| Type       | Description        |
| :--------- | :----------------- |
| `feat`     | New feature        |
| `fix`      | Bug fix            |
| `docs`     | Documentation      |
| `style`    | Formatting         |
| `refactor` | Code restructuring |
| `test`     | Adding tests       |
| `chore`    | Maintenance        |

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 📬 Contact

<p align="center">
  <a href="https://github.com/md-rejoyan-islam">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://www.linkedin.com/in/md-rejoyan-islam/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
  <a href="https://md-rejoyan-islam.github.io">
    <img src="https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Portfolio">
  </a>
  <a href="mailto:rejoyanislam0014@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
  </a>
</p>

<p align="center">
  <b>Md Rejoyan Islam</b><br>
  Full Stack Developer
</p>

---

<p align="center">
  <sub>Built with ❤️ using Next.js, React, and Tailwind CSS</sub>
</p>

<p align="center">
  <a href="#url-shortener-client">
    <img src="https://img.shields.io/badge/⬆️_Back_to_Top-blue?style=flat-square" alt="Back to Top">
  </a>
</p>

<p align="center">
  If you find this project helpful, please consider giving it a ⭐
</p>
