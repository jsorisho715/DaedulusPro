# Daedalus Pro Platform — Product Requirements Document

**Version:** 1.0 (Initial Draft)
**Owner:** Johnathan
**Status:** Scoping
**Last Updated:** May 2026

---

## 1. Executive Summary

### 1.1 Vision

Daedalus Pro is a vertical SaaS and managed marketplace that replaces on-site maintenance teams in multifamily properties by intelligently routing work orders to a curated network of qualified general contractors and trade specialists. The platform handles compliance, dispatch, AI-assisted estimating, payments, and quality assurance end-to-end.

### 1.2 Core Value Propositions

For property managers and owners:

- Single point of contact across hundreds of vetted vendors.
- Lower headcount cost vs. employing on-site maintenance.
- Compliance, insurance, and licensing handled by Daedalus.
- Faster response on specialty work (low-voltage, IoT, access control, gates).
- Data and SLA reporting across the portfolio.

For general contractors and trades:

- Steady deal flow without paid lead gen.
- Faster pay (factoring/instant-pay options).
- Compliance burden absorbed by the platform.
- Templated workflows that reduce callback rate.
- Transparent rating and ranking system.

### 1.3 Out of Scope (V1)

- Residential single-family work orders.
- Insurance restoration claims (xactimate workflow).
- New construction project management.
- Direct-to-resident handyman service.
- International markets.

### 1.4 Strategic Constraints

- **Geographic launch:** Phoenix and Scottsdale metro first. Expand state-by-state as compliance frameworks are validated.
- **Independent contractor classification:** Platform must avoid dictating worker conduct in ways that trigger employee reclassification under federal DOL or state laws (notably Arizona, California, and other ABC-test states).
- **Compliance-first posture:** Every workflow assumes audit-ready documentation by default.

---

## 2. User Roles and Permissions

The platform supports a multi-tenant model where Daedalus is the platform operator, GCs are vendor tenants, and property management companies (PMCs) are client tenants. Each persona below is a distinct role with its own permission set.

### 2.1 Daedalus Platform Roles

| Role | Description | Key Permissions |
|---|---|---|
| Super Admin | Daedalus C-level. Full system control. | All tenants, billing, feature flags, schema, user impersonation. |
| Platform Ops Manager | Day-to-day platform operations. | Dispatch oversight, escalations, vendor performance, dispute resolution. |
| Compliance Officer | Vendor onboarding and document verification. | COI/W-9/license review, background check coordination, tier assignment. |
| Sales / Business Development | Property and PMC acquisition. | CRM, lead intel, account onboarding, proposal generation. |
| Finance | AR, AP, payouts, reconciliation. | Invoicing, vendor payouts, factoring, 1099, accounting integrations. |
| Support | Tier 1 user support. | Read-only across tenants, ticket creation, limited write on tickets. |

### 2.2 General Contractor (Vendor) Roles

| Role | Description | Key Permissions |
|---|---|---|
| GC Owner / Principal | Vendor company owner. | Full access within own tenant: bidding, finance, team, compliance docs. |
| GC Admin | Operations admin for the GC. | Same as Owner except billing/finance. |
| GC Dispatcher | Assigns techs, schedules jobs, manages routes. | Schedule, assign, reschedule, communicate with PMs and residents. |
| Field Lead / Foreman | Senior field staff who can sign off jobs. | Mobile app + sign-off authority + photo review. |
| Field Technician | Primary field worker. | Mobile app: today's jobs, check-in, photos, voice notes, parts log. |
| GC Estimator | Prepares and submits bids. | Bid composition, template access, AI estimate review. |
| GC Bookkeeper | Vendor-side finance. | Read AR, accept payments, factoring requests. |

### 2.3 Property Management Company Roles

