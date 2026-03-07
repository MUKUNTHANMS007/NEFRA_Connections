import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Network } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem('userId'));

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUserId(null);
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
              <Link to="/company" className="text-sm font-medium text-gray-600 hover:text-gray-900">Company</Link>
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
