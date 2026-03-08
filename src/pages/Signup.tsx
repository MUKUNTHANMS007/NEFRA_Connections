import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">Join NEFRA</h1>
        
        <form onSubmit={handleSubmit} className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {/* Full Name */}
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            required
            value={form.fullName}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3"
            placeholder="Jane Doe"
          />

          {/* Username */}
          <label className="mt-4 block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            required
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3"
            placeholder="janedoe123"
          />

          {/* Email */}
          <label className="mt-4 block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3"
            placeholder="jane@example.com"
          />

          {/* Domain Type */}
          <label className="mt-4 block text-sm font-medium text-gray-700">Industry Domain</label>
          <select
            value={form.domainType}
            onChange={e => setForm({ ...form, domainType: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3"
          >
            {DOMAINS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>

          {/* Role */}
          <label className="mt-4 block text-sm font-medium text-gray-700">Role</label>
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value as RoleEnum })}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3"
          >
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>

          {/* Passwords */}
          <label className="mt-4 block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3"
          />

          <label className="mt-4 block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 p-3"
          />

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}