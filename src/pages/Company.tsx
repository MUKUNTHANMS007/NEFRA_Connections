import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Loader2 } from 'lucide-react';

export default function Company() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Authenticating workspace...");

  useEffect(() => {
    const fetchMyCompany = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) { navigate('/signin'); return; }

      try {
        const res = await api.get(`/companies/my-company?userId=${userId}`);
        if (res.status === 204 || !res.data) {
          navigate('/create-company');
        } else {
          navigate(`/company_profile/${res.data.id}`);
        }
      } catch (err) {
        navigate('/create-company');
      }
    };
    fetchMyCompany();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <p className="text-sm font-medium text-slate-500">{status}</p>
      </div>
    </div>
  );
}