import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-slate-300 font-mono animate-pulse">Loading feed…</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-red-400 font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Latest Activity</h1>
        <p className="mt-2 text-slate-400">Recent connections and posts from your network.</p>
        <div className="mt-8 space-y-6">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 text-center shadow-lg">
              <p className="text-slate-400 font-medium">No posts yet in your network.</p>
            </div>
          ) : (
            posts.map((p, index) => (
              <article key={p.id != null ? String(p.id) : `post-fallback-${index}`} className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-lg hover:bg-slate-900/50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {p.authorName != null && (
                      <p className="text-sm font-bold text-blue-400">{p.authorName}</p>
                    )}
                    <p className="mt-3 text-slate-200 leading-relaxed">{p.content ?? (p as any).description ?? ''}</p>
                    {p.imageUrl != null && p.imageUrl !== '' && (
                      <img src={String(p.imageUrl)} alt="Post attachment" className="mt-4 rounded-xl border border-white/10 object-cover max-h-96 w-full shadow-md" />
                    )}
                    {p.createdAt != null && !isNaN(new Date(p.createdAt).getTime()) && (
                      <p className="mt-4 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500">
                        {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  {String((p as any).userId) === localStorage.getItem('userId') && (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await api.delete('/posts/' + p.id + '?userId=' + localStorage.getItem('userId'));
                          setPosts((prev) => prev.filter((post) => String(post.id) !== String(p.id)));
                        } catch (e) {
                          console.error('Failed to delete post', e);
                        }
                      }}
                      className="shrink-0 rounded-lg p-2 text-slate-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      aria-label="Delete post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}