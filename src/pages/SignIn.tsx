import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import api from '../api';
import type { AuthResponseDTO } from '../types/auth';

export default function SignIn() {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res: AxiosResponse<AuthResponseDTO> = await api.post('/auth/login', creds);
      const { userId, id, role } = res.data;
      const userIdStr = userId != null ? String(userId) : (id != null ? String(id) : undefined);
      if (userIdStr) localStorage.setItem('userId', userIdStr);
      if (role) localStorage.setItem('role', role);
      navigate('/profile');
    } catch (err: unknown) {
      const res = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { status?: number; data?: unknown } }).response
        : null;
      const status = res?.status;
      const msg = res?.data && typeof res.data === 'object' && res.data !== null && 'message' in res.data
        ? String((res.data as { message: unknown }).message)
        : null;
      if (status === 401) setError(msg ?? 'Invalid username or password.');
      else if (status === 404) setError(msg ?? 'User not found.');
      else if (status === 500) setError(msg ?? 'Server error. Please try again.');
      else setError(msg ?? 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-gray-500">Sign In</p>
        <h1 className="mt-2 text-center text-3xl font-bold text-gray-900">Welcome Back</h1>
        <p className="mt-2 text-center text-gray-600">Sign in to continue building your network</p>

        <form onSubmit={handleSubmit} className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <label className="block text-sm font-medium text-gray-700">Email / Username</label>
          <input
            type="text"
            value={creds.username}
            onChange={e => setCreds({ ...creds, username: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="you@example.com"
            required
          />
          <label className="mt-4 block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={creds.password}
            onChange={e => setCreds({ ...creds, password: e.target.value })}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="••••••••"
            required
          />
          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="rounded border-gray-300" />
              Remember me
            </label>
            <button type="button" className="text-blue-600 hover:text-blue-500">Forgot password?</button>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
          <p className="mt-6 text-center text-sm text-gray-500">Or continue with</p>
          <div className="mt-4 flex justify-center gap-4">
            <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Google</button>
            <button type="button" className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">LinkedIn</button>
          </div>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up for free</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
