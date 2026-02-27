import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bell, Flame, Trophy, Users, Sparkles, 
  ChevronRight, TrendingUp, Star 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import {
  getThemes,
  getDailyQuiz,
  getDailyFunFact,
  markFactRead,
  getUserProfile
} from '../utils/api';
import { getLevelInfo, showFloatingPoints } from '../utils/helpers';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [themes, setThemes] = useState([]);
  const [dailyQuiz, setDailyQuiz] = useState(null);
  const [funFact, setFunFact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, themesRes, dailyQuizRes, funFactRes] = await Promise.all([
        getUserProfile(),
        getThemes(),
        getDailyQuiz(),
        getDailyFunFact()
      ]);

      setProfile(profileRes.data);
      setThemes(themesRes.data);
      setDailyQuiz(dailyQuizRes.data);
      setFunFact(funFactRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleReadFunFact = async () => {
    if (funFact?.already_read) {
      navigate('/fun-facts');
      return;
    }

    try {
      const response = await markFactRead(funFact.fact_id);
      toast.success(`+${response.data.points_earned} pts`);
      
      // Show floating points animation
      showFloatingPoints(response.data.points_earned, window.innerWidth / 2, window.innerHeight / 2);
      
      // Update user points
      if (profile) {
        setProfile({ ...profile, points: profile.points + response.data.points_earned });
        updateUser({ ...user, points: user.points + response.data.points_earned });
      }
      
      setFunFact({ ...funFact, already_read: true });
    } catch (error) {
      toast.error('Erreur lors de la lecture');
    }
  };

  const levelInfo = getLevelInfo(profile?.points || 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B2042] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B2042] pb-24" data-testid="dashboard">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1B2042] to-[#0D1526] px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center text-2xl">
              {user?.picture ? (
                <img src={user.picture} alt="Avatar" className="w-12 h-12 rounded-full" />
              ) : (
                <span>{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            <div>
              <p className="text-sm text-[#F5EFD9]/60">Bonjour,</p>
              <h1 className="text-xl font-bold text-[#F5EFD9]" data-testid="user-greeting">
                {user?.name?.split(' ')[0]} 👋
              </h1>
            </div>
          </div>
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 glass-card-hover rounded-full"
            data-testid="notifications-button"
          >
            <Bell size={24} className="text-[#F5EFD9]" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B35] rounded-full" />
          </button>
        </div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
          data-testid="score-card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#F5EFD9]/60">Ton score</p>
              <h2 className="text-4xl font-black gold-text" data-testid="user-points">
                {profile?.points || 0}
              </h2>
              <p className="text-sm text-[#F5EFD9]/60 mt-1">
                {levelInfo.icon} Niveau {levelInfo.level} • {levelInfo.name}
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Trophy size={20} className="text-[#C9A84C]" />
                <span className="text-[#F5EFD9] font-bold" data-testid="user-rank">
                  #{profile?.stats?.rank || 0}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Flame size={20} className="text-[#FF6B35]" />
                <span className="text-[#F5EFD9] font-bold" data-testid="user-streak">
                  {user?.streak_days || 0} jours
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-[#F5EFD9]/60 mb-2">
              <span>Niveau {levelInfo.level}</span>
              <span>Niveau {levelInfo.level + 1}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(levelInfo.progress / (levelInfo.nextLevel - (profile?.points || 0) + levelInfo.progress)) * 100}%`
                }}
                className="h-full bg-gradient-to-r from-[#C9A84C] to-[#F2D06B]"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Fun Fact du jour */}
        {funFact && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-[#F5EFD9] flex items-center gap-2">
                <Sparkles size={20} className="text-[#C9A84C]" />
                Le savoir du jour
              </h3>
              {!funFact.already_read && (
                <span className="px-2 py-1 bg-[#FF6B35] text-white text-xs font-bold rounded-full">
                  NOUVEAU
                </span>
              )}
            </div>
            <button
              onClick={handleReadFunFact}
              className="glass-card-hover p-5 w-full text-left"
              data-testid="fun-fact-card"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">💡</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-[#F5EFD9] mb-2">
                    {funFact.title}
                  </h4>
                  <p className="text-sm text-[#F5EFD9]/70 line-clamp-2">
                    {funFact.content}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[#C9A84C] font-semibold text-sm">
                      {funFact.already_read ? 'Voir plus' : `Lire et gagner +${funFact.points} pts`}
                    </span>
                    <ChevronRight size={20} className="text-[#C9A84C]" />
                  </div>
                </div>
              </div>
            </button>
          </motion.div>
        )}

        {/* Quizz du jour */}
        {dailyQuiz && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-[#F5EFD9] mb-3">
              Quizz du jour
            </h3>
            <button
              onClick={() => navigate(`/quiz/${dailyQuiz.theme_id}/play`)}
              className="glass-card-hover p-6 w-full text-left relative overflow-hidden"
              data-testid="daily-quiz-card"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="text-4xl mb-3">{dailyQuiz.icon}</div>
                <h4 className="text-2xl font-bold text-[#F5EFD9] mb-2">
                  {dailyQuiz.name}
                </h4>
                <p className="text-sm text-[#F5EFD9]/70 mb-4">
                  10 questions • ~3 min
                </p>
                <div className="flex items-center justify-between">
                  <span className="cta-button inline-flex items-center gap-2 py-2 px-4 text-sm">
                    Jouer maintenant
                    <Star size={16} />
                  </span>
                </div>
              </div>
            </button>
          </motion.div>
        )}

        {/* Choisir un thème */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-[#F5EFD9]">
              Choisir un thème
            </h3>
            <button
              onClick={() => navigate('/quiz')}
              className="text-[#C9A84C] text-sm font-semibold flex items-center gap-1"
              data-testid="view-all-themes-button"
            >
              Tout voir
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {themes.slice(0, 6).map((theme, index) => (
              <motion.button
                key={theme.theme_id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                onClick={() => navigate(`/quiz/${theme.theme_id}/play`)}
                className="glass-card-hover p-4 min-w-[120px] text-center relative"
                data-testid={`theme-card-${theme.theme_id}`}
              >
                {theme.popular && (
                  <div className="absolute top-2 right-2 text-xs">🔥</div>
                )}
                <div className="text-3xl mb-2">{theme.icon}</div>
                <div className="text-sm font-semibold text-[#F5EFD9]">
                  {theme.name}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="glass-card p-4">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-2xl font-bold text-[#F5EFD9]" data-testid="quizzes-played">
              {profile?.stats?.total_quizzes || 0}
            </div>
            <div className="text-sm text-[#F5EFD9]/60">Quizz joués</div>
          </div>
          <div className="glass-card p-4">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-2xl font-bold text-[#F5EFD9]" data-testid="success-rate">
              {profile?.stats?.success_rate || 0}%
            </div>
            <div className="text-sm text-[#F5EFD9]/60">Taux de réussite</div>
          </div>
        </motion.div>

        {/* Invite Friends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/invite')}
            className="glass-card-hover p-5 w-full"
            data-testid="invite-friends-card"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF6B35]/20 rounded-full flex items-center justify-center text-2xl">
                <Users size={24} className="text-[#FF6B35]" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-[#F5EFD9]">
                  Inviter un ami
                </h4>
                <p className="text-sm text-[#F5EFD9]/70">
                  +100 pts par ami inscrit !
                </p>
              </div>
              <ChevronRight size={20} className="text-[#C9A84C]" />
            </div>
          </button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
