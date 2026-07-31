/*
  THESIS: A visual CV with the charge of a live demo day, not a portfolio template.
  OWN-WORLD: Real stage photography, production rules, cold paper, black, and one chartreuse signal.
  STORY: Lucas now, then the chronological proof, then selected work and a direct contact.
  FIRST VIEWPORT: His name resolves into the TU/e Contest stage image and immediately states what he is building.
  FORM: Seed 02548378. Grounded direction 6, Backstage Credential, staged as one processional axis.
*/

import Image from 'next/image';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header frame">
        <a className="monogram" href="#top" aria-label="LD, Lucas Duys home">LD</a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#now">Now</a>
          <a href="#experience">Experience</a>
          <a href="#work">Work</a>
        </nav>
        <a className="header-contact" href="mailto:lucas.duys@gmail.com">Email</a>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-intro frame">
            <div className="hero-meta" aria-label="Profile summary">
              <span>Founder / AI engineer</span>
              <span>Building in stealth</span>
              <span>Eindhoven, Netherlands</span>
            </div>
            <h1 id="hero-title">
              <span>Lucas</span>
              <span>Duys</span>
            </h1>
          </div>

          <figure className="hero-stage">
            <picture>
              <source media="(max-width: 680px)" srcSet="/images/me/stage-pitch-900.avif" type="image/avif" />
              <source srcSet="/images/me/stage-pitch-1800.avif" type="image/avif" />
              {/* The static export uses explicit AVIF sources instead of a runtime image optimizer. */}
              <img
                src="/images/me/stage-pitch.jpg"
                alt="Lucas pitching Stacklink on stage at the TU/e Contest 2026 finale"
                width={2048}
                height={1152}
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <figcaption>
              <span>TU/e Contest 2026</span>
              <span>First Runner-Up, 2nd of 70</span>
            </figcaption>
          </figure>

          <div className="hero-handoff frame">
            <p>Founder and engineer building AI systems that hold up outside the demo.</p>
            <a href="#experience">Read the CV</a>
          </div>
        </section>

        <section className="now dark-surface" id="now" aria-labelledby="now-title">
          <div className="frame now-grid">
            <div className="section-label">Current chapter</div>
            <div className="now-copy">
              <h2 id="now-title">Building in stealth.</h2>
              <p>
                I am starting a company at the intersection of AI, product, and systems.
                The details stay private for now. The work does not.
              </p>
            </div>
            <div className="antler-note">
              <p className="note-title">Antler ONE / September 2026</p>
              <p>
                Selected for Antler&apos;s residency, joining roughly 100 founders chosen
                from about 10,000 applicants.
              </p>
              <a href="https://www.antler.co/continental-europe">
                About the program <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <a
            className="forge-line frame"
            href="https://github.com/LucasDuys/forge"
          >
            <span>Also building</span>
            <strong>Forge</strong>
            <span>One idea to a tested, reviewed, committed branch.</span>
            <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section className="experience dark-surface" id="experience" aria-labelledby="experience-title">
          <div className="frame">
            <header className="section-heading">
              <p>Experience</p>
              <h2 id="experience-title">The CV, with receipts.</h2>
            </header>

            <ol className="experience-list">
              <li>
                <p className="period">Now</p>
                <div className="role">
                  <h3>Founder / AI engineer</h3>
                  <p>Stealth startup</p>
                </div>
                <div className="role-detail">
                  <p>Building a new AI company and joining Antler ONE in September 2026.</p>
                  <p className="working-set">Product / AI systems / Engineering</p>
                </div>
              </li>

              <li>
                <p className="period">2026</p>
                <div className="role">
                  <h3>AI engineering intern</h3>
                  <p><a href="https://cape.io">Cape.io <span aria-hidden="true">↗</span></a></p>
                </div>
                <div className="role-detail">
                  <p>Rebuilt agent pipelines around measurable speed, accuracy, cost, and permission boundaries.</p>
                  <div className="evidence-pair" aria-label="Cape engineering outcomes">
                    <p><strong>190k <span aria-hidden="true">→</span> 1.2k</strong><span>tokens per run, more than 99% less</span></p>
                    <p><strong>20 <span aria-hidden="true">→</span> 10,000</strong><span>inputs, from 55s to about 8s at 98% accuracy</span></p>
                  </div>
                  <p className="working-set">Python / TypeScript / Agents / LangSmith</p>
                </div>
              </li>

              <li>
                <p className="period">2026</p>
                <div className="role">
                  <h3>Co-founder</h3>
                  <p><a href="https://stacklink.nl">Stacklink <span aria-hidden="true">↗</span></a></p>
                </div>
                <div className="role-detail">
                  <p>Built an EU-sovereign, permission-aware knowledge layer for governed AI agents.</p>
                  <ul className="proof-list">
                    <li>
                      <strong>2nd / 70</strong>
                      <span>
                        €3,000 First Runner-Up at the{' '}
                        <a href="https://tuecontest.nl/">TU/e Contest</a>
                      </span>
                    </li>
                    <li>
                      <strong>€2,500</strong>
                      <span>
                        <a href="https://thegate.tech/">The Gate</a>{' '}
                        grant at <a href="https://www.kickoffehv.nl/">Kickoff EHV</a>
                      </span>
                    </li>
                  </ul>
                  <p className="working-set">TypeScript / Go / Postgres / RAG / ACLs</p>
                </div>
              </li>

              <li>
                <p className="period">2024 to now</p>
                <div className="role">
                  <h3>BSc Computer Science &amp; Engineering</h3>
                  <p>TU Eindhoven</p>
                </div>
                <div className="role-detail">
                  <p>Studying computer science with a focus on AI systems, while building products in public and under pressure.</p>
                  <p className="working-set">Computer science / AI / Systems</p>
                </div>
              </li>

              <li>
                <p className="period">2026</p>
                <div className="role">
                  <h3>Hackathon builder</h3>
                  <p>Paris / Amsterdam</p>
                </div>
                <div className="role-detail">
                  <p>Built Pitchr.live in 24 hours at HackEurope Paris, then a five-agent grocery system in 6 hours at Hackaway, selected to pitch from 80 builders.</p>
                  <p className="working-set">Next.js / Claude / ElevenLabs / Multi-agent systems</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="photo-proof dark-surface" aria-label="Stacklink event photography">
          <div className="photo-proof-grid">
            <figure>
              <Image
                src="/images/me/cofounders.jpg"
                alt="Lucas and his Stacklink co-founder at the TU/e Contest"
                width={2048}
                height={1365}
                sizes="(max-width: 760px) 100vw, 58vw"
              />
              <figcaption>Stacklink co-founders / TU/e Contest 2026</figcaption>
            </figure>
            <figure>
              <Image
                src="/images/me/award.jpg"
                alt="Lucas receiving the TU/e Contest First Runner-Up award"
                width={2048}
                height={1152}
                sizes="(max-width: 760px) 100vw, 42vw"
              />
              <figcaption>First Runner-Up / €3,000</figcaption>
            </figure>
          </div>
        </section>

        <section className="work paper-surface" id="work" aria-labelledby="work-title">
          <div className="frame">
            <header className="section-heading ink-heading">
              <p>Selected work</p>
              <h2 id="work-title">Systems shipped, not mockups.</h2>
            </header>

            <article className="work-feature cape-feature">
              <div className="work-copy">
                <p className="work-type">Enterprise AI / 2026</p>
                <h3>Cape.io</h3>
                <p>Agent infrastructure rebuilt for scale, accuracy, and strict permission boundaries.</p>
                <a href="https://cape.io">Visit Cape.io <span aria-hidden="true">↗</span></a>
              </div>
              <Image
                src="/images/projects/cape-live.jpg"
                alt="Cape.io website"
                width={1538}
                height={784}
                sizes="(max-width: 760px) 100vw, 65vw"
              />
            </article>

            <article className="work-feature stacklink-feature">
              <div className="work-copy">
                <p className="work-type">Agentic infrastructure / 2026</p>
                <h3>Stacklink</h3>
                <p>
                  A governed knowledge layer for AI agents, designed for customer-owned
                  infrastructure and air-gapped deployment.
                </p>
                <a href="https://stacklink.nl">Visit Stacklink <span aria-hidden="true">↗</span></a>
              </div>
              <Image
                className="stacklink-hero"
                src="/images/projects/sl-hero.png"
                alt="Stacklink product interface"
                width={1600}
                height={952}
                sizes="(max-width: 760px) 100vw, 72vw"
              />
              <div className="stacklink-gallery" aria-label="Stacklink product views">
                <Image src="/images/projects/sl-cited.png" alt="Stacklink answer with cited sources" width={1600} height={884} sizes="(max-width: 760px) 100vw, 38vw" />
                <Image src="/images/projects/sl-file.png" alt="Stacklink file knowledge view" width={1600} height={889} sizes="(max-width: 760px) 100vw, 38vw" />
                <Image src="/images/projects/sl-sql.png" alt="Stacklink SQL connector view" width={1600} height={884} sizes="(max-width: 760px) 100vw, 38vw" />
                <Image src="/images/projects/sl-watch.png" alt="Stacklink agent activity view" width={1600} height={889} sizes="(max-width: 760px) 100vw, 38vw" />
              </div>
            </article>

            <div className="work-pair">
              <article className="work-small pitchr-feature">
                <Image
                  src="/images/projects/pitchr-live.jpg"
                  alt="Pitchr.live AI pitch coach"
                  width={1538}
                  height={784}
                  sizes="(max-width: 760px) 100vw, 48vw"
                />
                <div className="work-copy">
                  <p className="work-type">24 hour build / Paris</p>
                  <h3>Pitchr.live</h3>
                  <p>Rubric scoring, rewritten scripts, and mock investor Q&amp;A in one AI pitch coach.</p>
                  <a href="https://pitchr.live">Visit Pitchr.live <span aria-hidden="true">↗</span></a>
                </div>
              </article>

              <article className="work-small hackaway-feature">
                <Image
                  src="/images/projects/hackaway-demo.jpg"
                  alt="Weekly Shop Agent assembling a Picnic grocery cart"
                  width={1920}
                  height={1080}
                  sizes="(max-width: 760px) 100vw, 43vw"
                />
                <div className="work-copy">
                  <p className="work-type">6 hour build / Amsterdam</p>
                  <h3>Weekly Shop Agent</h3>
                  <p>Five agents negotiate meals, dietary needs, and budget to assemble a weekly grocery order.</p>
                  <a href="https://github.com/LucasDuys/hackaway-grocery-agent">View the code <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="capabilities paper-surface" aria-labelledby="capabilities-title">
          <div className="frame capabilities-grid">
            <header>
              <p>Working set</p>
              <h2 id="capabilities-title">What I build with.</h2>
            </header>
            <dl>
              <div><dt>AI systems</dt><dd>Agents, RAG, evaluations, permissions, tool use</dd></div>
              <div><dt>Engineering</dt><dd>TypeScript, Python, Go, React, Next.js, Postgres</dd></div>
              <div><dt>Product</dt><dd>Rapid prototyping, interaction design, testing, shipping</dd></div>
            </dl>
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="frame contact-grid">
            <p>Good people, hard problems.</p>
            <h2 id="contact-title">Let&apos;s talk.</h2>
            <a className="contact-email" href="mailto:lucas.duys@gmail.com">
              lucas.duys@gmail.com <span aria-hidden="true">↗</span>
            </a>
            <nav aria-label="Social links">
              <a href="https://www.linkedin.com/in/lucas-duys/">LinkedIn <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/LucasDuys">GitHub <span aria-hidden="true">↗</span></a>
            </nav>
          </div>
        </section>
      </main>
    </>
  );
}
