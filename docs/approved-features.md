# Approved Features: CoverVerifi

### MUST HAVE

1. **Consultant Admin Dashboard** — Portfolio-level overview showing all GCs, all subs, compliance percentage, and red/yellow/green action items sorted by severity. This is the "single pane of glass" that demonstrates core value. Without this, the app cannot show its purpose.
   - **Components:** DashboardLayout.jsx, PortfolioSummaryCards.jsx (4 KPI cards), ActionItemsList.jsx (scrollable severity-sorted list), GCCardGrid.jsx (responsive 1/2/3-col layout), RAGStatusBadge.jsx (reusable icon + label + color)
   - **Packages:** shadcn/ui (Card, Badge, Button), lucide-react (CheckCircle2, AlertTriangle, XCircle icons), date-fns (date math for expiration logic)
   - **Routes:** `GET /dashboard` → renders DashboardLayout with all GCs for logged-in consultant
   - **Mock Data:** Seed 3 GCs (Mountain West Builders, HomeWorks Inc, Interstate Concrete), 15 subs across them with mixed RAG statuses (5 green, 7 yellow expiring in 10-25 days, 3 red expired)
   - **Implementation:** KPI cards show `(total_gcs, total_subs, compliance_percentage, expiring_this_month)`. Action items populated by querying all subs, calculating `days_to_expiration = (policy_expiration_date - today)`, assigning RAG (Green >30d, Yellow 1-30d, Red ≤0d or missing). GC cards link to `/gcs/:gcId`.

2. **General Contractor & Subcontractor Management** — GCs are created by the consultant; each GC can have multiple subs attached. This allows the consultant to structure their client base and track which subs belong to which GCs. A GC detail page shows all attached subs in a searchable/sortable table.
   - **Components:** GCListView.jsx (sortable table of GCs), GCDetailView.jsx (GC info + subcontractor table), AddGCModal.jsx (simple form), SubcontractorTable.jsx (table with columns: sub_name, wc_status, gl_status, agent_name, last_verified)
   - **Packages:** @tanstack/react-table (sorting, filtering), shadcn/ui (Table, Dialog, Button, Input), react-hook-form (GC add form validation)
   - **Routes:** `GET /gcs` → GC list, `GET /gcs/:gcId` → GC detail with sub table, `POST /gcs` (create), `DELETE /gcs/:gcId` (delete)
   - **Mock Data:** Pre-create 3 GCs (full contact info), attach 5-6 subs to each via gc_subcontractors junction table
   - **Implementation:** GC add form collects (company_name, contact_email, contact_phone, gl_requirement, wc_requirement, require_additional_insured checkbox). GC detail page queries subcontractors via gc_subcontractors join, displays in TanStack table with inline quick-view of current compliance for each sub.

3. **Subcontractor Onboarding Wizard** — 4-step form to add a new subcontractor: Company Info → W-9 Upload → Insurance Agent Info → Review & Submit. Multi-step UX keeps cognitive load low for a non-technical user. Triggering the wizard auto-sends a verification email to the agent (mocked).
   - **Components:** SubOnboardingWizard.jsx (state machine / step router), Step1CompanyInfo.jsx (form fields), Step2W9Upload.jsx (drag-drop file input), Step3AgentInfo.jsx (agent name/agency/phone/email), Step4Review.jsx (summary + submit button), StepIndicator.jsx (visual progress: 1/2/3/4)
   - **Packages:** react-hook-form (form state + validation), zustand (multi-step wizard state), clsx (conditional styling), lucide-react (icons)
   - **Routes:** `GET /subs/new` (wizard container), form data submitted to `POST /subs` (creates subcontractor + policies)
   - **Mock Data:** Populate Step4Review with example W-9 file name and agent names pre-filled
   - **Implementation:** Wizard stores state in Zustand store; each step validates before allowing next. Step 2 uses native HTML5 `<input type="file" accept=".pdf,.jpg,.png">` with drag-drop listeners on a dropzone div (no external library). Step 3 collects two agents (WC agent, GL agent can be same). Step 4 shows full summary; submit triggers record creation (subcontractor, gc_subcontractors link, insurance_policies stub, insurance_agents) and toast notification (mocked email sending for now).

