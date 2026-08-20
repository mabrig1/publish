"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./auditor.module.css";

type AuditStatus = "pass" | "warn" | "fail";

type AuditCheck = {
  id: string;
  label: string;
  status: AuditStatus;
  points: number;
  maxPoints: number;
  evidence: string;
  fix?: string;
};

type AuditResult = {
  clientName: string;
  requestedUrl: string;
  finalUrl: string;
  auditedAt: string;
  httpStatus: number;
  contentType: string;
  score: number;
  grade: "strong" | "good" | "needs-work" | "poor";
  compatibilityLabel: string;
  guaranteeNotice: string;
  detected: {
    title: string | null;
    authors: string[];
    publicationDate: string | null;
    journalTitle: string | null;
    issn: string | null;
    volume: string | null;
    issue: string | null;
    firstPage: string | null;
    lastPage: string | null;
    doi: string | null;
    canonicalUrl: string | null;
    pdfUrl: string | null;
    abstractSource: string | null;
    robotsMeta: string | null;
    robotsTxt: string;
  };
  checks: AuditCheck[];
  priorityFixes: string[];
  suggestedMetaTags: string;
  manualChecks: string[];
};

const initialForm = {
  clientName: "",
  articleUrl: "",
  expectedTitle: "",
  expectedDoi: "",
};

function statusLabel(status: AuditStatus) {
  if (status === "pass") return "PASS";
  if (status === "warn") return "REVIEW";
  return "FIX";
}

