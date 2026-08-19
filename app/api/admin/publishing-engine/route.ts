import { NextRequest, NextResponse } from "next/server";
import { requestHasAdminSession } from "@/lib/admin-auth";
import { normalizeOpenAlexSource, type Journal } from "@/lib/journals";

export const runtime = "nodejs";

type Work = {
  primary_location?: { source?: Parameters<typeof normalizeOpenAlexSource>[0] | null } | null;
};

async function findCandidateJournals(searchText: string): Promise<Journal[]> {
  const url = new URL("https://api.openalex.org/works");
  url.searchParams.set("search", searchText.slice(0, 650));
  url.searchParams.set("filter", "type:article");
  url.searchParams.set("per-page", "35");

  const response = await fetch(url, {
    headers: { "User-Agent": "MabrigPublishAI/0.2 (publisher technical services engine)" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) return [];

  const data = await response.json();
  const counts = new Map<string, { count: number; source: Parameters<typeof normalizeOpenAlexSource>[0] }>();
  for (const work of (data.results ?? []) as Work[]) {
    const source = work.primary_location?.source;
    if (!source?.id || !source.display_name || source.type !== "journal") continue;
    const current = counts.get(source.id);
    counts.set(source.id, { count: (current?.count ?? 0) + 1, source });
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((entry) => normalizeOpenAlexSource(entry.source));
}

function fallbackReport(input: {
  title: string;
  field: string;
  articleType: string;
  abstract: string;
  targetJournal: string;
  services: string[];
}) {
  const abstractWords = input.abstract.trim().split(/\s+/).filter(Boolean).length;
  const serviceText = input.services.length ? input.services.join(", ") : "General publishing readiness audit";
  return `PUBLISHING TECHNICAL ASSESSMENT\n\nManuscript: ${input.title}\nField: ${input.field || "Not specified"}\nArticle type: ${input.articleType || "Not specified"}\nTarget journal: ${input.targetJournal || "Not yet selected"}\n\n1. EXECUTIVE ASSESSMENT\nThe manuscript has an abstract of approximately ${abstractWords} words. Begin with a full technical audit of structure, journal fit, references, declarations, tables/figures, and author-guideline compliance before submission.\n\n2. PREMIUM SERVICES SELECTED\n${serviceText}\n\n3. PRIORITY TECHNICAL CHECKS\n- Confirm the title accurately reflects the study design, population/context, and main contribution.\n- Ensure the abstract follows the target discipline's expected structure and reports actual methods/results without unsupported claims.\n- Check that every in-text citation has a corresponding reference and vice versa.\n- Verify ethics, consent, funding, conflict-of-interest, data-availability, and author-contribution statements where applicable.\n- Confirm tables, figures, headings, word count, reference style, and supplementary files against the official author guidelines.\n\n4. JOURNAL STRATEGY\nUse registry-derived journal candidates as discovery evidence only. Confirm scope, indexing, APCs, waiver rules, editorial policies, and current submission requirements on the official journal website before recommending payment or submission.\n\n5. CLIENT ACTION PLAN\nComplete the technical audit, return a marked correction list to the client, implement approved formatting/editorial changes, prepare the final submission package, and retain a checklist showing what was verified.\n\nAI-specific drafting is unavailable until OPENAI_API_KEY is configured; registry matching and this deterministic technical workflow remain usable.`;
}

async function generateReport(input: {
  clientName: string;
  title: string;
  field: string;
  articleType: string;
  abstract: string;
  manuscriptText: string;
  targetJournal: string;
  services: string[];
  candidates: Journal[];
}) {
  if (!process.env.OPENAI_API_KEY) return null;
  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";

  const prompt = `You are the private technical publishing engine for a professional academic publishing-support business. Your job is to help the publisher deliver premium, ethical technical services to authors. Do not fabricate research findings, citations, peer review, indexing, impact factors, APCs, acceptance rates, or journal policies. Do not promise publication or acceptance. Distinguish editorial/technical assistance from authorship. If a journal fact is not supplied, require verification on the official journal website.\n\nCLIENT\nName: ${input.clientName || "Not supplied"}\n\nMANUSCRIPT\nTitle: ${input.title}\nField: ${input.field}\nArticle type: ${input.articleType}\nTarget journal: ${input.targetJournal || "Not yet selected"}\nAbstract: ${input.abstract}\nManuscript excerpt/text: ${input.manuscriptText.slice(0, 9000)}\n\nPREMIUM SERVICES REQUESTED\n${input.services.join("; ") || "General technical publishing audit"}\n\nREGISTRY-DERIVED JOURNAL CANDIDATES\n${JSON.stringify(input.candidates, null, 2)}\n\nProduce a practical publisher-facing report with these headings:\n1. Executive Technical Assessment\n2. Major Problems to Fix Before Submission\n3. Manuscript Structure & Language Actions\n4. References, Ethics & Compliance Checks\n5. Journal Matching & Risk Strategy\n6. Premium Service Deliverables\n7. Submission Package Checklist\n8. Client-Facing Action Plan\n9. Facts That Must Be Manually Verified\n\nBe specific and commercially useful to the publisher. Prioritize work in Critical / Important / Polish levels where appropriate.`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, input: prompt }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (typeof data.output_text === "string") return data.output_text;

  const texts: string[] = [];
  for (const item of data.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") texts.push(content.text);
    }
  }
  return texts.join("\n").trim() || null;
}

export async function POST(request: NextRequest) {
  if (!requestHasAdminSession(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const clientName = String(body.clientName ?? "").trim();
    const title = String(body.title ?? "").trim();
    const field = String(body.field ?? "").trim();
    const articleType = String(body.articleType ?? "").trim();
    const abstract = String(body.abstract ?? "").trim();
    const manuscriptText = String(body.manuscriptText ?? "").trim();
    const targetJournal = String(body.targetJournal ?? "").trim();
    const services = Array.isArray(body.services) ? body.services.map(String).slice(0, 20) : [];

    if (!title || abstract.length < 80) {
      return NextResponse.json({ error: "Provide a manuscript title and an abstract of at least 80 characters." }, { status: 400 });
    }

    const searchText = [title, field, abstract.slice(0, 350)].filter(Boolean).join(" ");
    const candidates = await findCandidateJournals(searchText);
    const aiReport = await generateReport({ clientName, title, field, articleType, abstract, manuscriptText, targetJournal, services, candidates });
    const report = aiReport || fallbackReport({ title, field, articleType, abstract, targetJournal, services });

    return NextResponse.json({
      report,
      aiEnabled: Boolean(aiReport),
      candidates,
      generatedAt: new Date().toISOString(),
      readiness: {
        abstractCharacters: abstract.length,
        manuscriptCharacters: manuscriptText.length,
        selectedServices: services.length,
        targetJournalSpecified: Boolean(targetJournal),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Publishing engine failed." },
      { status: 500 },
    );
  }
}
