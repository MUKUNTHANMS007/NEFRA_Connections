import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import api from '../api';

export default function MyCompany() {
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      setError('Please sign in to view your company.');
      return;
    }
    api
      .get('/companies/my-company?userId=' + userId)
      .then((res) => {
        if (res.status === 204 || res.data == null) {
          setCompany(null);
        } else {
          setCompany(res.data);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 204 || err?.response?.status === 404) {
          setCompany(null);
        } else {
          setError('Failed to load company profile.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-blue-400 animate-pulse text-xl">SCANNING_REGISTRY...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-red-400">ERROR: {error}</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="w-full">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 sm:px-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-12 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.15),transparent_50%)]" />
            
            <p className="relative z-10 text-xs font-black uppercase tracking-[0.2em] text-blue-400">Discovery Node</p>
            <div className="relative z-10 mx-auto mt-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-900/20 border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <Building2 className="h-10 w-10 text-blue-400" />
            </div>
            <h1 className="relative z-10 mt-8 text-3xl font-black text-white tracking-tight">
              Establish Your Entity
            </h1>
            <p className="relative z-10 mt-4 text-slate-400 font-medium leading-relaxed">
              Showcase your venture to the NEFRA ecosystem. Initialize your company profile to start building visibility and attracting capital.
            </p>
            <Link
              to="/my-company/edit"
              className="relative z-10 mt-10 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-black tracking-widest uppercase text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-200 hover:bg-blue-500 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Initialize Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-10 shadow-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
            <div className="h-1 w-8 bg-blue-600" /> My_Entity
          </p>
          <h1 className="mt-4 text-4xl font-black text-white tracking-tight">{company.name ?? 'Unknown Entity'}</h1>
          {(company.tagline ?? company.description) && (
            <p className="mt-4 text-xl font-medium text-slate-300 border-l-4 border-blue-500/50 pl-4">
              {company.tagline ?? company.description}
            </p>
          )}
          {company.location && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm font-bold text-slate-400">
              HQ: {company.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}