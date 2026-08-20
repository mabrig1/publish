# Mabrig PublishAI

Mabrig PublishAI is an Africa-first AI-assisted academic publishing support platform built around two distinct layers:

1. **Public website** — explains the business, premium technical services, Google Scholar/discoverability support, journal-intelligence tools, responsible-use model, journal directory and publishing workflow.
2. **Private publisher admin** — a protected operational engine that turns each client request into a personalized publishing roadmap covering manuscript readiness, journal strategy, submission preparation and post-publication visibility.

## Public website

The homepage is the complete client-facing information hub. It explains:

- manuscript technical auditing
- academic language polishing
- journal matching and journal verification
- predatory-journal risk screening
- Google Scholar visibility and indexing-readiness strategy
- DOI, ORCID and scholarly metadata optimization
- repository/self-archiving discoverability planning
- references and citation consistency checks
- target-journal formatting preparation
- cover-letter and submission-package support
- reviewer-response technical support
- post-publication monitoring and troubleshooting
- responsible AI and scholarly-integrity limits

The `/free-journals` directory contains 100 cross-disciplinary candidates with evidence-aware labels rather than permanent claims that every title is always free to publish.

## Publisher admin engine

The `/admin` area is designed as the publisher's private production workspace. A client job starts with the author's identity and goal rather than only a manuscript title. The engine captures:

- client/author name and job reference
- institutional affiliation and ORCID
- manuscript title, discipline, article type and abstract
- publication goal and publication stage
- target journal where known
- publication date, DOI, canonical article URL and full-text/repository URL where available
- manuscript text/key sections for technical analysis
- selectable premium publishing services

The engine then produces:

- AI-assisted manuscript and submission-readiness assessment
- registry-derived journal candidates based on related scholarship
- journal reputation/APC/open-access verification actions
- personalized Google Scholar/discoverability readiness score
- an eight-phase Scholar visibility roadmap
- metadata, DOI, ORCID and repository strategy
- publisher-facing premium service deliverables
- post-publication monitoring/troubleshooting searches
- copyable/downloadable technical report
- client-job status tracking through submission and visibility monitoring

## Google Scholar & research visibility engine

PublishAI treats Google Scholar work as **technical eligibility and discoverability optimization, not guaranteed indexing**. Google controls inclusion, timing and ranking through automated crawling and parsing.

For each client, the dashboard maps eight phases:

1. Author identity and citation identity
2. Publication venue and Google Scholar evidence
3. Canonical article metadata
4. Scholar-compatible article landing page
5. Searchable full text/PDF
6. Crawlability and technical indexing
7. Legitimate repository/discovery routes
8. Scholar monitoring and troubleshooting

The strategy follows the core technical patterns Google documents for scholarly publishers: one stable URL per article, a complete visible abstract or full text, machine-readable bibliographic metadata, crawlable HTML navigation, searchable PDFs, crawler access and stable server behavior.

The dashboard explicitly separates what the publisher can control from what Google controls so the service never sells false guarantees or fixed indexing dates.

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

The admin key is validated server-side and stored in an HttpOnly session cookie after successful login. Do not place it in a `NEXT_PUBLIC_` variable.

## Scholarly API configuration

```bash
OPENALEX_API_KEY=your_key_if_available
```

The app can query OpenAlex without the optional key, but the key is recommended when available for production scholarly discovery.

## AI configuration

The private publishing engine uses a provider fallback chain:

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-terra

OPENROUTER_API_KEY=
OPENROUTER_MODEL=openrouter/free

GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-120b

GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.7-flash
```

Provider order:

`OpenAI -> OpenRouter -> Groq -> Gemini -> deterministic technical report`

All keys must remain server-side; never expose them through `NEXT_PUBLIC_` variables.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the publisher engine.

## Production deployment

The app is compatible with Vercel's Next.js deployment workflow. Configure the server-side environment variables, then build with:

```bash
npm run build
```

## Responsible-use rules

1. Never invent journal impact factors, indexing claims, APCs, acceptance rates or turnaround times.
2. Keep unknown data visibly unknown instead of converting missing information into “free,” “indexed,” or “safe.”
3. Confirm aims/scope, editorial board, peer-review process, author instructions, publication fees and official indexing claims on the journal/publisher website before submission.
4. Use AI for ethical editorial, technical, matching and planning assistance—not for fabricated research, fake citations, invented findings or deceptive authorship.
5. Never promise acceptance or publication.
6. Never guarantee Google Scholar inclusion, ranking or a fixed indexing date.
7. Respect publisher copyright/self-archiving policies before distributing accepted manuscripts or publisher PDFs through repositories.

## Strong next production upgrades

- persistent database-backed client/job records instead of browser-local job storage
- secure manuscript DOCX/PDF upload and file workspace
- automatic document-format diagnostics and DOCX output
- live article-URL crawler/metadata audit for Scholar compatibility
- automatic Highwire citation-meta-tag generator for publisher-hosted article pages
- Crossref DOI metadata alignment checker
- ORCID profile/identity verification where API terms permit
- repository policy and self-archiving rights assistant
- publisher service pricing, invoices and payments
- researcher/client portal with delivery status
- saved journal shortlists and submission tracking
- licensed Scopus/Web of Science verification where legally available
- email/WhatsApp notifications for client-job progress
