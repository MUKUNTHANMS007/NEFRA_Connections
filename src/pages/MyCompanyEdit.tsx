import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Save, Loader2, Target, Globe, DollarSign, AlignLeft, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

const DOMAIN_OPTIONS = [
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'FINANCIAL', label: 'Financial' },
  { value: 'EDUCATIONAL', label: 'Educational' },
  { value: 'AGRICULTURAL', label: 'Agricultural' },
  { value: 'BIO_TECHNOLOGY', label: 'Bio-Technology' },
  { value: 'OTHER', label: 'Other' },
];

const FUNDING_OPTIONS = ['Bootstrapped', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'];
const SIZE_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '500+'];

// High-fidelity input component
const InputField = ({ label, value, onChange, type = "text", placeholder = "", required = false }: any) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
      {label} {required && <span className="text-indigo-500">*</span>}
    </label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
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
    solution: '',
    domainType: 'TECHNICAL',
    industry: '',
    location: '',
    website: '',
    size: '1-10',
    fundingStage: 'Bootstrapped',
    foundedYear: '',
    totalAssets: 0,
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) { navigate('/signin'); return; }

    api.get(`/companies/my-company?userId=${userId}`)
      .then((res) => {
        if (res.data && res.data.id) setForm((f) => ({ ...f, ...res.data }));
      })
      .catch(() => console.log("Initializing new company environment."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const payload = { 
      ...form, 
      totalAssets: Number(form.totalAssets),
      userId: userId // Backend needs this to link the company to you
    };

    try {
      if (form.id) {
        await api.put(`/companies/${form.id}?userId=${userId}`, payload);
      } else {
        const res = await api.post(`/companies`, payload);
        setForm(f => ({ ...f, id: res.data.id }));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      setTimeout(() => navigate(`/company_profile/${form.id || 'redirect'}`), 1000);
    } catch (err: any) {
      setError("Failed to sync workspace. Ensure all required fields are valid.");
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-transparent"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;

  return (
    <div className="min-h-screen w-full bg-transparent text-slate-200 pt-24 pb-32">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10">
          <Link to="/company" className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {form.id ? 'Edit Workspace' : 'Initialize Company'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">Setup your venture's professional identity on NEFRA.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Identity Section */}
          <section className="rounded-3xl border border-white/5 bg-slate-900/20 p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <Building2 className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Identity</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Company Name" value={form.name} onChange={(v:string)=>setForm({...form, name:v})} required placeholder="Acme Corp" />
              <InputField label="Tagline" value={form.tagline} onChange={(v:string)=>setForm({...form, tagline:v})} placeholder="The future of..." />
              <InputField label="Location" value={form.location} onChange={(v:string)=>setForm({...form, location:v})} placeholder="San Francisco, Remote" />
              <InputField label="Website" value={form.website} onChange={(v:string)=>setForm({...form, website:v})} placeholder="https://..." />
            </div>
          </section>

          {/* Details Section */}
          <section className="rounded-3xl border border-white/5 bg-slate-900/20 p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <AlignLeft className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Operational Details</h2>
            </div>
            <div className="space-y-6">
               <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder="What are you building?"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Domain</label>
                  <select
                    value={form.domainType}
                    onChange={(e) => setForm({ ...form, domainType: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0d1117] px-4 py-3 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
                  >
                    {DOMAIN_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <InputField label="Founded Year" value={form.foundedYear} onChange={(v:string)=>setForm({...form, foundedYear:v})} type="number" />
              </div>
            </div>
          </section>

          {/* Floating Action Bar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-50">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-4 backdrop-blur-xl shadow-2xl">
              <p className="text-sm text-slate-400 hidden sm:block">All fields are synced to the secure registry.</p>
              <button
                type="submit"
                className={`inline-flex items-center gap-2 rounded-xl px-8 py-2.5 text-sm font-bold text-white transition-all ${saved ? 'bg-emerald-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
              >
                <Save className="h-4 w-4" />
                {saved ? 'Saved!' : 'Save Company'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}