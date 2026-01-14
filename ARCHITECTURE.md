# Architecture Documentation
## DashGen: AI-Powered Dashboard Generator

**Version:** 1.0.0  
**Last Updated:** 2026-01-14

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Principles](#architecture-principles)
4. [Component Architecture](#component-architecture)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)
7. [Deployment Architecture](#deployment-architecture)
8. [Security Architecture](#security-architecture)
9. [Scalability & Performance](#scalability--performance)
10. [Integration Points](#integration-points)
11. [Future Architecture](#future-architecture)

---

## Executive Summary

DashGen is a **PWA-first** client-side application built with React, TypeScript, and Vite. The architecture prioritizes:
- **Offline-first** capabilities via Service Workers
- **Security-by-design** with OWASP ASVS alignment
- **Progressive enhancement** for broad device support
- **Scalable foundation** ready for cloud backend integration

The current MVP is a fully functional client-side application with AI generation powered by Google Gemini API. Future phases will introduce backend services using **Supabase** (Stack B recommended) or **standalone Postgres** (Stack A).

---

## System Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          User Browser                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │             React Application (index.tsx)                │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │   │
│  │  │ UI Layer │  │Components│  │  Hooks   │  │ Utils   │ │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │        State Management (useState/hooks)            │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  │                                                           │   │
│  │  ┌─────────────────────────────────────────────────────┐ │   │
│  │  │    Client-Side Storage (LocalStorage/IndexedDB)     │ │   │
│  │  └─────────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Service Worker                        │   │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────────────┐ │   │
│  │  │   Cache    │  │  Offline   │  │  Background Sync  │ │   │
│  │  │  Strategy  │  │  Fallback  │  │     (Future)      │ │   │
│  │  └────────────┘  └────────────┘  └───────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/TLS 1.3
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      External Services                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐        ┌────────────────────────┐    │
│  │   Google Gemini AI   │        │  CDN (Vercel Edge)     │    │
│  │   (Generation API)   │        │  (Static Assets)       │    │
│  └──────────────────────┘        └────────────────────────┘    │
│                                                                  │
│  ┌──────────────────────┐        ┌────────────────────────┐    │
│  │  Supabase (Future)   │        │  Cloudflare (Future)   │    │
│  │  Auth/DB/Realtime    │        │  WAF/Rate Limiting     │    │
│  └──────────────────────┘        └────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### System Boundaries

**In Scope:**
- Frontend React application
- Service worker for offline functionality
- Client-side state management
- LocalStorage persistence
- AI generation integration (client-side API calls)

**Out of Scope (Current MVP):**
- Backend API server
- User authentication service
- Database (except client-side storage)
- Payment processing
- Real-time collaboration

**Future Scope:**
- Supabase backend integration
- Multi-user authentication
- Cross-device synchronization
- Payment processing via Stripe
- Enterprise SSO

---

## Architecture Principles

### 1. PWA-First
- Progressive Web App capabilities at the core
- Offline-first data strategy
- Installable on all platforms
- Fast, reliable, engaging

### 2. Security by Design
- OWASP ASVS Level 2 compliance minimum
- Defense in depth
- Least privilege principle
- Secure by default configurations

### 3. Privacy by Default
- Data minimization
- Client-side processing where possible
- Explicit consent for data sharing
- Transparent data handling

### 4. Performance Optimization
- Code splitting for faster initial load
- Lazy loading of components
- Aggressive caching strategy
- Efficient state management

### 5. Accessibility First
- WCAG 2.1 Level AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast and color blind modes

### 6. Scalability
- Stateless design principles
- Horizontal scaling capability (future)
- Efficient resource utilization
- Cache-friendly architecture

---

## Component Architecture

### Frontend Application Structure

```
/DashBoardGenv1.0
├── index.tsx                 # Application entry point
├── index.html               # HTML shell
├── index.css                # Global styles
├── vite.config.ts           # Build configuration
├── tsconfig.json            # TypeScript configuration
│
├── /components              # Reusable UI components
│   ├── ArtifactCard.tsx         # Dashboard preview card
│   ├── CodeEditor.tsx           # Code viewing/editing
│   ├── ConfirmationModal.tsx    # User confirmations
│   ├── DottedGlowBackground.tsx # Visual effects
│   ├── Icons.tsx                # SVG icon components
│   ├── PreviewModal.tsx         # Full preview modal
│   ├── SideDrawer.tsx           # Drawer container
│   └── /drawer                  # Drawer panels
│       ├── EnhancePanel.tsx     # Enhancement options
│       ├── HistoryPanel.tsx     # Session history
│       ├── LayoutsPanel.tsx     # Layout selection
│       ├── SettingsPanel.tsx    # User settings
│       └── VariationsPanel.tsx  # Style variations
│
├── /hooks                   # Custom React hooks
│   └── useHistory.ts            # Undo/redo functionality
│
├── /utils                   # Utility functions
│   ├── storage.ts               # LocalStorage helpers
│   └── [future utilities]
│
├── types.ts                 # TypeScript type definitions
├── constants.ts             # Application constants
├── utils.ts                 # General utilities
│
├── /public                  # Static assets (future)
│   ├── manifest.json            # PWA manifest
│   ├── /icons                   # App icons
│   └── service-worker.js        # Service worker
│
├── /docs                    # Documentation
│   ├── PRD.md
│   ├── ARCHITECTURE.md (this file)
│   ├── SECURITY.md
│   ├── PRIVACY.md
│   ├── API.md
│   ├── TESTING.md
│   ├── OPERATIONS.md
│   ├── CONTRIBUTING.md
│   └── CHANGELOG.md
│
├── /terraform               # Infrastructure as Code (future)
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
└── /.github                 # CI/CD workflows
    └── /workflows
        ├── ci.yml
        ├── security.yml
        └── deploy.yml
```

### Component Hierarchy

```
App (index.tsx)
├── DottedGlowBackground
├── Header
│   ├── Logo
│   └── ActionButtons (Undo/Redo/History/Settings)
├── PromptInput
│   ├── TextArea
│   └── GenerateButton
├── ArtifactGrid
│   └── ArtifactCard[] (multiple)
│       ├── PreviewIframe
│       ├── ActionButtons (Copy/Download/Enhance/Layout)
│       └── StatusIndicator
├── SideDrawer
│   ├── HistoryPanel
│   │   └── SessionList
│   ├── SettingsPanel
│   │   ├── FrameworkSelector
│   │   ├── DataContextInput
│   │   └── A11yToggle
│   ├── EnhancePanel
│   │   └── EnhancementOptions
│   ├── VariationsPanel
│   │   └── VariationList
│   └── LayoutsPanel
│       └── LayoutOptions
├── PreviewModal
│   └── FullScreenPreview
├── ConfirmationModal
│   └── ConfirmationDialog
└── CodeEditor
    ├── MonacoEditor (future) / TextArea (current)
    └── SyntaxHighlighting
```

---

## Data Flow

### 1. Dashboard Generation Flow

```
User Input (Prompt)
    │
    ▼
Validate Input
    │
    ▼
Create Session Object
    │
    ▼
Call Gemini API (Streaming)
    │
    ├─► Stream Handler
    │   ├─► Parse JSON Stream
    │   ├─► Update Artifact State (Real-time)
    │   └─► Render Preview
    │
    ▼
Complete Generation
    │
    ▼
Save to LocalStorage
    │
    ▼
Update History
    │
    ▼
Log Audit Event
```

### 2. Offline Data Flow

```
User Action (Offline)
    │
    ▼
Check Network Status
    │
    ├─► Online: Proceed normally
    │
    └─► Offline
        │
        ▼
    Check Action Type
        │
        ├─► Read-Only Action
        │   ├─► Load from LocalStorage
        │   └─► Display Cached Data
        │
        └─► Write Action (Generate/Enhance)
            ├─► Show "Offline" Error
            └─► Queue for Later (Future: Background Sync)
```

### 3. Service Worker Cache Flow

```
Browser Request
    │
    ▼
Service Worker Intercepts
    │
    ├─► Static Asset Request
    │   ├─► Check Cache First
    │   │   ├─► Cache Hit: Return from Cache
    │   │   └─► Cache Miss: Fetch from Network
    │   └─► Update Cache (if fetched)
    │
    ├─► API Request (Dynamic)
    │   ├─► Network First
    │   └─► Fallback to Cache (if offline)
    │
    └─► Offline Fallback
        └─► Return Offline Page
```

### 4. State Management Flow

```
Component Action
    │
    ▼
Update Local State (useState)
    │
    ├─► Trigger Re-render
    │
    ├─► Side Effect (useEffect)
    │   ├─► Persist to LocalStorage
    │   └─► Sync with Service Worker (future)
    │
    └─► History Stack Update
        ├─► Push New State
        └─► Enable Undo/Redo
```

---

## Technology Stack

### Core Stack (MVP)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 19.0.0 | UI library |
| **Language** | TypeScript | 5.8.2 | Type safety |
| **Build Tool** | Vite | 6.2.0 | Fast builds, HMR |
| **Styling** | CSS (Vanilla) | - | Custom styles |
| **AI Integration** | Google GenAI | 0.7.0 | Dashboard generation |
| **State Management** | React Hooks | (built-in) | Local state |
| **Storage** | LocalStorage API | (browser) | Persistence |
| **Service Worker** | Workbox (future) | TBD | Offline support |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| TypeScript | Type checking |
| Vite Dev Server | Development |
| Chrome DevTools | Debugging |

### Future Stack Additions

#### Stack A: Portable Stack
- **Database:** PostgreSQL (self-hosted or managed)
- **ORM:** Prisma or Drizzle
- **Backend:** Next.js API Routes
- **Auth:** NextAuth.js
- **Deployment:** Vercel + Any Postgres provider

**Pros:**
- Full control over database
- Portable to any hosting provider
- No vendor lock-in
- Lower long-term costs

**Cons:**
- More setup complexity
- Manual scaling configuration
- More operational overhead
- Need to build auth from scratch

**Use When:**
- Need full database control
- Require custom database configuration
- Planning multi-cloud deployment
- Have dedicated DevOps team
- Cost optimization is priority at scale

#### Stack B: Lovable.dev Baseline (RECOMMENDED)
- **Backend Platform:** Supabase
- **Database:** PostgreSQL (Supabase-managed)
- **Auth:** Supabase Auth
- **Realtime:** Supabase Realtime
- **Storage:** Supabase Storage
- **Deployment:** Vercel + Supabase

**Pros:**
- Fastest time to market
- Built-in auth and RLS
- Realtime subscriptions out-of-box
- Excellent developer experience
- Automatic backups and scaling

**Cons:**
- Vendor lock-in to Supabase
- Limited database customization
- Higher costs at massive scale
- Learning curve for RLS policies

**Use When:**
- Need rapid development
- Want managed infrastructure
- Require real-time features
- Team is small/startup
- PWA with sync is priority

### Stack Comparison Matrix

| Feature | Stack A (Portable) | Stack B (Supabase) |
|---------|-------------------|-------------------|
| **Time to Market** | Slower (4-6 weeks) | Faster (2-3 weeks) |
| **Operational Complexity** | Higher | Lower |
| **Vendor Lock-in** | None | Moderate |
| **Scalability** | Manual | Automatic |
| **Real-time Support** | Custom build | Built-in |
| **Auth Complexity** | High | Low |
| **Cost (Small Scale)** | Similar | Similar |
| **Cost (Large Scale)** | Lower | Higher |
| **Developer Experience** | Good | Excellent |
| **Community Support** | Large (Postgres) | Growing (Supabase) |

### Recommendation: Stack B (Supabase)

For DashGen's use case, **Stack B (Supabase)** is recommended because:

1. **Faster MVP to market:** Built-in auth, database, and realtime
2. **PWA sync capabilities:** Easy cross-device synchronization
3. **Row-Level Security:** Perfect for multi-tenant isolation
4. **Developer productivity:** Less boilerplate, more features
5. **Startup-friendly:** Managed infrastructure reduces operational burden

**Migration Path:** If vendor lock-in becomes a concern, Supabase uses standard PostgreSQL, making migration to Stack A feasible with moderate effort.

---

## Deployment Architecture

### Current (MVP): Static Hosting

```
GitHub Repository
    │
    │ git push
    ▼
GitHub Actions (CI)
    │
    ├─► Lint & Type Check
    ├─► Run Tests
    ├─► Security Scan
    └─► Build Assets
        │
        ▼
    Vite Build Output
        │
        ▼
Vercel Deployment
    │
    ├─► Edge Network (CDN)
    ├─► SSL/TLS Certificate
    └─► Custom Domain
        │
        ▼
    End Users (Global)
```

### Deployment Topology (Current)

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel Edge Network                      │
│                       (Global CDN)                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Region: US-East          Region: EU-West    Region: APAC   │
│  ┌──────────────┐        ┌──────────────┐  ┌─────────────┐ │
│  │ Static Assets│        │Static Assets │  │Static Assets│ │
│  │   (Cached)   │        │  (Cached)    │  │  (Cached)   │ │
│  └──────────────┘        └──────────────┘  └─────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
                    ┌──────────────┐
                    │  End Users   │
                    │  (Browsers)  │
                    └──────────────┘
```

### Future: Full-Stack Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel Platform                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐         ┌──────────────────────────┐ │
│  │  Static Assets   │         │   Edge Functions         │ │
│  │   (Frontend)     │         │   (API Routes)           │ │
│  └──────────────────┘         └──────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Private Link
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Platform                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  PostgreSQL  │  │  Auth Server │  │  Realtime API   │  │
│  │  (Database)  │  │    (Auth)    │  │  (WebSockets)   │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Cloudflare (Optional)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │    WAF    │  │Rate Limiting │  │  Security Headers  │  │
│  └───────────┘  └──────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Environment Strategy

| Environment | Purpose | URL | Database | Deployment |
|-------------|---------|-----|----------|------------|
| **Local** | Development | localhost:3000 | LocalStorage | `npm run dev` |
| **Preview** | PR Reviews | `*.vercel.app` | Supabase (dev) | Auto on PR |
| **Staging** | QA Testing | staging.dashgen.app | Supabase (staging) | Auto on merge to `develop` |
| **Production** | Live Users | dashgen.app | Supabase (prod) | Manual approval on `main` |

---

## Security Architecture

### Defense in Depth Layers

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 7: User Education (Phishing awareness, best practices)│
├─────────────────────────────────────────────────────────────┤
│ Layer 6: Application Logic (Input validation, auth checks)  │
├─────────────────────────────────────────────────────────────┤
│ Layer 5: Content Security (CSP, XSS prevention, sanitization)│
├─────────────────────────────────────────────────────────────┤
│ Layer 4: Network Security (HTTPS, WAF, rate limiting)       │
├─────────────────────────────────────────────────────────────┤
│ Layer 3: Platform Security (Service worker integrity, SRI)  │
├─────────────────────────────────────────────────────────────┤
│ Layer 2: Infrastructure (Vercel security, DDoS protection)  │
├─────────────────────────────────────────────────────────────┤
│ Layer 1: Physical Security (Datacenter security - managed)  │
└─────────────────────────────────────────────────────────────┘
```

### Security Controls (Current MVP)

1. **HTTPS Enforcement**
   - All traffic over TLS 1.3
   - Automatic certificate management (Vercel)
   - HSTS headers

2. **Content Security Policy**
   ```http
   Content-Security-Policy: 
     default-src 'self'; 
     script-src 'self' 'unsafe-inline' https://esm.sh; 
     style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
     font-src 'self' https://fonts.gstatic.com;
     connect-src 'self' https://generativelanguage.googleapis.com;
     img-src 'self' data: https:;
     frame-src 'self';
   ```

3. **Input Sanitization**
   - HTML sanitization for generated content
   - XSS prevention in user prompts
   - SQL injection N/A (no direct DB queries from client)

4. **API Key Protection**
   - API keys in environment variables only
   - Never committed to version control
   - Rotation policy documented

5. **Audit Logging**
   - All user actions logged
   - Correlation IDs for request tracking
   - Structured logging format

### Future Security Enhancements

1. **Authentication & Authorization**
   - JWT-based authentication (Supabase Auth)
   - Row-Level Security (RLS) policies
   - Role-Based Access Control (RBAC)
   - Multi-Factor Authentication (MFA)

2. **Encryption**
   - Database encryption at rest (Supabase managed)
   - Client-side encryption for sensitive data
   - Secure key management

3. **Rate Limiting**
   - API rate limiting (per user)
   - Cloudflare WAF rules
   - DDoS protection

4. **Security Headers**
   ```http
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   X-Content-Type-Options: nosniff
   X-Frame-Options: SAMEORIGIN
   X-XSS-Protection: 1; mode=block
   Referrer-Policy: strict-origin-when-cross-origin
   Permissions-Policy: geolocation=(), microphone=(), camera=()
   ```

For detailed security controls, see [SECURITY.md](./SECURITY.md).

---

## Scalability & Performance

### Current Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| **First Contentful Paint** | < 1.5s | TBD |
| **Largest Contentful Paint** | < 2.5s | TBD |
| **Time to Interactive** | < 3.0s | TBD |
| **Cumulative Layout Shift** | < 0.1 | TBD |
| **First Input Delay** | < 100ms | TBD |
| **Lighthouse PWA Score** | ≥ 90 | TBD |
| **Lighthouse Performance Score** | ≥ 90 | TBD |

### Performance Optimizations

**1. Code Splitting**
- Lazy loading of drawer panels
- Dynamic imports for heavy components
- Route-based code splitting (future)

**2. Asset Optimization**
- Image compression and WebP format
- Font subsetting (Google Fonts)
- CSS minification
- JS tree-shaking

**3. Caching Strategy**
- Service Worker caching (aggressive)
- CDN edge caching (Vercel)
- LocalStorage for session data
- Memoization of expensive computations

**4. Rendering Optimization**
- React.memo for expensive components
- Virtual scrolling for long lists (future)
- Debounced input handlers
- RequestAnimationFrame for animations

### Scalability Considerations

**Current (Client-Side):**
- No server-side bottlenecks
- Scales with CDN edge locations
- Limited by client device capabilities

**Future (Full-Stack):**
- **Horizontal Scaling:** Supabase auto-scales database
- **Caching:** Redis for session management
- **Load Balancing:** Vercel Edge Functions
- **Database Optimization:** Connection pooling, query optimization

### Capacity Planning

| Metric | MVP | V1 (1 year) | V2 (2 years) |
|--------|-----|-------------|--------------|
| **Daily Active Users** | 100 | 10,000 | 100,000 |
| **API Requests/day** | 1,000 | 100,000 | 1,000,000 |
| **Storage (per user)** | 5 MB | 5 MB | 10 MB |
| **Concurrent Users** | 50 | 5,000 | 50,000 |
| **Database Size** | N/A | 10 GB | 100 GB |

---

## Integration Points

### 1. Google Gemini AI API

**Purpose:** Dashboard generation and enhancement

**Integration Type:** REST API (client-side)

**Authentication:** API key (Bearer token)

**Endpoint:**
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContentStream
```

**Request Flow:**
```typescript
import { GoogleGenAI } from '@google/genai';

const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
const stream = await client.models
  .generateContentStream({
    model: 'gemini-2.0-flash-lite',
    prompt: userPrompt,
    config: { responseFormat: 'json' }
  });
```

**Error Handling:**
- Network errors: Retry with exponential backoff
- API errors: Display user-friendly message
- Rate limit errors: Queue requests

**Monitoring:**
- Request/response times
- Success/failure rates
- Token usage

### 2. LocalStorage API

**Purpose:** Client-side persistence

**Storage Format:** JSON-serialized objects

**Data Stored:**
- Sessions (prompts, timestamps)
- Artifacts (generated HTML)
- User settings
- History stack (undo/redo)

**Quota Management:**
- Max 5-10MB per origin
- Automatic cleanup of old sessions
- User notification on quota exceeded

### 3. Service Worker API

**Purpose:** Offline functionality, caching

**Registration:**
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
```

**Cache Management:**
- Static assets: Cache-first
- API requests: Network-first
- Offline fallback: Cache-only

**Update Strategy:**
- Background download of new version
- User-prompted refresh

### Future Integrations

**Supabase:**
- Authentication (OAuth, email/password)
- PostgreSQL database (realtime sync)
- File storage (user uploads)
- Edge functions (serverless API)

**Stripe:**
- Payment processing
- Subscription management
- Webhook handlers

**Analytics:**
- Google Analytics (usage tracking)
- Sentry (error tracking)
- Mixpanel (user behavior)

---

## Future Architecture

### Multi-Tenant Architecture (Future)

```
User Request
    │
    ▼
Cloudflare WAF
    │
    ▼
Vercel Edge Function (API Gateway)
    │
    ├─► Authentication Check (JWT)
    │   └─► Supabase Auth
    │
    ├─► Rate Limiting (per tenant)
    │
    └─► Route to Service
        │
        ├─► Frontend (Static)
        │   └─► Vercel CDN
        │
        ├─► API Routes (Dynamic)
        │   └─► Vercel Edge Functions
        │       │
        │       ▼
        │   Supabase Database
        │   (with RLS policies)
        │
        └─► AI Generation
            └─► Gemini API
```

### Data Synchronization (Future)

```
Device A (PWA)                  Cloud (Supabase)              Device B (PWA)
    │                                │                            │
    │ 1. Generate Dashboard          │                            │
    │────────────────────────────────>                            │
    │                                │                            │
    │                          2. Save to DB                      │
    │                          (with user_id)                     │
    │                                │                            │
    │                         3. Realtime Broadcast               │
    │                                │────────────────────────────>
    │                                │                            │
    │                                │        4. Receive Update   │
    │                                │        & Sync LocalStorage │
    │                                │                            │
```

### Microservices Architecture (Future V2)

```
┌────────────────────────────────────────────────────────────────┐
│                       API Gateway (Vercel)                      │
└────────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Generation  │    │     User     │    │   Payment    │
│   Service    │    │   Service    │    │   Service    │
│  (Gemini AI) │    │   (Auth)     │    │   (Stripe)   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                    ┌──────────────┐
                    │  PostgreSQL  │
                    │  (Supabase)  │
                    └──────────────┘
```

---

## Diagrams

### C4 Model - Context Diagram

```
                    ┌─────────────────────┐
                    │   DashGen User      │
                    │  (Person)           │
                    └──────────┬──────────┘
                               │
                               │ Uses
                               ▼
                    ┌─────────────────────┐
                    │   DashGen System    │
                    │  (Software System)  │
                    │                     │
                    │ Generates dashboard │
                    │ UIs with AI         │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
        ┌─────────────┐ ┌──────────┐ ┌──────────────┐
        │ Google      │ │ Vercel   │ │  Browser     │
        │ Gemini AI   │ │ Platform │ │  Storage API │
        │ (External)  │ │(Hosting) │ │  (Built-in)  │
        └─────────────┘ └──────────┘ └──────────────┘
```

### Sequence Diagram - Dashboard Generation

```
User          Frontend       Gemini API       LocalStorage
  │               │               │                 │
  │  1. Enter     │               │                 │
  │  Prompt       │               │                 │
  ├──────────────>│               │                 │
  │               │               │                 │
  │               │ 2. Stream     │                 │
  │               │ Request       │                 │
  │               ├──────────────>│                 │
  │               │               │                 │
  │               │ 3. Stream     │                 │
  │               │ Response      │                 │
  │               │<──────────────┤                 │
  │               │               │                 │
  │  4. Display   │               │                 │
  │  Streaming    │               │                 │
  │<──────────────┤               │                 │
  │               │               │                 │
  │               │ 5. Save       │                 │
  │               │ Session       │                 │
  │               ├────────────────────────────────>│
  │               │               │                 │
  │  6. Complete  │               │                 │
  │<──────────────┤               │                 │
  │               │               │                 │
```

---

## Conclusion

This architecture provides a solid foundation for a **secure, scalable, and performant** PWA-first dashboard generator. The design prioritizes:

- **User experience** with offline capabilities
- **Security** with OWASP ASVS alignment
- **Developer experience** with modern tooling
- **Future scalability** with clear migration path to full-stack

The recommended **Stack B (Supabase)** offers the fastest path to production while maintaining flexibility for future growth.

---

**Next Steps:**
1. Review and approve architecture
2. Implement Phase 1 (PWA features)
3. Set up CI/CD pipeline
4. Security audit
5. Performance testing

**Related Documents:**
- [PRD.md](./PRD.md) - Product Requirements
- [SECURITY.md](./SECURITY.md) - Security Controls
- [API.md](./API.md) - API Specifications
- [OPERATIONS.md](./OPERATIONS.md) - Operational Runbook

---

**Document Metadata:**
- **Author:** Architecture Team
- **Reviewers:** Engineering, Security
- **Next Review:** 2026-04-14
- **Version History:** See CHANGELOG.md
