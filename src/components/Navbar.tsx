import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Network, Bell } from 'lucide-react';
import api from '../api';

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
    api.get('/notifications/user/' + uid)
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

  const isEntrepreneur = userRole === 'ENTREPRENEUR';
  const isInvestor = userRole === 'INVESTOR';

  const handleLogout = () => {
    localStorage.clear();
    setUserId(null);
    setUserRole(null);
    setNotifications([]);
    navigate('/signin');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-gray-700">
          <Network className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-semibold tracking-tight">NEFRA</span>
        </Link>
        <div className="flex items-center gap-6">
          {userId ? (
            <>
              <Link to="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/search" className="text-sm font-medium text-gray-600 hover:text-gray-900">Search</Link>
              <Link to="/profile" className="text-sm font-medium text-gray-600 hover:text-gray-900">Profile</Link>
              <Link to="/feed" className="text-sm font-medium text-gray-600 hover:text-gray-900">Feed</Link>
              <Link to="/post" className="text-sm font-medium text-gray-600 hover:text-gray-900">Post</Link>
              {isEntrepreneur && (
                <Link to="/my-company" className="text-sm font-medium text-gray-600 hover:text-gray-900">My Company</Link>
              )}
              {isInvestor && (
                <Link to="/explore-companies" className="text-sm font-medium text-gray-600 hover:text-gray-900">Explore Companies</Link>
              )}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen((o) => !o)}
                  className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                      {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500">No notifications</p>
                      ) : (
                        notifications.slice(0, 5).map((n: any, i: number) => (
                          <div
                            key={n.id ?? i}
                            className="border-b border-gray-100 px-4 py-3 last:border-b-0 hover:bg-gray-50"
                          >
                            <p className="text-sm text-gray-900">{n.message ?? n.content ?? n.text ?? 'Notification'}</p>
                            {n.createdAt && (
                              <p className="mt-0.5 text-xs text-gray-500">{new Date(n.createdAt).toLocaleDateString()}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Link to="/settings" className="text-sm font-medium text-gray-600 hover:text-gray-900">Settings</Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/search" className="text-sm font-medium text-gray-600 hover:text-gray-900">Search</Link>
              <Link to="/signin" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
