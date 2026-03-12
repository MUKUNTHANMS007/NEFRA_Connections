import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Loader2, ExternalLink, ArrowLeft, Settings, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';

export default function CompanyProfileView() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!id) return;
    api.get(`/companies/${id}`)
      .then(res => setCompany(res.data))
      .catch(err => console.error("Data retrieval failure:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
    </div>
  );

  if (!company) return <div className="p-20 text-center text-slate-500">Entity not found.</div>;

  // The critical permission check
  const isOwner = loggedInUserId === String(company.user?.id || company.entrepreneurId);

  return (
    <div className="min-h-screen w-full bg-transparent pt-24 pb-20 selection:bg-indigo-500/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-12">
          <Link to="/explore-companies" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Directory
          </Link>

          {isOwner && (
            <Link to="/edit-company" className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 transition-all">
              <Settings className="h-4 w-4" /> Manage Entity
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-10 backdrop-blur-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  {company.domainType || 'General'}
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 tracking-tighter">{company.name}</h1>
              <p className="text-xl text-slate-400 leading-relaxed font-medium italic">{company.tagline}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/20 p-8 backdrop-blur-md">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Operational Brief</h2>
              <p className="text-slate-300 leading-relaxed">{company.description}</p>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/20 p-8 backdrop-blur-md">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-6">Entity Metadata</h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-center">
                  <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Location</p>
                    <p className="text-sm font-semibold text-slate-200">{company.location || 'Global Remote'}</p>
                  </div>
                </div>
                
                {company.website && (
                  <a href={company.website} target="_blank" className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-slate-950 hover:bg-slate-200 transition-all">
                    Establish Link <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}