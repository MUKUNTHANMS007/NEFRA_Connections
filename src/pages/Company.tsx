import { Link } from 'react-router-dom';
import { CheckCircle, Globe, MapPin, Calendar, Users, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

// UI Components - Make sure these paths match your project structure!
import { AuroraBackground } from '../components/ui/aurora-background';
import { BorderBeam } from '../components/ui/border-beam';

export default function Company() {
  // This is your hardcoded dummy data. (Later, you will replace this with an api.get('/company/1') call)
  const company = {
    name: 'TechVentures',
    tagline: 'Building the future of AI-powered enterprise solutions',
    founded: '2021',
    size: '50-100 employees',
    location: 'San Francisco, CA',
    website: 'www.techventures.com',
    description: 'TechVentures is a leading AI-powered enterprise solutions provider, helping businesses transform their operations through cutting-edge technology. We specialize in machine learning, data analytics, and automation solutions that drive real business value.',
    stats: [
      { value: '75+', label: 'Employees' },
      { value: '120+', label: 'Clients' },
      { value: '200+', label: 'Projects' },
      { value: '15+', label: 'Countries' },
    ],
    metrics: [
      { label: 'System Uptime', value: '99.9%', change: '+0.2%' },
      { label: 'Client Satisfaction', value: '4.8/5', change: '+0.3' },
      { label: 'AI Models Deployed', value: '150+', change: '+25' },
      { label: 'YoY Revenue Growth', value: '180%', change: '+45%' },
    ],
    values: [
      { title: 'Innovation First', desc: 'We push boundaries and embrace new technologies to deliver cutting-edge solutions.' },
      { title: 'Collaborative Culture', desc: 'We believe in the power of teamwork and open communication across all levels.' },
      { title: 'Measurable Impact', desc: 'Every project we undertake is designed to deliver tangible business results.' },
    ],
    team: [
      { name: 'Sarah Chen', role: 'Founder & CEO' },
      { name: 'Marcus Rodriguez', role: 'CTO' },
      { name: 'Emily Zhang', role: 'Head of Product' },
      { name: 'David Park', role: 'Head of Engineering' },
    ],
  };

  return (
    <AuroraBackground className="w-full min-h-screen">
      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-20 w-full">
        
        {/* Main Glass Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 backdrop-blur-xl p-8 lg:p-14 shadow-2xl ring-1 ring-slate-900/5">
          <BorderBeam size={500} duration={12} colorFrom="#3b82f6" colorTo="#10b981" />

          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between border-b border-slate-900/10 pb-10">
            <div className="flex-1">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter drop-shadow-sm">{company.name}</h1>
              <p className="mt-4 text-xl font-medium text-slate-700 max-w-2xl border-l-4 border-blue-500/60 pl-4">
                {company.tagline}
              </p>
              
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-700 shadow-sm">
                  <Zap className="h-3 w-3" /> Technology Sector
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 shadow-sm">
                  <CheckCircle className="h-3 w-3" /> System Verified
                </span>
              </div>
            </div>
            
            <button type="button" className="shrink-0 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg hover:bg-blue-500 hover:-translate-y-1 transition-all">
              + FOLLOW_ENTITY
            </button>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 rounded-2xl bg-white/50 backdrop-blur-sm p-4 border border-white/60 text-slate-700 font-medium">
              <Calendar className="h-5 w-5 text-blue-600" /> Founded {company.founded}
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/50 backdrop-blur-sm p-4 border border-white/60 text-slate-700 font-medium">
              <Users className="h-5 w-5 text-emerald-600" /> {company.size}
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/50 backdrop-blur-sm p-4 border border-white/60 text-slate-700 font-medium">
              <MapPin className="h-5 w-5 text-blue-600" /> {company.location}
            </div>
            <a href={`https://${company.website}`} className="flex items-center gap-3 rounded-2xl bg-white/50 backdrop-blur-sm p-4 border border-white/60 text-blue-700 font-bold hover:bg-white/80 transition-colors">
              <Globe className="h-5 w-5" /> {company.website}
            </a>
          </div>

          <p className="mt-10 text-lg leading-relaxed text-slate-700 font-medium">
            {company.description}
          </p>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-slate-900/10 pt-10">
            {company.stats.map((s, i) => (
              <div key={i} className="text-center group">
                <p className="text-4xl font-black font-mono text-blue-700 mb-2 group-hover:scale-110 transition-transform">{s.value}</p>
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <section className="mt-16">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-blue-700 flex items-center gap-2 mb-8">
            <div className="h-1 w-8 bg-blue-600" /> Industry_Performance_Metrics
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {company.metrics.map((m, i) => (
              <div key={i} className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl p-6 shadow-lg hover:bg-white/60 transition-all hover:-translate-y-1">
                <p className="text-sm font-bold text-emerald-600 mb-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" /> {m.change}
                </p>
                <p className="text-3xl font-black text-slate-900 mb-1">{m.value}</p>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-500">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Core Values & Team Grid */}
        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700 flex items-center gap-2 mb-8">
              <div className="h-1 w-8 bg-emerald-600" /> Core_Directives
            </h2>
            <div className="space-y-4">
              {company.values.map((v, i) => (
                <div key={i} className="rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl p-6 shadow-md">
                  <h3 className="font-black text-slate-900 text-lg">{v.title}</h3>
                  <p className="mt-2 text-sm font-medium text-slate-700 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-700 flex items-center gap-2 mb-8">
              <div className="h-1 w-8 bg-slate-600" /> Leadership_Matrix
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {company.team.map((t, i) => (
                <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl p-5 shadow-md hover:bg-white/60 transition-all">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black shadow-inner">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs font-mono font-bold text-blue-700 tracking-wider uppercase">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CTA Section */}
        <div className="mt-16 relative overflow-hidden rounded-[2rem] border border-blue-500/30 bg-gradient-to-br from-blue-900 to-slate-900 p-12 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
          <ShieldCheck className="h-16 w-16 text-blue-400 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-black text-white tracking-tight relative z-10">INITIATE_PROTOCOL: Join our journey</h2>
          <p className="mt-4 text-blue-200 font-medium relative z-10 max-w-xl mx-auto">
            We are actively scanning the ecosystem for high-tier individuals who share our directive for pure innovation.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 relative z-10">
            <button type="button" className="rounded-xl bg-emerald-500 px-8 py-3.5 font-bold text-white hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105">
              VIEW_OPENINGS
            </button>
            <Link to="/search" className="rounded-xl border border-white/30 bg-white/10 backdrop-blur-md px-8 py-3.5 font-bold text-white hover:bg-white/20 transition-all">
              CONTACT_NODE
            </Link>
          </div>
        </div>

      </div>
    </AuroraBackground>
  );
}