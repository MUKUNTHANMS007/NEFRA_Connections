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
    // THE FIX: Unlocked the API. We fetch everyone, then let React filter them locally.
    // Note: If '/search/users' fails without parameters, change this to just '/users'
    api.get<UserListItem[]>('/search/users') 
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Search fetch error:", err);
        setError('Server connection error.');
      });
  }, []);

  const displayName = (u: UserListItem) => u.fullName ?? u.full_name ?? u.username ?? String(u.id);
  
  // THE FIX: Secure fallback for avatars with dynamic coloring
  const avatarUrl = (u: UserListItem) =>
    (u as any).profileImageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName(u) || 'User')}&background=random&color=fff`;

  // THE FIX: Prevents the "ENTREPRENEUR · ENTREPRENEUR" duplication bug
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
    
    // Upgraded search to include location and domain checks
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in-up">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Discovery</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">The Connection Registry</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Search entrepreneurs and investors by industry, role, or company. Find your next co-founder, investor, or strategic partner.
        </p>

        {/* Search bar */}
        <div className="relative mt-10">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, location, or industry..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeFilter === f
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {error && <p className="mt-6 text-red-600">{error}</p>}

        <p className="mt-10 text-sm text-slate-500">Showing {filtered.length} results</p>
        
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <div
              key={String(u.id)}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <img
                  src={avatarUrl(u)}
                  alt="Profile Avatar"
                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-slate-100 transition-all duration-300 group-hover:ring-blue-100"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{displayName(u)}</h3>
                    {(u as { verified?: boolean }).verified !== false && (
                      <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-slate-600">{u.role ?? 'Member'}</p>
                  {subtitle(u) && <p className="mt-1 text-sm text-slate-500">{subtitle(u)}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !error && (
          <p className="mt-10 text-slate-500">No results. Try a different search or filter.</p>
        )}

        {/* CTA */}
        <div className="mt-20 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-12 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Not finding who you're looking for?</h2>
          <p className="mt-3 text-slate-600">Be the first to establish a new connection. Share your story and attract the right people.</p>
          <Link
            to="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30"
          >
            Establish Connection
          </Link>
        </div>
      </div>
    </div>
  );
}