4. **Compliance Status Tracking & Display** — Per-subcontractor view showing current WC and GL policy details (policy number, carrier, expiration date, coverage limit) with RAG status calculated from days-to-expiration. Expiration timeline visual shows which policies expire soonest. This is where the risk is visible.
   - **Components:** SubDetailView.jsx (layout), ComplianceStatusCard.jsx (WC and GL each in separate card with RAG badge), PolicyDetailsPanel.jsx (table of policy fields), ExpirationTimeline.jsx (horizontal timeline or sorted list of upcoming expirations), SubInfoPanel.jsx (company, contact, W-9 status)
   - **Packages:** shadcn/ui (Card, Table, Badge), date-fns (formatDate, differenceInDays), lucide-react (Calendar, AlertTriangle icons)
   - **Routes:** `GET /subs/:subId` → SubDetailView with all policy data
   - **Mock Data:** For each sub, create 2 insurance_policies rows (type: 'workers_comp' and 'general_liability') with realistic expiration dates (some in 5d, 15d, 45d, 90d)
   - **Implementation:** Query sub + all policies (with agent details). Calculate RAG: `const daysLeft = differenceInDays(expiration_date, today())`. Render ComplianceStatusCard for WC and GL side-by-side; each shows policy_number, carrier, expiration_date (formatted), RAG badge, and coverage_limit. ExpirationTimeline queries all subs' policies sorted by expiration_date ascending, renders as a simple list showing "X days until expiration" in red/yellow/green.

5. **Insurance Agent Verification Request Workflow** — UI to send a pre-built email to the agent requesting current coverage confirmation. Consultant selects a sub, clicks "Send Verification," sees an email template preview with merged fields (`{{sub_name}}`, `{{policy_type}}`, `{{expiration_date}}`, `{{agent_name}}`), and sends it. For MVP, this is UI-only (logs to console or shows mock success toast). Real email integration comes in Phase 2.
   - **Components:** VerificationRequestModal.jsx (triggered from sub detail), TemplateSelector.jsx (dropdown of pre-built templates), EmailPreview.jsx (shows rendered template with merged fields), SendConfirmation.jsx (success toast)
   - **Packages:** react-hook-form (template selection), react-hot-toast (notifications), shadcn/ui (Dialog, Button, Select, Textarea)
   - **Routes:** Modal accessed from `/subs/:subId` detail page; `POST /verification-requests` (creates a record + mocked email send)
   - **Mock Data:** Pre-seed 3 email templates (e.g., "Request Verification", "Urgent Renewal Reminder", "Policy Lapse Alert") with merge field placeholders
   - **Implementation:** Modal component accepts `subId` prop; fetches sub + agent details. TemplateSelector lets consultant pick a template. EmailPreview shows the template with merge fields replaced (e.g., {{sub_name}} → "ABC Roofing"). Send button triggers POST to create verification_request record (status: 'pending') and displays toast "Verification request sent to [agent_email]." Console.log or mock success response. (In Phase 2, swap this with real Resend/SendGrid API call and delivery tracking.)

