import { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import Company from './components/Company';
import Profile from './components/Profile';

// --- ICON ---
const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
  </svg>
);

// --- COMPONENTS (Layout Unchanged) ---
const ConnectionCard = ({ data, size = 'small', side }: { data: any, size?: 'large' | 'small', side?: 'left' | 'right' }) => (
  <article className={`connection-card ${size === 'large' ? 'large' : 'small'} ${side ? `side-${side}` : ''} reveal`}>
    <div className="connection-image">
      {/* Replaced .image with .imageUrl to match backend */}
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
        {/* Replaced string with nested object name from backend */}
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
      {/* Replaced .image with .imageUrl to match backend */}
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

  // --- ADDED STATE FOR BACKEND DATA ---
  const [featuredConnections, setConnections] = useState<any[]>([]);
  const [successStories, setStories] = useState<any[]>([]);

  // --- ADDED FETCH LOGIC ---
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

  // --- FIXED ANIMATION OBSERVER ---
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
      const hiddenElements = document.querySelectorAll('.reveal');
      hiddenElements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [path, featuredConnections, successStories]); // Runs when path changes OR data loads

  // Render other pages
  if (path === '/search') return <Search />;
  if (path === '/company') return <Company />;
  if (path === '/profile') return <Profile />;

  // Home page (default)
  return (
    <div className="app-root">
      <header className="site-nav">
        <div className="nav-inner">
          <button className="nav-brand" onClick={() => navigate('/')}>
            <div className="logo">N</div>
            <div className="brand">NEFRA Connections</div>
          </button>

          <nav className="nav-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className={path === '/' ? 'active-link' : ''}>Home</a>
            <a href="/search" onClick={(e) => { e.preventDefault(); navigate('/search'); }}>Find Investors</a>
            <a href="/company" onClick={(e) => { e.preventDefault(); navigate('/company'); }}>Startups</a>
            <a href="/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }}>My Profile</a>
          </nav>

          <div className="nav-cta">
            <button className="btn btn-dark" onClick={() => navigate('/search')}>+ Pitch Idea</button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-watermark">NEFRA</div>

          {/* Logic for floating cards using backend state */}
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
              {/* Map remaining featured connections to sidebar */}
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