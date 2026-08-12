/*
  THESIS: A career told as one scroll-driven film, then proven in the record. Refuses the
  static hero over a card grid, and refuses restating the film in the sections below it.
  OWN-WORLD: Midnight navy ground, cold-chrome stage dust in a WebGL point film, one vermilion
  signal, Bricolage display over Manrope, hairline rules, sharp corners, real photography.
  STORY: Dust gathers into the spotlight ring (2nd of 70), rises along the trajectory (Cape,
  500×), seals into the LD mark (Antler ONE), then the real stage photograph lands and the
  ledger, the shipped work, and a direct contact follow.
  FIRST VIEWPORT: Name at display scale lower-left over the breathing dust field, kicker above,
  summary and View experience below, scroll cue and an honest progress rail on the right edge.
  FORM: Kenward film grammar, hand-rolled: 300svh sticky stage, one scroll listener writing CSS
  vars and shader uniforms, render-on-demand points, reduced-motion static cut in pure CSS.
*/

import Image from 'next/image';
import FilmHero from './FilmHero';
import Reveals from './Reveals';

export default function Home() {
  return (
    <>
      <Reveals />
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
        <FilmHero />

        {/* The film's payoff: the abstraction resolves into the real stage. */}
        <section className="stage-proof" aria-label="TU/e Contest 2026 stage photography">
          <figure data-reveal>
            <picture>
              <source media="(max-width: 680px)" srcSet="/images/me/stage-pitch-900.avif" type="image/avif" />
              <source srcSet="/images/me/stage-pitch-1800.avif" type="image/avif" />
              {/* The static export uses explicit AVIF sources instead of a runtime image optimizer. */}
              <img
                src="/images/me/stage-pitch.jpg"
                alt="Lucas pitching Stacklink on stage at the TU/e Contest 2026 finale"
                width={2048}
                height={1152}
                decoding="async"
              />
            </picture>
            <figcaption className="frame">
              <span>Pitching Stacklink at the TU/e Contest 2026</span>
              <strong>First Runner-Up / 2nd of 70</strong>
            </figcaption>
          </figure>
        </section>

        <section className="now" id="now" aria-labelledby="now-title">
          <div className="frame now-grid">
            <p className="section-label" data-reveal>Current chapter</p>
            <div className="now-copy" data-reveal>
              <h2 id="now-title">Building in stealth.</h2>
              <p>
                I am starting a company at the intersection of AI, product, and systems.
                The details stay private for now. The work does not.
              </p>
            </div>
            <div className="antler-note" data-reveal>
              <p className="note-title">Antler ONE / September 2026</p>
              <p>
                Selected for Antler&apos;s September residency to build alongside a
                hand-picked cohort of founders.
              </p>
              <a href="https://www.antler.co/continental-europe">
                About the program <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <a className="forge-line frame" href="https://github.com/LucasDuys/forge" data-reveal>
            <span>Also building</span>
            <strong>Forge</strong>
            <span>One idea to a tested, reviewed, committed branch.</span>
            <span aria-hidden="true">↗</span>
          </a>
        </section>

        <section className="experience" id="experience" aria-labelledby="experience-title">
          <div className="frame">
            <header className="section-heading" data-reveal>
              <p>Experience</p>
              <h2 id="experience-title">Selected experience.</h2>
            </header>

            <ol className="experience-list">
              <li data-reveal>
                <p className="period">Now</p>
                <div className="role">
                  <h3>Founder / AI engineer</h3>
                  <p>Stealth startup</p>
                </div>
                <div className="role-detail">
                  <p className="impact-statement">Building a stealth AI startup ahead of Antler ONE in September 2026.</p>
                  <p className="working-set">Product / AI systems / Engineering</p>
                </div>
              </li>

              <li data-reveal>
                <p className="period">2026</p>
                <div className="role">
                  <h3>AI engineering intern</h3>
                  <p><a href="https://cape.io">Cape.io <span aria-hidden="true">↗</span></a></p>
                </div>
                <div className="role-detail">
                  <p className="impact-statement">500× the input volume, about 7× faster, at 98% accuracy.</p>
                  <p className="role-context">Rebuilt agent pipelines around measurable speed, cost, accuracy, and permission boundaries.</p>
                  <div className="evidence-pair" aria-label="Cape engineering outcomes">
                    <p><strong>190k <span aria-hidden="true">→</span> 1.2k</strong><span>tokens per run, more than 99% less</span></p>
                    <p><strong>20 <span aria-hidden="true">→</span> 10,000</strong><span>inputs, from 55s to about 8s at 98% accuracy</span></p>
                  </div>
                  <p className="working-set">Python / TypeScript / Agents / LangSmith</p>
                </div>
              </li>

              <li data-reveal>
                <p className="period">2026</p>
                <div className="role">
                  <h3>Co-founder</h3>
                  <p><a href="https://stacklink.nl">Stacklink <span aria-hidden="true">↗</span></a></p>
                </div>
                <div className="role-detail">
                  <p className="impact-statement">Placed 2nd out of 70 teams and won €5,500 across two awards.</p>
                  <p className="role-context">Built an EU-sovereign, permission-aware knowledge layer for governed AI agents.</p>
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

              <li data-reveal>
                <p className="period">2024 to now</p>
                <div className="role">
                  <h3>BSc Computer Science &amp; Engineering</h3>
                  <p>TU Eindhoven</p>
                </div>
                <div className="role-detail">
                  <p className="impact-statement">Building production AI systems alongside a full-time computer science degree.</p>
                  <p className="working-set">Computer science / AI / Systems</p>
                </div>
              </li>

              <li data-reveal>
                <p className="period">2026</p>
                <div className="role">
                  <h3>Hackathon builder</h3>
                  <p>Paris / Amsterdam</p>
                </div>
                <div className="role-detail">
                  <p className="impact-statement">Two working AI products built in 24 hours and 6 hours. One selected to pitch from 80 builders.</p>
                  <p className="working-set">Next.js / Claude / ElevenLabs / Multi-agent systems</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="photo-proof" aria-label="Stacklink award photography">
          <figure data-reveal>
            <Image
              src="/images/me/award.jpg"
              alt="Lucas receiving the TU/e Contest First Runner-Up award"
              width={2048}
              height={1152}
              sizes="100vw"
            />
            <figcaption className="frame">
              <span>Kickoff EHV Ventures Demo Day</span>
              <strong>First Runner-Up / €3,000</strong>
            </figcaption>
          </figure>
        </section>

        <section className="work" id="work" aria-labelledby="work-title">
          <div className="frame">
            <header className="section-heading" data-reveal>
              <p>Selected work</p>
              <h2 id="work-title">Systems shipped, not mockups.</h2>
            </header>

            <article className="work-feature" data-reveal>
              <div className="work-copy">
                <p className="work-type">Enterprise AI / 2026</p>
                <h3>Cape.io</h3>
                <p>Agent infrastructure rebuilt for scale, accuracy, and strict permission boundaries.</p>
                <p className="work-impact">500× more inputs. Runtime cut from 55s to about 8s.</p>
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

            <article className="work-feature stacklink-feature" data-reveal>
              <div className="work-copy">
                <p className="work-type">Agentic infrastructure / 2026</p>
                <h3>Stacklink</h3>
                <p>
                  A governed knowledge layer for AI agents, designed for customer-owned
                  infrastructure and air-gapped deployment.
                </p>
                <p className="work-impact">2nd of 70. €5,500 won across two awards.</p>
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
              <article className="work-small" data-reveal>
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
                  <p className="work-impact">Built from zero in 24 hours at Station F.</p>
                  <a href="https://pitchr.live">Visit Pitchr.live <span aria-hidden="true">↗</span></a>
                </div>
              </article>

              <article className="work-small" data-reveal>
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
                  <p className="work-impact">Built in 6 hours. Selected to pitch from 80 builders.</p>
                  <a href="https://github.com/LucasDuys/hackaway-grocery-agent">View the code <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="capabilities" aria-labelledby="capabilities-title">
          <div className="frame capabilities-grid" data-reveal>
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
            <figure className="contact-portrait" data-reveal>
              {/* The person behind the record, once the record has made its case. */}
              <Image
                src="/images/me/portrait.jpg"
                alt="Lucas Duys"
                width={800}
                height={800}
                sizes="(max-width: 760px) 40vw, 20vw"
              />
            </figure>
            <div className="contact-copy" data-reveal>
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
          </div>
        </section>
      </main>
    </>
  );
}
