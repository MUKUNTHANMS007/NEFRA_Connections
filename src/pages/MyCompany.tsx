import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import api from '../api';

export default function MyCompany() {
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      setError('Please sign in to view your company.');
      return;
    }
    api
      .get('/companies/my-company?userId=' + userId)
      .then((res) => {
        if (res.status === 204 || res.data == null) {
          setCompany(null);
        } else {
          setCompany(res.data);
        }
      })
      .catch((err) => {
        if (err?.response?.status === 204 || err?.response?.status === 404) {
          setCompany(null);
        } else {
          setError('Failed to load company profile.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24 sm:px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Discovery</p>
            <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Building2 className="h-8 w-8 text-slate-500" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Connect your company profile in NEFRA Connections
            </h1>
            <p className="mt-3 text-slate-600">
              Showcase your venture to investors and partners. Add your company to start building visibility.
            </p>
            <Link
              to="/my-company/edit"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-600/30"
            >
              <Plus className="h-5 w-5" />
              Add Company Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">My Company</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">{company.name ?? 'My Company'}</h1>
        {(company.tagline ?? company.description) && (
          <p className="mt-3 text-lg text-slate-600">{company.tagline ?? company.description}</p>
        )}
        {company.location && (
          <p className="mt-2 text-slate-500">{company.location}</p>
        )}
      </div>
    </div>
  );
}
