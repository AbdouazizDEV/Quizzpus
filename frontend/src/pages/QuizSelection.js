import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Flame } from 'lucide-react';
import { getThemes } from '../utils/api';
import { toast } from 'sonner';
import BottomNav from '../components/BottomNav';

const QuizSelection = () => {
  const navigate = useNavigate();
  const [themes, setThemes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await getThemes();
      setThemes(response.data);
    } catch (error) {
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'popular', label: 'Populaires' }
  ];

  const filteredThemes = filter === 'popular'
    ? themes.filter(t => t.popular)
    : themes;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B2042] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1B2042] pb-24" data-testid="quiz-selection">
      <div className="px-6 py-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-[#F5EFD9]/60 hover:text-[#F5EFD9] mb-6"
        >
          <ArrowLeft size={20} />
          Retour
        </button>

        <h1 className="text-3xl font-bold text-[#F5EFD9] mb-2">
          Choisir un quizz
        </h1>
        <p className="text-[#F5EFD9]/70 mb-6">
          Sélectionne un thème et teste tes connaissances
        </p>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                filter === f.id
                  ? 'bg-[#C9A84C] text-[#1B2042]'
                  : 'bg-white/5 text-[#F5EFD9] hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredThemes.map((theme, index) => (
            <motion.button
              key={theme.theme_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/quiz/${theme.theme_id}/play`)}
              className="glass-card-hover p-5 text-left relative"
              data-testid={`quiz-theme-${theme.theme_id}`}
            >
              {theme.popular && (
                <div className="absolute top-3 right-3">
                  <Flame size={16} className="text-[#FF6B35]" />
                </div>
              )}
              <div className="text-4xl mb-3">{theme.icon}</div>
              <h3 className="font-bold text-[#F5EFD9] mb-1">
                {theme.name}
              </h3>
              <p className="text-xs text-[#F5EFD9]/60 mb-3">
                {theme.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#C9A84C]">
                <Star size={14} />
                <span>10 questions</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default QuizSelection;
