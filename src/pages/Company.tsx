import { Link } from 'react-router-dom';
import { CheckCircle, Globe, MapPin, Calendar, Users } from 'lucide-react';

export default function Company() {
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
              <p className="mt-2 text-gray-600">{company.tagline}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">Technology</span>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-500">Verified</span>
              </div>
            </div>
            <button type="button" className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-500">
              + Follow Company
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>Founded {company.founded}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Users className="h-5 w-5" />
              <span>Company Size {company.size}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{company.location}</span>
            </div>
            <a href={`https://${company.website}`} className="flex items-center gap-3 text-blue-600 hover:text-blue-500">
              <Globe className="h-5 w-5" />
              <span>{company.website}</span>
            </a>
          </div>

          <p className="mt-8 text-gray-600">{company.description}</p>

          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {company.stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold text-blue-600">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">Industry Performance Metrics</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {company.metrics.map((m, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-green-600">{m.change}</p>
                <p className="text-xl font-bold text-gray-900">{m.value}</p>
                <p className="text-sm text-gray-500">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">Our Core Values</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {company.values.map((v, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{v.desc}</p>
                <button type="button" className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-500">Learn More</button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">Leadership Team</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {company.team.map((t, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-600">{t.role}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Join our journey</h2>
          <p className="mt-2 text-gray-600">We&apos;re always looking for talented individuals who share our passion for innovation.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button type="button" className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500">View Open Positions</button>
            <Link to="/search" className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
