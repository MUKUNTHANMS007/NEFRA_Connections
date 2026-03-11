import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Eye, Users, TrendingUp, Building2, PlusCircle, Settings, ArrowRight } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      try {
        // Fetching basic user profile for the greeting
        const res = await api.get(`/users/${userId}`);
        setUserData(res.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="font-mono text-blue-400 animate-pulse text-xl">INITIALIZING_COMMAND_CENTER...</p>
      </div>
    );
  }

  // Fallback name if data is missing
  const displayName = userData?.fullName ?? userData?.username ?? 'Founder';

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-blue-600" /> Operational_Status: Online
            </p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Welcome back, <span className="text-blue-500">{displayName}</span>
            </h1>
          </div>
          <Link
            to="/premium"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-3 font-black tracking-widest text-[10px] uppercase text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform"
          >
            <TrendingUp className="h-4 w-4" /> Upgrade Node Capacity
          </Link>
        </div>

        {/* Top Analytics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Metric 1 */}
          <div className="relative group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 hover:border-blue-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <Eye className="h-16 w-16 text-blue-400" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Entity Views (30d)</p>
            <p className="text-5xl font-black font-mono text-white tracking-tighter">1,204</p>
            <p className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-400">
              <TrendingUp className="h-3 w-3" /> +14.2% from last cycle
            </p>
          </div>

          {/* Metric 2 */}
          <div className="relative group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 hover:border-emerald-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <Users className="h-16 w-16 text-emerald-400" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Network Connections</p>
            <p className="text-5xl font-black font-mono text-white tracking-tighter">84</p>
            <p className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-400">
              <TrendingUp className="h-3 w-3" /> 5 pending inbound requests
            </p>
          </div>

          {/* Metric 3 */}
          <div className="relative group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 hover:border-cyan-500/50 transition-colors sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
              <Activity className="h-16 w-16 text-cyan-400" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Signal Reach</p>
            <p className="text-5xl font-black font-mono text-white tracking-tighter">8.5k</p>
            <p className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400">
              Based on your last 3 broadcasts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions Panel */}
          <div className="lg:col-span-2 rounded-[2.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl">
            <h2 className="text-xl font-black text-white mb-8">Command Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <Link to="/my-company/edit" className="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/50 p-6 hover:bg-blue-600/10 hover:border-blue-500/30 transition-all">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-600 group-hover:border-transparent transition-colors">
                  <Building2 className="h-5 w-5 text-blue-400 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Update Entity Profile</h3>
                  <p className="text-xs text-slate-400 font-medium">Modify your venture details, pitch, and metrics.</p>
                </div>
              </Link>

              <Link to="/post" className="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/50 p-6 hover:bg-emerald-600/10 hover:border-emerald-500/30 transition-all">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:border-transparent transition-colors">
                  <PlusCircle className="h-5 w-5 text-emerald-400 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Broadcast Signal</h3>
                  <p className="text-xs text-slate-400 font-medium">Share updates or milestones with the NEFRA network.</p>
                </div>
              </Link>

              <Link to="/settings" className="group flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-950/50 p-6 hover:bg-slate-800 hover:border-white/20 transition-all sm:col-span-2">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 group-hover:bg-slate-700 transition-colors">
                      <Settings className="h-5 w-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">System Settings</h3>
                      <p className="text-xs text-slate-400 font-medium">Manage security, notifications, and account parameters.</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            </div>
          </div>

          {/* Activity Feed / Mini-feed */}
          <div className="rounded-[2.5rem] border border-white/10 bg-slate-900/60 backdrop-blur-2xl p-8 shadow-2xl flex flex-col">
            <h2 className="text-xl font-black text-white mb-6">Recent Activity</h2>
            
            <div className="flex-1 space-y-6">
              {/* Dummy Activity Items */}
              <div className="flex items-start gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                <div>
                  <p className="text-sm text-slate-300 font-medium"><span className="text-white font-bold">Jason Chen</span> (Investor) viewed your pitch deck.</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">2 Hours Ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <div>
                  <p className="text-sm text-slate-300 font-medium">Your recent broadcast reached <span className="text-white font-bold">500+</span> nodes.</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">5 Hours Ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-2 w-2 mt-2 rounded-full bg-slate-600" />
                <div>
                  <p className="text-sm text-slate-400 font-medium">System maintenance completed successfully.</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">1 Day Ago</p>
                </div>
              </div>
            </div>

            <Link to="/feed" className="mt-8 block text-center text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
              View Full Log &rarr;
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}