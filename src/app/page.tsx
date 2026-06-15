'use client';

import { motion } from 'framer-motion';

/* ── Stacklink-brand palette (light) ──────────────────────────────
   white-ish canvas, near-black slate ink, brand blue accent,
   green for "live / in pilot", cool light borders.                  */
const BG = '#FBFBFD';
const INK = '#0E0E14';
const ACCENT = '#2F62DC'; // deep brand blue — buttons/links
const ACCENT_SOFT = '#5E8FF3'; // brand periwinkle — halos/highlights
const GREEN = '#16A34A'; // live / in-pilot status
const LINE = '#E6E6EC';
const MUTED = '#6A6A75';

const EASE = [0.22, 1, 0.36, 1] as const; // entrance
const MORPH = [0.32, 0.72, 0.34, 1] as const; // "physical arrival"

/* ── Job-hunt switch ──────────────────────────────────────────────
   Flip OPEN_TO_WORK to true when you're job-hunting: it reveals an
   "open to" line in the hero and a "Download CV" button (drop the PDF
   at /public/cv.pdf). Leave false the rest of the time.             */
const OPEN_TO_WORK = false;
const OPEN_TO_ROLES = 'AI & full-stack engineering roles and internships';
const CV_URL = '/cv.pdf';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const CONNECTORS = [
  ['Google Drive', 'google-drive'],
  ['Slack', 'slack'],
  ['Notion', 'notion'],
  ['GitHub', 'github-dark'],
  ['Gmail', 'gmail'],
  ['Calendar', 'google-calendar'],
  ['Postgres', 'postgresql'],
  ['Teams', 'microsoft-teams'],
  ['Salesforce', 'salesforce'],
  ['Linear', 'linear'],
  ['Dropbox', 'dropbox'],
  ['GitLab', 'gitlab'],
];

function SectionLabel({ children, n }: { children: React.ReactNode; n: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.18em] uppercase" style={{ color: ACCENT }}>
        {n}
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[12px] tracking-[0.18em] uppercase" style={{ color: MUTED }}>
        {children}
      </span>
      <span className="h-px flex-1" style={{ backgroundColor: LINE }} />
    </div>
  );
}

