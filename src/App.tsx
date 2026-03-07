import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Homepage from './pages/Homepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Search from './pages/Search';
import CreatePost from './pages/Post';
import Company from './pages/Company';
import Settings from './pages/Settings';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Navigate to="/signin" replace />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
          <Route path="/search" element={<Search />} />
          <Route path="/post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
          <Route path="/company" element={<Company />} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </main>
      <Outlet />
    </div>
  );
}
