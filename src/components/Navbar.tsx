import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Bell, Home, Search, User, Newspaper, 
  SquarePlus, Building2, LogIn, UserPlus, LogOut, Zap,
  MessageSquare, Bot, LayoutDashboard 
} from 'lucide-react';
import api from '../api';
import { cn } from '@/lib/utils';

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

  const activeTabs = useMemo(() => {
    if (!userId) return [
      { label: 'Home', to: '/', icon: Home },
      { label: 'Search', to: '/search', icon: Search },
      { label: 'Sign In', to: '/signin', icon: LogIn },
      { label: 'Sign Up', to: '/signup', icon: UserPlus },
    ];

    const coreTabs = [
      { label: 'Home', to: '/', icon: Home },
      { label: 'Search', to: '/search', icon: Search },
      { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { label: 'Chat', to: '/chat', icon: MessageSquare },
      { label: 'AI Core', to: '/ai-chat', icon: Bot }, 
      { label: 'Feed', to: '/feed', icon: Newspaper },
      { label: 'Post', to: '/post', icon: SquarePlus },
    ];

    if (userRole === 'ENTREPRENEUR') {
      return [
        ...coreTabs,
        { label: 'My Company', to: '/company', icon: Building2 }, // FIXED ROUTE
        { label: 'Profile', to: '/profile', icon: User },
      ];
    }

    return [
      ...coreTabs,
      { label: 'Explore', to: '/explore-companies', icon: Building2 },
      { label: 'Profile', to: '/profile', icon: User },
    ];
  }, [userId, userRole]);

  const activePath = location.pathname;
  const activeIndex = activeTabs.findIndex((t) => activePath === t.to || (t.to !== '/' && activePath.startsWith(t.to)));

  return (
    <>
      <div className="pointer-events-none fixed top-4 left-1/2 z-40 w-full max-w-7xl -translate-x-1/2 px-4">
        <div className="pointer-events-auto flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-3 py-2 backdrop-blur-md">
            <Network className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-bold text-white">NEFRA</span>
          </Link>
          <Link to="/premium" className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 backdrop-blur-md">
            <Zap className="h-3 w-3 fill-emerald-400/20" /> Upgrade
          </Link>
        </div>
      </div>

      <nav className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/80 p-1.5 shadow-2xl backdrop-blur-xl">
          {activeTabs.map((t, idx) => {
            const Icon = t.icon;
            const isActive = idx === activeIndex;
            return (
              <motion.button
                key={t.to}
                variants={buttonVariants}
                animate="animate"
                custom={isActive}
                onClick={() => navigate(t.to)}
                className={cn(
                  "relative flex items-center rounded-xl py-2.5 text-sm font-bold transition-all",
                  isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <AnimatePresence>
                  {isActive && (
                    <motion.span variants={spanVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden whitespace-nowrap">
                      {t.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </>
  );
}