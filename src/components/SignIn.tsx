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
                <span className="input-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M21 8.5l-9 5.5L3 8.5" />
                  </svg>
                </span>
                <input type="email" placeholder="your.email@example.com" required />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                  </svg>
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password" 
                  required 
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
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
              <button type="button" className="social-btn social-btn--google" aria-label="Sign in with Google">
                <span className="social-icon" aria-hidden>
                  {/* google glyph */}
                  <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" role="img"><path fill="#4285F4" d="M533.5 278.4c0-17.4-1.6-34-4.6-50.2H272v95.1h147.1c-6.4 34.6-25.6 63.9-54.6 83.5v69.6h88.2c51.6-47.5 81.8-117.6 81.8-198z"/><path fill="#34A853" d="M272 544.3c73.7 0 135.6-24.5 180.8-66.7l-88.2-69.6c-24.6 16.5-56.1 26.1-92.6 26.1-71 0-131.3-47.9-152.8-112.3H28.6v70.7C73.5 486.9 167.6 544.3 272 544.3z"/><path fill="#FBBC05" d="M119.2 326.1c-10.9-32.7-10.9-67.7 0-100.4V155c-45.5 27.1-75.9 74.3-75.9 129.1s30.4 102 75.9 129.1v-87.1z"/><path fill="#EA4335" d="M272 107.7c38.9 0 74 13.4 101.5 39l76.1-76.1C407.6 24.2 345.7 0 272 0 167.6 0 73.5 57.4 28.6 144.9l90.6 70.8C140.7 155.6 201 107.7 272 107.7z"/></svg>
                </span>
                <span className="social-label">Continue with Google</span>
              </button>

              <button type="button" className="social-btn social-btn--linkedin" aria-label="Sign in with LinkedIn">
                <span className="social-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg" role="img"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0zM7.5 8h4.7v2.2h.1c.7-1.3 2.4-2.2 4-2.2 4.3 0 5.2 2.8 5.2 6.4V24H17v-8.6c0-2.1 0-4.8-3-4.8-3 0-3 2-3 4.6V24H7.5V8z"/></svg>
                </span>
                <span className="social-label">Sign in with LinkedIn</span>
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