| Role | Description | Key Permissions |
|---|---|---|
| Regional VP / Asset Manager | Portfolio-level oversight. | Cross-property dashboards, SLA reports, spend analytics, vendor preferences. |
| Property Manager | Site-level work order origination and approval. | Create WOs, approve bids, sign off, manage residents, view site reports. |
| Maintenance Supervisor | Coordinates site-level maintenance. | Create WOs, communicate with vendors, photo verification. |
| PMC Vendor Compliance Manager | Validates vendor compliance from the property side. | Read vendor compliance status, request COI updates. |
| PMC AP Clerk | Processes vendor invoices on PMC side. | Invoice approval, PO matching, payment scheduling. |

### 2.4 Resident (Limited Surface)

Residents do not get a full app. They interact via SMS and a lightweight web view for:

- 24-hour notice to enter confirmation.
- Permission-to-enter responses.
- Tech arrival ETA tracking.
- Post-job satisfaction survey.

### 2.5 Permission Model Notes

- All roles are scoped by tenant.
- Super Admin can impersonate any role for support, with full audit logging.
- A single human can hold multiple roles across tenants (e.g., a GC Owner who is also a Field Lead). Login presents a role-switcher when applicable.
- Custom role creation available at Enterprise tier for large PMCs.

---

## 3. Functional Modules

### 3.1 Authentication and Onboarding

#### 3.1.1 Authentication

- Email + password with mandatory MFA for all platform and PMC roles.
- SSO (Google, Microsoft) for PMC users.
- Biometric login on mobile (Face ID, fingerprint).
- Magic link for residents (no account creation).
- Session management with configurable timeout per tenant.
- Password reset and account recovery flows.

#### 3.1.2 GC Onboarding (Application Wizard)

A multi-step wizard for new GCs to apply to the platform:

1. **Company Info:** Legal name, DBA, EIN, business structure, years in business, headcount.
2. **Service Areas:** Map-based selection of ZIP codes or a radius from HQ.
3. **Trades and Skills:** Multi-select trade matrix (electrical, low-voltage, HVAC, plumbing, locksmith, gate technician, IoT installer, etc.) with skill depth per trade.
4. **Licensing:** Upload state and trade-specific licenses with verification API where available (state contractor license boards, EPA 608, NATE, ESA).
5. **Insurance:** Upload COI with parser to extract policy numbers, carriers, limits, and expiration dates. Auto-flag if below platform minimums.
6. **Documentation:** W-9, business license, articles of incorporation.
7. **Team Roster:** Add technicians with role assignments and individual certifications.
8. **Background Check Authorization:** Per-technician background and drug screen consent.
9. **References:** Up to 5 prior client references with auto-outreach.
10. **Pricing Acknowledgment:** Acceptance of platform fee structure and standard markup ranges.
11. **Submission and Review:** Application enters the Compliance Officer queue.

#### 3.1.3 PMC Onboarding

Driven primarily by Daedalus Sales, but with a self-serve fallback:

1. **PMC Profile:** Name, headquarters, regions covered, portfolio size.
2. **Property Roster:** Bulk import of properties (CSV or PMS sync).
3. **Per-Property Config:** Address, unit count, year built, building type, on-site contacts, hours, gate codes (encrypted), special access notes.
4. **Compliance Requirements:** Per-PMC insurance minimums, background check requirements, certifications mandated.
5. **Vendor Preferences:** Approved vendor list, blacklisted vendors, preferred vendors per trade.
6. **Integration Setup:** Yardi/RealPage/Entrata/AppFolio/ResMan/Buildium connection wizard.
7. **Billing Setup:** Net terms, PO requirements, invoice routing, accounting code mappings.
8. **User Provisioning:** Add Regional, PM, Maintenance Supervisor, AP Clerk users.

### 3.2 Compliance and Insurance Module

This is the strategic moat. Built as a dedicated module with deep tooling.

#### 3.2.1 Document Vault

- Centralized vault per GC for all compliance artifacts.
- Document types: COI, W-9, lien waivers, licenses (per state, per trade), bonding, EPA certifications, NATE, OSHA 10/30, drug screen results, background check reports, articles of incorporation, business licenses.
- Each document has metadata: type, issued date, expiration date, issuing authority, verification status, document hash.
- Version history retained indefinitely.

