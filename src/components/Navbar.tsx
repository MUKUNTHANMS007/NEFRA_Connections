import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Bell, Home, Search, User, Newspaper, 
  SquarePlus, Building2, LogIn, UserPlus, LogOut, Zap,
  MessageSquare // NEW: Chat Icon
} from 'lucide-react';
import api from '../api';
import { cn } from '@/lib/utils';
import { LayoutDashboard } from 'lucide-react';

// --- Framer Motion Configuration ---
const buttonVariants = {
  initial: { gap: 0, paddingLeft: ".5rem", paddingRight: ".5rem" },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem('userId'));
  const [userRole, setUserRole] = useState<string | null>(() => {
    const r = localStorage.getItem('userRole') ?? localStorage.getItem('role');
    return r ? r.toUpperCase() : null;
  });
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    const r = localStorage.getItem('userRole') ?? localStorage.getItem('role');
    setUserRole(r ? r.toUpperCase() : null);
  }, [location.pathname]);

  useEffect(() => {
    const uid = localStorage.getItem('userId');
    if (!uid) return;
    api.get(`/notifications/${uid}`)
      .then((res) => setNotifications(Array.isArray(res.data) ? res.data : []))
      .catch(() => setNotifications([]));
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // UPDATED: Added Chat to the tabs array
  const tabs = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Search', to: '/search', icon: Search },
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Chat', to: '/chat', icon: MessageSquare }, // THE INJECTION
    { label: 'Feed', to: '/feed', icon: Newspaper },
    { label: 'Post', to: '/post', icon: SquarePlus },
    { label: 'Explore', to: '/explore-companies', icon: Building2 },
    { label: 'Profile', to: '/profile', icon: User },
  ] as const;

  const authTabs = [
    { label: 'Home', to: '/', icon: Home },
    { label: 'Search', to: '/search', icon: Search },
    { label: 'Sign In', to: '/signin', icon: LogIn },
    { label: 'Sign Up', to: '/signup', icon: UserPlus },
  ] as const;

  const activePath = location.pathname;
  const activeIndex = (userId ? tabs : authTabs).findIndex((t) => activePath === t.to || (t.to !== '/' && activePath.startsWith(t.to)));

  const handleNotificationClick = async (notification: any) => {
    if (!notification?.id) return;
    try {
      await api.put(`/notifications/${notification.id}/read`);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch {
      // ignore errors
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserId(null);
    setUserRole(null);
    setNotifications([]);
    navigate('/signin');
  };

  return (
    <>
      {/* Top Left Brand Logo & Pricing Link */}
      <div className="pointer-events-none fixed top-4 left-1/2 z-40 w-full max-w-7xl -translate-x-1/2 px-4 sm:px-6 lg:px-8">
        <div className="pointer-events-auto flex items-center gap-3 justify-start">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-3 py-2 text-slate-100 shadow-sm backdrop-blur-md hover:bg-slate-900/60 transition-colors">
            <Network className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-bold tracking-tight text-white">NEFRA</span>
          </Link>

          <Link 
            to="/premium" 
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] backdrop-blur-md hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all"
          >
            <Zap className="h-3 w-3 fill-emerald-400/20" />
            Upgrade
          </Link>
        </div>
      </div>

      {/* Expandable Tabs Floating Dock */}
      <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div
          className={cn(
            'flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 p-1.5 shadow-2xl backdrop-blur-xl',
          )}
        >
          {(userId ? tabs : authTabs).map((t, idx) => {
            const Icon = t.icon;
            const isActive = idx === activeIndex;

            return (
              <motion.button
                key={t.to}
                variants={buttonVariants}
                initial={false}
                animate="animate"
                custom={isActive}
                onClick={() => navigate(t.to)}
                transition={transition as any}
                className={cn(
                  "relative flex items-center rounded-xl py-2.5 text-sm font-bold transition-colors duration-300",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      variants={spanVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={transition as any}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {t.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {userId && <div className="mx-1 h-[24px] w-[1px] bg-white/10" aria-hidden="true" />}

          {userId && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative flex items-center justify-center rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-950">
                    {notifications.length > 9 ? '9+' : notifications.length}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute bottom-full right-0 z-50 mb-4 w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-xl">
                  <div className="max-h-72 overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-sm font-medium text-slate-400">System Secure. No active alerts.</p>
                    ) : (
                      notifications.slice(0, 6).map((n: any, i: number) => (
                        <div
                          key={n.id ?? i}
                          className="cursor-pointer rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
                          onClick={() => handleNotificationClick(n)}
                        >
                          <p className="text-sm font-medium text-slate-200">
                            {n.message ?? n.content ?? n.text ?? 'Notification payload received.'}
                          </p>
                          {n.createdAt && (
                            <p className="mt-1 text-xs text-blue-400 font-medium">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {userId && (
            <button
              type="button"
              onClick={handleLogout}
              className="relative flex items-center justify-center rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
              title="Terminate Session"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}

        </div>
      </nav>
    </>
  );
}