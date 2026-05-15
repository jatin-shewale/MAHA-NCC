import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import GeoAttendance from './pages/GeoAttendance';
import SocialFeed from './pages/SocialFeed';
import ModerationPortal from './pages/ModerationPortal';
import CampPortal from './pages/CampPortal';
import CadetPortfolio from './pages/CadetPortfolio';
import StudyPortal from './pages/StudyPortal';
import CadetCopilot from './pages/CadetCopilot';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<CadetPortfolio />} />
          <Route path="/attendance" element={<GeoAttendance />} />
          <Route path="/feed" element={<SocialFeed />} />
          <Route path="/moderation" element={<ModerationPortal />} />
          <Route path="/camps" element={<CampPortal />} />
          <Route path="/study" element={<StudyPortal />} />
          <Route path="/copilot" element={<CadetCopilot />} />
          
          <Route path="/leaderboard" element={<div className="text-white font-orbitron p-20 text-center">LEADERBOARD PENDING</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
