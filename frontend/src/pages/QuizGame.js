import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { getThemeQuiz, submitQuiz } from '../utils/api';
import { toast } from 'sonner';
import CountdownTimer from '../components/CountdownTimer';

const QuizGame = () => {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    // Si aucun thème valide, rediriger vers la sélection de quizz
    if (!themeId || themeId === 'undefined') {
      toast.error('Aucun thème sélectionné. Choisis un quizz pour commencer.');
      navigate('/quiz');
      return;
    }
    fetchQuiz();
  }, [themeId]);

  useEffect(() => {
    if (countdown > 0 && !gameStarted) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
  }, [countdown, gameStarted]);

  const fetchQuiz = async () => {
    try {
      const response = await getThemeQuiz(themeId);
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur de chargement du quizz');
      navigate('/quiz');
    }
  };

  const handleAnswer = (answer) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleNext = async () => {
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    } else {
      // Submit quiz
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);
      try {
        const response = await submitQuiz({
          theme_id: themeId,
          answers: newAnswers,
          time_taken: timeTaken
        });
        navigate('/quiz/results', { state: { results: response.data, themeId } });
      } catch (error) {
        toast.error('Erreur lors de la soumission');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1B2042] flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1B2042] to-[#0D1526] flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            className="text-9xl font-black gold-text mb-4"
          >
            {countdown}
          </motion.div>
          <p className="text-[#F5EFD9] text-xl">Prépare-toi !</p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#1B2042] flex flex-col" data-testid="quiz-game">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 glass-card-hover rounded-full"
          data-testid="quit-quiz-button"
        >
          <X size={20} className="text-[#F5EFD9]" />
        </button>
        
        <div className="flex-1 mx-4">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#C9A84C] to-[#F2D06B]"
            />
          </div>
          <p className="text-center text-sm text-[#F5EFD9]/60 mt-1">
            {currentIndex + 1}/{questions.length}
          </p>
        </div>

        <CountdownTimer seconds={30} onExpire={() => handleNext()} />
      </div>

      {/* Question */}
      <div className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h2 className="text-2xl font-bold text-[#F5EFD9] mb-8" data-testid="question-text">
              {currentQuestion.question_text}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    selectedAnswer === option
                      ? 'bg-[#C9A84C] text-[#1B2042]'
                      : 'glass-card-hover text-[#F5EFD9]'
                  }`}
                  data-testid={`answer-option-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      selectedAnswer === option
                        ? 'bg-[#1B2042] text-[#C9A84C]'
                        : 'bg-white/10'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next Button */}
      {selectedAnswer && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="px-6 py-4"
        >
          <button
            onClick={handleNext}
            className="cta-button w-full"
            data-testid="next-question-button"
          >
            {currentIndex < questions.length - 1 ? 'Suivant' : 'Terminer'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default QuizGame;
