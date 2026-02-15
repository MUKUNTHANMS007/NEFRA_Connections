import { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import Company from './components/Company';
import Profile from './components/Profile';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { motion, AnimatePresence } from 'framer-motion';

// 1. IMPORT YOUR LOGO HERE
import logoImg from './assets/NEFRA_Connections_LOGO.jpg';

// --- ICON ---
const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

// --- COMPONENTS ---
const ConnectionCard = ({ data, size = 'small', side }: { data: any, size?: 'large' | 'small', side?: 'left' | 'right' }) => (
  <article className={`connection-card ${size === 'large' ? 'large' : 'small'} ${side ? `side-${side}` : ''} reveal`}>
    <div className="connection-image">
      <img src={data.imageUrl} alt={data.name} loading="lazy" />
      {data.verified && (
        <div className="verified-badge">
          <CheckIcon className="icon-check" />
          <span>Verified</span>
        </div>
      )}
    </div>

    <div className="connection-body">
      <h3 className="connection-name">{data.name}</h3>
      <p className="connection-role">{data.role}</p>

      <div className="connection-meta">
        <span>{data.company?.name || data.company}</span>
        <span className="meta-sep">•</span>
        <span>{data.industry?.name || data.industry}</span>
      </div>
    </div>
  </article>
);

const SuccessStoryCard = ({ data }: { data: any }) => (
  <article className="story-card reveal">
    <div className="story-image">
      <img src={data.imageUrl} alt={data.title} loading="lazy" />
    </div>

    <div className="story-body">
      <div className="story-metric">{data.metric}</div>
      <h4 className="story-title">{data.title}</h4>
      <p className="story-outcome">{data.outcome}</p>
      <div className="story-author">{data.author} • {data.company}</div>
    </div>
  </article>
);

// --- ROUTER HOOK ---
function usePath() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  return [path, (to: string) => {
    if (to === window.location.pathname) return;
    history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }] as const;
}

