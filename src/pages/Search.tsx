import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, CheckCircle } from 'lucide-react';
import api from '../api';
import type { UserListItem } from '../types/user';

const FILTERS = ['All', 'Entrepreneurs', 'Investors', 'Tech', 'Finance', 'Healthcare'] as const;

export default function Search() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    api.get<UserListItem[]>('/search/users') 
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Search fetch error:", err);
        setError('Server connection error.');
      });
  }, []);

  const displayName = (u: UserListItem) => u.fullName ?? u.full_name ?? u.username ?? String(u.id);
  
  const avatarUrl = (u: UserListItem) =>
    (u as any).profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName(u) || 'User')}&background=random&color=fff`;

  const subtitle = (u: UserListItem) => {
    const company = (u as any).company ?? '';
    const loc = (u as any).location ?? (u as any).domainType ?? '';
    if (company && loc) return `${company} · ${loc}`;
    return company || loc || '';
  };

  const filtered = users.filter((u) => {
    const name = displayName(u).toLowerCase();
    const role = (u.role ?? '').toLowerCase();
    const loc = ((u as any).location ?? '').toLowerCase();
    const domain = ((u as any).domainType ?? '').toLowerCase();
    
    const matchQuery = !query.trim() || 
                       name.includes(query.toLowerCase()) || 
                       role.includes(query.toLowerCase()) ||
                       loc.includes(query.toLowerCase());

    if (activeFilter === 'All') return matchQuery;
    if (activeFilter === 'Entrepreneurs') return matchQuery && (role.includes('entrepreneur') || role === 'founder');
    if (activeFilter === 'Investors') return matchQuery && role.includes('investor');
    if (['Tech', 'Finance', 'Healthcare'].includes(activeFilter)) {
        return matchQuery && (domain.includes(activeFilter.toLowerCase()) || loc.includes(activeFilter.toLowerCase()));
    }
    return matchQuery;
  });

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
          <div className="h-1 w-8 bg-blue-600" /> Database_Query
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">The Connection Registry</h1>
        <p className="mt-4 max-w-2xl text-lg font-medium text-slate-400 leading-relaxed">
          Search entrepreneurs and investors by industry, role, or company. Find your next co-founder, investor, or strategic partner.
        </p>

        {/* Glassmorphic Search bar */}
        <div className="relative mt-10">
          <SearchIcon className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, location, or industry..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl py-4 pl-14 pr-4 text-white shadow-xl transition-all duration-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          />
        </div>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold tracking-wide transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-500'
                  : 'border border-white/10 bg-slate-900/40 backdrop-blur-md text-slate-400 hover:border-white/20 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="font-mono text-sm font-bold text-red-400">{error}</p>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-b border-white/10 pb-4">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Query Results</p>
          <p className="font-mono text-sm font-bold text-blue-400">[{filtered.length}] NODES_FOUND</p>
        </div>
        
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <Link
              key={String(u.id)}
              to={`/profile/${u.id}`}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900/60 hover:shadow-blue-900/20"
            >
              <div className="flex items-start gap-4">
                <img
                  src={avatarUrl(u)}
                  alt="Profile Avatar"
                  className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white/10 transition-all duration-300 group-hover:ring-blue-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 truncate">{displayName(u)}</h3>
                    {(u as { verified?: boolean }).verified !== false && (
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                    )}
                  </div>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-blue-400">{u.role ?? 'Member'}</p>
                  {subtitle(u) && <p className="mt-2 text-sm font-medium text-slate-400 truncate">{subtitle(u)}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && !error && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-12 text-center">
            <p className="font-mono text-slate-400">0_RESULTS. ADJUST_PARAMETERS.</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 rounded-[2rem] border border-blue-500/20 bg-gradient-to-br from-slate-900/80 to-slate-950 p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.1),transparent_50%)]" />
          <h2 className="relative z-10 text-2xl font-black text-white tracking-tight sm:text-3xl">Not finding the right node?</h2>
          <p className="relative z-10 mt-4 text-slate-400 font-medium">Optimize your own profile to attract inbound requests from high-value connections.</p>
          <Link
            to="/profile"
            className="relative z-10 mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 font-black uppercase tracking-widest text-slate-900 shadow-lg transition-all duration-200 hover:bg-slate-200 hover:scale-105"
          >
            Optimize Profile
          </Link>
        </div>
      </div>
    </div>
  );
}