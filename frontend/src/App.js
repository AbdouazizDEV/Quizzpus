import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthCallback from './components/AuthCallback';

// Pages
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import WelcomeOnboarding from './pages/WelcomeOnboarding';
import Dashboard from './pages/Dashboard';
import QuizSelection from './pages/QuizSelection';
import QuizGame from './pages/QuizGame';
import QuizResults from './pages/QuizResults';
import Leaderboard from './pages/Leaderboard';
import Competitions from './pages/Competitions';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import InviteFriends from './pages/InviteFriends';
import Premium from './pages/Premium';

import './App.css';

// Router wrapper to detect OAuth callback
function AppRouter() {
  const location = useLocation();
  
  // Check URL fragment (not query params) for session_id
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<SplashScreen />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes */}
      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomeOnboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <QuizSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/:themeId/play"
        element={
          <ProtectedRoute>
            <QuizGame />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz/results"
        element={
          <ProtectedRoute>
            <QuizResults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/competitions"
        element={
          <ProtectedRoute>
            <Competitions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invite"
        element={
          <ProtectedRoute>
            <InviteFriends />
          </ProtectedRoute>
        }
      />
      <Route
        path="/premium"
        element={
          <ProtectedRoute>
            <Premium />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <AppRouter />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1B2042',
                color: '#F5EFD9',
                border: '1px solid rgba(255,255,255,0.1)'
              },
              success: {
                iconTheme: {
                  primary: '#2ECC71',
                  secondary: '#F5EFD9'
                }
              },
              error: {
                iconTheme: {
                  primary: '#E74C3C',
                  secondary: '#F5EFD9'
                }
              }
            }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
