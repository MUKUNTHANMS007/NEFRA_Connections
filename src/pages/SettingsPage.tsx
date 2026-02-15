import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import '../components/Company.css';
import './SettingsPage.css';

type NotificationPrefs = {
  product: boolean;
  marketing: boolean;
  security: boolean;
};

type SettingsState = {
  fullName: string;
  email: string;
  theme: 'light' | 'dark';
  timezone: string;
  language: string;
  profilePublic: boolean;
  twoFactor: boolean;
  connectedGoogle: boolean;
  connectedLinkedIn: boolean;
  notifications: NotificationPrefs;
};

const STORAGE_KEY = 'nefra_user_settings_v2';

export default function SettingsPage() {
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile'|'account'|'security'|'notifications'|'integrations'|'billing'>('profile');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [values, setValues] = useState<SettingsState>({
    fullName: 'Alex Morgan',
    email: 'alex@techventures.io',
    theme: 'light',
    timezone: 'UTC+05:30',
    language: 'English',
    profilePublic: true,
    twoFactor: false,
    connectedGoogle: false,
    connectedLinkedIn: false,
    notifications: { product: true, marketing: false, security: true }
  });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setValues(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
      setSavedAt(new Date().toLocaleTimeString());
      setSaving(false);
    }, 500);
  };

  const patch = (patchObj: Partial<SettingsState>) => setValues(v => ({ ...v, ...patchObj }));
  const toggleNotify = (k: keyof NotificationPrefs) => setValues(v => ({ ...v, notifications: { ...v.notifications, [k]: !v.notifications[k] } }));

  const disconnect = (which: 'google'|'linkedin') => {
    if (which === 'google') patch({ connectedGoogle: false });
    else patch({ connectedLinkedIn: false });
  };

  const connect = (which: 'google'|'linkedin') => {
    if (which === 'google') patch({ connectedGoogle: true });
    else patch({ connectedLinkedIn: true });
  };

  const uploadAvatar = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    patch({});
    // demo: store in session only
    (document.getElementById('user-avatar') as HTMLImageElement | null)?.setAttribute('src', url);
  };

  const resetSettings = () => {
    localStorage.removeItem(STORAGE_KEY);
    setValues({ fullName: 'Alex Morgan', email: 'alex@techventures.io', theme: 'light', timezone: 'UTC+05:30', language: 'English', profilePublic: true, twoFactor: false, connectedGoogle: false, connectedLinkedIn: false, notifications: { product: true, marketing: false, security: true } });
    setSavedAt(null);
  };

  return (
    <div className="settings-page-root single-long">
      <div className="settings-shell single-column">

        <div className="settings-top-hero">
          <div>
            <h1 className="hero-title">Settings</h1>
            <p className="hero-sub">Everything you need to manage your account — organized in one long page.</p>
          </div>

          <div className="hero-actions">
            <div className="quick-badges">
              <div className="badge">{values.connectedGoogle ? 'Google ✓' : 'Google'}</div>
              <div className="badge">{values.connectedLinkedIn ? 'LinkedIn ✓' : 'LinkedIn'}</div>
            </div>
            <div className="hero-ctas">
              <button className="btn btn-outline" onClick={resetSettings}>Reset</button>
              <button className="btn btn-primary" onClick={handleSave}>{saving ? 'Saving…' : 'Save changes'}</button>
            </div>
          </div>
        </div>

        <main className="settings-long">
          {/* PROFILE */}
          <motion.section className="section-panel" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
            <div className="section-header">
              <div className="section-accent" style={{ background: 'linear-gradient(90deg,#4f46e5,#06b6d4)' }} />
              <div>
                <h3>Profile</h3>
                <p className="muted">Name, avatar and public visibility.</p>
              </div>
            </div>

            <div className="panel-grid">
              <div>
                <div className="field-row">
                  <label>Full name</label>
                  <input value={values.fullName} onChange={e => patch({ fullName: e.target.value })} />
                </div>

                <div className="field-row">
                  <label>Headline</label>
                  <input placeholder="Founder • Engineer • Mentor" />
                </div>

                <div className="field-row">
                  <label>Bio</label>
                  <textarea placeholder="Write a short bio" rows={4} />
                </div>
              </div>

              <aside className="card">
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img id="user-avatar" src="https://images.unsplash.com/photo-1545996124-1c9f9f3d5c2e?auto=format&fit=crop&w=200&q=80" alt="avatar" className="avatar-lg" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800 }}>{values.fullName}</div>
                    <div className="muted">{values.email}</div>
                  </div>
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => uploadAvatar(e.target.files?.[0])} />
                  <button className="btn btn-outline" onClick={() => fileRef.current?.click()}>Upload</button>
                  <button className="btn" onClick={() => (document.getElementById('user-avatar') as HTMLImageElement).setAttribute('src', 'https://images.unsplash.com/photo-1545996124-1c9f9f3d5c2e?auto=format&fit=crop&w=200&q=80')}>Reset</button>
                </div>

                <div style={{ marginTop: 12 }}>
                  <label className="switch" onClick={() => patch({ profilePublic: !values.profilePublic })} role="switch" aria-checked={values.profilePublic}><div className={`knob ${values.profilePublic ? 'on' : ''}`} /></label>
                  <div className="muted" style={{ marginTop: 8 }}>{values.profilePublic ? 'Public profile' : 'Private profile'}</div>
                </div>
              </aside>
            </div>
          </motion.section>

          {/* ACCOUNT */}
          <motion.section className="section-panel" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.06 }}>
            <div className="section-header">
              <div className="section-accent" style={{ background: 'linear-gradient(90deg,#F97316,#60A5FA)' }} />
              <div>
                <h3>Account</h3>
                <p className="muted">Connected accounts, preferences and language.</p>
              </div>
            </div>

            <div className="panel-grid">
              <div>
                <div className="field-row">
                  <label>Language</label>
                  <select value={values.language} onChange={e => patch({ language: e.target.value })}>
                    <option>English</option>
                    <option>Spanish</option>
                  </select>
                </div>

                <div className="field-row">
                  <label>Timezone</label>
                  <select value={values.timezone} onChange={e => patch({ timezone: e.target.value })}>
                    <option>UTC+05:30</option>
                    <option>UTC+00:00</option>
                  </select>
                </div>

                <div className="field-row">
                  <label>Change password</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input placeholder="Current password" type="password" />
                    <input placeholder="New password" type="password" />
                    <button className="btn btn-dark">Update</button>
                  </div>
                </div>
              </div>

              <aside className="card">
                <h4>Connected services</h4>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  {values.connectedGoogle ? (<div className="connected-pill">Google <button className="btn-icon" onClick={() => disconnect('google')}>Disconnect</button></div>) : (<button className="btn btn-outline" onClick={() => connect('google')}>Connect Google</button>)}
                  {values.connectedLinkedIn ? (<div className="connected-pill">LinkedIn <button className="btn-icon" onClick={() => disconnect('linkedin')}>Disconnect</button></div>) : (<button className="btn btn-outline" onClick={() => connect('linkedin')}>Connect LinkedIn</button>)}
                </div>

                <div style={{ marginTop: 10 }} className="muted">OAuth integrations let you sign in, import contacts, and publish.</div>
              </aside>
            </div>
          </motion.section>

          {/* SECURITY */}
          <motion.section className="section-panel" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.12 }}>
            <div className="section-header">
              <div className="section-accent" style={{ background: 'linear-gradient(90deg,#34D399,#60A5FA)' }} />
              <div>
                <h3>Security</h3>
                <p className="muted">Two‑factor auth, active sessions and account safety.</p>
              </div>
            </div>

            <div className="panel-grid">
              <div>
                <div className="field-row">
                  <label>Two‑factor authentication</label>
                  <label className="switch" onClick={() => patch({ twoFactor: !values.twoFactor })} role="switch" aria-checked={values.twoFactor}><div className={`knob ${values.twoFactor ? 'on' : ''}`} /></label>
                </div>

                <div className="field-row">
                  <label>Active sessions</label>
                  <ul className="session-list">
                    <li>Windows — Chrome — San Francisco <button className="btn-sm">Sign out</button></li>
                    <li>iPhone — Safari — Chennai <button className="btn-sm">Sign out</button></li>
                  </ul>
                </div>
              </div>

              <aside className="card">
                <h4>Security score</h4>
                <div style={{ marginTop: 12 }} className="meter-wrap">
                  <div className="meter" style={{ width: '78%' }} />
                </div>
                <div className="muted" style={{ marginTop: 8 }}>Improve by enabling 2FA and connecting verified accounts.</div>
              </aside>
            </div>
          </motion.section>

          {/* NOTIFICATIONS */}
          <motion.section className="section-panel" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.18 }}>
            <div className="section-header">
              <div className="section-accent" style={{ background: 'linear-gradient(90deg,#FB7185,#F97316)' }} />
              <div>
                <h3>Notifications</h3>
                <p className="muted">Where and when NEFRA can reach you.</p>
              </div>
            </div>

            <div className="panel-grid">
              <div>
                <div className="field-row">
                  <label>Product updates</label>
                  <label className="switch" onClick={() => toggleNotify('product')} role="switch" aria-checked={values.notifications.product}><div className={`knob ${values.notifications.product ? 'on' : ''}`} /></label>
                </div>
                <div className="field-row">
                  <label>Security alerts</label>
                  <label className="switch" onClick={() => toggleNotify('security')} role="switch" aria-checked={values.notifications.security}><div className={`knob ${values.notifications.security ? 'on' : ''}`} /></label>
                </div>
                <div className="field-row">
                  <label>Marketing</label>
                  <label className="switch" onClick={() => toggleNotify('marketing')} role="switch" aria-checked={values.notifications.marketing}><div className={`knob ${values.notifications.marketing ? 'on' : ''}`} /></label>
                </div>
              </div>

              <aside className="card">
                <h4>Delivery</h4>
                <div style={{ marginTop: 8 }} className="muted">Email / Push / SMS (controls coming soon).</div>
                <div style={{ marginTop: 12 }}><button className="btn btn-outline">Manage channels</button></div>
              </aside>
            </div>
          </motion.section>

          {/* INTEGRATIONS & BILLING (combined) */}
          <motion.section className="section-panel" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.24 }}>
            <div className="section-header">
              <div className="section-accent" style={{ background: 'linear-gradient(90deg,#7C3AED,#06B6D4)' }} />
              <div>
                <h3>Integrations & Billing</h3>
                <p className="muted">Connected apps, API access and subscription.</p>
              </div>
            </div>

            <div className="panel-grid">
              <div>
                <div className="field-row">
                  <label>Connected apps</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div className="integration-pill">Google <button className="btn-icon">Revoke</button></div>
                    <div className="integration-pill">LinkedIn <button className="btn-icon">Revoke</button></div>
                  </div>
                </div>

                <div className="field-row">
                  <label>API access</label>
                  <button className="btn btn-outline">Request API key</button>
                </div>
              </div>

              <aside className="card">
                <h4>Plan</h4>
                <div className="muted">Basic • Free</div>
                <div style={{ marginTop: 12 }}><button className="btn btn-primary">Upgrade</button></div>
              </aside>
            </div>

            <div style={{ marginTop: 18 }} className="card">
              <h4>Danger zone</h4>
              <p className="muted">Permanently delete your account and data.</p>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-ghost" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.08)' }}>Delete account</button>
              </div>
            </div>
          </motion.section>
        </main>

        <div className="floating-save" role="status" aria-live="polite">
          <div className="save-note">{savedAt ? `Saved ${savedAt}` : 'Unsaved changes'}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-outline" onClick={resetSettings}>Reset</button>
            <button className="btn btn-primary" onClick={handleSave}>{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
