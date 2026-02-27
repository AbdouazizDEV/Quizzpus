import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeSession } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double processing in React StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processCallback = async () => {
      try {
        // Extract session_id from hash
        const hash = location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          navigate('/login', { replace: true });
          return;
        }

        // Exchange session_id for user data
        // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
        const response = await exchangeSession(sessionId);
        
        updateUser(response.data.user);

        // Check if user needs onboarding
        const user = response.data.user;
        if (!user.country || user.favorite_themes?.length === 0) {
          navigate('/welcome', { replace: true, state: { user } });
        } else {
          navigate('/dashboard', { replace: true, state: { user } });
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login', { replace: true });
      }
    };

    processCallback();
  }, [location.hash, navigate, updateUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1B2042]">
      <div className="text-center">
        <div className="spinner mx-auto mb-4" />
        <p className="text-[#F5EFD9]">Connexion en cours...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
