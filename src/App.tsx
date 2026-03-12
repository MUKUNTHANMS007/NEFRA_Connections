import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// The High-Fidelity Background Wrapper
import { GeometricBackgroundLayout } from './components/ui/shape-landing-hero'; 

// Standard Pages
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage';
import SignIn from './pages/SignIn';
import SignUp from './pages/Signup';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Search from './pages/Search';
import CreatePost from './pages/Post';
import Settings from './pages/Settings';
import Premium from './pages/Premium';
import Chat from './pages/Chat';
import AIChat from './pages/AIChat';

// --- CONSOLIDATED COMPANY PAGES ---
import Company from './pages/Company';                 // The "Traffic Cop" Redirector
import MyCompanyEdit from './pages/MyCompanyEdit';     // The "Smart Editor" (Create & Edit)
import ExploreCompanies from './pages/ExploreCompanies'; // The Directory
import CompanyProfileView from './pages/CompanyProfileView'; // The Premium Showcase

export default function App() {

  const pageRoutes = (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Navigate to="/signin" replace />} />
      <Route path="/search" element={<Search />} />
      <Route path="/explore-companies" element={<ExploreCompanies />} />
      <Route path="/ai-chat" element={<AIChat />} />
      <Route path="/premium" element={<Premium />} />

      {/* Protected Identity Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />

      {/* --- THE UPGRADED COMPANY PIPELINE --- */}
      
      {/* 1. The Traffic Cop: Checks for existing company and routes to Profile or Create */}
      <Route path="/company" element={<ProtectedRoute><Company /></ProtectedRoute>} />
      
      {/* 2. The Smart Form: Handles BOTH initial creation and subsequent editing */}
      <Route path="/create-company" element={<ProtectedRoute><MyCompanyEdit /></ProtectedRoute>} />
      <Route path="/edit-company" element={<ProtectedRoute><MyCompanyEdit /></ProtectedRoute>} />
      
      {/* 3. The Public Profile: The beautiful showcase page */}
      <Route path="/company_profile/:id" element={<CompanyProfileView />} />
      
    </Routes>
  );

  return (
    <div className="selection:bg-blue-500/30">
      <GeometricBackgroundLayout>
        <div className="relative z-20 flex min-h-screen flex-col">
          <Navbar />
          
          <main className="flex-1"> 
            {pageRoutes}
          </main>

          <Footer />
        </div>
      </GeometricBackgroundLayout>
    </div>
  );
}