6. **Insurance Agent Verification Portal** — Public-facing form accessible via tokenized email link (no login required). Agent can confirm coverage is still active (Yes/No radio), optionally upload a new COI certificate, or flag "I am no longer this person's agent." Form is mobile-friendly and validates email format. For MVP, token validation is mocked (any token is valid).
   - **Components:** AgentVerificationForm.jsx (main form), PolicyStatusSelector.jsx (Yes/No radios for WC and GL separately), CertificateUploadZone.jsx (file drop zone), SubmissionConfirmation.jsx (thank-you message)
   - **Packages:** react-hook-form (form state), react-dropzone or native `<input type="file">` (drag-drop upload), zustand (form state), shadcn/ui (RadioGroup, Button, Textarea)
   - **Routes:** `GET /verify/:tokenId` → AgentVerificationForm (no login), `POST /verify/:tokenId` (submit verification response)
   - **Mock Data:** Mock validation for token (any token is accepted); seed with pre-filled sub and policy names (read-only display)
   - **Implementation:** Route param `:tokenId` is extracted; on load, fetch sub + policy details via RLS (token grants access, no user context needed). Render form with two sections: one for WC, one for GL. Each allows agent to select "Coverage Active" or "Coverage Lapsed." Optional file input for COI (stored in Supabase Storage at `/{sub_id}/coi_{timestamp}.pdf`). On submit, update verification_status in insurance_policies table and create verification_response record (agent_response: 'active'|'lapsed', uploaded_document: file_path). Show SubmissionConfirmation ("Thank you, [agent_name]. Your response has been recorded.").

7. **Authentication & Multi-Tenant Authorization** — Consultant login (email/password) with full system access; GC login (email/password) scoped to only their own subcontractors via row-level security (RLS). Agent access is via public tokenized links (no login). This enforces the multi-tenant model and prevents data leakage.
   - **Components:** LoginPage.jsx (email/password form + role selector), AuthContext.jsx (React Context to manage auth state), ProtectedRoute.jsx (guards routes by role)
   - **Packages:** @supabase/auth-helpers-react (Supabase Auth integration), zustand (auth state), react-router-dom (routing)
   - **Routes:** `GET /login`, `POST /login` (email/password), `GET /logout`, protected routes redirect to `/login`
   - **Mock Data:** Pre-seed auth_users table with test accounts: 1 consultant (email: consultant@test.com / password: test123), 2 GC users (gc1@test.com, gc2@test.com)
   - **Implementation:** LoginPage shows email + password fields and a radio selector for "Consultant" or "GC" role. On submit, call Supabase Auth's `signInWithPassword()`. RLS policies ensure: consultant users can read/write all GCs and subs they own; GC users can only read subs linked via gc_subcontractors where their gc_id matches. ProtectedRoute checks `user.role` and redirects if not authorized. Session persists via Supabase Auth cookies.

### NICE TO HAVE

1. **Document Storage & Management** — Upload and store COI certificates and W-9 forms with version tracking. Download/preview stored documents. Track document expiration dates and renewal reminders. This enhances auditability but is not required for core MVP value.
   - **Why deferred:** Document storage is secondary to tracking; MVP can function with links to OneDrive/Google Drive. Once compliance tracking is validated, document management is a natural Phase 2 add-on.
   - **Components:** DocumentList.jsx (table of docs), DocumentUploadModal.jsx, DocumentPreview.jsx (embed PDF viewer)
   - **Packages:** react-pdf (PDF preview), shadcn/ui (Tabs, Button)
   - **Routes:** `GET /subs/:subId/documents`, `POST /subs/:subId/documents` (upload), `GET /documents/:docId` (download)

