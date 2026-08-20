# Mabrig PublishAI

Mabrig PublishAI is an Africa-first AI-assisted academic publishing support platform built around two distinct layers:

1. **Public website** — explains the business, premium technical services, Google Scholar/discoverability support, journal-intelligence tools, responsible-use model, journal directory and publishing workflow.
2. **Private publisher admin** — a protected operational engine that turns each client request into a personalized publishing roadmap covering manuscript readiness, journal strategy, submission preparation and post-publication visibility.

## Public website

The homepage is the complete client-facing information hub. It explains manuscript technical auditing, language polishing, journal matching and verification, predatory-journal risk screening, Google Scholar visibility strategy, DOI/ORCID metadata optimization, repository planning, citation/reference auditing, journal formatting, cover-letter support, reviewer-response support, post-publication monitoring and responsible AI.

The `/free-journals` directory contains 100 cross-disciplinary candidates with evidence-aware labels rather than permanent claims that every title is always free to publish.

## Private publisher operating system

The `/admin` area is the publisher's production workspace. Client jobs capture author identity, affiliation, ORCID, manuscript metadata, publication goal/stage, journal, DOI and published URLs, then generate technical roadmaps and premium-service deliverables.

### Advanced publisher tools

- **AI Publishing Engine** — client-specific manuscript, journal, compliance and visibility strategy using the configured AI fallback chain.
- **Live Google Scholar Compatibility Auditor** — fetches a real published article page and checks Scholar-oriented metadata, canonical URL, visible abstract, PDF/full-text link, robots access and crawlability; connected audits are stored with local client job history.
- **Citation & DOI Integrity Auditor** — verifies detected reference DOIs against Crossref and OpenAlex, identifies duplicate/failed DOI records and surfaces OpenAlex retraction flags for authoritative follow-up.
- **Submission Readiness Command Center** — weighted final gate across manuscript quality, ethics/declarations, references, journal evidence, files/formatting and research-visibility metadata; returns `GO`, `CONDITIONAL GO` or `HOLD` plus an optional AI risk memo.
- **Journal Target Decision Matrix** — compares 2–6 named journal candidates using OpenAlex source evidence, Crossref ISSN evidence, OA/DOAJ/APC signals, transparent citation indicators and a related-work topic sample before creating a conservative submission sequence.
- **Research Visibility Pack Generator** — produces a premium post-publication deliverable covering discoverability keywords, plain-language summary, repository metadata, ORCID update checklist, Scholar monitoring, ethical promotion copy and a 30-day dissemination plan.
- **AI & Scholarly API Health Center** — tests OpenAI, OpenRouter, Groq, Gemini, OpenAlex and Crossref reachability/credentials without revealing secret keys.
- **Journal Intelligence Directory** — live discovery and evidence-aware free/open-access journal research.

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

The dashboard explicitly separates what the publisher can control from what Google controls so the service never sells false guarantees or fixed indexing dates.

## Journal intelligence principles

- OpenAlex is used for journal discovery, source metadata and transparent citation signals.
- Crossref is used for DOI/ISSN registration evidence.
- DOAJ indicators are treated as open-access evidence where surfaced by the scholarly data layer.
- Missing registry data is a caution signal, not automatic proof that a journal is predatory.
- OpenAlex h-index and 2-year mean citedness are never presented as proprietary Clarivate Journal Impact Factor values.
- APC/fee values remain unknown unless current evidence is available; final fee and waiver checks must use official journal/publisher sources.

## Admin security configuration

Set a strong server-side secret:

```bash
ADMIN_ACCESS_KEY=your-long-random-secret
```

The admin key is validated server-side and stored in an HttpOnly session cookie after successful login. Do not place it in a `NEXT_PUBLIC_` variable.

## Scholarly API configuration

```bash
OPENALEX_API_KEY=
CROSSREF_MAILTO=publisher-contact@example.com
```

OpenAlex can work without the optional key, but production credentials/contact identification are recommended when available.

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

`OpenAI -> OpenRouter -> Groq -> Gemini -> deterministic technical workflow`

All keys must remain server-side; never expose them through `NEXT_PUBLIC_` variables.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the publisher engine.

## Responsible-use rules

1. Never invent journal impact factors, indexing claims, APCs, acceptance rates or turnaround times.
2. Keep unknown data visibly unknown instead of converting missing information into “free,” “indexed,” or “safe.”
3. Confirm aims/scope, editorial board, peer-review process, author instructions, publication fees and official indexing claims on current authoritative sources before submission.
4. Use AI for ethical editorial, technical, matching and planning assistance—not for fabricated research, fake citations, invented findings or deceptive authorship.
5. Never promise acceptance, publication, Google Scholar inclusion, ranking, citation counts or a fixed indexing date.
6. Treat retraction/database signals as prompts for authoritative manual verification rather than as final legal/editorial determinations.
7. Respect publisher copyright/self-archiving policies before distributing accepted manuscripts or publisher PDFs.

## Highest-value next production upgrades

- persistent database-backed client/job/audit records instead of browser-local storage
- secure manuscript DOCX/PDF upload and file workspace
- automatic DOCX formatting/compliance output for target journals
- journal-author-guideline live parser and change monitor
- Crossref DOI metadata alignment audit against the published article page
- ORCID public-record verification/update workflow where API permissions allow
- repository/self-archiving rights assistant using authoritative policy sources
- client quotations, invoices, payments and service-package pricing
- researcher/client portal with job status, deliverables and revision history
- licensed Scopus/Web of Science verification where legally available
- email/WhatsApp notifications for client-job progress
