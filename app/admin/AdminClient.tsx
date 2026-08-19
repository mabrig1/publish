"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./admin.module.css";

type Candidate = {
  id: string;
  name: string;
  publisher?: string | null;
  isOpenAccess: boolean;
  isInDoaj: boolean;
  feeStatus: "no-apc-listed" | "apc-listed" | "unknown";
};

type EngineResult = {
  report: string;
  aiEnabled: boolean;
  candidates: Candidate[];
  generatedAt: string;
};

type JobStatus = "New" | "In technical review" | "Awaiting client" | "Ready to submit";

type Job = {
  id: string;
  clientName: string;
  title: string;
  field: string;
  status: JobStatus;
  createdAt: string;
  report?: string;
};

type Tab = "overview" | "engine" | "jobs";

const serviceOptions = [
  "Manuscript technical audit",
  "Academic language polishing",
  "Title and abstract optimization",
  "Journal matching and shortlist",
  "Predatory-journal risk screening",
  "References and citation consistency audit",
  "Target-journal formatting checklist",
  "Cover letter and submission package",
  "Reviewer-response technical support",
  "Similarity-check readiness review",
];

const blankForm = {
  clientName: "",
  contact: "",
  title: "",
  field: "",
  articleType: "Original research article",
  targetJournal: "",
  abstract: "",
  manuscriptText: "",
};

