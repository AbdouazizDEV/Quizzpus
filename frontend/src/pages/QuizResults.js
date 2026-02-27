import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, Share2, Home, RotateCcw, TrendingUp } from 'lucide-react';
import { triggerConfetti, triggerStars } from '../utils/helpers';
import { toast } from 'sonner';
import { useFeedbackTrigger } from '../hooks/useFeedbackTrigger';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, themeId } = location.state || {};
  const { FeedbackComponent } = useFeedbackTrigger();

  useEffect(() => {
    if (!results) {
      navigate('/quiz');
      return;
    }

    // Incrémenter le compteur de parties complétées
    const currentCount = parseInt(localStorage.getItem('completed_quizzes') || '0', 10);
    localStorage.setItem('completed_quizzes', (currentCount + 1).toString());

    if (results.perfect_score) {
      triggerStars();
      setTimeout(() => triggerConfetti(), 500);
    } else if (results.score >= 7) {
      triggerConfetti();
    }
  }, [results, navigate]);

  if (!results) return null;

  const percentage = (results.score / results.total_questions) * 100;
  const getMessage = () => {
    if (percentage === 100) return '🎉 Parfait ! Tu es imbattable !';
    if (percentage >= 80) return '🔥 Excellent ! Tu maîtrises ce sujet';
    if (percentage >= 60) return '👍 Bien joué ! Continue comme ça';
    if (percentage >= 40) return '💪 Pas mal ! Tu progresses';
    return '📚 Continue à apprendre, tu vas y arriver !';
  };

  const handleShare = () => {
    toast.success('Fonctionnalité de partage bientôt disponible');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B2042] to-[#0D1526] px-6 py-12" data-testid="quiz-results">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto"
      >
        {/* Score Display */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#F2D06B] flex items-center justify-center"
          >
            <div className="text-5xl font-black text-[#1B2042]" data-testid="final-score">
              {results.score}/{results.total_questions}
            </div>
          </motion.div>
          
          <h2 className="text-3xl font-bold text-[#F5EFD9] mb-2">
            {getMessage()}
          </h2>
          
          <p className="text-[#F5EFD9]/70 mb-6">
            Tu as gagné <span className="font-bold gold-text" data-testid="points-earned">+{results.points_earned} pts</span>
          </p>

          {results.perfect_score && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#2ECC71]/20 border border-[#2ECC71] rounded-full text-[#2ECC71] font-semibold mb-4"
            >
              <Trophy size={20} />
              SCORE PARFAIT! +10 pts bonus
            </motion.div>
          )}

          {results.new_level && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A84C]/20 border border-[#C9A84C] rounded-full text-[#C9A84C] font-semibold"
            >
              <TrendingUp size={20} />
              Niveau {results.new_level} atteint !
            </motion.div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-xl font-bold text-[#F5EFD9]">{results.score}</div>
            <div className="text-xs text-[#F5EFD9]/60">Correct</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl mb-1">❌</div>
            <div className="text-xl font-bold text-[#F5EFD9]">{results.total_questions - results.score}</div>
            <div className="text-xs text-[#F5EFD9]/60">Incorrect</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-xl font-bold text-[#F5EFD9]">{Math.round(percentage)}%</div>
            <div className="text-xs text-[#F5EFD9]/60">Réussite</div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full glass-card-hover py-4 flex items-center justify-center gap-2 font-semibold text-[#F5EFD9]"
            data-testid="share-results-button"
          >
            <Share2 size={20} />
            Partager mon score
          </button>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (themeId) {
                  navigate(`/quiz/${themeId}/play`);
                } else {
                  // Fallback si on arrive sur cette page sans thème (ex: refresh direct)
                  navigate('/quiz');
                }
              }}
              className="secondary-button py-3 flex items-center justify-center gap-2"
              data-testid="replay-quiz-button"
            >
              <RotateCcw size={18} />
              Rejouer
            </button>
            <button
              onClick={() => navigate('/leaderboard')}
              className="secondary-button py-3 flex items-center justify-center gap-2"
              data-testid="view-leaderboard-button"
            >
              <Trophy size={18} />
              Classement
            </button>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="cta-button w-full flex items-center justify-center gap-2"
            data-testid="return-home-button"
          >
            <Home size={20} />
            Retour à l'accueil
          </button>
        </div>
      </motion.div>
      
      <FeedbackComponent />
    </div>
  );
};

export default QuizResults;