#### 3.2.2 COI Management

- COI parser (OCR + LLM) extracts: insured entity, carrier, policy numbers, coverage limits per line (GL, auto, umbrella, workers comp, professional, cyber), effective and expiration dates, additional insured language, waiver of subrogation.
- Per-PMC and per-property minimum requirements.
- Auto-flag COIs missing additional insured endorsements when required.
- Auto-expiration alerts at 60, 30, 14, 7, and 1 day(s).
- Auto-request re-issuance from carrier or GC.
- One-click COI delivery to PMC compliance teams.

#### 3.2.3 1099 and W-9 Management

- W-9 collected at onboarding and re-validated annually.
- 1099-NEC and 1099-MISC generation at year-end.
- TIN matching with IRS API.
- Distribution via secure download and email.
- Backup withholding logic for vendors who fail TIN match.

#### 3.2.4 Lien Waiver Engine

- Auto-generate state-specific lien waivers tied to job and payment milestones.
- Waiver types: preliminary notice, conditional progress, unconditional progress, conditional final, unconditional final.
- Digital signature and notarization where required.
- Tied to invoice and payment workflow so waivers are always current.

#### 3.2.5 License Verification

- Per-state contractor license board API integrations where available.
- Manual verification queue for states without APIs.
- Trade-specific certification verification (EPA 608, NATE, ESA, BICSI, OSHA).
- License expiration tracking with auto-renewal reminders.
- Geographic enforcement: a GC cannot accept a job in a state where they lack the required license.

#### 3.2.6 Background Checks and Drug Screens

- Integration with Checkr or Sterling for tech-level background checks.
- Drug screen tracking with ordering vendor integration.
- Per-PMC background check requirements (some require fresh checks per property).
- Tech cannot check in on a job if their background check has expired against PMC requirements.

#### 3.2.7 Vendor Compliance Service Integrations

- Two-way sync with NetVendor, Compliance Depot (RealPage Vendor Compliance), RMIS, Vendor Cafe.
- When a PMC requires one of these services, Daedalus pushes documents and pulls status without the GC paying for the service themselves.
- This is a primary platform wedge: GCs save the $300-$1,500 per year per service plus the time tax.

#### 3.2.8 Tier and Score Card

- Compliance status feeds into a public-facing GC scorecard.
- Tiers: Applicant, Verified, Preferred, Elite.
- Tier affects bid visibility, fee tier, and invitation to high-value jobs.
- Score components: compliance (40%), job performance (30%), financial reliability (15%), longevity and volume (15%).

### 3.3 Work Order Lifecycle

#### 3.3.1 Work Order Creation Sources

- PMC user manually creates from the portal.
- Auto-created via PMS integration (Yardi, RealPage, Entrata, AppFolio, ResMan, Buildium) when a maintenance ticket of a qualifying type is logged.
- Created by Daedalus Ops as a result of a sales engagement.
- Mobile-quick-create for PMs on the go.

#### 3.3.2 Work Order Classification

Each WO is tagged with:

- **Category:** Access control, IoT, low-voltage, electrical, plumbing, HVAC, locksmith, gate, gym equipment, pool gates and equipment, lighting, network/WiFi, fire/life safety, general contractor.
- **Urgency tier:** Emergency (under 4 hours), Urgent (under 24 hours), Routine (under 5 business days), Scheduled (named date).
- **Location type:** In-unit, common area, exterior, mechanical/restricted.
- **Job style:** Service request (occupied), make-ready/turn (vacant), capital project, recurring maintenance.
- **Resident impact:** Quiet hours, accessibility considerations, language preference.

After-hours surcharge logic auto-applies to Emergency and Urgent jobs based on PMC contract.

#### 3.3.3 Job Templates

Templates drive WO data capture and field execution. Each template includes:

