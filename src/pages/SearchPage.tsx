import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Search.css';

interface SearchResult {
  id: number;
  name: string;
  role: string;
  industry: string;
  description: string;
}

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    role: false,
    industry: false
  });

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: 1,
      name: 'John Smith',
      role: 'Investor',
      industry: 'Technology',
      description: 'Angel investor with 10+ years of experience in tech startups.'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      role: 'Founder',
      industry: 'Healthcare',
      description: 'Founder of HealthTech Solutions, focused on AI-driven diagnostics.'
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Investor',
      industry: 'Finance',
      description: 'VC partner specializing in fintech and blockchain innovations.'
    },
    {
      id: 4,
      name: 'Emily Davis',
      role: 'Founder',
      industry: 'Education',
      description: 'EdTech entrepreneur building the future of online learning.'
    },
    {
      id: 5,
      name: 'David Wilson',
      role: 'Investor',
      industry: 'Technology',
      description: 'Early-stage investor with portfolio of 50+ successful startups.'
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      role: 'Advisor',
      industry: 'Technology',
      description: 'Strategic advisor to 15+ tech companies, specializing in growth.'
    },
    {
      id: 7,
      name: 'James Martinez',
      role: 'Founder',
      industry: 'Finance',
      description: 'Founder of FinFlow, revolutionizing payment processing for SMBs.'
    },
    {
      id: 8,
      name: 'Rachel Green',
      role: 'Investor',
      industry: 'Healthcare',
      description: 'Healthcare investor focused on biotech and medical devices.'
    },
    {
      id: 9,
      name: 'Christopher Lee',
      role: 'Founder',
      industry: 'Education',
      description: 'Building AI-powered tutoring platform for personalized learning.'
    },
    {
      id: 10,
      name: 'Michelle White',
      role: 'Advisor',
      industry: 'Finance',
      description: 'Product and strategy advisor for fintech startups.'
    },
    {
      id: 11,
      name: 'Daniel Taylor',
      role: 'Investor',
      industry: 'Technology',
      description: 'Crypto and blockchain investor with track record of 10x returns.'
    },
    {
      id: 12,
      name: 'Amanda Brown',
      role: 'Founder',
      industry: 'Healthcare',
      description: 'CEO of MedConnect, connecting patients with specialists globally.'
    }
  ];

  const filteredResults = mockResults.filter((result) => {
    const matchesQuery = result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         result.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || result.role === selectedRole;
    const matchesIndustry = !selectedIndustry || result.industry === selectedIndustry;
    
    return matchesQuery && matchesRole && matchesIndustry;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const toggleFilter = (filter: 'role' | 'industry') => {
    setExpandedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  return (
    <div className="search-page-premium">
      {/* Full-Width Floating Search Bar */}
      <motion.div
        className="search-bar-floating"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <form onSubmit={handleSearch} className="search-form-floating">
          <div className="search-input-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="search-icon">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input-floating"
              placeholder="Search for people, companies, or opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </form>
      </motion.div>

      <div className="search-layout-premium">
        {/* Accordion Filters */}
        <aside className="filters-sidebar">
          <motion.div
            className="filter-accordion"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button
              className="filter-accordion-header"
              onClick={() => toggleFilter('role')}
            >
              <span>Role</span>
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                animate={{ rotate: expandedFilters.role ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path d="M6 9l6 6 6-6"/>
              </motion.svg>
            </button>
            <AnimatePresence>
              {expandedFilters.role && (
                <motion.div
                  className="filter-accordion-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {['Investor', 'Founder', 'Advisor'].map((role) => (
                    <label key={role} className="filter-toggle">
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={selectedRole === role}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      />
                      <span className="toggle-switch"></span>
                      <span>{role}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="filter-accordion"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              className="filter-accordion-header"
              onClick={() => toggleFilter('industry')}
            >
              <span>Industry</span>
              <motion.svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                animate={{ rotate: expandedFilters.industry ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path d="M6 9l6 6 6-6"/>
              </motion.svg>
            </button>
            <AnimatePresence>
              {expandedFilters.industry && (
                <motion.div
                  className="filter-accordion-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {['Technology', 'Healthcare', 'Finance', 'Education'].map((industry) => (
                    <label key={industry} className="filter-toggle">
                      <input
                        type="radio"
                        name="industry"
                        value={industry}
                        checked={selectedIndustry === industry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                      />
                      <span className="toggle-switch"></span>
                      <span>{industry}</span>
                    </label>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            className="clear-filters-btn"
            onClick={() => {
              setSelectedRole('');
              setSelectedIndustry('');
              setSearchQuery('');
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Filters
          </motion.button>
        </aside>

        {/* Results Area */}
        <main className="search-results-premium">
          <AnimatePresence mode="wait">
            {filteredResults.length === 0 ? (
              <motion.div
                key="empty"
                className="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="empty-illustration"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                >
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="80" stroke="#3498DB" strokeWidth="2" fill="none" opacity="0.3"/>
                    <circle cx="100" cy="100" r="60" stroke="#3498DB" strokeWidth="2" fill="none" opacity="0.2"/>
                    <path d="M100 40 L100 80 M100 120 L100 160 M40 100 L80 100 M120 100 L160 100" stroke="#3498DB" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="100" cy="100" r="20" fill="#3498DB" opacity="0.5"/>
                  </svg>
                </motion.div>
                <h3 className="empty-title">No Results Found</h3>
                <p className="empty-description">Try adjusting your search or filters</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                className="results-grid-premium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    className="result-card-portfolio"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="result-header-portfolio">
                      <div className="result-avatar-portfolio">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="#3498DB" strokeWidth="2" fill="rgba(52, 152, 219, 0.1)"/>
                          <circle cx="12" cy="10" r="4" stroke="#3498DB" strokeWidth="2"/>
                          <path d="M6 20C6 16 8 14 12 14C16 14 18 16 18 20" stroke="#3498DB" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="result-info-portfolio">
                        <h3 className="result-name-portfolio">{result.name}</h3>
                        <div className="result-tags-portfolio">
                          <span className="tag-portfolio">{result.role}</span>
                          <span className="tag-portfolio">{result.industry}</span>
                        </div>
                      </div>
                    </div>
                    <p className="result-description-portfolio">{result.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default Search;