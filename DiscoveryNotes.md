# Discovery Brief: CoverVerifi

**Generated:** 20260414012442

---

## App Overview
**App Name:** CoverVerifi
**Alternative Names:** SubShield, ComplianceHQ, InsureGuard

CoverVerifi is a lightweight insurance compliance platform built for construction consultants who verify subcontractor insurance on behalf of general contractors. It replaces the current manual process of phone calls, spreadsheets, and One Drive folders with automated email workflows, centralized document storage, and real-time compliance dashboards. The tool is purpose-built to solve one problem well — unlike expensive, bloated competitors (Procore, HCSS, Avetta) that bundle compliance into massive suites.

## Target Users

**Primary: Insurance Compliance Consultant (Dawn)**
- Solo consultant managing insurance compliance for multiple GC clients
- Non-technical; current workflow is spreadsheets + phone calls + email
- Needs a single pane of glass across all her GC clients
- Future goal: resell the platform to other consultants

**Secondary: General Contractors (GCs)**
- Small-to-mid construction companies in Idaho (3-5 GCs initially, ~15-20 subs each)
- Need to verify sub insurance before every payment draw
- Want quick mobile access to check compliance status on job sites
- Currently rely on Dawn to manage this manually

**Tertiary: Insurance Agents**
- Receive verification requests and upload updated certificates
- Need a frictionless experience — no login, no app download
- Must be able to confirm coverage status or flag they're no longer the agent

**Tertiary: Subcontractors**
- Passive participants; their data is managed by Dawn/GCs
- May need to upload documents in future phases [INFERRED]

## Core Problem

Idaho general contractors are legally liable for their subcontractors' insurance gaps. Under **Idaho Code 72-216**, if a sub's workers' comp lapses and a worker is injured, the GC becomes the "statutory employer" — personally liable for all medical costs, lost wages, plus a 10% penalty. Penalties can be recovered for up to 3 years back at $25/day or $2/employee/day.