- **Pre-work checklist:** Verifications required before starting (e.g., AC functional check before thermostat replacement).
- **Required photos:** Specific shots required at intake, mid-job, and completion.
- **Required measurements/data:** Voltage readings, model numbers, serial numbers, signal strength.
- **Materials list:** Standard materials with cost basis.
- **Labor estimate:** Standard hours.
- **Wiring/configuration steps:** For low-voltage and IoT.
- **Post-work tests:** Pairing, range tests, pressure tests, leak checks.
- **Sign-off requirements:** Resident sign, tech sign, PM sign-off scope.

Initial template library:

- WiFi access point install
- WiFi mesh deployment
- Access control reader install
- Smart lock pairing
- Smart lock replacement
- Thermostat install (with heat/cool check)
- Thermostat replacement
- IoT hub install
- Gate operator repair
- Gate intercom install
- Pool gate hardware
- Gym equipment minor repair
- Light fixture replacement
- Low-voltage cable run
- Camera install
- Camera replacement
- Network switch deployment
- Doorbell camera install
- Leak detection sensor install

Templates are version-controlled. PMCs can fork templates and customize per portfolio.

#### 3.3.4 AI Matching Engine

Inputs:
- Job category, sub-category, urgency.
- Property location (lat/long).
- Required certifications.
- PMC vendor preferences and blacklist.
- Vendor capacity (real-time tech availability).
- Vendor performance score.
- Vendor proximity and current routing load.
- Time-of-day and after-hours multipliers.
- Spoken language requirements.

Output:
- Ranked list of eligible vendors with match score, ETA, and confidence band.
- Routing logic: top vendor gets first refusal with a configurable response window (default 15 minutes for emergency, 4 hours for routine), then cascades.

#### 3.3.5 AI Estimating

- Photo intake with EXIF validation (GPS, timestamp).
- Vision model identifies the asset, damage type, and likely scope.
- Estimate composed from: standard template labor hours, regional labor rates, materials database (RSMeans or equivalent), platform markup band (5-30%, configurable per PMC).
- Output displays: line items, labor, materials, markup, total, and a confidence score.
- Estimates with confidence below threshold automatically flag for human review by Daedalus Ops.
- PMC sees the estimate; vendor sees their net.
- Versioned: every estimate revision is logged.

#### 3.3.6 Bid Workflow

Two modes:

**Mode A: Direct Award (default for routine).** AI matches a single vendor at the AI estimate. Vendor accepts or proposes counter.

**Mode B: Competitive Bid (for capital projects, larger jobs).** Up to 5 vendors invited to bid against the spec. Each bid passes through:

- AI Bid Quality Review: checks for completeness (all line items addressed), realism (within market band per item), and red flags (suspiciously low for scope, suspiciously high for scope, missing scope items).
- Bid Leveling Tool: presents bids in a normalized side-by-side table for the PM to compare apples-to-apples.
- AI does not reject bids autonomously. It surfaces concerns. A human awards.
- Bid documents are version-controlled and locked at submission.

#### 3.3.7 Permission to Enter (PTE)

- 24-hour notice auto-generated when a WO with in-unit work is scheduled.
- Notice delivered via SMS and email in resident's preferred language.
- Resident responds: confirm, reschedule, deny entry.
- Status logged on WO. PM can override with appropriate documentation.
- Geofence and timestamp capture confirms the tech entered only after PTE was granted.

#### 3.3.8 Active Job Tracking

- Tech check-in at geofence with timestamped photo.
- Live ETA shared with resident and PM.
- Mid-job photo capture and notes.
- Voice notes auto-transcribed.
- Materials used logged against truck stock.
- Time-on-site tracked.
- Tech check-out with completion photos.

#### 3.3.9 Completion and Sign-Off

- Resident digital signature (when present).
- PM remote sign-off based on photo and checklist review.
- Auto-routing to invoice generation upon sign-off.
- Post-job survey to resident and PM.
- Warranty period auto-starts.

#### 3.3.10 Change Orders

- Triggered when a tech identifies additional scope mid-job.
- Tech proposes change order with photos, scope description, and price delta.
- AI re-estimates the delta.
- PM approves or denies before work continues.
- Change orders are versioned addenda to the WO.

