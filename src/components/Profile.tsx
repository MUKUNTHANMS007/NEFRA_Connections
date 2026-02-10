import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Profile.css';

type Tab = 'about' | 'portfolio' | 'activity';

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

function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>('about');
  const [path, navigate] = usePath(); // Added navigation hook

  const profileData = {
    name: 'Sarah Chen',
    title: 'Founder & CEO',
    company: 'TechVentures',
    bio: 'Passionate about building innovative solutions and connecting passionate people. I believe the best ideas deserve the right capital, and the best capital deserves the right ideas.',
    cover: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    verified: true,
    followers: '2.4K',
    following: '840',
    connections: '156',
    location: 'San Francisco, CA',
    website: 'www.techventures.io',
    expertise: ['Fintech', 'AI/ML', 'SaaS', 'Blockchain'],
  };

  const aboutContent = {
    bio: 'Passionate about building innovative solutions and connecting passionate people. I believe the best ideas deserve the right capital, and the best capital deserves the right ideas.',
    expertise: ['Fintech', 'AI/ML', 'SaaS', 'Blockchain', 'Web3'],
    location: 'San Francisco, CA',
    website: 'www.techventures.io',
    joinDate: 'Joined February 2024',
    yearsExperience: '8+ years in tech entrepreneurship'
  };

  const portfolioItems = [
    {
      id: 1,
      title: 'TechVentures Inc',
      status: 'Active',
      year: '2020 - Present',
      description: 'AI-powered fintech platform for SMBs'
    },
    {
      id: 2,
      title: 'DataFlow Analytics',
      status: 'Exited',
      year: '2018 - 2021',
      description: 'Real-time data visualization SaaS'
    },
    {
      id: 3,
      title: 'CloudNine Solutions',
      status: 'Active',
      year: '2019 - Present',
      description: 'Enterprise cloud infrastructure'
    }
  ];

  const activityItems = [
    {
      id: 1,
      text: 'Just closed Series A funding round',
      time: '2 days ago'
    },
    {
      id: 2,
      text: 'Connected with Marcus Rodriguez (Investor)',
      time: '1 week ago'
    },
    {
      id: 3,
      text: 'Added 3 new projects to portfolio',
      time: '2 weeks ago'
    },
    {
      id: 4,
      text: 'Shared insights on scaling startups',
      time: '3 weeks ago'
    }
  ];

  return (
    <div className="profile-container-modern">
      
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
      <div className="profile-cover">
        <img src={profileData.cover} alt="Cover" />
      </div>

      {/* Header Card */}
      <div className="profile-header-card">
        <div className="profile-header-content">
          {/* Avatar Section */}
          <div className="profile-avatar-section">
            <img 
              src={profileData.avatar} 
              alt={profileData.name}
              className="profile-avatar-large"
            />
            {profileData.verified && (
              <div className="verified-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
            )}
          </div>

          {/* Intro Section */}
          <div className="profile-intro">
            <h1 className="profile-name-modern">{profileData.name}</h1>
            <p className="profile-title-modern">{profileData.title}</p>
            <p className="profile-company-modern">{profileData.company}</p>

            {/* Stats Row */}
            <div className="profile-stats-row">
              <div className="stat-item">
                <span className="stat-value">{profileData.followers}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profileData.following}</span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{profileData.connections}</span>
                <span className="stat-label">Connections</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="profile-actions-modern">
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
              Message
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

      {/* Tabs */}
      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button
          className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio
        </button>
        <button
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Activity
        </button>
      </div>

      {/* Content */}
      <motion.div
        className="profile-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* About Tab */}
        {activeTab === 'about' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="about-section">
              <p className="about-bio">{aboutContent.bio}</p>

              <div className="about-grid">
                {/* Expertise */}
                <div className="about-item">
                  <h4>Expertise</h4>
                  <div className="tag-list">
                    {aboutContent.expertise.map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="about-item">
                  <h4>Location</h4>
                  <p className="about-text">{aboutContent.location}</p>
                </div>

                {/* Website */}
                <div className="about-item">
                  <h4>Website</h4>
                  <a href={`https://${aboutContent.website}`} className="about-link">
                    {aboutContent.website}
                  </a>
                </div>

                {/* Member Since */}
                <div className="about-item">
                  <h4>Member Since</h4>
                  <p className="about-text">{aboutContent.joinDate}</p>
                </div>

                {/* Experience */}
                <div className="about-item">
                  <h4>Experience</h4>
                  <p className="about-text">{aboutContent.yearsExperience}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="portfolio-section-modern">
              <div className="portfolio-list">
                {portfolioItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="portfolio-item-modern"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="portfolio-item-header">
                      <h4>{item.title}</h4>
                      <span className={`status-badge status-${item.status === 'Active' ? 'active' : 'exited'}`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="about-text">{item.description}</p>
                    <p className="portfolio-item-year">{item.year}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <motion.div
            className="tab-content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="activity-section-modern">
              <div className="activity-timeline">
                {activityItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="activity-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="activity-dot"></div>
                    <div className="activity-content">
                      <p className="activity-text">{item.text}</p>
                      <p className="activity-time">{item.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Profile;