import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import GeometricBackgroundLayout from './components/GeometricBackground'; // Make sure this path is correct
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Search from './pages/Search';
import CreatePost from './pages/Post';
import Company from './pages/Company';
import MyCompany from './pages/MyCompany';
import MyCompanyEdit from './pages/MyCompanyEdit';
import ExploreCompanies from './pages/ExploreCompanies';
import CompanyProfileView from './pages/CompanyProfileView';
import Settings from './pages/Settings';
import Premium from './pages/Premium'; // THE FIX: Imported the new page
import Chat from './pages/Chat';
import AIChat from './pages/AIChat';
// Inside Routes:


export default function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // We store the routes in a single variable so React Router doesn't get confused
  const pageRoutes = (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/" element={<Homepage />} />
      <Route path="/ai-chat" element={<AIChat />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Navigate to="/signin" replace />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/search" element={<Search />} />
      <Route path="/post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
      <Route path="/company" element={<Company />} />
      <Route path="/my-company" element={<ProtectedRoute><MyCompany /></ProtectedRoute>} />
      <Route path="/my-company/edit" element={<ProtectedRoute><MyCompanyEdit /></ProtectedRoute>} />
      <Route path="/explore-companies" element={<ExploreCompanies />} />
      <Route path="/company_profile/:id" element={<CompanyProfileView />} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      
      {/* THE FIX: Injected the Premium route here */}
      <Route path="/premium" element={<Premium />} />
    </Routes>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      
      {/* Conditionally apply the NEFRA geometric background */}
      {isHomePage ? (
        <main className="flex-grow pb-28">
          {pageRoutes}
        </main>
      ) : (
        <main className="flex-grow">
          <GeometricBackgroundLayout>
            {pageRoutes}
          </GeometricBackgroundLayout>
        </main>
      )}

      <Footer />
      <Outlet />
    </div>
  );
}