### 3.4 Mobile Field Operations

A dedicated mobile app for technicians. Distinct from the web portal.

#### 3.4.1 Core Capabilities

- Today's jobs view with map and list.
- Job card with template-driven steps and required photos.
- Geofence check-in and check-out with mandatory timestamp photos.
- Camera capture with EXIF preservation.
- Voice-to-text job notes.
- Truck stock browse and consume.
- Parts ordering integration with HD Supply, Ferguson, Wilmar, Home Depot Pro for on-the-fly purchases.
- Digital signature capture.
- In-app chat with dispatcher, PM, and resident (the last via masked SMS).
- Offline mode: full job execution with sync on reconnect.
- High-contrast UI for outdoor and basement use.
- Large tap targets for gloved hands.
- Bilingual UI (English and Spanish at launch).

#### 3.4.2 Tech Workflow Per Job

1. Receive assignment notification.
2. Accept or decline within window.
3. Travel to site (route assist available).
4. Geofence check-in with arrival photo.
5. Notify resident or PM of arrival.
6. Complete pre-work checklist with photos.
7. Perform work with template-driven steps.
8. Capture during-work photos.
9. Log materials consumed.
10. Run post-work tests.
11. Capture completion photos.
12. Resident sign-off.
13. Geofence check-out.
14. Submit for review.

#### 3.4.3 Field Lead Capabilities

In addition to Tech capabilities:

- Approve another tech's job submission.
- Re-route jobs across the day's roster.
- Field-level dispute initiation.

### 3.5 Dispatch and Scheduling

#### 3.5.1 Dispatcher Board

- Kanban-style board with columns: Unassigned, Assigned, En Route, On Site, Completed, On Hold.
- Drag-and-drop reassignment.
- Filter by trade, urgency, property, technician.
- Capacity heatmap by tech and by day.

#### 3.5.2 Routing Optimization

- Daily route optimization using technician home base, current location, job locations, time windows, and traffic.
- Multi-stop routing.
- Re-optimization on emergency insertion.
- Travel-time estimation feeds the customer-facing ETA.

#### 3.5.3 Capacity Planning

- Tech availability calendar (PTO, training, blackout).
- Skill-by-skill capacity forecast 14 days out.
- Surge alerts when forecast capacity is below expected demand.

### 3.6 Communications

#### 3.6.1 Unified Inbox

- Per-WO and per-account threading.
- Channels: in-app messaging, masked SMS, email.
- All resident communication is masked through Daedalus numbers (no direct tech-to-resident exchange).
- Bilingual auto-translation (English/Spanish at launch).
- Searchable archive.

#### 3.6.2 Resident Notifications

- Templates for: 24-hour notice, day-of confirmation, on-the-way, arrival, completion, satisfaction survey.
- Configurable per PMC and per property.
- Delivery via SMS and email.
- Multi-language template variants.

#### 3.6.3 Internal Notifications

- Bid received, bid awarded, job scheduled, job in progress, job completed.
- Routed by role and per-user preference (push, email, in-app).
- Quiet hours respected.

### 3.7 Financials and Invoicing

A full embedded finance module. This is a major surface area.

#### 3.7.1 Invoice Generation

- Auto-draft invoice on job sign-off.
- Line items pulled from completed scope, materials log, change orders, and after-hours surcharges.
- CSI MasterFormat cost coding.
- PMC-specific invoice format.
- PO matching when PO is required.
- Send to PMC AP via email, portal, and PMS push.

#### 3.7.2 POS-Style Quick Charge

- For walk-up or one-off jobs not tied to a long workflow.
- Pre-loaded SKUs (service call, hourly rate, common parts).
- Tap-to-pay, ACH, card on file, send-link.
- Receipt generation and accounting sync.

#### 3.7.3 Accounts Receivable (Daedalus AR)

- AR dashboard with aging buckets (current, 30, 60, 90, 90+).
- Auto-reminders at 7, 14, 30 days past due.
- Per-PMC payment terms enforcement.
- Disputes and credit memos workflow.

