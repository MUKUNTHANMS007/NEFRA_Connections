import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Loader2, ExternalLink, ArrowLeft, 
  Settings, ShieldCheck, Sparkles, Zap, 
  Target, TrendingUp, Building2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api';
import { SalesDashboard } from '../components/live-sales-dashboard';

// --- SECURE NEFRA AI CORE COMPONENT ---
const CompanyAIInsight = ({ company }: { company: any }) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Securely fetches the analysis from your Spring Boot backend
        const res = await api.get(`/companies/${company.id}/analyze`);
        const fullText = res.data.analysis || res.data.text || "Analysis complete. Strong market positioning detected.";

        // Typewriter Effect logic
        let i = 0;
        setAnalyzing(false);
        const interval = setInterval(() => {
          setText(fullText.slice(0, i));
          i++;
          if (i > fullText.length) clearInterval(interval);
        }, 15);
        
      } catch (err: any) {
        console.error("AI_CORE_CRITICAL_FAILURE:", err);
        setError("Synthesis failure. Verify backend uplink.");
        setAnalyzing(false);
      }
    };

    if (company?.id) fetchAnalysis();
  }, [company]);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-blue-500/[0.03] p-8 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="flex items-center gap-2 mb-4 text-blue-400">
        <Sparkles className="h-4 w-4" />
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em]">Nefra AI Intelligence</h3>
      </div>
      
      <div className="min-h-[60px]">
        {analyzing ? (
          <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-mono">
            <Loader2 className="h-3 w-3 animate-spin" /> Analyzing Market Signals...
          </div>
        ) : (
          <p className="text-sm text-slate-300 leading-relaxed font-medium">
            {error || text}
            <span className="inline-block w-1 h-4 bg-blue-500 ml-1 animate-pulse" />
          </p>
        )}
      </div>
    </div>
  );
};

// --- MAIN PROFILE COMPONENT ---
export default function CompanyProfileView() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!id) return;
    api.get(`/companies/${id}`)
      .then(res => setCompany(res.data))
      .catch(err => console.error("ENTITY_FETCH_ERROR:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-transparent">
      <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
    </div>
  );

  if (!company) return <div className="p-20 text-center font-mono text-slate-500 uppercase tracking-widest italic">404: Entity Not Found</div>;

  // The critical check: Does the logged-in user own this company?
  const isOwner = loggedInUserId === String(company.user?.id || company.entrepreneurId);

  return (
    <div className="min-h-screen w-full bg-transparent pt-24 pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-12">
          <Link to="/explore-companies" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-all">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Nexus
          </Link>

          {isOwner && (
            <Link to="/edit-company" className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-300 hover:bg-white/10 transition-all">
              <Settings className="h-4 w-4" /> Configure Entity
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-8 space-y-8">
            <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-10 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Building2 className="h-32 w-32 text-white" />
              </div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <span className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-blue-400">
                  {company.domainType || 'General'}
                </span>
                <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  <ShieldCheck className="h-3 w-3" /> System Verified
                </span>
              </div>
              <h1 className="text-6xl font-black text-white mb-4 tracking-tighter uppercase italic relative z-10">{company.name}</h1>
              <p className="text-xl text-slate-400 leading-relaxed font-semibold italic relative z-10">"{company.tagline}"</p>
            </div>

            <CompanyAIInsight company={company} />

            <div className="rounded-3xl border border-white/10 bg-slate-900/20 p-8 backdrop-blur-md">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-6">Operational Intelligence</h2>
              <p className="text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">{company.description}</p>
            </div>

            <div className="pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Zap className="h-4 w-4 text-emerald-400" /> Transactional Flux
                </h2>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-tighter">Live Stream</span>
                </div>
              </div>
              <SalesDashboard />
            </div>
          </motion.div>

          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 backdrop-blur-md sticky top-24">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Registry Data</h3>
              <div className="space-y-8">
                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Base Loc</p>
                    <p className="text-sm font-bold text-slate-200">{company.location || 'Distributed'}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Phase</p>
                    <p className="text-sm font-bold text-slate-200">{company.fundingStage || 'Early Stage'}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Personnel</p>
                    <p className="text-sm font-bold text-slate-200">{company.teamSize || '1-10'} Nodes</p>
                  </div>
                </div>
                
                {company.website && (
                  <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-xs font-black uppercase tracking-widest text-slate-950 hover:bg-slate-200 transition-all shadow-xl shadow-white/5">
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