import Particles from "@/components/Particles";

const stats = [
  { label: "Duration", value: "42 hours" },
  { label: "Participants", value: "250+ expected" },
  { label: "Visitors", value: "3000+ expected" },
];

const tracks = [
  {
    title: "Vegathon",
    description: "Sustainability, agritech, and climate-resilient solutions.",
  },
  {
    title: "Electrothon (EDA-based)",
    description: "Embedded systems, circuit design, and hardware-led innovation.",
  },
  {
    title: "Wildcard",
    description: "Any bold idea with a clear real-world impact story.",
  },
];

const whyItMatters = [
  "Direct access to skilled participants",
  "Early hiring pipeline",
  "Product exposure",
  "Data & insights",
  "Brand presence where it counts",
];

const partnershipOpportunities = [
  {
    title: "Technical Support",
    description: "Provision of hardware kits, software packages, and licenses.",
  },
  {
    title: "Technical Contribution",
    description: "Mentorship and guidance from company experts.",
  },
  {
    title: "Track Sponsors",
    description: "Exclusive association with individual hackathon tracks.",
  },
  {
    title: "Talent Engagement",
    description: "Internship or placement opportunities for top performers.",
  },
  {
    title: "Equipment Sponsors",
    description: "Provide boards, kits, or licenses.",
  },
  {
    title: "Prize Sponsors",
    description: "Fund prizes or provide merchandise.",
  },
  {
    title: "Food & Logistics",
    description: "Provide meals, snacks, and participant kits.",
  },
];

const details = {
  schedule: [
    { day: "Day 01", focus: "Kickoff + Teaming", items: ["Check-in", "Keynote", "Hack begins"] },
    { day: "Day 02", focus: "Build Marathon", items: ["Mentor sprints", "Mid-review", "Midnight jam"] },
    { day: "Day 03", focus: "Demo Arena", items: ["Final submissions", "Live demos", "Awards"] },
  ],
  faqs: [
    {
      question: "Who can apply?",
      answer:
        "Students, developers, designers, and makers across India. Teams of 2–5 are ideal.",
    },
    {
      question: "Is there a registration fee?",
      answer: "No fee. Selected teams receive access to the venue, kits, and mentor support.",
    },
    {
      question: "What should I bring?",
      answer: "Laptop, chargers, and any personal hardware. We handle power, Wi‑Fi, and meals.",
    },
  ],
  contacts: [
    {
      name: "Mr. Nitheesh Kurian",
      phone: "+91 9497413879",
      email: "nitheeshk@rajagiritech.edu.in",
    },
    {
      name: "Mr. Rony Antony",
      phone: "+91 9744433929",
      email: "ronyap@rajagiritech.edu.in",
    },
    {
      name: "Mr. Kiran K A",
      phone: "+91 9747638947",
      email: "kirank@rajagiritech.edu.in",
    },
  ],
};

