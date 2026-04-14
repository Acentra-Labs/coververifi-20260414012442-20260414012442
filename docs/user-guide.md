# CoverVerifi User Guide

Welcome to CoverVerifi! This guide walks you through how to use the insurance compliance platform to manage subcontractor insurance verification.

## Table of Contents

- [Getting Started](#getting-started)
- [Dashboard Overview](#dashboard-overview)
- [Managing Contractors](#managing-contractors)
- [Managing Subcontractors](#managing-subcontractors)
- [Verifying Insurance](#verifying-insurance)
- [Common Workflows](#common-workflows)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

## Getting Started

### Logging In

1. Go to the CoverVerifi login page
2. Select your role:
   - **Insurance Compliance Consultant** – You manage insurance compliance for multiple construction companies
   - **General Contractor** – You're a construction company being managed by a consultant
3. Enter your email and password
4. Click "Sign In"

**Demo Credentials:**
- **Consultant:** Email: `dawn@coververifi.com` / Password: `password123`
- **General Contractor:** Email: `john@mountainwest.com` / Password: `gcpass123`

### First Time Setup

When you first log in, you'll see your dashboard with:
- **KPI Cards** at the top showing key metrics
- **Action Items** on the left (policies that need attention)
- **Contractor Cards** in the main area (if you're a consultant)

---

## Dashboard Overview

### For Consultants (Like You, If You're Dawn)

The dashboard shows you a "single pane of glass" across all your construction contractor clients.

**Top Row – Key Metrics:**
- **Total Contractors** – How many construction companies you manage
- **Total Subcontractors** – How many sub trades are in your system
- **Compliance Rate** – What percentage of all subs have current insurance
- **Action Items** – How many policies need attention (expired or expiring soon)

**Left Panel – Action Items:**
Lists all policies that need attention, sorted by urgency:
- 🔴 **Red (Expired/Lapsed)** – These need immediate action
- 🟡 **Yellow (Expiring ≤30 days)** – These will expire soon
- 🟢 **Green (Compliant)** – These are up to date

Click any action item to jump to that subcontractor's details.

**Main Area – Your Contractors:**
Shows cards for each general contractor you work with. Each card displays:
- Company name
- Number of subcontractors attached
- Contact email and phone
- "View Details" button to see all their subs

### For General Contractors

Your dashboard shows a quick overview of your subcontractors' insurance status. You can see:
- How many subs have current insurance
- Which policies are expiring soon
- Click any sub to view full policy details

---

## Managing Contractors

### Viewing All Contractors

**For Consultants:**

1. Click **"Contractors"** in the left sidebar
2. You'll see a grid of all your contractor clients
3. Each card shows:
   - Company name
   - Number of active subcontractors
   - Contact email and phone
   - "View Details" button

### Adding a New Contractor

**For Consultants:**

1. Click **"Contractors"** in the sidebar
2. Click the **"Add Contractor"** button (top right)
3. Fill in the form:
   - **Company Name** – Name of the construction company
   - **Contact Email** – Email for your main contact
   - **Contact Phone** – Phone number for your main contact
4. Click **"Add Contractor"**

That contractor will now appear in your contractor grid and dashboard.

### Viewing Contractor Details

1. Click any contractor card or click **"View Details"**
2. You'll see:
   - All subcontractors attached to this contractor
   - A table showing each sub's name, email, and insurance status (🟢 🟡 🔴)
   - Quick view of insurance status for each sub
   - "View" button to see detailed policy information

---

## Managing Subcontractors

### Adding a Subcontractor

This is a guided 4-step process. **You don't need to fill in every field if you don't have the info yet.**

**Step 1: Company Information**
- Enter the sub's company name
- Enter their phone and email
- Click "Next"

**Step 2: W-9 Form**
- Upload their W-9 form (PDF, JPG, or PNG)
- You can drag and drop or click to select
- Click "Next"

**Step 3: Insurance Agent Information**
- Enter their Workers' Compensation (WC) insurance agent's name, agency, phone, email
- Enter the carrier name, policy number, and expiration date
- Enter their General Liability (GL) insurance agent's name, agency, phone, email
- Enter the carrier name, policy number, and expiration date
- The WC and GL agents can be the same person, but enter their info in both sections
- Click "Next"

**Step 4: Review & Submit**
- Review all the information you entered
- Click "Submit & Send Verification"
- The system will send verification emails to both the WC and GL agents asking them to confirm coverage is still active

### Viewing Subcontractor Details

1. Click on any subcontractor name (from a contractor's page or from an action item)
2. You'll see:
   - The sub's company information (name, email, phone, contact date)
   - **Workers' Compensation section** showing:
     - Policy number
     - Carrier name
     - Expiration date
     - Coverage limit ($500,000 typical)
     - Insurance agent name and contact info
     - Status badge (🟢 Compliant / 🟡 Expiring Soon / 🔴 Expired)
   - **General Liability section** with the same information
   - **Send Verification** button to request updated information from the agent

---

## Verifying Insurance

### Sending a Verification Request

1. Click on a subcontractor to view their details
2. Under their Workers' Comp or General Liability policy, click **"Send Verification"**
3. A preview of the email will appear showing what the agent will receive
4. Click **"Send Request"**
5. You'll see a confirmation message that the email was sent

**What Happens Next:**
- An email is sent to the insurance agent asking them to confirm the coverage is still active
- The agent can respond by:
  - Confirming coverage is still active
  - Uploading a new Certificate of Insurance (COI)
  - Flagging that they're no longer the agent
- You'll see the response recorded in the system

### Understanding Status Colors

- **🟢 Green (Compliant)** – The policy is current (expires more than 30 days from today)
- **🟡 Yellow (Expiring Soon)** – The policy expires in 1-30 days. Send a verification request to the agent soon.
- **🔴 Red (Expired)** – The policy has expired or you don't have coverage information. This is critical and needs immediate action.

### Understanding Policy Information

When you click "Send Verification" or view a subcontractor's details, you'll see:

- **Policy Number** – The insurance policy ID (e.g., "WC-123456-RH")
- **Carrier** – The insurance company name (e.g., "State Farm")
- **Expiration Date** – When the policy ends (e.g., "Apr 23, 2026")
- **Coverage Limit** – How much the insurance covers (e.g., "$500,000" for WC, "$1,000,000" for GL)
- **Agent Name & Agency** – Who to contact about the policy
- **Days Remaining** – How many days until expiration

---

## Common Workflows

### Workflow 1: Weekly Compliance Review

1. Log in to your CoverVerifi dashboard
2. Look at the **"Action Items"** panel on the left
3. For each 🔴 **Red item:**
   - Click it to view the subcontractor
   - Click "Send Verification" to request updated coverage from the agent
   - If the agent doesn't respond in 24 hours, call them directly
4. For each 🟡 **Yellow item:**
   - Click it to view the subcontractor
   - Send a verification request asking to confirm or renew before expiration
5. Record any responses or follow-ups you make in your notes

### Workflow 2: Adding a New Contractor Client

1. Click "Contractors" in the sidebar
2. Click "Add Contractor"
3. Enter their company info
4. Click "Add Contractor"
5. Once added, start adding their subcontractors:
   - From the contractor's detail page, click "Add Subcontractor"
   - Follow the 4-step wizard for each sub

### Workflow 3: Processing an Agent's Verification Response

When an insurance agent verifies coverage:

1. You'll see a notification (or check the system for updates)
2. The policy status will update automatically:
   - If they confirmed coverage: Status stays 🟢 Green
   - If they confirm the policy lapsed: Status changes to 🔴 Red
   - If they upload a new certificate: It's stored in the system
3. Follow up as needed based on their response

### Workflow 4: Handling an Expired Policy (Critical)

1. You see a 🔴 Red policy in your action items
2. Click it to view the subcontractor's details
3. Note the expiration date and agent contact info
4. **Immediately call or email the agent** to ask:
   - Is this policy renewed?
   - Do they have a new policy in place?
   - When will they have updated documentation?
5. **Call the subcontractor** directly if you can't reach the agent:
   - Ask if they've renewed their policy
   - Ask for the agent's contact info
   - Ask when they can provide updated documentation
6. Use the "Send Verification" button in the system to formally request updated information
7. **Do not allow payment draws** to this sub until coverage is confirmed

---

## Agent Verification Portal

### What is the Agent Portal?

The "Agent Verification Portal" is a simple form that insurance agents receive via email. They don't need to:
- Create a login
- Download an app
- Learn how to use a complicated system

They just:
1. Receive an email from CoverVerifi
2. Click the link in the email
3. Answer "Yes" or "No" to whether coverage is still active
4. Optionally upload a new Certificate of Insurance
5. Click submit

The portal handles the rest.

### For Insurance Agents Receiving a Request

If you're an insurance agent receiving a CoverVerifi verification request:

1. Click the link in the email
2. You'll see the subcontractor and policy details
3. Select "Yes, coverage is active" or "No, coverage has lapsed"
4. Optionally upload a new Certificate of Insurance PDF
5. Add any notes (e.g., "Renewal pending," "Policy effective next month")
6. Click "Submit Verification"
7. You'll see a thank-you message confirming your response was recorded

---

## Troubleshooting

### "I can't log in"

1. **Check your email address** – Make sure you're using the correct email
2. **Check your password** – Passwords are case-sensitive
3. **Select the right role** – If you're a consultant, select "Insurance Compliance Consultant"
4. **Clear your browser cache** – Try incognito/private mode
5. **Still stuck?** Contact support@acentralabs.com

### "I added a subcontractor but it's not showing up"

1. Make sure you completed all 4 steps of the wizard
2. Verify you clicked "Submit & Send Verification" on the final step
3. Refresh the page to see the updated list
4. If still missing, you may have accidentally navigated away – try adding again

### "The policy expiration date is wrong"

1. Click on the subcontractor to view details
2. Verify the date you see matches the actual policy
3. If it's different, we may need to update it (contact support)
4. The date should be in MM/DD/YYYY format

### "An insurance agent says they never got my verification email"

1. Check your email settings – The email came from `noreply@coververifi.com`
2. Ask them to check spam/junk folder
3. You can try resending from the system by going to the subcontractor's detail page and clicking "Send Verification" again
4. Alternatively, copy the agent's email from the system and send them a personal email with the verification link

### "A status changed unexpectedly"

The status is calculated based on the expiration date:
- **🟢 Green** – More than 30 days until expiration
- **🟡 Yellow** – 1-30 days until expiration
- **🔴 Red** – Expired or 0 days left

If a date just passed, the status will automatically change from yellow to red. This is expected.

### "I can't find a contractor or subcontractor I added"

1. Check the left sidebar – Are you in the right section? (Contractors vs. Subs)
2. Use your browser's search function (Ctrl+F or Cmd+F) to find the name on the page
3. Refresh the page
4. If still missing, log out and log back in to refresh your session

---

## FAQ

**Q: Can I add a subcontractor that already works for another contractor?**  
A: Yes! The same subcontractor can be attached to multiple contractors. Their information is shared in the system to save you time.

**Q: What happens if a subcontractor's insurance lapses?**  
A: Their status will turn 🔴 Red. This means they should not be on any active job sites until coverage is restored. You should not authorize payment draws until coverage is confirmed.

**Q: How long does it take for an agent to respond to a verification request?**  
A: Typically 1-3 business days. If it's been longer, follow up with a phone call.

**Q: Can I set up automatic reminders?**  
A: The system shows you action items on the dashboard. Future versions may include email reminders (coming soon).

**Q: What if an insurance agent says they're no longer working with the subcontractor?**  
A: Use the verification portal to flag this. We'll mark the agent as inactive and you'll need to contact the subcontractor to find out who their new agent is.

**Q: Can I export my compliance data for audits?**  
A: Export to PDF/CSV is coming in a future update. For now, you can screenshot your dashboard or use your browser's print function to save as PDF.

---

## Support

### Getting Help

**For Login or Account Issues:**  
Email: support@acentralabs.com

**For Feature Requests:**  
Let us know what would make your job easier. We're continuously improving CoverVerifi based on feedback.

**For Urgent Issues (Policy Lapsed, Can't Access System):**  
Email: support@acentralabs.com with "URGENT" in the subject line, or call us directly.

### Contact Acentra Labs

**Website:** https://acentralabs.com  
**Email:** support@acentralabs.com  
**Phone:** [Will be provided upon launch]

---

## Tips & Best Practices

1. **Check your dashboard every Monday** – Stay on top of expiring policies
2. **Send verification requests at least 30 days before expiration** – Gives agents time to respond
3. **Keep agent contact info up to date** – Call if an email bounces
4. **Document your follow-ups** – Note when you called, what they said, when you expect an update
5. **Don't rely on email alone** – If it's critical, call the agent directly
6. **For large jobs, verify compliance before work starts** – Not after

---

**Version 1.0 – April 2026**  
**Built by [Acentra Labs](https://acentralabs.com)**

Questions? Email **support@acentralabs.com**
