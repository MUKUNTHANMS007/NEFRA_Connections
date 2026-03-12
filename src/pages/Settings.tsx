import { useState, useEffect } from 'react';
import { Save, User, Bell, Eye, Link as LinkIcon, DollarSign, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

const InputField = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "" 
}: { 
  label: string; 
  value: string | number; 
  onChange: (val: string) => void; 
  type?: string; 
  placeholder?: string; 
}) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">{label}</label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
    />
  </div>
);

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    fullName: '',
    headline: '',
    email: '',
    role: 'ENTREPRENEUR',
    domainType: 'TECHNICAL',
    industry: '',
    company: '',
    location: '',
    description: '',
    linkedinUrl: '',
    githubUrl: '',
    totalAssets: 0,
    foundedYear: '',
    profileVisibility: true,
    connectionRequests: true,
    searchVisibility: true,
    activityStatus: true,
    emailNotifications: true,
    connectionUpdates: true,
    messageAlerts: true,
    weeklyDigest: false,
    twoFactor: false,
    loginAlerts: true,
    marketingEmails: false,
    productUpdates: true,
    eventInvitations: true,
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }
    
    // FIXED: Removed /api/v1 because api.ts already adds it
    api.get(`/settings/${userId}`)
      .then((res) => {
        if (res.data) setForm((f) => ({ ...f, ...res.data }));
      })
      .catch((err) => console.error('Failed to load settings', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    const payload = { ...form, totalAssets: Number(form.totalAssets) };
    
    try {
      // FIXED: Removed /api/v1 because api.ts already adds it
      await api.put(`/settings/${userId}`, payload); 
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save settings', err);
      alert("System sync failed. Check connection.");
    }
  };

  const toggle = (key: keyof typeof form, value: boolean) => {
    if (typeof form[key] === 'boolean') setForm((f) => ({ ...f, [key]: value }));
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  return (
    <div className="min-h-screen w-full bg-transparent text-slate-200 pt-24 pb-32">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-white">System Configuration</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your operational parameters, digital identity, and security protocols.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* SECTION 1: Identity & Intel */}
          <section className="rounded-3xl border border-white/5 bg-slate-900/20 p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <User className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Identity & Intel</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField 
                label="Full Name" 
                value={form.fullName} 
                onChange={(val) => setForm({ ...form, fullName: val })} 
                placeholder="Your display name" 
              />
              <InputField 
                label="Headline" 
                value={form.headline} 
                onChange={(val) => setForm({ ...form, headline: val })} 
                placeholder="e.g. Building the future of AI" 
              />
              <InputField 
                label="Location" 
                value={form.location} 
                onChange={(val) => setForm({ ...form, location: val })} 
                placeholder="e.g. San Francisco, CA" 
              />
              <InputField 
                label="Email Address" 
                value={form.email} 
                onChange={(val) => setForm({ ...form, email: val })} 
                type="email" 
              />
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Role Status</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1117] px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                >
                  <option value="ENTREPRENEUR">Entrepreneur</option>
                  <option value="INVESTOR">Investor</option>
                  <option value="ADVISOR">Advisor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Domain Sector</label>
                <select
                  value={form.domainType}
                  onChange={(e) => setForm({ ...form, domainType: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1117] px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                >
                  <option value="TECHNICAL">Technical</option>
                  <option value="FINANCIAL">Financial</option>
                  <option value="AGRICULTURAL">Agricultural</option>
                  <option value="BIO_TECHNOLOGY">Bio Technology</option>
                  <option value="EDUCATIONAL">Educational</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Operational Briefing (Bio)</label>
                <textarea
                  value={form.description || ''}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Detail your operational goals and experience..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none resize-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* SECTION 2: Assets & Network Hub */}
          <section className="rounded-3xl border border-white/5 bg-slate-900/20 p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <LinkIcon className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Assets & Network Links</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1"><DollarSign className="h-3 w-3"/> Total Assets (USD)</label>
                <input
                  type="number"
                  value={form.totalAssets}
                  onChange={(e) => setForm({ ...form, totalAssets: Number(e.target.value) })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <InputField 
                label="Founded Year" 
                value={form.foundedYear} 
                onChange={(val) => setForm({ ...form, foundedYear: val })} 
                placeholder="e.g. 2024" 
                type="number" 
              />
              <InputField 
                label="LinkedIn URL" 
                value={form.linkedinUrl} 
                onChange={(val) => setForm({ ...form, linkedinUrl: val })} 
                placeholder="https://linkedin.com/in/..." 
              />
              <InputField 
                label="GitHub URL" 
                value={form.githubUrl} 
                onChange={(val) => setForm({ ...form, githubUrl: val })} 
                placeholder="https://github.com/..." 
              />
            </div>
          </section>

          {/* SECTION 3: Privacy & Security Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="rounded-3xl border border-white/5 bg-slate-900/20 p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <Eye className="h-5 w-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Privacy Metrics</h2>
              </div>
              <div className="space-y-6">
                {([
                  { key: 'profileVisibility', label: 'Public Profile', desc: 'Allow outside nodes to view details' },
                  { key: 'connectionRequests', label: 'Inbound Requests', desc: 'Accept new connection pings' },
                  { key: 'searchVisibility', label: 'Scanner Indexing', desc: 'Appear in global network searches' },
                ] as const).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <button
                      type="button" role="switch" aria-checked={form[key as keyof typeof form] as boolean}
                      onClick={() => toggle(key as keyof typeof form, !(form[key as keyof typeof form] as boolean))}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form[key as keyof typeof form] ? 'bg-indigo-500' : 'bg-white/10'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${form[key as keyof typeof form] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/5 bg-slate-900/20 p-8 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <Bell className="h-5 w-5 text-amber-400" />
                <h2 className="text-lg font-semibold text-white">Alerts & Security</h2>
              </div>
              <div className="space-y-6">
                {([
                  { key: 'emailNotifications', label: 'System Emails', desc: 'Receive critical network updates' },
                  { key: 'twoFactor', label: '2FA Protocol', desc: 'Require secondary authentication' },
                  { key: 'loginAlerts', label: 'Breach Alerts', desc: 'Notify on unauthorized access' },
                ] as const).map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <button
                      type="button" role="switch" aria-checked={form[key as keyof typeof form] as boolean}
                      onClick={() => toggle(key as keyof typeof form, !(form[key as keyof typeof form] as boolean))}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form[key as keyof typeof form] ? 'bg-amber-500' : 'bg-white/10'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${form[key as keyof typeof form] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* FLOATING ACTION BAR */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-4 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <p className="text-sm text-slate-400 hidden sm:block">Unsaved changes will be lost upon exit.</p>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button type="button" className="text-sm font-medium text-slate-400 hover:text-white transition-colors px-4">Cancel</button>
                <button
                  type="submit"
                  className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-lg ${saved ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'}`}
                >
                  <Save className="h-4 w-4" />
                  {saved ? 'Configuration Saved' : 'Commit Changes'}
                </button>
              </div>
            </div>
          </div>
          
        </form>
      </motion.div>
    </div>
  );
}