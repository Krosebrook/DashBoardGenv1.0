# Privacy Documentation
## DashGen: AI-Powered Dashboard Generator

**Version:** 1.0.0  
**Last Updated:** 2026-01-14  
**Privacy Policy:** See Privacy Policy section below

---

## Table of Contents
1. [Privacy Overview](#privacy-overview)
2. [Data Classification](#data-classification)
3. [Data Collection](#data-collection)
4. [Data Usage](#data-usage)
5. [Data Storage & Retention](#data-storage--retention)
6. [Data Protection](#data-protection)
7. [User Rights](#user-rights)
8. [PII Handling](#pii-handling)
9. [PHI Handling](#phi-handling)
10. [Payment Data Handling](#payment-data-handling)
11. [Third-Party Services](#third-party-services)
12. [Privacy Policy](#privacy-policy)

---

## Privacy Overview

DashGen is built with **Privacy by Design** principles:
- **Data Minimization:** Collect only what's necessary
- **Purpose Limitation:** Use data only for stated purposes
- **Storage Limitation:** Retain data only as long as needed
- **Transparency:** Clear communication about data practices
- **User Control:** Users control their data

### Privacy Commitment

We are committed to protecting user privacy and comply with:
- **GDPR** (General Data Protection Regulation) - EU
- **CCPA** (California Consumer Privacy Act) - California, USA
- **HIPAA** (when handling PHI) - Future
- **PCI DSS** (when handling payment data) - Future

---

## Data Classification

### Classification Levels

| Level | Description | Examples | Protection |
|-------|-------------|----------|------------|
| **Public** | No privacy concerns | Marketing materials, public docs | Standard |
| **Internal** | Non-sensitive internal data | App configuration, public IDs | Standard |
| **Confidential** | Sensitive business data | User prompts (transient), API keys | Encrypted in transit |
| **Restricted** | PII, PHI, Payment data | Email, health info, payment details | Encrypted at rest & in transit |

### Data Categories

**1. User-Generated Content**
- **Classification:** Confidential (transient)
- **Examples:** Dashboard generation prompts
- **Storage:** NOT stored server-side in MVP (client-side only)
- **Retention:** Session-based (cleared on close)

**2. Generated Artifacts**
- **Classification:** Internal
- **Examples:** Dashboard HTML/CSS
- **Storage:** LocalStorage (client-side)
- **Retention:** User-controlled (can clear anytime)

**3. Technical Data**
- **Classification:** Internal
- **Examples:** Browser type, screen resolution, performance metrics
- **Storage:** LocalStorage + Analytics (anonymized)
- **Retention:** 30 days (analytics), permanent (local)

**4. Personally Identifiable Information (PII)** - Future
- **Classification:** Restricted
- **Examples:** Email, name, IP address
- **Storage:** Database (encrypted)
- **Retention:** Per user request or regulatory requirements

**5. Protected Health Information (PHI)** - Not Applicable in MVP
- **Classification:** Restricted
- **Examples:** Patient data visualized in dashboards
- **Storage:** N/A (users don't upload health data)
- **Retention:** N/A

**6. Payment Information** - Future
- **Classification:** Restricted
- **Examples:** Credit card details, billing address
- **Storage:** Stripe only (not in our systems)
- **Retention:** Per Stripe policies

---

## Data Collection

### What We Collect (MVP)

**1. Application Usage Data**
- **What:** Dashboard generation attempts, feature usage
- **Why:** To improve the application
- **How:** LocalStorage, console logs (dev mode only)
- **Legal Basis:** Legitimate interest

**2. Technical Information**
- **What:** Browser type, version, operating system
- **Why:** To ensure compatibility and debug issues
- **How:** User agent string (standard web API)
- **Legal Basis:** Legitimate interest

**3. Performance Metrics**
- **What:** Load times, render times, error rates
- **Why:** To optimize performance
- **How:** Browser Performance API
- **Legal Basis:** Legitimate interest

### What We DON'T Collect (MVP)

- ❌ Email addresses
- ❌ Names
- ❌ Physical addresses
- ❌ Phone numbers
- ❌ Payment information
- ❌ Health information
- ❌ Precise geolocation
- ❌ Biometric data
- ❌ User prompts (server-side)

### What We Will Collect (Future - with consent)

**When Authentication is Implemented:**
- Email address (for account creation)
- IP address (for security monitoring)
- Login timestamps (for audit logs)
- Device identifiers (for session management)

**When Analytics are Implemented:**
- Anonymized usage patterns
- Feature adoption metrics
- Error reports (without PII)

---

## Data Usage

### Purposes

We use collected data ONLY for the following purposes:

**1. Core Application Functionality**
- Generate dashboard UIs via AI
- Provide offline capabilities
- Enable history and undo/redo features

**2. Performance Optimization**
- Monitor and improve load times
- Optimize caching strategies
- Debug performance issues

**3. Security & Fraud Prevention**
- Detect and prevent abuse
- Monitor for security threats
- Audit user actions (future)

**4. Product Improvement**
- Understand feature usage
- Identify bugs and issues
- Prioritize new features

**5. Legal Compliance**
- Maintain audit logs (future)
- Respond to legal requests
- Ensure regulatory compliance

### We DO NOT:
- ❌ Sell user data to third parties
- ❌ Use data for advertising
- ❌ Share data with unauthorized parties
- ❌ Use data for unrelated purposes

---

## Data Storage & Retention

### Storage Locations (MVP)

**Client-Side Storage:**
- **Location:** User's browser (LocalStorage)
- **Data:** Sessions, artifacts, settings
- **Encryption:** Browser-level (platform-dependent)
- **Access:** Only accessible by the application on the same origin

**No Server-Side Storage in MVP**

### Storage Locations (Future)

**Database (Supabase):**
- **Location:** AWS (region: US-East or EU-West based on user)
- **Data:** User accounts, sessions, artifacts
- **Encryption:** AES-256 encryption at rest
- **Access:** Row-Level Security (RLS) policies

**Object Storage (Supabase Storage):**
- **Location:** AWS S3-compatible
- **Data:** Large artifacts, exported files
- **Encryption:** AES-256 encryption at rest
- **Access:** Authenticated users only

### Retention Policies

| Data Type | Retention Period | Deletion Method |
|-----------|------------------|-----------------|
| **Generated Artifacts (Local)** | User-controlled | Manual (Clear History button) |
| **Session Data (Local)** | User-controlled | Manual (Clear History button) |
| **User Accounts (Future)** | Until account deletion | Automated + manual verification |
| **Audit Logs (Future)** | 1 year (compliance) | Automated purge |
| **Analytics Data (Future)** | 30 days | Automated purge |
| **Backup Data (Future)** | 90 days | Automated purge |

### Data Deletion

**MVP (Client-Side):**
- Users can clear history anytime via "Clear History" button
- Clears all LocalStorage data for the application
- No server-side data to delete

**Future (Server-Side):**
- "Delete My Account" feature
- 30-day grace period for account recovery
- Permanent deletion after grace period
- Audit log entry retained per compliance requirements

---

## Data Protection

### Technical Safeguards

**1. Encryption in Transit**
- All connections use HTTPS/TLS 1.3
- Strict Transport Security (HSTS) enabled
- Certificate pinning (future mobile app)

**2. Encryption at Rest**
- LocalStorage: Browser-level encryption (platform-dependent)
- Future database: AES-256 encryption
- Future files: AES-256 encryption

**3. Access Controls**
- Browser same-origin policy
- Future: Row-Level Security (RLS) in database
- Future: Role-Based Access Control (RBAC)

**4. Authentication & Authorization** (Future)
- JWT-based authentication
- MFA for sensitive operations
- Session expiration and refresh

**5. Input Validation**
- All user inputs validated
- HTML sanitization for generated content
- Protection against XSS, injection attacks

**6. Audit Logging**
- All security-relevant events logged
- Correlation IDs for request tracing
- Immutable audit trail

### Organizational Safeguards

**1. Security Training**
- Annual security training for all team members
- Privacy awareness training
- Secure coding practices

**2. Access Management**
- Least privilege principle
- Regular access reviews
- Immediate revocation upon departure

**3. Vendor Management**
- Vendor security assessments
- Data Processing Agreements (DPAs)
- Regular vendor audits

**4. Incident Response**
- 24/7 security monitoring (future)
- Incident response plan
- Breach notification procedures

---

## User Rights

### Your Rights Under GDPR

**1. Right to Access**
- Request a copy of your data
- Understand how your data is used
- **How:** Email privacy@dashgen.app

**2. Right to Rectification**
- Correct inaccurate data
- Complete incomplete data
- **How:** Update settings (future) or email us

**3. Right to Erasure ("Right to be Forgotten")**
- Delete your data
- Clear your history
- **How:** "Clear History" button or "Delete Account" (future)

**4. Right to Restrict Processing**
- Limit how we use your data
- **How:** Email privacy@dashgen.app

**5. Right to Data Portability**
- Export your data in machine-readable format
- **How:** "Export" feature (future) or email us

**6. Right to Object**
- Object to data processing
- **How:** Email privacy@dashgen.app

**7. Right to Withdraw Consent**
- Withdraw consent at any time
- **How:** Update settings (future) or email us

**8. Right to Lodge a Complaint**
- File a complaint with supervisory authority
- **How:** Contact your local data protection authority

### Your Rights Under CCPA (California)

**1. Right to Know**
- What data we collect
- How we use it
- Who we share it with

**2. Right to Delete**
- Request deletion of your data
- With certain exceptions

**3. Right to Opt-Out**
- Opt out of data sale (N/A - we don't sell data)

**4. Right to Non-Discrimination**
- Equal service regardless of privacy choices

---

## PII Handling

### Current State (MVP)

**No PII Collected:**
- MVP does not require user accounts
- No email, name, or contact information collected
- IP addresses not logged
- Browser fingerprinting not used

### Future State (with Authentication)

**PII Categories:**
- Email address (for authentication)
- IP address (for security monitoring)
- Device identifiers (for session management)
- Usage timestamps

**PII Protection Measures:**

**1. Collection Minimization**
- Collect only essential PII
- No unnecessary data points
- Optional fields clearly marked

**2. Purpose Specification**
- Clear notice of why we collect PII
- Consent for non-essential collection
- No secondary use without consent

**3. Storage Limitation**
- Retain only as long as necessary
- Automated deletion after retention period
- Anonymization where possible

**4. Security Measures**
- Encryption at rest and in transit
- Access controls and logging
- Regular security audits

**5. Third-Party Sharing**
- No sharing without consent
- Data Processing Agreements (DPAs)
- Vendor security assessments

**6. User Control**
- Access, modify, delete PII
- Export PII (data portability)
- Opt-out of optional collection

---

## PHI Handling

### Current State (MVP)

**No PHI Collected:**
- DashGen does not collect, store, or process PHI
- Generated dashboards may visualize health data, but data remains client-side
- No HIPAA compliance required for MVP

### Future State (if PHI is involved)

**If DashGen integrates with healthcare systems or allows PHI upload:**

**HIPAA Compliance Requirements:**

**1. Business Associate Agreement (BAA)**
- Sign BAA with Supabase (or hosting provider)
- Ensure all vendors are HIPAA-compliant
- Maintain BAA documentation

**2. Administrative Safeguards**
- Security management process
- Workforce security training
- Information access management
- Security incident procedures

**3. Physical Safeguards**
- Facility access controls
- Workstation security
- Device and media controls

**4. Technical Safeguards**
- Access controls (unique user IDs, automatic logoff)
- Audit controls (track PHI access)
- Integrity controls (prevent tampering)
- Transmission security (encryption)

**5. Breach Notification**
- Notify affected individuals within 60 days
- Report to HHS within 60 days
- Maintain breach documentation

**6. Minimum Necessary Rule**
- Limit PHI access to minimum necessary
- Role-based access controls
- Justification for PHI access

### PHI De-identification

If visualization of health data is required without PHI protection:

**Safe Harbor Method:**
- Remove 18 HIPAA identifiers
- No actual knowledge of re-identification risk

**Expert Determination Method:**
- Expert applies statistical methods
- Very small risk of re-identification

---

## Payment Data Handling

### Current State (MVP)

**No Payment Processing:**
- MVP is free to use
- No payment information collected
- No PCI DSS requirements

### Future State (with Payments)

**PCI DSS Compliance:**

**1. Never Store Card Data**
- All payment processing via Stripe
- Stripe.js for client-side tokenization
- No card details touch our servers

**2. SAQ A Compliance**
- PCI Self-Assessment Questionnaire (SAQ) A
- Merchant only redirects to Stripe
- Minimal PCI scope

**3. Secure Payment Flow**
```
User → Stripe Checkout → Stripe API → Webhook → Our Backend
      (Card Data)        (Token)      (Confirm)  (Update Account)
```

**4. Data We Store (Stripe Metadata Only)**
- Customer ID (Stripe)
- Subscription ID (Stripe)
- Last 4 digits of card (display only)
- Card brand (Visa, Mastercard, etc.)
- Transaction timestamps

**5. Audit Logging**
- All payment events logged
- Subscription changes tracked
- Failed payment attempts recorded
- Webhook signature verification

**6. Security Controls**
- HTTPS for all payment pages
- Webhook signature verification
- Idempotency keys for retries
- Rate limiting on payment endpoints

---

## Third-Party Services

### Current Third-Party Services

**1. Google Gemini AI**
- **Purpose:** Dashboard generation
- **Data Shared:** User prompts (transient, not stored by Google per API terms)
- **Privacy Policy:** https://policies.google.com/privacy
- **Data Location:** Google Cloud (global)
- **Data Processing Agreement:** Google Cloud Terms

**2. Vercel (Hosting)**
- **Purpose:** Application hosting and CDN
- **Data Shared:** Technical data (IP, user agent for logs)
- **Privacy Policy:** https://vercel.com/legal/privacy-policy
- **Data Location:** AWS (global edge network)
- **Data Processing Agreement:** Available on request

**3. Google Fonts**
- **Purpose:** Web fonts
- **Data Shared:** Font requests (IP address in logs)
- **Privacy Policy:** https://policies.google.com/privacy
- **Data Location:** Google CDN
- **GDPR Compliance:** Self-hosting option available

**4. esm.sh (CDN)**
- **Purpose:** JavaScript module delivery
- **Data Shared:** Module requests (IP address in logs)
- **Privacy Policy:** https://esm.sh/privacy
- **Data Location:** Cloudflare CDN

### Future Third-Party Services

**5. Supabase (Backend)**
- **Purpose:** Database, auth, storage
- **Data Shared:** User accounts, sessions, artifacts
- **Privacy Policy:** https://supabase.com/privacy
- **Data Location:** AWS (configurable region)
- **Data Processing Agreement:** Available
- **GDPR/CCPA Compliant:** Yes

**6. Stripe (Payments)**
- **Purpose:** Payment processing
- **Data Shared:** Payment information (handled by Stripe)
- **Privacy Policy:** https://stripe.com/privacy
- **Data Location:** Global
- **PCI DSS Level 1 Certified:** Yes
- **Data Processing Agreement:** Available

**7. Sentry (Error Tracking)**
- **Purpose:** Error monitoring
- **Data Shared:** Error logs (scrubbed of PII)
- **Privacy Policy:** https://sentry.io/privacy/
- **Data Location:** US (configurable)
- **Data Processing Agreement:** Available
- **GDPR Compliant:** Yes

---

## Privacy Policy

### Formal Privacy Policy for DashGen

**Effective Date:** 2026-01-14  
**Last Updated:** 2026-01-14

---

#### 1. Introduction

Welcome to DashGen ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our application.

---

#### 2. Information We Collect

**2.1 Information You Provide**
- **MVP:** None (no account creation)
- **Future:** Email address (for account creation and communication)

**2.2 Automatically Collected Information**
- Browser type and version
- Operating system
- Device type (desktop, mobile, tablet)
- Performance metrics (load times, error rates)
- Feature usage (which features you use)

**2.3 Cookies and Similar Technologies**
- **MVP:** LocalStorage for session persistence
- **Future:** Cookies for authentication

---

#### 3. How We Use Your Information

We use your information to:
- Provide and maintain the application
- Generate dashboard UIs using AI
- Enable offline functionality
- Improve performance and fix bugs
- Ensure security and prevent fraud
- Comply with legal obligations

---

#### 4. Data Sharing and Disclosure

**4.1 Third-Party Services**
We share data with:
- **Google Gemini AI:** For dashboard generation (prompts sent transiently)
- **Vercel:** For hosting (technical logs only)
- **Future: Supabase:** For database and authentication
- **Future: Stripe:** For payment processing

**4.2 Legal Requirements**
We may disclose your information if required by law or in response to:
- Court orders or subpoenas
- Legal processes
- Requests from law enforcement
- Protection of rights and safety

**4.3 Business Transfers**
In the event of a merger, acquisition, or sale, your data may be transferred to the acquiring entity.

---

#### 5. Data Security

We implement industry-standard security measures:
- HTTPS/TLS encryption
- Secure storage practices
- Access controls
- Regular security audits
- Incident response procedures

However, no method of transmission or storage is 100% secure. We cannot guarantee absolute security.

---

#### 6. Data Retention

- **Local Data:** Retained until you clear your browser history or use "Clear History" feature
- **Future Server Data:** Retained as long as your account is active plus retention periods per legal requirements

---

#### 7. Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate data
- Delete your data
- Restrict or object to processing
- Data portability
- Withdraw consent
- Lodge a complaint with a supervisory authority

To exercise these rights, contact: privacy@dashgen.app

---

#### 8. Children's Privacy

DashGen is not intended for children under 13 (or 16 in the EU). We do not knowingly collect data from children. If you believe we have collected data from a child, contact us immediately.

---

#### 9. International Data Transfers

- **MVP:** Data processed client-side (your browser)
- **Future:** Data may be transferred to US or EU servers depending on your region

We ensure adequate safeguards for international transfers (Standard Contractual Clauses, etc.).

---

#### 10. Changes to This Policy

We may update this privacy policy periodically. We will notify you of significant changes by:
- Posting the updated policy on our website
- Updating the "Last Updated" date
- Email notification (if you have an account)

Continued use of DashGen after changes constitutes acceptance of the updated policy.

---

#### 11. Contact Us

For privacy-related questions or concerns:

**Email:** privacy@dashgen.app  
**Security Issues:** security@dashgen.app  
**Data Protection Officer:** dpo@dashgen.app (future)

**Mailing Address:**  
[Company Name]  
[Street Address]  
[City, State, ZIP]  
[Country]

---

#### 12. Jurisdiction-Specific Rights

**12.1 European Economic Area (EEA) - GDPR**
- Legal basis for processing: Consent, legitimate interest, contract performance
- Data Protection Officer: dpo@dashgen.app (future)
- Supervisory Authority: Your local data protection authority
- Right to lodge a complaint

**12.2 California - CCPA**
- Right to know what data is collected
- Right to delete data
- Right to opt-out of data sale (N/A - we don't sell data)
- Right to non-discrimination
- Contact: privacy@dashgen.app

**12.3 Other Jurisdictions**
We comply with applicable privacy laws in your jurisdiction. Contact us for specific information.

---

## Privacy Incident Response

### Breach Notification Procedures

**Detection:**
- Automated monitoring systems
- Security audits
- User reports
- Vendor notifications

**Assessment:**
1. Determine scope and severity
2. Identify affected individuals
3. Assess risk to individuals
4. Document findings

**Notification Timeline:**
- **GDPR:** Within 72 hours to supervisory authority
- **CCPA:** Without unreasonable delay
- **HIPAA:** Within 60 days (if applicable)
- **Individuals:** As soon as reasonably possible

**Notification Content:**
- Nature of the breach
- Data involved
- Likely consequences
- Measures taken
- Recommended actions for individuals
- Contact information

**Remediation:**
- Contain the breach
- Fix vulnerabilities
- Implement preventive measures
- Update security controls

---

## Conclusion

Privacy is fundamental to DashGen's design. We are committed to:
- Transparency in data practices
- User control over data
- Compliance with privacy regulations
- Continuous improvement of privacy safeguards

For questions or concerns about privacy, contact: **privacy@dashgen.app**

---

**Document Metadata:**
- **Author:** Privacy Team
- **Reviewers:** Legal, Security, Engineering
- **Next Review:** 2026-02-14 (Monthly during early development)
- **Classification:** Public
- **Version History:** See CHANGELOG.md
