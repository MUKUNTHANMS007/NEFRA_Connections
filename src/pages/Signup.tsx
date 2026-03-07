import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import api from '../api';
import type { AuthResponseDTO, RegisterRequestDTO, RoleEnum } from '../types/auth';

const ROLES: { value: RoleEnum; label: string }[] = [
  { value: 'ENTREPRENEUR', label: 'Entrepreneur' },
  { value: 'INVESTOR', label: 'Investor' },
];

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequestDTO & { fullName?: string; company?: string; confirmPassword?: string }>({
    username: '',
    password: '',
    role: 'ENTREPRENEUR',
    fullName: '',
    company: '',
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
      const res: AxiosResponse<AuthResponseDTO> = await api.post('/auth/register', {
        username: form.username,
        password: form.password,
        role: form.role,
      });
      const { userId, id, role } = res.data;
      const userIdStr = userId != null ? String(userId) : (id != null ? String(id) : undefined);
      if (userIdStr) localStorage.setItem('userId', userIdStr);
      if (role) localStorage.setItem('role', role);
      navigate('/profile');
    } catch (err: unknown) {
      const res = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { status?: number; data?: unknown } }).response
        : null;
      const msg = res?.data && typeof res.data === 'object' && res.data !== null && 'message' in res.data
        ? String((res.data as { message: unknown }).message)
        : null;
      if (res?.status === 400 || res?.status === 409) setError(msg ?? 'Invalid request or username already taken.');
      else setError(msg ?? 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-gray-500">Join</p>
        <h1 className="mt-2 text-center text-3xl font-bold text-gray-900">Join NEFRA</h1>
        <p className="mt-2 text-center text-gray-600">Create your account and start connecting</p>

        <form onSubmit={handleSubmit} className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={form.fullName ?? ''}
            onChange={e => setForm({ ...form, fullName: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Jane Doe"
          />
          <label className="mt-4 block text-sm font-medium text-gray-700">Email / Username</label>
          <input
            type="text"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />
          <label className="mt-4 block text-sm font-medium text-gray-700">Role</label>
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value as RoleEnum })}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <label className="mt-4 block text-sm font-medium text-gray-700">Company (optional)</label>
          <input
            type="text"
            value={form.company ?? ''}
            onChange={e => setForm({ ...form, company: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Acme Inc"
          />
          <label className="mt-4 block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
          <label className="mt-4 block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            value={form.confirmPassword ?? ''}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
          <label className="mt-4 flex items-start gap-2 text-sm text-gray-600">
            <input type="checkbox" className="mt-1 rounded border-gray-300" required />
            I agree to the Terms of Service and Privacy Policy
          </label>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
          <p className="mt-6 text-center text-sm text-gray-500">Or sign up with</p>
          <div className="mt-4 flex justify-center gap-4">
            <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Google</button>
            <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">LinkedIn</button>
          </div>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
