import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Users, Zap } from 'lucide-react';
import api from '../api';

export default function Homepage() {
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    api.get('/posts/feed')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setRecentPosts(data.slice(0, 3));
      })
      .catch(() => setRecentPosts([]));
  }, []);

  const featured = [
    { name: 'Alex Thompson', role: 'Entrepreneur • Tech', verified: true, ref: 'Ref. 092 / 2026' },
    { name: 'Rachel Kim', role: 'Investor • Finance', verified: true, badge: 'Active Network', est: 'Est. 2026' },
  ];
  const stories = [
    { stat: 'Raised $5M', title: 'From Idea to Series A', desc: 'Connected with lead investor through NEFRA, closed $5M Series A round within 3 months.', author: 'David Park', tag: 'AI Analytics' },
    { stat: '3 Partnerships', title: 'Found the Perfect Co-Founder', desc: 'Met my technical co-founder here. We launched our MVP in 6 weeks and now have 10K users.', author: 'Lisa Martinez', tag: 'EdTech Startup' },
    { stat: 'Advisory Board', title: 'Expanded My Advisory Board', desc: 'Connected with 3 industry veterans who joined my advisory board and opened doors to enterprise clients.', author: 'James Wilson', tag: 'SaaS Platform' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-600">Network</p>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Build Your Network, <span className="text-blue-600">Fuel Your Growth</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-gray-600">
                Connect with entrepreneurs and investors shaping the future. Share your story, discover opportunities, and establish meaningful connections.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to={localStorage.getItem('userId') ? '/search' : '/signup'}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500"
                >
                  <Zap className="h-5 w-5" />
                  Establish Connection
                </Link>
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Explore Registry
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {featured.map((p, i) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                        {p.verified && <CheckCircle className="h-5 w-5 text-green-600" />}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{p.role}</p>
                      {'ref' in p && <p className="mt-2 text-xs text-gray-500">{p.ref}</p>}
                      {'badge' in p && (
                        <p className="mt-2 text-xs font-medium text-blue-600">
                          {(p as { badge: string }).badge} · {(p as { est: string }).est}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Connections */}
      <section className="border-b border-gray-200 bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500">Latest Activity</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900">Recent Connections</h2>
            </div>
            <Link to="/search" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View All →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">No recent activity yet.</p>
            ) : (
              recentPosts.map((p: any, i: number) => (
                <div key={p.id ?? i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  {p.authorName != null && (
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{p.authorName}</h3>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  <p className="mt-1 text-sm text-gray-600">{p.description ?? p.content ?? ''}</p>
                  {p.imageUrl != null && p.imageUrl !== '' && (
                    <img src={String(p.imageUrl)} alt="Post attachment" className="mt-3 rounded-lg object-cover max-h-48 w-full" />
                  )}
                  {p.createdAt != null && !isNaN(new Date(p.createdAt).getTime()) && (
                    <p className="mt-2 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="border-b border-gray-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-medium uppercase tracking-wider text-gray-500">Success Stories</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">Real Connections, Real Results</h2>
          <p className="mt-2 text-gray-600">
            Discover how our community members turned connections into partnerships, funding, and growth.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {stories.map((s, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <p className="text-2xl font-bold text-blue-600">{s.stat}</p>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
                <p className="mt-4 text-xs text-gray-500">{s.author} · {s.tag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Your Next Connection Awaits</h2>
          <p className="mt-4 text-gray-600">
            Join entrepreneurs and investors building the future. Share your story and discover opportunities today.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to={localStorage.getItem('userId') ? '/search' : '/signup'}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500"
            >
              <Users className="h-5 w-5" />
              Establish Connection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