#### 3.7.4 Accounts Payable (Vendor Payouts)

- Vendor payout schedule per GC.
- Net split: GC payout = invoice total minus platform fee minus retainage.
- Retainage held automatically per PMC contract (typically 5-10%).
- Released on PM final acceptance or warranty period close.

#### 3.7.5 Factoring and Instant Pay

- Vendors can opt to receive payment within 1-2 business days minus a factoring fee (suggested 1-3% per invoice).
- Daedalus carries the receivable until PMC pays.
- Available only to Verified+ tier vendors.
- Underwriting model based on vendor history and PMC payment history.

#### 3.7.6 Change Order Re-Approval

- Any change order over $X (configurable per PMC) requires PM re-approval before work continues.
- Approval logged and attached to invoice.

#### 3.7.7 Lien Waiver Tie-In

- Lien waivers auto-generated and attached to invoice based on payment milestone and state.
- Vendor digital signature required.
- Distributed to PMC with payment.

#### 3.7.8 Accounting Integrations

- QuickBooks Online, Xero, NetSuite (full two-way).
- Sage and Microsoft Dynamics (read-only sync at v1).
- Cost code mapping per PMC.
- Journal entry export.

#### 3.7.9 Tax Compliance

- Sales tax calculation per jurisdiction (Avalara integration).
- 1099-NEC generation.
- TIN matching.

### 3.8 Sales Intelligence (Outbound Lead Intel)

Replaces the original lead-scraping concept with a sales-team intelligence tool.

#### 3.8.1 Property Signal Aggregation

- Continuous monitoring of public review sources (Google Reviews, Yelp, ApartmentRatings, Reddit, Apartments.com, Niche, Facebook).
- Last 90 days at onboarding, then daily.
- Signal extraction: complaints mentioning gate failure, broken doors, lighting, WiFi, IoT, access control, gym equipment, pool gates.
- NLP categorization into trade buckets.
- Volume and trend analysis per property.

#### 3.8.2 Account-Level Intelligence

- Each property gets a lead score driven by signal volume, severity, and PMC ownership.
- Drill-down view shows raw quotes, source links, dates, and trade tags.
- Used by Daedalus Sales for outbound to PMCs (never used to cold-pitch residents).

#### 3.8.3 Outbound CRM

- Pipeline stages: Prospect, Engaged, Demo, Proposal, Won, Lost.
- Account view with all signals, prior conversations, contacts.
- Activity timeline and task management.
- Email sequences and call logging.
- Win/loss reasons.

### 3.9 Integrations Hub

A first-class module for managing all external connections.

#### 3.9.1 Property Management Systems

- Yardi Voyager.
- RealPage OneSite.
- Entrata.
- AppFolio Property Manager.
- ResMan.
- Buildium.

Each integration supports: property roster sync, work order push and pull, tenant contact sync, and vendor payable sync.

#### 3.9.2 Vendor Compliance Services

- NetVendor.
- Compliance Depot (RealPage Vendor Compliance).
- RMIS.
- Vendor Cafe.

#### 3.9.3 Accounting

- QuickBooks Online.
- Xero.
- NetSuite.
- Sage Intacct.

#### 3.9.4 Field and Operations

- Checkr (background checks).
- Sterling (background checks).
- Twilio (SMS).
- SendGrid (email).
- Stripe (payments).
- Plaid (bank verification).
- DocuSign (signatures).
- Avalara (tax).
- Google Maps Platform (routing, geocoding).

#### 3.9.5 Supplier Catalog

- HD Supply.
- Ferguson.
- Wilmar.
- Home Depot Pro.
- Grainger.

#### 3.9.6 Pricing Data

- RSMeans.
- Craftsman National Estimator.
- Local market overlays from completed job data.

#### 3.9.7 Integrations UX

- Marketplace landing page with categorized integrations.
- Per-integration config page with status, last sync, errors, mapping, and credentials.
- Sync health dashboard with error logs.
- Per-tenant integration scoping.

### 3.10 Reporting and Analytics