export default function Home() {
  return (
    <div id="top" className="landing-surface min-h-screen">
      <div className="landing-bg" aria-hidden="true">
        <Particles
          className="landing-bg-particles"
          particleColors={["#ffffff"]}
          particleCount={240}
          particleSpread={12}
          speed={0.16}
          particleBaseSize={170}
          sizeRandomness={0.65}
          moveParticlesOnHover
          moveParticlesOnDeviceOrientation
          deviceOrientationFactor={2.4}
          particleHoverFactor={2.2}
          hoverMode="window"
          alphaParticles
          disableRotation={false}
          pixelRatio={1}
        />
      </div>

      <div className="landing-content">
        <a className="landing-skip-link" href="#content">
          Skip to content
        </a>

        <header className="landing-header">
          <div className="landing-header-inner">
            <a className="landing-logo" href="#top" aria-label="CarbonX">
              CarbonX
            </a>
            <nav className="landing-nav" aria-label="Primary">
              <a className="landing-nav-link" href="#about">About</a>
              <a className="landing-nav-link" href="#tracks">Tracks</a>
              <a className="landing-nav-link" href="#faq">FAQ</a>
              <a className="landing-nav-cta" href="#register">
                Register now
              </a>
            </nav>
          </div>
        </header>

        <main id="content" className="landing-shell">
          <section className="landing-hero" aria-label="CarbonX overview">
            <p className="landing-kicker">Innovation beyond boundaries</p>
            <h1 className="landing-title">
              CarbonX <span className="landing-title-year">2026</span>
            </h1>
            <p className="landing-subtitle">
              A 42-hour national hackathon where developers, innovators, and students
              from across India team up to build practical, high-impact solutions.
            </p>
            <div className="landing-actions">
              <a className="landing-button" href="#register">
                Register now
              </a>
              <a className="landing-button-secondary" href="#about">
                Learn more
              </a>
            </div>
            <dl className="landing-stats" aria-label="Event stats">
              {stats.map((item) => (
                <div key={item.label} className="landing-stat">
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

        <section id="register" className="landing-accent" aria-label="Registration">
          <div className="landing-accent-inner">
            <div className="landing-accent-copy">
              <p className="landing-accent-kicker">Join us</p>
              <h2 className="landing-accent-title">
                6–8 March, 2026 <span className="landing-accent-dot">•</span> Kochi
              </h2>
              <p className="landing-accent-subtitle">
                Organized by the Department of Electronics and Communication Engineering,
                Rajagiri School of Engineering &amp; Technology (Autonomous).
              </p>
              <div className="landing-tags" aria-label="Highlights">
                <span className="landing-tag">250+ participants</span>
                <span className="landing-tag">3000+ visitors</span>
                <span className="landing-tag">₹1,00,000 / track</span>
              </div>
            </div>

            <div className="landing-accent-card" aria-label="Get the registration packet">
              <h3 className="landing-panel-title">Register now</h3>
              <p className="landing-panel-copy">
                Registration opens soon. This is a placeholder button while we wire up
                the registration flow.
              </p>
              <button className="landing-button landing-button-inline" type="button">
                Register now
              </button>

              <p className="landing-fineprint">
                No fee • Limited seats • Shortlist in 72 hours
              </p>
            </div>
          </div>
        </section>

        <section id="about" className="landing-section" aria-label="About CarbonX">
          <div className="landing-section-head">
            <h2 className="landing-section-title">About</h2>
            <p className="landing-section-hint">What you’re signing up for.</p>
          </div>
          <div className="landing-about">
            <div className="landing-about-card">
              <h3 className="landing-about-title">A 42-hour build</h3>
              <p className="landing-about-copy">
                Round-the-clock problem-solving, prototyping, and demos — built for
                teams that ship.
              </p>
            </div>
            <div className="landing-about-card">
              <h3 className="landing-about-title">Mentors + industry</h3>
              <p className="landing-about-copy">
                Meet experts, get feedback, and refine your story for a live demo arena.
              </p>
            </div>
            <div className="landing-about-card">
              <h3 className="landing-about-title">High-impact tracks</h3>
              <p className="landing-about-copy">
                Sustainability, hardware, and anything bold with a clear real-world impact.
              </p>
            </div>
          </div>
        </section>

        <section id="tracks" className="landing-section" aria-label="Tracks">
          <div className="landing-section-head">
            <h2 className="landing-section-title">Tracks</h2>
            <p className="landing-section-hint">Pick a lane — or go wildcard.</p>
          </div>
          <div className="landing-tracks">
            {tracks.map((track) => (
              <div key={track.title} className="landing-track">
                <h3 className="landing-track-title">{track.title}</h3>
                <p className="landing-track-copy">{track.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="why" className="landing-section" aria-label="Why it matters">
          <div className="landing-section-head">
            <h2 className="landing-section-title">Why it matters</h2>
            <p className="landing-section-hint">For partners and sponsors.</p>
          </div>
          <ul className="landing-why" aria-label="Why it matters list">
            {whyItMatters.map((item) => (
              <li key={item} className="landing-why-item">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section id="schedule" className="landing-section" aria-label="Schedule">
          <div className="landing-section-head">
            <h2 className="landing-section-title">Schedule</h2>
            <p className="landing-section-hint">3 days • 42 hours</p>
          </div>
          <div className="landing-schedule">
            {details.schedule.map((item) => (
              <div key={item.day} className="landing-schedule-item">
                <div className="landing-schedule-head">
                  <span className="landing-schedule-day">{item.day}</span>
                  <span className="landing-schedule-focus">{item.focus}</span>
                </div>
                <ul className="landing-schedule-list">
                  {item.items.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="partnership" className="landing-section" aria-label="Partnership opportunities">
          <div className="landing-section-head">
            <h2 className="landing-section-title">Partnerships</h2>
            <p className="landing-section-hint">Ways to get involved.</p>
          </div>
          <div className="landing-partnerships">
            {partnershipOpportunities.map((item) => (
              <div key={item.title} className="landing-partnership">
                <h3 className="landing-partnership-title">{item.title}</h3>
                <p className="landing-partnership-copy">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="landing-partnership-note">
            In collaboration with <span className="landing-partnership-strong">Hacks&apos;US Edition V</span>, with
            IEDC and IIC.
          </p>
        </section>

        <section id="faq" className="landing-section" aria-label="FAQ">
          <div className="landing-section-head">
            <h2 className="landing-section-title">FAQ</h2>
            <p className="landing-section-hint">Quick answers.</p>
          </div>
          <div className="landing-disclosures">
            {details.faqs.map((item) => (
              <details key={item.question} className="landing-disclosure">
                <summary>{item.question}</summary>
                <div className="landing-disclosure-body">
                  <p className="landing-faq-a">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section id="contact" className="landing-section" aria-label="Contact">
          <div className="landing-section-head">
            <h2 className="landing-section-title">Contact</h2>
            <p className="landing-section-hint">Reach the organizers.</p>
          </div>
          <div className="landing-contact">
            {details.contacts.map((contact) => (
              <div key={contact.email} className="landing-contact-item">
                <p className="landing-contact-name">{contact.name}</p>
                <p className="landing-contact-meta">{contact.phone}</p>
                <a className="landing-contact-link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </div>
            ))}
          </div>
        </section>

        <footer className="landing-footer" aria-label="Footer">
          <p className="landing-footer-line">
            Hosted by Rajagiri School of Engineering &amp; Technology
          </p>
          <p className="landing-footer-line landing-footer-muted">
            CarbonX Hackathon 2026
          </p>
        </footer>
        </main>
      </div>
    </div>
  );
}
