import { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import Company from './components/Company';
import Profile from './components/Profile';

// --- DATA CONSTANTS (NEFRA / PSG Context) ---
const FEATURED_CONNECTIONS = [
  {
    id: 'conn_1',
    name: 'Arjun Mehta',
    role: 'Alumni Founder',
    company: 'AgriTech Solutions',
    industry: 'AgriTech',
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
    alt: 'Professional woman in business attire', 
    verified: true
  },
  {
    id: 'conn_2',
    name: 'Dr. Suresh Kumar',
    role: 'Angel Investor',
    company: 'PSG Alumni Network',
    industry: 'Deep Tech',
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
    alt: 'Businessman in suit',
    verified: true
  },
  {
    id: 'conn_3',
    name: 'Divya R.',
    role: 'Student Innovator',
    company: 'BioMed Systems',
    industry: 'Healthcare',
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
    alt: 'Young woman smiling',
    verified: false
  }
];

const SUCCESS_STORIES = [
  {
    id: 'story_1',
    title: 'SIH Hackathon Victory',
    outcome: 'Connected with technical mentors via NEFRA and won the National Smart India Hackathon.',
    metric: 'Won ₹1 Lakh',
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
    author: 'Team Spark',
    company: 'PSG iTech'
  },
  {
    id: 'story_2',
    title: 'Pre-Incubation Grant',
    outcome: 'Met an alumni investor here. Secured pre-seed funding for our final year project prototype.',
    metric: 'Seed Funded',
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    author: 'Karthik S.',
    company: 'RoboDynamics'
  },
  {
    id: 'story_3',
    title: 'Global Mentorship',
    outcome: 'Gained advisory support from Silicon Valley alumni to scale our SaaS platform globally.',
    metric: 'Global Expansion',
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
    author: 'Priya Menon',
    company: 'CloudFlow'
  }
];

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
      <img src={data.image} alt={data.alt} loading="lazy" />
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
        <span>{data.company}</span>
        <span className="meta-sep">•</span>
        <span>{data.industry}</span>
      </div>
    </div>
  </article>
);

const SuccessStoryCard = ({ data }: { data: any }) => (
  <article className="story-card reveal">
    <div className="story-image">
      <img src={data.image} alt={data.title} loading="lazy" />
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

  // --- FIXED ANIMATION OBSERVER ---
  useEffect(() => {
    // 1. Create Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('active');
            // Optional: Unobserve after animating to save performance
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // 2. Add slight delay to allow DOM painting
    const timer = setTimeout(() => {
      const hiddenElements = document.querySelectorAll('.reveal');
      hiddenElements.forEach((el) => observer.observe(el));
    }, 100);

    // 3. Cleanup
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [path]); // <--- Dependency on 'path' ensures it runs on navigation

  // Render other pages
  if (path === '/search') {
    return <Search />;
  }
  if (path === '/company') {
    return <Company />;
  }
  if (path === '/profile') {
    return <Profile />;
  }

  // Home page (default)
  return (
    <div className="app-root">
      <header className="site-nav">
        <div className="nav-inner">
          <button 
            className="nav-brand"
            onClick={() => navigate('/')}
          >
            <div className="logo">N</div>
            <div className="brand">NEFRA Connections</div>
          </button>

          <nav className="nav-links">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); navigate('/'); }}
              className={path === '/' ? 'active-link' : ''}
            >
              Home
            </a>
            <a 
              href="/search" 
              onClick={(e) => { e.preventDefault(); navigate('/search'); }}
              className={path === '/search' ? 'active-link' : ''}
            >
              Find Investors
            </a>
            <a 
              href="/company" 
              onClick={(e) => { e.preventDefault(); navigate('/company'); }}
              className={path === '/company' ? 'active-link' : ''}
            >
              Startups
            </a>
            <a 
              href="/profile" 
              onClick={(e) => { e.preventDefault(); navigate('/profile'); }}
              className={path === '/profile' ? 'active-link' : ''}
            >
              My Profile
            </a>
          </nav>

          <div className="nav-cta">
            <button 
              className="btn btn-dark"
              onClick={() => navigate('/search')}
            >
              + Pitch Idea
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-watermark">NEFRA</div>

          {/* Note: side="left" and side="right" cards are absolute positioned */}
          <ConnectionCard data={FEATURED_CONNECTIONS[0]} side="left" />
          <ConnectionCard data={FEATURED_CONNECTIONS[1]} side="right" />

          <div className="hero-inner">
            <span className="hero-tag">Est. 2026</span>
            <h1 className="hero-title">Bridging Campus & Capital,</h1>
            <h2 className="hero-subtitle">Fueling Innovation</h2>
            <p className="hero-lead">The official ecosystem for PSG iTech entrepreneurs. Connect with alumni investors, find mentors, and turn your final year project into a funded startup.</p>

            <div className="hero-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/search')}
              >
                + Start Connecting
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/search')}
              >
                Explore Registry
              </button>
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
            <a 
              className="view-all" 
              href="/search"
              onClick={(e) => { e.preventDefault(); navigate('/search'); }}
            >
              View Registry →
            </a>
          </div>

          <div className="grid">
            <div className="feature reveal">
              <ConnectionCard data={FEATURED_CONNECTIONS[0]} size="large" />
            </div>

            <aside className="sidebar reveal" style={{ transitionDelay: '0.15s' }}>
              <ConnectionCard data={FEATURED_CONNECTIONS[1]} />
              <ConnectionCard data={FEATURED_CONNECTIONS[2]} />
            </aside>
          </div>
        </section>

        <section className="success-stories">
          <div className="section-head center reveal">
            <span className="eyebrow">From Campus to Corporate</span>
            <h2 className="section-title">Real Ideas, <em>Real Funding</em></h2>
          </div>

          <div className="stories-grid">
            {SUCCESS_STORIES.map((s, i) => (
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
            <button 
              className="btn btn-primary btn-cta"
              onClick={() => navigate('/search')}
            >
              Join NEFRA Network
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}