function ConnectorChip({ name, file }: { name: string; file: string }) {
  return (
    <span className="flex shrink-0 items-center gap-2.5 rounded-full py-2 pl-2.5 pr-4" style={{ border: `1px solid ${LINE}`, backgroundColor: '#fff' }}>
      <img src={`/images/connectors/${file}.svg`} alt="" className="h-5 w-5" />
      <span className="text-[13.5px]" style={{ color: INK }}>
        {name}
      </span>
    </span>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-clip font-[family-name:var(--font-sans)] antialiased" style={{ backgroundColor: BG, color: INK }}>
      <style>{`@keyframes sl-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* European-light glassy halo backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[820px]"
        style={{
          backgroundImage: [
            'radial-gradient(60% 55% at 12% 6%, hsl(186 72% 86% / 0.55), transparent 70%)',
            'radial-gradient(55% 52% at 92% 10%, hsl(222 92% 90% / 0.60), transparent 66%)',
            'radial-gradient(46% 44% at 86% 92%, hsl(22 85% 92% / 0.40), transparent 72%)',
            'radial-gradient(78% 52% at 24% 100%, hsl(196 64% 90% / 0.42), transparent 76%)',
          ].join(', '),
        }}
      />

      {/* ============ NAV ============ */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(251,251,253,0.78)', borderBottom: `1px solid ${LINE}` }}>
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4 lg:px-10">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md text-[13px] font-semibold text-white" style={{ backgroundColor: INK }}>
              LD
            </span>
            <span className="text-[15px] font-medium tracking-tight">Lucas Duys</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {[
              ['Stacklink', '#stacklink'],
              ['Work', '#work'],
              ['About', '#about'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="text-[14px] transition-colors hover:text-[color:var(--accent)]" style={{ color: MUTED, ['--accent' as string]: ACCENT }}>
                {label}
              </a>
            ))}
          </nav>
          <a href="#contact" className="rounded-full px-4 py-2 text-[13px] font-medium text-white transition-transform hover:-translate-y-px" style={{ backgroundColor: INK }}>
            Get in touch
          </a>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section id="top" className="relative mx-auto max-w-[1180px] px-6 pt-16 lg:px-10 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
          <motion.div initial="hidden" animate="show" variants={fadeUp} transition={{ duration: 0.7, ease: EASE }}>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full px-3 py-1.5" style={{ border: `1px solid ${LINE}`, backgroundColor: '#fff' }}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ backgroundColor: GREEN }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: GREEN }} />
              </span>
              <span className="text-[12.5px]" style={{ color: MUTED }}>
                Co-founder, Stacklink — in pilot with enterprise
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: EASE }}
              className="text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[58px] lg:text-[68px]"
            >
              Lucas Duys
            </motion.h1>
            <p className="mt-4 max-w-[32ch] text-[20px] leading-[1.45] sm:text-[22px]" style={{ color: MUTED }}>
              I build AI infrastructure that lets European companies put their own data to work —
              securely, on their own servers, or fully air-gapped.
            </p>

            {OPEN_TO_WORK && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px]" style={{ border: `1px solid ${LINE}`, backgroundColor: '#fff', color: INK }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
                Open to {OPEN_TO_ROLES}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#stacklink" className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium text-white transition-transform hover:-translate-y-px" style={{ backgroundColor: ACCENT }}>
                See Stacklink
                <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
              </a>
              {OPEN_TO_WORK && (
                <a href={CV_URL} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium text-white transition-transform hover:-translate-y-px" style={{ backgroundColor: INK }}>
                  Download CV
                </a>
              )}
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium transition-colors hover:bg-white" style={{ border: `1px solid ${LINE}`, color: INK }}>
                Contact
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--font-mono)] text-[12.5px]" style={{ color: MUTED }}>
              <span>Eindhoven, NL</span>
              <span className="hidden sm:inline" style={{ color: LINE }}>/</span>
              <span>AI Engineering Intern @ cape.io</span>
              <span className="hidden sm:inline" style={{ color: LINE }}>/</span>
              <span>CS &amp; Engineering, TU Eindhoven</span>
            </div>
          </motion.div>

          {/* headshot — opening image */}
          <motion.figure
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: MORPH }}
            className="relative mx-auto w-full max-w-[420px] lg:mx-0 lg:ml-auto"
          >
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[32px] blur-2xl" style={{ background: `radial-gradient(60% 60% at 50% 40%, ${ACCENT_SOFT}33, transparent 70%)` }} />
            <div className="overflow-hidden rounded-[20px]" style={{ boxShadow: '0 36px 70px -30px rgba(14,14,20,0.42)', border: `1px solid ${LINE}` }}>
              <img src="/images/me/headshot.jpg" alt="Lucas Duys" className="aspect-square w-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2.5" style={{ border: `1px solid ${LINE}`, boxShadow: '0 18px 36px -22px rgba(14,14,20,0.45)' }}>
              <img src="/images/projects/stacklink-logo.svg" alt="Stacklink" className="h-5 w-auto" />
              <div className="leading-tight">
                <div className="text-[12.5px] font-medium">Co-founder</div>
                <div className="text-[11px]" style={{ color: MUTED }}>Stacklink</div>
              </div>
            </div>
          </motion.figure>
        </div>

        {/* trust row */}
        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] sm:grid-cols-4" style={{ backgroundColor: LINE, border: `1px solid ${LINE}` }}>
          {[
            ['Pilot', 'with the 2nd-largest company in NL'],
            ['60+', 'companies in the sales pipeline'],
            ['1st', 'Runner-Up, TU/e Contest 2026'],
            ['~99%', 'agent token cut at cape.io'],
          ].map(([big, small]) => (
            <div key={big} className="px-5 py-6" style={{ backgroundColor: BG }}>
              <div className="text-[30px] font-semibold tracking-tight" style={{ color: ACCENT }}>{big}</div>
              <div className="mt-1 text-[13px] leading-snug" style={{ color: MUTED }}>{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ STACKLINK CASE STUDY ============ */}
      <section id="stacklink" className="mx-auto max-w-[1180px] px-6 pt-28 lg:px-10">
        <SectionLabel n="01">Flagship</SectionLabel>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <img src="/images/projects/stacklink-logo.svg" alt="Stacklink" className="h-7 w-auto" />
              <span className="text-[15px] font-medium tracking-tight">Stacklink</span>
            </div>

            <h2 className="mt-6 text-[34px] font-semibold leading-[1.08] tracking-[-0.02em] sm:text-[42px]">
              An EU-sovereign runtime for AI on company data.
            </h2>

            <div className="mt-8 space-y-7">
              <div>
                <h3 className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>The problem</h3>
                <p className="mt-2 text-[16.5px] leading-[1.6]" style={{ color: INK }}>
                  European companies sit on years of internal knowledge but can&apos;t hand it to a
                  foreign cloud model — for legal, security, and sovereignty reasons. So most of that
                  data never reaches AI at all.
                </p>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>What it is</h3>
                <p className="mt-2 text-[16.5px] leading-[1.6]" style={{ color: INK }}>
                  A permission-aware knowledge layer that sits beneath a company&apos;s apps and above
                  any model. It mounts connectors — Drive, Slack, Notion, GitHub, Gmail, Postgres — so
                  governed agents can act on company data on the customer&apos;s own GPUs, or fully
                  air-gapped, with a hash-chained, tamper-evident audit log and EU AI Act documentation.
                </p>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>Under the hood</h3>
                <p className="mt-2 text-[16.5px] leading-[1.6]" style={{ color: MUTED }}>
                  A 60+ package TypeScript monorepo, 8 deployable services (TS/Go/Python),
                  hybrid-retrieval RAG on Postgres/pgvector — BM25 + HNSW + reciprocal-rank fusion,
                  ACL pre-filter and post-check, with reranking.
                </p>
              </div>
            </div>

            <a href="https://stacklink.nl" target="_blank" rel="noreferrer" className="group mt-9 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium text-white transition-transform hover:-translate-y-px" style={{ backgroundColor: INK }}>
              Visit stacklink.nl
              <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </a>
          </div>

          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: MORPH }}
            className="relative lg:sticky lg:top-24 lg:self-start"
          >
            <div className="overflow-hidden rounded-[16px]" style={{ boxShadow: '0 40px 80px -36px rgba(14,14,20,0.45)', border: `1px solid ${LINE}` }}>
              <img src="/images/me/stage-pitch.jpg" alt="Lucas presenting Stacklink on stage at the TU/e Contest finals" className="aspect-[16/10] w-full object-cover" />
            </div>
            <figcaption className="mt-3 text-center font-[family-name:var(--font-mono)] text-[11.5px]" style={{ color: MUTED }}>
              Presenting Stacklink — TU/e Contest finals
            </figcaption>
          </motion.figure>
        </div>

        {/* connectors marquee */}
        <div className="mt-16">
          <p className="mb-5 font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
            Mounts the tools companies already use
          </p>
          <div className="relative flex overflow-hidden" style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)' }}>
            <div className="flex shrink-0 items-center gap-3 pr-3" style={{ animation: 'sl-marquee 36s linear infinite' }}>
              {CONNECTORS.map(([name, file]) => (
                <ConnectorChip key={`a-${file}`} name={name} file={file} />
              ))}
              {CONNECTORS.map(([name, file]) => (
                <ConnectorChip key={`b-${file}`} name={name} file={file} />
              ))}
            </div>
          </div>
        </div>

        {/* product gallery */}
        <div className="mt-12">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ['/images/projects/sl-cited.png', 'Cited answers'],
              ['/images/projects/sl-file.png', 'File-grounded'],
              ['/images/projects/sl-sql.png', 'SQL on data'],
              ['/images/projects/sl-watch.png', 'Audit trail'],
            ].map(([src, label]) => (
              <figure key={src} className="overflow-hidden rounded-[12px] p-1.5" style={{ backgroundColor: '#101014', border: '1px solid #23232A' }}>
                <img src={src} alt={label} className="aspect-[16/11] w-full rounded-[7px] object-cover" />
                <figcaption className="px-2 py-2 font-[family-name:var(--font-mono)] text-[11px] text-white/60">{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CREDIBILITY STRIP ============ */}
      <section className="mx-auto max-w-[1180px] px-6 pt-24 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            ['/images/me/cofounders.jpg', 'The founding team', 'Lucas (right) & co-founder', 'Lucas with his Stacklink co-founder at the TU/e Contest'],
            ['/images/me/award.jpg', 'First Runner-Up', 'TU/e Contest 2026 finals', 'First Runner-Up at the TU/e Contest 2026 finals'],
          ].map(([src, title, sub, alt]) => (
            <figure key={src} className="group relative overflow-hidden rounded-[14px]" style={{ border: `1px solid ${LINE}` }}>
              <img src={src} alt={alt} className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-x-0 bottom-0 p-5" style={{ background: 'linear-gradient(to top, rgba(14,14,20,0.78), transparent)' }}>
                <p className="text-[14px] font-medium text-white">{title}</p>
                <p className="text-[12.5px] text-white/70">{sub}</p>
              </div>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ ALSO / OTHER WORK ============ */}
      <section id="work" className="mx-auto max-w-[1180px] px-6 pt-28 lg:px-10">
        <SectionLabel n="02">Also building &amp; shipping</SectionLabel>

        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[14px] md:grid-cols-3" style={{ backgroundColor: LINE, border: `1px solid ${LINE}` }}>
          {[
            {
              name: 'cape.io',
              role: 'AI Engineering Intern',
              body: 'Cut agent token usage ~99% (190k → 1.2k per run). Rebuilt a pipeline from 20 inputs in 55s at <50% accuracy to 10k inputs in ~8s at 98%. Built a permission-aware tool layer authorizing every agent action per call.',
              href: 'https://cape.io',
              link: 'cape.io',
            },
            {
              name: 'Pitchr.live',
              role: 'Built in 24h — HackEurope Paris, Station F',
              body: 'An AI pitch coach for founders: record your pitch and get rubric-scored feedback across 5 dimensions, a rewritten script, and a mock Q&A with an AI investor.',
              href: 'https://pitchr.live',
              link: 'pitchr.live',
            },
            {
              name: 'Weekly Shop Agent',
              role: 'Hackaway × Picnic — built in 6h',
              body: 'Five AI agents collaborating through a DAG to turn one sentence into a full weekly grocery order — meal planning, budget negotiation, dietary intelligence. Selected to pitch out of 80 builders at AI House Amsterdam.',
              href: null,
              link: null,
            },
          ].map((p) => (
            <motion.div
              key={p.name}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-col p-7"
              style={{ backgroundColor: BG }}
            >
              <h3 className="text-[20px] font-semibold tracking-tight">{p.name}</h3>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-[0.08em]" style={{ color: ACCENT }}>{p.role}</p>
              <p className="mt-4 flex-1 text-[14.5px] leading-[1.6]" style={{ color: MUTED }}>{p.body}</p>
              {p.href && (
                <a href={p.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium transition-colors" style={{ color: INK }}>
                  {p.link} <span aria-hidden>&rarr;</span>
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {['TypeScript', 'Python', 'Go', 'React / Next.js', 'RAG & hybrid retrieval', 'Multi-agent systems', 'Postgres / pgvector', 'LLM & agent engineering', 'LangSmith / LangChain'].map((s) => (
            <span key={s} className="rounded-full px-3.5 py-1.5 text-[13px]" style={{ border: `1px solid ${LINE}`, backgroundColor: '#fff', color: MUTED }}>{s}</span>
          ))}
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="mx-auto max-w-[1180px] px-6 pt-28 lg:px-10">
        <SectionLabel n="03">About</SectionLabel>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[200px_minmax(0,1fr)] sm:gap-14">
          <div>
            <div className="overflow-hidden rounded-[14px]" style={{ border: `1px solid ${LINE}`, boxShadow: '0 20px 40px -28px rgba(14,14,20,0.4)' }}>
              <img src="/images/me/headshot.jpg" alt="Lucas Duys" className="aspect-square w-full object-cover" />
            </div>
          </div>
          <div className="max-w-[60ch]">
            <p className="text-[20px] leading-[1.55] sm:text-[23px]">
              I&apos;m a co-founder building AI infrastructure for companies that can&apos;t send their
              data away — and a CS &amp; Engineering student at TU Eindhoven, graduating May 2028.
            </p>
            <p className="mt-5 text-[16px] leading-[1.7]" style={{ color: MUTED }}>
              Most of my time goes to Stacklink, where I work on the agentic runtime, retrieval, and
              the governance layer that makes it usable inside regulated enterprises. Alongside that I
              intern at cape.io on agent efficiency and permission-aware tooling, and I build things at
              hackathons when I can. I care about systems that are correct, fast, and trustworthy —
              not demos that fall over the moment real data shows up.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section id="contact" className="mx-auto mt-28 max-w-[1180px] px-6 lg:px-10">
        <div className="rounded-[20px] px-8 py-14 text-center lg:px-16 lg:py-20" style={{ backgroundColor: INK, color: '#fff' }}>
          <p className="font-[family-name:var(--font-mono)] text-[12px] uppercase tracking-[0.2em]" style={{ color: '#8C8C96' }}>Let&apos;s talk</p>
          <h2 className="mx-auto mt-4 max-w-[18ch] text-[32px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">
            Building, buying, or just curious about sovereign AI?
          </h2>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="mailto:lucas.duys@gmail.com" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-medium transition-transform hover:-translate-y-px" style={{ backgroundColor: '#fff', color: INK }}>
              lucas.duys@gmail.com
            </a>
            <a href="https://www.linkedin.com/in/lucas-duys/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.25)' }}>
              LinkedIn &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="mx-auto max-w-[1180px] px-6 py-10 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-3 border-t pt-7 sm:flex-row sm:items-center" style={{ borderColor: LINE }}>
          <span className="text-[13.5px] font-medium">Lucas Duys</span>
          <span className="font-[family-name:var(--font-mono)] text-[12px]" style={{ color: MUTED }}>Eindhoven, Netherlands</span>
        </div>
      </footer>
    </main>
  );
}
