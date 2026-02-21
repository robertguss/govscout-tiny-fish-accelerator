# Deep Research Prompt: Finding the Ideal First Vertical for a Live Web Lead Intelligence Product

## Context

I'm building a B2B lead intelligence product called ScoutLive that uses
AI-powered web agents (TinyFish) to extract lead data from the live web in
real-time, bypassing traditional stale databases like Apollo (275M contacts),
ZoomInfo, and Clay. Instead of querying pre-crawled databases that decay over
time (users report 5-10% bounce rates, months-old job titles, weak niche
coverage), our product fans out browser agents in parallel across 10-20+ live
web sources simultaneously — company websites, state licensing registries, trade
association directories, job boards, Google Maps, review sites, etc. — and
returns structured, timestamped lead dossiers guaranteed fresh.

The product has two modes:

1. **Live Lead Enrichment:** Given a company name/domain, fan out across live
   sources and return a rich dossier (current team, tech stack from job posts,
   funding, reviews, news, etc.)
2. **Live Lead List Building:** Given an ICP description + vertical/geography,
   build a net-new lead list by scraping sources that databases don't index —
   state registries, trade associations, licensing boards, niche directories,
   etc.

Our unit economics work at roughly $0.60-1.00 cost per lead enrichment, selling
at $2-5+ per lead. The key advantage is coverage of niches and verticals where
Apollo/ZoomInfo have thin or stale data, plus guaranteed freshness.

## What I Need You to Research

I need to identify the **single best vertical market** to use as our first wedge
— the vertical we'll demo, target first, and use to prove the concept before
expanding horizontally. The ideal vertical has ALL of these characteristics:

### Must-Have Criteria

1. **Poor coverage in existing lead databases (Apollo, ZoomInfo, Clay,
   Clearbit)**
   - Look for industries where users actively complain about data quality,
     missing contacts, or thin coverage in these tools
   - Small/medium businesses, local services, regulated professions, and
     fragmented industries tend to be underserved
   - Industries where businesses don't typically have a strong LinkedIn presence
     are especially interesting

2. **Rich, freely accessible online data sources that are NOT in databases**
   - State or federal licensing/regulatory registries with searchable public
     records
   - Active trade association or professional organization member directories
   - Industry-specific directories or listing sites
   - Government contractor or certification databases
   - The more structured and comprehensive these sources are, the better

3. **Buyers who have budget and urgency for lead data**
   - Someone in this vertical's ecosystem is actively spending money to find and
     sell to these businesses
   - Examples: SaaS companies selling vertical software, wholesale distributors,
     insurance providers, equipment vendors, franchise consultants, compliance
     services
   - The buyer should already be using tools like Apollo or Clay and finding
     them inadequate for this vertical

4. **High volume of targetable businesses**
   - Hundreds of thousands of businesses in the US alone
   - Enough volume to support a venture-scale business, not just a niche
     consultancy

5. **Businesses that have a meaningful web presence even if they're not on
   LinkedIn**
   - They have websites (even basic ones) with staff pages, service
     descriptions, contact info
   - They show up on Google Maps with reviews
   - They post job openings somewhere (even if not on LinkedIn)
   - They may have social media presence on platforms other than LinkedIn

### Nice-to-Have Criteria

6. **Regulatory or licensing requirements that create authoritative public data
   sources**
   - Industries where practitioners MUST be licensed create registries that are
     comprehensive, current, and publicly searchable
   - Examples: insurance agents, real estate agents, contractors, healthcare
     providers, financial advisors, attorneys

7. **Frequent business changes that make database staleness especially painful**
   - High turnover, frequent job changes, new businesses opening regularly,
     businesses closing
   - Seasonal patterns that databases can't keep up with

8. **Emotional resonance for a demo**
   - The vertical should be one where a 2-minute demo creates an immediate "wow,
     I can't get this anywhere else" reaction
   - Ideally, we can show a side-by-side: "Here's what Apollo returns for this
     vertical" vs. "Here's what we found from the live web"

## Specific Questions to Answer

For your top 3-5 recommended verticals, please provide:

1. **What specific freely accessible online sources exist?** (Name the actual
   websites/registries/directories with URLs if possible)
2. **Who is the buyer of lead data in this vertical?** (Not the businesses
   themselves, but who is trying to SELL TO these businesses)
3. **What's the approximate market size?** (Number of businesses in the US, and
   the size of the ecosystem selling to them)
4. **What do Apollo/ZoomInfo users say about coverage in this vertical?** (Any
   reviews, forum posts, Reddit threads, etc. discussing data gaps)
5. **How structured and scrapable are the public data sources?** (Do they have
   searchable databases with filters, or are they just static HTML pages?)
6. **What data fields would be uniquely available from live web sources that
   databases miss?** (License status, specializations, years in practice,
   disciplinary actions, CE credits, etc.)

## Verticals to Investigate (Starting Points, But Don't Limit Yourself)

- Independent insurance agencies/agents
- General contractors / specialty trades (plumbing, electrical, HVAC)
- Real estate brokerages/agents (beyond what Zillow provides)
- Independent healthcare practices (dental, chiropractic, optometry, veterinary)
- Attorneys / small law firms
- Independent financial advisors / wealth management
- Home services (landscaping, pest control, cleaning, roofing)
- Restaurants / food service businesses
- Auto dealerships / repair shops
- Freight brokers / logistics companies
- Staffing agencies
- Managed Service Providers (IT services)
- Commercial cleaning companies
- Private K-12 schools / daycare centers / tutoring
- Churches and religious organizations
- Nonprofit organizations
- Construction subcontractors
- Agricultural businesses / farms

## Output Format

Please rank your top 3-5 verticals with a detailed analysis of each, then give
me a clear recommendation for #1 with your reasoning. For the #1 pick, include a
rough outline of what the demo would look like — which specific sources we'd
scrape, what data we'd show, and why it would be impressive.
