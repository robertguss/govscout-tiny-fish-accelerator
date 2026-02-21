# GovScout Week 1 — Manual E2E Testing Guide

Use this guide to verify every feature built during Week 1. Work through
sections in order — each section builds on the previous one.

**Prerequisites:**

- Dev server running: `pnpm run dev` (starts both Next.js on port 3000 and
  Convex dev)
- Environment variables set in Convex:
  - `BETTER_AUTH_SECRET` — should already be set
  - `SITE_URL` — `http://localhost:3000`
  - `SAM_GOV_API_KEY` — needed for Section 6
  - `TINYFISH_API_KEY` — needed for Section 7 (optional if credits not yet
    available)
- `.env.local` has `NEXT_PUBLIC_CONVEX_SITE_URL` pointing to your `.convex.site`
  URL

---

## Section 1: Landing Page

**URL:** `http://localhost:3000`

### 1.1 Page loads correctly

- [ ] Page renders without errors
- [ ] "GovScout" appears as the logo/brand in the top-left nav
- [ ] Nav shows "Sign in" (ghost button) and "Start Free" (primary button) in
      top-right
- [ ] Hero section shows badge: "The Stripe of Government Contracting"
- [ ] H1: "Find government contracts your competitors miss"
- [ ] Subtitle mentions GovWin ($13,000/year), GovDash (sales call), and our
      price ($49/month)

### 1.2 Hero CTAs

- [ ] "Start Free — No Card Required" button is present and styled as primary
- [ ] "See Pricing" button is present and styled as outline
- [ ] Clicking "See Pricing" scrolls or links to the pricing section

### 1.3 Stats bar

- [ ] Three stats appear: `$2.3T+`, `350,000+`, `90,000+`
- [ ] Each stat has a descriptive label below it

### 1.4 Pricing section

- [ ] Three pricing cards: **Free** ($0/mo), **Starter** ($49/mo),
      **Professional** ($99/mo)
- [ ] Starter card has a "Most popular" badge or highlighted styling
- [ ] Free card features: 10 searches/month, federal only, 1 saved search
- [ ] Starter card features: unlimited search, federal + 1 state, AI matching,
      daily alerts
- [ ] Professional card features: federal + 5 states, set-aside filtering,
      pipeline tracking, 14-day free trial
- [ ] Each card has a button linking to `/signup`

### 1.5 Footer

- [ ] Footer shows GovScout tagline
- [ ] Footer links: Pricing, Login, Sign Up

### 1.6 Already-logged-in redirect

- [ ] If you are already logged in (tested later), visiting `/` redirects to
      `/dashboard`

---

## Section 2: Sign Up Flow

**URL:** `http://localhost:3000/signup`

### 2.1 Sign up page

- [ ] Sign up form renders (email + password fields)
- [ ] Form is styled and functional

### 2.2 Create a test account

- [ ] Enter email: `test@govscout.com` (or any test email)
- [ ] Enter password: `TestPassword123!`
- [ ] Submit the form
- [ ] No error is displayed
- [ ] You are redirected (to dashboard or onboarding)

> **Note:** If you see a 500 error on sign up, check that
> `NEXT_PUBLIC_CONVEX_SITE_URL` in `.env.local` ends in `.convex.site` and is
> NOT `localhost:3000`.

---

## Section 3: Onboarding Wizard

**URL:** `http://localhost:3000/dashboard/onboarding`

After signing up, you should land here automatically if your profile is not yet
complete.

### 3.1 Step 1 — Company & Location

- [ ] Progress bar shows step 1 of 3 active
- [ ] "Company & Location" or "Welcome to GovScout" heading appears
- [ ] Company name text input is present
- [ ] Grid of US state abbreviations renders (should show all 50 states + DC)
- [ ] Clicking a state highlights it (toggle behavior)
- [ ] Clicking the same state again deselects it
- [ ] Selected state count shows below the grid (e.g., "2 selected")
- [ ] "Continue" button is present and enabled
- [ ] No "Back" button on step 1

