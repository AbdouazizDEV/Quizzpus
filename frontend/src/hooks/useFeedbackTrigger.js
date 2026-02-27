import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FeedbackModal from '../components/FeedbackModal';

export const useFeedbackTrigger = () => {
  const { user } = useAuth();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    // Vérifier si le feedback a déjà été soumis
    const submitted = localStorage.getItem('feedback_submitted');
    if (submitted === 'true') {
      setFeedbackSubmitted(true);
      return;
    }

    // Récupérer le compteur de parties complétées
    const completedQuizzes = parseInt(localStorage.getItem('completed_quizzes') || '0', 10);
    
    // Vérifier si on doit afficher le feedback (après 3 parties)
    if (completedQuizzes >= 3 && !feedbackSubmitted) {
      // Vérifier si on a déjà proposé le feedback (pour éviter de le montrer à chaque fois)
      const lastFeedbackOffer = localStorage.getItem('last_feedback_offer');
      const now = Date.now();
      
      // Si jamais proposé ou si ça fait plus de 5 parties depuis la dernière proposition
      if (!lastFeedbackOffer || (completedQuizzes >= parseInt(lastFeedbackOffer, 10) + 5)) {
        setShowFeedback(true);
        localStorage.setItem('last_feedback_offer', completedQuizzes.toString());
      }
    }
  }, [user, feedbackSubmitted]);

  const handleFeedbackComplete = () => {
    setFeedbackSubmitted(true);
    localStorage.setItem('feedback_submitted', 'true');
    setShowFeedback(false);
  };

  const FeedbackComponent = () => (
    <FeedbackModal
      isOpen={showFeedback}
      onClose={() => setShowFeedback(false)}
      onComplete={handleFeedbackComplete}
    />
  );

  return { FeedbackComponent };
};
