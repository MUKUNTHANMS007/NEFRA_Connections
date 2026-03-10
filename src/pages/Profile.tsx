import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Edit3, FileText, Users, Settings, Zap, Trash2 } from 'lucide-react';
import api from '../api';
import type { ProfileUser } from '../types/user';

// UI Components
import { NumberTicker } from "../components/ui/number-ticker";
import { BorderBeam } from "../components/ui/border-beam";
import { OrbitingCircles } from "../components/ui/orbiting-circles";
import { AuroraBackground } from "../components/ui/aurora-background";

export default function Profile() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const { id } = useParams<{ id?: string }>();

  const viewerId = typeof window !== 'undefined' ? localStorage.getItem('userId') ?? '' : '';
  const profileId = id ?? viewerId;

  useEffect(() => {
    if (!profileId || !viewerId) {
      setLoading(false);
      return;
    }

    Promise.all([
      // FIXED: Removed the hardcoded /api/v1 so Axios doesn't duplicate it
      api.get<ProfileUser>(`/profiles/${profileId}?viewerId=${viewerId}`),
      api.get('/posts/user/' + profileId)
    ])
    .then(([userRes, postsRes]) => {
      const apiUser = userRes.data as any;
      const mappedUser: ProfileUser = {
        ...apiUser,
        connectionCount: apiUser.connectionCount ?? apiUser.connection_count ?? 0,
        postCount: apiUser.postCount ?? apiUser.post_count ?? 0,
        connectionStatus: apiUser.connectionStatus ?? apiUser.connection_status ?? 'NONE',
      };

      setUser(mappedUser);
      const data = Array.isArray(postsRes.data) ? postsRes.data : [];
      setRecentPosts(data.slice(0, 3));
    })
    .catch((err: any) => {
      setError(err.response?.status === 404 ? 'User not found.' : 'Server connection error.');
    })
    .finally(() => setLoading(false));
  }, [profileId, viewerId]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-blue-600 font-mono animate-pulse text-xl">NEFRA_SYSTEM_INITIALIZING...</div>;
  if (error) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-red-500 font-mono">ERROR: {error}</div>;
  if (!user) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">NO_DATA_STREAM</div>;

  const fullName = user.fullName ?? user.full_name ?? user.username ?? 'User';
  const role = user.role ?? 'Member';
  const industry = (user as any).industry ?? 'Tech';
  const isVerified = (user as any).isVerified;
  const connectionStatus = (user.connectionStatus ?? 'NONE') as ProfileUser['connectionStatus'];
  const isOwnProfile = !id || id === String(viewerId);

  const handleConnect = async () => {
    if (!viewerId || !profileId) return;
    try {
      // The 'null' ensures we don't send a JSON body, and 'params' builds the URL correctly
      await api.post('/connections/request', null, {
        params: {
          senderId: viewerId,
          recipientId: profileId
        }
      });
      
      // #region agent log
      fetch('http://127.0.0.1:7752/ingest/971334c5-c84f-4615-aa86-25fabff1beaa',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'13c1ad'},body:JSON.stringify({sessionId:'13c1ad',location:'Profile.tsx:handleConnect',message:'Connect success, setting PENDING_SENT',data:{profileId,viewerId},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
      setUser((prev) =>
        prev
          ? {
              ...prev,
              connectionStatus: 'PENDING_SENT', // Automatically flip UI to pending
            }
          : prev,
      );
    } catch (error: any) {
      // THE REVELATION CODE: This forces the hidden server message to pop up on your screen.
      const serverMessage = typeof error.response?.data === 'string' 
          ? error.response?.data 
          : JSON.stringify(error.response?.data) || error.message;
          
      alert("SPRING BOOT SAYS: " + serverMessage);
      console.error("Full rejection details:", error);
    }
  };

  const handleRespond = async (action: 'ACCEPT' | 'REJECT') => {
    if (!profileId || !viewerId) return;
    // #region agent log
    fetch('http://127.0.0.1:7752/ingest/971334c5-c84f-4615-aa86-25fabff1beaa',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'13c1ad'},body:JSON.stringify({sessionId:'13c1ad',location:'Profile.tsx:handleRespond',message:'Respond called',data:{action,profileId,viewerId},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    try {
      await api.put('/connections/respond', null, {
        params: {
          senderId: profileId,
          recipientId: viewerId,
          action: action,
        },
      });
      // #region agent log
      fetch('http://127.0.0.1:7752/ingest/971334c5-c84f-4615-aa86-25fabff1beaa',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'13c1ad'},body:JSON.stringify({sessionId:'13c1ad',location:'Profile.tsx:handleRespond',message:'Respond success, state updated',data:{action},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      setUser((prev) =>
        prev
          ? {
              ...prev,
              connectionStatus: action === 'ACCEPT' ? 'ACCEPTED' : 'NONE',
            }
          : prev,
      );
    } catch {
      alert('Failed to update connection.');
    }
  };

  return (
    <AuroraBackground className="w-full">
      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-28 pb-10 sm:px-6 lg:px-8 w-full">
        
        <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 backdrop-blur-xl p-10 shadow-2xl ring-1 ring-slate-900/5">
          
          {isVerified && (
            <BorderBeam size={350} duration={10} colorFrom="#3b82f6" colorTo="#10b981" />
          )}

          <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
            
            <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-full border border-white/80 bg-white/60 shadow-sm mx-auto lg:mx-0 backdrop-blur-md">
              <div className="z-20 h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-black text-white shadow-md">
                {fullName.charAt(0)}
              </div>
              
              <OrbitingCircles radius={65} duration={20} delay={10} reverse>
                 <Users className="h-5 w-5 text-blue-500/80" />
              </OrbitingCircles>
              <OrbitingCircles radius={95} duration={25} delay={5}>
                 <Zap className="h-4 w-4 text-emerald-500/80" />
              </OrbitingCircles>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
                    {fullName}
                  </h1>
                  <p className="text-blue-700 font-mono text-sm tracking-widest uppercase font-bold mt-2">
                    {role} Sector // {industry}
                  </p>
                </div>
                {isOwnProfile ? (
                  <Link
                    to="/settings"
                    className="mt-6 sm:mt-0 inline-flex items-center gap-2 rounded-xl border border-white/60 bg-white/60 backdrop-blur-md px-5 py-2.5 text-sm font-bold text-slate-700 hover:border-blue-500 hover:text-blue-700 hover:bg-white/80 transition-all shadow-sm"
                  >
                    <Edit3 className="h-4 w-4" />
                    CONFIG_SYSTEM
                  </Link>
                ) : connectionStatus === 'ACCEPTED' ? (
                  <button
                    type="button"
                    disabled
                    className="mt-6 sm:mt-0 inline-flex items-center gap-2 rounded-xl border border-emerald-500/70 bg-emerald-500/10 px-5 py-2.5 text-sm font-bold text-emerald-600 cursor-default"
                  >
                    CONNECTED
                  </button>
                ) : connectionStatus === 'PENDING_RECEIVED' ? (
                  <div className="mt-6 sm:mt-0 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRespond('ACCEPT')}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/70 bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-500 transition-all shadow-sm"
                    >
                      ACCEPT
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRespond('REJECT')}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-500/50 bg-white px-5 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-all"
                    >
                      REJECT
                    </button>
                  </div>
                ) : connectionStatus === 'PENDING' || connectionStatus === 'PENDING_SENT' ? (
                  <button
                    type="button"
                    disabled
                    className="mt-6 sm:mt-0 inline-flex items-center gap-2 rounded-xl border border-blue-500/50 bg-blue-500/10 px-5 py-2.5 text-sm font-bold text-blue-600 cursor-default"
                  >
                    PENDING
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConnect}
                    className="mt-6 sm:mt-0 inline-flex items-center gap-2 rounded-xl border border-blue-500/70 bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500 hover:border-blue-400 transition-all shadow-sm"
                  >
                    CONNECT
                  </button>
                )}
              </div>
              
              <p className="mt-8 text-lg text-slate-700 leading-relaxed border-l-4 border-blue-500/40 pl-4 font-medium">
                "{(user as any).description ?? 'Executing high-value connections in the NEFRA ecosystem.'}"
              </p>

              <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4 border-t border-slate-900/10 pt-10">
                <div>
                  <p className="text-3xl font-mono font-bold tracking-tighter text-slate-900">
                    <NumberTicker value={Number(user.connectionCount ?? 0)} className="text-slate-900 dark:text-slate-900" />
                  </p>
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mt-1">Following</p>
                </div>
                <div>
                  <p className="text-3xl font-mono font-bold tracking-tighter text-emerald-700">
                    <NumberTicker value={Number(user.postCount ?? 0)} className="text-emerald-700 dark:text-emerald-700" />
                  </p>
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mt-1">Followers</p>
                </div>
                <div>
                  <p className="text-3xl font-mono font-bold text-blue-700 tracking-tighter">
                    {(user as any).foundedYear ?? 'N/A'}
                  </p>
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mt-1">Founded</p>
                </div>
                <div>
                  <p className="text-3xl font-mono font-bold text-slate-800 tracking-tighter">
                    {(user as any).industry ?? 'Tech'}
                  </p>
                  <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mt-1">Industry</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEED & ACTIONS SECTION */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-blue-700 px-2 flex items-center gap-2">
                <div className="h-1 w-8 bg-blue-600" /> Live_Activity_Log
              </h2>
              {recentPosts.length > 0 ? (
                recentPosts.map((post: any, index: number) => (
                  <div
                    key={post.id ?? `recent-post-${index}`}
                    className="group relative rounded-2xl border border-white/60 bg-white/50 backdrop-blur-lg p-6 hover:shadow-lg hover:bg-white/70 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        {post.title && <h3 className="font-bold text-slate-900 text-xl group-hover:text-blue-700 transition-colors">{post.title}</h3>}
                        <p className="text-slate-700 text-sm leading-relaxed font-medium">{post.description ?? post.content}</p>
                        <p className="text-[10px] font-mono text-slate-500">
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {isOwnProfile && (
                        <button onClick={async () => {
                           await api.delete(`/posts/${post.id}?userId=${localStorage.getItem('userId')}`);
                           setRecentPosts(prev => prev.filter(p => p.id !== post.id));
                        }} className="p-2 text-slate-500 hover:text-red-600 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 font-medium px-2 bg-white/40 backdrop-blur-md inline-block p-2 rounded-lg border border-white/30">No active signal logs detected...</p>
              )}
           </div>

           <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700 px-2 flex items-center gap-2">
                <div className="h-1 w-8 bg-emerald-600" /> Command_Center
              </h2>
              {[
                { id: "post", to: "/post", icon: FileText, title: "Post Signal", color: "text-blue-700" },
                { id: "search", to: "/search", icon: Users, title: "Scan Network", color: "text-emerald-700" },
                { id: "settings", to: "/settings", icon: Settings, title: "System Opt", color: "text-slate-700" }
              ].map((action) => (
                <Link
                  key={action.id}
                  to={action.to}
                  className="flex items-center gap-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-lg p-5 hover:bg-white/80 hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  <action.icon className={`h-6 w-6 ${action.color}`} />
                  <span className="font-bold text-slate-800 text-sm uppercase tracking-widest">{action.title}</span>
                </Link>
              ))}
           </div>
        </div>
      </div>
    </AuroraBackground>
  );
}