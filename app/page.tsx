import styles from "./home.module.css";

const services = [
  ["Manuscript Technical Audit", "A structured pre-submission review covering organization, consistency, journal readiness, declarations, tables, figures and technical weaknesses."],
  ["Academic Language Polishing", "Clarity, grammar, scholarly tone and readability support while preserving the author's ideas, evidence and ownership of the work."],
  ["Journal Matching", "Evidence-aware journal discovery based on topic fit, related published work, access model and registry signals."],
  ["Predatory Journal Screening", "Independent registry checks and caution flags before an author submits a manuscript or pays publication charges."],
  ["Google Scholar Visibility Strategy", "A personalized discoverability roadmap covering Scholar-compatible metadata, article pages, searchable PDFs, crawlability, repositories and post-publication monitoring."],
  ["DOI, ORCID & Metadata Optimization", "Align author identity and article metadata across journal, DOI, ORCID, repository and publisher records to reduce discoverability and citation-identity problems."],
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
          <a href="#scholar">Google Scholar</a>
          <a href="#journals">Journal Intelligence</a>
          <a href="#ethics">Responsible AI</a>
          <a href="/free-journals">Journal Directory</a>
          <a className={styles.publisher} href="/admin">Publisher Login</a>
        </div>
      </nav>

      <main id="top">
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div>
              <div className={styles.eyebrow}>AFRICA-FIRST AI-ASSISTED ACADEMIC PUBLISHING SUPPORT</div>
              <h1>Prepare stronger articles. Choose better journals. <span>Build global research visibility.</span></h1>
              <p className={styles.lead}>Mabrig PublishAI gives African publishers and researchers a professional technical workflow for manuscript preparation, reputable-journal discovery, publication-cost intelligence, Google Scholar readiness, scholarly metadata and post-publication discoverability.</p>
              <div className={styles.actions}>
                <a className={styles.primary} href="#services">Explore publishing services →</a>
                <a className={styles.secondary} href="#scholar">Google Scholar strategy</a>
              </div>
            </div>

            <aside className={styles.heroCard}>
              <div className={styles.eyebrow} style={{ color: "#55dda3" }}>THE COMPLETE PUBLISHING WORKFLOW</div>
              <h3>From author intake to discoverable scholarly record</h3>
              <div className={styles.flow}>
                <div className={styles.flowItem}><span className={styles.flowNum}>1</span><div><strong>Assess the manuscript</strong><span>Identify technical, structural, language, ethics and compliance weaknesses.</span></div></div>
                <div className={styles.flowItem}><span className={styles.flowNum}>2</span><div><strong>Find and verify journals</strong><span>Match scope, inspect registry signals and verify current fee/indexing claims.</span></div></div>
                <div className={styles.flowItem}><span className={styles.flowNum}>3</span><div><strong>Prepare the submission</strong><span>Formatting, references, declarations, cover letter and technical checklist.</span></div></div>
                <div className={styles.flowItem}><span className={styles.flowNum}>4</span><div><strong>Engineer discoverability</strong><span>Scholar metadata, DOI/ORCID alignment, crawlability, repositories and monitoring.</span></div></div>
              </div>
            </aside>
          </div>
        </section>

        <div className={styles.trust}>
          <span>Publishing intelligence combines evidence from</span><strong>OpenAlex</strong><strong>Crossref</strong><strong>DOAJ signals</strong><strong>Google Scholar technical guidance</strong><span>plus official journal-policy verification.</span>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div className={styles.eyebrow}>WHAT PUBLISHAI DOES</div>
              <h2>A full technical publishing partner built for African research and global visibility</h2>
              <p>The platform is designed to give a professional publisher an operational edge while helping authors navigate manuscript quality, reputable publication, indexing readiness and research discoverability from one workflow.</p>
            </div>
            <div className={styles.cards}>
              <article className={styles.card}><div className={styles.icon}>AI</div><h3>AI-Assisted Technical Review</h3><p>Rapidly identify manuscript-readiness issues, priority corrections and the technical work needed before submission.</p></article>
              <article className={styles.card}><div className={styles.icon}>◎</div><h3>Journal Discovery</h3><p>Find journals publishing related scholarship and filter candidates by open-access, APC and citation signals.</p></article>
              <article className={styles.card}><div className={styles.icon}>✓</div><h3>Journal Verification</h3><p>Screen ISSN, publisher, registry presence, DOI metadata and OA evidence before clients submit or pay.</p></article>
              <article className={styles.card}><div className={styles.icon}>G</div><h3>Google Scholar Readiness</h3><p>Map a client-specific strategy for article metadata, crawlability, full text, repository routes and post-publication troubleshooting.</p></article>
              <article className={styles.card}><div className={styles.icon}>ID</div><h3>Research Identity & Metadata</h3><p>Align author name, affiliation, ORCID, DOI and canonical publication data across the scholarly record.</p></article>
              <article className={styles.card}><div className={styles.icon}>↗</div><h3>Visibility Monitoring</h3><p>Track exact-title discovery, site coverage, metadata parsing and legitimate post-publication visibility routes.</p></article>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`} id="services">
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <div className={styles.eyebrow}>PREMIUM TECHNICAL SERVICES</div>
              <h2>Professional services the publisher can package for each client</h2>
              <p>The private publishing engine maps the services a client actually needs from manuscript preparation through journal submission and research visibility, allowing the publisher to offer higher-value technical packages instead of one-size-fits-all editing.</p>
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
              <h2>A client-specific publishing pathway from intake to discoverability</h2>
            </div>
            <div className={styles.steps}>
              <article className={styles.step}><span>STEP 01</span><h3>Author & Manuscript Intake</h3><p>Capture the client's name, affiliation, ORCID, manuscript, publication stage, target journal and desired outcome.</p></article>
              <article className={styles.step}><span>STEP 02</span><h3>Technical Diagnosis</h3><p>The engine identifies structural, language, reference, ethics, compliance and submission-readiness issues.</p></article>
              <article className={styles.step}><span>STEP 03</span><h3>Publication Strategy</h3><p>Relevant journals are discovered and screened. Scope, fees, reputation, access model and current claims are verified.</p></article>
              <article className={styles.step}><span>STEP 04</span><h3>Visibility & Monitoring</h3><p>For published or accepted work, build the metadata, Scholar-readiness, DOI/ORCID, repository and monitoring roadmap.</p></article>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`} id="scholar">
          <div className={`${styles.sectionInner} ${styles.journalPanel}`}>
            <div className={styles.journalVisual}>
              <h3>Google Scholar Visibility Engine</h3>
              <div className={styles.journalRows}>
                <div className={styles.journalRow}><strong>1. Author Identity</strong><span>Name consistency, affiliation and ORCID linkage.</span></div>
                <div className={styles.journalRow}><strong>2. Venue Evidence</strong><span>Check reputable-journal evidence and sample recent Scholar coverage.</span></div>
                <div className={styles.journalRow}><strong>3. Scholar Metadata</strong><span>Title, authors, date, journal, DOI and Highwire citation metadata.</span></div>
                <div className={styles.journalRow}><strong>4. Article Architecture</strong><span>One stable URL per article, complete visible abstract and searchable full text.</span></div>
                <div className={styles.journalRow}><strong>5. Crawlability</strong><span>Robots access, simple HTML links, HTTP health and redirects.</span></div>
                <div className={styles.journalRow}><strong>6. Distribution</strong><span>Legitimate repository/self-archiving routes where rights permit.</span></div>
                <div className={styles.journalRow}><strong>7. Metadata Alignment</strong><span>DOI, ORCID, journal page, PDF and repository record consistency.</span></div>
                <div className={styles.journalRow}><strong>8. Monitoring</strong><span>Exact-title searches, site coverage, parsing checks and troubleshooting.</span></div>
              </div>
            </div>
            <div>
              <div className={styles.eyebrow}>WHEN A CLIENT SAYS “I WANT IT ON GOOGLE SCHOLAR”</div>
              <h2 style={{ fontSize: "38px", margin: "10px 0 14px" }}>Give the client a technical strategy—not an indexing promise.</h2>
              <p className={styles.lead} style={{ fontSize: "15px" }}>Google Scholar uses automated systems to crawl and interpret scholarly material. PublishAI helps the publisher engineer the conditions Google documents for discoverability: scholarly content, stable article URLs, visible abstracts, machine-readable bibliographic metadata, searchable full text and crawler access.</p>
              <div className={styles.bullets}>
                <div className={styles.bullet}><b>✓</b><span>Create a personalized Scholar-readiness score and 8-phase action map.</span></div>
                <div className={styles.bullet}><b>✓</b><span>Generate the metadata and technical checklist the article page should satisfy.</span></div>
                <div className={styles.bullet}><b>✓</b><span>Map institutional-repository or permitted self-archiving routes for additional legitimate discovery.</span></div>
                <div className={styles.bullet}><b>✓</b><span>Monitor exact-title and site-level Scholar coverage after publication and diagnose common crawl/parsing problems.</span></div>
                <div className={styles.bullet}><b>!</b><span>Google controls inclusion, timing and ranking; no ethical service can guarantee a Scholar listing or fixed indexing date.</span></div>
              </div>
              <div className={styles.actions}><a className={styles.primary} href="/admin">Publisher: build a client strategy</a></div>
            </div>
          </div>
        </section>

        <section className={styles.section} id="journals">
          <div className={`${styles.sectionInner} ${styles.journalPanel}`}>
            <div className={styles.journalVisual}>
              <h3>Journal Intelligence Layer</h3>
              <div className={styles.journalRows}>
                <div className={styles.journalRow}><strong>Global Journal Finder</strong><span>Topic-based discovery across scholarly sources.</span></div>
                <div className={styles.journalRow}><strong>Open Access & APC Signals</strong><span>Separate zero-APC evidence, known APCs and unknown fee data.</span></div>
                <div className={styles.journalRow}><strong>Journal Guard</strong><span>Registry evidence and caution flags for suspicious journal claims.</span></div>
                <div className={styles.journalRow}><strong>Curated Journal Directory</strong><span>Cross-disciplinary candidates with evidence-aware status labels.</span></div>
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
              <div className={styles.ethicsBox}><h3>What the platform supports</h3><ul><li>Language clarity and technical editing.</li><li>Journal matching and evidence-based screening.</li><li>Formatting, references and author-guideline preparation.</li><li>Google Scholar eligibility/readiness and discoverability strategy.</li><li>DOI, ORCID, metadata, repository and post-publication monitoring support.</li></ul></div>
              <div className={styles.ethicsBox}><h3>What it does not promise</h3><ul><li>No guaranteed publication or acceptance.</li><li>No guaranteed Google Scholar inclusion, ranking or indexing date.</li><li>No fabricated findings, data, citations or peer reviews.</li><li>No invented impact factors, indexing, fees or turnaround times.</li><li>No replacement for author responsibility, editorial judgment or official journal requirements.</li></ul></div>
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}><div className={styles.eyebrow}>FREQUENT QUESTIONS</div><h2>What authors should know before using the service</h2></div>
            <div className={styles.faq}>
              <div className={styles.faqItem}><strong>Can you make my article appear in Google Scholar?</strong><p>PublishAI can optimize the factors a publisher or author controls—article structure, machine-readable metadata, stable URLs, searchable full text, crawler access and legitimate repository routes. Google ultimately controls Scholar inclusion and timing, so the service does not promise guaranteed indexing.</p></div>
              <div className={styles.faqItem}><strong>Does PublishAI submit articles directly to journals?</strong><p>The core service prepares the manuscript and submission strategy. Actual submission should use the official journal submission system and remain under the author's or authorized publisher's control.</p></div>
              <div className={styles.faqItem}><strong>Can the platform guarantee a journal is free?</strong><p>No static list can safely guarantee that forever. Fee policies change, so PublishAI labels uncertainty and requires current policy verification before payment or submission.</p></div>
              <div className={styles.faqItem}><strong>Who is the platform for?</strong><p>Researchers, lecturers, postgraduate students, research teams and publishers—especially across Africa—who need stronger technical preparation, better journal decisions and more disciplined global research discoverability.</p></div>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className={styles.ctaInner}>
            <div className={styles.eyebrow} style={{ color: "#53d99f" }}>FROM AFRICAN RESEARCH TO GLOBAL DISCOVERABILITY</div>
            <h2>Strong research deserves professional preparation and a visible scholarly record.</h2>
            <p>Use Mabrig PublishAI to prepare the manuscript, identify reputable publication routes and build a technically sound strategy for post-publication discoverability.</p>
            <div className={styles.actions} style={{ justifyContent: "center" }}><a className={styles.primary} href="/free-journals">Explore journals</a><a className={styles.secondary} href="#scholar">Scholar visibility strategy</a></div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}><p>© 2026 Mabrig PublishAI · Africa-first academic publishing intelligence and technical support.</p><div className={styles.miniLinks}><a href="#services">Services</a><a href="#scholar">Google Scholar</a><a href="/free-journals">Journal Directory</a><a href="#ethics">Responsible AI</a><a href="/admin">Publisher Login</a></div></div>
      </footer>
    </div>
  );
}
