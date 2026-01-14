<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# DashGen: AI-Powered Dashboard Generator

**Production-Ready | PWA-First | Security-Focused**

> Generate full-stack ready dashboard UIs with charts, grids, and responsive layouts instantly using AI. Built with security, privacy, and compliance at its core.

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://reactjs.org/)
[![OWASP ASVS](https://img.shields.io/badge/OWASP%20ASVS-Level%202-green)](https://owasp.org/www-project-application-security-verification-standard/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8)](https://web.dev/progressive-web-apps/)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** 9+ or **yarn** 1.22+
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### One-Command Setup

```bash
# Clone the repository
git clone https://github.com/Krosebrook/DashBoardGenv1.0.git
cd DashBoardGenv1.0

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY

# Start development server
npm run dev
```

**That's it!** Open http://localhost:3000 in your browser.

---

## 📋 Table of Contents

- [Features](#-features)
- [Documentation](#-documentation)
- [Installation](#-installation)
- [Usage](#-usage)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Security](#-security)
- [Contributing](#-contributing)
- [Architecture](#-architecture)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Support](#-support)

---

## ✨ Features

### Current (MVP)

- **🤖 AI-Powered Generation:** Create dashboard UIs from natural language prompts
- **🎨 Multi-Framework Support:** Vanilla CSS, Tailwind, React MUI, Bootstrap, Foundation
- **📱 PWA-First:** Offline capabilities, installable, fast
- **🔄 Real-Time Streaming:** See your dashboard being generated live
- **🎯 Layout Variations:** Multiple pre-defined layouts to choose from
- **✨ Style Enhancements:** Glassmorphism, Neon, Modern, and more
- **📜 History Management:** Unlimited undo/redo, session persistence
- **💾 Offline Support:** Continue working without internet (cached artifacts)
- **📤 Export Functionality:** Download or copy generated HTML
- **♿ Accessibility:** WCAG 2.1 Level AA compliant
- **🔒 Security:** OWASP ASVS Level 2 controls

### Coming Soon (V1)

- **👤 User Authentication:** Secure login via Supabase Auth
- **☁️ Cloud Sync:** Access your dashboards from any device
- **🤝 Collaboration:** Share and collaborate on dashboards
- **💳 Subscription Plans:** Pro and Enterprise tiers
- **📊 Analytics:** Usage insights and metrics
- **🔐 Advanced Security:** MFA, RBAC, audit logging

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

| Document | Description |
|----------|-------------|
| **[PRD.md](./PRD.md)** | Product Requirements Document - features, goals, requirements |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System architecture, tech stack, deployment topology |
| **[SECURITY.md](./SECURITY.md)** | Security controls, OWASP ASVS mapping, threat model |
| **[PRIVACY.md](./PRIVACY.md)** | Privacy policy, data handling, PII/PHI/payment guidelines |
| **[API.md](./API.md)** | API contracts, authentication, versioning *(coming soon)* |
| **[TESTING.md](./TESTING.md)** | Testing strategy, commands, coverage *(coming soon)* |
| **[OPERATIONS.md](./OPERATIONS.md)** | Operational runbook, monitoring, alerts *(coming soon)* |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Contribution guidelines, code standards *(coming soon)* |
| **[CHANGELOG.md](./CHANGELOG.md)** | Version history and release notes *(coming soon)* |

---

## 🔧 Installation

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/Krosebrook/DashBoardGenv1.0.git
cd DashBoardGenv1.0

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local

# 4. Add your Gemini API key to .env.local
# GEMINI_API_KEY=your_api_key_here

# 5. Start the development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (for future features)
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

**⚠️ Never commit `.env.local` to version control!**

---

## 🎯 Usage

### Generate Your First Dashboard

1. **Enter a Prompt:** Describe the dashboard you want to create
   ```
   Example: "Create a sales dashboard with revenue chart, 
   top products table, and monthly growth metrics"
   ```

2. **Select Framework:** Choose your preferred CSS framework
   - Vanilla CSS
   - Tailwind
   - React MUI
   - Bootstrap
   - Foundation

3. **Generate:** Click "Generate" and watch your dashboard being created in real-time

4. **Customize:** Apply layouts, enhance styles, or generate variations

5. **Export:** Download the HTML or copy to clipboard

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + H` | Toggle History |
| `Ctrl/Cmd + ,` | Open Settings |
| `Ctrl/Cmd + Enter` | Generate Dashboard |

---

## 🛠️ Development

### Project Structure

```
DashBoardGenv1.0/
├── components/          # React components
│   ├── ArtifactCard.tsx
│   ├── CodeEditor.tsx
│   ├── SideDrawer.tsx
│   └── drawer/          # Drawer panels
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types.ts             # TypeScript types
├── constants.ts         # App constants
├── index.tsx            # Entry point
├── index.css            # Global styles
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript config
```

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Build
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Lint code (coming soon)
npm run type-check       # TypeScript type checking (coming soon)
npm run format           # Format code with Prettier (coming soon)

# Testing
npm run test             # Run tests (coming soon)
npm run test:coverage    # Generate coverage report (coming soon)

# Security
npm audit                # Check for vulnerabilities
npm audit fix            # Auto-fix vulnerabilities
```

### Adding New Features

1. **Create Feature Branch:** `git checkout -b feature/your-feature-name`
2. **Implement Feature:** Follow existing code patterns
3. **Write Tests:** Add unit and integration tests
4. **Update Docs:** Update relevant documentation
5. **Submit PR:** Create pull request for review

---

## 🧪 Testing

### Test Strategy

- **Unit Tests:** Component and utility function testing
- **Integration Tests:** Feature workflow testing
- **E2E Tests:** Full user journey testing
- **Security Tests:** Vulnerability and penetration testing
- **Performance Tests:** Load time and PWA metrics

### Running Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all

# Coverage report
npm run test:coverage
```

*(Testing infrastructure coming soon)*

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Krosebrook/DashBoardGenv1.0)

#### Option 2: Manual Deploy

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Set environment variables in Vercel dashboard
# Project Settings → Environment Variables
# Add: GEMINI_API_KEY
```

### Deploy to Other Platforms

<details>
<summary><b>Netlify</b></summary>

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build the project
npm run build

# 3. Deploy
netlify deploy --prod --dir=dist

# 4. Set environment variables in Netlify dashboard
```
</details>

<details>
<summary><b>AWS S3 + CloudFront</b></summary>

```bash
# 1. Build the project
npm run build

# 2. Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# 3. Configure CloudFront distribution
# (See deployment guide in docs)
```
</details>

<details>
<summary><b>Docker</b></summary>

```bash
# 1. Build Docker image
docker build -t dashgen:latest .

# 2. Run container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key dashgen:latest
```
</details>

### Production Checklist

- [ ] Set `GEMINI_API_KEY` environment variable
- [ ] Enable HTTPS/SSL
- [ ] Configure security headers
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics (optional)
- [ ] Set up monitoring and alerts
- [ ] Enable backup and disaster recovery
- [ ] Review security scan results
- [ ] Test performance (Lighthouse)
- [ ] Verify PWA functionality

---

## 🔒 Security

### Security Features

- ✅ **HTTPS Enforced:** All traffic encrypted with TLS 1.3
- ✅ **Content Security Policy:** XSS protection
- ✅ **Input Validation:** Protection against injection attacks
- ✅ **Rate Limiting:** Prevent API abuse
- ✅ **Audit Logging:** Track security events
- ✅ **Dependency Scanning:** Automated vulnerability checks
- ✅ **Secret Scanning:** Prevent credential leaks

### Reporting Security Issues

**DO NOT** open public issues for security vulnerabilities.

Email: **security@dashgen.app**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (optional)

We will respond within 24 hours.

**Bug Bounty Program:** Coming soon

### Security Standards

- **OWASP ASVS Level 2:** Application Security Verification Standard
- **WCAG 2.1 Level AA:** Web Content Accessibility Guidelines
- **PWA Security:** Progressive Web App security best practices

See [SECURITY.md](./SECURITY.md) for detailed security documentation.

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md).

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19
- TypeScript 5.8
- Vite 6.2
- CSS (Vanilla)

**AI Integration:**
- Google Gemini 2.0 Flash Lite

**Future Backend (Stack B - Recommended):**
- Supabase (PostgreSQL, Auth, Realtime)
- Vercel (Hosting, Edge Functions)
- Stripe (Payments)

### Architecture Highlights

- **PWA-First:** Offline-first architecture with service workers
- **Client-Side:** Fully functional without backend (MVP)
- **Scalable:** Ready for cloud backend integration
- **Security by Design:** OWASP ASVS Level 2 aligned
- **Privacy by Default:** Data minimization principles

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

---

## 🗺️ Roadmap

### ✅ MVP (Current)
- [x] AI-powered dashboard generation
- [x] Multiple framework support
- [x] PWA capabilities
- [x] Offline functionality
- [x] History and undo/redo
- [x] Layout variations
- [x] Export functionality

### 🚧 V1 (Q2 2026)
- [ ] User authentication (Supabase)
- [ ] Cloud synchronization
- [ ] Multi-device support
- [ ] Collaboration features
- [ ] Analytics dashboard
- [ ] Payment integration (Stripe)
- [ ] Advanced security (MFA, RBAC)

### 🔮 V2 (Q4 2026)
- [ ] Real-time collaboration
- [ ] Custom component library
- [ ] API integrations (data sources)
- [ ] Mobile app (iOS/Android)
- [ ] Enterprise features (SSO, SAML)
- [ ] White-label option
- [ ] Advanced AI features

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### Get Help

- **Documentation:** [docs/](./docs/)
- **Issues:** [GitHub Issues](https://github.com/Krosebrook/DashBoardGenv1.0/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Krosebrook/DashBoardGenv1.0/discussions)
- **Email:** support@dashgen.app

### Troubleshooting

<details>
<summary><b>Generation fails with "API Error"</b></summary>

**Solution:**
1. Verify `GEMINI_API_KEY` is set in `.env.local`
2. Check API key is valid and has quota remaining
3. Check console for detailed error messages
4. Try again - temporary API issues may resolve
</details>

<details>
<summary><b>Offline mode not working</b></summary>

**Solution:**
1. Ensure service worker is registered (check DevTools → Application → Service Workers)
2. Visit the app online first to cache assets
3. Clear browser cache and try again
4. Check browser supports service workers
</details>

<details>
<summary><b>Build fails</b></summary>

**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Ensure Node.js version is 18+
4. Check for conflicting global packages
</details>

### Community

- **Twitter:** [@DashGenApp](https://twitter.com/DashGenApp) *(coming soon)*
- **Discord:** [Join our server](https://discord.gg/dashgen) *(coming soon)*
- **Blog:** [blog.dashgen.app](https://blog.dashgen.app) *(coming soon)*

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful AI generation capabilities
- **Vercel** for excellent hosting platform
- **React Team** for the amazing framework
- **OWASP** for security standards and guidelines
- **Contributors** who make this project better

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Krosebrook/DashBoardGenv1.0?style=social)
![GitHub forks](https://img.shields.io/github/forks/Krosebrook/DashBoardGenv1.0?style=social)
![GitHub issues](https://img.shields.io/github/issues/Krosebrook/DashBoardGenv1.0)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Krosebrook/DashBoardGenv1.0)

---

<div align="center">

**Built with ❤️ by the DashGen Team**

[Website](https://dashgen.app) • [Documentation](./docs/) • [Twitter](https://twitter.com/DashGenApp) • [Discord](https://discord.gg/dashgen)

</div>