2. **GC Self-Service Subcontractor Addition** — GC users can add new subcontractors themselves instead of relying on the consultant to do it. Triggers the same onboarding workflow. Reduces friction but adds complexity to the GC user experience.
   - **Why deferred:** MVP focuses on consultant-driven workflow. GC portal is Phase 2 once consultant experience is solid.
   - **Components:** GCSubOnboardingWizard.jsx (same as #3 but scoped to one GC)
   - **Routes:** `GET /gc-dashboard` (GC home), `POST /gcs/:gcId/subs` (add sub as GC)

3. **Notification System** — In-app alerts when compliance status changes (expires today, became yellow, etc.). Consultant can configure notification preferences (email, in-app, push). This adds engagement but delays MVP.
   - **Why deferred:** MVP can function without notifications; email workflow reminders are sufficient. Notifications are a Phase 2 engagement feature.
   - **Components:** NotificationCenter.jsx (sidebar/bell icon), NotificationPreferences.jsx (settings)
   - **Packages:** react-hot-toast (toast notifications), zustand (notification state)

4. **W-9 PDF Parsing & Auto-Extraction** — Ingest W-9 PDFs and automatically extract company name, EIN, address, entity type using OCR or AI. Highlights missing/unreadable fields. Reduces manual data entry but adds backend complexity.
   - **Why deferred:** Requires third-party OCR/AI integration (AWS Textract, Google Vision, or Claude AI). MVP can use manual form entry with optional file upload. Parsing is Phase 2.
   - **Packages:** aws-sdk (Textract), or Anthropic SDK for Claude

5. **Advanced Compliance Reporting** — Export audit-ready reports per GC (PDF, CSV) showing historical compliance status, policy timelines, verification responses. Required for GC audits but MVP can function with dashboard screenshots.
   - **Why deferred:** Reporting is a Phase 2 feature once the data model is validated. MVP demos current-state tracking.
   - **Components:** ReportBuilder.jsx, ReportPreview.jsx
   - **Packages:** jspdf (PDF generation), papaparse (CSV export)

6. **Payment Draw Verification Workflow** — Bulk verify all subs on a specific payment draw (consultant provides list of subs for a draw, system shows compliance checklist). Useful but requires additional UX complexity.
   - **Why deferred:** MVP can verify one sub at a time. Bulk verification is Phase 2.
   - **Routes:** `GET /draws` (list), `POST /draws` (create), `GET /draws/:drawId/verification`

### FUTURE

1. **Multi-Consultant Reseller Model** — Other consultants can sign up with their own GC clients; each consultant's data is isolated (separate tenant). White-label or co-branded options. This is a business model feature, not MVP-critical.
   - **Why deferred:** Requires full multi-tenancy implementation (org isolation, white-label UI, billing). MVP assumes single consultant (Dawn).

2. **Idaho Industrial Commission (IIC) API Integration** — Look up subcontractor WC registration status with IIC to verify claimed policies are real. Confirms coverage is not a ghost policy. Adds credibility but is a backend integration.
   - **Why deferred:** Requires IIC API access (may require credentials/approval) and backend Edge Function. Mockable data in MVP, real integration in Phase 2.

3. **Email Delivery Tracking** — Track when verification emails are opened, links clicked, certificates uploaded. Webhook callbacks from Resend/SendGrid provide delivery status. Useful for follow-up workflow but not critical for core value.
   - **Why deferred:** Requires email provider account and webhook infrastructure. MVP uses mocked emails.

4. **GC Billing & Subscription Management** — Charge GCs per month or per sub for platform access. Requires Stripe/payment integration and billing logic. Revenue feature, not MVP.
   - **Why deferred:** Business model decision; can be added once GC adoption is validated.

5. **Advanced Compliance Rules Engine** — Configurable rules per GC (e.g., "WC must cover this class code," "GL must include 3M endorsement," "auto-block payment if WC lapsed"). Adds flexibility but is Phase 2 complexity.
   - **Why deferred:** MVP uses simple rule (expiration = RAG status). Complex rules engine comes after UX validation.

---

### IMPLEMENTATION NOTES

**Build Order (3-5 day sprint):**
1. **Day 1 (Setup & Auth):** Supabase project setup, schema migration, Supabase Auth integration, LoginPage component, ProtectedRoute wrapper, test login flow (consultant + GC)
2. **Day 2 (Data & Dashboard):** Seed mock data (consultants, GCs, subs, policies), build DashboardLayout + KPI cards + GCCardGrid, implement RAG calculation logic, test dashboard with mock data
3. **Day 3 (GC & Sub Management):** Build GCListView + GCDetailView, SubDetailView with compliance cards, add GCManagementModal, implement GC/sub CRUD operations
4. **Day 4 (Sub Onboarding & Verification):** Build 4-step SubOnboardingWizard with form validation + file upload, VerificationRequestModal with email template preview, Agent verification portal (public form)
5. **Day 5 (Polish & Testing):** Responsive design (mobile < 768px, tablet ≥ 768px, desktop ≥ 1280px), accessibility (ARIA labels, keyboard navigation, WCAG colors), cross-browser testing, deploy to Vercel

**Dependencies & Data Flow:**
- Authentication is a prerequisite for all other features (protect routes first)
- Dashboard depends on GC + sub data, so seed mock data early
- Sub detail page depends on policy data (insurance_policies table must be populated)
- Verification portal is independent (no auth required, token-based access only)

**Assumptions & Risks:**
- Assumes Supabase free tier is sufficient for MVP scale (50K rows, 1GB storage, 50K auth users) — true for 3-5 GCs × 15-20 subs
- Email workflows are mocked (console.log or toast only); real email integration requires Resend API key and environment variable setup
- W-9 document validation is file type/size only (PDF, JPG, PNG, max 10MB); no OCR in MVP
- Token-based agent access assumes any token is valid (no expiration check in MVP)
- GC RLS policies are enforced at database level; frontend assumes Supabase Auth is the source of truth
- Mobile responsiveness uses Tailwind breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px); no native mobile app in MVP

