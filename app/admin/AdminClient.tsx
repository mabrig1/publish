"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { backendUrl } from "@/lib/backend-url";
import styles from "./admin.module.css";

type Candidate = {
  id: string;
  name: string;
  publisher?: string | null;
  isOpenAccess: boolean;
  isInDoaj: boolean;
  feeStatus: "no-apc-listed" | "apc-listed" | "unknown";
};

type ScholarPhase = {
  id: string;
  title: string;
  status: "ready" | "needs-input" | "action-required";
  objective: string;
  actions: string[];
};

type ScholarStrategy = {
  clientName: string;
  goal: string;
  readinessScore: number;
  readinessStatus: "strong" | "developing" | "foundation";
  guaranteeNotice: string;
  controllableOutcome: string;
  phases: ScholarPhase[];
  verificationQueries: string[];
  metadataChecklist: string[];
  publisherDeliverables: string[];
};

type EngineResult = {
  report: string;
  aiEnabled: boolean;
  aiProvider?: string | null;
  aiModel?: string | null;
  candidates: Candidate[];
  scholarStrategy: ScholarStrategy;
  generatedAt: string;
};

type JobStatus = "New" | "In technical review" | "Awaiting client" | "Ready to submit" | "Visibility monitoring";

type SavedAudit = {
  auditedAt: string;
  score: number;
  grade: "strong" | "good" | "needs-work" | "poor";
  compatibilityLabel: string;
  finalUrl: string;
  detectedTitle: string | null;
  detectedDoi: string | null;
  priorityFixes: string[];
};

type Job = {
  id: string;
  clientName: string;
  title: string;
  field: string;
  goal: string;
  status: JobStatus;
  createdAt: string;
  report?: string;
  scholarStrategy?: ScholarStrategy;
  articleUrl?: string;
  doi?: string;
  scholarAudits?: SavedAudit[];
  latestScholarAudit?: SavedAudit;
};

type Tab = "overview" | "engine" | "visibility" | "jobs";

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
  "Google Scholar visibility & indexing-readiness strategy",
  "DOI, ORCID & scholarly metadata optimization",
  "Repository / self-archiving discoverability plan",
  "Post-publication indexing monitoring & troubleshooting",
];

const blankForm = {
  clientName: "",
  contact: "",
  authorAffiliation: "",
  orcid: "",
  title: "",
  field: "",
  articleType: "Original research article",
  publicationGoal: "Google Scholar visibility & global discoverability",
  publicationStage: "Manuscript preparation",
  targetJournal: "",
  publicationDate: "",
  doi: "",
  articleUrl: "",
  fullTextUrl: "",
  abstract: "",
  manuscriptText: "",
};

const defaultServices = [
  "Manuscript technical audit",
  "Journal matching and shortlist",
  "Google Scholar visibility & indexing-readiness strategy",
];

