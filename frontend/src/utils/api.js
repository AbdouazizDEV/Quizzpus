import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL + '/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Themes
export const getThemes = () => api.get('/themes');
export const getThemeQuiz = (themeId) => api.get(`/themes/${themeId}/quiz`);
export const getDailyQuiz = () => api.get('/quiz/daily');
export const submitQuiz = (data) => api.post('/quiz/submit', data); // Legacy endpoint

// New Quiz System
export const startQuiz = (themeId) => api.post('/quiz/start', { theme_id: themeId });
export const validateAnswer = (sessionId, questionId, answer, timeTaken) => 
  api.post('/quiz/validate-answer', {
    session_id: sessionId,
    question_id: questionId,
    answer: answer,
    time_taken: timeTaken
  });
export const finishQuiz = (sessionId) => {
  // Backend expects session_id as query param or body - checking backend implementation
  return api.post('/quiz/finish', { session_id: sessionId });
};

// User
export const getUserProfile = () => api.get('/user/profile');
export const updateUserProfile = (data) => api.put('/user/profile', data);
export const getUserBadges = () => api.get('/user/badges');
export const getUserHistory = () => api.get('/user/history');

// Fun Facts
export const getDailyFunFact = () => api.get('/fun-facts/daily');
export const markFactRead = (factId) => api.post(`/fun-facts/${factId}/read`);

// Leaderboard
export const getGlobalLeaderboard = () => api.get('/leaderboard/global');
export const getCountryLeaderboard = (country) => api.get(`/leaderboard/country/${country}`);

// Notifications
export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (notifId) => api.put(`/notifications/${notifId}/read`);

// Auth
export const exchangeSession = (sessionId) => api.post('/auth/session', { session_id: sessionId });

// Feedback
export const submitFeedback = (data) => api.post('/feedback', data);

// Premium & Partnerships
export const joinPremiumWaitlist = (email) => api.post('/premium/waitlist', { email });
export const submitPartnerRequest = (data) => api.post('/partners/request', data);
export const submitEnterpriseLead = (data) => api.post('/enterprise/lead', data);
export const applyAmbassador = (data) => api.post('/ambassadors/apply', data);
