import { useState, useEffect } from 'react';
import './Search.css';

interface SearchResult {
  id: number;
  name: string;
  role: string;      // e.g. "Founder"
  company: string;   // e.g. "AI Analytics"
  industry: string;  // e.g. "Tech"
  image: string;
  verified: boolean; // For the badge
}

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

function Search() {
  const [path, navigate] = usePath();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // --- DATASET MATCHING YOUR IMAGE STYLE ---
  const mockResults: SearchResult[] = [
    {
      id: 1,
      name: 'David Park',
      role: 'Founder',
      company: 'AI ANALYTICS',
      industry: 'TECH',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
      verified: true
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Managing Partner',
      company: 'GLOBAL VENTURES',
      industry: 'FINANCE',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      verified: true
    },
    {
      id: 3,
      name: 'Arjun Mehta',
      role: 'Alumni Founder',
      company: 'AGRITECH SOL.',
      industry: 'AGRITECH',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      verified: false
    },
    {
      id: 4,
      name: 'Priya Sharma',
      role: 'CEO',
      company: 'HEALTH AI',
      industry: 'HEALTHCARE',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80',
      verified: true
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'Tech Advisor',
      company: 'DEEP MIND',
      industry: 'DEEP TECH',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      verified: true
    },
    {
      id: 6,
      name: 'Emily Zhang',
      role: 'Product Lead',
      company: 'ECOPACK',
      industry: 'TECH',
      image: 'https://images.unsplash.com/photo-1598550874175-4d7112ee7f43?auto=format&fit=crop&w=800&q=80',
      verified: false
    }
  ];

  useEffect(() => {
    setFilteredResults(mockResults);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterResults(searchQuery, selectedRole, selectedIndustry);
    setHasSearched(true);
  };

  const filterResults = (query: string, role: string, industry: string) => {
    const results = mockResults.filter((result) => {
      const matchesQuery = query === '' || 
        result.name.toLowerCase().includes(query.toLowerCase()) ||
        result.role.toLowerCase().includes(query.toLowerCase());
      
      const matchesRole = role === '' || result.role.toUpperCase().includes(role); // Simple match
      const matchesIndustry = industry === '' || result.industry === industry;
      
      return matchesQuery && matchesRole && matchesIndustry;
    });
    setFilteredResults(results);
  };

  const handleFilterChange = (filterType: 'role' | 'industry', value: string) => {
    let newRole = selectedRole;
    let newIndustry = selectedIndustry;
    if (filterType === 'role') {
      newRole = selectedRole === value ? '' : value;
      setSelectedRole(newRole);
    } else {
      newIndustry = selectedIndustry === value ? '' : value;
      setSelectedIndustry(newIndustry);
    }
    filterResults(searchQuery, newRole, newIndustry);
  };

  return (
    <div className="search-container-modern">
      {/* HEADER */}
      <header className="site-nav">
        <div className="nav-inner">
          <button className="nav-brand" onClick={() => navigate('/')}>
            <div className="logo">N</div>
            <div className="brand">NEFRA Connections</div>
          </button>
          <nav className="nav-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className={path === '/' ? 'active-link' : ''}>Home</a>
            <a href="/search" onClick={(e) => { e.preventDefault(); navigate('/search'); }} className={path === '/search' ? 'active-link' : ''}>Find Investors</a>
            <a href="/company" onClick={(e) => { e.preventDefault(); navigate('/company'); }} className={path === '/company' ? 'active-link' : ''}>Startups</a>
            <a href="/profile" onClick={(e) => { e.preventDefault(); navigate('/profile'); }} className={path === '/profile' ? 'active-link' : ''}>My Profile</a>
          </nav>
          <div className="nav-cta">
            <button className="btn btn-dark" onClick={() => navigate('/search')}>+ Pitch Idea</button>
          </div>
        </div>
      </header>

      {/* HERO & SEARCH */}
      <div className="search-hero-section">
        <h1 className="search-hero-title">Find Your Next Connection</h1>
        <p className="search-hero-subtitle">Search 10,000+ entrepreneurs and investors.</p>
      </div>

      <div className="search-bar-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search by name, company, or industry..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); }}
            />
            <button type="submit" className="search-button">SEARCH</button>
          </div>
        </form>

        <div className="filters-row">
          <div className="filter-group">
            {['FOUNDER', 'INVESTOR', 'STUDENT'].map((role) => (
              <button key={role} className={`filter-btn ${selectedRole === role ? 'active' : ''}`} onClick={() => handleFilterChange('role', role)}>{role}</button>
            ))}
          </div>
          <div className="filter-group ml-auto">
            {['TECH', 'FINANCE', 'HEALTHCARE'].map((industry) => (
              <button key={industry} className={`filter-btn ${selectedIndustry === industry ? 'active' : ''}`} onClick={() => handleFilterChange('industry', industry)}>{industry}</button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS GRID - MATCHING THE IMAGE LAYOUT */}
      <div className="search-results-section">
        {filteredResults.length === 0 ? (
          <div className="no-results-section"><p>No results found.</p></div>
        ) : (
          <>
            <div className="results-header">
              <p className="results-count">Showing <span className="count-number">{filteredResults.length}</span> results</p>
            </div>
            
            <div className="results-grid">
              {filteredResults.map((result) => (
                <div key={result.id} className="result-card">
                  
                  {/* Image Section */}
                  <div className="card-image-wrapper">
                    <img src={result.image} alt={result.name} className="result-image" />
                  </div>

                  {/* Text Section */}
                  <div className="result-info">
                    {/* Name + Verified Badge Row */}
                    <div className="name-row">
                      <h3 className="result-name">{result.name}</h3>
                      {result.verified && (
                        <div className="verified-badge-inline">
                          <svg className="verified-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          <span>Verified</span>
                        </div>
                      )}
                    </div>

                    {/* Role */}
                    <p className="result-role">{result.role}</p>

                    {/* Company • Industry */}
                    <p className="result-meta">
                      {result.company} • {result.industry}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Search;