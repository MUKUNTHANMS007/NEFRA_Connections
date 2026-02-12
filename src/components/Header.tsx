import { useState } from 'react';
import './Header.css';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

function Header({ currentPath, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'HOME', path: '/' },
    { label: 'SEARCH', path: '/search' },
    { label: 'COMPANY', path: '/company' },
    { label: 'PROFILE', path: '/profile' }
  ];

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-modern">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => handleNavClick('/')}>
          <div className="logo-icon">N</div>
          <span className="logo-text">NetworkHub</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`nav-link ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <button className="navbar-cta">+ CONNECT</button>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`mobile-nav-link ${currentPath === item.path ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;