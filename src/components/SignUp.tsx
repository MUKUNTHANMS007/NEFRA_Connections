import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './SignIn.css';
import logoImg from '../assets/NEFRA_Connections_LOGO.jpg';

// --- ROUTER HOOK (local copy for component-level navigation) ---
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

export default function SignUp() {
  const [path, navigate] = usePath();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formState, setFormState] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  useEffect(() => { setError(''); }, [formState]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.password !== formState.confirm) {
      setError('Passwords do not match');
      return;
    }
    // placeholder: will integrate with API later
    alert(`Account created for ${formState.name} (mock)`);
    navigate('/signin');
  };

  return (
    <div className="auth-page">
      <header className="site-nav">
        <div className="nav-inner">
          <button className="nav-brand" onClick={() => navigate('/')}>
            <img src={logoImg} alt="NEFRA Logo" className="site-logo-img" />
            <div className="brand">NEFRA Connections</div>
          </button>

          <nav className="nav-links">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className={path === '/' ? 'active-link' : ''}>Home</a>
            <a href="/search" onClick={(e) => { e.preventDefault(); navigate('/search'); }} className={path === '/search' ? 'active-link' : ''}>Find Investors</a>
            <a href="/company" onClick={(e) => { e.preventDefault(); navigate('/company'); }} className={path === '/company' ? 'active-link' : ''}>Startups</a>
          </nav>

          <div className="nav-cta">
            <button className="btn" onClick={() => navigate('/signin')}>Sign In</button>
            <button className="btn btn-dark" onClick={() => navigate('/search')}>+ Pitch Idea</button>
          </div>
        </div>
      </header>

      <main className="auth-container">
        <motion.div className="auth-card" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
          <div className="auth-header">
            <h1>Create <span>Account</span></h1>
            <p>Join NEFRA — connect with investors, mentors and collaborators</p>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            <div className="input-group">
              <label>Full name</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="3" />
                    <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                  </svg>
                </span>
                <input value={formState.name} onChange={(e) => setFormState(s => ({ ...s, name: e.target.value }))} type="text" placeholder="Your full name" required />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8.5v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M21 8.5l-9 5.5L3 8.5" />
                  </svg>
                </span>
                <input value={formState.email} onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))} type="email" placeholder="your.email@example.com" required />
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
                <input value={formState.password} onChange={(e) => setFormState(s => ({ ...s, password: e.target.value }))} type={showPassword ? 'text' : 'password'} placeholder="Create a password" required />
                <button type="button" className="toggle-password" aria-pressed={showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon" aria-hidden>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V8a5 5 0 0 1 10 0v3" />
                  </svg>
                </span>
                <input value={formState.confirm} onChange={(e) => setFormState(s => ({ ...s, confirm: e.target.value }))} type={showConfirm ? 'text' : 'password'} placeholder="Confirm your password" required />
                <button type="button" className="toggle-password" aria-pressed={showConfirm} aria-label={showConfirm ? 'Hide password' : 'Show password'} onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            {error && <div style={{ color: '#b91c1c', fontWeight: 700, marginBottom: 12 }}>{error}</div>}

            <label className="remember-me" style={{ display: 'block', marginBottom: 18 }}>
              <input type="checkbox" /> I agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
            </label>

            <button type="submit" className="btn-auth-submit">Create account</button>

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
              Already have an account? <a href="/signin" onClick={(e) => { e.preventDefault(); navigate('/signin'); }}>Sign in</a>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