**Suggested Packages (Complete List):**
- **UI:** shadcn/ui (buttons, cards, tables, dialogs, badges, forms)
- **Form Handling:** react-hook-form (validation, state management)
- **State Management:** zustand (wizard steps, notifications, auth state)
- **Tables:** @tanstack/react-table (sorting, filtering, column visibility)
- **Dates:** date-fns (expiration logic, formatting, calculations)
- **Icons:** lucide-react (RAG badges, alerts, actions)
- **Styling:** tailwindcss (already in brief), clsx (conditional classes)
- **Auth:** @supabase/auth-helpers-react (login, session management)
- **Routing:** react-router-dom (navigation, protected routes)
- **Notifications:** react-hot-toast (success/error feedback)
- **File Upload:** native HTML5 + zustand (no external library needed for MVP)
- **HTTP Client:** @supabase/supabase-js (already included with auth-helpers)

---

## Data Model

**Supabase PostgreSQL Schema for CoverVerifi MVP:**

```sql
-- Consultants (platform users managing GCs)
CREATE TABLE consultants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  company_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- General Contractors (GC companies, owned by a consultant)
CREATE TABLE general_contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultant_id uuid NOT NULL REFERENCES consultants(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  contact_email text,
  contact_phone text,
  gl_requirement numeric DEFAULT 1000000,
  wc_requirement numeric DEFAULT 500000,
  require_additional_insured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_general_contractors_consultant ON general_contractors(consultant_id);

-- Subcontractors (shared across GCs, linked via gc_subcontractors)
CREATE TABLE subcontractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  phone text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- GC-Subcontractor Junction (many-to-many)
CREATE TABLE gc_subcontractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gc_id uuid NOT NULL REFERENCES general_contractors(id) ON DELETE CASCADE,
  sub_id uuid NOT NULL REFERENCES subcontractors(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(gc_id, sub_id)
);
CREATE INDEX idx_gc_subcontractors_gc ON gc_subcontractors(gc_id);
CREATE INDEX idx_gc_subcontractors_sub ON gc_subcontractors(sub_id);

-- Insurance Agents
CREATE TABLE insurance_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name text NOT NULL,
  agency_name text,
  phone text,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Insurance Policies (WC and GL)
CREATE TABLE insurance_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_id uuid NOT NULL REFERENCES subcontractors(id) ON DELETE CASCADE,
  policy_type text NOT NULL CHECK (policy_type IN ('workers_comp', 'general_liability')),
  carrier text,
  policy_number text,
  expiration_date date NOT NULL,
  coverage_limit numeric,
  agent_id uuid REFERENCES insurance_agents(id),
  status text DEFAULT 'pending' CHECK (status IN ('active', 'lapsed', 'pending', 'expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_insurance_policies_sub ON insurance_policies(sub_id);
CREATE INDEX idx_insurance_policies_expiration ON insurance_policies(expiration_date);

-- Documents (COIs, W-9s)
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_id uuid NOT NULL REFERENCES subcontractors(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('coi', 'w9')),
  file_path text,
  file_name text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);
CREATE INDEX idx_documents_sub ON documents(sub_id);

-- Verification Requests (email audit trail)
CREATE TABLE verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id uuid REFERENCES insurance_policies(id),
  agent_id uuid REFERENCES insurance_agents(id),
  gc_id uuid REFERENCES general_contractors(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'responded')),
  created_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  response text
);
CREATE INDEX idx_verification_requests_status ON verification_requests(status);

-- Verification Tokens (for agent portal links)
CREATE TABLE verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id uuid REFERENCES insurance_policies(id),
  token text UNIQUE NOT NULL,
  token_hash text, -- for secure comparison
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_verification_tokens_token ON verification_tokens(token_hash);
CREATE INDEX idx_verification_tokens_expires ON verification_tokens(expires_at);

-- Email Templates (per GC)
CREATE TABLE email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gc_id uuid REFERENCES general_contractors(id) ON DELETE CASCADE,
  template_name text NOT NULL,
  subject text,
  body text,
  merge_fields text[], -- array of field names like ['sub_name', 'policy_type', 'expiration_date']
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_email_templates_gc ON email_templates(gc_id);

-- RLS Policies
ALTER TABLE general_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE gc_subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;

-- Consultant can see all their own GCs and all subs linked to those GCs
CREATE POLICY consultants_see_own_gcs ON general_contractors
  FOR SELECT USING (consultant_id = auth.uid()::uuid);

-- GC users can see only their own subs via the junction table
CREATE POLICY gcs_see_own_subs ON subcontractors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM gc_subcontractors
      WHERE gc_subcontractors.sub_id = subcontractors.id
      AND gc_subcontractors.gc_id = (
        SELECT id FROM general_contractors
        WHERE general_contractors.id = auth.uid()::uuid
      )
    )
  );
```

