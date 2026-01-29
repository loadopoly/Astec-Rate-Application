# IPS Heavy Haul Freight Management Platform

> A comprehensive, enterprise-grade freight quoting, carrier management, and logistics intelligence platform for Astec Industries / IPS Heavy Haul operations.

![License](https://img.shields.io/badge/license-Proprietary-red)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Status](https://img.shields.io/badge/status-In%20Development-yellow)

---

## 🎯 Vision

Transform Jerome Ave.'s freight operations from manual Excel-based workflows into an intelligent, data-driven platform that:

- **Automates** budget quote generation using historical lane data
- **Optimizes** carrier selection through competitive bid analysis
- **Provides** real-time market intelligence for rate negotiations
- **Delivers** actionable insights on carrier performance and margin analysis

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Web App   │  │  Mobile PWA │  │   Desktop   │  │  Excel Add-in│        │
│  │   (React)   │  │   (React)   │  │  (Electron) │  │   (Future)   │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│                         (Express.js / Fastify)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Auth     │  │ Rate Limit  │  │   Logging   │  │   Caching   │        │
│  │   (JWT)     │  │  (Redis)    │  │ (Winston)   │  │   (Redis)   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICE LAYER                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    Quote     │  │   Carrier    │  │    Lane      │  │   Analytics  │    │
│  │   Service    │  │   Service    │  │   Service    │  │   Service    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Mileage    │  │     Bid      │  │   Margin     │  │  Prediction  │    │
│  │   Service    │  │   Service    │  │   Service    │  │   Service    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  PostgreSQL  │  │    Redis     │  │ TimescaleDB  │  │     S3       │    │
│  │   (Primary)  │  │   (Cache)    │  │  (Metrics)   │  │   (Files)    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

### Frontend
| Technology | Purpose | Why |
|------------|---------|-----|
| **React 18** | UI Framework | Component architecture, ecosystem |
| **TypeScript** | Type Safety | Catch errors at compile time |
| **TanStack Query** | Server State | Caching, background updates |
| **Zustand** | Client State | Simple, performant state management |
| **TailwindCSS** | Styling | Utility-first, rapid development |
| **Shadcn/ui** | Components | Accessible, customizable primitives |
| **Recharts** | Visualizations | React-native charting |
| **React Router v6** | Routing | Nested routes, data loading |
| **React Hook Form** | Forms | Performance, validation |
| **Zod** | Validation | Schema validation, type inference |

### Backend
| Technology | Purpose | Why |
|------------|---------|-----|
| **Node.js 20** | Runtime | JavaScript ecosystem, async I/O |
| **Express.js** | Web Framework | Mature, middleware ecosystem |
| **TypeScript** | Type Safety | Shared types with frontend |
| **Prisma** | ORM | Type-safe database access |
| **PostgreSQL 16** | Database | ACID compliance, JSON support |
| **Redis** | Caching | Session storage, rate limiting |
| **Bull** | Job Queue | Background processing |
| **Winston** | Logging | Structured logging |
| **Jest** | Testing | Unit and integration tests |

### Infrastructure
| Technology | Purpose | Why |
|------------|---------|-----|
| **Docker** | Containerization | Consistent environments |
| **Docker Compose** | Local Dev | Multi-container orchestration |
| **GitHub Actions** | CI/CD | Automated testing/deployment |
| **Nginx** | Reverse Proxy | Load balancing, SSL termination |

### External Integrations
| Service | Purpose |
|---------|---------|
| **OpenStreetMap/Nominatim** | Geocoding (free) |
| **OSRM** | Route distance calculation (free, self-hosted) |
| **DAT/Truckstop** | Spot market rates (paid, future) |
| **Oracle Fusion** | ERP data sync (existing) |

---

## 🗂️ Project Structure

```
ips-freight-platform/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Continuous integration
│   │   ├── deploy-staging.yml     # Staging deployment
│   │   └── deploy-prod.yml        # Production deployment
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
│
├── apps/
│   ├── web/                       # React frontend application
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   │   ├── ui/            # Shadcn/ui components
│   │   │   │   ├── layout/        # Layout components
│   │   │   │   ├── forms/         # Form components
│   │   │   │   └── charts/        # Chart components
│   │   │   ├── features/          # Feature modules
│   │   │   │   ├── dashboard/
│   │   │   │   ├── quotes/
│   │   │   │   ├── lanes/
│   │   │   │   ├── carriers/
│   │   │   │   ├── bids/
│   │   │   │   ├── analytics/
│   │   │   │   └── settings/
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   ├── lib/               # Utilities and helpers
│   │   │   ├── services/          # API client services
│   │   │   ├── stores/            # Zustand stores
│   │   │   ├── types/             # TypeScript types
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── tailwind.config.js
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                       # Express backend application
│       ├── src/
│       │   ├── config/            # Configuration management
│       │   │   ├── database.ts
│       │   │   ├── redis.ts
│       │   │   └── env.ts
│       │   ├── controllers/       # Request handlers
│       │   │   ├── quotes.controller.ts
│       │   │   ├── lanes.controller.ts
│       │   │   ├── carriers.controller.ts
│       │   │   ├── bids.controller.ts
│       │   │   └── analytics.controller.ts
│       │   ├── services/          # Business logic
│       │   │   ├── quote.service.ts
│       │   │   ├── lane.service.ts
│       │   │   ├── carrier.service.ts
│       │   │   ├── bid.service.ts
│       │   │   ├── mileage.service.ts
│       │   │   ├── prediction.service.ts
│       │   │   └── analytics.service.ts
│       │   ├── middleware/        # Express middleware
│       │   │   ├── auth.ts
│       │   │   ├── validation.ts
│       │   │   ├── errorHandler.ts
│       │   │   └── rateLimiter.ts
│       │   ├── routes/            # API route definitions
│       │   │   ├── index.ts
│       │   │   ├── quotes.routes.ts
│       │   │   ├── lanes.routes.ts
│       │   │   ├── carriers.routes.ts
│       │   │   └── analytics.routes.ts
│       │   ├── jobs/              # Background job processors
│       │   │   ├── importQuotes.job.ts
│       │   │   ├── calculateMetrics.job.ts
│       │   │   └── syncOracleData.job.ts
│       │   ├── utils/             # Helper functions
│       │   │   ├── mileageCalculator.ts
│       │   │   ├── ratePredictor.ts
│       │   │   └── excelParser.ts
│       │   ├── types/             # TypeScript types
│       │   └── app.ts             # Express app entry
│       ├── prisma/
│       │   ├── schema.prisma      # Database schema
│       │   ├── migrations/        # Database migrations
│       │   └── seed.ts            # Seed data
│       ├── tests/                 # Test files
│       │   ├── unit/
│       │   └── integration/
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   └── shared/                    # Shared code between apps
│       ├── src/
│       │   ├── types/             # Shared TypeScript types
│       │   ├── constants/         # Shared constants
│       │   ├── utils/             # Shared utilities
│       │   └── validation/        # Shared Zod schemas
│       ├── tsconfig.json
│       └── package.json
│
├── scripts/
│   ├── import-historical-data.ts  # Import Excel data
│   ├── setup-dev.sh               # Development setup
│   └── generate-test-data.ts      # Generate test fixtures
│
├── docker/
│   ├── Dockerfile.web
│   ├── Dockerfile.api
│   └── docker-compose.yml
│
├── docs/
│   ├── API.md                     # API documentation
│   ├── ARCHITECTURE.md            # Architecture decisions
│   ├── CONTRIBUTING.md            # Contribution guidelines
│   ├── DEPLOYMENT.md              # Deployment guide
│   └── USER_GUIDE.md              # End-user documentation
│
├── .env.example
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── turbo.json                     # Turborepo config
├── package.json                   # Root package.json
└── README.md
```

---

## 🗃️ Database Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// CORE ENTITIES
// ============================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  role          UserRole  @default(USER)
  site          Site      @relation(fields: [siteId], references: [id])
  siteId        String
  quotes        Quote[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum UserRole {
  ADMIN
  MANAGER
  USER
  VIEWER
}

model Site {
  id            String    @id @default(cuid())
  name          String    // Jerome, Wilson, PDC, Blair
  code          String    @unique
  address       String
  city          String
  state         String
  zip           String
  latitude      Float?
  longitude     Float?
  users         User[]
  quotes        Quote[]
  carriers      CarrierSite[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

// ============================================
// LOCATION & LANE ENTITIES
// ============================================

model Location {
  id            String    @id @default(cuid())
  city          String
  state         String
  zip           String?
  latitude      Float?
  longitude     Float?
  originLanes   Lane[]    @relation("OriginLanes")
  destLanes     Lane[]    @relation("DestLanes")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([city, state])
  @@index([state])
}

model Lane {
  id            String    @id @default(cuid())
  origin        Location  @relation("OriginLanes", fields: [originId], references: [id])
  originId      String
  destination   Location  @relation("DestLanes", fields: [destId], references: [id])
  destId        String
  distance      Float?    // Miles
  transitDays   Int?      // Estimated transit time
  quotes        Quote[]
  laneMetrics   LaneMetric[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([originId, destId])
  @@index([originId])
  @@index([destId])
}

model LaneMetric {
  id            String    @id @default(cuid())
  lane          Lane      @relation(fields: [laneId], references: [id])
  laneId        String
  period        DateTime  // Month/Year for aggregation
  minRate       Float
  maxRate       Float
  avgRate       Float
  medianRate    Float
  shipmentCount Int
  ratePerMile   Float?
  createdAt     DateTime  @default(now())

  @@unique([laneId, period])
  @@index([laneId])
  @@index([period])
}

// ============================================
// CARRIER ENTITIES
// ============================================

model Carrier {
  id            String    @id @default(cuid())
  name          String    @unique
  mcNumber      String?   @unique
  dotNumber     String?
  type          CarrierType
  isAssetBased  Boolean   @default(false)
  isBroker      Boolean   @default(false)
  isPreferred   Boolean   @default(false)
  contacts      CarrierContact[]
  sites         CarrierSite[]
  bids          Bid[]
  quotes        Quote[]
  performance   CarrierPerformance[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum CarrierType {
  CARRIER
  BROKER
  CARRIER_BROKER
}

model CarrierContact {
  id            String    @id @default(cuid())
  carrier       Carrier   @relation(fields: [carrierId], references: [id])
  carrierId     String
  name          String
  title         String?
  phone         String
  email         String
  isPrimary     Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model CarrierSite {
  id            String    @id @default(cuid())
  carrier       Carrier   @relation(fields: [carrierId], references: [id])
  carrierId     String
  site          Site      @relation(fields: [siteId], references: [id])
  siteId        String
  isPreferred   Boolean   @default(false)
  notes         String?
  createdAt     DateTime  @default(now())

  @@unique([carrierId, siteId])
}

model CarrierPerformance {
  id              String    @id @default(cuid())
  carrier         Carrier   @relation(fields: [carrierId], references: [id])
  carrierId       String
  period          DateTime  // Month/Year
  totalBids       Int       @default(0)
  wonBids         Int       @default(0)
  winRate         Float     @default(0)
  avgResponseTime Float?    // Hours
  onTimePickup    Float?    // Percentage
  onTimeDelivery  Float?    // Percentage
  avgRating       Float?    // 1-5 scale
  equipmentScore  Float?    // 1-5 scale
  serviceScore    Float?    // 1-5 scale
  createdAt       DateTime  @default(now())

  @@unique([carrierId, period])
  @@index([carrierId])
  @@index([period])
}

// ============================================
// QUOTE & BID ENTITIES
// ============================================

model Quote {
  id              String      @id @default(cuid())
  requestNumber   String      @unique
  type            QuoteType
  status          QuoteStatus @default(PENDING)
  
  // Customer & Job
  jobId           String
  customer        String
  
  // Location
  lane            Lane        @relation(fields: [laneId], references: [id])
  laneId          String
  site            Site        @relation(fields: [siteId], references: [id])
  siteId          String
  
  // Equipment
  flatbedQty      Int         @default(0)
  flatbedRate     Float       @default(0)
  stepDeckQty     Int         @default(0)
  stepDeckRate    Float       @default(0)
  doubleDeckQty   Int         @default(0)
  doubleDeckRate  Float       @default(0)
  towawayQty      Int         @default(0)
  towawayRate     Float       @default(0)
  dollyQty        Int         @default(0)
  dollyRate       Float       @default(0)
  rgnQty          Int         @default(0)
  rgnRate         Float       @default(0)
  
  // Pricing
  carrierTotal    Float
  liveLoadCost    Float?
  listQuote       Float
  markup          Float       @default(0)
  quoteToCustomer Float
  
  // Outcome
  invoicedAmount  Float?
  carrierInvoice  Float?
  finalMargin     Float?
  finalMarginPct  Float?
  
  // Relations
  selectedCarrier Carrier?    @relation(fields: [carrierId], references: [id])
  carrierId       String?
  bids            Bid[]
  user            User?       @relation(fields: [userId], references: [id])
  userId          String?
  
  // Metadata
  notes           String?
  quoteDate       DateTime
  shipDate        DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  @@index([status])
  @@index([quoteDate])
  @@index([customer])
  @@index([laneId])
}

enum QuoteType {
  BUDGET
  FIRM
}

enum QuoteStatus {
  PENDING
  QUOTED
  SIGNED_CONTRACT
  LOST_SALE
  CUSTOMER_ARRANGED
  CLOSED
}

model Bid {
  id              String    @id @default(cuid())
  quote           Quote     @relation(fields: [quoteId], references: [id])
  quoteId         String
  carrier         Carrier   @relation(fields: [carrierId], references: [id])
  carrierId       String
  
  // Rate Components
  lineHaulRate    Float
  fuelSurcharge   Float     @default(0)
  permitFees      Float     @default(0)
  escortFees      Float     @default(0)
  miscFees        Float     @default(0)
  totalRate       Float
  
  // Equipment Breakdown (JSON for flexibility)
  equipmentRates  Json?     // { flatbed: 1500, stepDeck: 2000, etc. }
  
  // Status
  isSelected      Boolean   @default(false)
  responseTime    Float?    // Hours to respond
  expiresAt       DateTime?
  
  // Carrier Ratings (post-delivery)
  equipmentRating Int?      // 1-5
  responseRating  Int?      // 1-5
  serviceRating   Int?      // 1-5
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@unique([quoteId, carrierId])
  @@index([quoteId])
  @@index([carrierId])
}

// ============================================
// EQUIPMENT & PRODUCT ENTITIES
// ============================================

model EquipmentType {
  id              String    @id @default(cuid())
  code            String    @unique  // FB, SD, DD, TOW, RGN, DL
  name            String
  description     String?
  avgWeightMin    Int?
  avgWeightMax    Int?
  avgLengthMin    Int?
  avgLengthMax    Int?
  requiresPermit  Boolean   @default(false)
  requiresEscort  Boolean   @default(false)
  products        Product[]
  createdAt       DateTime  @default(now())
}

model Product {
  id              String        @id @default(cuid())
  productGroup    String        // Bins, Silos, Conveyors, etc.
  modelGroup      String        // RCFS-1014-3, NGW-200, etc.
  description     String
  minWeight       Int
  maxWeight       Int
  minLength       Int
  maxLength       Int
  minWidth        Int
  maxWidth        Int
  minHeight       Int
  maxHeight       Int
  equipmentType   EquipmentType @relation(fields: [equipmentTypeId], references: [id])
  equipmentTypeId String
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@index([productGroup])
  @@index([modelGroup])
}

// ============================================
// AUDIT & IMPORT TRACKING
// ============================================

model ImportLog {
  id            String    @id @default(cuid())
  filename      String
  recordsTotal  Int
  recordsSuccess Int
  recordsFailed Int
  errors        Json?
  importedBy    String
  createdAt     DateTime  @default(now())
}

model AuditLog {
  id            String    @id @default(cuid())
  entity        String    // Quote, Bid, Carrier, etc.
  entityId      String
  action        String    // CREATE, UPDATE, DELETE
  changes       Json?
  userId        String
  ipAddress     String?
  createdAt     DateTime  @default(now())

  @@index([entity, entityId])
  @@index([userId])
  @@index([createdAt])
}
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/login              # User login
POST   /api/auth/logout             # User logout
POST   /api/auth/refresh            # Refresh token
GET    /api/auth/me                 # Get current user
```

### Quotes
```
GET    /api/quotes                  # List quotes (paginated, filtered)
GET    /api/quotes/:id              # Get quote details
POST   /api/quotes                  # Create new quote
PUT    /api/quotes/:id              # Update quote
DELETE /api/quotes/:id              # Delete quote (soft)
POST   /api/quotes/:id/duplicate    # Duplicate quote
POST   /api/quotes/budget           # Generate budget quote
GET    /api/quotes/export           # Export to Excel
POST   /api/quotes/import           # Import from Excel
```

### Lanes
```
GET    /api/lanes                   # List lanes
GET    /api/lanes/:id               # Get lane details
GET    /api/lanes/:id/history       # Get lane rate history
GET    /api/lanes/:id/metrics       # Get lane metrics
GET    /api/lanes/search            # Search lanes by O/D
POST   /api/lanes/distance          # Calculate lane distance
```

### Carriers
```
GET    /api/carriers                # List carriers
GET    /api/carriers/:id            # Get carrier details
POST   /api/carriers                # Create carrier
PUT    /api/carriers/:id            # Update carrier
GET    /api/carriers/:id/performance # Get carrier performance
GET    /api/carriers/:id/bids       # Get carrier bid history
GET    /api/carriers/compare        # Compare multiple carriers
```

### Bids
```
GET    /api/bids                    # List bids
GET    /api/bids/:id                # Get bid details
POST   /api/bids                    # Create bid
PUT    /api/bids/:id                # Update bid
POST   /api/bids/:id/select         # Select winning bid
POST   /api/bids/compare            # Compare bids for quote
```

### Analytics
```
GET    /api/analytics/dashboard     # Dashboard KPIs
GET    /api/analytics/lanes         # Lane analytics
GET    /api/analytics/carriers      # Carrier analytics
GET    /api/analytics/margins       # Margin analysis
GET    /api/analytics/trends        # Rate trends
GET    /api/analytics/export        # Export report
```

### Mileage
```
POST   /api/mileage/calculate       # Calculate O/D distance
GET    /api/mileage/rate-per-mile   # Get rate/mile for lane
```

---

## 🎨 Feature Modules

### 1. Dashboard Module
**Purpose:** At-a-glance operational intelligence

**Components:**
- `DashboardPage` - Main dashboard view
- `KPICards` - Key performance indicators
- `RecentQuotes` - Latest quote activity
- `LaneHeatmap` - Geographic visualization
- `CarrierLeaderboard` - Top performing carriers
- `MarginTrend` - Margin over time chart
- `QuickActions` - New quote, search, etc.

**KPIs:**
- Total quotes (MTD/YTD)
- Average margin percentage
- Win rate by carrier
- Top 5 lanes by volume
- Quote-to-close ratio

---

### 2. Lane Intelligence Module
**Purpose:** Historical rate analysis and benchmarking

**Components:**
- `LaneSearchPage` - Search and browse lanes
- `LaneDetailPage` - Deep dive on single lane
- `LaneRateChart` - Rate history visualization
- `LaneComparison` - Compare multiple lanes
- `MileageCalculator` - Distance and rate/mile tool
- `LaneMap` - Route visualization

**Features:**
- Search by origin/destination
- Filter by equipment type
- Rate min/median/max bands
- $/mile calculations
- Carrier breakdown per lane
- Seasonal trend analysis

---

### 3. Budget Quote Generator
**Purpose:** AI-powered quote estimation

**Components:**
- `QuoteWizard` - Step-by-step quote builder
- `QuotePreview` - Quote summary before save
- `EquipmentSelector` - Equipment type/qty picker
- `RatePrediction` - ML-based rate estimate
- `MarginCalculator` - Markup and margin tools
- `QuoteHistory` - Previous similar quotes

**Algorithm:**
```
1. Lookup lane in historical data
2. Filter by equipment type
3. Apply recency weighting (newer = higher weight)
4. Calculate percentile bands (P25, P50, P75)
5. Adjust for:
   - Fuel index delta
   - Seasonal factors
   - Equipment availability
   - Oversize/overweight factors
6. Return range: Conservative / Target / Aggressive
```

---

### 4. Carrier Management Module
**Purpose:** Carrier database and performance tracking

**Components:**
- `CarrierListPage` - Browse all carriers
- `CarrierDetailPage` - Carrier profile
- `CarrierScorecard` - Performance metrics
- `CarrierComparison` - Side-by-side compare
- `ContactDirectory` - Carrier contacts
- `PreferredCarriers` - Manage preferred list

**Metrics Tracked:**
- Win rate (bids won / total bids)
- Average quote delta (vs. market)
- Response time (hours)
- On-time pickup %
- On-time delivery %
- Equipment rating (1-5)
- Service rating (1-5)

---

### 5. Bid Comparison Module
**Purpose:** Side-by-side carrier bid analysis

**Components:**
- `BidComparisonPage` - Main comparison view
- `BidEntryForm` - Enter carrier bids
- `BidMatrix` - Tabular comparison
- `CostBreakdown` - Line haul, fuel, permits, etc.
- `BidRecommendation` - AI suggested winner
- `BidHistory` - Historical bids for reference

**Features:**
- Upload bid sheets (Excel)
- Manual bid entry
- Auto-calculate totals
- Flag outliers
- Calculate margin per carrier
- One-click winner selection

---

### 6. Margin Analysis Module
**Purpose:** Profitability tracking and optimization

**Components:**
- `MarginDashboard` - Margin overview
- `QuoteVsActual` - Quoted vs. invoiced analysis
- `CarrierMargins` - Margin by carrier
- `LaneMargins` - Margin by lane
- `MarginLeakage` - Identify lost margin
- `MarginTrends` - Historical profitability

**Calculations:**
- Quote margin = (Quote to Customer - Carrier Total) / Quote to Customer
- Actual margin = (Invoiced - Carrier Invoice) / Invoiced
- Margin leakage = Quote margin - Actual margin

---

### 7. Live Load Calculator
**Purpose:** Calculate live load/unload costs

**Components:**
- `LiveLoadCalculator` - Main calculator
- `RateConfiguration` - Manage crane/labor rates
- `CostBreakdown` - Itemized cost view
- `QuoteIntegration` - Add to quote

**Inputs:**
- Crane days
- Crane daily rate
- Labor hours
- Labor count
- Labor hourly rate
- Forklift days
- Forklift daily rate
- Markup percentage

---

## 🚀 Development Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Project setup (monorepo, TypeScript, linting)
- [ ] Database schema design and implementation
- [ ] Authentication system
- [ ] Basic CRUD APIs
- [ ] Core UI components
- [ ] Data import scripts (historical Excel data)

### Phase 2: Core Features (Weeks 5-8)
- [ ] Dashboard with KPIs
- [ ] Lane search and detail views
- [ ] Quote creation workflow
- [ ] Carrier management
- [ ] Basic bid entry

### Phase 3: Intelligence (Weeks 9-12)
- [ ] Budget quote prediction algorithm
- [ ] Mileage calculation integration
- [ ] Bid comparison matrix
- [ ] Carrier performance scoring
- [ ] Margin analysis

### Phase 4: Enhancement (Weeks 13-16)
- [ ] Advanced analytics dashboards
- [ ] Excel export/import
- [ ] Email notifications
- [ ] Mobile-responsive design
- [ ] User preferences

### Phase 5: Scale (Weeks 17-20)
- [ ] Performance optimization
- [ ] Caching layer
- [ ] Background job processing
- [ ] Audit logging
- [ ] Documentation

### Future Enhancements
- [ ] Spot market rate integration (DAT/Truckstop)
- [ ] Oracle Fusion ERP sync
- [ ] TMS integration
- [ ] Mobile app (React Native)
- [ ] Email-to-quote workflow
- [ ] Customer portal

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose
- Git

### Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/astec/ips-freight-platform.git
cd ips-freight-platform

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your local settings

# 4. Start infrastructure (PostgreSQL, Redis)
docker-compose up -d postgres redis

# 5. Run database migrations
npm run db:migrate

# 6. Seed initial data
npm run db:seed

# 7. Import historical data
npm run import:historical

# 8. Start development servers
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ips_freight

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# API
API_PORT=3001
API_URL=http://localhost:3001

# Frontend
VITE_API_URL=http://localhost:3001/api

# Mileage Service (OSRM)
OSRM_URL=http://router.project-osrm.org

# Optional: Spot Market (future)
DAT_API_KEY=
TRUCKSTOP_API_KEY=
```

---

## 📄 License

Proprietary - Astec Industries, Inc.

---

## 👥 Contributors

- **Adam Gard** - Senior Engineer, Project Lead
- **Steve Pack** - Logistics Manager, Domain Expert

---

## 📞 Support

For questions or issues, contact:
- Adam Gard - [email]
- IT Support - [helpdesk]
