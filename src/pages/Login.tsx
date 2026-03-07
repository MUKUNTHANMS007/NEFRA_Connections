import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AxiosResponse } from 'axios';
import api from '../api';
import type { AuthResponseDTO } from '../types/auth';

export default function Login() {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ username: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: AxiosResponse<AuthResponseDTO> = await api.post('/auth/login', creds);
      const { userId, id, role } = res.data;
      const userIdStr = userId != null ? String(userId) : (id != null ? String(id) : undefined);
      if (userIdStr) localStorage.setItem('userId', userIdStr);
      if (role) localStorage.setItem('role', role);
      alert("Login success!");
      navigate('/profile');
    } catch (err: unknown) {
      const response = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { status?: number; data?: unknown } }).response
        : null;
      const status = response?.status;
      const serverMessage =
        response?.data && typeof response.data === 'object' && response.data !== null && 'message' in response.data
          ? String((response.data as { message: unknown }).message)
          : null;

      if (status === 401) alert(serverMessage ?? "User not found or invalid password.");
      else if (status === 403) alert(serverMessage ?? "Access denied.");
      else if (status === 404) alert(serverMessage ?? "User not found.");
      else if (status === 500) alert(serverMessage ?? "Server error. Please try again.");
      else alert(serverMessage ?? "Server connection error.");
    }
  };

  return (
    <div style={{ padding: '20px', color: '#e2e8f0', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '16px' }}>NEFRA Sign In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={creds.username}
          onChange={e => setCreds({ ...creds, username: e.target.value })}
          style={{ width: '100%', marginBottom: '10px', padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#e2e8f0' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={creds.password}
          onChange={e => setCreds({ ...creds, password: e.target.value })}
          style={{ width: '100%', marginBottom: '14px', padding: '10px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', color: '#e2e8f0' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Sign In
        </button>
      </form>
    </div>
  );
}