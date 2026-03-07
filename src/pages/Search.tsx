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
    // THE FIX: Hit the SearchController and pass the required 'role'
    api.get<UserListItem[]>('/search/users', { params: { role: 'ENTREPRENEUR' } })
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Search fetch error:", err);
        setError('Server connection error.');
      });
  }, []);

  const displayName = (u: UserListItem) => u.fullName ?? u.full_name ?? u.username ?? String(u.id);
  const filtered = users.filter((u) => {
    const name = displayName(u).toLowerCase();
    const role = (u.role ?? '').toLowerCase();
    const matchQuery = !query.trim() || name.includes(query.toLowerCase()) || role.includes(query.toLowerCase());
    if (activeFilter === 'All') return matchQuery;
    if (activeFilter === 'Entrepreneurs') return matchQuery && (role.includes('entrepreneur') || role === 'founder');
    if (activeFilter === 'Investors') return matchQuery && role.includes('investor');
    if (['Tech', 'Finance', 'Healthcare'].includes(activeFilter)) return matchQuery;
    return matchQuery;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-wider text-gray-500">Discovery</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">The Connection Registry</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Search entrepreneurs and investors by industry, role, or company. Find your next co-founder, investor, or strategic partner.
        </p>

        {/* Search bar */}
        <div className="relative mt-8">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, role, or industry..."
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeFilter === f
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {error && <p className="mt-6 text-red-600">{error}</p>}

        <p className="mt-8 text-sm text-gray-500">Showing {filtered.length} results</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((u) => (
            <div key={String(u.id)} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{displayName(u)}</h3>
                {(u as { verified?: boolean }).verified !== false && <CheckCircle className="h-4 w-4 text-green-600" />}
              </div>
              <p className="mt-1 text-sm text-gray-600">{u.role ?? 'Member'}</p>
              <p className="text-sm text-gray-500">{(u as { company?: string }).company ?? ''} · {u.role ?? '—'}</p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !error && (
          <p className="mt-8 text-gray-500">No results. Try a different search or filter.</p>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Not finding who you&apos;re looking for?</h2>
          <p className="mt-2 text-gray-600">Be the first to establish a new connection. Share your story and attract the right people.</p>
          <Link to="/signup" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500">
            Establish Connection
          </Link>
        </div>
      </div>
    </div>
  );
}
