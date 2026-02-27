import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings, Share2, Trophy, Target, Flame, 
  Edit, LogOut, Users, Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserBadges, getUserHistory } from '../utils/api';
import { getLevelInfo } from '../utils/helpers';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileRes, badgesRes, historyRes] = await Promise.all([
        getUserProfile(),
        getUserBadges(),
        getUserHistory()
      ]);

      setProfile(profileRes.data);
      setBadges(badgesRes.data);
      setHistory(historyRes.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('À bientôt !');
    navigate('/login');
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
    <div className="min-h-screen bg-[#1B2042] pb-24" data-testid="profile">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1B2042] to-[#0D1526] px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#F5EFD9]">Profil</h1>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 glass-card-hover rounded-full"
            data-testid="settings-button"
          >
            <Settings size={20} className="text-[#F5EFD9]" />
          </button>
        </div>

        {/* Profile Card */}
        <div className="glass-card p-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[#C9A84C]/20 flex items-center justify-center overflow-hidden">
            {user?.picture ? (
              <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl font-bold text-[#C9A84C]">
                {user?.name?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-[#F5EFD9] mb-1" data-testid="profile-name">
            {user?.name}
          </h2>
          <p className="text-[#F5EFD9]/60 mb-4">{user?.country}</p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/20 rounded-full">
            <span className="text-2xl">{levelInfo.icon}</span>
            <span className="font-bold text-[#F5EFD9]">
              Niveau {levelInfo.level} • {levelInfo.name}
            </span>
          </div>

          <button
            onClick={() => navigate('/profile/edit')}
            className="mt-4 secondary-button w-full flex items-center justify-center gap-2"
            data-testid="edit-profile-button"
          >
            <Edit size={18} />
            Modifier le profil
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-6">
        <h3 className="text-lg font-bold text-[#F5EFD9] mb-4">Statistiques</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-4">
            <Trophy className="text-[#C9A84C] mb-2" size={24} />
            <div className="text-2xl font-bold text-[#F5EFD9]" data-testid="profile-points">
              {profile?.points || 0}
            </div>
            <div className="text-sm text-[#F5EFD9]/60">Points totaux</div>
          </div>
          
          <div className="glass-card p-4">
            <Target className="text-[#C9A84C] mb-2" size={24} />
            <div className="text-2xl font-bold text-[#F5EFD9]" data-testid="profile-quizzes">
              {profile?.stats?.total_quizzes || 0}
            </div>
            <div className="text-sm text-[#F5EFD9]/60">Quizz joués</div>
          </div>

          <div className="glass-card p-4">
            <Flame className="text-[#FF6B35] mb-2" size={24} />
            <div className="text-2xl font-bold text-[#F5EFD9]" data-testid="profile-streak">
              {user?.streak_days || 0}
            </div>
            <div className="text-sm text-[#F5EFD9]/60">Jours consécutifs</div>
          </div>

          <div className="glass-card p-4">
            <Crown className="text-[#C9A84C] mb-2" size={24} />
            <div className="text-2xl font-bold text-[#F5EFD9]" data-testid="profile-success-rate">
              {profile?.stats?.success_rate || 0}%
            </div>
            <div className="text-sm text-[#F5EFD9]/60">Taux de réussite</div>
          </div>
        </div>

        {/* Badges */}
        <h3 className="text-lg font-bold text-[#F5EFD9] mt-8 mb-4">Badges</h3>
        <div className="grid grid-cols-4 gap-3">
          {badges.slice(0, 8).map((badge) => (
            <button
              key={badge.badge_id}
              className={`glass-card p-3 text-center ${
                badge.unlocked ? '' : 'opacity-40 grayscale'
              }`}
              data-testid={`badge-${badge.badge_id}`}
            >
              <div className="text-3xl mb-1">{badge.icon}</div>
              <div className="text-xs text-[#F5EFD9]">{badge.name}</div>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => navigate('/community')}
            className="w-full glass-card-hover p-4 flex items-center gap-4"
            data-testid="community-button"
          >
            <Users size={24} className="text-[#C9A84C]" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-[#F5EFD9]">Rejoindre la communauté</p>
              <p className="text-sm text-[#F5EFD9]/60">WhatsApp, Discord, entretiens</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/invite')}
            className="w-full glass-card-hover p-4 flex items-center gap-4"
            data-testid="invite-friends-button"
          >
            <Users size={24} className="text-[#FF6B35]" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-[#F5EFD9]">Inviter des amis</p>
              <p className="text-sm text-[#F5EFD9]/60">+100 pts par ami</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full glass-card-hover p-4 flex items-center gap-4 text-[#E74C3C]"
            data-testid="logout-button"
          >
            <LogOut size={24} />
            <span className="font-semibold">Se déconnecter</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