**Example Mock Data (SQL):**

```sql
-- Insert test consultant
INSERT INTO consultants (id, email, full_name, company_name) VALUES
  ('550e8400-e29b-41d4-a716-446655440000'::uuid, 'consultant@test.com', 'Dawn', 'Compliance First LLC');

-- Insert test GCs
INSERT INTO general_contractors (id, consultant_id, company_name, contact_email, contact_phone) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'Mountain West Builders', 'john@mountainwest.com', '208-555-0101'),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'HomeWorks Inc', 'sarah@homeworks.com', '208-555-0102'),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440000'::uuid, 'Interstate Concrete', 'mark@concrete.com', '208-555-0103');

-- Insert test subcontractors
INSERT INTO subcontractors (id, company_name, phone, email) VALUES
  ('650e8400-e29b-41d4-a716-446655440001'::uuid, 'John\'s Roofing', '208-555-1001', 'john@roofing.com'),
  ('650e8400-e29b-41d4-a716-446655440002'::uuid, 'ABC Electrical', '208-555-1002', 'abc@electrical.com'),
  ('650e8400-e29b-41d4-a716-446655440003'::uuid, 'Smith Plumbing', '208-555-1003', 'smith@plumbing.com'),
  ('650e8400-e29b-41d4-a716-446655440004'::uuid, 'Pro Painting', '208-555-1004', 'pro@painting.com'),
  ('650e8400-e29b-41d4-a716-446655440005'::uuid, 'Foundation Experts', '208-555-1005', 'foundation@experts.com');

-- Link subs to GCs
INSERT INTO gc_subcontractors (gc_id, sub_id) VALUES
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid),
  ('550e8400-e29b-41d4-a716-446655440001'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid),
  ('550e8400-e29b-41d4-a716-446655440002'::uuid, '650e8400-e29b-41d4-a716-446655440003'::uuid),
  ('550e8400-e29b-41d4-a716-446655440003'::uuid, '650e8400-e29b-41d4-a716-446655440004'::uuid);

-- Insert test agents
INSERT INTO insurance_agents (id, agent_name, agency_name, phone, email) VALUES
  ('750e8400-e29b-41d4-a716-446655440001'::uuid, 'Bob Smith', 'State Farm Local', '208-555-2001', 'bob@statefarm.com'),
  ('750e8400-e29b-41d4-a716-446655440002'::uuid, 'Jane Doe', 'Allstate Agency', '208-555-2002', 'jane@allstate.com');

-- Insert test insurance policies (mixed expiration dates for RAG demo)
INSERT INTO insurance_policies (id, sub_id, policy_type, carrier, policy_number, expiration_date, coverage_limit, agent_id, status) VALUES
  -- John's Roofing (expires soon)
  ('850e8400-e29b-41d4-a716-446655440001'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'workers_comp', 'State Farm', 'WC-12345', '2026-04-23', 500000, '750e8400-e29b-41d4-a716-446655440001'::uuid, 'active'),
  ('850e8400-e29b-41d4-a716-446655440002'::uuid, '650e8400-e29b-41d4-a716-446655440001'::uuid, 'general_liability', 'State Farm', 'GL-12345', '2026-03-20', 1000000, '750e8400-e29b-41d4-a716-446655440001'::uuid, 'active'),
  -- ABC Electrical (compliant)
  ('850e8400-e29b-41d4-a716-446655440003'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'workers_comp', 'Allstate', 'WC-67890', '2026-08-15', 500000, '750e8400-e29b-41d4-a716-446655440002'::uuid, 'active'),
  ('850e8400-e29b-41d4-a716-446655440004'::uuid, '650e8400-e29b-41d4-a716-446655440002'::uuid, 'general_liability', 'Allstate', 'GL-67890', '2026-07-10', 1000000, '750e8400-e29b-41d4-a716-446655440002'::uuid, 'active');
```

