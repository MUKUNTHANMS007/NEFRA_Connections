import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Globe, MapPin, Calendar, Users, ArrowLeft, Zap, TrendingUp } from 'lucide-react';
import api from '../api';

export default function CompanyProfileView() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Invalid company.');
      return;
    }
    api
      .get('/companies/' + encodeURIComponent(id))
      .then((res) => setCompany(res.data))
      .catch((err) => {
        console.error('Failed to fetch company', err);
        setError('Company not found or failed to load.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-blue-400 animate-pulse text-xl">INITIALIZING_ENTITY_VIEW...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="w-full">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8">
            <p className="font-mono text-red-400 font-bold">{error ?? 'SIGNAL_LOST: Company not found.'}</p>
            <Link
              to="/explore-companies"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const name = company.name ?? 'Unknown Entity';
  const tagline = company.tagline ?? company.description ?? '';
  const domain = company.domainType ?? company.domain ?? company.industry ?? 'General';

  return (
    <div className="w-full">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/explore-companies"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          BACK_TO_DIRECTORY
        </Link>

        {/* Main Entity Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 lg:p-12 shadow-2xl">
          {/* Subtle top glow */}
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-400">
                <Zap className="h-3 w-3" /> {domain} Sector
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl">{name}</h1>
              {tagline && (
                <p className="text-lg font-medium text-slate-300 leading-relaxed max-w-2xl border-l-2 border-blue-500/30 pl-4">
                  {tagline}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
               <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <CheckCircle className="h-4 w-4" />
                Verified_Entity
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {company.founded && (
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950/40 p-4 border border-white/5 text-slate-300 font-bold text-sm">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>EST. {company.founded}</span>
              </div>
            )}
            {company.size && (
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950/40 p-4 border border-white/5 text-slate-300 font-bold text-sm">
                <Users className="h-5 w-5 text-emerald-500" />
                <span>{company.size}</span>
              </div>
            )}
            {company.location && (
              <div className="flex items-center gap-3 rounded-2xl bg-slate-950/40 p-4 border border-white/5 text-slate-300 font-bold text-sm">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span>{company.location}</span>
              </div>
            )}
            {company.website && (
              <a
                href={company.website.startsWith('http') ? company.website : 'https://' + company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-blue-600/10 p-4 border border-blue-500/30 text-blue-400 font-black text-sm hover:bg-blue-600/20 transition-all"
              >
                <Globe className="h-5 w-5" />
                <span>VISIT_NODE</span>
              </a>
            )}
          </div>

          {/* Detailed Description */}
          {company.description && (
            <div className="mt-12 border-t border-white/10 pt-10">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                <div className="h-px w-8 bg-slate-700" /> Entity_Operational_Brief
              </h2>
              <p className="text-slate-300 leading-relaxed font-medium">
                {company.description}
              </p>
            </div>
          )}

          {/* Stats Bar */}
          {company.stats && Array.isArray(company.stats) && company.stats.length > 0 && (
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-white/10 pt-10">
              {company.stats.map((s: { value?: string; label?: string }, i: number) => (
                <div key={i} className="text-center group">
                  <p className="text-3xl font-black font-mono text-white tracking-tighter group-hover:text-blue-400 transition-colors">
                    {s.value ?? '—'}
                  </p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {s.label ?? 'Metric'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Secondary Insights Section */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 relative z-10">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8">
            <h3 className="text-white font-bold flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-emerald-500" /> Growth_Parameters
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              Ecosystem analysis indicates high operational efficiency. Entity is currently flagged for strategic expansion within the {domain} sector.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8">
             <h3 className="text-white font-bold flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-blue-500" /> Network_Connection
            </h3>
            <p className="text-sm text-slate-400 font-medium">
              Establish a direct link with this entity to view secure capital projections and full founder credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}