#### 3.10.1 Executive Dashboard

For PMCs and Daedalus leadership:

- Active WOs, average response time, average completion time, first-time-fix rate, satisfaction scores.
- Spend by category, by property, by vendor.
- SLA compliance trend.

#### 3.10.2 Vendor Scorecard

Per GC:

- Job count, win rate, response rate, completion time, callback rate, satisfaction scores.
- Compliance status.
- Earnings and average ticket.

#### 3.10.3 Property and Portfolio Performance

- Per-property work order density, top categories, recurring issues, predictive maintenance candidates.
- Portfolio rollups for Regionals.

#### 3.10.4 Spend Analytics

- Spend by trade, by property, by vendor, by month.
- Variance against budget.
- Markup capture analysis.

#### 3.10.5 SLA Compliance

- Per-PMC and per-portfolio SLA reports.
- Drill-down into SLA misses with root cause.

#### 3.10.6 Custom Report Builder

- Drag-and-drop fields.
- Saved and shared reports.
- Scheduled email delivery.

### 3.11 Admin Console (Super Admin)

- Tenant management (create, suspend, archive).
- User management across tenants with impersonation.
- Role and permission editor with granular ACLs.
- Feature flag controls per tenant.
- Audit log with full event history.
- System health (uptime, integration status, queue depth).
- Pricing and markup configuration per PMC.
- API keys, webhooks, OAuth client management.
- Billing and subscription management.
- Platform-wide analytics.

---

## 4. Non-Functional Requirements

### 4.1 Performance

- P95 page load under 2 seconds on broadband.
- Mobile app actions under 1 second on 4G.
- Offline mobile sync within 30 seconds of reconnect.
- AI estimate generation under 10 seconds.

### 4.2 Reliability

- 99.9% uptime for web platform.
- 99.5% uptime for mobile sync layer.
- Disaster recovery RPO under 1 hour, RTO under 4 hours.

### 4.3 Security

- SOC 2 Type II within 12 months.
- All PII encrypted at rest (AES-256) and in transit (TLS 1.3).
- MFA mandatory for platform and PMC roles.
- Role-based access control with audit logging.
- Background-check and drug-screen results stored with restricted access.
- Penetration testing annually.

### 4.4 Privacy and Compliance

- CCPA and similar state-level privacy compliance.
- GDPR readiness for any future expansion.
- Resident data minimization.
- Data retention policies per data class.
- Vendor data export and deletion on request.

### 4.5 Accessibility

- WCAG 2.1 AA compliance on all customer-facing surfaces.
- Mobile app accessibility per platform guidelines.
- Bilingual at launch (English and Spanish).

### 4.6 Legal Posture

- Independent contractor classification: platform avoids dictating worker conduct (uniforms, schedules, exclusivity) in ways that trigger reclassification.
- Terms of service for each user class.
- Marketplace mediation and arbitration clauses.
- Indemnification clauses between Daedalus, GCs, and PMCs.
- Fair Housing Act compliance for any resident-facing communication.

---

## 5. Brand and UX Direction

### 5.1 Brand DNA

Inspired by Daedalus, the legendary craftsman of Greek mythology. The brand combines mastery, precision, and the warmth of human craft with the polish of modern enterprise software.

Keywords:

- Elegant.
- Sleek.
- Clean.
- Warm.
- Mythic without being kitsch.
- Modern enterprise polish (think Linear, Vercel, Ramp, Notion).

### 5.2 Visual Language

- Color palette: deep charcoal and obsidian as base, warm bronze and aged brass as accents, parchment-warm white for surfaces, with a single vivid signal color for action and status.
- Typography: a serif display face for marketing and headings (mythic warmth), a clean geometric sans for UI body (modern clarity).
- Iconography: line-based with subtle classical motifs (a key, a wing, a labyrinth glyph) used sparingly.
- Photography and illustration: subtle 3D Greek-mythology objects (key, wing, column, compass, labyrinth) used in marketing and login surfaces. Functional UI does not depend on them.

### 5.3 UX Principles

