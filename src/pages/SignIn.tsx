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
    <div className="w-full flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <p className="text-center text-xs font-black uppercase tracking-[0.2em] text-blue-400">Authentication</p>
        <h1 className="mt-2 text-center text-4xl font-black text-white tracking-tight">Welcome Back</h1>
        <p className="mt-3 text-center text-slate-400 font-medium">Initialize secure session</p>

        <form onSubmit={handleSubmit} className="mt-10 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-white/5">
          <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Email / Username</label>
          <input
            type="text"
            value={creds.username}
            onChange={e => setCreds({ ...creds, username: e.target.value })}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="node_operator"
            required
          />
          <label className="mt-5 block text-xs font-bold uppercase tracking-widest text-slate-400">Password</label>
          <input
            type="password"
            value={creds.password}
            onChange={e => setCreds({ ...creds, password: e.target.value })}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            placeholder="••••••••"
            required
          />
          <div className="mt-5 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-400 font-medium cursor-pointer hover:text-slate-300">
              <input type="checkbox" className="rounded border-white/10 bg-slate-950/50 text-blue-600 focus:ring-blue-500" />
              Remember session
            </label>
            <button type="button" className="text-blue-400 hover:text-blue-300 font-bold">Override?</button>
          </div>
          {error && <p className="mt-5 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-blue-600 py-3.5 font-black tracking-widest uppercase text-white hover:bg-blue-500 disabled:opacity-50 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            {loading ? 'Authenticating…' : 'Execute Login'}
          </button>
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-sm font-medium text-slate-400">
              No credentials?{' '}
              <Link to="/signup" className="font-bold text-blue-400 hover:text-blue-300">Request Access</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}