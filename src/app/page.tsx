/*
  THESIS: A career told as one scroll-driven film, then read as a page. The film carries the
  headline figures; below it the page says what I am building and why, proves it in one record,
  and closes on a way to talk. Nothing is said twice, no project appears in two sections, and
  nothing below the film hides behind a reveal: a visitor without JavaScript reads the same CV.
  OWN-WORLD: Black Cut. Pure black ground, warm-white ink, one cobalt signal, Geist with mono
  figures, sharp corners, real photography.
  STORY: Dust gathers into the spotlight ring (2nd of 70), rises along the trajectory (Cape,
  500x), seals into the LD mark (Antler ONE), then the real stage photograph lands. The page
  then reads in order: what I am building now (Athren, and the rule underneath it), the record
  (Cape, Stacklink, two hackathons, TU/e), the award photograph, and the ask.
  FIRST VIEWPORT: Name at display scale lower-left over the breathing dust field, kicker above,
  one line of summary and the record link below, an honest progress rail on the right edge.
  FORM: Kenward film grammar, hand-rolled: 300svh sticky stage, one scroll listener writing CSS
  vars and shader uniforms, render-on-demand points, reduced-motion static cut in pure CSS.
  Below the film: plain sections, one type scale, one spacing scale, no scroll reveals.
*/