**Test actions:**

- Enter company name: `Acme Cybersecurity LLC`
- Select states: `VA` and `MD`
- Click "Continue"

### 3.2 Step 2 — NAICS Codes & Keywords

- [ ] Progress bar shows step 2 active
- [ ] NAICS codes input is present with placeholder `541512, 541519`
- [ ] Keywords input is present
- [ ] "Back" button is present (returns to step 1)
- [ ] "Continue" button is present

**Test actions:**

- Enter NAICS codes: `541512, 541519`
- Enter keywords: `cybersecurity, network infrastructure`
- Click "Continue"

### 3.3 Step 3 — Certifications

- [ ] Progress bar shows step 3 active
- [ ] Four certification checkboxes: 8(a), HUBZone, SDVOSB, WOSB
- [ ] Each has a description label
- [ ] "None / Not sure" option is present
- [ ] Checking a cert unchecks "None" and vice versa
- [ ] "Back" button present
- [ ] "Start Finding Contracts" button present (not "Continue")

**Test actions:**

- Check `SDVOSB`
- Click "Start Finding Contracts"
- Verify: loading state briefly appears, then redirect to `/dashboard`

### 3.4 Verify onboarding doesn't repeat

- [ ] After completing onboarding, navigating to `/dashboard` does NOT redirect
      back to onboarding
- [ ] Refreshing `/dashboard` stays on dashboard

---

## Section 4: Dashboard Home

**URL:** `http://localhost:3000/dashboard`

### 4.1 Layout

- [ ] GovScout sidebar is visible on the left
- [ ] Sidebar shows: Dashboard, Search, Pipeline, Saved Searches, Coverage Map,
      Profile links
- [ ] Sidebar header shows "GovScout" (NOT "Acme Inc.")
- [ ] Site header renders at top
- [ ] User avatar/menu accessible

### 4.2 Stats cards