**Current workarounds:**
- Spreadsheets tracking sub names, agents, and expiration dates
- Manual phone calls to 20+ different insurance agencies per job
- Checking certificates stored in One Drive before each payment draw
- No automated alerts when policies lapse — often discovered too late
- No way to verify general liability lapses (agents aren't required to notify)

**Real-world risk example from notes:** A roofing sub's employee fell off a roof. The sub had no proper workers' comp. The injured worker could go after the head contractor AND the homeowner.

**Why existing solutions fail:**
- Procore, HCSS — expensive, bloated, too many features
- myCOI, Jones — enterprise pricing ($1,500-$10,000+/year), not designed for solo consultants
- Avetta — 38% user satisfaction, charges subs without consent, confusing pricing
- No competitor serves the "consultant managing compliance FOR multiple GCs" persona

## Platform Recommendation

**Web App (mobile-responsive)** — A responsive web application accessible on desktop and mobile browsers.

**Reasoning:**
- Dawn works from a desk managing data — needs full desktop experience
- GCs need quick mobile access on job sites — responsive design handles this
- Insurance agents interact via email links only — no app needed
- A native mobile app adds 2-3x development time with minimal benefit at this stage
- Progressive Web App (PWA) capabilities can be added later for offline/install [INFERRED]

## Build Type

**web** — Full web application with custom UI

**Reasoning:**
- Multiple user roles (consultant, GC, agent) with different views require custom UI
- Automated email workflows need a backend beyond what Sheets can provide
- Document upload/storage (COIs, W-9s) requires file handling infrastructure
- The consultant's future goal of reselling to other consultants demands a proper multi-tenant app
- Public-facing agent verification links require a web server
- This is not a simple data tracking problem — it's a workflow automation tool

## Recommended Tech Stack

**React + Vite + TailwindCSS + shadcn/ui (SPA) with Supabase backend**

| Layer | Choice | Reasoning |
|-------|--------|-----------|
| Frontend | React + Vite | Fast build, component-based, large ecosystem |
| Styling | TailwindCSS + shadcn/ui | Rapid UI development, consistent design system, accessible components out of the box |
| Backend/DB | Supabase (PostgreSQL) | Auth, database, file storage, edge functions, row-level security for multi-tenancy — all in one |
| Email | Resend or SendGrid | Transactional email with template support, delivery tracking |
| File Storage | Supabase Storage | COI and W-9 document uploads |
| Hosting | Vercel or Netlify | Zero-config SPA deployment, cost-efficient for low traffic |
| Auth | Supabase Auth | Email/password for consultants and GCs; magic links for agents |

## Competitive Landscape

| Competitor | Annual Cost (small use) | Free Tier | Consultant Fit | Rating |
|------------|------------------------|-----------|----------------|--------|
| **myCOI/illumend** | $1,500-3,000+ | No | Poor — enterprise-oriented, slow reviews | 3-3.5/5 |
| **Avetta** | ~$2,500/yr | No | Very Poor — charges subs, 38% satisfaction | Poor |
| **TrustLayer** | Unknown (mid-range) | Mentioned | Uncertain — no SMB pricing | 4+/5 |
| **Jones** | $10,000+ | No | Not viable — full-service enterprise only | 3.5/5 |
| **BCS** | $0 (free up to 25 vendors) | Yes | Best existing option — but no multi-GC consultant view | 4+/5 |
| **Constrafor** | Unknown | Trial only | Moderate — construction-focused but payment-heavy | 4.7/5 |

**Key market gaps CoverVerifi fills:**
1. **No product is built for the consultant persona** — every competitor assumes the user IS the GC
2. **Multi-GC management is absent** — no tool lets one consultant manage compliance across multiple GC clients simultaneously
3. **Pricing opacity** — only BCS publishes transparent pricing; affordable, transparent pricing is a differentiator
4. **Overkill for small operators** — most tools bundle invoicing, project management, safety docs; Dawn just needs insurance compliance

## Key Requirements

### MUST HAVE (MVP — 3-5 Day Prototype)

1. **Consultant Admin Dashboard**
   - Portfolio-level view: total GCs, total subs, overall compliance percentage
   - RAG status indicators (Green: compliant, Yellow: expiring within 30 days, Red: expired/missing)
   - Action items panel sorted by severity (expired first)
   - GC card grid showing per-GC compliance summary

2. **General Contractor Management**
   - Add/edit GC profiles (company name, contact info, specific requirements)
   - Per-GC view showing all attached subcontractors
   - Configurable compliance requirements per GC (e.g., require additional insured endorsement or not) [INFERRED]

3. **Subcontractor Onboarding & Management**
   - Multi-step wizard: Company Info → W-9 Upload → Insurance Agent Info → Review
   - W-9 document upload and storage with annual renewal tracking
   - Insurance agent contact info (name, agency, phone, email) per sub
   - Attach subs to one or more GCs (subs can work for multiple GCs)
   - Sub detail view: GL status, WC status, policy numbers, expiration dates, agent info
   - Shared sub database: if a sub already exists in the system, auto-populate known info when a new GC adds them (but GCs cannot see which other GCs use that sub)

4. **Insurance Compliance Tracking**
   - Workers' Compensation: policy number, carrier, expiration date, status
   - General Liability: policy number, carrier, expiration date, coverage limit (verify against $1M standard)
   - Additional Insured endorsement tracking (checkbox per GC — some require it, some don't)
   - Ghost policy flag/warning [INFERRED — based on research showing ghost policies are indistinguishable from real coverage]
   - Automatic status calculation based on expiration dates
   - 30-day expiration warning threshold

5. **Automated Email Workflows**
   - Email templates for: verification request to agent, expiration reminder, lapsed policy alert
   - Merge fields: `{{sub_name}}`, `{{gc_name}}`, `{{policy_type}}`, `{{expiration_date}}`, `{{agent_name}}`
   - One-click send with preview from the sub detail page
   - Email to both agent AND subcontractor when insurance has lapsed
   - Templates customizable per GC (GC branding/info in emails)

6. **Insurance Agent Verification Portal**
   - Tokenized email links — no login required
   - Agent can: confirm coverage is still active (yes/no), upload a new certificate, flag "I am no longer this person's agent"
   - Simple, mobile-friendly single-page form

7. **Document Storage**
   - Upload and store COI certificates (ACORD 25 format) and W-9 forms
   - Associate documents with specific subs and GCs
   - View/download stored documents
   - Track document expiration dates [INFERRED]

8. **Authentication & Authorization**
   - Consultant login (email/password) with full system access
   - GC login (email/password) scoped to their subs only
   - Row-level security so GCs never see other GCs' data
   - Agent access via tokenized links (no login)

### SHOULD HAVE (Phase 2)

9. **GC Self-Service Portal**
   - GCs can add new subcontractors themselves (triggering verification workflow)
   - GCs can view compliance dashboard for their subs
   - Mobile-optimized view for on-site use

10. **W-9 Parsing** [FROM NOTES]
    - Ingest W-9 PDFs, auto-extract fields (company name, EIN, address, entity type)
    - Highlight missing or unreadable fields for manual entry
    - OCR or AI-based extraction [INFERRED]

11. **Notification System**
    - In-app notifications for consultant and GCs when compliance status changes
    - Push notifications for GCs on mobile [INFERRED]
    - Configurable notification preferences [INFERRED]

12. **Idaho Industrial Commission Integration** [INFERRED]
    - Link to or lookup workers' comp registration status with IIC
    - Sole proprietor exemption tracking (sole props in Idaho don't require WC but GC pays if audited)

### NICE TO HAVE (Phase 3+)

13. **Multi-Consultant / Reseller Model**
    - Other consultants can sign up with their own GC clients
    - Tenant isolation between consultants
    - White-label or co-branding options [INFERRED]

14. **Subcontractor Agreement Management** [FROM NOTES — "nice to have"]
    - Annual subcontract agreement tracking
    - Upload and store signed agreements
    - Renewal reminders

15. **Advanced Reporting**
    - Audit-ready compliance reports per GC [INFERRED — needed for annual audits mentioned in notes]
    - Historical compliance timeline per sub
    - Export to PDF/CSV

16. **Payment Draw Verification Workflow** [FROM NOTES]
    - "I have a draw this month for these people" — bulk verify all subs on a specific draw
    - Checklist view: sub name, compliance status, last verified date
    - Block/flag payment if compliance is not current

## UX Considerations

**Dashboard Layout (F-pattern scanning):**
- Top row: Portfolio summary stats (total GCs, total subs, compliance %, expiring this month)
- Left panel: Action items sorted by severity
- Main area: GC cards in a responsive grid (1 col mobile, 2 col tablet, 3 col desktop)

**Navigation Model:**
- Consultant: Dashboard → click GC card → GC detail → click sub → Sub detail
- Breadcrumb trail: `Dashboard > Mountain West Builders > John's Roofing`
- GC users see only their scoped view (no multi-GC layer)

**RAG Status System:**
- Green (Compliant): `bg-emerald-50 text-emerald-700` + CheckCircle icon
- Yellow (Expiring ≤30 days): `bg-amber-50 text-amber-700` + AlertTriangle icon
- Red (Expired/Missing): `bg-red-50 text-red-700` + XCircle icon
- Gray (Pending): `bg-slate-50 text-slate-500` — awaiting initial verification
- Always combine color + icon + text label (never color alone — accessibility)

**Mobile Design:**
- Responsive breakpoints: mobile <768px, tablet ≥768px, desktop ≥1280px
- Tables transform to card lists on mobile
- Touch targets: minimum 44x44px (60px for primary actions — gloved use on job sites)
- `text-base` (16px) minimum on mobile for outdoor readability

**Onboarding Wizard (Add Subcontractor):**
- Step 1: Company info (name, phone, email)
- Step 2: W-9 upload (drag-and-drop or file picker)
- Step 3: Insurance agent info (agent name, agency, phone, email — for WC and GL separately if different)
- Step 4: Review & submit → triggers automated verification email to agent(s)

**Email UX:**
- Pre-built templates with merge fields (not a drag-and-drop builder)
- Preview modal shows interpolated email before sending
- One-click "Request Verification" from sub detail page
- Delivery status tracking: Sent → Opened → Link Clicked → Completed

## Technical Considerations

**Data Model (Core Entities):**
- `consultants` — platform users (Dawn, future consultants)
- `general_contractors` — GC companies, linked to a consultant
- `subcontractors` — shared across GCs, linked via junction table
- `gc_subcontractors` — many-to-many linking GCs to subs with GC-specific settings
- `insurance_policies` — WC and GL policies per sub (type, carrier, policy number, limits, dates)
- `insurance_agents` — agent/agency contact info, linked to policies
- `documents` — uploaded COIs and W-9s, linked to subs
- `verification_requests` — email audit trail (who was asked, when, response)
- `verification_tokens` — tokenized links for agent portal
- `email_templates` — per-GC customizable templates
- `notifications` — system alerts for compliance changes [INFERRED]

**Multi-Tenancy:**
- Row-level security (RLS) in Supabase/PostgreSQL
- Consultant sees all their GCs; GC sees only their subs
- Subs shared across GCs but GC-specific data (e.g., additional insured requirement) stored in junction table
- Agent portal is stateless — tokenized access, no tenant context needed

**Email Infrastructure:**
- Transactional email via Resend or SendGrid
- Template rendering with variable substitution
- Delivery tracking (sent, opened, clicked) via webhook [INFERRED]
- Rate limiting to avoid spam flags [INFERRED]

**File Storage:**
- Supabase Storage buckets for COIs and W-9s
- Organize by: `/{consultant_id}/{gc_id}/{sub_id}/{document_type}/{filename}`
- File type validation (PDF, JPG, PNG) [INFERRED]
- Max file size: 10MB [INFERRED]

**Idaho-Specific Compliance Logic:**
- Workers' Comp: required for any employer with 1+ employees; sole proprietors exempt by default but GC pays if audited
- General Liability: $300K state minimum, $1M industry standard
- Additional Insured: configurable per GC (some require, some don't)
- ACORD 25 is the standard COI format — future parsing opportunity

**Security:**
- Supabase Auth with email/password (consultant, GC roles)
- Tokenized links with expiration for agent portal (no login needed)
- RLS policies enforcing tenant isolation
- HTTPS everywhere [INFERRED]
- Document access scoped by role [INFERRED]

**Cost Estimate (Monthly):**
- Supabase Free Tier: $0 (covers MVP scale — 50K rows, 1GB storage, 50K auth users)
- Resend Free Tier: $0 (100 emails/day — sufficient for MVP)
- Vercel Free Tier: $0 (hobby plan covers SPA hosting)
- Domain: ~$12/year
- **Total MVP hosting: $0-12/month** — scales to ~$25-50/month on Supabase Pro when needed

## Open Questions

1. **Domain name:** Dawn mentioned SubComply, InsureTrack (domains taken). Does she want us to secure a domain for CoverVerifi or another name? Recommend checking availability for: coververifi.com, coververifi.app, getsubshield.com
2. **Email sender domain:** For professional email delivery, Dawn will need a verified sending domain. Does she have one, or should we set up a subdomain (e.g., notify@coververifi.com)? [INFERRED]
3. **Exact GL/WC limits:** Notes say $1M GL and $500K WC "MAYBE — need to verify." These should be configurable per GC rather than hardcoded, but we need to confirm Idaho standard minimums with Dawn.
4. **Endorsement details:** Notes mention "something about endorsement but missed it." Need to clarify which endorsement types to track beyond Additional Insured (e.g., Waiver of Subrogation, Primary & Non-Contributory).
5. **Annual audit support:** Dawn mentioned GCs are "audited once a year and have to prove they had it." Does she need exportable audit reports showing historical compliance status, or is current-state tracking sufficient for MVP?
6. **Pricing model for Dawn's business:** If she plans to charge GCs for this service, does she want subscription management / billing built in, or will she handle billing externally? [INFERRED]
