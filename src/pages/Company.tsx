import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Save, Loader2, Target, AlignLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

const DOMAIN_OPTIONS = [
  { value: 'TECHNICAL', label: 'Technical / SaaS' },
  { value: 'FINANCIAL', label: 'Financial / Fintech' },
  { value: 'EDUCATIONAL', label: 'Educational / EdTech' },
  { value: 'BIO_TECHNOLOGY', label: 'Bio-Technology' },
  { value: 'OTHER', label: 'Other' },
];

const FUNDING_OPTIONS = ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'];

// Reusable Input Component to prevent cursor jump bugs
const InputField = ({ label, value, onChange, type = "text", placeholder = "", required = false }: any) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
      {label} {required && <span className="text-blue-500">*</span>}
    </label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
    />
  </div>
);

export default function MyCompanyEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    id: null as number | null,
    name: '',
    tagline: '',
    description: '',
    domainType: 'TECHNICAL',
    location: '',
    website: '',
    teamSize: '1-10',
    fundingStage: 'Bootstrapped',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) { navigate('/signin'); return; }

    api.get(`/companies/my-company?userId=${userId}`)
      .then((res) => {
        if (res.data && res.data.id) setForm((f) => ({ ...f, ...res.data }));
      })
      .catch(() => console.log("Initializing blank workspace."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      let res: any;
      if (form.id) {
        res = await api.put(`/companies/${form.id}?requesterId=${userId}`, form);
      } else {
        res = await api.post(`/companies?userId=${userId}`, form);
        setForm(f => ({ ...f, id: (res.data as { id: number }).id as number }));
      }
      
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate(`/company_profile/${form.id || res.data.id}`);
      }, 1500);
    } catch (err: any) {
      setError("Failed to sync workspace configuration.");
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-transparent"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;

  return (
    <div className="min-h-screen w-full bg-transparent text-slate-200 pt-24 pb-32">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <Link to={`/company_profile/${form.id || ''}`} className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Cancel & Return
          </Link>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
            {form.id ? 'Configure Entity' : 'Initialize Entity'}
          </h1>
          <p className="mt-2 text-sm text-slate-400 font-medium">Update your venture's parameters in the NEFRA registry.</p>
        </div>

        {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSave} className="space-y-8">
          
          <section className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <Building2 className="h-5 w-5 text-blue-400" />
              <h2 className="text-xs font-black text-white uppercase tracking-widest">Core Identity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Entity Name" value={form.name} onChange={(v:string)=>setForm({...form, name:v})} required placeholder="Acme Corp" />
              <InputField label="Tagline" value={form.tagline} onChange={(v:string)=>setForm({...form, tagline:v})} placeholder="Revolutionizing the..." />
              <InputField label="Location" value={form.location} onChange={(v:string)=>setForm({...form, location:v})} placeholder="San Francisco, CA" />
              <InputField label="Website URL" value={form.website} onChange={(v:string)=>setForm({...form, website:v})} placeholder="https://..." />
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <AlignLeft className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xs font-black text-white uppercase tracking-widest">Operational Briefing</h2>
            </div>
            <div className="space-y-6">
               <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description / Bio</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={5}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
                  placeholder="Detail your operational parameters..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/5 bg-slate-900/40 p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <Target className="h-5 w-5 text-indigo-400" />
              <h2 className="text-xs font-black text-white uppercase tracking-widest">Metrics & Scale</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Sector</label>
                <select value={form.domainType} onChange={(e) => setForm({ ...form, domainType: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500">
                  {DOMAIN_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Team Size</label>
                <input type="text" value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })} placeholder="e.g. 1-10" className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Funding Stage</label>
                <select value={form.fundingStage} onChange={(e) => setForm({ ...form, fundingStage: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500">
                  {FUNDING_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </section>

          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/90 px-6 py-4 backdrop-blur-xl shadow-2xl">
              <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase hidden sm:block">Registry Sync Active</p>
              <button
                type="submit"
                className={`inline-flex items-center gap-2 rounded-xl px-8 py-3 text-xs font-black uppercase tracking-widest text-white transition-all shadow-lg ${saved ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'}`}
              >
                <Save className="h-4 w-4" />
                {saved ? 'Synchronized!' : 'Commit Changes'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}