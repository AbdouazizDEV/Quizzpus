import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { getGlobalLeaderboard, getCountryLeaderboard } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';

const Leaderboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('global');
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let response;
      if (tab === 'global') {
        response = await getGlobalLeaderboard();
      } else if (tab === 'country' && user?.country) {
        response = await getCountryLeaderboard(user.country);
      }
      
      setLeaderboard(response.data.leaderboard || []);
      setUserRank(response.data.user_rank || 0);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const tabs = [
    { id: 'global', label: '🌍 Mondial' },
    { id: 'country', label: `🏳️ ${user?.country || 'Mon pays'}` }
  ];

  const getPodiumIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-[#FFD700]" size={24} />;
    if (rank === 2) return <Medal className="text-[#C0C0C0]" size={24} />;
    if (rank === 3) return <Award className="text-[#CD7F32]" size={24} />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#1B2042] pb-24" data-testid="leaderboard">
      <div className="px-6 py-6">
        <h1 className="text-3xl font-bold text-[#F5EFD9] mb-2">
          Classement
        </h1>
        <p className="text-[#F5EFD9]/70 mb-6">
          Défie les meilleurs joueurs
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                tab === t.id
                  ? 'bg-[#C9A84C] text-[#1B2042]'
                  : 'bg-white/5 text-[#F5EFD9] hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* User Rank */}
        {userRank > 0 && (
          <div className="glass-card p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C9A84C]/20 rounded-full flex items-center justify-center">
                <TrendingUp className="text-[#C9A84C]" size={20} />
              </div>
              <div>
                <p className="text-sm text-[#F5EFD9]/60">Ta position</p>
                <p className="font-bold text-[#F5EFD9]" data-testid="user-leaderboard-rank">#{userRank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold gold-text">{user?.points || 0} pts</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner" />
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.user_id === user?.user_id;
              const rank = entry.rank || index + 1;
              
              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`glass-card p-4 flex items-center gap-4 ${
                    isCurrentUser ? 'ring-2 ring-[#C9A84C]' : ''
                  }`}
                  data-testid={`leaderboard-entry-${rank}`}
                >
                  {/* Rank */}
                  <div className="w-12 text-center">
                    {rank <= 3 ? (
                      getPodiumIcon(rank)
                    ) : (
                      <div className="text-lg font-bold text-[#F5EFD9]/60">
                        #{rank}
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-[#C9A84C]/20 flex items-center justify-center overflow-hidden">
                    {entry.picture ? (
                      <img src={entry.picture} alt={entry.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-[#C9A84C]">
                        {entry.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-semibold text-[#F5EFD9]">
                      {entry.name}
                    </p>
                    <p className="text-sm text-[#F5EFD9]/60">
                      {entry.country}
                    </p>
                  </div>

                  {/* Points */}
                  <div className="text-right">
                    <p className="font-bold gold-text">{entry.points}</p>
                    <p className="text-xs text-[#F5EFD9]/60">pts</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Leaderboard;
