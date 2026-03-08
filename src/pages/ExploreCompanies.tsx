import { useEffect, useState } from 'react';
import { Building2, Globe, MapPin, ExternalLink, UserPlus } from 'lucide-react';
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading companies…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Directory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Explore Companies
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Discover startups and ventures across industries. Connect with founders and explore investment opportunities.
        </p>

        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or description..."
          className="mt-8 w-full rounded-xl border border-slate-200 bg-white py-3.5 px-4 text-slate-900 shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />

        <div className="mt-6 flex flex-wrap gap-2">
          {DOMAIN_FILTERS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomainFilter(d)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                domainFilter === d
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {error && <p className="mt-6 text-red-600">{error}</p>}

        <p className="mt-10 text-sm text-slate-500">Showing {filtered.length} companies</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={String(c.id)}
              onClick={() => window.open('/company_profile/' + c.id, '_blank')}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <Building2 className="h-6 w-6 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 truncate">
                        {c.name ?? 'Unnamed Company'}
                      </h3>
                      {(c.entrepreneurId ?? c.userId) != null && (
                        <button
                          type="button"
                          onClick={(ev) => handleFollow(ev, c.entrepreneurId ?? c.userId)}
                          className={`shrink-0 flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                            followedIds.has(String(c.entrepreneurId ?? c.userId))
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                          }`}
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          {followedIds.has(String(c.entrepreneurId ?? c.userId)) ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                    {c.tagline ?? c.description ?? '—'}
                  </p>
                  {(c.domainType ?? c.domain ?? c.industry) && (
                    <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {c.domainType ?? c.domain ?? c.industry}
                    </span>
                  )}
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    {c.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {c.location}
                      </span>
                    )}
                    {c.website && (
                      <span className="flex items-center gap-1">
                        <Globe className="h-3.5 w-3.5" />
                        {c.website}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !error && (
          <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Building2 className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-600">No companies found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