// --- APP ---
export default function App() {
  const [path, navigate] = usePath();

  const [featuredConnections, setConnections] = useState<any[]>([]);
  const [successStories, setStories] = useState<any[]>([]);

  const foundersSpotlight = [
    {
      id: 'elon',
      name: 'Elon Musk',
      image: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Elon_Musk_Royal_Society_%28cropped%29.jpg',
      role: 'Entrepreneur / Engineer',
      title: 'Tesla • SpaceX • Neuralink',
      bio: "Studied at Queen's University and the University of Pennsylvania (Physics & Economics). Elon translated technical training and early startup exits (Zip2, PayPal) into multi‑industry companies — pioneering reusable rockets and mainstream electric vehicles. His path shows how campus research, cross‑discipline learning, and relentless product iteration scale into global platforms.",
      highlights: [
        'B.A./B.S. — University of Pennsylvania (Physics & Economics)',
        'Co‑founded Zip2 and X.com (PayPal)',
        'Founded SpaceX (rockets) and led Tesla (EVs) to mass market'
      ]
    },
    {
      id: 'jensen',
      name: 'Jensen Huang',
      image: 'https://upload.wikimedia.org/wikipedia/commons/0/05/JensenHuangSC18.jpg',
      role: 'Engineer • CEO',
      title: 'Co‑founder & CEO, NVIDIA',
      bio: "Earned an electrical engineering degree at Oregon State and an M.S. from Stanford. Jensen co‑founded NVIDIA in 1993 and guided GPUs from graphics accelerators to the foundation of modern AI — an excellent example of campus research being productized into industry‑defining technology.",
      highlights: [
        'BSEE — Oregon State University; MS — Stanford University',
        'Co‑founded NVIDIA (1993)',
        'Led GPUs → AI platforms used by universities and enterprises worldwide'
      ]
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [connRes, storyRes] = await Promise.all([
          fetch('http://localhost:8081/api/users/featured'),
          fetch('http://localhost:8081/api/stories/featured')
        ]);
        if (connRes.ok) setConnections(await connRes.json());
        if (storyRes.ok) setStories(await storyRes.json());
      } catch (err) {
        console.error("Backend offline on 8081.");
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('active');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const timer = setTimeout(() => {
      const hiddenElements = Array.from(document.querySelectorAll('.reveal')) as HTMLElement[];
      hiddenElements.forEach((el, idx) => {
        // apply a small stagger so items reveal in sequence when the route changes
        el.style.transitionDelay = `${idx * 60}ms`;
        observer.observe(el);
      });
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [path, featuredConnections, successStories]);

  if (path === '/search') return (
    <AnimatePresence mode="wait">
      <motion.div key={path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
        <Search />
      </motion.div>
    </AnimatePresence>
  );

  if (path === '/company') return (
    <AnimatePresence mode="wait">
      <motion.div key={path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
        <Company />
      </motion.div>
    </AnimatePresence>
  );

  if (path === '/profile') return (
    <AnimatePresence mode="wait">
      <motion.div key={path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
        <Profile />
      </motion.div>
    </AnimatePresence>
  );

  if (path === '/signin') return (
    <AnimatePresence mode="wait">
      <motion.div key={path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
        <SignInPage />
      </motion.div>
    </AnimatePresence>
  );

  if (path === '/signup') return (
    <AnimatePresence mode="wait">
      <motion.div key={path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
        <SignUpPage />
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="app-root">
      <header className="site-nav">
        <div className="nav-inner">
          <button className="nav-brand" onClick={() => navigate('/')}>
            {/* 2. LOGO IMAGE ADDED HERE */}
            <img src={logoImg} alt="NEFRA Logo" className="site-logo-img" />
            <div className="brand">NEFRA Connections</div>
          </button>

          <nav className="nav-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className={path === '/' ? 'active-link' : ''}>Home</a>
            <a href="/search" onClick={(e) => { e.preventDefault(); navigate('/search'); }}>Find Investors</a>
            <a href="/company" onClick={(e) => { e.preventDefault(); navigate('/company'); }}>Startups</a>
            <a href="/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>My Profile</a>
          </nav>

          <div className="nav-cta">
            <button className="btn btn-primary" onClick={() => navigate('/signup')}>Sign Up</button>
            <button className="btn" onClick={() => navigate('/signin')}>Sign In</button>
            <button className="btn btn-dark" onClick={() => navigate('/search')}>+ Pitch Idea</button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-watermark">NEFRA</div>

          {featuredConnections.length >= 2 && (
            <>
              <ConnectionCard data={featuredConnections[0]} side="left" />
              <ConnectionCard data={featuredConnections[1]} side="right" />
            </>
          )}

          <div className="hero-inner">
            <span className="hero-tag">Est. 2026</span>
            <h1 className="hero-title">Bridging Campus & Capital,</h1>
            <h2 className="hero-subtitle">Fueling Innovation</h2>
            <p className="hero-lead">The official ecosystem for PSG iTech entrepreneurs. Connect with alumni investors, find mentors, and turn your final year project into a funded startup.</p>

            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate('/search')}>+ Start Connecting</button>
              <button className="btn btn-outline" onClick={() => navigate('/search')}>Explore Registry</button>
            </div>
          </div>

          <div className="scroll-indicator">
            <span>Scroll</span>
            <div className="scroll-line"><div className="scroll-pulse" /></div>
          </div>
        </section>

        <section className="recent-activity">
          <div className="section-head reveal">
            <div>
              <span className="eyebrow">Campus Activity</span>
              <h2 className="section-title">Recent <em>Matches</em></h2>
            </div>
            <a className="view-all" href="/search" onClick={(e) => { e.preventDefault(); navigate('/search'); }}>View Registry →</a>
          </div>

          <div className="grid">
            <div className="feature reveal">
              {featuredConnections.length > 0 && <ConnectionCard data={featuredConnections[0]} size="large" />}
            </div>

            <aside className="sidebar reveal" style={{ transitionDelay: '0.15s' }}>
              {featuredConnections.slice(1, 3).map((conn: any) => (
                <ConnectionCard key={conn.id} data={conn} />
              ))}
            </aside>
          </div>
        </section>

        <section className="success-stories">
          <div className="section-head center reveal">
            <span className="eyebrow">From Campus to Corporate</span>
            <h2 className="section-title">Real Ideas, <em>Real Funding</em></h2>
          </div>

          {/* --- FOUNDER SPOTLIGHT (Elon Musk + Jensen Huang) --- */}
          <div className="founder-spotlight reveal">
            <div className="founder-spotlight-grid">
              {foundersSpotlight.map((f, i) => (
                <motion.div
                  key={f.id}
                  className={`founder-card founder-card--${f.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  whileHover={{ scale: 1.03, translateY: -6, rotate: i === 0 ? -0.6 : 0.6 }}
                  transition={{ duration: 0.45, ease: [0.2, 1, 0.2, 1], delay: i * 0.08 }}
                >
                  <div className="founder-avatar" aria-hidden>
                    {f.image ? (
                      <>
                        <img src={f.image} alt={`${f.name} portrait`} className="founder-photo" loading="lazy" />
                        <div className="avatar-glow" />
                      </>
                    ) : (
                      <>
                        <div className="initials">{f.name.split(' ').map(n => n[0]).slice(0,2).join('')}</div>
                        <div className="avatar-glow" />
                      </>
                    )}
                  </div>

                  <div className="founder-body">
                    <div className="founder-header">
                      <h3 className="founder-name">{f.name}</h3>
                      <div className="founder-title">{f.title}</div>
                    </div>

                    <p className="founder-bio">{f.bio}</p>

                    <ul className="founder-highlights">
                      {f.highlights.map((h) => <li key={h}>{h}</li>)}
                    </ul>

                    <div className="founder-actions">
                      <button className="btn btn-outline" onClick={() => window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(f.name.replace(' ', '_'))}`, '_blank')}>Learn more</button>
                      <button className="btn btn-primary" onClick={() => navigate('/search')}>Find campus talent</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="stories-grid">
            {successStories.map((s, i) => (
              <div key={s.id} style={{ transitionDelay: `${i * 0.08}s` }} className="reveal">
                <SuccessStoryCard data={s} />
              </div>
            ))}
          </div>
        </section>

        <section className="global-cta">
          <div className="cta-watermark">INVEST</div>
          <div className="cta-inner reveal">
            <h2 className="cta-title">Your Next Co-Founder<br /><span>Awaits</span></h2>
            <button className="btn btn-primary btn-cta" onClick={() => navigate('/search')}>Join NEFRA Network</button>
          </div>
        </section>
      </main>
    </div>
  );
}