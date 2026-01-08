<p align="center">
  <img src="https://img.icons8.com/fluency/96/link.png" alt="URL Shortener Logo" width="100" height="100">
</p>

<h1 align="center">URL Shortener</h1>

<p align="center">
  <strong>A full-stack URL shortening platform with analytics, subscriptions, and payment processing</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#deployment">Deployment</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.x-black?style=flat-square&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/Express-5.x-lightgrey?style=flat-square&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/MongoDB-7.x-green?style=flat-square&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Redis-7.x-red?style=flat-square&logo=redis" alt="Redis">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stripe-Integrated-blueviolet?style=flat-square&logo=stripe" alt="Stripe">
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/License-ISC-yellow?style=flat-square" alt="License">
</p>

---

## 📋 Overview

URL Shortener is a production-ready, full-stack application that allows users to create shortened URLs with comprehensive analytics, subscription management, and secure payment processing.

### 🏗️ Project Structure

This is a **monorepo** containing two main applications:

```
url-shortener/
├── 📂 backend/          # Express.js REST API Server
├── 📂 frontend/         # Next.js React Application
├── 📄 docker-compose.yml
├── 📄 pnpm-workspace.yaml
└── 📄 package.json
```

| Application | Description | Documentation |
|:------------|:------------|:--------------|
| **Backend** | Express.js REST API with MongoDB & Redis | [📖 Backend README](./backend/README.md) |
| **Frontend** | Next.js 16 React Application | [📖 Frontend README](./frontend/README.md) |

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🔗 URL Management
- Shorten long URLs instantly
- Custom aliases for branded links
- QR code generation
- Link expiration settings
- Bulk URL management

</td>
<td width="50%">

### 📊 Analytics
- Real-time click tracking
- Geographic location data
- Device & browser analytics
- Referrer tracking
- Time-based trends

</td>
</tr>
<tr>
<td width="50%">

### 👤 User Management
- JWT authentication
- Email verification
- Password recovery
- Multi-device sessions
- Profile customization

</td>
<td width="50%">

### 💳 Subscriptions
- Multiple pricing tiers
- Stripe payment integration
- Card management
- Usage tracking
- Billing history

</td>
</tr>
</table>

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 16)                        │
│                      Port: 3000                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   Pages     │ │ Components  │ │  RTK Query  │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Express 5)                          │
│                      Port: 5080                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │   Routes    │ │ Controllers │ │  Services   │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│     MongoDB      │ │    Redis     │ │   Stripe     │
│   Port: 27017    │ │  Port: 6379  │ │   (Cloud)    │
└──────────────────┘ └──────────────┘ └──────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version |
|:------------|:--------|
| Node.js | >= 18.0.0 |
| pnpm | >= 8.0.0 |
| MongoDB | >= 6.0 |
| Redis | >= 6.0 |
| Docker (optional) | >= 20.0 |

### Option 1: Local Development

1️⃣ **Clone the repository**

```bash
git clone https://github.com/md-rejoyan-islam/url-shortener.git
cd url-shortener
```

2️⃣ **Install dependencies**

```bash
pnpm install
```

3️⃣ **Set up environment variables**

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

4️⃣ **Start MongoDB & Redis** (if not using Docker)

```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Start Redis
redis-server
```

5️⃣ **Start development servers**

```bash
# Start both frontend and backend
pnpm dev

# Or start individually
pnpm dev:server    # Backend only (port 5080)
pnpm dev:client    # Frontend only (port 3000)
```

6️⃣ **Access the application**

| Service | URL |
|:--------|:----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5080 |
| API Docs | http://localhost:5080/api-docs |

### Option 2: Docker Compose

1️⃣ **Clone and configure**