- Density when professionals need it, calm when residents see it.
- Mobile-first for tech surfaces, desktop-first for finance and analytics.
- Always show source of truth (where this data came from, when it last synced).
- Never lose work in offline mode.
- Every action is auditable.
- Errors are constructive, not punitive.

### 5.4 Login Experience

- Subtle 3D scene of a Greek mythology object (rotating slowly, parallax with mouse movement) behind the login form.
- Performance budget: scene must not block first paint and must degrade gracefully on lower-end devices.
- Bypass option for users on low-bandwidth or accessibility settings.

---

## 6. Phased Rollout

### Phase 1 (Months 1-3): Foundation

- Auth and onboarding (GC + PMC).
- Compliance vault and COI parser.
- Work order CRUD with manual matching.
- Mobile tech app v1 (online-only).
- Invoice generation and Stripe payments.
- Single PMS integration (Yardi or RealPage based on first design partner).
- Phoenix and Scottsdale pilot.

### Phase 2 (Months 4-6): Marketplace Mechanics

- AI matching engine.
- AI estimating with photo intake.
- Bid workflow with leveling.
- Job templates library v1.
- Mobile offline mode.
- Lien waiver engine.
- QuickBooks integration.
- Vendor compliance service integrations (NetVendor, Compliance Depot).

### Phase 3 (Months 7-9): Scale Layer

- Factoring and instant pay.
- Sales intelligence and outbound CRM.
- Custom report builder.
- Additional PMS integrations (Entrata, AppFolio, ResMan, Buildium).
- Spanish localization.
- SOC 2 Type I.

### Phase 4 (Months 10-12): Enterprise Readiness

- Custom roles and permissions for enterprise PMCs.
- Predictive maintenance.
- Multi-state expansion playbook.
- SOC 2 Type II.
- API for PMC custom integrations.

---

## 7. Success Metrics

### 7.1 Marketplace Health

- GAAP revenue and platform take rate.
- Active GCs (logged in past 30 days) and active properties.
- WOs created per week.
- Average time from WO creation to vendor accepted.
- Average time to completion per urgency tier.
- First-time-fix rate.
- Callback rate.
- NPS from PMs and from GCs.

### 7.2 Compliance Health

- % of GCs with current COI.
- % of techs with current background check.
- # of compliance failures caught pre-job.
- Time from document expiration alert to remediation.

### 7.3 Financial Health

- Days sales outstanding (DSO).
- % of vendors using factoring.
- Disputed invoice rate.
- Markup capture rate.

---

## 8. Open Questions

These need resolution before or during build:

1. **Pilot PMC commitment:** Which PMC commits to design-partner status in Phoenix?
2. **Pricing model:** Take rate, SaaS, or hybrid? At what level?
3. **Initial trade focus:** Start broad (general contractor) or narrow (Daedalus Pro specialty: access control, IoT, low-voltage)?
4. **Vendor classification legal review:** Engage labor counsel before V1 launch.
5. **PMS integration sequencing:** Yardi or RealPage first?
6. **Mobile native vs. cross-platform:** Native iOS+Android, React Native, or Flutter?
7. **AI vendor:** Single foundation model provider or multi-model orchestration?
8. **Pricing data licensing:** RSMeans cost vs. building proprietary cost basis from job data.
9. **Insurance requirements for Daedalus itself:** E&O, cyber, general, umbrella.
10. **Resident data handling:** Are residents end-users of the platform or transient subjects? Affects privacy posture.

---

## 9. Glossary

- **PMC:** Property Management Company.
- **GC:** General Contractor (also used loosely for any vendor).
- **WO:** Work Order.
- **PTE:** Permission to Enter.
- **COI:** Certificate of Insurance.
- **SLA:** Service Level Agreement.
- **Make-ready / Turn:** Vacant unit prep between residents.
- **Class A / B / C:** Multifamily property quality tier.
- **PMS:** Property Management System (Yardi, RealPage, etc).
- **NetVendor / Compliance Depot:** Third-party vendor compliance services.