**Supabase Storage Buckets:**
- `cois` — Certificate of Insurance files, organized as `/consultant_id/gc_id/sub_id/coi_{timestamp}.pdf`
- `w9s` — W-9 forms, organized as `/consultant_id/sub_id/w9_{timestamp}.pdf`

---

## QUICK START CHECKLIST (for developers)

- [ ] Create Supabase project; run schema + RLS migration
- [ ] Create Firebase/Supabase Auth config for test accounts
- [ ] Initialize Vite + React + TailwindCSS + shadcn/ui
- [ ] Install dependencies: `npm install react-hook-form zustand date-fns lucide-react react-hot-toast @tanstack/react-table @supabase/auth-helpers-react react-router-dom`
- [ ] Set up Supabase environment variables (.env.local)
- [ ] Create LoginPage component + AuthContext
- [ ] Seed mock data into Supabase
- [ ] Build DashboardLayout with KPI cards + GC grid (Day 2 priority)
- [ ] Build SubOnboardingWizard with form validation + file upload (Day 4 priority)
- [ ] Test mobile responsiveness (Tailwind: sm 640, md 768, lg 1024, xl 1280px breakpoints)
- [ ] Deploy to Vercel (authenticate Vercel with GitHub, connect Supabase env vars)

---

## SOURCES
- [myCOI/illumend AI-Powered Insurance Compliance](https://mycoitracking.com/mycoi-launches-illumend/)
- [Construction Dashboard UI Patterns](https://www.mastt.com/blogs/ultimate-construction-dashboard-capital-projects)
- [shadcn/ui Data Table with TanStack Table](https://ui.shadcn.com/docs/components/radix/data-table)
- [React Multi-Step Form Wizard Pattern](https://medium.com/@vandanpatel29122001/react-building-a-multi-step-form-with-wizard-pattern-85edec21f793)
- [Email Verification Token Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)
- [React Drag-and-Drop File Upload](https://dev.to/hexshift/implementing-drag-drop-file-uploads-in-react-without-external-libraries-1d31)
- [RAG Status Dashboard Design](https://www.mastt.com/blogs/project-rag-status-dashboard)
- [Enterprise UI Design Principles 2026](https://hashbyt.com/blog/enterprise-ui-design)
