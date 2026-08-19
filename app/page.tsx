"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Journal = {
  id: string;
  name: string;
  issn: string[];
  issnL?: string | null;
  publisher?: string | null;
  homepage?: string | null;
  country?: string | null;
  isOpenAccess: boolean;
  isInDoaj: boolean;
  apcUsd?: number | null;
  worksCount?: number | null;
  citedByCount?: number | null;
  hIndex?: number | null;
  twoYearMeanCitedness?: number | null;
  feeStatus: "no-apc-listed" | "apc-listed" | "unknown";
  impactSignal: "high" | "moderate" | "emerging";
};

type VerifyResult = {
  score: number;
  status: "verified-evidence" | "established-evidence" | "caution";
  evidence: string[];
  cautions: string[];
  journal: Journal | null;
  crossref: { title?: string; publisher?: string; issn?: string[] } | null;
  checkedAt: string;
};

type AssistantResult = {
  candidates: Journal[];
  aiAdvice: string | null;
  aiEnabled: boolean;
  readiness: { abstractLength: number; hasKeywords: boolean; hasField: boolean };
  fallbackAdvice: string[];
};

type Tab = "discover" | "verify" | "assistant";

const compact = (value?: number | null) =>
  value ? new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value) : "—";

function JournalCard({ journal, rank }: { journal: Journal; rank?: number }) {
  return (
    <article className="journal-card">
      <div className="journal-topline">
        <div className="rank-title">
          {rank ? <span className="rank">#{rank}</span> : null}
          <div>
            <h3>{journal.name}</h3>
            <p>{journal.publisher || "Publisher not supplied by registry"}</p>
          </div>
        </div>
        <span className={`impact-pill impact-${journal.impactSignal}`}>{journal.impactSignal} impact signal</span>
      </div>

      <div className="tags">
        {journal.isInDoaj && <span className="tag success">DOAJ indexed</span>}
        {journal.isOpenAccess && <span className="tag sky">Open access</span>}
        {journal.feeStatus === "no-apc-listed" && <span className="tag success">No APC listed</span>}
        {journal.feeStatus === "apc-listed" && <span className="tag amber">APC data listed</span>}
        {journal.feeStatus === "unknown" && <span className="tag neutral">Fee unknown</span>}
        {journal.country && <span className="tag neutral">{journal.country}</span>}
      </div>

      <div className="metrics">
        <div><span>H-index</span><strong>{journal.hIndex ?? "—"}</strong></div>
        <div><span>2yr citedness</span><strong>{journal.twoYearMeanCitedness?.toFixed(2) ?? "—"}</strong></div>
        <div><span>Works</span><strong>{compact(journal.worksCount)}</strong></div>
        <div><span>Citations</span><strong>{compact(journal.citedByCount)}</strong></div>
      </div>

      <div className="journal-footer">
        <span className="issn">ISSN {journal.issn.length ? journal.issn.join(" · ") : "not returned"}</span>
        {journal.homepage ? (
          <a href={journal.homepage} target="_blank" rel="noreferrer" className="text-link">Official site ↗</a>
        ) : null}
      </div>
    </article>
  );
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("discover");
  const [query, setQuery] = useState("");
  const [access, setAccess] = useState("all");
  const [fee, setFee] = useState("all");
  const [impact, setImpact] = useState("all");
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loadingJournals, setLoadingJournals] = useState(false);
  const [journalError, setJournalError] = useState("");

  const [verifyTitle, setVerifyTitle] = useState("");
  const [verifyIssn, setVerifyIssn] = useState("");
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  const [manuscript, setManuscript] = useState({ title: "", field: "", keywords: "", abstract: "" });
  const [assistantResult, setAssistantResult] = useState<AssistantResult | null>(null);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState("");

  const searchJournals = async (event?: FormEvent) => {
    event?.preventDefault();
    setLoadingJournals(true);
    setJournalError("");
    try {
      const params = new URLSearchParams({ q: query, access, fee, impact });
      const response = await fetch(`/api/journals?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Journal search failed.");
      setJournals(data.journals ?? []);
    } catch (error) {
      setJournalError(error instanceof Error ? error.message : "Journal search failed.");
    } finally {
      setLoadingJournals(false);
    }
  };

  useEffect(() => {
    searchJournals();
    // Initial discovery only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyJournal = async (event: FormEvent) => {
    event.preventDefault();
    setVerifyLoading(true);
    setVerifyError("");
    setVerifyResult(null);
    try {
      const params = new URLSearchParams({ title: verifyTitle, issn: verifyIssn });
      const response = await fetch(`/api/verify?${params}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Verification failed.");
      setVerifyResult(data);
    } catch (error) {
      setVerifyError(error instanceof Error ? error.message : "Verification failed.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const runAssistant = async (event: FormEvent) => {
    event.preventDefault();
    setAssistantLoading(true);
    setAssistantError("");
    setAssistantResult(null);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manuscript),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Publishing assistant failed.");
      setAssistantResult(data);
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : "Publishing assistant failed.");
    } finally {
      setAssistantLoading(false);
    }
  };

  const verificationLabel = useMemo(() => {
    if (!verifyResult) return "";
    if (verifyResult.status === "verified-evidence") return "Strong verification evidence";
    if (verifyResult.status === "established-evidence") return "Some established evidence";
    return "Caution — more verification needed";
  }, [verifyResult]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Mabrig PublishAI home">
          <span className="brand-mark">M</span>
          <span>Mabrig <b>PublishAI</b></span>
        </a>
        <nav className="top-actions">
          <button onClick={() => setTab("discover")}>Journal Finder</button>
          <button onClick={() => setTab("verify")}>Verify Journal</button>
          <button className="primary-small" onClick={() => setTab("assistant")}>AI Publishing Coach</button>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="eyebrow">ACADEMIC PUBLISHING INTELLIGENCE</div>
          <h1>Publish in the right journal.<br /><span>Avoid the wrong one.</span></h1>
          <p className="hero-copy">
            Discover reputable journals, check open-access and fee signals, screen suspicious journal claims,
            and use AI to match your manuscript with journals already publishing related scholarship.
          </p>
          <div className="hero-buttons">
            <button className="primary" onClick={() => setTab("assistant")}>Match my manuscript →</button>
            <button className="secondary" onClick={() => setTab("verify")}>Check a journal first</button>
          </div>
          <div className="trust-row">
            <span>Registry signals from</span>
            <strong>OpenAlex</strong><i>•</i><strong>Crossref</strong><i>•</i><strong>DOAJ indicator</strong>
          </div>
        </section>

        <section className="feature-strip">
          <div><span className="feature-icon">◎</span><strong>Global discovery</strong><small>Search scholarly journals across disciplines</small></div>
          <div><span className="feature-icon">✓</span><strong>Legitimacy evidence</strong><small>ISSN, DOI registry and OA signals</small></div>
          <div><span className="feature-icon">◇</span><strong>Fee clarity</strong><small>Separate listed APCs from unknown fee data</small></div>
          <div><span className="feature-icon">✦</span><strong>AI submission coach</strong><small>Fit, readiness and submission guidance</small></div>
        </section>

        <section className="workspace">
          <div className="tabs" role="tablist" aria-label="Publishing tools">
            <button className={tab === "discover" ? "active" : ""} onClick={() => setTab("discover")}>1. Find Journals</button>
            <button className={tab === "verify" ? "active" : ""} onClick={() => setTab("verify")}>2. Verify a Journal</button>
            <button className={tab === "assistant" ? "active" : ""} onClick={() => setTab("assistant")}>3. AI Publishing Assistant</button>
          </div>

          {tab === "discover" && (
            <div className="panel">
              <div className="section-heading">
                <div><span className="kicker">JOURNAL FINDER</span><h2>Search reputable journal records</h2></div>
                <p>Filter by access model, known APC data and transparent citation-based impact signals.</p>
              </div>

              <form className="search-box" onSubmit={searchJournals}>
                <label className="search-input-wrap">
                  <span>Topic, journal or discipline</span>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. public health, political science, renewable energy" />
                </label>
                <div className="filter-grid">
                  <label><span>Access</span><select value={access} onChange={(e) => setAccess(e.target.value)}><option value="all">All journals</option><option value="oa">Open access</option><option value="subscription">Subscription / other</option></select></label>
                  <label><span>Fees</span><select value={fee} onChange={(e) => setFee(e.target.value)}><option value="all">Any fee status</option><option value="free">No APC listed</option><option value="paid">APC listed</option></select></label>
                  <label><span>Impact</span><select value={impact} onChange={(e) => setImpact(e.target.value)}><option value="all">All impact signals</option><option value="high">High signal</option></select></label>
                  <button className="primary search-button" disabled={loadingJournals}>{loadingJournals ? "Searching…" : "Search journals"}</button>
                </div>
              </form>

              <div className="notice blue-notice"><strong>Impact transparency:</strong> “High impact signal” uses OpenAlex h-index and 2-year mean citedness. It is not the proprietary Clarivate Journal Impact Factor (JIF).</div>
              {journalError && <div className="error-box">{journalError}</div>}
              <div className="result-header"><strong>{journals.length} journal results</strong><span>Live registry data</span></div>
              <div className="journal-grid">
                {journals.map((journal) => <JournalCard key={journal.id} journal={journal} />)}
              </div>
              {!loadingJournals && !journals.length && !journalError && <div className="empty-state">No journals matched these filters. Broaden the topic or fee/access criteria.</div>}
            </div>
          )}

          {tab === "verify" && (
            <div className="panel two-column-panel">
              <div>
                <span className="kicker">JOURNAL GUARD</span>
                <h2>Screen a journal before you submit or pay</h2>
                <p className="muted">Use the journal title, ISSN, or both. The app checks independent scholarly registry evidence and highlights what still needs manual verification.</p>
                <form className="verify-form" onSubmit={verifyJournal}>
                  <label><span>Journal title</span><input value={verifyTitle} onChange={(e) => setVerifyTitle(e.target.value)} placeholder="Exact journal name" /></label>
                  <div className="or-divider"><span>and / or</span></div>
                  <label><span>ISSN</span><input value={verifyIssn} onChange={(e) => setVerifyIssn(e.target.value)} placeholder="1234-5678" /></label>
                  <button className="primary full" disabled={verifyLoading}>{verifyLoading ? "Checking registries…" : "Verify journal evidence"}</button>
                </form>
                {verifyError && <div className="error-box">{verifyError}</div>}
              </div>

              <div className="verification-output">
                {!verifyResult ? (
                  <div className="guard-placeholder">
                    <span className="shield">✓</span>
                    <h3>Evidence, not guesswork</h3>
                    <p>A missing record is a reason to investigate—not automatic proof of predatory behavior.</p>
                    <ul><li>OpenAlex scholarly-source record</li><li>Crossref DOI/ISSN metadata</li><li>DOAJ inclusion indicator for OA journals</li><li>Fee and impact-data transparency</li></ul>
                  </div>
                ) : (
                  <div className="verification-card">
                    <div className="score-row"><div className={`score score-${verifyResult.status}`}>{verifyResult.score}</div><div><span className="kicker">EVIDENCE SCORE / 100</span><h3>{verificationLabel}</h3></div></div>
                    {verifyResult.journal && <div className="verified-name"><strong>{verifyResult.journal.name}</strong><span>{verifyResult.journal.publisher || "Publisher not returned"}</span></div>}
                    <div className="score-track"><span style={{ width: `${verifyResult.score}%` }} /></div>
                    <h4>Positive evidence</h4>
                    <ul className="check-list">{verifyResult.evidence.map((item) => <li key={item}>{item}</li>)}</ul>
                    <h4>Checks still required</h4>
                    <ul className="warning-list">{verifyResult.cautions.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "assistant" && (
            <div className="panel">
              <div className="section-heading assistant-heading">
                <div><span className="kicker">AI PUBLISHING ASSISTANT</span><h2>Turn your manuscript into a submission strategy</h2></div>
                <p>The matcher finds journals publishing related papers first, then AI helps evaluate fit and readiness.</p>
              </div>

              <form className="assistant-form" onSubmit={runAssistant}>
                <div className="form-grid">
                  <label className="wide"><span>Manuscript title *</span><input value={manuscript.title} onChange={(e) => setManuscript({ ...manuscript, title: e.target.value })} placeholder="Enter the full working title" required /></label>
                  <label><span>Field / discipline</span><input value={manuscript.field} onChange={(e) => setManuscript({ ...manuscript, field: e.target.value })} placeholder="e.g. Economics" /></label>
                  <label><span>Keywords</span><input value={manuscript.keywords} onChange={(e) => setManuscript({ ...manuscript, keywords: e.target.value })} placeholder="3–8 comma-separated keywords" /></label>
                  <label className="wide"><span>Abstract *</span><textarea value={manuscript.abstract} onChange={(e) => setManuscript({ ...manuscript, abstract: e.target.value })} rows={8} placeholder="Paste your abstract. Include problem, method, major findings and conclusion where applicable." required /></label>
                </div>
                <div className="assistant-submit-row">
                  <div><strong>What you receive</strong><span>Journal candidates · fit reasoning · readiness checks · submission checklist</span></div>
                  <button className="primary" disabled={assistantLoading}>{assistantLoading ? "Analysing manuscript…" : "Build publication strategy ✦"}</button>
                </div>
              </form>

              {assistantError && <div className="error-box">{assistantError}</div>}

              {assistantResult && (
                <div className="assistant-results">
                  <div className="readiness-row">
                    <div className={assistantResult.readiness.abstractLength >= 150 ? "ready" : "review"}><strong>{assistantResult.readiness.abstractLength}</strong><span>abstract characters</span></div>
                    <div className={assistantResult.readiness.hasKeywords ? "ready" : "review"}><strong>{assistantResult.readiness.hasKeywords ? "Ready" : "Add more"}</strong><span>keywords</span></div>
                    <div className={assistantResult.readiness.hasField ? "ready" : "review"}><strong>{assistantResult.readiness.hasField ? "Set" : "Missing"}</strong><span>discipline</span></div>
                  </div>

                  <div className="assistant-layout">
                    <div>
                      <div className="result-header"><strong>Evidence-based candidate journals</strong><span>From related OpenAlex papers</span></div>
                      <div className="journal-grid compact-grid">
                        {assistantResult.candidates.map((journal, index) => <JournalCard key={journal.id} journal={journal} rank={index + 1} />)}
                      </div>
                    </div>
                    <aside className="coach-card">
                      <span className="kicker">PUBLISHING COACH</span>
                      <h3>{assistantResult.aiEnabled ? "AI strategy" : "Core submission strategy"}</h3>
                      {assistantResult.aiAdvice ? <div className="ai-copy">{assistantResult.aiAdvice}</div> : (
                        <>
                          <p className="muted">Add <code>OPENAI_API_KEY</code> on the server to enable tailored AI analysis. Registry-based matching works without it.</p>
                          <ol>{assistantResult.fallbackAdvice.map((item) => <li key={item}>{item}</li>)}</ol>
                        </>
                      )}
                    </aside>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="ethics-section">
          <div><span className="kicker">BUILT FOR RESPONSIBLE SCHOLARSHIP</span><h2>AI assists the researcher. It does not replace scholarly judgment.</h2></div>
          <div className="ethics-grid"><p><strong>No invented metrics</strong><br />Unknown fees, indexing and impact values stay unknown until verified.</p><p><strong>No automatic “predatory” verdicts</strong><br />The system reports evidence strength and investigation flags.</p><p><strong>Official-site confirmation</strong><br />Authors are prompted to verify scope, fees, policies and instructions before submission.</p></div>
        </section>
      </main>

      <footer><strong>Mabrig PublishAI</strong><span>Academic journal discovery, verification & publishing assistance</span><small>Registry data can change. Always confirm final submission requirements on the journal’s official website.</small></footer>
    </div>
  );
}
