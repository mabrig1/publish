import styles from "./home.module.css";

const services = [
  ["Manuscript Technical Audit", "A structured pre-submission review covering organization, consistency, journal readiness, declarations, tables, figures and technical weaknesses."],
  ["Academic Language Polishing", "Clarity, grammar, scholarly tone and readability support while preserving the author's ideas, evidence and ownership of the work."],
  ["Journal Matching", "Evidence-aware journal discovery based on topic fit, related published work, access model and registry signals."],
  ["Predatory Journal Screening", "Independent registry checks and caution flags before an author submits a manuscript or pays publication charges."],
  ["References & Citation Audit", "Consistency checks between in-text citations and reference lists, style preparation and missing-information flags."],
  ["Journal Formatting", "Technical preparation against the target journal's current author instructions, including headings, tables, figures and references."],
  ["Cover Letter Preparation", "Professional submission-letter support focused on manuscript contribution, fit and required declarations without exaggerated claims."],
  ["Reviewer Response Support", "Technical organization of reviewer comments, response matrices and revision tracking while authors retain responsibility for scientific decisions."],
];

export default function Home() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <a className={styles.brand} href="#top"><span className={styles.mark}>M</span><span>Mabrig <b>PublishAI</b></span></a>
        <div className={styles.links}>
          <a href="#services">Services</a>
          <a href="#how">How it works</a>
          <a href="#journals">Journal Intelligence</a>
          <a href="#ethics">Responsible AI</a>
          <a href="/free-journals">Free Journal Directory</a>
          <a className={styles.publisher} href="/admin">Publisher Login</a>
        </div>
      </nav>

      <main id="top">
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div>
              <div className={styles.eyebrow}>AI-ASSISTED ACADEMIC PUBLISHING SUPPORT</div>
              <h1>Give every manuscript a <span>stronger path to publication.</span></h1>
              <p className={styles.lead}>Mabrig PublishAI helps researchers and academic authors prepare manuscripts professionally, identify reputable journals, reduce avoidable submission errors, verify journal claims, and receive premium technical publishing support powered by AI and human review.</p>
              <div className={styles.actions}>
                <a className={styles.primary} href="#services">Explore publishing services →</a>
                <a className={styles.secondary} href="/free-journals">Find reputable journals</a>
              </div>
            </div>

            <aside className={styles.heroCard}>
              <div className={styles.eyebrow} style={{ color: "#55dda3" }}>THE PUBLISHING WORKFLOW</div>
              <h3>From manuscript to submission-ready package</h3>
              <div className={styles.flow}>
                <div className={styles.flowItem}><span className={styles.flowNum}>1</span><div><strong>Assess the manuscript</strong><span>Identify technical, structural and compliance weaknesses.</span></div></div>
                <div className={styles.flowItem}><span className={styles.flowNum}>2</span><div><strong>Find and verify journals</strong><span>Match scope, inspect registry signals and check publication-cost evidence.</span></div></div>
                <div className={styles.flowItem}><span className={styles.flowNum}>3</span><div><strong>Prepare the submission</strong><span>Formatting, references, declarations, cover letter and technical checklist.</span></div></div>
                <div className={styles.flowItem}><span className={styles.flowNum}>4</span><div><strong>Support revisions</strong><span>Track reviewer comments, corrections and resubmission requirements.</span></div></div>
              </div>
            </aside>
          </div>
        </section>

        <div className={styles.trust}>
          <span>Journal intelligence uses scholarly evidence from</span><strong>OpenAlex</strong><strong>Crossref</strong><strong>DOAJ signals</strong><span>plus official journal-policy verification.</span>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div className={styles.eyebrow}>WHAT PUBLISHAI DOES</div>
              <h2>A technical publishing partner for serious academic work</h2>
              <p>The platform is built to give a professional publisher an operational edge while helping authors navigate the most difficult parts of scholarly publishing more carefully and efficiently.</p>
            </div>
            <div className={styles.cards}>
              <article className={styles.card}><div className={styles.icon}>AI</div><h3>AI-Assisted Technical Review</h3><p>Rapidly identify manuscript-readiness issues, priority corrections and the technical work needed before submission.</p></article>
              <article className={styles.card}><div className={styles.icon}>◎</div><h3>Journal Discovery</h3><p>Find journals publishing related scholarship and filter candidates by open-access, APC and citation signals.</p></article>
              <article className={styles.card}><div className={styles.icon}>✓</div><h3>Journal Verification</h3><p>Screen ISSN, publisher, registry presence, DOI metadata and OA evidence before clients submit or pay.</p></article>
              <article className={styles.card}><div className={styles.icon}>A+</div><h3>Premium Editorial Support</h3><p>Provide language, structure, title, abstract and submission-package improvements without fabricating research.</p></article>
              <article className={styles.card}><div className={styles.icon}>¶</div><h3>Formatting & References</h3><p>Prepare manuscripts for specific journal requirements and reduce technical rejection caused by preventable inconsistencies.</p></article>
              <article className={styles.card}><div className={styles.icon}>↗</div><h3>Submission Strategy</h3><p>Help authors choose realistic targets, verify current policies and prepare a disciplined submission sequence.</p></article>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`} id="services">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div className={styles.eyebrow}>PREMIUM TECHNICAL SERVICES</div>
              <h2>Professional services the platform helps the publisher deliver</h2>
              <p>Each service can be offered independently or combined into a complete publication-readiness package for researchers, postgraduate students, lecturers and research teams.</p>
            </div>
            <div className={styles.serviceGrid}>
              {services.map(([title, description]) => <article className={styles.service} key={title}><span className={styles.serviceTick}>✓</span><div><h3>{title}</h3><p>{description}</p></div></article>)}
            </div>
          </div>
        </section>

        <section className={styles.section} id="how">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div className={styles.eyebrow}>HOW THE SERVICE WORKS</div>
              <h2>A clear publishing workflow from intake to delivery</h2>
            </div>
            <div className={styles.steps}>
              <article className={styles.step}><span>STEP 01</span><h3>Manuscript Intake</h3><p>The publisher receives the article, author requirements, discipline and any target-journal information.</p></article>
              <article className={styles.step}><span>STEP 02</span><h3>Technical Diagnosis</h3><p>The AI engine helps identify structural, language, reference, compliance and submission-readiness issues.</p></article>
              <article className={styles.step}><span>STEP 03</span><h3>Journal Strategy</h3><p>Relevant journals are discovered and screened. Current scope, fees, indexing claims and policies must be verified.</p></article>
              <article className={styles.step}><span>STEP 04</span><h3>Premium Delivery</h3><p>The publisher completes agreed corrections and delivers the technical report, formatted manuscript and submission checklist.</p></article>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`} id="journals">
          <div className={`${styles.sectionInner} ${styles.journalPanel}`}>
            <div className={styles.journalVisual}>
              <h3>Journal Intelligence Layer</h3>
              <div className={styles.journalRows}>
                <div className={styles.journalRow}><strong>Global Journal Finder</strong><span>Topic-based discovery across scholarly sources.</span></div>
                <div className={styles.journalRow}><strong>Open Access & APC Signals</strong><span>Separate zero-APC evidence, known APCs and unknown fee data.</span></div>
                <div className={styles.journalRow}><strong>Journal Guard</strong><span>Registry evidence and caution flags for suspicious journal claims.</span></div>
                <div className={styles.journalRow}><strong>Curated Free-Journal Directory</strong><span>100 cross-disciplinary candidates with evidence-aware status labels.</span></div>
              </div>
            </div>
            <div>
              <div className={styles.eyebrow}>BETTER JOURNAL DECISIONS</div>
              <h2 style={{ fontSize: "38px", margin: "10px 0 14px" }}>Do not recommend a journal just because its website looks convincing.</h2>
              <p className={styles.lead} style={{ fontSize: "15px" }}>PublishAI helps the publisher combine live registry evidence with human checks before advising a client. This reduces exposure to predatory journals, misleading indexing claims and unexpected charges.</p>
              <div className={styles.bullets}>
                <div className={styles.bullet}><b>✓</b><span>Check journal title and ISSN against scholarly registry records.</span></div>
                <div className={styles.bullet}><b>✓</b><span>Distinguish open access from confirmed zero-APC publication.</span></div>
                <div className={styles.bullet}><b>✓</b><span>Use transparent citation indicators without mislabeling them as proprietary impact factors.</span></div>
                <div className={styles.bullet}><b>✓</b><span>Verify final fees, author guidelines and indexing claims on the official journal or database site.</span></div>
              </div>
              <div className={styles.actions}><a className={styles.primary} href="/free-journals">Open journal directory</a></div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="ethics">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div className={styles.eyebrow}>RESPONSIBLE AI & SCHOLARLY INTEGRITY</div>
              <h2>AI should strengthen technical quality—not manufacture scholarship.</h2>
            </div>
            <div className={styles.ethics}>
              <div className={styles.ethicsBox}><h3>What the platform supports</h3><ul><li>Language clarity and technical editing.</li><li>Journal matching and evidence-based screening.</li><li>Formatting, references and author-guideline preparation.</li><li>Submission checklists, cover letters and revision organization.</li><li>Identifying issues that require the author or publisher to verify.</li></ul></div>
              <div className={styles.ethicsBox}><h3>What it does not promise</h3><ul><li>No guaranteed publication or acceptance.</li><li>No fabricated findings, data, citations or peer reviews.</li><li>No invented impact factors, indexing, fees or turnaround times.</li><li>No replacement for author responsibility, editorial judgment or official journal requirements.</li><li>No declaration that a journal is predatory based on one missing database record alone.</li></ul></div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}><div className={styles.eyebrow}>FREQUENT QUESTIONS</div><h2>What authors should know before using the service</h2></div>
            <div className={styles.faq}>
              <div className={styles.faqItem}><strong>Does PublishAI submit articles directly to journals?</strong><p>The core service prepares the manuscript and submission strategy. Actual submission should use the official journal submission system and remain under the author's or authorized publisher's control.</p></div>
              <div className={styles.faqItem}><strong>Can the platform guarantee a journal is free?</strong><p>No static list can safely guarantee that forever. Fee policies change, so PublishAI labels uncertainty and requires current policy verification before payment or submission.</p></div>
              <div className={styles.faqItem}><strong>Can AI rewrite an entire paper?</strong><p>The platform is designed for ethical technical and editorial assistance. Authors remain responsible for the scholarship, evidence, analysis, originality and final claims.</p></div>
              <div className={styles.faqItem}><strong>Who is the platform for?</strong><p>Researchers, lecturers, postgraduate students, research teams and publishers who need stronger technical preparation and better journal-selection intelligence.</p></div>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <div className={styles.eyebrow} style={{ color: "#53d99f" }}>PUBLISH WITH BETTER PREPARATION</div>
            <h2>Strong research deserves strong technical presentation.</h2>
            <p>Use Mabrig PublishAI to discover reputable journal options and work with a publisher equipped with AI-assisted technical publishing intelligence.</p>
            <div className={styles.actions} style={{ justifyContent: "center" }}><a className={styles.primary} href="/free-journals">Explore journals</a><a className={styles.secondary} href="#services">View premium services</a></div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}><p>© 2026 Mabrig PublishAI · Academic publishing intelligence and technical support.</p><div className={styles.miniLinks}><a href="#services">Services</a><a href="/free-journals">Journal Directory</a><a href="#ethics">Responsible AI</a><a href="/admin">Publisher Login</a></div></div>
      </footer>
    </div>
  );
}
