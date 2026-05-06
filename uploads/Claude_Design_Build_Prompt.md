# Claude Design Build Prompt — Daedalus Pro Platform

This document is structured to be fed into Claude Design in stages. Start with **Section 1 (Master Design System)** as the foundational prompt, then work through pages in priority order using **Sections 3-15**. Each page section is a self-contained prompt you can paste directly.

---

## How to Use This Document

1. **First,** paste Section 1 (Master Design System) into Claude Design as your first message. This grounds every subsequent page in the same visual language.
2. **Then,** for each page you want built, copy the entire page block (Section X.Y) and paste it as a new prompt in the same Claude Design conversation.
3. **Iterate** by referencing earlier components ("use the same WO card pattern from the dispatcher board").
4. **Build in priority order** as listed in Section 2.

---

## Section 1: Master Design System Prompt (paste this first)

> You are designing **Daedalus Pro**, a vertical SaaS and managed marketplace for the multifamily property management industry. The platform connects property managers with vetted general contractors and trade specialists for work orders involving access control, IoT, low-voltage, gates, lighting, WiFi, and general contracting work. Users include property regional VPs, property managers, GC owners, dispatchers, field technicians, Daedalus platform admins, and residents.
>
> ### Brand Identity
>
> Daedalus is the legendary craftsman of Greek mythology. The brand fuses mythic warmth with modern enterprise software polish. Reference points: Linear, Vercel, Ramp, Notion, Stripe Dashboard. Avoid: anything cartoonish, anything that looks like consumer fitness apps, anything that screams "Web3."
>
> ### Color System
>
> - **Base / Background:** Obsidian Black (#0B0D10) for dark surfaces, Parchment (#F7F3EC) for light surfaces.
> - **Surface:** Slate (#161A20) on dark, Bone (#FFFFFF) on light, with a subtle warm tint.
> - **Primary Brand Accent:** Aged Bronze (#B08654). Used for primary actions, branded moments, and accent strokes.
> - **Secondary Accent:** Brass (#D4A857). Used sparingly for highlights and hover states.
> - **Signal Colors:**
>   - Success: Olive (#7A8B4C)
>   - Warning: Amber (#D08A2E)
>   - Danger: Terracotta (#B0463A)
>   - Info: Slate Blue (#4A6378)
> - **Text:** Marble (#F4F1EA) on dark, Charcoal (#1F2329) on light, with muted variants for secondary text.
>
> Default the platform to a **light theme with warm undertones**, but ensure dark theme parity for all surfaces. The login and marketing surfaces lean darker to feature the 3D mythology objects.
>
> ### Typography
>
> - **Display / Headings:** A modern serif with subtle classical character. Use **Fraunces** or **Cormorant Garamond**. Tracking slightly tightened for large sizes.
> - **UI Body:** **Inter** or **Geist Sans**. Standard tracking. 14px base for dense surfaces, 16px for marketing.
> - **Monospace:** **JetBrains Mono** for IDs, codes, and data tables that need column alignment.
>
> Heading hierarchy:
> - H1: 48px serif, semibold
> - H2: 32px serif, semibold
> - H3: 22px serif, medium
> - H4: 18px sans, semibold
> - Body: 14-16px sans, regular
> - Caption: 12px sans, regular, muted
>
> ### Spacing and Layout
>
> - 8-point base grid.
> - Generous whitespace on marketing surfaces, denser on operational surfaces (dispatcher, finance).
> - Container max widths: 1280px for content surfaces, full-bleed for dashboards and dispatcher boards.
> - Sidebar nav: 240px expanded, 64px collapsed.
>
> ### Component Library
>
> Build a consistent component vocabulary:
>
> - **Buttons:** Primary (bronze fill), Secondary (outline), Ghost (text only), Destructive (terracotta). 36px height standard, 32px small, 44px large. 8px corner radius.
> - **Inputs:** 36px height, 1px stroke, focus ring in bronze. Labels above. Helper and error text below.
> - **Cards:** 12px corner radius, subtle border, optional warm shadow. Hover lift on interactive cards.
> - **Tables:** Dense by default with row hover, sortable headers, pinned columns where useful. Sticky header.
> - **Badges and Pills:** Status pills with semantic colors. Tier badges with icon (Applicant, Verified, Preferred, Elite).
> - **Modals:** 480px standard width, 720px wide for forms, full-height side sheets for record detail.
> - **Tabs:** Underline style for primary, segmented control for filter switches.
> - **Empty states:** Always include an illustration of a single classical object (key, wing, column) plus helpful primary action.
> - **Toasts:** Bottom-right, semantic colored, 4-second auto-dismiss with manual close.
> - **Skeletons:** Use for all data loads over 200ms.
>
> ### Iconography
>
> Line icons at 1.5px stroke. Use **Lucide** or **Phosphor** as the base library. Create a small custom set for domain-specific needs (work order, COI, lien waiver, gate, smart lock, etc.) in the same line style.
>
> ### Subtle Mythological Motifs
>
> Used sparingly:
>
> - Greek key (meander) pattern as a 1px divider on section breaks in marketing surfaces.
> - Wing glyph on Elite tier badges.
> - Column motif as a section divider on the executive dashboard.
> - Labyrinth glyph as the favicon.
>
> Functional UI does not depend on these. They are accents, not load-bearing.
>
> ### Motion
>
> - 150ms ease-out for hovers and button states.
> - 250ms ease-in-out for modals and sheets.
> - Respect `prefers-reduced-motion`.
>
> ### Tone of Voice in Microcopy
>
> Direct, confident, calm. Never cute. Never aggressive. Examples:
>
> - "Your COI expires in 14 days. Upload the renewal to keep accepting jobs."
> - "Two bids are flagged for review. Open the leveling view to compare."
> - "Tech checked in at 10:32 AM. Geofence verified."
>
> Avoid: exclamation points, "Oops," "Whoops," "Awesome," generic SaaS energy.
>
> ### Layout Frame (apply to all internal pages)
>
> - **Top bar (56px):** Logo (left), global search (center), notifications, role switcher, user menu (right). On dark.
> - **Left sidebar (240px expanded):** Module navigation. Collapsible to 64px icons. On dark.
> - **Main canvas:** Light parchment surface with warm shadow at the top edge.
> - **Right rail (optional, 320px):** Context panel for record detail surfaces.
>
> Every internal page assumes this frame unless explicitly noted.

---

## Section 2: Page Build Priority

Build in this order to validate the design system early and unblock pilot:

**Tier 1 (build first, validate brand):**
1. Login Page (Section 3.1)
2. GC Onboarding Wizard — Step 1 (Section 4.1)
3. Compliance Vault — Document List (Section 5.1)
4. Work Order Detail (Section 6.2)
5. Dispatcher Board (Section 7.1)

**Tier 2 (operational core):**
6. Mobile Tech — Job Card (Section 8.2)
7. Bid Submission (Section 6.4)
8. AI Estimate Review (Section 6.3)
9. Property Manager Dashboard (Section 9.1)
10. Invoice Detail (Section 10.2)

**Tier 3 (scale layer):**
11-50. Remaining pages in module order.

Every other page in this document is supporting. Tier 1 alone should be enough to lock the visual system.

---

## Section 3: Authentication and Public Surfaces

### 3.1 Login Page

> Design the **Daedalus Pro Login Page**.
>
> **Layout:** Two-panel split. 60% left is a dark, atmospheric scene with a slowly rotating 3D Greek mythology object (default: a polished bronze wing with subtle parallax on mouse movement). The 3D scene should feel premium, not gamey. Rim lighting in warm bronze, deep obsidian background, soft fog. Below the object, set a small mythic motto in serif: "Built by craftsmen. Run by code."
>
> 40% right panel is the form. Light parchment surface. Daedalus wordmark at the top in serif. Below: "Sign in to your account." Email field. Password field. "Remember me" checkbox. Primary bronze button: "Continue." Below: "Sign in with Google" and "Sign in with Microsoft" as secondary buttons. Forgot password link. Subtle "New to Daedalus? Apply as a contractor" link at the bottom.
>
> **States to design:**
> - Default
> - Loading after submit
> - Error (incorrect credentials, with inline message)
> - MFA prompt (6-digit code entry, "Use recovery code" link)
>
> **Accessibility:** Provide a "Skip animation" link in the bottom corner for users on reduced-motion or low bandwidth.
>
> **Responsive:** On mobile, the 3D scene becomes a static hero image at the top, form below.

### 3.2 Forgot Password and Recovery

> Design the **Forgot Password flow** for Daedalus Pro. Single-column centered layout on a light parchment surface with the same wing motif at the top, smaller and static.
>
> Three connected screens:
> 1. **Enter email:** "Reset your password." Email input. Primary button: "Send reset link."
> 2. **Confirmation:** "Check your email. We sent a reset link to [email]." Secondary action: "Resend in 30s" countdown.
> 3. **New password:** Triggered from email link. Two password fields with strength meter and requirement checklist. Primary button: "Update password."

### 3.3 Role Selection (Multi-Role Users)

> Design a **Role Selector** that appears after login for users who hold multiple roles across tenants.
>
> Centered modal-style layout. Heading: "Choose your workspace." Below, a stack of cards. Each card shows: tenant logo or initial, tenant name, role badge (e.g., "GC Owner — Apex Electric LLC"), last active time. Hover reveals a "Continue" arrow. Bronze accent on the active selection.
>
> Bottom: "Manage workspaces" small link.

---

## Section 4: GC Onboarding

### 4.1 GC Application Wizard — Stepper Frame

> Design the **GC Onboarding Wizard** master frame.
>
> **Layout:** Top bar reduced to logo only. Left rail (320px) shows the 11-step progress: Company Info, Service Areas, Trades and Skills, Licensing, Insurance, Documentation, Team, Background Checks, References, Pricing Acknowledgment, Submit. Each step shows a status icon (pending, active, complete, error). Active step has a bronze indicator bar.
>
> **Main canvas:** Light parchment, generous padding. Each step has a serif heading, a one-sentence helper, the form, a "Save and continue later" link, and primary "Continue" / secondary "Back" buttons at the bottom-right.
>
> Design the frame and Step 1 (Company Info) together. Step 1 fields: Legal Name, DBA, EIN (with format mask), Business Structure (dropdown), Year Founded, Headquarters Address (with auto-complete), Number of Employees, Annual Revenue Band, Brief Company Description (textarea, 500-char limit).

### 4.2 Service Areas (Step 2)

> Design **Step 2: Service Areas**. Same wizard frame.
>
> Main canvas split: left half is an interactive map (Google Maps base, dark mode style with bronze accent for selections) where the user draws polygons or selects ZIP codes. Right half is a list of selected areas with chips for each ZIP, plus a "Service radius from HQ" toggle that defaults to 30 miles.
>
> Below the map: "Travel surcharge zones" optional, where the GC can mark areas they will service with a surcharge.

### 4.3 Trades and Skills (Step 3)

> Design **Step 3: Trades and Skills**.
>
> Main canvas is a matrix. Left column lists trade categories (Electrical, Low-Voltage, HVAC, Plumbing, Locksmith, Gate Tech, IoT Installer, General Contractor, etc.). For each, the user selects skill depth (None, Familiar, Proficient, Expert) via a segmented control. Each skill expands to show specific sub-skills with checkboxes (e.g., under Low-Voltage: structured cabling, access control, CCTV, intercom, fire alarm).
>
> Right rail summary: "You've selected X trades and Y sub-skills." Helper note: "Match accuracy improves with detail."

### 4.4 Licensing Upload (Step 4)

> Design **Step 4: Licensing**.
>
> Main canvas is a card list. Each card represents a license requirement (state contractor license, EPA 608, NATE, ESA, OSHA 10/30) with: license name, state, status (Required / Optional / Not applicable based on prior steps), upload zone, "Verify automatically" button when an API exists for that state, expiration field.
>
> Empty state on each card: drag-and-drop file zone with PDF/JPG/PNG support, "or browse" text link.
>
> Filled state: filename, file size, page preview thumbnail, parsed metadata (license number, issue date, expiration), "Replace" and "Remove" actions, verification status pill.

### 4.5 Insurance / COI Upload (Step 5)

> Design **Step 5: Insurance**.
>
> Main canvas opens with a single large upload zone for the COI. After upload, the page transforms to show a parsed-data review. Two-column layout:
>
> Left: PDF preview of the COI (with bronze highlight overlay on parsed fields).
>
> Right: extracted data in editable fields, grouped by section: Insured Entity, General Liability (per-occurrence, aggregate, additional insured language), Auto, Umbrella, Workers Comp, Professional, Cyber. Effective and Expiration dates. Carrier names.
>
> Banner at the top: "We've parsed your COI. Review the fields below and confirm." Bottom action: "Confirm and continue" or "Re-upload."
>
> If any required minimum is unmet, show an inline warning with terracotta accent: "Your General Liability per-occurrence is $500K. Most properties require $1M minimum."

### 4.6 Team Roster (Step 7)

> Design **Step 7: Team Roster**.
>
> Main canvas is a table-plus-add-button pattern. Columns: Name, Role (Owner / Admin / Dispatcher / Field Lead / Field Tech / Estimator / Bookkeeper), Email, Phone, Trades, Background Check Status, Drug Screen Status, Active.
>
> Primary action: "Add Team Member" opens a side sheet with the team member form.
>
> Above the table, a callout: "We'll initiate background checks and drug screens on your behalf for any techs who will enter occupied units. Standard cost: $40 background, $35 drug screen."

### 4.7 Application Status Dashboard (Post-Submit)

> Design the **Application Status Dashboard** that the GC sees after submitting the wizard.
>
> Hero: "Your application is in review." Below: a horizontal progress strip with five stages (Submitted, Compliance Review, Background Checks, References Contacted, Decision). Active stage in bronze.
>
> Below the strip: a checklist of what's required, what's pending, what's complete. Each item has an action where applicable.
>
> Side panel: "Your assigned Compliance Specialist" with a name, photo, email, phone. Direct contact encouraged.
>
> Bottom: estimated timeline ("Typical review: 5-7 business days") and FAQ accordion.

---

## Section 5: Compliance Module

### 5.1 Compliance Vault — Document List

> Design the **Compliance Vault** for a logged-in GC.
>
> **Layout:** Standard internal page frame. Page heading: "Compliance Vault." Sub-heading: small status summary ("12 documents current, 2 expiring soon, 1 expired").
>
> **Top bar within the page:** filter chips (All, COI, Licenses, Certifications, Lien Waivers, W-9, Background Checks, Drug Screens), search input on the right, "Upload Document" primary button.
>
> **Main view:** Card grid (3 per row on desktop). Each card: document type icon, document name, expiration status pill (Current / Expiring in X days / Expired), upload date, expiration date, file size, "View" and "Replace" actions.
>
> **Right rail (optional):** "Action Required" panel listing items that need attention with quick actions (renew, re-upload, contact carrier).
>
> Bronze accent on cards that are current, amber on expiring, terracotta on expired.

### 5.2 COI Detail Drawer

> Design the **COI Detail side sheet** that opens when a user clicks a COI card in the Vault.
>
> **Layout:** Right-side full-height sheet, 720px wide, with a left preview pane (PDF) and a right metadata pane.
>
> **Right pane sections:**
> - Header: "ACORD 25 — General Liability and Auto." Status pill. Carrier logo if recognized.
> - Insured Entity block (legal name, address).
> - Coverage breakdown table: Line of Coverage, Policy Number, Limits, Effective, Expiration.
> - Additional Insured language with a checkmark if matching PMC requirements.
> - History: prior COI versions with timeline view.
> - Compliance match: per-PMC requirements showing pass/fail.
> - Actions: Send to PMC, Request renewal, Replace, Download.

### 5.3 PMC Compliance Requirements Editor

> Design the **PMC Compliance Requirements page** (visible to PMC admins and Daedalus Compliance Officers).
>
> Heading: "Vendor Compliance Requirements." Sub: "Set the minimums every vendor must meet to work on your portfolio."
>
> **Sections (collapsible):**
> - Insurance Minimums: per-coverage-type input fields with a "Standard / Enhanced / Custom" preset selector at the top.
> - Required Certifications: multi-select with explanatory tooltips.
> - Background Check Policy: "All techs must have a background check within X months. Minimum scope: [criminal, MVR, sex offender]."
> - Drug Screen Policy: similar structure.
> - Property Overrides: a table where individual properties can set stricter requirements than the portfolio default.
>
> Bottom: "Save and notify all vendors" primary action.

### 5.4 GC Tier and Score Card

> Design the **GC Tier and Score Card** (visible to the GC themselves and to Daedalus Compliance).
>
> Hero card at the top: large tier badge (Applicant, Verified, Preferred, Elite) with the wing motif on Elite. Score out of 100 in serif type. Bronze radial progress ring.
>
> Below: four score component cards (Compliance, Job Performance, Financial Reliability, Longevity and Volume) each with a sub-score, the components rolling into it, and a "How to improve" link.
>
> Bottom: "Your tier history" timeline showing tier transitions over time.

---

## Section 6: Work Order Module

### 6.1 Work Order List View

> Design the **Work Order List View** for a Property Manager or Daedalus Ops user.
>
> **Layout:** Standard frame. Heading: "Work Orders." Sub-heading: total count and filter summary.
>
> **Top bar within page:** a segmented control (All, Unassigned, Active, Awaiting Bid, Scheduled, In Progress, Completed, On Hold), search bar, filter button (opens a side sheet with multi-filter), view toggle (Table / Kanban / Calendar / Map), "New Work Order" primary button.
>
> **Default view: Table.** Columns: WO ID, Title, Property, Category, Urgency Pill, Status Pill, Assigned Vendor, Tech, Scheduled, SLA Countdown, Total. Row hover reveals quick actions. Click opens detail view.
>
> Pagination at bottom.

### 6.2 Work Order Detail

> Design the **Work Order Detail page**. This is the most-used page in the platform.
>
> **Layout:** Full-bleed three-column.
>
> **Left rail (280px):** Sticky meta panel.
> - WO ID, status pill, urgency pill.
> - Property name with link.
> - Category with icon.
> - Created by, created on.
> - Scheduled date.
> - SLA countdown (visual ring).
> - Assigned vendor and tech with avatars.
> - Total estimate.
>
> **Main canvas:** Tabbed interface.
> - **Overview tab:** Description, location within property (unit, common area, etc.), photos uploaded by PM, AI-generated estimate summary, current bid status.
> - **Activity tab:** Chronological feed of every event (created, bid received, awarded, scheduled, tech checked in, photo added, completed, signed off, invoiced) with avatars and timestamps.
> - **Photos tab:** Grouped by phase (intake, before, during, after). Lightbox on click. EXIF-verified badge on each photo.
> - **Bids tab:** Visible if competitive bid mode. Shows bid leveling table.
> - **Materials tab:** Parts logged by tech with cost and source.
> - **Communications tab:** Threaded messages with PM, vendor, resident.
> - **Documents tab:** PTE confirmation, lien waivers, change orders, invoice.
>
> **Right rail (320px):** Action panel.
> - Top: primary contextual action (changes by status: Approve Estimate, Award Bid, Approve Sign-off, Pay Invoice).
> - Below: secondary actions (reschedule, reassign, add note, request change order, dispute).
> - Bottom: "Linked work orders" if related.

### 6.3 AI Estimate Review

> Design the **AI Estimate Review** screen, accessed from a WO that is awaiting estimate confirmation.
>
> **Layout:** Two-column.
>
> **Left:** Photos that the AI used as input. Each photo shows AI-detected callouts (bronze pin overlays with labels: "fractured gate hinge," "exposed wiring").
>
> **Right:** Estimate breakdown.
> - Header: "AI Estimate" with confidence score (high / medium / low) and a small "How we calculated this" link.
> - Line items table: Description, Qty, Unit, Unit Price, Markup %, Subtotal.
> - Sections: Labor, Materials, Travel, After-hours surcharge.
> - Subtotal, Markup (5-30% configurable slider with PMC-default), Tax, Total.
> - Confidence badge with explanation: "Medium confidence. Photos do not show wiring conditions inside the wall."
> - Reviewer notes section.
> - Actions: "Approve and route to vendor," "Send to human reviewer," "Edit estimate."

### 6.4 Bid Submission (GC-Side)

> Design the **Bid Submission page** for a GC responding to a competitive bid invitation.
>
> **Layout:** Standard frame. Heading: "Submit Bid — [WO Title]."
>
> **Section 1: Job Brief.** Read-only summary of the WO with photos and PM notes.
>
> **Section 2: Your Bid.** Line item table the GC fills in: Description, Qty, Unit, Unit Cost, Total. "Add line item" button. Sub-totals for Labor, Materials, Equipment, Other. Markup field. Tax. Final total.
>
> **Section 3: Schedule.** Earliest start date, estimated duration, completion date.
>
> **Section 4: Notes.** Free-text justification, scope assumptions, exclusions.
>
> **Section 5: Attachments.** Optional supporting docs.
>
> **Section 6: AI Bid Review.** Triggered on save, before submit. Inline panel: "Your bid passes AI quality review" or a list of flags ("Labor estimate is 40% above market for this scope. Consider verifying"). Flags are advisory, not blocking.
>
> Bottom: "Save Draft" and "Submit Bid" actions.

### 6.5 Bid Leveling / Comparison

> Design the **Bid Leveling page** (visible to PM and Daedalus Ops).
>
> **Layout:** Wide table comparing bids side-by-side.
>
> **Header:** WO summary card.
>
> **Main:** Sticky left column lists scope items (one row per scope element). Each subsequent column is a vendor's bid with their per-line price. Highlight cells where a vendor has missing scope (red), abnormally low (amber), abnormally high (amber), or matches market median (no highlight).
>
> **Bottom row (sticky):** Totals, AI quality score per bid, schedule, vendor tier badge.
>
> **Right rail:** "Award" panel where the PM can select a vendor and submit award with required justification.

### 6.6 Permission to Enter (PTE) Tracker

> Design the **PTE Tracker page** for in-unit work orders.
>
> Heading: "Permission to Enter — [WO Title]."
>
> Timeline view:
> - 24-hour notice sent (timestamp, channel).
> - Resident response: confirmed / requested reschedule / denied / no response.
> - Day-of confirmation sent.
> - Tech arrival recorded.
>
> Side panel: Resident contact info, language preference, communication history. Quick actions: Resend notice, Call resident, Reschedule, Override entry (requires PM justification).

---

## Section 7: Dispatch and Scheduling

### 7.1 Dispatcher Board

> Design the **Dispatcher Board** for GC dispatchers and Daedalus Ops.
>
> **Layout:** Full-bleed kanban with five columns: Unassigned, Assigned, En Route, On Site, Completed Today. Each column is scrollable.
>
> **Cards:** Each WO card shows: WO ID, title, property, urgency pill, scheduled time, assigned tech avatar, SLA countdown ring.
>
> **Top bar in page:** Date selector (today, tomorrow, custom), property filter, trade filter, search. View toggle (Board / Map / List). "Auto-route" button that triggers route optimization.
>
> **Right rail (collapsible):** "Available Techs" list with capacity bars and drag-to-assign.
>
> Drag-and-drop between columns reassigns status. Drag a card onto a tech avatar to assign.

### 7.2 Dispatcher Map View

> Design the **Dispatcher Map View** alternative to the board.
>
> **Layout:** Full-bleed map (dark mode Mapbox or Google) with bronze accent for active jobs. Markers for jobs (color by urgency) and techs (with avatar bubbles, animated when in motion).
>
> **Left rail (320px):** List of jobs filtered by current map view.
>
> **Right rail (collapsible):** Tech roster with availability and current assignment.
>
> Click a marker to open a job summary card. Click a tech to see their route polyline.

### 7.3 Schedule Calendar

> Design the **Schedule Calendar** page.
>
> Standard month / week / day toggle at the top.
>
> Week view default: rows are technicians, columns are days, blocks are scheduled jobs. Color by category. Hover reveals job summary. Click opens detail.
>
> Top: filters for property, trade, status. "Print schedule" and "Export iCal" actions.

### 7.4 Capacity Planning

> Design the **Capacity Planning page**.
>
> **Layout:** Stacked sections.
>
> **Top: 14-day capacity heatmap.** Rows are trades. Columns are days. Cell color intensity shows utilization (cool to warm). Red borders on cells where forecast demand exceeds forecast capacity.
>
> **Middle: Capacity by tech.** Sortable table showing tech name, trade, scheduled hours next 7 days, available hours, utilization %.
>
> **Bottom: Surge alerts.** List of upcoming periods where demand will exceed capacity, with recommended actions.

---

## Section 8: Mobile Tech App

Mobile-first specifications. Design for 390x844 (iPhone) and 360x800 (Android).

### 8.1 Mobile Tech — Today's Jobs

> Design the **Mobile Tech App — Today's Jobs** screen.
>
> **Header (compact, 56px):** Daedalus wordmark left, notifications bell, profile avatar.
>
> **Below header:** A horizontal date strip (yesterday, today, tomorrow, +3 more days). Today is highlighted in bronze.
>
> **Main scroll area:** Vertical list of job cards in chronological order. Each card:
> - Time band on left (large, serif).
> - Job title and category icon.
> - Property name and unit.
> - Urgency pill.
> - Distance from current location.
> - Status pill (Up Next, En Route, On Site, Done).
> - One-line scope summary.
> - Primary action button bottom-right ("Start," "Check In," "Continue").
>
> **Bottom nav (60px):** Home, Schedule, Inbox, Truck Stock, Profile.
>
> High-contrast, large tap targets (minimum 44px), warm but readable.

### 8.2 Mobile Tech — Job Card (In-Progress)

> Design the **Mobile Job Card** screen, the screen techs spend most of their time on.
>
> **Header:** Back arrow, job title, urgency pill.
>
> **Top section:** Property name, unit, address (tap to open in Maps). Resident name and language. Gate code (revealed with tap). Special access notes.
>
> **Status strip:** Horizontal stepper showing job phases (Pre-work, Active, Post-work, Sign-off). Active phase highlighted.
>
> **Main content (tabbed):**
> - **Tasks tab:** Template-driven checklist of required steps. Each step is a tappable row that expands to show its sub-tasks, required photos, required measurements, and notes. Completed steps show a check.
> - **Photos tab:** Grid of captured photos by phase. Big "Add Photo" button.
> - **Materials tab:** List of materials used with quantity steppers. "Add from truck" or "Order from supplier" actions.
> - **Notes tab:** Voice-to-text notes with timestamp.
> - **Comms tab:** Thread with dispatcher and PM.
>
> **Bottom action bar (sticky):** Primary action varies by phase ("Start Pre-work," "Mark Pre-work Complete," "Start Active Work," "Submit for Sign-off"). Secondary: "Pause," "Need Help," "Request Change Order."
>
> **Offline indicator:** When offline, a subtle bronze stripe at the top with "Offline. Syncing when reconnected." Captured data is queued visibly.

### 8.3 Mobile Tech — Geofence Check-In

> Design the **Geofence Check-In screen**.
>
> Full-screen camera viewfinder. Overlay top: target geofence radius indicator with current distance ("12 ft inside zone — ready to check in"). Overlay bottom: "Capture arrival photo" primary button (large, bronze).
>
> After capture: photo review with timestamp and GPS coordinates burned in. "Confirm Check-In" primary action. "Retake" secondary.
>
> If outside geofence: amber warning, primary action disabled, helper text "Move closer to the property to check in."

### 8.4 Mobile Tech — Photo Capture

> Design the **Photo Capture screen**.
>
> Full-screen camera viewfinder with a guidance overlay specific to the required shot ("Capture the wiring before disconnecting"). Photo composition guide lines.
>
> Bottom bar: Gallery thumbnail (left), capture button (large, bronze), flash toggle (right).
>
> After capture: review screen with "Add note," "Mark as before/during/after," "Save" or "Retake."
>
> All photos stamped with timestamp, GPS, and tech ID. EXIF preserved.

### 8.5 Mobile Tech — Sign-Off

> Design the **Sign-Off screen** at job completion.
>
> Top: "Job Sign-Off" heading. Job summary card.
>
> Sections (vertically stacked):
> 1. Final photos checklist (all required completion photos must be marked done).
> 2. Tech attestation toggle: "I confirm the work is complete per scope."
> 3. Resident sign-off: signature pad (tap to sign), or "Resident not present" toggle (with required reason: "no contact at door," "language barrier," "declined").
> 4. Notes for PM (textarea).
>
> Bottom: "Submit for Approval" primary action (bronze, large).

### 8.6 Mobile Tech — Truck Stock

> Design the **Truck Stock screen**.
>
> List of materials assigned to the tech with current count, restock threshold, and last-used date. Search at top.
>
> Tap an item to consume (decrement) or add (increment).
>
> Empty state: "No truck stock configured. Ask your dispatcher to add common parts to your truck."
>
> Bottom action: "Order from supplier" opens supplier picker (HD Supply, Ferguson, Wilmar, Home Depot Pro) with embedded search.

---

## Section 9: PMC and Property Manager Surfaces

### 9.1 Property Manager Dashboard

> Design the **Property Manager Dashboard**, the home page for PMs.
>
> **Layout:** Standard frame.
>
> **Top hero strip:** Property name, address, unit count, occupancy. Small property photo.
>
> **KPI cards (4 across):** Open WOs, Avg Response Time, SLA Compliance %, Spend MTD.
>
> **Row 2: Action Required panel (left, 60%) and Resident Notifications (right, 40%).**
> - Action Required: a list of items needing PM action (estimate to approve, bid to award, sign-off to confirm, dispute to resolve). Each row has a quick action.
> - Resident Notifications: pending PTE responses, recent surveys.
>
> **Row 3: Recent Activity feed (left) and Spend by Category mini chart (right).**
>
> **Bottom: Vendor Performance leaderboard for this property.**

### 9.2 Regional VP Dashboard

> Design the **Regional VP Dashboard** for portfolio-level oversight.
>
> **Layout:** Full-bleed.
>
> **Top: KPI strip (6 across):** Active WOs, Avg Response Time, Avg Time to Complete, SLA Compliance %, MTD Spend, YoY Spend Variance.
>
> **Row 2: Portfolio Map.** Heatmap of properties colored by SLA compliance or spend. Click a property to drill down.
>
> **Row 3: Side-by-side panels.**
> - Spend by Category (donut + breakdown).
> - Vendor Performance (table sorted by score).
>
> **Row 4: Recent Anomalies.** AI-flagged unusual spend or repeat issues.
>
> **Filter controls (sticky at top):** Date range, region, sub-portfolio, category.

### 9.3 Property Detail Page

> Design the **Property Detail page**.
>
> **Header:** Property name, address, photo carousel, key facts (unit count, year built, classification, on-site contacts).
>
> **Tabs:**
> - Overview: KPIs, recent activity, recurring issues.
> - Work Orders: filtered WO list for this property.
> - Vendors: vendors who have worked here, with performance per vendor at this property.
> - Compliance: PMC requirements applied to this property.
> - Residents: resident roster (read-only, scoped).
> - Notes and Attachments.

### 9.4 Create Work Order (PM Side)

> Design the **Create Work Order modal** for PMs.
>
> **Layout:** Centered modal, 720px wide, multi-step.
>
> **Step 1: What's the issue?** Category picker (large icon grid: Access Control, IoT, Low-Voltage, Gate, Lighting, WiFi, HVAC, Plumbing, Electrical, General Contractor, Other). Sub-category dropdown that updates based on category.
>
> **Step 2: Where?** Property selector (auto-filled if scoped), location within property (in-unit, common area, exterior, mechanical), unit number if in-unit.
>
> **Step 3: How urgent?** Urgency selector with descriptions (Emergency / Urgent / Routine / Scheduled).
>
> **Step 4: Describe.** Description textarea, photo upload (multiple), preferred schedule window.
>
> **Step 5: Resident impact.** If in-unit, resident contact info, language preference, special access notes.
>
> **Step 6: Review and submit.**
>
> Bottom: "Save Draft" and "Submit Work Order" actions.

---

## Section 10: Financials

### 10.1 AR Dashboard (Daedalus Finance)

> Design the **AR Dashboard** for Daedalus Finance.
>
> **Top KPI strip:** Total AR, Past Due, DSO, Collections Effectiveness Index.
>
> **Aging table (main):** Columns: PMC, Property, Invoice #, Issue Date, Due Date, Days Past Due, Total, Status. Rows colored by aging bucket (current to 90+).
>
> **Right rail:** Quick actions (send reminder, escalate, dispute resolution).
>
> Filters at top: PMC, property, age bucket, status.

### 10.2 Invoice Detail

> Design the **Invoice Detail page**.
>
> **Layout:** Two-column.
>
> **Left (main):** Invoice rendered in print-ready format. Daedalus letterhead. Bill-to, ship-to. Line items with cost codes (CSI MasterFormat). Subtotals. Tax. Total. Payment terms. PO reference. Lien waiver attached.
>
> **Right rail:**
> - Status pill (Draft / Sent / Viewed / Past Due / Partially Paid / Paid).
> - Aging indicator.
> - Linked WO with link.
> - Linked PO if any.
> - Actions: Send to PMC, Apply credit, Record payment, Void, Dispute.
> - Activity log.

### 10.3 POS Quick Charge

> Design the **POS Quick Charge** screen for one-off transactions.
>
> **Layout:** Tablet-optimized, can be used by office staff.
>
> **Left: Item picker.** Categorized SKUs (Service Call, Hourly Labor, Common Parts). Tap to add to cart.
>
> **Right: Cart.** Line items with quantity steppers, customer info input (PMC + property), payment method (Tap to Pay, ACH, Card on File, Send Link), tax breakdown, total.
>
> Bottom: large "Charge $X" bronze button.

### 10.4 Vendor Payouts

> Design the **Vendor Payouts page** for Daedalus Finance.
>
> Top: KPI strip (Pending Payouts, Paid This Month, Held Retainage, Factoring Outstanding).
>
> Main table: Vendor, Eligible Amount, Retainage, Factoring Status, Net Payable, Payment Method, Scheduled Date, Status. Row actions: Approve, Hold, Adjust.
>
> Right rail: bulk action panel ("Approve all eligible" with confirmation).

### 10.5 Factoring / Instant Pay (GC View)

> Design the **Factoring page** in the GC portal.
>
> Hero card: "Get paid in 1-2 business days. Factoring fee: 1.5% per invoice." Toggle: "Enable factoring on all eligible invoices."
>
> Main table: Invoice #, Property, Total, Factoring Fee, Net to You, Status (Eligible / Requested / Funded / PMC Paid). Row action: "Request advance."
>
> Right rail: account balance, total saved time, total factored YTD.

### 10.6 1099 Center

> Design the **1099 Center** page for Daedalus Finance, used at year-end.
>
> Heading: "1099-NEC Generation — Tax Year [YYYY]."
>
> Top: progress strip (TIN Match, Generate Forms, Distribute, IRS Filing).
>
> Main table: Vendor, EIN/SSN (masked), Total Paid, Backup Withholding Status, TIN Match Status, Form Status. Bulk select with bulk actions (run TIN match, generate forms, send distribution emails).
>
> Right rail: deadlines (recipient delivery, IRS filing) with countdown.

### 10.7 Change Order Approval

> Design the **Change Order Approval screen** (PM-facing).
>
> Hero: "Change Order requested on [WO Title]."
>
> Sections:
> - Reason from tech (with photos).
> - Original scope summary.
> - Proposed new scope.
> - Original total vs. revised total with delta.
> - AI assessment: "Estimated delta is in line with market." or "Estimated delta is X% above market for this change."
>
> Actions: "Approve and continue work," "Approve modified amount," "Decline." Each approval triggers documentation.

### 10.8 Lien Waiver Center

> Design the **Lien Waiver Center**.
>
> Tabs: Pending Generation, Awaiting Signature, Signed, Distributed.
>
> Each waiver row: Type, State, Amount, Tied WO, Tied Invoice, Status, Action.
>
> Detail drawer per waiver: pre-filled state-specific waiver document, signature block, distribution history.

---

## Section 11: Sales Intelligence

### 11.1 Property Signal Dashboard

> Design the **Property Signal Dashboard** for Daedalus Sales.
>
> **Layout:** Map-plus-list pattern.
>
> **Left (60%): Map of properties** with marker color/size by signal score.
>
> **Right (40%): Ranked list of properties** with signal score, top categories of complaints, last 30-day trend, owning PMC, primary contact (if known).
>
> **Top filters:** Region (default to user's territory), PMC, signal category, score threshold.
>
> Click a property to open detail.

### 11.2 Property Signal Detail

> Design the **Property Signal Detail page**.
>
> **Header:** Property name, address, owning PMC, unit count.
>
> **Main:**
> - Signal score breakdown by category (chart).
> - Recent signals: timeline of resident complaints with source (Google, Yelp, Reddit, etc.), date, category, raw quote (verbatim from public review).
> - Trend chart over 90 days.
> - Suggested talk track for outbound: "This property has 7 mentions of broken gates in 60 days. Lead with: 'We saw your residents are frustrated with gate access.'"
>
> **Right rail:** Add to pipeline, log activity, set next action.

### 11.3 Outbound Pipeline / CRM

> Design the **Outbound Pipeline page**.
>
> Kanban with stages: Prospect, Engaged, Demo, Proposal, Won, Lost. Cards show PMC name, property count, signal score, deal owner, expected close, value.
>
> Top: pipeline value summary, conversion rates between stages.
>
> Filters for owner, region, source.

### 11.4 Account Detail

> Design the **PMC Account Detail page**.
>
> **Header:** PMC name, logo, headquarters, portfolio size, # properties in our market.
>
> **Tabs:**
> - Overview: relationship summary, primary contacts, active opportunities.
> - Properties: list of all known properties with signal scores.
> - Activity: timeline of all touches.
> - Documents: any contracts, NDAs, proposals.
> - Tasks: open tasks for the account team.

---

## Section 12: Integrations Hub

### 12.1 Integrations Marketplace

> Design the **Integrations Marketplace** landing page.
>
> Heading: "Integrations." Sub: "Connect Daedalus Pro to the systems you already use."
>
> **Top: search and filter.** Categories: Property Management, Compliance, Accounting, Communication, Background Checks, Suppliers, Pricing, Mapping, Other.
>
> **Main: card grid.** Each integration card has: logo, name, one-line description, status pill (Connected / Available / Coming Soon), category tag.
>
> Click any card to open detail/config.

### 12.2 Integration Detail and Config

> Design the **Integration Detail page** for a single integration (use Yardi as the canonical example).
>
> **Header:** Logo, integration name, category, status pill, last-sync timestamp.
>
> **Sections:**
> - Description and capabilities (bulleted list of what the integration enables).
> - Connection: OAuth / API key / SSO config with required fields.
> - Data scope: toggles for what to sync (Properties, WOs, Tenants, Invoices, Vendors).
> - Field mapping: table where Daedalus fields map to Yardi fields. Drag-and-drop or dropdown selectors.
> - Sync schedule: real-time, every 15 min, hourly, daily.
> - Sync history and error logs.
> - Disconnect (destructive action with confirmation).

### 12.3 Sync Health Dashboard

> Design the **Sync Health Dashboard**.
>
> KPI strip: Active Integrations, Healthy, Warnings, Failed.
>
> Main table: Integration, Last Sync, Status, Records Processed, Errors, Action.
>
> Click into an integration row to see detailed error log with retry options.

---

## Section 13: Reporting and Analytics

### 13.1 Executive Dashboard

> Design the **Executive Dashboard** for PMC executives.
>
> **Top: 8 KPI cards (2 rows of 4):** Open WOs, Avg Response Time, First-Time-Fix %, SLA Compliance %, MTD Spend, Spend Variance vs. Budget, Avg Satisfaction Score, # Active Properties.
>
> **Row 2: Two large charts.** Spend Trend (12 months) and SLA Compliance Trend (12 months).
>
> **Row 3: Top 5 Categories of Work** (bar chart) and **Top 5 Properties by Spend** (table).
>
> **Row 4: Recent Anomalies** AI-flagged with explanation.
>
> Filters: Date range, region, category, property.

### 13.2 Vendor Scorecard

> Design the **Vendor Scorecard page** (visible to Daedalus and to PMC).
>
> **Top: vendor identity card** with tier badge, score, photo/logo.
>
> **KPI strip:** Job Count, Win Rate, Avg Response Time, Avg Time to Complete, Callback Rate, Satisfaction Score.
>
> **Main: tabbed.**
> - Performance over time (charts).
> - Compliance status snapshot.
> - Job history table.
> - Photos showcase from completed jobs.
> - PMC reviews (testimonials).
>
> **Right rail:** Action panel ("Promote tier," "Flag for review," "Suspend").

### 13.3 Custom Report Builder

> Design the **Custom Report Builder**.
>
> **Layout:** Three-pane.
>
> **Left: Field library.** Categorized data fields (WO, Vendor, Property, PMC, Financial, Compliance) that can be dragged into the canvas.
>
> **Middle: Canvas.** The user composes a report by adding blocks (KPI, chart, table, filter). Each block opens a config panel on the right.
>
> **Right: Block config.** Source field, aggregation, filters, display style.
>
> **Top bar:** Report name, save, share, schedule, export.

---

## Section 14: Admin Console

### 14.1 Tenant Management (Super Admin)

> Design the **Tenant Management page** for Super Admins.
>
> Heading: "Tenants."
>
> Top: KPI strip (Total Tenants, Active, Suspended, In Trial).
>
> Main table: Tenant, Type (PMC / GC / Daedalus), Plan, Active Users, MRR, Status, Created. Row actions: View, Impersonate, Suspend, Archive.
>
> Right rail: bulk actions and filters.

### 14.2 Role and Permission Editor

> Design the **Role and Permission Editor**.
>
> **Layout:** Two-pane.
>
> **Left:** Roles list. Standard roles plus custom roles. "Create custom role" button.
>
> **Right:** Permission matrix. Rows are resources (WOs, Vendors, Invoices, etc.). Columns are actions (View, Create, Edit, Delete, Approve, Export). Checkboxes per cell. Bulk-select rows.
>
> Footer: "Save Role" with audit-log summary of changes.

### 14.3 Feature Flags

> Design the **Feature Flags page**.
>
> Table: Flag, Description, Default, Per-Tenant Overrides count, Status. Click a flag to open detail with rollout controls (Off, Beta, Full Rollout, % Rollout).

### 14.4 Audit Log

> Design the **Audit Log page**.
>
> Heading: "Audit Log."
>
> Top: filters (Tenant, User, Resource, Action, Date Range, IP).
>
> Main: chronological event feed. Each event shows: timestamp, actor (with avatar), action, resource, before/after values (expandable diff view), IP and device.
>
> Export to CSV option.

### 14.5 System Health

> Design the **System Health Dashboard**.
>
> Top: status indicator strip (API, Web, Mobile Sync, Background Workers, Integrations, Payments). Each is a colored dot with status text.
>
> Charts: Request volume, P95 latency, error rate, queue depth.
>
> Recent incidents list.

### 14.6 Pricing and Markup Configuration

> Design the **Pricing and Markup Configuration page**.
>
> **Layout:** Per-PMC config, with a default fallback.
>
> Sections:
> - Standard markup band (slider 5-30%).
> - Per-category overrides (table where specific WO categories can have different bands).
> - After-hours surcharge multipliers.
> - Travel surcharge zones.
> - Retainage % per PMC.
> - Net payment terms.

---

## Section 15: Resident Surfaces (Lightweight Web)

### 15.1 PTE Confirmation

> Design the **Resident PTE Confirmation page**, accessed via SMS link, no login required.
>
> **Layout:** Mobile-first, single-column.
>
> Header: Daedalus + PMC co-branding.
>
> Hero: "A maintenance technician will visit your unit."
>
> Details:
> - Date and time window.
> - Reason for visit (concise: "Replace bathroom faucet").
> - Tech name and photo.
> - Tech company.
>
> Actions (large buttons):
> - "Confirm — I'll be home or it's OK to enter without me."
> - "Reschedule — Pick a different time."
> - "Decline — I do not allow entry at this time."
>
> Below: a checkbox "Pets in the unit?" with notes field.
>
> Language toggle (English / Spanish) prominent.

### 15.2 Tech ETA Tracker

> Design the **Tech ETA Tracker page**, accessed via SMS link day-of.
>
> **Layout:** Mobile-first.
>
> Top: "[Tech Name] is on the way." Live ETA with countdown.
>
> Below: Map showing tech location and resident's property (similar to Uber arrival). ETA updated in real time.
>
> Tech profile card: name, photo, company, ratings.
>
> Below: "Send a message" button (opens masked SMS thread). "Reschedule" link (with caveat: only available before tech is en route).

### 15.3 Post-Job Survey

> Design the **Resident Post-Job Survey page**.
>
> Heading: "How was your service?"
>
> Star rating (1-5).
>
> Three quick-tap categories: Quality, Cleanliness, Professionalism (each with star rating).
>
> Optional comment field.
>
> Submit. Confirmation: "Thank you. Your feedback helps us improve."

---

## Section 16: Component Patterns to Build Once and Reuse

Across the platform, these patterns appear repeatedly. Build them as reusable components in Claude Design and reference them by name in subsequent prompts:

- **WO Card** (compact list, kanban, calendar variants).
- **Vendor Card** (with tier badge).
- **Tech Avatar with Status** (online, offline, on-site, en route).
- **Status Pill** (semantic colors per status type).
- **Urgency Pill** (Emergency / Urgent / Routine / Scheduled).
- **Tier Badge** (Applicant / Verified / Preferred / Elite).
- **Document Card** (with parsed metadata and expiration).
- **KPI Card** (number, label, delta, sparkline).
- **Photo Tile** (with EXIF-verified badge and lightbox trigger).
- **Activity Feed Item** (avatar, action description, timestamp).
- **Empty State** (with classical illustration).
- **Money Display** (locale-aware, with optional secondary currency).
- **SLA Countdown Ring** (visual progress with semantic color).
- **Map Marker** (job marker, tech marker, property marker variants).
- **Compliance Pill** (Compliant / Action Needed / Expired).

---

## Section 17: Iteration Tips for Claude Design

- Build the design system file first. Lock colors, type, and primitives.
- Build Tier 1 pages, then audit the visual system. Refine.
- Reference earlier work explicitly ("use the Work Order Detail right rail pattern here").
- For repeating patterns, ask Claude Design to extract them into a reusable component before building the next variant.
- For complex pages (Work Order Detail, Dispatcher Board), build the empty state first, then a single populated state, then edge cases (loading, error, offline).
- For mobile screens, design at 1x and 2x densities, and test gloved-hand tap targets.
- The login 3D scene should be designed last. Pick a single mythological object (the wing is the strongest brand fit). Avoid scenes with multiple objects.

---

## Section 18: What to Hand Off Next

After Claude Design produces page comps, handoff artifacts to engineering should include:

- Figma library with all components named and tagged.
- Design tokens exported (colors, type, spacing, radii, shadows).
- Page-level annotations for accessibility (focus order, ARIA labels).
- Empty, loading, error states for every data view.
- Light and dark theme parity verified.
- Mobile and desktop breakpoints verified.

Engineering can then implement against this as the source of truth.
