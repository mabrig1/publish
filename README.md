# Mabrig PublishAI

Mabrig PublishAI is an academic journal discovery, verification and submission-assistance application. It helps researchers find journals, check independent scholarly-registry evidence before submitting or paying, identify open-access and APC signals, and generate an evidence-grounded publication strategy from a manuscript title and abstract.

## Core capabilities

- **Global journal finder** — live journal discovery from OpenAlex with access, fee-data and citation-signal filters.
- **100-candidate evidence-aware directory** — `/free-journals` converts a curated cross-disciplinary list into a safer research tool with zero-fee, APC, conditional, repository/preprint, archived and recheck-required labels.
- **Live checks from curated cards** — every curated entry can call Journal Guard so users can compare the static candidate note with current registry evidence.
- **Journal Guard** — checks OpenAlex scholarly-source records, Crossref DOI/ISSN metadata and DOAJ inclusion indicators returned by OpenAlex.
- **Predatory-risk support** — reports evidence strength and caution flags rather than making unsupported blacklist-style accusations.
- **Open-access discovery** — identifies OA/DOAJ signals and separates known APC data from unknown fee data.
- **Impact transparency** — uses OpenAlex h-index and 2-year mean citedness as transparent impact signals. It does **not** present those as Clarivate Journal Impact Factor (JIF).
- **Evidence-based journal matching** — searches related OpenAlex works and recommends journals that are actually publishing similar scholarship.
- **AI publishing coach** — optional OpenAI Responses API integration for manuscript-readiness advice, journal-fit reasoning and submission checklists.
- **Responsive interface** — designed for desktop and mobile academic users.

## Why the curated directory uses evidence labels

A historic list of “free journals” becomes unsafe when fee policies change. The curated directory therefore treats the 100 submitted names as **candidates, not permanent fee guarantees**.

Examples already corrected in the interface include:

- JMLR and JOSS: current official author information documents zero publication fees.
- ACS Central Science: current ACS guidance describes it as diamond open access with no article publishing charges.
- JAMA Network Open: research articles currently require an APC, with waivers/discounts available for eligible authors.
- Chemical Science: RSC states that APCs apply to submissions made on or after 1 July 2026, subject to agreements/waivers.
- OSF Preprints: the generalist server stopped accepting new submissions in 2025 while community-run OSF preprint servers remain active.
- PeerJ Preprints: treated as an archived legacy preprint service rather than a current journal.

All other curated candidates whose current fee policy has not been independently established inside the app are labelled **Recheck current policy** rather than “free.”

## Data sources

The application relies on independent scholarly metadata rather than a hard-coded claim that any fixed list contains “all valid journals.” Registry coverage changes over time.

- OpenAlex: journal discovery, scholarly-source metadata, OA/DOAJ flags and citation indicators.
- Crossref: journal DOI/ISSN registration metadata.
- DOAJ indicator: surfaced through the OpenAlex source record where available.

A positive registry result is evidence of scholarly presence, not a guarantee of journal quality. A missing result is a reason to investigate, not automatic proof that a journal is predatory.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## AI configuration

Journal search, verification and registry-based matching work without an AI key. To enable the tailored AI publishing coach, copy `.env.example` to `.env.local` and set:

```bash
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-5.6-luna
```

Never expose `OPENAI_API_KEY` through a `NEXT_PUBLIC_` variable.

## Production deployment

The app is compatible with Vercel's Next.js deployment workflow. Add the optional AI environment variables in the deployment environment, then build with:

```bash
npm run build
```

## Responsible-use rules built into the app

1. Never invent journal impact factors, indexing claims, APCs, acceptance rates or turnaround times.
2. Keep “unknown” data visibly unknown instead of converting missing information into “free,” “indexed,” or “safe.”
3. Confirm aims/scope, editorial board, peer-review process, author instructions, publication fees and official indexing claims on the journal/publisher website before submission.
4. Use AI for ethical editorial support, matching and planning—not for fabricated research, fake citations or deceptive authorship.

## Suggested next production upgrades

- Authentication and researcher profiles.
- Saved journal shortlists and manuscript workspaces.
- Submission-deadline and revision tracking.
- Institution/admin dashboard.
- Scopus/Web of Science verification through licensed or institution-provided data sources where legally available.
- Journal website policy checks and structured Think. Check. Submit.-style questionnaires.
- Cover-letter builder, reviewer-response assistant and manuscript-format checklist.
- Subscription/payment tier for advanced AI and saved projects.