export default function AuditorClient() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const reportText = useMemo(() => {
    if (!result) return "";
    const detected = result.detected;
    return [
      "MABRIG PUBLISHAI — LIVE GOOGLE SCHOLAR COMPATIBILITY AUDIT",
      `Client: ${result.clientName}`,
      `Article: ${detected.title || form.expectedTitle || "Title not detected"}`,
      `Audited URL: ${result.finalUrl}`,
      `Audit date: ${new Date(result.auditedAt).toLocaleString()}`,
      `Compatibility score: ${result.score}/100 (${result.grade})`,
      `Assessment: ${result.compatibilityLabel}`,
      "",
      "IMPORTANT LIMIT",
      result.guaranteeNotice,
      "",
      "DETECTED SCHOLARLY METADATA",
      `Title: ${detected.title || "Missing"}`,
      `Authors: ${detected.authors.length ? detected.authors.join("; ") : "Missing"}`,
      `Publication date: ${detected.publicationDate || "Missing"}`,
      `Journal: ${detected.journalTitle || "Missing"}`,
      `ISSN: ${detected.issn || "Missing"}`,
      `DOI: ${detected.doi || "Missing"}`,
      `Canonical URL: ${detected.canonicalUrl || "Missing"}`,
      `PDF URL: ${detected.pdfUrl || "Missing"}`,
      `Robots: ${detected.robotsTxt}`,
      "",
      "TECHNICAL CHECKS",
      ...result.checks.map((check) => `[${statusLabel(check.status)}] ${check.label} — ${check.points}/${check.maxPoints}\n${check.evidence}${check.fix ? `\nFix: ${check.fix}` : ""}`),
      "",
      "PRIORITY FIXES",
      ...(result.priorityFixes.length ? result.priorityFixes.map((item, index) => `${index + 1}. ${item}`) : ["No major automated compatibility fixes were identified."]),
      "",
      "MANUAL VERIFICATION",
      ...result.manualChecks.map((item, index) => `${index + 1}. ${item}`),
      "",
      "SUGGESTED HIGHWIRE / SCHOLAR META TAGS",
      result.suggestedMetaTags || "Insufficient metadata was detected to generate a complete example block.",
    ].join("\n");
  }, [form.expectedTitle, result]);

  async function runAudit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);
    try {
      const response = await fetch("/api/admin/scholar-auditor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Scholar compatibility audit failed.");
      setResult(data);
      try {
        localStorage.setItem("publishai_last_scholar_audit", JSON.stringify(data));
      } catch {
        // Browser storage is optional.
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scholar compatibility audit failed.");
    } finally {
      setLoading(false);
    }
  }

  async function copyReport() {
    if (!reportText) return;
    await navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function downloadReport() {
    if (!reportText) return;
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${result?.clientName || "client"}-google-scholar-compatibility-audit.txt`.replace(/[^a-z0-9._-]+/gi, "-");
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <div className={styles.eyebrow}>LIVE GOOGLE SCHOLAR COMPATIBILITY AUDITOR</div>
          <h1>Inspect the real article page before promising visibility.</h1>
          <p>Paste a client's published article landing-page URL. PublishAI fetches the live page and audits the technical signals Google Scholar depends on for crawling and bibliographic parsing.</p>
        </div>
        <div className={styles.heroBadge}>Publisher-only technical service</div>
      </section>

      <section className={styles.notice}>
        <strong>What this does:</strong> tests technical compatibility and produces fixes. <strong>What it does not do:</strong> force Google Scholar inclusion, verify ranking, or guarantee an indexing date.
      </section>

      <div className={styles.grid}>
        <form className={styles.formCard} onSubmit={runAudit}>
          <div className={styles.sectionTitle}>Client case</div>
          <label>
            <span>Client / author name</span>
            <input value={form.clientName} onChange={(event) => setForm({ ...form, clientName: event.target.value })} placeholder="e.g. Dr. Ada Nwosu" />
          </label>
          <label>
            <span>Public article landing-page URL *</span>
            <input required type="url" value={form.articleUrl} onChange={(event) => setForm({ ...form, articleUrl: event.target.value })} placeholder="https://journal.org/article/123" />
            <small>Use the HTML article/abstract page, not a direct PDF.</small>
          </label>
          <label>
            <span>Expected article title</span>
            <input value={form.expectedTitle} onChange={(event) => setForm({ ...form, expectedTitle: event.target.value })} placeholder="Optional: authoritative published title" />
          </label>
          <label>
            <span>Expected DOI</span>
            <input value={form.expectedDoi} onChange={(event) => setForm({ ...form, expectedDoi: event.target.value })} placeholder="10.xxxx/xxxxx" />
          </label>

          <div className={styles.auditList}>
            <strong>The live audit checks</strong>
            <span>HTTP availability and redirects</span>
            <span>citation_title / author / publication date</span>
            <span>Journal, volume, issue and page metadata</span>
            <span>DOI and canonical URL consistency</span>
            <span>Visible abstract/full-text signal</span>
            <span>citation_pdf_url and PDF response</span>
            <span>robots meta + robots.txt access</span>
            <span>One scholarly article per landing page</span>
          </div>

          <button className={styles.primary} disabled={loading}>{loading ? "Auditing live article page…" : "Run live Scholar compatibility audit"}</button>
          {error && <div className={styles.error}>{error}</div>}
        </form>

        <section className={styles.resultCard}>
          {!result ? (
            <div className={styles.empty}>
              <div className={styles.radar}>◎</div>
              <h2>Live audit results appear here</h2>
              <p>The engine checks the public article page server-side, then maps technical failures into a client-ready repair plan.</p>
            </div>
          ) : (
            <>
              <div className={styles.scoreHead}>
                <div className={`${styles.score} ${styles[`score_${result.grade}`]}`}>{result.score}</div>
                <div>
                  <div className={styles.eyebrow}>COMPATIBILITY / 100</div>
                  <h2>{result.compatibilityLabel}</h2>
                  <p>{result.clientName} · HTTP {result.httpStatus} · {new URL(result.finalUrl).hostname}</p>
                </div>
              </div>
              <div className={styles.progress}><span style={{ width: `${result.score}%` }} /></div>
              <div className={styles.actions}>
                <button onClick={copyReport}>{copied ? "Copied ✓" : "Copy client report"}</button>
                <button onClick={downloadReport}>Download report</button>
              </div>

              <div className={styles.sectionTitle}>Detected publication record</div>
              <div className={styles.metadataGrid}>
                <div><span>Title</span><strong>{result.detected.title || "Missing"}</strong></div>
                <div><span>Authors</span><strong>{result.detected.authors.length ? result.detected.authors.join("; ") : "Missing"}</strong></div>
                <div><span>Date</span><strong>{result.detected.publicationDate || "Missing"}</strong></div>
                <div><span>Journal</span><strong>{result.detected.journalTitle || "Missing"}</strong></div>
                <div><span>DOI</span><strong>{result.detected.doi || "Missing"}</strong></div>
                <div><span>PDF</span><strong>{result.detected.pdfUrl ? "Linked" : "Not detected"}</strong></div>
              </div>

              <div className={styles.sectionTitle}>Live technical checks</div>
              <div className={styles.checks}>
                {result.checks.map((check) => (
                  <article className={`${styles.check} ${styles[`check_${check.status}`]}`} key={check.id}>
                    <div className={styles.checkTop}>
                      <span>{statusLabel(check.status)}</span>
                      <strong>{check.label}</strong>
                      <b>{check.points}/{check.maxPoints}</b>
                    </div>
                    <p>{check.evidence}</p>
                    {check.fix && <div className={styles.fix}><strong>Fix:</strong> {check.fix}</div>}
                  </article>
                ))}
              </div>

              <div className={styles.sectionTitle}>Priority repair map</div>
              {result.priorityFixes.length ? (
                <ol className={styles.priority}>{result.priorityFixes.map((fix) => <li key={fix}>{fix}</li>)}</ol>
              ) : <div className={styles.goodBox}>No major automated compatibility repairs were identified. Complete the manual checks before closing the client job.</div>}

              <div className={styles.sectionTitle}>Suggested Scholar / Highwire metadata</div>
              <pre className={styles.code}>{result.suggestedMetaTags || "Not enough metadata was detected to build a complete tag block."}</pre>

              <div className={styles.sectionTitle}>Manual checks before client delivery</div>
              <ul className={styles.manual}>{result.manualChecks.map((check) => <li key={check}>{check}</li>)}</ul>

              <div className={styles.warning}><strong>Important:</strong> {result.guaranteeNotice}</div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
