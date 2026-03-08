import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Globe, MapPin, Calendar, Users, ArrowLeft } from 'lucide-react';
import api from '../api';

export default function CompanyProfileView() {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Invalid company.');
      return;
    }
    api
      .get('/companies/' + encodeURIComponent(id))
      .then((res) => setCompany(res.data))
      .catch((err) => {
        console.error('Failed to fetch company', err);
        setError('Company not found or failed to load.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-red-600">{error ?? 'Company not found.'}</p>
          <Link
            to="/explore-companies"
            className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Explore Companies
          </Link>
        </div>
      </div>
    );
  }

  const name = company.name ?? 'Company';
  const tagline = company.tagline ?? company.description ?? '';
  const domain = company.domainType ?? company.domain ?? company.industry ?? '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/explore-companies"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Explore Companies
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
              {tagline && <p className="mt-2 text-slate-600">{tagline}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {domain && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    {domain}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                  <CheckCircle className="h-4 w-4" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {company.founded && (
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar className="h-5 w-5 text-slate-400" />
                <span>Founded {company.founded}</span>
              </div>
            )}
            {company.size && (
              <div className="flex items-center gap-3 text-slate-600">
                <Users className="h-5 w-5 text-slate-400" />
                <span>{company.size}</span>
              </div>
            )}
            {company.location && (
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="h-5 w-5 text-slate-400" />
                <span>{company.location}</span>
              </div>
            )}
            {company.website && (
              <a
                href={company.website.startsWith('http') ? company.website : 'https://' + company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-blue-600 hover:text-blue-500"
              >
                <Globe className="h-5 w-5" />
                <span>{company.website}</span>
              </a>
            )}
          </div>

          {company.description && (
            <p className="mt-8 text-slate-600">{company.description}</p>
          )}

          {company.stats && Array.isArray(company.stats) && company.stats.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {company.stats.map((s: { value?: string; label?: string }, i: number) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{s.value ?? '—'}</p>
                  <p className="text-sm text-slate-500">{s.label ?? ''}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
