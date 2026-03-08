import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Save } from 'lucide-react';
import api from '../api';

const DOMAIN_OPTIONS: { value: string; label: string }[] = [
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'FINANCIAL', label: 'Financial' },
  { value: 'EDUCATIONAL', label: 'Educational' },
  { value: 'AGRICULTURAL', label: 'Agricultural' },
  { value: 'BIO_TECHNOLOGY', label: 'Bio-Technology' },
  { value: 'OTHER', label: 'Other' },
];

const FUNDING_OPTIONS = ['Seed', 'Series A', 'Series B', 'Bootstrapped'];

export default function MyCompanyEdit() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    tagline: '',
    description: '',
    domainType: 'TECHNICAL',
    location: '',
    website: '',
    fundingStage: 'Seed',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const entrepreneurId = localStorage.getItem('userId');
    
    if (!entrepreneurId) {
      setError('Please sign in to add a company.');
      return;
    }

    setLoading(true);
    try {
      // THE FIX 1: Rename 'website' to 'websiteUrl' to match the Java Entity
      const payload = {
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        domainType: form.domainType,
        location: form.location,
        websiteUrl: form.website, // Renamed here
        fundingStage: form.fundingStage,
      };

      // THE FIX 2: Move entrepreneurId to the URL as a query parameter (?entrepreneurId=X)
      await api.post(`/companies?entrepreneurId=${entrepreneurId}`, payload);
      
      navigate('/my-company');
    } catch (err: any) {
      console.error('Company create error:', err);
      // The backend will tell us exactly what field failed if we check err.response
      setError(err.response?.data?.message ?? 'Failed to save company profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/my-company"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Company
        </Link>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <Building2 className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Company Profile</p>
                <h1 className="text-xl font-semibold text-slate-900">Add Company Profile</h1>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. TechVentures Inc."
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              {/* Tagline */}
              <div>
                <label htmlFor="tagline" className="block text-sm font-medium text-slate-700">
                  Tagline
                </label>
                <input
                  id="tagline"
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="Short catchy phrase"
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Your startup story, mission, and what you build..."
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              {/* Domain Type */}
              <div>
                <label htmlFor="domainType" className="block text-sm font-medium text-slate-700">
                  Domain Type
                </label>
                <select
                  id="domainType"
                  value={form.domainType}
                  onChange={(e) => setForm({ ...form, domainType: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  {DOMAIN_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="City, Country"
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              {/* Website URL */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-slate-700">
                  Website URL
                </label>
                <input
                  id="website"
                  type="url"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  placeholder="https://example.com"
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>

              {/* Funding Stage */}
              <div>
                <label htmlFor="fundingStage" className="block text-sm font-medium text-slate-700">
                  Funding Stage
                </label>
                <select
                  id="fundingStage"
                  value={form.fundingStage}
                  onChange={(e) => setForm({ ...form, fundingStage: e.target.value })}
                  className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-slate-900 transition-colors focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
                >
                  {FUNDING_OPTIONS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="mt-6 text-sm text-red-600">{error}</p>
            )}

            <div className="mt-8 flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving…' : 'Save Company Profile'}
              </button>
              <Link
                to="/my-company"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
