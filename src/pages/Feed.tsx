import { useEffect, useState } from 'react';
import api from '../api';
import type { FeedPost } from '../types/post';

export default function Feed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<FeedPost[]>('/posts/feed')
      .then((res) => setPosts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError('Server connection error.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading feed…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Latest Activity</h1>
        <p className="mt-1 text-gray-600">Recent connections and posts from your network</p>
        <div className="mt-8 space-y-6">
          {posts.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-gray-600">No posts yet.</p>
            </div>
          ) : (
            posts.map((p) => (
              <article key={String(p.id)} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {p.authorName != null && (
                  <p className="text-sm font-medium text-gray-600">{p.authorName}</p>
                )}
                <p className="mt-2 text-gray-900">{p.content ?? ''}</p>
                {p.createdAt != null && (
                  <p className="mt-4 text-xs text-gray-500">{p.createdAt}</p>
                )}
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