```bash
git clone https://github.com/md-rejoyan-islam/url-shortener.git
cd url-shortener

# Set up environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2️⃣ **Start all services**

```bash
docker-compose up -d
```

This starts:
- **MongoDB** (port 27017)
- **Redis** (port 6379)
- **Backend** (port 5080)
- **Frontend** (port 3000)

3️⃣ **View logs**

```bash
docker-compose logs -f
```

4️⃣ **Stop services**

```bash
docker-compose down
```

---

## 📜 Available Scripts

Run from the root directory:

| Command | Description |
|:--------|:------------|
| `pnpm install` | Install all dependencies |
| `pnpm dev` | Start both frontend & backend in development |
| `pnpm dev:server` | Start only backend server |
| `pnpm dev:client` | Start only frontend client |
| `pnpm build` | Build both applications |
| `pnpm start` | Start both in production mode |

---

## 📚 Documentation

### Backend API

Full API documentation is available at `/api-docs` when the server is running.

- **OpenAPI Specification**: [`backend/docs/openapi.yaml`](./backend/docs/openapi.yaml)
- **Detailed README**: [📖 Backend Documentation](./backend/README.md)

#### API Modules

| Module | Endpoints | Description |
|:-------|:---------:|:------------|
| Auth | 17 | Authentication & user management |
| URLs | 8 | URL shortening & management |
| Analytics | 3 | Click tracking & statistics |
| Plans | 8 | Subscription plans |
| Subscriptions | 8 | User subscriptions |
| Payments | 12 | Stripe integration |
| Users | 5 | Admin user management |

### Frontend

- **Detailed README**: [📖 Frontend Documentation](./frontend/README.md)

#### Key Pages

| Route | Description |
|:------|:------------|
| `/` | Landing page |
| `/login` | User authentication |
| `/dashboard` | User dashboard |
| `/dashboard/urls` | URL management |
| `/dashboard/analytics` | Analytics dashboard |
| `/admin` | Admin panel |

---

## 🐳 Deployment

### Docker Compose (Production)

The included `docker-compose.yml` is configured for production with:

- **Traefik** reverse proxy labels
- **MongoDB** with persistent volumes
- **Redis** with persistence
- **Health checks** for all services

```bash
# Start production stack
docker-compose up -d

# View status
docker-compose ps
```

### Environment Variables

#### Backend (`backend/.env`)

```env
NODE_ENV=production
PORT=5080
MONGO_URI=mongodb://user:pass@mongodb:27017/url_shortener
REDIS_URL=redis://:password@redis:6379
ACCESS_TOKEN_SECRET=your-secret
STRIPE_SECRET_KEY=sk_live_...
```

#### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|:-----------|:--------|
| Node.js 18+ | Runtime |
| Express 5 | Web framework |
| TypeScript | Type safety |
| MongoDB | Database |
| Redis | Caching |
| Zod | Validation |
| JWT | Authentication |
| Stripe | Payments |

### Frontend

| Technology | Purpose |
|:-----------|:--------|
| Next.js 16 | React framework |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS 4 | Styling |
| Redux Toolkit | State management |
| RTK Query | Data fetching |
| Radix UI | UI components |
| Recharts | Charts |

---

## 📁 Project Structure

```
url-shortener/
├── 📂 backend/                    # Express.js API
│   ├── 📂 src/
│   │   ├── 📂 modules/            # Feature modules
│   │   │   ├── auth/
│   │   │   ├── url/
│   │   │   ├── click/
│   │   │   ├── plan/
│   │   │   ├── subscription/
│   │   │   ├── payment/
│   │   │   └── user/
│   │   ├── 📂 config/             # Configuration
│   │   ├── 📂 middlewares/        # Express middlewares
│   │   └── 📂 helper/             # Utilities
│   ├── 📂 docs/                   # API documentation
│   ├── Dockerfile
│   └── README.md                  # Backend docs
│
├── 📂 frontend/                   # Next.js App
│   ├── 📂 app/                    # App Router pages
│   │   ├── (auth)/                # Auth pages
│   │   ├── (public)/              # Public pages
│   │   └── (authenticated)/       # Protected pages
│   ├── 📂 components/             # React components
│   ├── 📂 store/                  # Redux store
│   ├── 📂 types/                  # TypeScript types
│   ├── Dockerfile
│   └── README.md                  # Frontend docs
│
├── docker-compose.yml             # Docker orchestration
├── pnpm-workspace.yaml            # Monorepo config
├── package.json                   # Root package
└── README.md                      # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines in each project:

- [Backend Contributing](./backend/README.md#-contributing)
- [Frontend Contributing](./frontend/README.md#-contributing)

### Quick Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

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
  <sub>Built with ❤️ using Next.js, Express, MongoDB, and Redis</sub>
</p>

<p align="center">
  <a href="#url-shortener">
    <img src="https://img.shields.io/badge/⬆️_Back_to_Top-blue?style=flat-square" alt="Back to Top">
  </a>
</p>

<p align="center">
  If you find this project helpful, please consider giving it a ⭐
</p>