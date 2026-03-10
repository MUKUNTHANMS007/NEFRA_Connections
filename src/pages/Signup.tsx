import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import api from '../api';
import type { AuthResponseDTO, RegisterRequestDTO, RoleEnum } from '../types/auth';

const ROLES: { value: RoleEnum; label: string }[] = [
  { value: 'ENTREPRENEUR', label: 'Entrepreneur' },
  { value: 'INVESTOR', label: 'Investor' },
];

const DOMAINS: { value: string; label: string }[] = [
  { value: 'TECHNICAL', label: 'Technical' },
  { value: 'FINANCIAL', label: 'Financial' },
  { value: 'EDUCATIONAL', label: 'Educational' },
  { value: 'AGRICULTURAL', label: 'Agricultural' },
  { value: 'BIO_TECHNOLOGY', label: 'Bio-Technology' },
  { value: 'OTHER', label: 'Other' },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequestDTO & { confirmPassword?: string }>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'ENTREPRENEUR',
    domainType: 'TECHNICAL',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword: _, ...payload } = form;
      const res: AxiosResponse<AuthResponseDTO> = await api.post('/auth/register', payload);
      const { id, role } = res.data;
      if (id) localStorage.setItem('userId', String(id));
      if (role) localStorage.setItem('userRole', role);
      
      navigate('/profile');
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message ?? 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex min-h-[90vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <h1 className="text-center text-4xl font-black text-white tracking-tight">Join NEFRA</h1>
        <p className="mt-3 text-center text-slate-400 font-medium">Establish a new node in the ecosystem</p>
        
        <form onSubmit={handleSubmit} className="mt-10 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Username</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="janedoe123"
              />
            </div>
          </div>

          <label className="mt-5 block text-xs font-bold uppercase tracking-widest text-slate-400">Email Address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="jane@example.com"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Industry Domain</label>
              <select
                value={form.domainType}
                onChange={e => setForm({ ...form, domainType: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
              >
                {DOMAINS.map(d => <option key={d.value} value={d.value} className="bg-slate-900">{d.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Role</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value as RoleEnum })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors appearance-none"
              >
                {ROLES.map(r => <option key={r.value} value={r.value} className="bg-slate-900">{r.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Confirm</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {error && <p className="mt-6 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-blue-600 py-3.5 font-black tracking-widest uppercase text-white hover:bg-blue-500 disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            {loading ? 'Initializing Node…' : 'Establish Connection'}
          </button>
          
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-sm font-medium text-slate-400">
              Already in the system?{' '}
              <Link to="/signin" className="font-bold text-blue-400 hover:text-blue-300">Login here</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}