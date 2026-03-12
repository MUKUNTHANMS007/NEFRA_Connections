import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Edit3, MapPin, Briefcase, Globe, Github, Linkedin, 
  DollarSign, Activity, Settings, Sparkles, Loader2, Trash2, Calendar
} from 'lucide-react';
import api from '../api';
import type { ProfileUser } from '../types/user';

const SleekAIInsight = ({ industry }: { industry: string }) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [text, setText] = useState("");
  const fullText = `Profile metrics align with top-quartile performers in ${industry}. Network density is optimal for seed-stage capital acquisition.`;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnalyzing(false);
      let i = 0;
      const typeWriter = setInterval(() => {
        setText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(typeWriter);
      }, 20);
      return () => clearInterval(typeWriter);
    }, 1000);
    return () => clearTimeout(timer);
  }, [industry]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-indigo-400" />
        <h3 className="text-sm font-medium text-slate-200">Nefra AI Analysis</h3>
      </div>
      <div className="min-h-[40px]">
        {analyzing ? (
          <div className="flex items-center gap-2 text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span className="text-sm font-medium">Processing...</span>
          </div>
        ) : (
          <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
        )}
      </div>
    </div>
  );
};

export default function Profile() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'network', label: 'Network' }
  ];

  const viewerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!viewerId) { setLoading(false); return; }
    
    Promise.all([
      api.get<ProfileUser>(`/profiles/${viewerId}?viewerId=${viewerId}`),
      api.get('/posts/user/' + viewerId)
    ]).then(([userRes, postsRes]) => {
      setUser(userRes.data);
      const data = Array.isArray(postsRes.data) ? postsRes.data : [];
      setRecentPosts(data.slice(0, 10));
    }).catch(() => setError('Failed to load profile data.'))
      .finally(() => setLoading(false));
  }, [viewerId]);

  const handleDeletePost = async (postId: number | string) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${postId}?userId=${viewerId}`);
      setRecentPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) { alert("Failed to delete post."); }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (error) return <div className="flex min-h-screen items-center justify-center text-red-400">{error}</div>;
  if (!user) return null;

  const u = user as any;
  const fullName = u.fullName ?? u.full_name ?? u.username ?? 'User';
  const role = u.role ?? 'Member';
  const industry = u.industry ?? 'Technology';

  return (
    <div className="min-h-screen w-full bg-transparent pt-24 pb-20 text-slate-200">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* PREMIUM HEADER */}
        <div className="relative mb-12 flex flex-col items-start gap-8 sm:flex-row sm:items-end">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 text-5xl font-bold text-white shadow-xl backdrop-blur-xl">
            {fullName.charAt(0)}
            {u.isVerified && (
              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 border-4 border-[#030303]">
                <Activity className="h-4 w-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 w-full pb-2">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white">{fullName}</h1>
                <p className="mt-1.5 text-lg text-slate-400 font-medium">{u.headline ?? 'Add a professional headline'}</p>
                
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                  <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> {role}</span>
                  <span className="flex items-center gap-2"><Globe className="h-4 w-4" /> {u.domainType ?? 'General'}</span>
                  {u.location && <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {u.location}</span>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link to="/settings" className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                  <Settings className="h-4 w-4" /> Edit Profile
                </Link>
                <Link to="/post" className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-white transition-all shadow-sm">
                  <Edit3 className="h-4 w-4" /> Create Post
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 21st.dev ANIMATED TABS */}
        <div className="mb-8">
          <div className="flex space-x-1 rounded-2xl bg-white/[0.03] p-1.5 backdrop-blur-md border border-white/5 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative rounded-xl px-6 py-2.5 text-sm font-medium transition-colors outline-none ${
                  activeTab === tab.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-white/10 shadow-sm border border-white/5"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT PANELS */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {activeTab === 'overview' && (
            <>
              <div className="lg:col-span-2 space-y-6">
                <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-8 backdrop-blur-sm">
                  <h2 className="text-base font-semibold text-white mb-4">About</h2>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    {u.description ?? 'No detailed description provided. Update your settings to add your professional bio here.'}
                  </p>
                </div>
                <SleekAIInsight industry={industry} />
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-white mb-4">Details</h3>
                  <div className="space-y-4 text-sm">
                    {u.totalAssets > 0 && (
                      <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <span className="text-slate-500 flex items-center gap-2"><DollarSign className="h-4 w-4" /> Assets</span>
                        <span className="font-medium text-emerald-400">${Number(u.totalAssets).toLocaleString()}</span>
                      </div>
                    )}
                    {u.foundedYear && (
                      <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <span className="text-slate-500">Founded</span>
                        <span className="font-medium text-slate-300">{u.foundedYear}</span>
                      </div>
                    )}
                    {u.linkedinUrl && (
                      <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <span className="text-slate-500">LinkedIn</span>
                        <a href={u.linkedinUrl} target="_blank" rel="noreferrer" className="font-medium text-blue-400 hover:text-blue-300">View Profile</a>
                      </div>
                    )}
                    {u.githubUrl && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">GitHub</span>
                        <a href={u.githubUrl} target="_blank" rel="noreferrer" className="font-medium text-slate-300 hover:text-white">View Repository</a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <div className="lg:col-span-2 space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post: any) => (
                  <div key={post.id} className="group rounded-2xl border border-white/5 bg-slate-900/20 p-6 backdrop-blur-sm hover:bg-slate-900/40 transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        {post.title && <h4 className="font-medium text-slate-200 mb-2">{post.title}</h4>}
                        <p className="text-sm text-slate-400 leading-relaxed">{post.description ?? post.content}</p>
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                      <button onClick={() => handleDeletePost(post.id)} className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all" title="Delete Post">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
                  <p className="text-slate-500 text-sm">No recent activity found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'network' && (
            <div className="lg:col-span-2">
               <div className="rounded-2xl border border-white/5 bg-slate-900/20 p-8 backdrop-blur-sm text-center">
                  <div className="flex justify-center gap-12">
                    <div>
                      <p className="text-4xl font-light text-white mb-2">{u.connectionCount ?? 0}</p>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Following</p>
                    </div>
                    <div>
                      <p className="text-4xl font-light text-white mb-2">{u.postCount ?? 0}</p>
                      <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Followers</p>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}