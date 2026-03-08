import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, Edit3, FileText, Trash2, Users, Settings, Zap } from 'lucide-react';
import api from '../api';
import type { ProfileUser } from '../types/user';

export default function Profile() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    if (!storedId) {
      setLoading(false);
      return;
    }
    api.get<ProfileUser>(`/profiles/${storedId}`)
      .then((res) => setUser(res.data))
      .catch((err: unknown) => {
        const res = err && typeof err === 'object' && 'response' in err ? (err as { response?: { status?: number } }).response : null;
        setError(res?.status === 404 ? 'User not found.' : 'Server connection error.');
      })
      .finally(() => setLoading(false));

    api.get('/posts/user/' + storedId)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setRecentPosts(data.slice(0, 3));
      })
      .catch(() => setRecentPosts([]));
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">Loading profile…</p></div>;
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-red-600">{error}</p></div>;
  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-600">No profile data.</p></div>;

  const fullName = user.fullName ?? user.full_name ?? user.username ?? 'User';
  const role = user.role ?? 'Member';
  const industry = (user as { industry?: string }).industry ?? 'Tech';

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
            {(user as { isVerified?: boolean }).isVerified && (
              <div className="flex gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Verified
                </span>
              </div>
            )}
          </div>
          <p className="mt-6 text-gray-600">
            {(user as { description?: string }).description ?? 'No bio added yet.'}
          </p>
          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">{(user as { connectionCount?: number }).connectionCount ?? 0}</p>
              <p className="text-sm text-gray-500">Following</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{(user as { postCount?: number }).postCount ?? 0}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{(user as { foundedYear?: string | number }).foundedYear ?? 'N/A'}</p>
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
            {recentPosts.map((post: any, i: number) => (
              <div key={post.id ?? i} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {post.title != null && <h3 className="font-medium text-gray-900">{post.title}</h3>}
                    <p className="mt-2 text-sm text-gray-600">{post.description ?? post.content ?? ''}</p>
                    {post.imageUrl != null && post.imageUrl !== '' && (
                      <img src={String(post.imageUrl)} alt="Post attachment" className="mt-4 rounded-lg object-cover max-h-96 w-full" />
                    )}
                    {post.createdAt != null && !isNaN(new Date(post.createdAt).getTime()) && (
                      <p className="mt-1 text-sm text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  {String(post.userId) === localStorage.getItem('userId') && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await api.delete('/posts/' + post.id + '?userId=' + localStorage.getItem('userId'));
                          setRecentPosts((prev) => prev.filter((p) => String(p.id) !== String(post.id)));
                        } catch (e) {
                          console.error('Failed to delete post', e);
                        }
                      }}
                      className="shrink-0 rounded p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center">
            <Link
              to="/profile/posts"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Show More
            </Link>
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
