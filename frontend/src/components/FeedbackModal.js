import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { submitFeedback } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { triggerConfetti } from '../utils/helpers';

const FeedbackModal = ({ isOpen, onClose, onComplete }) => {
  const { user, updateUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [likedFeatures, setLikedFeatures] = useState([]);
  const [missingFeatures, setMissingFeatures] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState('');
  const [loading, setLoading] = useState(false);

  const features = [
    { id: 'quizzes', label: '🎯 Les quizz', value: 'quizzes' },
    { id: 'leaderboard', label: '🏆 Le classement', value: 'leaderboard' },
    { id: 'rewards', label: '🎁 Les récompenses', value: 'rewards' },
    { id: 'fun_facts', label: '📚 Les fun facts', value: 'fun_facts' },
    { id: 'competitions', label: '🔥 Les compétitions', value: 'competitions' },
    { id: 'community', label: '👥 La communauté', value: 'community' }
  ];

  const recommendOptions = [
    { id: 'yes', label: '😍 Oui, sans hésiter !', value: 'yes' },
    { id: 'maybe', label: '🤔 Peut-être', value: 'maybe' },
    { id: 'no', label: '😐 Pas pour l\'instant', value: 'no' }
  ];

  const handleFeatureToggle = (featureId) => {
    if (likedFeatures.includes(featureId)) {
      setLikedFeatures(likedFeatures.filter(f => f !== featureId));
    } else if (likedFeatures.length < 3) {
      setLikedFeatures([...likedFeatures, featureId]);
    } else {
      toast.error('Sélectionne maximum 3 éléments');
    }
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Donne une note à Quizz+');
      return;
    }
    if (likedFeatures.length === 0) {
      toast.error('Sélectionne au moins un élément que tu aimes');
      return;
    }
    if (!wouldRecommend) {
      toast.error('Réponds à la question sur la recommandation');
      return;
    }

    setLoading(true);
    try {
      await submitFeedback({
        rating,
        liked_features: likedFeatures,
        missing_features: missingFeatures || null,
        would_recommend: wouldRecommend
      });

      // Bonus de points
      if (user) {
        const updatedUser = { ...user, points: (user.points || 0) + 5 };
        updateUser(updatedUser);
      }

      triggerConfetti();
      toast.success('Merci pour ton avis ! +5 pts offerts 🎉');
      onComplete();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du feedback:', error);
      toast.error('Erreur lors de l\'envoi. Réessaie plus tard.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1B2042]/90 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[#1B2042] border-t border-white/10 rounded-t-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#1B2042] border-b border-white/10 p-6 flex items-center justify-between z-10">
            <div>
              <h2 className="text-2xl font-bold text-[#F5EFD9]">💬 Ton avis compte !</h2>
              <p className="text-sm text-[#F5EFD9]/70 mt-1">2 minutes pour améliorer Quizz+ pour toi</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} className="text-[#F5EFD9]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Question 1: Rating */}
            <div>
              <label className="block text-[#F5EFD9] font-semibold mb-3">
                Comment tu notes Quizz+ ? <span className="text-[#FF6B35]">*</span>
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={
                        star <= (hoveredRating || rating)
                          ? 'fill-[#C9A84C] text-[#C9A84C]'
                          : 'text-[#F5EFD9]/30'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: Liked Features */}
            <div>
              <label className="block text-[#F5EFD9] font-semibold mb-3">
                Qu'est-ce que tu aimes le plus ? <span className="text-[#FF6B35]">*</span>
                <span className="text-sm text-[#F5EFD9]/60 font-normal ml-2">
                  (max 3)
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => handleFeatureToggle(feature.value)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      likedFeatures.includes(feature.value)
                        ? 'bg-[#C9A84C]/20 ring-2 ring-[#C9A84C]'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-sm font-medium text-[#F5EFD9]">
                      {feature.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 3: Missing Features */}
            <div>
              <label className="block text-[#F5EFD9] font-semibold mb-3">
                Qu'est-ce qui manque selon toi ?
                <span className="text-sm text-[#F5EFD9]/60 font-normal ml-2">
                  (optionnel)
                </span>
              </label>
              <textarea
                value={missingFeatures}
                onChange={(e) => {
                  if (e.target.value.length <= 200) {
                    setMissingFeatures(e.target.value);
                  }
                }}
                placeholder="Dis-nous ce qui pourrait rendre l'app encore meilleure..."
                className="w-full bg-[#0D1526]/50 border border-white/10 rounded-xl px-4 py-3 text-[#F5EFD9] placeholder:text-white/30 focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all outline-none resize-none"
                rows={3}
              />
              <p className="text-xs text-[#F5EFD9]/60 mt-1 text-right">
                {missingFeatures.length}/200
              </p>
            </div>

            {/* Question 4: Recommendation */}
            <div>
              <label className="block text-[#F5EFD9] font-semibold mb-3">
                Tu recommanderais Quizz+ à un ami ? <span className="text-[#FF6B35]">*</span>
              </label>
              <div className="space-y-2">
                {recommendOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setWouldRecommend(option.value)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      wouldRecommend === option.value
                        ? 'bg-[#C9A84C]/20 ring-2 ring-[#C9A84C]'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-[#F5EFD9] font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading || !rating || likedFeatures.length === 0 || !wouldRecommend}
                className="w-full cta-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Envoi en cours...' : 'Envoyer mon avis'}
              </button>
              <button
                onClick={onClose}
                className="w-full text-center text-[#F5EFD9]/60 hover:text-[#F5EFD9] text-sm py-2"
              >
                Plus tard
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FeedbackModal;