export default function AdminClient() {
  const [tab, setTab] = useState<Tab>("overview");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState(blankForm);
  const [services, setServices] = useState<string[]>(["Manuscript technical audit", "Journal matching and shortlist"]);
  const [result, setResult] = useState<EngineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("publishai_admin_jobs");
      if (saved) setJobs(JSON.parse(saved));
    } catch {
      // Ignore malformed local state.
    }
  }, []);

  function persist(nextJobs: Job[]) {
    setJobs(nextJobs);
    localStorage.setItem("publishai_admin_jobs", JSON.stringify(nextJobs));
  }

  const stats = useMemo(() => ({
    total: jobs.length,
    review: jobs.filter((job) => job.status === "In technical review").length,
    awaiting: jobs.filter((job) => job.status === "Awaiting client").length,
    ready: jobs.filter((job) => job.status === "Ready to submit").length,
  }), [jobs]);

  function toggleService(service: string) {
    setServices((current) => current.includes(service) ? current.filter((item) => item !== service) : [...current, service]);
  }

  async function runEngine(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/admin/publishing-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, services }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Publishing engine failed.");
      setResult(data);

      const job: Job = {
        id: crypto.randomUUID(),
        clientName: form.clientName || "Unnamed client",
        title: form.title,
        field: form.field,
        status: "In technical review",
        createdAt: new Date().toISOString(),
        report: data.report,
      };
      persist([job, ...jobs]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publishing engine failed.");
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    if (!result) return;
    const blob = new Blob([result.report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${form.title || "publishing-report"}-technical-report.txt`.replace(/[^a-z0-9._-]+/gi, "-");
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyReport() {
    if (result) await navigator.clipboard.writeText(result.report);
  }

  function updateStatus(id: string, status: JobStatus) {
    persist(jobs.map((job) => job.id === id ? { ...job, status } : job));
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}><span className={styles.mark}>M</span> Mabrig PublishAI <span style={{ opacity: .55 }}>/ Admin</span></div>
        <div className={styles.topActions}>
          <a className={styles.homeLink} href="/">View public website</a>
          <button onClick={logout}>Sign out</button>
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.navLabel}>Publisher workspace</div>
          <button className={`${styles.navButton} ${tab === "overview" ? styles.navButtonActive : ""}`} onClick={() => setTab("overview")}>Overview</button>
          <button className={`${styles.navButton} ${tab === "engine" ? styles.navButtonActive : ""}`} onClick={() => setTab("engine")}>AI Publishing Engine</button>
          <button className={`${styles.navButton} ${tab === "jobs" ? styles.navButtonActive : ""}`} onClick={() => setTab("jobs")}>Client Jobs</button>
          <a className={styles.navButton} href="/free-journals" style={{ display: "block", textDecoration: "none" }}>Journal Intelligence</a>
          <div className={styles.sideNote}><strong>Publisher advantage</strong><br />AI accelerates diagnosis, matching, checklists and technical preparation. Final scholarly and journal-policy decisions remain human-reviewed.</div>
        </aside>

        <main className={styles.content}>
          {tab === "overview" && (
            <>
              <div className={styles.headingRow}>
                <div><div className={styles.eyebrow}>PUBLISHING OPERATIONS</div><h1>Premium technical services control room</h1><p>Manage author jobs and turn manuscripts into professionally prepared submission packages.</p></div>
                <span className={styles.badge}>Publisher-only engine</span>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}><span>Total client jobs</span><strong>{stats.total}</strong></div>
                <div className={styles.stat}><span>Technical review</span><strong>{stats.review}</strong></div>
                <div className={styles.stat}><span>Awaiting client</span><strong>{stats.awaiting}</strong></div>
                <div className={styles.stat}><span>Ready to submit</span><strong>{stats.ready}</strong></div>
              </div>

              <div className={styles.grid2}>
                <section className={styles.card}>
                  <div className={styles.eyebrow}>CORE ENGINE</div>
                  <h3>From manuscript intake to submission-ready package</h3>
                  <p className={styles.muted}>The admin side is designed for the publisher—not the public. It combines technical editing intelligence, journal evidence, compliance checks and client-delivery workflows.</p>
                  <div className={styles.quickGrid}>
                    <div className={styles.quick}><strong>1. Diagnose</strong><span>Structure, abstract, language, references and compliance risks.</span></div>
                    <div className={styles.quick}><strong>2. Match</strong><span>Find journals publishing related scholarship, then verify policies.</span></div>
                    <div className={styles.quick}><strong>3. Prepare</strong><span>Build formatting, declarations, cover-letter and submission checklists.</span></div>
                    <div className={styles.quick}><strong>4. Deliver</strong><span>Produce a publisher-facing report and track client progress.</span></div>
                  </div>
                  <div className={styles.formActions}><button className={styles.primary} onClick={() => setTab("engine")}>Start a new client job</button></div>
                </section>

                <section className={styles.card}>
                  <div className={styles.eyebrow}>PREMIUM SERVICE STACK</div>
                  <h3>Services the publisher can sell</h3>
                  <p className={styles.muted}>Technical support can be packaged as standalone services or bundled into a full publication-readiness workflow.</p>
                  <div className={styles.quickGrid}>
                    <div className={styles.quick}><strong>Journal Fit Intelligence</strong><span>Scope matching, OA/APC signals and legitimacy checks.</span></div>
                    <div className={styles.quick}><strong>Technical Manuscript Audit</strong><span>Submission readiness, structure, consistency and declarations.</span></div>
                    <div className={styles.quick}><strong>Formatting & Compliance</strong><span>Author-guideline checklist, references, figures and tables.</span></div>
                    <div className={styles.quick}><strong>Submission Support</strong><span>Cover letter, package checklist and reviewer-response preparation.</span></div>
                  </div>
                </section>
              </div>
            </>
          )}

          {tab === "engine" && (
            <>
              <div className={styles.headingRow}>
                <div><div className={styles.eyebrow}>AI PUBLISHING ENGINE</div><h1>Build a premium technical assessment</h1><p>Enter the client manuscript details, select billable services, and generate a publisher-facing action report.</p></div>
                <span className={styles.badge}>{result?.aiEnabled ? "AI analysis active" : "Registry + technical workflow"}</span>
              </div>

              <div className={styles.engine}>
                <form className={styles.formCard} onSubmit={runEngine}>
                  <div className={styles.formGrid}>
                    <label className={styles.field}><span>Client name</span><input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Author / researcher" /></label>
                    <label className={styles.field}><span>Contact / job reference</span><input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="WhatsApp, email or invoice ID" /></label>
                    <label className={`${styles.field} ${styles.fieldFull}`}><span>Manuscript title</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Full article title" /></label>
                    <label className={styles.field}><span>Discipline / field</span><input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} placeholder="e.g. Public Administration" /></label>
                    <label className={styles.field}><span>Article type</span><select value={form.articleType} onChange={(e) => setForm({ ...form, articleType: e.target.value })}><option>Original research article</option><option>Review article</option><option>Systematic review</option><option>Case study</option><option>Short communication</option><option>Conceptual paper</option></select></label>
                    <label className={`${styles.field} ${styles.fieldFull}`}><span>Target journal, if already chosen</span><input value={form.targetJournal} onChange={(e) => setForm({ ...form, targetJournal: e.target.value })} placeholder="Leave blank if journal matching is required" /></label>
                    <label className={`${styles.field} ${styles.fieldFull}`}><span>Abstract</span><textarea required value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} placeholder="Paste the full abstract (minimum 80 characters)" /></label>
                    <label className={`${styles.field} ${styles.fieldFull}`}><span>Manuscript text or key sections</span><textarea className={styles.large} value={form.manuscriptText} onChange={(e) => setForm({ ...form, manuscriptText: e.target.value })} placeholder="Paste introduction, methodology, findings, discussion, references or the sections you want the engine to inspect." /></label>
                  </div>

                  <div className={styles.servicesTitle}>Select premium technical services</div>
                  <div className={styles.services}>
                    {serviceOptions.map((service) => <label className={styles.service} key={service}><input type="checkbox" checked={services.includes(service)} onChange={() => toggleService(service)} /><span>{service}</span></label>)}
                  </div>

                  <div className={styles.formActions}>
                    <button className={styles.primary} disabled={loading}>{loading ? "Running publishing engine…" : "Generate technical publishing report"}</button>
                    <button type="button" className={styles.secondary} onClick={() => { setForm(blankForm); setResult(null); setError(""); }}>Clear</button>
                  </div>
                  {error && <div className={styles.error}>{error}</div>}
                </form>

                <section className={styles.reportCard}>
                  {!result ? (
                    <div className={styles.placeholder}><div><strong>Your technical report appears here</strong><span>The engine will combine manuscript diagnostics, selected services and registry-derived journal candidates into a publisher-facing workflow.</span></div></div>
                  ) : (
                    <>
                      <div className={styles.reportHead}>
                        <div><h3>Publishing technical report</h3><span>{result.aiEnabled ? "AI-assisted analysis" : "Deterministic technical workflow"} · {new Date(result.generatedAt).toLocaleString()}</span></div>
                        <div className={styles.reportActions}><button className={styles.secondary} onClick={copyReport}>Copy</button><button className={styles.secondary} onClick={downloadReport}>Download</button></div>
                      </div>
                      <div className={styles.report}>{result.report}</div>
                      {result.candidates.length > 0 && <><div className={styles.servicesTitle}>Registry-derived journal candidates</div><div className={styles.candidateList}>{result.candidates.slice(0, 5).map((journal) => <div className={styles.candidate} key={journal.id}><strong>{journal.name}</strong><span>{journal.publisher || "Publisher not returned"} · {journal.isInDoaj ? "DOAJ signal" : journal.isOpenAccess ? "OA signal" : "Access model requires checking"} · {journal.feeStatus.replaceAll("-", " ")}</span></div>)}</div></>}
                    </>
                  )}
                </section>
              </div>
            </>
          )}

          {tab === "jobs" && (
            <>
              <div className={styles.headingRow}>
                <div><div className={styles.eyebrow}>CLIENT PIPELINE</div><h1>Publishing jobs</h1><p>Track each manuscript from first technical audit to submission-ready delivery.</p></div>
                <button className={styles.primary} onClick={() => setTab("engine")}>New job</button>
              </div>
              {jobs.length === 0 ? <div className={styles.empty}>No client jobs yet. Run the publishing engine to create the first one.</div> : <div className={styles.jobs}>{jobs.map((job) => <article className={styles.job} key={job.id}><div><strong>{job.title}</strong><small>{job.clientName} · {job.field || "Field not specified"} · {new Date(job.createdAt).toLocaleDateString()}</small></div><select value={job.status} onChange={(e) => updateStatus(job.id, e.target.value as JobStatus)}><option>New</option><option>In technical review</option><option>Awaiting client</option><option>Ready to submit</option></select><button className={styles.secondary} onClick={() => { if (job.report) { setResult({ report: job.report, aiEnabled: true, candidates: [], generatedAt: job.createdAt }); setForm({ ...blankForm, title: job.title, clientName: job.clientName, field: job.field }); setTab("engine"); } }}>Open report</button></article>)}</div>}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
