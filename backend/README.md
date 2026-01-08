<p align="center">
  <img src="https://img.icons8.com/fluency/96/link.png" alt="URL Shortener Logo" width="80" height="80">
</p>

<h1 align="center">URL Shortener API</h1>

<p align="center">
  A production-ready, scalable URL shortening service with analytics, subscriptions, and payment processing.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-documentation">API Docs</a> •
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square&logo=node.js" alt="Node Version">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Express-5.x-lightgrey?style=flat-square&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-6.0+-green?style=flat-square&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Redis-6.0+-red?style=flat-square&logo=redis" alt="Redis">
  <img src="https://img.shields.io/badge/License-ISC-yellow?style=flat-square" alt="License">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  <img src="https://img.shields.io/badge/Stripe-Integrated-blueviolet?style=flat-square&logo=stripe" alt="Stripe">
  <img src="https://img.shields.io/badge/API-RESTful-orange?style=flat-square" alt="REST API">
</p>

---

## 📑 Table of Contents

<details>
<summary>Click to expand</summary>

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Database Schema](#-database-schema)
- [Caching](#-caching)
- [Logging](#-logging)
- [Error Handling](#-error-handling)
- [Security](#-security)
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

### 🔗 Core Features

- **URL Shortening** - Convert long URLs into short, memorable links
- **Custom Aliases** - Create branded short URLs with custom codes
- **Analytics Dashboard** - Track clicks, locations, devices, browsers
- **Link Expiration** - Set expiration dates for temporary links
- **QR Code Support** - Generate QR codes for shortened URLs

</td>
<td width="50%">

### 👤 User Management

- **JWT Authentication** - Secure token-based auth with refresh tokens
- **Email Verification** - Email-based account verification
- **Password Recovery** - Forgot password and reset functionality
- **Multi-device Sessions** - Track and manage logged-in devices
- **Avatar Upload** - User profile picture management

</td>
</tr>
<tr>
<td width="50%">

### 💳 Subscription & Payments

- **Subscription Plans** - Free, Basic, Pro, and Enterprise tiers
- **Stripe Integration** - Secure payment processing
- **Card Management** - Save and manage payment methods
- **Billing History** - Complete payment history and invoices

</td>
<td width="50%">

### 🛡️ Admin Features

- **User Management** - Full CRUD operations for accounts
- **URL Management** - Monitor and manage all URLs
- **Subscription Control** - Manage user subscriptions
- **Payment Administration** - View payments and refunds

</td>
</tr>
</table>

### ⚡ Performance & Reliability

| Feature                   | Description                                |
| ------------------------- | ------------------------------------------ |
| 🚀 **Redis Caching**      | High-performance caching for URL redirects |
| 🛑 **Rate Limiting**      | Protection against abuse and DDoS attacks  |
| ✅ **Request Validation** | Comprehensive input validation with Zod    |
| 📝 **Structured Logging** | Winston-based logging with daily rotation  |
| 📊 **Metrics**            | Prometheus metrics for monitoring          |

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48" alt="Node.js" />
<br>Node.js
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=express" width="48" height="48" alt="Express" />
<br>Express
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
<br>TypeScript
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=mongodb" width="48" height="48" alt="MongoDB" />
<br>MongoDB
</td>
<td align="center" width="96">
<img src="https://skillicons.dev/icons?i=redis" width="48" height="48" alt="Redis" />
<br>Redis
</td>
<td align="center" width="96">
<img src="https://img.icons8.com/color/48/stripe.png" width="48" height="48" alt="Stripe" />
<br>Stripe
</td>
</tr>
</table>

| Category            | Technology                |
| :------------------ | :------------------------ |
| **Runtime**         | Node.js 18+               |
| **Framework**       | Express.js 5.x            |
| **Language**        | TypeScript 5.x            |
| **Database**        | MongoDB with Mongoose 9.x |
| **Caching**         | Redis 5.x                 |
| **Authentication**  | JWT (jsonwebtoken)        |
| **Validation**      | Zod 4.x                   |
| **Payments**        | Stripe                    |
| **Email**           | Nodemailer                |
| **Logging**         | Winston                   |
| **Documentation**   | OpenAPI 3.1 / Swagger UI  |
| **Package Manager** | pnpm                      |

---

## 🏗️ Architecture

The application follows a **modular architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Request                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Express Middleware                      │
│  (CORS, Rate Limiting, Auth, Validation, Error Handling)    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Routes                              │
│    (Auth, URLs, Analytics, Plans, Subscriptions, Payments)  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Controllers                           │
│              (Request handling & Response)                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Services                             │
│                  (Business Logic Layer)                     │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│     MongoDB      │ │    Redis     │ │   Stripe     │
│   (Mongoose)     │ │   (Cache)    │ │  (Payments)  │
└──────────────────┘ └──────────────┘ └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement    | Version      |
| -------------- | ------------ |
| Node.js        | >= 18.0.0    |
| pnpm           | >= 8.0.0     |
| MongoDB        | >= 6.0       |
| Redis          | >= 6.0       |
| Stripe Account | For payments |

### Installation

1️⃣ **Clone the repository**

```bash
git clone https://github.com/md-rejoyan-islam/url-shortener-backend.git
cd url-shortener-backend
```

2️⃣ **Install dependencies**

```bash
pnpm install
```

3️⃣ **Set up environment variables**

```bash
cp .env.example .env
```

4️⃣ **Start MongoDB and Redis**

```bash
# Using Docker
docker-compose up -d mongodb redis

# Or start services manually
mongod --dbpath /path/to/data
redis-server
```

5️⃣ **Seed the database (optional)**

```bash
# Seed subscription plans
curl -X POST http://localhost:5080/api/v1/plans/seed
```

6️⃣ **Start the development server**

```bash
pnpm dev
```

7️⃣ **Access the API**

| Service         | URL                            |
| --------------- | ------------------------------ |
| 🌐 API          | http://localhost:5080          |
| 📚 Swagger Docs | http://localhost:5080/api-docs |
| 💚 Health Check | http://localhost:5080/health   |
| 📊 Metrics      | http://localhost:5080/metrics  |

### Environment Variables

Create a `.env` file in the root directory with the following variables:

<details>
<summary>📋 Click to view all environment variables</summary>

```env
# ═══════════════════════════════════════════════════════════════
# Server Configuration
# ═══════════════════════════════════════════════════════════════
NODE_ENV=development
PORT=5080
API_VERSION=v1

# ═══════════════════════════════════════════════════════════════
# Database Configuration
# ═══════════════════════════════════════════════════════════════
MONGO_URI=mongodb://localhost:27017/url-shortener
REDIS_URL=redis://localhost:6379

# ═══════════════════════════════════════════════════════════════
# JWT Configuration
# ═══════════════════════════════════════════════════════════════
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
REFRESH_TOKEN_EXPIRY=7d

# ═══════════════════════════════════════════════════════════════
# Email Configuration (SMTP)
# ═══════════════════════════════════════════════════════════════
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@yourdomain.com

# ═══════════════════════════════════════════════════════════════
# Stripe Configuration
# ═══════════════════════════════════════════════════════════════
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ═══════════════════════════════════════════════════════════════
# URLs
# ═══════════════════════════════════════════════════════════════
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:5080
SHORT_URL_BASE=http://localhost:5080

# ═══════════════════════════════════════════════════════════════
# CORS
# ═══════════════════════════════════════════════════════════════
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

</details>

---

## 📚 API Documentation

Full API documentation is available via **Swagger UI** at `/api-docs` when the server is running.

> 📄 The OpenAPI 3.1 specification file is located at `docs/openapi.yaml`

### Quick API Overview

| Module               | Endpoints | Description                            |
| :------------------- | :-------: | :------------------------------------- |
| 🔐 **Auth**          |    17     | Authentication, user profile, sessions |
| 🔗 **URLs**          |     8     | URL CRUD, admin management             |
| 📊 **Analytics**     |     3     | Click tracking, statistics             |
| 📋 **Plans**         |     8     | Subscription plans                     |
| 💳 **Subscriptions** |     8     | User subscriptions                     |
| 💰 **Payments**      |    12     | Stripe payments, cards                 |
| 👥 **Users**         |     5     | Admin user management                  |
| ↪️ **Redirect**      |     1     | Short URL redirection                  |

**Total: 62 API Endpoints**

---

## 📁 Project Structure

```
server/
├── 📂 docs/
│   └── openapi.yaml              # OpenAPI 3.1 specification
├── 📂 src/
│   ├── 📂 app/
│   │   ├── app.ts                # Express app configuration
│   │   ├── routes.ts             # Route aggregation
│   │   └── express.d.ts          # Express type extensions
│   ├── 📂 config/
│   │   ├── cors-options.ts       # CORS configuration
│   │   ├── db.ts                 # MongoDB connection
│   │   ├── rate-limiter.ts       # Rate limiting setup
│   │   ├── redis.ts              # Redis client
│   │   ├── secret.ts             # Environment variables
│   │   └── stripe.ts             # Stripe configuration
│   ├── 📂 helper/
│   │   ├── async-handler.ts      # Async error wrapper
│   │   ├── cache.ts              # Redis cache utilities
│   │   ├── create-jwt.ts         # JWT creation
│   │   ├── jwt-verify.ts         # JWT verification
│   │   ├── logger.ts             # Winston logger
│   │   ├── multer.ts             # File upload config
│   │   ├── random-id.ts          # ID generation
│   │   ├── response-handler.ts   # Standardized responses
│   │   └── token.util.ts         # Token utilities
│   ├── 📂 mails/
│   │   ├── mail-template.ts      # Email sender
│   │   └── 📂 templates/         # Email HTML templates
│   ├── 📂 middlewares/
│   │   ├── authorized.ts         # Role-based authorization
│   │   ├── error-handler.ts      # Global error handler
│   │   ├── validate.ts           # Zod validation middleware
│   │   └── verify.ts             # JWT verification middleware
│   ├── 📂 modules/
│   │   ├── 📂 auth/              # Authentication module
│   │   ├── 📂 click/             # Analytics module
│   │   ├── 📂 payment/           # Payment module
│   │   ├── 📂 plan/              # Subscription plans
│   │   ├── 📂 redirect/          # URL redirection
│   │   ├── 📂 refresh-token/     # Token management
│   │   ├── 📂 seeds/             # Database seeders
│   │   ├── 📂 subscription/      # User subscriptions
│   │   ├── 📂 summary/           # Dashboard summaries
│   │   ├── 📂 url/               # URL management
│   │   └── 📂 user/              # User management (admin)
│   ├── 📂 public/
│   │   └── 📂 avatars/           # User avatar storage
│   └── server.ts                 # Application entry point
├── .env.example                  # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

### Module Structure

Each module follows a consistent pattern:

```
📂 module-name/
├── module-name.controller.ts     # Request handlers
├── module-name.service.ts        # Business logic
├── module-name.model.ts          # Mongoose schema
├── module-name.route.ts          # Express routes
├── module-name.validation.ts     # Zod schemas
└── module-name.type.ts           # TypeScript interfaces
```

---

## 🔌 API Endpoints

<details>
<summary><b>🔐 Authentication</b> <code>/api/v1/auth</code></summary>

|  Method  | Endpoint               | Description               | Auth |
| :------: | :--------------------- | :------------------------ | :--: |
|  `POST`  | `/register`            | Register new user         |  -   |
|  `POST`  | `/login`               | User login                |  -   |
|  `POST`  | `/refresh-token`       | Refresh access token      |  -   |
|  `POST`  | `/verify-email`        | Verify email address      |  -   |
|  `POST`  | `/resend-verification` | Resend verification email |  -   |
|  `POST`  | `/forgot-password`     | Request password reset    |  -   |
|  `POST`  | `/reset-password`      | Reset password            |  -   |
|  `GET`   | `/me`                  | Get current user          |  ✅  |
|  `PUT`   | `/me`                  | Update current user       |  ✅  |
| `DELETE` | `/me`                  | Delete account            |  ✅  |
|  `GET`   | `/me/usage`            | Get usage statistics      |  ✅  |
|  `POST`  | `/me/avatar`           | Upload avatar             |  ✅  |
|  `POST`  | `/logout`              | Logout user               |  -   |
|  `POST`  | `/logout-all`          | Logout all devices        |  ✅  |
|  `PUT`   | `/change-password`     | Change password           |  ✅  |
|  `GET`   | `/devices`             | Get logged-in devices     |  ✅  |
| `DELETE` | `/devices/:id`         | Logout specific device    |  ✅  |

</details>

<details>
<summary><b>🔗 URLs</b> <code>/api/v1/urls</code></summary>

|  Method  | Endpoint     | Description            | Auth |
| :------: | :----------- | :--------------------- | :--: |
|  `GET`   | `/`          | Get user's URLs        |  ✅  |
|  `POST`  | `/`          | Create short URL       |  ✅  |
|  `GET`   | `/summary`   | Get URL summary        |  ✅  |
|  `GET`   | `/:id`       | Get URL by ID          |  ✅  |
| `PATCH`  | `/:id`       | Update URL             |  ✅  |
| `DELETE` | `/:id`       | Delete URL             |  ✅  |
|  `GET`   | `/admin/all` | Get all URLs (Admin)   |  🔒  |
| `DELETE` | `/admin/:id` | Delete any URL (Admin) |  🔒  |

</details>

<details>
<summary><b>📊 Analytics</b> <code>/api/v1/clicks</code></summary>

| Method | Endpoint            | Description        | Auth |
| :----: | :------------------ | :----------------- | :--: |
| `GET`  | `/analytics`        | Get user analytics |  ✅  |
| `GET`  | `/analytics/:urlId` | Get URL analytics  |  ✅  |
| `GET`  | `/url/:urlId`       | Get URL clicks     |  ✅  |

</details>

<details>
<summary><b>📋 Plans</b> <code>/api/v1/plans</code></summary>

|  Method  | Endpoint      | Description           | Auth |
| :------: | :------------ | :-------------------- | :--: |
|  `GET`   | `/`           | Get all plans         |  -   |
|  `GET`   | `/default`    | Get default plan      |  -   |
|  `GET`   | `/slug/:slug` | Get plan by slug      |  -   |
|  `POST`  | `/`           | Create plan           |  🔒  |
|  `POST`  | `/seed`       | Seed plans            |  🔒  |
|  `GET`   | `/admin`      | Get all plans (Admin) |  🔒  |
|  `PUT`   | `/:id`        | Update plan           |  🔒  |
| `DELETE` | `/:id`        | Delete plan           |  🔒  |

</details>

<details>
<summary><b>💳 Subscriptions</b> <code>/api/v1/subscriptions</code></summary>

| Method | Endpoint        | Description              | Auth |
| :----: | :-------------- | :----------------------- | :--: |
| `GET`  | `/me`           | Get my subscription      |  ✅  |
| `GET`  | `/me/history`   | Get subscription history |  ✅  |
| `POST` | `/`             | Subscribe to plan        |  ✅  |
| `POST` | `/cancel`       | Cancel subscription      |  ✅  |
| `POST` | `/change-plan`  | Change plan              |  ✅  |
| `GET`  | `/admin`        | Get all subscriptions    |  🔒  |
| `PUT`  | `/:id`          | Update subscription      |  🔒  |
| `POST` | `/expire-check` | Check expirations        |  🔒  |

</details>

<details>
<summary><b>💰 Payments</b> <code>/api/v1/payments</code></summary>

|  Method  | Endpoint              | Description              | Auth |
| :------: | :-------------------- | :----------------------- | :--: |
|  `GET`   | `/config`             | Get Stripe config        |  -   |
|  `POST`  | `/checkout`           | Create checkout session  |  ✅  |
|  `POST`  | `/confirm`            | Confirm payment          |  ✅  |
|  `POST`  | `/confirm-session`    | Confirm checkout session |  ✅  |
|  `GET`   | `/cards`              | Get saved cards          |  ✅  |
|  `POST`  | `/cards`              | Add card                 |  ✅  |
|  `POST`  | `/cards/setup-intent` | Create setup intent      |  ✅  |
| `DELETE` | `/cards/:id`          | Remove card              |  ✅  |
| `PATCH`  | `/cards/:id/default`  | Set default card         |  ✅  |
|  `GET`   | `/history`            | Get payment history      |  ✅  |
|  `GET`   | `/admin/all`          | Get all payments         |  🔒  |
|  `POST`  | `/admin/:id/refund`   | Refund payment           |  🔒  |

</details>

<details>
<summary><b>👥 Users (Admin)</b> <code>/api/v1/users</code></summary>

|  Method  | Endpoint | Description    | Auth |
| :------: | :------- | :------------- | :--: |
|  `GET`   | `/`      | Get all users  |  🔒  |
|  `POST`  | `/`      | Create user    |  🔒  |
|  `GET`   | `/:id`   | Get user by ID |  🔒  |
|  `PUT`   | `/:id`   | Update user    |  🔒  |
| `DELETE` | `/:id`   | Delete user    |  🔒  |

</details>

<details>
<summary><b>↪️ Redirect</b></summary>

| Method | Endpoint    | Description              | Auth |
| :----: | :---------- | :----------------------- | :--: |
| `GET`  | `/:shortId` | Redirect to original URL |  -   |

</details>

> **Legend:** ✅ = Auth Required | 🔒 = Admin Only | - = Public

---

## 🔑 Authentication

The API uses **JWT (JSON Web Tokens)** with a dual-token strategy:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Login     │────▶│ Access Token│────▶│  API Call   │
└─────────────┘     │  (15 min)   │     └─────────────┘
                    └─────────────┘
                           │
                           │ Expired?
                           ▼
                    ┌─────────────┐
                    │Refresh Token│────▶ New Token Pair
                    │   (7 days)  │
                    └─────────────┘
```

| Token Type        | Lifetime | Purpose                  |
| :---------------- | :------: | :----------------------- |
| **Access Token**  |  15 min  | API authentication       |
| **Refresh Token** |  7 days  | Obtain new access tokens |

### Token Delivery

- **Headers:** `Authorization: Bearer <token>`
- **Cookies:** `accessToken`, `refreshToken` (HTTP-only)

---

## 🗄️ Database Schema

### Collections

| Collection      | Description                   |
| :-------------- | :---------------------------- |
| `users`         | User accounts and profiles    |
| `urls`          | Shortened URLs                |
| `clicks`        | Click analytics and tracking  |
| `plans`         | Subscription plan definitions |
| `subscriptions` | User subscriptions            |
| `payments`      | Payment records               |
| `refreshtokens` | Active sessions               |

### Entity Relationships

```
User ─┬─< URLs ─< Clicks
      ├─< Subscriptions ─── Plan
      ├─< Payments
      └─< RefreshTokens (Sessions)
```

---

## 🗃️ Caching

**Redis** is used for high-performance caching:

| Cache Type    | Key Pattern        | TTL    |
| :------------ | :----------------- | :----- |
| URL Redirects | `url:{shortId}`    | 1 hour |
| User Sessions | `session:{userId}` | 7 days |
| Rate Limits   | `ratelimit:{ip}`   | 1 min  |

---

## 📝 Logging

**Winston** logger with daily rotation:

```typescript
logger.error("Error message"); // ❌ Error logs
logger.warn("Warning message"); // ⚠️ Warning logs
logger.info("Info message"); // ℹ️ Info logs
logger.debug("Debug message"); // 🐛 Debug logs
```

| Log Type     | Location            |
| :----------- | :------------------ |
| Success/Info | `src/logs/success/` |
| Errors       | `src/logs/error/`   |

---

## ⚠️ Error Handling

Standardized error response format:

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### HTTP Status Codes

| Code  | Description           |
| :---: | :-------------------- |
| `200` | Success               |
| `201` | Created               |
| `400` | Bad Request           |
| `401` | Unauthorized          |
| `403` | Forbidden             |
| `404` | Not Found             |
| `409` | Conflict              |
| `429` | Too Many Requests     |
| `500` | Internal Server Error |

---

## 🔒 Security

| Feature              | Implementation               |
| :------------------- | :--------------------------- |
| 🔐 Password Hashing  | bcrypt with salt rounds      |
| 🎫 JWT Tokens        | Signed with secret keys      |
| 🍪 HTTP-Only Cookies | Prevent XSS attacks          |
| 🛑 Rate Limiting     | Prevent abuse                |
| ✅ Input Validation  | Zod schema validation        |
| 🌐 CORS              | Configurable allowed origins |

---

## 🐳 Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 5080
CMD ["pnpm", "start"]
```

### Docker Compose

```yaml
version: "3.8"
services:
  api:
    build: .
    ports:
      - "5080:5080"
    environment:
      - NODE_ENV=production
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:6
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

volumes:
  mongo-data:
  redis-data:
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (256-bit minimum)
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS/TLS
- [ ] Set up rate limiting
- [ ] Configure production logging
- [ ] Set up monitoring (Prometheus + Grafana)
- [ ] Configure MongoDB backups
- [ ] Set up Stripe webhooks
- [ ] Enable security headers (Helmet)

---

## 📜 Scripts

```bash
# Development
pnpm dev              # Start with hot reload

# Production
pnpm build            # Build TypeScript
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm format           # Format with Prettier

# Testing
pnpm test             # Run tests
pnpm test:coverage    # Run with coverage
```

---

## 🤝 Contributing

Contributions are always welcome! Here's how you can help:

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

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type       | Description        |
| :--------- | :----------------- |
| `feat`     | New feature        |
| `fix`      | Bug fix            |
| `docs`     | Documentation      |
| `style`    | Formatting         |
| `refactor` | Code restructuring |
| `test`     | Adding tests       |
| `chore`    | Maintenance        |

### Code Style Guidelines

- ✅ Follow TypeScript best practices
- ✅ Use meaningful variable/function names
- ✅ Add comments for complex logic
- ✅ Write unit tests for new features
- ✅ Update documentation as needed

---

## 📄 License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2024 Md Rejoyan Islam

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
```

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
  <sub>Built with ❤️ by <a href="https://github.com/md-rejoyan-islam">Md Rejoyan Islam</a></sub>
</p>

<p align="center">
  <a href="#url-shortener-api">
    <img src="https://img.shields.io/badge/⬆️_Back_to_Top-blue?style=flat-square" alt="Back to Top">
  </a>
</p>

<p align="center">
  If you find this project helpful, please consider giving it a ⭐
</p>
