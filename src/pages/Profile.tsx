import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Edit3, FileText, Users, Settings, Zap } from 'lucide-react';
import api from '../api';
import type { ProfileUser } from '../types/user';

export default function Profile() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      setLoading(false);
      return;
    }
    // THE FIX IS HERE: Change /users/ to /profiles/
    api.get<ProfileUser>(`/profiles/${storedId}`)
      .then((res) => setUser(res.data))
      .catch((err: unknown) => {
        const res = err && typeof err === 'object' && 'response' in err ? (err as { response?: { status?: number } }).response : null;
        setError(res?.status === 404 ? 'User not found.' : 'Server connection error.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Loading profile…</p></div>;
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-red-600">{error}</p></div>;
  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">No profile data.</p></div>;

  const fullName = user.fullName ?? user.full_name ?? user.username ?? 'User';
  const role = user.role ?? 'Member';
  const industry = (user as { industry?: string }).industry ?? 'Tech';

  const activities = [
    { title: 'Posted a success story', time: '2 days ago', desc: 'Shared how we closed our Series A round with strategic investors from the NEFRA community.' },
    { title: 'Connected with Marcus Rodriguez', time: '5 days ago', desc: 'Established a new connection with Angel Investor at Venture Capital Group.' },
    { title: 'Updated profile information', time: '1 week ago', desc: 'Added new role as Advisor to 3 early-stage startups in the AI space.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{fullName}</h1>
              <p className="mt-1 text-gray-600">
                {role === 'ENTREPRENEUR' ? 'Entrepreneur' : role === 'INVESTOR' ? 'Investor' : role} · {industry}
              </p>
              <Link to="/settings" className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Link>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                Verified
              </span>
            </div>
          </div>
          <p className="mt-6 text-gray-600">
            Building the future through meaningful connections. Open to collaboration and new opportunities.
          </p>
          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">342</p>
              <p className="text-sm text-gray-500">Connections</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">28</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">2021</p>
              <p className="text-sm text-gray-500">Founded</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{industry}</p>
              <p className="text-sm text-gray-500">Industry</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Link to="/post" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300">
              <FileText className="h-8 w-8 text-blue-600" />
              <h3 className="mt-2 font-semibold text-gray-900">Add New Connection</h3>
              <p className="mt-1 text-sm text-gray-600">Share a success story or announce your new venture</p>
              <p className="mt-2 text-sm font-medium text-blue-600">Create Post</p>
            </Link>
            <Link to="/search" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300">
              <Users className="h-8 w-8 text-blue-600" />
              <h3 className="mt-2 font-semibold text-gray-900">View My Network</h3>
              <p className="mt-1 text-sm text-gray-600">See all your connections and recent interactions</p>
              <p className="mt-2 text-sm font-medium text-blue-600">View Network</p>
            </Link>
            <Link to="/settings" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-gray-300">
              <Settings className="h-8 w-8 text-blue-600" />
              <h3 className="mt-2 font-semibold text-gray-900">Profile Settings</h3>
              <p className="mt-1 text-sm text-gray-600">Update your information and preferences</p>
              <p className="mt-2 text-sm font-medium text-blue-600">Edit Profile</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {activities.map((a, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="font-medium text-gray-900">{a.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{a.time}</p>
                <p className="mt-2 text-sm text-gray-600">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Keep growing your network</h2>
          <p className="mt-2 text-gray-600">Your next big opportunity is one connection away.</p>
          <Link to="/search" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500">
            <Zap className="h-5 w-5" />
            Establish Connection
          </Link>
        </div>
      </div>
    </div>
  );
}
