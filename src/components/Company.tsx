import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Company.css';
import logoImg from '../assets/NEFRA_Connections_LOGO.jpg';

type CompanyTab = 'about' | 'team' | 'metrics';

// --- ROUTER HOOK (Added for Navigation) ---
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

function Company() {
  const [activeTab, setActiveTab] = useState<CompanyTab>('about');
  const [path, navigate] = usePath(); // Added navigation hook

  // local UI state for careers modal
  const [applyFor, setApplyFor] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applyStatus, setApplyStatus] = useState<'idle' | 'sent' | 'error'>('idle');

  const submitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyStatus('sent');
    console.log('Application submitted', { role: applyFor, name: applicantName, email: applicantEmail });
    setTimeout(() => {
      setApplicantName('');
      setApplicantEmail('');
      setApplyFor(null);
      setApplyStatus('idle');
    }, 900);
  };

  const companyData = {
    name: 'TechVentures',
    tagline: 'Building the future of fintech',
    cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
    logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80',
    verified: true,
    founded: '2020',
    location: 'San Francisco, CA',
    website: 'www.techventures.io',
    industry: 'Fintech',
    // Enhanced metadata for UI
    stage: 'Series B',
    valuation: '$120M',
    raised: '$45M',
    traction: 82, // percent
    techStack: ['React', 'TypeScript', 'Node.js', 'Python', 'Postgres', 'Kubernetes'],
    investors: ['Sequoia', 'a16z', 'Greylock'],
    roadmap: [
      { id: 1, title: 'MVP Launch', date: 'Q1 2021', desc: 'Validated product‑market fit' },
      { id: 2, title: 'Series A', date: 'Q3 2021', desc: 'Scaled to 100+ clients' },
      { id: 3, title: 'APAC Expansion', date: 'Q2 2022', desc: 'Established Singapore HQ' },
      { id: 4, title: 'Series B', date: 'Q4 2023', desc: 'AI‑first platform' }
    ]
  };

  const stats = [
    { label: 'Employees', value: '75+' },
    { label: 'Clients', value: '120+' },
    { label: 'Projects', value: '200+' },
    { label: 'Countries', value: '15+' }
  ];

  const metrics = [
    {
      label: 'System Uptime',
      value: '99.9%',
      percent: 99,
      description: 'Industry-leading reliability'
    },
    {
      label: 'Client Satisfaction',
      value: '4.8/5',
      percent: 96,
      description: 'Based on 500+ reviews'
    },
    {
      label: 'AI Models',
      value: '150+',
      percent: 84,
      description: 'Advanced algorithms'
    },
    {
      label: 'Revenue Growth',
      value: '+180%',
      percent: 74,
      description: 'Year-over-year'
    }
  ];

  const coreValues = [
    {
      id: 1,
      title: 'Innovation First',
      description: 'We constantly push boundaries and explore new possibilities to deliver cutting-edge solutions.',
      icon: '⚡'
    },
    {
      id: 2,
      title: 'Collaborative Culture',
      description: 'Our team thrives on open communication and diverse perspectives to solve complex problems.',
      icon: '🤝'
    },
    {
      id: 3,
      title: 'Measurable Impact',
      description: 'We focus on delivering real results that drive growth and create lasting value.',
      icon: '📈'
    }
  ];

  const caseStudies = [
    { id: 'c1', title: 'From MVP to 10K users', summary: 'Helped scale to 10k MAUs in 6 months via product partnerships.', image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80' },
    { id: 'c2', title: 'Enterprise adoption', summary: 'Secured 3 enterprise pilots including Fortune 500 clients.', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80' }
  ];

  const [copySuccess, setCopySuccess] = useState(false);

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      bio: 'Serial entrepreneur with 10+ years in fintech'
    },
    {
      id: 2,
      name: 'Marcus Rodriguez',
      title: 'CTO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      bio: 'AI/ML expert and cloud infrastructure specialist'
    },
    {
      id: 3,
      name: 'Emily Zhang',
      title: 'COO',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      bio: 'Operations strategist with Fortune 500 experience'
    },
    {
      id: 4,
      name: 'James Wilson',
      title: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Product innovation leader and design advocate'
    }
  ];

  // --- NEW: Open roles (careers)
  const openRoles = [
    { id: 'r1', title: 'Senior Full‑Stack Engineer', location: 'Remote / SF', level: 'Senior', tags: ['React', 'Node.js', 'K8s'] },
    { id: 'r2', title: 'Product Designer', location: 'Remote', level: 'Mid', tags: ['Figma', 'UX'] },
    { id: 'r3', title: 'Machine Learning Engineer', location: 'San Francisco', level: 'Senior', tags: ['PyTorch', 'MLOps'] }
  ];

  const aboutContent = {
    mission: 'To revolutionize fintech by democratizing access to advanced financial technology for businesses of all sizes.',
    vision: 'A world where every business, regardless of size, has access to enterprise-grade financial solutions.',
    summary: 'TechVentures is a leading fintech platform that provides comprehensive solutions for payment processing, financial analytics, and risk management. Our innovative approach combines cutting-edge AI technology with user-centric design to solve real business problems.'
  };

  return (
    <div className="company-container-modern">
      
      {/* --- ADDED HEADER START --- */}
      <header className="site-nav">
        <div className="nav-inner">
          <button 
            className="nav-brand"
            onClick={() => navigate('/')}
          >
            <img src={logoImg} alt="NEFRA Logo" className="site-logo-img" />
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
            <a href="/settings" onClick={(e) => { e.preventDefault(); navigate('/settings'); }}>Settings</a>
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
      {/* --- ADDED HEADER END --- */}

      {/* Cover Section */}
      <div className="company-cover">
        <img src={companyData.cover} alt="Company cover" />
      </div>

      {/* Header Card (upgraded) */}
      <div className="company-header-card">
        <div className="company-header-content">
          {/* Logo + Stage */}
          <div className="company-logo-section">
            <img src={companyData.logo} alt={companyData.name} className="company-logo" />
            {companyData.verified && (
              <div className="verified-badge-company">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            )}

            <div className="stage-ribbon">{companyData.stage}</div>
          </div>

          {/* Company Info */}
          <div className="company-info">
            <div className="company-meta-row" style={{ display: 'flex', gap: 16, alignItems: 'baseline', justifyContent: 'space-between' }}>
              <h1 className="company-name-modern">{companyData.name}</h1>

              <div className="valuation-badge" aria-hidden>
                <div className="valuation-amount">{companyData.valuation}</div>
                <div className="valuation-label">Valuation</div>
              </div>
            </div>

            <p className="company-tagline">{companyData.tagline}</p>

            {/* Company Details Grid */}
            <div className="company-details-grid">
              <div className="detail-item">
                <span className="detail-label">Founded</span>
                <span className="detail-value">{companyData.founded}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-value">{companyData.location}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Industry</span>
                <span className="detail-value">{companyData.industry}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Website</span>
                <a href={`https://${companyData.website}`} className="detail-link">
                  {companyData.website}
                </a>
              </div>
            </div>

            <div className="tech-stack" aria-hidden>
              {companyData.techStack.map((t) => <span key={t} className="tech-chip">{t}</span>)}
            </div>
          </div>

          {/* Actions */}
          <div className="company-actions-modern">
            <motion.button className="btn-action btn-follow" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>+ Follow</motion.button>
            <motion.button className="btn-action btn-message" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>Request Intro</motion.button>
            <motion.button className="btn-action btn-apply" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/signin')}>Apply to Pitch</motion.button>
            <button className="btn-action btn-outline" onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Company URL copied to clipboard'); }}>Share</button>
          </div>
        </div>

        <div className="header-foot">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="traction-meter" role="progressbar" aria-valuenow={companyData.traction} aria-valuemin={0} aria-valuemax={100}>
              <div className="meter-fill" style={{ width: `${companyData.traction}%` }} />
            </div>
            <div className="traction-label">Product adoption <strong>{companyData.traction}%</strong></div>
          </div>

          <div className="investor-list" aria-hidden>
            {companyData.investors.map((inv) => (
              <div key={inv} className="investor-badge" title={inv}>{inv[0]}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section (enhanced) */}
      <div className="company-stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card-company"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="stat-value-company">{stat.value}</div>
              <div className="stat-label-company">{stat.label}</div>

              <div className="stat-progress" style={{ marginTop: 10 }}>
                <div style={{ height: 6, borderRadius: 999, background: '#f3f3f3', overflow: 'hidden' }}>
                  <div style={{ width: `${(index + 1) * 20}%`, height: '100%', background: 'linear-gradient(90deg,#F97316,#60A5FA)' }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="tech-investors reveal" style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'center' }}>
            <div className="tech-stack small">
              {companyData.techStack.map((t) => <span key={t} className="tech-chip">{t}</span>)}
            </div>

            <div className="investor-logos">
              {companyData.investors.map((inv) => <div key={inv} className="investor-badge">{inv[0]}</div>)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="company-tabs">
        <button
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button
          className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Team
        </button>
        <button
          className={`tab-btn ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          Metrics
        </button>
      </div>

      {/* Content */}
      <motion.div
        className="company-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* About Tab */}
        {activeTab === 'about' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* About Cards */}
            <div className="about-cards-grid">
              <motion.div
                className="about-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0 }}
              >
                <h3 className="about-card-title">Mission</h3>
                <p className="about-card-text">{aboutContent.mission}</p>
              </motion.div>

              <motion.div
                className="about-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className="about-card-title">Vision</h3>
                <p className="about-card-text">{aboutContent.vision}</p>
              </motion.div>
            </div>

            {/* Summary */}
            <motion.div
              className="about-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="section-title-company">Who We Are</h3>
              <p className="summary-text">{aboutContent.summary}</p>
            </motion.div>

            {/* Core Values */}
            <motion.div
              className="core-values-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="section-title-company">Core Values</h3>
              <div className="values-grid">
                {coreValues.map((value, index) => (
                  <motion.div
                    key={value.id}
                    className="value-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <div className="value-icon">{value.icon}</div>
                    <h4 className="value-title">{value.title}</h4>
                    <p className="value-description">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Roadmap (new) */}
            <motion.div
              className="roadmap-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.45 }}
            >
              <h3 className="section-title-company">Roadmap</h3>
              <div className="roadmap">
                {companyData.roadmap.map((r, idx) => (
                  <motion.div key={r.id} className="roadmap-step"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * idx }}
                  >
                    <div className="step-dot" />
                    <div className="step-body">
                      <div className="step-title">{r.title}</div>
                      <div className="step-date">{r.date}</div>
                      <p className="step-desc">{r.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Case studies */}
            <motion.div className="about-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <h3 className="section-title-company">Case studies</h3>
              <div className="case-studies" style={{ marginTop: 12 }}>
                {caseStudies.map(c => (
                  <div key={c.id} className="case-card">
                    <img src={c.image} alt={c.title} />
                    <div style={{ padding: 12 }}>
                      <div className="case-title">{c.title}</div>
                      <div className="case-summary">{c.summary}</div>
                      <div style={{ marginTop: 8 }}>
                        <button className="btn btn-outline" onClick={() => alert('Open case study (demo)')}>Read story</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Open roles (new) */}
            <motion.div className="about-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <h3 className="section-title-company">Open roles</h3>
              <div className="jobs-grid" style={{ marginTop: 12 }}>
                {openRoles.map((job) => (
                  <div key={job.id} className="job-card">
                    <div>
                      <div className="job-title">{job.title}</div>
                      <div className="job-meta">{job.level} • {job.location}</div>
                      <div className="job-tags">{job.tags.map(t => <span key={t} className="tech-chip">{t}</span>)}</div>
                    </div>
                    <div>
                      <button className="btn btn-primary" onClick={() => { setApplyFor(job.id); setApplicantName(''); setApplicantEmail(''); }}>Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="section-title-company">Leadership Team</h3>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="team-member-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <div className="team-member-image">
                    <img src={member.image} alt={member.name} />

                    <div className="team-member-social" aria-hidden>
                      <a className="social-btn" href="#" title={`Message ${member.name}`} onClick={(e) => e.preventDefault()}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                      </a>
                      <a className="social-btn" href="#" title={`LinkedIn ${member.name}`} onClick={(e) => e.preventDefault()}>
                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM7.5 8h4.7v2.2h.1c.7-1.3 2.4-2.2 4-2.2 4.3 0 5.2 2.8 5.2 6.4V24H17v-8.6c0-2.1 0-4.8-3-4.8-3 0-3 2-3 4.6V24H7.5V8z"/></svg>
                      </a>
                    </div>
                  </div>

                  <div className="team-member-info">
                    <h4 className="team-member-name">{member.name}</h4>
                    <p className="team-member-title">{member.title}</p>
                    <p className="team-member-bio">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="section-title-company">Key Performance Metrics</h3>
            <div className="metrics-grid">
              {metrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  className="metric-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="metric-ring" style={{ background: `conic-gradient(#60A5FA ${metric.percent}%, #eef2ff 0)` }}>
                    <div className="inner">{metric.percent}%</div>
                  </div>

                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-label">{metric.label}</div>
                  <p className="metric-description">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Application modal (simple) */}
      {applyFor && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="apply-modal">
            <h3>Apply for role</h3>
            <p className="muted">Role: <strong>{openRoles.find(r => r.id === applyFor)?.title}</strong></p>

            <form onSubmit={submitApplication} style={{ display: 'grid', gap: 8 }}>
              <input required placeholder="Full name" value={applicantName} onChange={e => setApplicantName(e.target.value)} />
              <input required placeholder="Email" type="email" value={applicantEmail} onChange={e => setApplicantEmail(e.target.value)} />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
                <button type="button" className="btn btn-outline" onClick={() => setApplyFor(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{applyStatus === 'sent' ? 'Sent' : 'Send application'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Company;