import Image from 'next/image';
import BookCal from './BookCal';
import FilmHero from './FilmHero';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header frame">
        <a className="monogram" href="#top" aria-label="LD, Lucas Duys home">LD</a>
        <nav className="primary-nav" aria-label="Primary navigation">
          <a href="#now">Now</a>
          <a href="#experience">Record</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-contact" href="mailto:lucas.duys@gmail.com">Email</a>
      </header>

      <main id="main-content">
        <FilmHero />

        {/* The film's payoff: the abstraction resolves into the real stage.
            The numbers were just said; this band carries only the moment. */}
        <section className="photo-band" aria-label="TU/e Contest 2026 stage photography">
          <figure>
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
            <figcaption className="frame">Pitching Stacklink at the TU/e Contest 2026 finale</figcaption>
          </figure>
        </section>

        {/* What I am building, and the one rule underneath it. Every claim here
            is on athren.nl already; nothing is promised ahead of the evidence. */}
        <section className="now" id="now" aria-labelledby="now-title">
          <div className="frame now-grid">
            <div className="now-copy">
              <h2 id="now-title">Software that does the work, then waits for your yes.</h2>
              <p>
                I am building <a href="https://athren.nl">Athren</a>. It reads a product&apos;s
                funnel, finds the step where the most people fall out, writes the experiment,
                builds the variant inside the team&apos;s own codebase, and ships it once someone
                approves it. Twenty experiments a month, and nothing goes live without a yes.
              </p>
              <p>
                The rule underneath it has not changed across two products and a pivot: an agent
                proposes, a person approves, and everything it does is reversible and on the
                record. That is the part I am sure about. The rest is being tested one funnel at
                a time, in the Antler ONE cohort that started this September.
              </p>
              <div className="now-links">
                <a href="https://athren.nl">athren.nl <span aria-hidden="true">↗</span></a>
                <a href="https://www.antler.co/continental-europe">Antler ONE <span aria-hidden="true">↗</span></a>
              </div>
            </div>

            {/* The loop, numbered in reading order so the eye knows where to start. */}
            <ol className="loop" aria-label="How Athren works">
              <li>
                <span className="loop-n" aria-hidden="true">1</span>
                <h3>Observe</h3>
                <p>Read-only at first. It reads the whole journey and finds the step losing the most people.</p>
              </li>
              <li>
                <span className="loop-n" aria-hidden="true">2</span>
                <h3>Propose</h3>
                <p>It writes the experiment and builds the variant in the team&apos;s own components, behind a flag they already have.</p>
              </li>
              <li>
                <span className="loop-n" aria-hidden="true">3</span>
                <h3>Ship on approval</h3>
                <p>Nothing goes live until a person says yes. Every change is reversible and attributed.</p>
              </li>
            </ol>
          </div>
        </section>

        {/* One record. Every venture appears here exactly once, with its role,
            its evidence, and its imagery together; the film above carries the
            headlines, so no entry repeats them. */}
        <section className="experience" id="experience" aria-labelledby="record-title">
          <div className="frame">
            <h2 id="record-title" className="section-title">The record</h2>

            <ol className="experience-list">
              <li>
                <p className="period">2026</p>
                <div className="role">
                  <h3>AI engineering intern</h3>
                  <p><a href="https://cape.io">Cape.io <span aria-hidden="true">↗</span></a></p>
                </div>
                <div className="role-detail">
                  <p className="impact-statement">Rebuilt agent pipelines around measurable speed, cost, accuracy, and permission boundaries.</p>
                  <dl className="figures" aria-label="Cape engineering outcomes">
                    <div>
                      <dt>190k <span aria-hidden="true">→</span> 1.2k</dt>
                      <dd>tokens per run, more than 99 percent less</dd>
                    </div>
                    <div>
                      <dt>20 <span aria-hidden="true">→</span> 10,000</dt>
                      <dd>inputs per run, from 55 seconds to about 8, at 98 percent accuracy</dd>
                    </div>
                  </dl>
                  <div className="entry-media">
                    <Image
                      src="/images/projects/cape-live.jpg"
                      alt="Cape.io website"
                      width={1538}
                      height={784}
                      sizes="(max-width: 880px) 100vw, 55vw"
                    />
                  </div>
                  <p className="working-set">Python, TypeScript, agents, LangSmith</p>
                </div>
              </li>

              <li>
                <p className="period">2026</p>
                <div className="role">
                  <h3>Co-founder</h3>
                  <p><a href="https://stacklink.nl">Stacklink <span aria-hidden="true">↗</span></a></p>
                </div>
                <div className="role-detail">
                  <p className="impact-statement">Built an EU-sovereign, permission-aware knowledge layer for governed AI agents.</p>
                  <p className="role-context">Designed for customer-owned infrastructure and air-gapped deployment.</p>
                  <dl className="figures" aria-label="Stacklink awards">
                    <div>
                      <dt>€3,000</dt>
                      <dd>First Runner-Up at the <a href="https://tuecontest.nl/">TU/e Contest</a></dd>
                    </div>
                    <div>
                      <dt>€2,500</dt>
                      <dd><a href="https://thegate.tech/">The Gate</a> grant at <a href="https://www.kickoffehv.nl/">Kickoff EHV</a></dd>
                    </div>
                  </dl>
                  <div className="entry-media">
                    <Image
                      src="/images/projects/sl-hero.png"
                      alt="Stacklink product interface"
                      width={1600}
                      height={952}
                      sizes="(max-width: 880px) 100vw, 55vw"
                    />
                    <div className="entry-gallery" aria-label="Stacklink product views">
                      <Image src="/images/projects/sl-cited.png" alt="Stacklink answer with cited sources" width={1600} height={884} sizes="(max-width: 880px) 50vw, 27vw" />
                      <Image src="/images/projects/sl-file.png" alt="Stacklink file knowledge view" width={1600} height={889} sizes="(max-width: 880px) 50vw, 27vw" />
                      <Image src="/images/projects/sl-sql.png" alt="Stacklink SQL connector view" width={1600} height={884} sizes="(max-width: 880px) 50vw, 27vw" />
                      <Image src="/images/projects/sl-watch.png" alt="Stacklink agent activity view" width={1600} height={889} sizes="(max-width: 880px) 50vw, 27vw" />
                    </div>
                  </div>
                  <p className="working-set">TypeScript, Go, Postgres, RAG, ACLs</p>
                </div>
              </li>

              <li>
                <p className="period">2026</p>
                <div className="role">
                  <h3>Hackathon builder</h3>
                  <p>Paris and Amsterdam</p>
                </div>
                <div className="role-detail">
                  <p className="impact-statement">Two working AI products, built in 24 hours and in 6.</p>
                  <div className="entry-pair">
                    <article>
                      <Image
                        src="/images/projects/pitchr-live.jpg"
                        alt="Pitchr.live AI pitch coach"
                        width={1538}
                        height={784}
                        sizes="(max-width: 880px) 100vw, 27vw"
                      />
                      <h4>Pitchr.live</h4>
                      <p>Rubric scoring, rewritten scripts, and mock investor Q&amp;A in one AI pitch coach. Built from zero in 24 hours at Station F, Paris.</p>
                      <a href="https://pitchr.live">Visit Pitchr.live <span aria-hidden="true">↗</span></a>
                    </article>
                    <article>
                      <Image
                        src="/images/projects/hackaway-demo.jpg"
                        alt="Weekly Shop Agent assembling a Picnic grocery cart"
                        width={1920}
                        height={1080}
                        sizes="(max-width: 880px) 100vw, 27vw"
                      />
                      <h4>Weekly Shop Agent</h4>
                      <p>Five agents negotiate meals, dietary needs, and budget into a weekly grocery order. Six hours in Amsterdam, selected to pitch from 80 builders.</p>
                      <a href="https://github.com/LucasDuys/hackaway-grocery-agent">View the code <span aria-hidden="true">↗</span></a>
                    </article>
                  </div>
                  <p className="working-set">Next.js, Claude, ElevenLabs, multi-agent systems</p>
                </div>
              </li>

              <li>
                <p className="period">2024 to now</p>
                <div className="role">
                  <h3>BSc Computer Science &amp; Engineering</h3>
                  <p>TU Eindhoven</p>
                </div>
                <div className="role-detail">
                  <p className="impact-statement">Building production AI systems alongside a full-time computer science degree.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section className="photo-band" aria-label="TU/e Contest award photography">
          <figure>
            <Image
              src="/images/me/award.jpg"
              alt="Lucas receiving the TU/e Contest First Runner-Up award"
              width={2048}
              height={1152}
              sizes="100vw"
            />
            <figcaption className="frame">Receiving the First Runner-Up award, TU/e Contest 2026</figcaption>
          </figure>
        </section>

        {/* The ask, once the record has made its case: the person, the address,
            and the calendar in one place. */}
        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="frame contact-grid">
            <div className="contact-copy">
              <figure className="contact-portrait">
                <Image
                  src="/images/me/portrait.jpg"
                  alt="Lucas Duys"
                  width={800}
                  height={800}
                  sizes="(max-width: 880px) 40vw, 16vw"
                />
              </figure>
              <h2 id="contact-title">Let&apos;s talk.</h2>
              <p className="contact-lede">
                Thirty minutes on a video call, for hiring conversations, founder questions,
                and hard technical problems. Pick a time, or write.
              </p>
              <a className="contact-email" href="mailto:lucas.duys@gmail.com">
                lucas.duys@gmail.com <span aria-hidden="true">↗</span>
              </a>
              <nav aria-label="Profiles">
                <a href="https://www.linkedin.com/in/lucas-duys/">LinkedIn <span aria-hidden="true">↗</span></a>
                <a href="https://github.com/LucasDuys">GitHub <span aria-hidden="true">↗</span></a>
                <a href="https://cal.com/lucas-duys/30min?overlayCalendar=true">Cal.com <span aria-hidden="true">↗</span></a>
              </nav>
            </div>
            <div className="book-cal">
              <p className="cal-loading" aria-hidden="true">Loading the calendar…</p>
              <BookCal />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
