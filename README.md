# Mabrig PublishAI

Mabrig PublishAI is an AI-assisted academic publishing support platform built around two distinct layers:

1. **Public website** — explains the business, premium technical services, journal-intelligence tools, responsible-use model, journal directory and publishing workflow.
2. **Private publisher admin** — a protected operational engine that helps the publisher diagnose manuscripts, package premium services, generate technical publishing reports, shortlist journals and track client jobs.

## Public website

The homepage is the complete client-facing information hub. It explains:

- manuscript technical auditing
- academic language polishing
- journal matching and journal verification
- predatory-journal risk screening
- references and citation consistency checks
- target-journal formatting preparation
- cover-letter and submission-package support
- reviewer-response technical support
- the end-to-end client workflow
- responsible AI and scholarly-integrity limits

The `/free-journals` directory contains 100 cross-disciplinary candidates with evidence-aware labels rather than permanent claims that every title is always free to publish.

## Publisher admin engine

The `/admin` area is designed as the publisher's private production workspace. It includes:

- protected publisher login using a server-side `ADMIN_ACCESS_KEY`
- client manuscript intake fields
- selectable premium technical services
- AI-assisted manuscript and submission-readiness reports
- registry-derived journal candidates based on related scholarship
- publisher-facing action plans and manual-verification warnings
- report copy/download controls
- a lightweight local client-job pipeline with status tracking
- links into the journal-intelligence directory

The AI engine is intentionally publisher-facing: it helps identify technical work that can be delivered professionally to the client, while final scholarly and journal-policy decisions remain human-reviewed.

## Journal intelligence

- **Global journal finder** — live journal discovery from OpenAlex with access, fee-data and citation-signal filters.
- **Journal Guard** — checks OpenAlex scholarly-source records, Crossref DOI/ISSN metadata and DOAJ inclusion indicators surfaced by OpenAlex.
- **Predatory-risk support** — reports evidence strength and caution flags rather than making unsupported blacklist-style accusations.
- **Open-access discovery** — distinguishes OA signals, known APC data, no-APC records and unknown fee data.
- **Impact transparency** — uses OpenAlex h-index and 2-year mean citedness as transparent citation signals and does not label them as proprietary Clarivate JIF values.
- **Evidence-based journal matching** — searches related OpenAlex works and identifies journals actually publishing similar scholarship.

## Admin security configuration

Set a strong secret in the server/deployment environment:

```bash
ADMIN_ACCESS_KEY=your-long-random-secret
```

The admin key is validated server-side and is stored in an HttpOnly session cookie after successful login. Do not place it in a `NEXT_PUBLIC_` variable.

## AI configuration

Journal discovery and registry checks work without an AI key. To enable tailored AI publishing-engine analysis:

```bash
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-5.6-luna
```

Never expose `OPENAI_API_KEY` through a `NEXT_PUBLIC_` variable.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the publisher engine.

## Production deployment

The app is compatible with Vercel's Next.js deployment workflow. Configure `ADMIN_ACCESS_KEY` and the optional OpenAI variables in the deployment environment, then build with:

```bash
npm run build
```

## Responsible-use rules

1. Never invent journal impact factors, indexing claims, APCs, acceptance rates or turnaround times.
2. Keep unknown data visibly unknown instead of converting missing information into “free,” “indexed,” or “safe.”
3. Confirm aims/scope, editorial board, peer-review process, author instructions, publication fees and official indexing claims on the journal/publisher website before submission.
4. Use AI for ethical editorial, technical, matching and planning assistance—not for fabricated research, fake citations, invented findings or deceptive authorship.
5. Never promise acceptance or publication.

## Strong next production upgrades

- persistent database-backed client/job records instead of browser-local job storage
- secure manuscript DOCX/PDF upload and file workspace
- automatic document-format diagnostics and DOCX output
- publisher service pricing, invoices and payments
- researcher/client portal with delivery status
- saved journal shortlists and submission tracking
- licensed Scopus/Web of Science verification where legally available
- publisher-controlled templates for cover letters, reviewer responses and formatting packages
- email/WhatsApp notifications for client-job progress
