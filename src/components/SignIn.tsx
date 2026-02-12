import { useState, useEffect } from 'react';
import './SignIn.css';
import logoImg from '../assets/NEFRA_Connections_LOGO.jpg';

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

export default function SignIn() {
  // Fixes TS error: 'path' is now used in the navigation class logic below
  const [path, navigate] = usePath(); 
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="auth-page">
      {/* --- NAVIGATION SYNCED WITH NEFRA BRAND --- */}
      <header className="site-nav">
        <div className="nav-inner">
          <button className="nav-brand" onClick={() => navigate('/')}>
            <img src={logoImg} alt="NEFRA Logo" className="site-logo-img" />
            <div className="brand">NEFRA Connections</div>
          </button>
          
          <nav className="nav-links">
            {/* Using 'path' variable here fixes your TypeScript error */}
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className={path === '/' ? 'active-link' : ''}>Home</a>
            <a href="/search" onClick={(e) => { e.preventDefault(); navigate('/search'); }} className={path === '/search' ? 'active-link' : ''}>Find Investors</a>
            <a href="/company" onClick={(e) => { e.preventDefault(); navigate('/company'); }} className={path === '/company' ? 'active-link' : ''}>Startups</a>
          </nav>

          <div className="nav-cta">
            <button className="btn-dark" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      </header>

      <main className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            {/* Styled "Welcome Back" matching your screenshot */}
            <h1>Welcome <span>Back</span></h1>
            <p>Sign in to continue building your network</p>
          </div>

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input type="email" placeholder="your.email@example.com" required />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  required 
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="btn-auth-submit">Sign In</button>

            <div className="auth-divider">
              <span>Or continue with</span>
            </div>

            <div className="social-auth">
              <button type="button" className="social-btn">
                <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" />
                Google
              </button>
              <button type="button" className="social-btn">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" />
                LinkedIn
              </button>
            </div>

            <p className="auth-footer">
              Don't have an account? <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>Sign up for free</a>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}