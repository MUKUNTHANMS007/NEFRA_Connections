import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../api';
import type { ProfileUser } from '../types/user';

export default function PublicProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError('Invalid profile.');
      return;
    }
    api
      .get<ProfileUser>(`/profiles/${id}`)
      .then((res) => setUser(res.data))
      .catch((err: unknown) => {
        const res = err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { status?: number } }).response
          : null;
        setError(res?.status === 404 ? 'User not found.' : 'Server connection error.');
      })
      .finally(() => setLoading(false));

    api
      .get('/posts/user/' + id)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setRecentPosts(data.slice(0, 3));
      })
      .catch(() => setRecentPosts([]));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading profile…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <p className="text-red-600">{error}</p>
          <Link
            to="/search"
            className="mt-4 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }
  if (!user) {
    return null;
  }

  const fullName = user.fullName ?? user.full_name ?? user.username ?? 'User';
  const role = user.role ?? 'Member';
  const industry = (user as { industry?: string }).industry ?? 'Tech';
  const isOwnProfile = currentUserId && String(user.id) === currentUserId;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          to="/search"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{fullName}</h1>
              <p className="mt-1 text-slate-600">
                {role === 'ENTREPRENEUR' ? 'Entrepreneur' : role === 'INVESTOR' ? 'Investor' : role} · {industry}
              </p>
              {isOwnProfile && (
                <Link
                  to="/settings"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Edit Profile
                </Link>
              )}
            </div>
            {(user as { isVerified?: boolean }).isVerified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                Verified
              </span>
            )}
          </div>
          <p className="mt-6 text-slate-600">
            {(user as { description?: string }).description ?? 'No bio added yet.'}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">{(user as { connectionCount?: number }).connectionCount ?? 0}</p>
              <p className="text-sm text-slate-500">Following</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{(user as { postCount?: number }).postCount ?? 0}</p>
              <p className="text-sm text-slate-500">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{(user as { foundedYear?: string | number }).foundedYear ?? 'N/A'}</p>
              <p className="text-sm text-slate-500">Founded</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{industry}</p>
              <p className="text-sm text-slate-500">Industry</p>
            </div>
          </div>
        </div>

        {recentPosts.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <div className="mt-4 space-y-4">
              {recentPosts.map((post: any, i: number) => (
                <div key={post.id ?? i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  {post.title != null && <h3 className="font-medium text-slate-900">{post.title}</h3>}
                  <p className="mt-2 text-sm text-slate-600">{post.description ?? post.content ?? ''}</p>
                  {post.createdAt != null && !isNaN(new Date(post.createdAt).getTime()) && (
                    <p className="mt-1 text-sm text-slate-500">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
