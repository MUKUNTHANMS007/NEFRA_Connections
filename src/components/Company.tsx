import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Company.css';

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

  const companyData = {
    name: 'TechVentures',
    tagline: 'Building the future of fintech',
    cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=300&q=80',
    verified: true,
    founded: '2020',
    location: 'San Francisco, CA',
    website: 'www.techventures.io',
    industry: 'Fintech',
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
      description: 'Industry-leading reliability'
    },
    {
      label: 'Client Satisfaction',
      value: '4.8/5',
      description: 'Based on 500+ reviews'
    },
    {
      label: 'AI Models',
      value: '150+',
      description: 'Advanced algorithms'
    },
    {
      label: 'Revenue Growth',
      value: '+180%',
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
      {/* --- ADDED HEADER END --- */}

      {/* Cover Section */}
      <div className="company-cover">
        <img src={companyData.cover} alt="Company cover" />
      </div>

      {/* Header Card */}
      <div className="company-header-card">
        <div className="company-header-content">
          {/* Logo Section */}
          <div className="company-logo-section">
            <img 
              src={companyData.logo} 
              alt={companyData.name}
              className="company-logo"
            />
            {companyData.verified && (
              <div className="verified-badge-company">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className="company-info">
            <h1 className="company-name-modern">{companyData.name}</h1>
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
          </div>

          {/* Actions */}
          <div className="company-actions-modern">
            <motion.button
              className="btn-action btn-follow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              + Follow
            </motion.button>
            <motion.button
              className="btn-action btn-message"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Contact
            </motion.button>
            <motion.button
              className="btn-action btn-more"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ...
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="company-stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card-company"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="stat-value-company">{stat.value}</div>
              <div className="stat-label-company">{stat.label}</div>
            </motion.div>
          ))}
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
                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-label">{metric.label}</div>
                  <p className="metric-description">{metric.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Company;