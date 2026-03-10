import { useEffect, useState } from 'react';
import { Building2, Globe, MapPin, ExternalLink, UserPlus, Search as SearchIcon } from 'lucide-react';
import api from '../api';

const DOMAIN_FILTERS = ['All', 'Technology', 'Finance', 'Healthcare', 'E-commerce', 'SaaS', 'Other'] as const;

export default function ExploreCompanies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    api
      .get('/companies')
      .then((res) => setCompanies(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error('Failed to fetch companies', err);
        setError('Failed to load companies.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleFollow = async (e: React.MouseEvent, entrepreneurId: string | number | null | undefined) => {
    e.stopPropagation();
    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) return;
    const eId = entrepreneurId != null ? String(entrepreneurId) : null;
    if (!eId) return;
    if (currentUserId === eId) {
      alert('You cannot follow yourself');
      return;
    }
    try {
      await api.post('/follows/' + currentUserId + '/follow/' + eId);
      setFollowedIds((prev) => new Set(prev).add(eId));
    } catch (err) {
      console.error('Follow failed', err);
    }
  };

  const filtered = companies.filter((c) => {
    const matchDomain =
      domainFilter === 'All' ||
      (c.domainType ?? c.domain ?? c.industry ?? '').toLowerCase().includes(domainFilter.toLowerCase());
    const matchSearch =
      !searchQuery.trim() ||
      (c.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tagline ?? c.description ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchDomain && matchSearch;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-blue-400 animate-pulse text-xl tracking-tighter">INITIALIZING_DIRECTORY_SCAN...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
          <div className="h-1 w-8 bg-blue-600" /> Entity_Registry
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Explore Ventures
        </h1>
        <p className="mt-4 max-w-2xl text-lg font-medium text-slate-400 leading-relaxed">
          Discover high-growth startups across the NEFRA ecosystem. Connect with visionary founders and track emerging investment nodes.
        </p>

        {/* Search Input */}
        <div className="relative mt-10">
          <SearchIcon className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by venture name or mission parameters..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl py-4 pl-14 pr-4 text-white shadow-xl transition-all duration-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>

        {/* Domain Filters */}
        <div className="mt-8 flex flex-wrap gap-3">
          {DOMAIN_FILTERS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomainFilter(d)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold tracking-wide transition-all duration-200 ${
                domainFilter === d
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-500'
                  : 'border border-white/10 bg-slate-900/40 backdrop-blur-md text-slate-400 hover:border-white/20 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="font-mono text-sm font-bold text-red-400">{error}</p>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between border-b border-white/10 pb-4">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Active Entities</p>
          <p className="font-mono text-sm font-bold text-blue-400">[{filtered.length}] NODES_ONLINE</p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={String(c.id)}
              onClick={() => window.open('/company_profile/' + c.id, '_blank')}
              className="group relative cursor-pointer rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900/60 hover:shadow-blue-900/20 overflow-hidden"
            >
              {/* Subtle accent hover */}
              <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all" />

              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-950/50 border border-white/10 shadow-inner group-hover:border-blue-500/30 transition-colors">
                  <Building2 className="h-7 w-7 text-blue-400/80 group-hover:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-bold text-slate-100 group-hover:text-blue-300 transition-colors truncate">
                        {c.name ?? 'Unnamed Entity'}
                      </h3>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-slate-600 group-hover:text-blue-400 transition-colors" />
                  </div>
                  
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-400 leading-relaxed">
                    {c.tagline ?? c.description ?? 'No operational description provided.'}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {(c.domainType ?? c.domain ?? c.industry) && (
                      <span className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-blue-400">
                        {c.domainType ?? c.domain ?? c.industry}
                      </span>
                    )}
                    
                    {(c.entrepreneurId ?? c.userId) != null && (
                      <button
                        type="button"
                        onClick={(ev) => handleFollow(ev, c.entrepreneurId ?? c.userId)}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all ${
                          followedIds.has(String(c.entrepreneurId ?? c.userId))
                            ? 'bg-slate-800 text-slate-400 border border-white/10'
                            : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        <UserPlus className="h-3 w-3" />
                        {followedIds.has(String(c.entrepreneurId ?? c.userId)) ? 'Tracking' : 'Follow'}
                      </button>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                    {c.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-blue-500/60" />
                        {c.location}
                      </span>
                    )}
                    {c.website && (
                      <span className="flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5 text-emerald-500/60" />
                        {c.website.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !error && (
          <div className="mt-16 rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-16 text-center shadow-2xl">
            <Building2 className="mx-auto h-16 w-16 text-slate-800" />
            <p className="mt-6 text-xl font-bold text-slate-400">0_ENTITIES_FOUND. RE-MAP_QUERY.</p>
            <button 
              onClick={() => {setSearchQuery(''); setDomainFilter('All');}}
              className="mt-6 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Reset Search Parameters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}