export default function AdminClient() {
  const [tab, setTab] = useState<Tab>("overview");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState(blankForm);
  const [services, setServices] = useState<string[]>(defaultServices);
  const [result, setResult] = useState<EngineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadJobs() {
      try {
        const response = await fetch(backendUrl("/api/jobs"), { cache: "no-store", credentials: "include" });
        if (!response.ok) throw new Error("Backend unavailable");
        const data = await response.json();
        if (!cancelled) {
          setJobs(data.jobs || []);
          localStorage.setItem("publishai_admin_jobs", JSON.stringify(data.jobs || []));
        }
      } catch {
        try {
          const saved = localStorage.getItem("publishai_admin_jobs");
          if (saved && !cancelled) setJobs(JSON.parse(saved));
        } catch {
          // Ignore malformed legacy browser storage.
        }
      }
    }
    loadJobs();
    return () => { cancelled = true; };
  }, []);

  function persist(nextJobs: Job[]) {
    setJobs(nextJobs);
    localStorage.setItem("publishai_admin_jobs", JSON.stringify(nextJobs));
  }

  const stats = useMemo(() => ({
    total: jobs.length,
    review: jobs.filter((job) => job.status === "In technical review").length,
    ready: jobs.filter((job) => job.status === "Ready to submit").length,
    monitoring: jobs.filter((job) => job.status === "Visibility monitoring").length,
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
        clientName: form.clientName,
        title: form.title,
        field: form.field,
        goal: form.publicationGoal,
        status: "In technical review",
        createdAt: new Date().toISOString(),
        report: data.report,
        scholarStrategy: data.scholarStrategy,
        articleUrl: form.articleUrl || undefined,
        doi: form.doi || undefined,
        scholarAudits: [],
      };
      persist([job, ...jobs]);
      const saveResponse = await fetch(backendUrl("/api/jobs"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      if (!saveResponse.ok) {
        const saveData = await saveResponse.json().catch(() => ({}));
        throw new Error(saveData.error || "Report generated, but the client job could not be saved.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publishing engine failed.");
    } finally {
      setLoading(false);
    }
  }

  function downloadReport() {
    if (!result) return;
    const strategy = result.scholarStrategy;
    const appendix = `\n\nGOOGLE SCHOLAR / DISCOVERABILITY ROADMAP\nReadiness: ${strategy.readinessScore}/100 (${strategy.readinessStatus})\nGoal: ${strategy.goal}\n\n${strategy.phases.map((phase) => `${phase.title} [${phase.status}]\n${phase.objective}\n${phase.actions.map((action) => `- ${action}`).join("\n")}`).join("\n\n")}`;
    const blob = new Blob([result.report + appendix], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${form.clientName || "client"}-${form.title || "publishing"}-strategy.txt`.replace(/[^a-z0-9._-]+/gi, "-");
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyReport() {
    if (result) await navigator.clipboard.writeText(result.report);
  }

  async function updateStatus(id: string, status: JobStatus) {
    persist(jobs.map((job) => job.id === id ? { ...job, status } : job));
    const response = await fetch(backendUrl(`/api/jobs/${encodeURIComponent(id)}`), {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) setError("Status changed locally, but the backend update failed. Please retry.");
  }

  function openAudit(job: Job) {
    window.location.href = `/admin/scholar-auditor?job=${encodeURIComponent(job.id)}`;
  }

  async function openCurrentFormAudit() {
    const provisionalJob: Job = {
      id: crypto.randomUUID(),
      clientName: form.clientName || "Unnamed client",
      title: form.title || "Untitled article",
      field: form.field,
      goal: form.publicationGoal,
      status: "Visibility monitoring",
      createdAt: new Date().toISOString(),
      articleUrl: form.articleUrl || undefined,
      doi: form.doi || undefined,
      scholarAudits: [],
    };
    const nextJobs = [provisionalJob, ...jobs];
    persist(nextJobs);
    const response = await fetch(backendUrl("/api/jobs"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(provisionalJob),
    });
    if (!response.ok) {
      setError("The client case could not be saved to the backend.");
      return;
    }
    openAudit(provisionalJob);
  }

  async function logout() {
    await fetch(backendUrl("/api/session"), { method: "DELETE", credentials: "include" }).catch(() => undefined);
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

  function startScholarJob() {
    setForm({ ...blankForm, publicationGoal: "Google Scholar visibility & global discoverability" });
    setServices(defaultServices);
    setResult(null);
    setTab("engine");
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <div className={styles.brand}><span className={styles.mark}>M</span> Mabrig PublishAI <span style={{ opacity: .55 }}>/ Publisher Engine</span></div>
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
          <button className={`${styles.navButton} ${tab === "visibility" ? styles.navButtonActive : ""}`} onClick={() => setTab("visibility")}>Google Scholar Strategy</button>
          <a className={styles.navButton} href="/admin/scholar-auditor" style={{ display: "block", textDecoration: "none" }}>Live Scholar Auditor</a>
          <button className={`${styles.navButton} ${tab === "jobs" ? styles.navButtonActive : ""}`} onClick={() => setTab("jobs")}>Client Jobs</button>
          <a className={styles.navButton} href="/free-journals" style={{ display: "block", textDecoration: "none" }}>Journal Intelligence</a>
          <div className={styles.sideNote}><strong>Africa-first publisher advantage</strong><br />Every client case can now move from manuscript strategy into a live Google Scholar technical audit with audit history attached to the job.</div>
        </aside>

        <main className={styles.content}>
          {tab === "overview" && (
            <>
              <div className={styles.headingRow}>
                <div><div className={styles.eyebrow}>AFRICA-FIRST PUBLISHING OPERATIONS</div><h1>Article publishing intelligence control room</h1><p>Turn each client request into a documented pathway from manuscript preparation to reputable publication and global research discoverability.</p></div>
                <span className={styles.badge}>Publisher-only engine</span>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}><span>Total client jobs</span><strong>{stats.total}</strong></div>
                <div className={styles.stat}><span>Technical review</span><strong>{stats.review}</strong></div>
                <div className={styles.stat}><span>Ready to submit</span><strong>{stats.ready}</strong></div>
                <div className={styles.stat}><span>Visibility monitoring</span><strong>{stats.monitoring}</strong></div>
              </div>

              <div className={styles.grid2}>
                <section className={styles.card}>
                  <div className={styles.eyebrow}>CONNECTED CLIENT WORKFLOW</div>
                  <h3>From client name to measurable publication readiness</h3>
                  <p className={styles.muted}>Create the publishing roadmap, keep DOI and article URL inside the job, then launch the live Scholar auditor from that same case. Re-audits build a client history instead of creating disconnected reports.</p>
                  <div className={styles.quickGrid}>
                    <div className={styles.quick}><strong>1. Profile</strong><span>Author identity, affiliation, ORCID, article stage and publication goal.</span></div>
                    <div className={styles.quick}><strong>2. Prepare</strong><span>Manuscript diagnosis, journal fit, references and submission package.</span></div>
                    <div className={styles.quick}><strong>3. Audit live</strong><span>Test the published article page for Scholar-compatible metadata and crawlability.</span></div>
                    <div className={styles.quick}><strong>4. Re-audit</strong><span>Track score improvements and priority fixes inside the same client case.</span></div>
                  </div>
                  <div className={styles.formActions}><button className={styles.primary} onClick={() => setTab("engine")}>Start a new client job</button></div>
                </section>

                <section className={styles.card}>
                  <div className={styles.eyebrow}>LIVE SCHOLAR AUDITOR</div>
                  <h3>Turn discoverability advice into a technical service</h3>
                  <p className={styles.muted}>The auditor checks the real article page for metadata, DOI consistency, abstract visibility, PDF linkage, robots directives and other Scholar compatibility signals.</p>
                  <div className={styles.quickGrid}>
                    <div className={styles.quick}><strong>Pre-filled client case</strong><span>Name and title load from the selected publishing job.</span></div>
                    <div className={styles.quick}><strong>Persistent audit trail</strong><span>Scores and repair priorities are stored back into the client job.</span></div>
                    <div className={styles.quick}><strong>Technical repair map</strong><span>PASS, REVIEW and FIX findings support premium troubleshooting work.</span></div>
                    <div className={styles.quick}><strong>No false promises</strong><span>Compatibility is measured; Google still controls indexing decisions and timing.</span></div>
                  </div>
                  <div className={styles.formActions}><a className={styles.primary} href="/admin/scholar-auditor" style={{ textDecoration: "none" }}>Open live auditor</a></div>
                </section>
              </div>
            </>
          )}

          {tab === "visibility" && (
            <>
              <div className={styles.headingRow}>
                <div><div className={styles.eyebrow}>GOOGLE SCHOLAR & GLOBAL DISCOVERABILITY</div><h1>Publisher visibility playbook</h1><p>Diagnose eligibility, improve machine-readable metadata, strengthen legitimate discovery routes, and verify the result against the live article page.</p></div>
                <span className={styles.badge}>Strategy + live audit</span>
              </div>
              <div className={styles.grid2}>
                <section className={styles.card}>
                  <div className={styles.eyebrow}>STRATEGY ENGINE</div>
                  <h3>Map the conditions for discoverability</h3>
                  <div className={styles.quickGrid}>
                    <div className={styles.quick}><strong>Author identity</strong><span>Consistent names, affiliation and ORCID linkage.</span></div>
                    <div className={styles.quick}><strong>Article metadata</strong><span>Scholar-compatible citation tags and accurate DOI/bibliographic data.</span></div>
                    <div className={styles.quick}><strong>Article architecture</strong><span>One stable URL per article, visible abstract and linked full text.</span></div>
                    <div className={styles.quick}><strong>Monitoring</strong><span>Exact-title, author and site-coverage checks with troubleshooting records.</span></div>
                  </div>
                  <div className={styles.formActions}><button className={styles.primary} onClick={startScholarJob}>Build a client Scholar strategy</button></div>
                </section>
                <section className={styles.card}>
                  <div className={styles.eyebrow}>LIVE VERIFICATION</div>
                  <h3>Audit what is actually published</h3>
                  <p className={styles.muted}>Once a journal or repository page is live, run the compatibility auditor and store the findings against the same client case.</p>
                  <div className={styles.formActions}><a className={styles.primary} href="/admin/scholar-auditor" style={{ textDecoration: "none" }}>Run live compatibility audit</a></div>
                </section>
              </div>
            </>
          )}

          {tab === "engine" && (
            <>
              <div className={styles.headingRow}>
                <div><div className={styles.eyebrow}>AI PUBLISHING ENGINE</div><h1>Build a client-specific publishing strategy</h1><p>Enter the author's identity, manuscript, publication stage and goal. The engine maps billable work from technical editing through post-publication visibility.</p></div>
                <span className={styles.badge}>{result?.aiEnabled ? `${result.aiProvider || "AI"} active` : "Registry + technical workflow"}</span>
              </div>

              <div className={styles.engine}>
                <form className={styles.formCard} onSubmit={runEngine}>
                  <div className={styles.servicesTitle}>1. Client & scholarly identity</div>
                  <div className={styles.formGrid}>
                    <label className={styles.field}><span>Client / author name *</span><input required value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Full name as it should appear academically" /></label>
                    <label className={styles.field}><span>Contact / job reference</span><input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="WhatsApp, email or invoice ID" /></label>
                    <label className={styles.field}><span>Institutional affiliation</span><input value={form.authorAffiliation} onChange={(e) => setForm({ ...form, authorAffiliation: e.target.value })} placeholder="University / institute / organization" /></label>
                    <label className={styles.field}><span>ORCID</span><input value={form.orcid} onChange={(e) => setForm({ ...form, orcid: e.target.value })} placeholder="0000-0000-0000-0000" /></label>
                    <label className={styles.field}><span>Primary publishing goal</span><select value={form.publicationGoal} onChange={(e) => setForm({ ...form, publicationGoal: e.target.value })}><option>Google Scholar visibility & global discoverability</option><option>Publish in a reputable indexed journal</option><option>Find a free / zero-APC reputable journal</option><option>Target a high-impact journal</option><option>Improve citation and research visibility</option><option>Prepare for journal resubmission</option><option>Respond to reviewers and complete revisions</option></select></label>
                    <label className={styles.field}><span>Publication stage</span><select value={form.publicationStage} onChange={(e) => setForm({ ...form, publicationStage: e.target.value })}><option>Manuscript preparation</option><option>Journal selection</option><option>Submitted</option><option>Under review</option><option>Accepted</option><option>Published</option></select></label>
                  </div>

                  <div className={styles.servicesTitle}>2. Manuscript</div>
                  <div className={styles.formGrid}>
                    <label className={`${styles.field} ${styles.fieldFull}`}><span>Manuscript title *</span><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Full article title" /></label>
                    <label className={styles.field}><span>Discipline / field</span><input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} placeholder="e.g. Public Administration" /></label>
                    <label className={styles.field}><span>Article type</span><select value={form.articleType} onChange={(e) => setForm({ ...form, articleType: e.target.value })}><option>Original research article</option><option>Review article</option><option>Systematic review</option><option>Case study</option><option>Short communication</option><option>Conceptual paper</option></select></label>
                    <label className={`${styles.field} ${styles.fieldFull}`}><span>Abstract *</span><textarea required value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} placeholder="Paste the full abstract (minimum 80 characters)" /></label>
                    <label className={`${styles.field} ${styles.fieldFull}`}><span>Manuscript text or key sections</span><textarea className={styles.large} value={form.manuscriptText} onChange={(e) => setForm({ ...form, manuscriptText: e.target.value })} placeholder="Paste introduction, methodology, findings, discussion, references or the sections you want the engine to inspect." /></label>
                  </div>

                  <div className={styles.servicesTitle}>3. Publication & discoverability evidence</div>
                  <div className={styles.formGrid}>
                    <label className={`${styles.field} ${styles.fieldFull}`}><span>Target journal, if already chosen</span><input value={form.targetJournal} onChange={(e) => setForm({ ...form, targetJournal: e.target.value })} placeholder="Leave blank if journal matching is required" /></label>
                    <label className={styles.field}><span>Publication date</span><input type="date" value={form.publicationDate} onChange={(e) => setForm({ ...form, publicationDate: e.target.value })} /></label>
                    <label className={styles.field}><span>DOI</span><input value={form.doi} onChange={(e) => setForm({ ...form, doi: e.target.value })} placeholder="10.xxxx/xxxxx" /></label>
                    <label className={`${styles.field} ${styles.fieldFull}`}><span>Canonical article URL</span><input value={form.articleUrl} onChange={(e) => setForm({ ...form, articleUrl: e.target.value })} placeholder="https://journal.org/article/..." /></label>
                    <label className={`${styles.field} ${styles.fieldFull}`}><span>Full-text / PDF / repository URL</span><input value={form.fullTextUrl} onChange={(e) => setForm({ ...form, fullTextUrl: e.target.value })} placeholder="https://.../article.pdf or repository record" /></label>
                  </div>

                  <div className={styles.servicesTitle}>4. Select premium technical services</div>
                  <div className={styles.services}>{serviceOptions.map((service) => <label className={styles.service} key={service}><input type="checkbox" checked={services.includes(service)} onChange={() => toggleService(service)} /><span>{service}</span></label>)}</div>

                  <div className={styles.formActions}>
                    <button className={styles.primary} disabled={loading}>{loading ? `Building strategy for ${form.clientName || "client"}…` : `Generate ${form.clientName ? `${form.clientName}'s` : "client"} publishing roadmap`}</button>
                    <button type="button" className={styles.secondary} disabled={!form.articleUrl} onClick={openCurrentFormAudit}>Audit article URL now</button>
                    <button type="button" className={styles.secondary} onClick={() => { setForm(blankForm); setServices(defaultServices); setResult(null); setError(""); }}>Clear</button>
                  </div>
                  {error && <div className={styles.error}>{error}</div>}
                </form>

                <section className={styles.reportCard}>
                  {!result ? (
                    <div className={styles.placeholder}><div><strong>Client roadmap appears here</strong><span>The engine combines manuscript diagnostics, journal evidence, Scholar readiness and selected premium services. Once an article URL is available, launch the live audit from the same case.</span></div></div>
                  ) : (
                    <>
                      <div className={styles.reportHead}>
                        <div><h3>{result.scholarStrategy.clientName}'s publishing roadmap</h3><span>{result.aiEnabled ? `${result.aiProvider} / ${result.aiModel}` : "Deterministic technical workflow"} · {new Date(result.generatedAt).toLocaleString()}</span></div>
                        <div className={styles.reportActions}><button className={styles.secondary} onClick={copyReport}>Copy</button><button className={styles.secondary} onClick={downloadReport}>Download</button></div>
                      </div>
                      <section className={styles.card} style={{ marginBottom: 16 }}>
                        <div className={styles.eyebrow}>GOOGLE SCHOLAR / DISCOVERABILITY READINESS</div>
                        <div className={styles.headingRow} style={{ marginBottom: 8 }}><div><h3 style={{ margin: 0 }}>{result.scholarStrategy.readinessScore}/100 · {result.scholarStrategy.readinessStatus}</h3><p>{result.scholarStrategy.goal}</p></div><span className={styles.badge}>Internal readiness score</span></div>
                        <div style={{ height: 10, background: "#e8edf4", borderRadius: 999, overflow: "hidden", marginBottom: 14 }}><div style={{ width: `${result.scholarStrategy.readinessScore}%`, height: "100%", background: "#176b55" }} /></div>
                        <p className={styles.muted}>{result.scholarStrategy.controllableOutcome}</p>
                      </section>
                      <div className={styles.report}>{result.report}</div>
                      <div className={styles.servicesTitle}>Publisher deliverables</div>
                      <div className={styles.candidateList}>{result.scholarStrategy.publisherDeliverables.map((item) => <div className={styles.candidate} key={item}><strong>{item}</strong></div>)}</div>
                      {result.candidates.length > 0 && <><div className={styles.servicesTitle}>Registry-derived journal candidates</div><div className={styles.candidateList}>{result.candidates.slice(0, 5).map((journal) => <div className={styles.candidate} key={journal.id}><strong>{journal.name}</strong><span>{journal.publisher || "Publisher not returned"} · {journal.isInDoaj ? "DOAJ signal" : journal.isOpenAccess ? "OA signal" : "Access model requires checking"}</span></div>)}</div></>}
                    </>
                  )}
                </section>
              </div>
            </>
          )}

          {tab === "jobs" && (
            <>
              <div className={styles.headingRow}>
                <div><div className={styles.eyebrow}>CLIENT PIPELINE</div><h1>Publishing jobs</h1><p>Track each manuscript from author intake through submission, live Scholar auditing and visibility monitoring.</p></div>
                <button className={styles.primary} onClick={() => setTab("engine")}>New job</button>
              </div>
              {jobs.length === 0 ? <div className={styles.empty}>No client jobs yet. Run the publishing engine to create the first one.</div> : (
                <div className={styles.jobs}>
                  {jobs.map((job) => (
                    <article className={styles.job} key={job.id}>
                      <div>
                        <strong>{job.title}</strong>
                        <small>{job.clientName} · {job.field || "Field not specified"} · {job.goal || "Publication support"} · {new Date(job.createdAt).toLocaleDateString()}</small>
                        {job.latestScholarAudit && <small>Latest Scholar audit: {job.latestScholarAudit.score}/100 · {job.latestScholarAudit.grade.replaceAll("-", " ")} · {new Date(job.latestScholarAudit.auditedAt).toLocaleDateString()}</small>}
                      </div>
                      <select value={job.status} onChange={(e) => updateStatus(job.id, e.target.value as JobStatus)}><option>New</option><option>In technical review</option><option>Awaiting client</option><option>Ready to submit</option><option>Visibility monitoring</option></select>
                      <button className={styles.secondary} onClick={() => openAudit(job)}>{job.latestScholarAudit ? "Re-audit Scholar" : "Audit Scholar"}</button>
                      <button className={styles.secondary} onClick={() => { if (job.report && job.scholarStrategy) { setResult({ report: job.report, aiEnabled: false, candidates: [], scholarStrategy: job.scholarStrategy, generatedAt: job.createdAt }); setForm({ ...blankForm, title: job.title, clientName: job.clientName, field: job.field, publicationGoal: job.goal, articleUrl: job.articleUrl || "", doi: job.doi || "" }); setTab("engine"); } }}>Open roadmap</button>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
