import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle, Globe, MapPin, Calendar, Users, 
  ArrowLeft, Zap, TrendingUp, BarChart3, Loader2, Target 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../api';

// --- SUB-COMPONENT: AI DEEP ANALYSIS ---
function CompanyAIDashboard({ company }: { company: any }) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAnalysis = async () => {
      try {
        const masterPrompt = `
          Analyze this startup:
          - Name: ${company.name}
          - Industry: ${company.domainType || company.industry}
          - Bio: ${company.description}
          - Core Solution: ${company.solution || 'Information not provided'}
          - Historical context: ${company.pastData || 'Early stage growth'}
          
          Provide a professional VC briefing in Markdown:
          ### 1. Solution Viability
          (Analyze if their solution effectively solves the market problem)
          ### 2. Strategic Advantage
          (How they stand out against competitors)
          ### 3. Future Projection
          (Predictive outlook based on current trajectory)
        `;

        const res = await api.post('/ai/ask', { prompt: masterPrompt });
        setAnalysis(res.data);
      } catch (err) {
        setAnalysis("### Neural Link Failure\nUnable to ingest company context. Please verify backend connectivity.");
      } finally {
        setLoading(false);
      }
    };
    getAnalysis();
  }, [company.id]);

  return (
    <div className="md:col-span-2 rounded-[2.5rem] border border-blue-500/20 bg-slate-900/60 backdrop-blur-xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-white font-black flex items-center gap-2 text-sm uppercase tracking-widest">
          <Zap className="h-5 w-5 text-blue-500" /> DEEP_CONTEXT_ANALYSIS
        </h3>
        <div className="flex gap-2">
           <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">BIO_INGESTED</span>
           <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">HISTORY_MAPPED</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-12 gap-4">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest animate-pulse">Cross-referencing historical benchmarks...</p>
        </div>
      ) : (
        <div className="prose prose-invert prose-sm max-w-none prose-h3:text-blue-400 prose-h3:mt-6 prose-h3:mb-2 prose-p:text-slate-300">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function CompanyProfileView() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.get('/companies/' + encodeURIComponent(id))
      .then((res) => setCompany(res.data))
      .catch(() => setError('SIGNAL_LOST: Entity data unretrievable.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-950">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
        <p className="font-mono text-blue-400 text-sm tracking-[0.3em]">INITIALIZING_SECURE_LINK...</p>
      </div>
    </div>
  );

  if (error || !company) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="max-w-md w-full rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center backdrop-blur-xl">
        <p className="font-mono text-red-400 font-bold mb-6">{error}</p>
        <Link to="/explore-companies" className="inline-flex items-center gap-2 text-sm font-bold text-white bg-red-500/20 px-6 py-3 rounded-xl hover:bg-red-500/30 transition-all">
          <ArrowLeft className="h-4 w-4" /> REBOOT_DIRECTORY
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <Link to="/explore-companies" className="group mb-12 inline-flex items-center gap-2 text-xs font-black tracking-widest text-slate-500 hover:text-blue-400 transition-colors">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> BACK_TO_CENTRAL_CORE
        </Link>

        {/* Hero Section */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-slate-900/40 backdrop-blur-2xl p-8 md:p-12">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-transparent to-emerald-600 opacity-50" />
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                  {company.domainType || 'Global'} // MISSION_SECTOR
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  <CheckCircle className="h-3 w-3" /> VERIFIED_ENTITY
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 italic uppercase">
                {company.name}
              </h1>
              
              <p className="text-xl text-slate-400 font-medium leading-relaxed border-l-4 border-blue-600 pl-6 py-2">
                {company.tagline || company.description?.substring(0, 120) + "..."}
              </p>
            </div>

            {/* THE AI DASHBOARD SECTION */}
            <div className="grid gap-8 md:grid-cols-2">
              <CompanyAIDashboard company={company} />
              
              <div className="space-y-8">
                {/* Historical Milestones */}
                <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-8">
                  <h3 className="text-white font-black flex items-center gap-2 mb-8 text-xs uppercase tracking-[0.2em]">
                    <Calendar className="h-5 w-5 text-blue-500" /> HISTORICAL_TIMELINE
                  </h3>
                  <div className="space-y-8">
                    {(company.milestones || [
                      { year: '2023', event: 'Initial Seed - Global Network Expansion' },
                      { year: '2024', event: 'V2.0 Core Architecture Deployed' },
                      { year: '2025', event: 'Strategic Market Dominance Phase' }
                    ]).map((m: any, i: number) => (
                      <div key={i} className="relative pl-8 border-l border-white/5">
                        <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6]" />
                        <p className="text-[10px] font-black text-blue-400 mb-1">{m.year}</p>
                        <p className="text-sm text-slate-200 font-bold leading-tight">{m.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Growth Parameters */}
                <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-blue-600/10 to-transparent p-8">
                  <h3 className="text-white font-black flex items-center gap-2 mb-6 text-xs uppercase tracking-[0.2em]">
                    <TrendingUp className="h-5 w-5 text-emerald-500" /> GROWTH_PARAMS
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-2xl font-black text-white tracking-tighter">84%</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase mt-1">Efficiency</p>
                    </div>
                    <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5 text-center">
                      <p className="text-2xl font-black text-white tracking-tighter">1.2M</p>
                      <p className="text-[8px] text-slate-500 font-black uppercase mt-1">Injected_Cap</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/40 p-8 space-y-8">
              <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] border-b border-white/5 pb-4">
                Entity_Metadata
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Location</p>
                    <p className="text-sm font-bold text-slate-200">{company.location || 'Global Remote'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                    <Users className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Team_Scale</p>
                    <p className="text-sm font-bold text-slate-200">{company.size || '11-50 Units'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center group-hover:border-blue-400/50 transition-colors">
                    <Target className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase">Target_Market</p>
                    <p className="text-sm font-bold text-slate-200 uppercase">{company.industry || 'B2B_CORE'}</p>
                  </div>
                </div>
              </div>

              <a 
                href={company.website?.startsWith('http') ? company.website : 'https://' + company.website} 
                target="_blank" 
                className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest hover:bg-blue-400 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                Establish_External_Link <Globe className="h-4 w-4" />
              </a>
            </div>

            <div className="rounded-[2.5rem] border border-white/10 bg-blue-600/10 p-8">
              <h4 className="text-white font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-400" /> Solution_Brief
              </h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {company.solution || "The entity is currently developing a proprietary architecture to disrupt conventional B2B operational flows."}
              </p>
            </div>
          </div>

        </div>

        {/* Full Operational Description */}
        <div className="mt-12 rounded-[3rem] border border-white/10 bg-slate-900/20 p-8 md:p-16">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-600 mb-10 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-800" /> ENTITY_OPERATIONAL_LOG <div className="h-px flex-1 bg-slate-800" />
          </h2>
          <p className="text-lg text-slate-400 font-medium leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-blue-500 first-letter:mr-3 first-letter:float-left">
            {company.description}
          </p>
        </div>

      </div>
    </div>
  );
}