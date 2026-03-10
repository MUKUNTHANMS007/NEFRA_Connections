import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Users, Zap } from 'lucide-react';
import api from '../api';

// THE UPGRADE: Import the new 3D Ethereal Beams component
import { EtherealBeamsHero } from '@/components/ethereal-beams-hero';

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

  const stories = [
    { stat: 'Raised $5M', title: 'From Idea to Series A', desc: 'Connected with lead investor through NEFRA, closed $5M Series A round within 3 months.', author: 'David Park', tag: 'AI Analytics' },
    { stat: '3 Partnerships', title: 'Found the Perfect Co-Founder', desc: 'Met my technical co-founder here. We launched our MVP in 6 weeks and now have 10K users.', author: 'Lisa Martinez', tag: 'EdTech Startup' },
    { stat: 'Advisory Board', title: 'Expanded My Advisory Board', desc: 'Connected with 3 industry veterans who joined my advisory board and opened doors to enterprise clients.', author: 'James Wilson', tag: 'SaaS Platform' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 3D Ethereal Beams Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10 bg-black">
        <EtherealBeamsHero />
      </div>

      {/* Recent Connections / Live Activity */}
      <section className="relative border-b border-white/10 bg-slate-950 px-4 py-20 sm:px-6 lg:px-8 z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[1000px] bg-blue-900/10 blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                <div className="h-1 w-8 bg-blue-600" /> Network_Status
              </p>
              <h2 className="mt-4 text-3xl font-black text-white tracking-tight">Global Signal Feed</h2>
            </div>
            <Link to="/search" className="inline-flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Scan Network <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-10 text-center shadow-lg">
                <p className="text-slate-400 font-medium">No active signals detected in the network.</p>
              </div>
            ) : (
              recentPosts.map((p: any, i: number) => (
                <div key={p.id ?? i} className="group rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-lg hover:bg-slate-900/60 hover:-translate-y-1 transition-all">
                  {p.authorName != null && (
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 group-hover:text-blue-300 transition-colors">{p.authorName}</h3>
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                  )}
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed font-medium line-clamp-3">
                    {p.description ?? p.content ?? ''}
                  </p>
                  {p.imageUrl != null && p.imageUrl !== '' && (
                    <img src={String(p.imageUrl)} alt="Post attachment" className="mt-4 rounded-xl border border-white/10 object-cover max-h-48 w-full shadow-md" />
                  )}
                  {p.createdAt != null && !isNaN(new Date(p.createdAt).getTime()) && (
                    <p className="mt-4 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500">
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
      <section className="relative border-b border-white/10 bg-slate-950 px-4 py-24 sm:px-6 lg:px-8 overflow-hidden z-10">
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] bg-emerald-900/10 blur-[120px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 flex items-center gap-2">
            <div className="h-1 w-8 bg-emerald-600" /> Verified_Metrics
          </p>
          <h2 className="mt-4 text-3xl font-black text-white tracking-tight">Real Connections. Real ROI.</h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl font-medium">
            Discover how ecosystem members turned simple introductions into exponential growth, funding, and scale.
          </p>
          
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {stories.map((s, i) => (
              <div key={i} className="rounded-3xl border border-white/10 bg-slate-900/30 backdrop-blur-xl p-8 hover:bg-slate-900/50 transition-colors shadow-2xl">
                <div className="inline-flex items-center justify-center rounded-xl bg-emerald-500/10 p-3 mb-6 border border-emerald-500/20">
                  <Zap className="h-6 w-6 text-emerald-400" />
                </div>
                <p className="text-3xl font-black font-mono text-emerald-400 tracking-tighter">{s.stat}</p>
                <h3 className="mt-4 text-xl font-bold text-white">{s.title}</h3>
                <p className="mt-4 text-sm text-slate-300 leading-relaxed font-medium">{s.desc}</p>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs font-bold text-slate-200">{s.author}</p>
                  <p className="text-[10px] font-mono tracking-widest uppercase text-blue-400 mt-1">{s.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-32 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_50%)]" />
        
        <div className="relative z-10 mx-auto max-w-4xl rounded-[2.5rem] border border-blue-500/30 bg-slate-900/60 backdrop-blur-2xl p-12 md:p-20 text-center shadow-2xl shadow-blue-900/20">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Your Next Node Awaits</h2>
          <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            Stop guessing. Start scaling. Join an elite collective of founders and capital allocators engineering the future of commerce.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to={localStorage.getItem('userId') ? '/search' : '/signup'}
              className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 text-sm font-black tracking-widest uppercase text-white hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105"
            >
              <Users className="h-5 w-5" />
              {localStorage.getItem('userId') ? 'Scan Network' : 'Establish Connection'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}