- [ ] Four stat cards render: Total Opportunities, Federal, State, Local
- [ ] Initially shows `0` or `—` (no data yet — that's fine)
- [ ] Cards have correct icons (Globe, Building2, MapPin, TrendingUp)

### 4.3 Recent Opportunities section

- [ ] "Recent Opportunities" card renders
- [ ] "View all →" link is present, points to `/dashboard/search`
- [ ] Empty state message appears: "No opportunities yet. Run a search or wait
      for the nightly sync."

### 4.4 Indexed Portals section

- [ ] "Indexed Portals" card is NOT visible yet (portals haven't been seeded
      from the client)
- [ ] This card appears after portals are seeded (done in Section 6)

---

## Section 5: Search Page

**URL:** `http://localhost:3000/dashboard/search`

### 5.1 Layout

- [ ] Same sidebar and header as dashboard
- [ ] Search bar with search icon at the top
- [ ] "Search" button to the right of the input
- [ ] Two filter dropdowns below: "Source" and "Set-Aside"

### 5.2 Search with no data

- [ ] Page loads without errors
- [ ] No results message shows (empty state with Search icon)
- [ ] Typing in the search box and pressing Enter doesn't crash

### 5.3 Source filter options

- [ ] Dropdown shows: All Sources, Federal, State, County, Municipal
- [ ] Selecting a source updates the filter

### 5.4 Set-Aside filter options

- [ ] Dropdown shows: All Set-Asides, Small Business, 8(a), HUBZone, SDVOSB,
      WOSB, Unrestricted
- [ ] Selecting a set-aside updates the filter

### 5.5 Clear filters

- [ ] With a filter selected, "Clear filters" button appears
- [ ] Clicking it resets all filters

---

## Section 6: Seed Data via Convex Dashboard

This section uses the Convex dashboard to run backend functions and populate the
database.

**Open the Convex dashboard:** `npx convex dashboard`

### 6.1 Seed the portal registry

In the Convex dashboard:

1. Click **Functions** in the left sidebar
2. Find `portals` → `seedInitialPortals`
3. Click **Run** with args: `{}`
4. Expected result: `3` (number of portals seeded)

**Verify in Data tab:**

- [ ] `portals` table has 3 records
- [ ] Records for: "California Cal eProcure", "Texas SmartBuy", "Virginia eVA"
- [ ] Each has `enabled: true` and a `goalTemplate` field with a long prompt
      string

### 6.2 Check dashboard shows portals

Back in browser at `http://localhost:3000/dashboard`:

- [ ] "Indexed Portals" section now appears
- [ ] Shows 3 badge pills: "California Cal eProcure (0 opps)", "Texas SmartBuy
      (0 opps)", "Virginia eVA (0 opps)"
- [ ] The `(0 opps)` count will update after scraping

### 6.3 Run SAM.gov federal sync

**Requires SAM_GOV_API_KEY to be set in Convex environment.**

In Convex dashboard → Functions:

1. Find `jobs` → `nightlyFederalSync`
2. Run with args: `{ "daysBack": 7, "maxPages": 2 }`
3. Wait ~10-30 seconds for completion (it makes HTTP calls to SAM.gov)
4. Expected result: `null` (check Convex logs for the actual counts)

**Check Convex Logs tab:**

- [ ] Log entry: "Starting nightly SAM.gov sync..."
- [ ] Log entry: "SAM.gov sync complete: N fetched, N new" (N should be > 0 if
      API key is valid)

**Alternative — run syncSamGov directly:**

1. Functions → `actions/syncSamGov` → `syncSamGov`
2. Run with args: `{ "daysBack": 7, "maxPages": 1 }`
3. Expected result: `{ "total": N, "newOpportunities": N }` where N > 0

**Verify in Data tab:**

- [ ] `opportunities` table has records
- [ ] Records have `sourceType: "sam_gov"`, `agencyLevel: "federal"`,
      `active: true`
- [ ] Records have `title`, `agency`, `solicitationNumber` populated

### 6.4 Verify dashboard updates with real data

Back in browser at `http://localhost:3000/dashboard` (real-time via Convex):

- [ ] **Total Opportunities** stat card shows a number > 0
- [ ] **Federal** stat card shows the same number (all data is federal for now)
- [ ] **Recent Opportunities** section shows 5 opportunity cards
- [ ] Each card shows title, agency name, and "federal" badge

### 6.5 Test search with real data

At `http://localhost:3000/dashboard/search`:

- [ ] Default view (no search query) shows recent opportunities
- [ ] Each result card shows:
  - [ ] Title (bold)
  - [ ] External link icon (🔗) linking to `sam.gov` — clicking opens in new tab
  - [ ] "Federal" badge
  - [ ] State badge (if place of performance has a state)
  - [ ] Agency name with Building2 icon
  - [ ] Deadline countdown (e.g., "45d left") if deadline is set
- [ ] Results count appears at the bottom (e.g., "50 opportunities")

### 6.6 Test search with query

- [ ] Type `cybersecurity` in the search box and press Enter or click Search
- [ ] Results filter to opportunities with "cybersecurity" in the title
- [ ] Results count updates

### 6.7 Test source filter

- [ ] Select "Federal" from Source dropdown
- [ ] All results show "Federal" badge (no SLED results yet)
- [ ] Select "State" — should show 0 results (no SLED data yet)
- [ ] "Clear filters" resets to all results

---

## Section 7: TinyFish SLED Scraping (Optional — Requires API Key)

**Requires TINYFISH_API_KEY to be set in Convex environment.**

This section tests the TinyFish web agent integration. Skip if you don't have
API credits yet.

### 7.1 Get CA portal ID

In Convex dashboard → Data → `portals` table:

- [ ] Note the `_id` value for "California Cal eProcure" (looks like
      `jd7abc123...`)

### 7.2 Run scraping action for CA portal

In Convex dashboard → Functions → `actions/scrapeSledPortal` →
`scrapeSledPortal`:

Run with args (replace `YOUR_CA_PORTAL_ID` with the actual ID from step 7.1):

```json
{
  "portalId": "YOUR_CA_PORTAL_ID",
  "url": "https://caleprocure.ca.gov/pages/Events/event-search.aspx",
  "goalTemplate": "Extract all currently active solicitations/bids/RFPs from this California government procurement portal (Cal eProcure). Navigate to the opportunities/solicitations listing, and extract each opportunity as a JSON object with these fields: title, agency, deadline, estimatedBudget, solicitationNumber, contactName, contactEmail, sourceUrl. Return a JSON object with key \"opportunities\" containing an array of these objects. Only include active/open solicitations.",
  "state": "CA",
  "agencyLevel": "state"
}
```

Expected result:

```json
{ "success": true, "count": N, "newCount": N }
```

Where N is the number of CA opportunities found (typically 20-200).

**Verify:**

- [ ] Result shows `"success": true`
- [ ] `count` > 0
- [ ] Convex Data → `opportunities` table has records with `state: "CA"` and
      `sourceType: "state_portal"`
- [ ] Convex Data → `portals` table: CA portal has `lastScrapeStatus: "success"`
      and `lastScrapeCount` updated

### 7.3 Verify SLED data appears in UI

At `http://localhost:3000/dashboard`:

- [ ] **State** stat card now shows a number > 0
- [ ] **Total Opportunities** has increased

At `http://localhost:3000/dashboard/search`:

- [ ] Select "State" from Source dropdown
- [ ] CA opportunities appear in results
- [ ] Each shows "State" badge + "CA" state badge
- [ ] Source URL links point to Cal eProcure

---

## Section 8: Nightly Cron Schedule

This verifies the cron jobs are registered (not that they've run yet — they run
nightly).

### 8.1 Check crons in Convex dashboard

In Convex dashboard → **Crons** (left sidebar):

- [ ] "sync sam.gov" cron appears — scheduled at `0 6 * * *` (6am UTC)
- [ ] "nightly sled scrape" cron appears — scheduled at `0 7 * * *` (7am UTC)
- [ ] Both show "Enabled" status
- [ ] "Next run" shows a future timestamp

---

## Section 9: Auth & Session Management

### 9.1 Sign out and sign back in

- [ ] Click user avatar/menu in sidebar header
- [ ] Sign out option is available
- [ ] Clicking Sign Out redirects to `/` (landing page)
- [ ] Landing page shows Sign In / Start Free buttons (not dashboard links)
- [ ] Click "Sign in" → `/login`
- [ ] Enter credentials: `test@govscout.com` / `TestPassword123!`
- [ ] After login, redirected to `/dashboard`
- [ ] Dashboard shows the onboarding data from Section 3 (profile was saved)

### 9.2 Protected routes

- [ ] While logged out, navigate directly to `http://localhost:3000/dashboard`
- [ ] Should redirect to `/login` (middleware protection)
- [ ] After logging in, should redirect back to `/dashboard`

### 9.3 Already-logged-in redirect on landing page

- [ ] While logged in, navigate to `http://localhost:3000`
- [ ] Should redirect to `/dashboard` (client-side redirect)

---

## Section 10: Sidebar Navigation

### 10.1 Nav links

- [ ] **Dashboard** link → `/dashboard` ✓ (functional)
- [ ] **Search** link → `/dashboard/search` ✓ (functional)
- [ ] **Pipeline** link → `/dashboard/pipeline` (shows 404 or empty — not built
      yet, that's expected)
- [ ] **Saved Searches** link → `/dashboard/saved` (shows 404 — not built yet)
- [ ] **Coverage Map** link → `/dashboard/coverage` (shows 404 — not built yet)
- [ ] **Profile** link → `/dashboard/profile` (shows 404 — not built yet)

### 10.2 Active state

- [ ] Currently active route is highlighted in the sidebar
- [ ] Switching pages updates the active highlight

---

## Section 11: Onboarding Redirect (Edge Cases)

### 11.1 New user redirect

- [ ] Sign out
- [ ] Create a second account: `test2@govscout.com` / `TestPassword123!`
- [ ] After signing up, should land on `/dashboard/onboarding`
- [ ] Completing the wizard should redirect to `/dashboard`

### 11.2 Incomplete onboarding redirect

- [ ] In Convex dashboard → Data → `userProfiles` table
- [ ] Find your profile and note `onboardingComplete: true`
- [ ] Temporarily patch it to `false` (use Edit in Convex dashboard)
- [ ] Refresh `/dashboard` — should redirect to `/dashboard/onboarding`
- [ ] Complete wizard again to restore `onboardingComplete: true`

---

## Section 12: Automated Tests

Run the full test suite to confirm all unit tests pass:

```bash
pnpm run test:once
```

**Expected output:**

```
✓ convex/userProfiles.test.ts (3 tests)
✓ convex/portals.test.ts (3 tests)
✓ convex/opportunities.test.ts (4 tests)

Test Files  3 passed (3)
      Tests  10 passed (10)
```

- [ ] All 3 test files pass
- [ ] All 10 tests pass
- [ ] No errors or warnings

---

## Section 13: Production Build

```bash
pnpm run build
```

- [ ] Build completes with no errors
- [ ] No TypeScript compilation errors
- [ ] All pages are generated (look for "Generating static pages" in output)

---

## Quick Reference: Convex Dashboard Actions

| Action              | Where to find                                           | Args                               |
| ------------------- | ------------------------------------------------------- | ---------------------------------- |
| Seed portals        | Functions → portals → seedInitialPortals                | `{}`                               |
| Sync SAM.gov        | Functions → jobs → nightlyFederalSync                   | `{ "daysBack": 7, "maxPages": 2 }` |
| Scrape CA portal    | Functions → actions/scrapeSledPortal → scrapeSledPortal | See Section 7.2                    |
| Check opportunities | Data → opportunities                                    | Filter by sourceType               |
| Check portals       | Data → portals                                          | —                                  |
| Check user profile  | Data → userProfiles                                     | —                                  |
| Check cron schedule | Crons (sidebar)                                         | —                                  |

---

## Known Limitations (Week 2 Work)

These are expected gaps — not bugs:

- Pipeline, Saved Searches, Coverage Map, Profile pages return 404 (pages not
  built yet)
- SLED data only appears if TinyFish API key is available and working
- Search without data shows empty state (correct behavior)
- Stats dashboard shows `—` until data is loaded (correct behavior)
- Set-aside filtering on SLED opportunities requires AI classification (Week 2
  feature)
- No email alerts yet (Resend component not installed until Week 2)
- No Stripe billing yet (Week 2 feature)

---

## Troubleshooting

| Symptom                        | Check                                                                                  |
| ------------------------------ | -------------------------------------------------------------------------------------- |
| 500 error on sign up/login     | `NEXT_PUBLIC_CONVEX_SITE_URL` must end in `.convex.site`, NOT `localhost:3000`         |
| SAM.gov sync returns 0 results | Verify `SAM_GOV_API_KEY` is set: `npx convex env list`                                 |
| TinyFish scrape fails          | Verify `TINYFISH_API_KEY` is set; check Convex Logs for error                          |
| Dashboard shows stale data     | Convex real-time — if data isn't updating, check Convex dev server is running          |
| Onboarding keeps repeating     | Check `userProfiles` table in Convex dashboard — `onboardingComplete` should be `true` |
| Build fails                    | Run `npx convex codegen` first, then retry build                                       |
