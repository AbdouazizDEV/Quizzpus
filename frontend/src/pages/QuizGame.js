import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { startQuiz, validateAnswer, finishQuiz } from '../utils/api';
import { toast } from 'sonner';
import CountdownTimer from '../components/CountdownTimer';

const QuizGame = () => {
  const { themeId } = useParams();
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isValidating, setIsValidating] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const timerRef = useRef(null);
  const feedbackTimeoutRef = useRef(null);

  // Initialize quiz session
  const initializeQuiz = async () => {
    try {
      const response = await startQuiz(themeId);
      setSessionId(response.data.session_id);
      setQuestions(response.data.questions);
      setLoading(false);
    } catch (error) {
      toast.error('Erreur de chargement du quizz');
      navigate('/quiz');
    }
  };

  // Finish quiz session
  const finishQuizSession = useCallback(async () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    
    if (!sessionId) return;
    
    try {
      const response = await finishQuiz(sessionId);
      navigate('/quiz/results', { 
        state: { 
          results: response.data, 
          themeId 
        } 
      });
    } catch (error) {
      toast.error('Erreur lors de la finalisation du quiz');
    }
  }, [sessionId, themeId, navigate]);

  // Move to next question
  const moveToNextQuestion = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    
    setCurrentIndex((prevIndex) => {
      if (prevIndex < questions.length - 1) {
        return prevIndex + 1;
      } else {
        finishQuizSession();
        return prevIndex;
      }
    });
  }, [questions.length, finishQuizSession]);

  // Handle validation response
  const handleValidationResponse = useCallback((data) => {
    console.log('✅ Validation response received:', data); // Debug log
    console.log('📊 Setting feedback data:', {
      isCorrect: data.is_correct,
      pointsEarned: data.points_earned,
      explanation: data.explanation,
      correctAnswer: data.correct_answer
    });
    
    // Set feedback data first
    setFeedbackData({
      isCorrect: data.is_correct || false,
      pointsEarned: data.points_earned || 0,
      explanation: data.explanation || '',
      correctAnswer: data.correct_answer || ''
    });
    setCurrentScore(data.current_score || 0);
    setTotalPoints(data.total_points || 0);
    
    // Show feedback immediately
    setShowFeedback(true);
    setIsValidating(false);
    console.log('👁️ Feedback should now be visible');
    
    // Clear any existing timeout
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }
    
    // Auto-advance after minimum 2.5 seconds (ensures feedback is visible for at least 2 seconds)
    feedbackTimeoutRef.current = setTimeout(() => {
      console.log('⏭️ Auto-advancing to next question after 2.5s');
      if (data.is_complete) {
        finishQuizSession();
      } else {
        moveToNextQuestion();
      }
    }, 2500);
  }, [finishQuizSession, moveToNextQuestion]);

  // Handle time expired
  const handleTimeExpired = useCallback(async () => {
    if (isValidating || showFeedback) return;
    
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion || !sessionId) return;
    
    setIsValidating(true);
    const timeTaken = 10; // Time expired
    
    try {
      const response = await validateAnswer(
        sessionId,
        currentQuestion.question_id,
        '', // No answer given
        timeTaken
      );
      
      handleValidationResponse(response.data);
    } catch (error) {
      toast.error('Erreur lors de la validation');
      setIsValidating(false);
    }
  }, [isValidating, showFeedback, questions, currentIndex, sessionId, handleValidationResponse]);

  // Start timer for current question
  const startQuestionTimer = useCallback(() => {
    setTimeLeft(10);
    setQuestionStartTime(Date.now());
    setSelectedAnswer('');
    setShowFeedback(false);
    setFeedbackData(null);
    
    // Clear existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleTimeExpired]);

  useEffect(() => {
    if (!themeId || themeId === 'undefined') {
      toast.error('Aucun thème sélectionné. Choisis un quizz pour commencer.');
      navigate('/quiz');
      return;
    }
    initializeQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeId]);

  // Countdown before game starts
  useEffect(() => {
    if (countdown > 0 && !gameStarted && !loading) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted && !loading) {
      setGameStarted(true);
      startQuestionTimer();
    }
  }, [countdown, gameStarted, loading, startQuestionTimer]);

  // Handle answer selection
  const handleAnswer = (answer) => {
    if (showFeedback || isValidating || timeLeft <= 0) return;
    setSelectedAnswer(answer);
  };

  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isValidating || showFeedback) return;
    
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    
    setIsValidating(true);
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    try {
      const response = await validateAnswer(
        sessionId,
        currentQuestion.question_id,
        selectedAnswer,
        timeTaken
      );
      
      handleValidationResponse(response.data);
    } catch (error) {
      toast.error('Erreur lors de la validation');
      setIsValidating(false);
    }
  };

  // Start timer when question changes
  useEffect(() => {
    if (gameStarted && questions.length > 0 && currentIndex < questions.length) {
      startQuestionTimer();
    }
  }, [currentIndex, gameStarted, questions.length, startQuestionTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

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
  if (!currentQuestion) return null;

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
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-[#F5EFD9]/60">
              {currentIndex + 1}/{questions.length}
            </p>
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-[#C9A84C]" />
              <span className="text-sm font-bold text-[#C9A84C]">{totalPoints} pts</span>
            </div>
          </div>
        </div>

        <CountdownTimer seconds={10} timeLeft={timeLeft} onExpire={handleTimeExpired} />
      </div>

      {/* Question */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        {/* Feedback Display - Outside AnimatePresence to ensure visibility */}
        {showFeedback && feedbackData && (
          <motion.div
            key={`feedback-${currentIndex}`}
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`mb-6 p-6 rounded-xl shadow-2xl z-50 relative ${
              feedbackData.isCorrect 
                ? 'bg-gradient-to-r from-green-500/50 to-green-600/40 border-3 border-green-400 shadow-green-500/40' 
                : 'bg-gradient-to-r from-red-500/50 to-red-600/40 border-3 border-red-400 shadow-red-500/40'
            }`}
            style={{ 
              minHeight: '140px',
              backdropFilter: 'blur(12px)',
              position: 'relative'
            }}
          >
            <div className="flex items-start gap-4">
              {feedbackData.isCorrect ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                >
                  <CheckCircle className="text-green-300 flex-shrink-0 mt-1" size={36} strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                >
                  <XCircle className="text-red-300 flex-shrink-0 mt-1" size={36} strokeWidth={3} />
                </motion.div>
              )}
              <div className="flex-1">
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className={`font-bold text-3xl mb-4 ${
                    feedbackData.isCorrect ? 'text-green-200' : 'text-red-200'
                  }`}
                >
                  {feedbackData.isCorrect ? '✅ Correct !' : '❌ Incorrect'}
                </motion.p>
                {!feedbackData.isCorrect && feedbackData.correctAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mb-4 p-4 bg-yellow-500/30 rounded-lg border-2 border-yellow-400/50"
                  >
                    <p className="text-[#F5EFD9] text-sm mb-2 opacity-90 font-semibold">Bonne réponse :</p>
                    <p className="font-bold text-xl text-yellow-200">{feedbackData.correctAnswer}</p>
                  </motion.div>
                )}
                {feedbackData.explanation && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-[#F5EFD9] text-base mb-4 leading-relaxed"
                  >
                    {feedbackData.explanation}
                  </motion.p>
                )}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="flex items-center gap-3 mt-4 pt-4 border-t-2 border-white/30"
                >
                  <Sparkles size={22} className="text-[#C9A84C] animate-pulse" />
                  <span className="text-[#C9A84C] font-bold text-xl">
                    +{feedbackData.pointsEarned} {feedbackData.pointsEarned === 1 ? 'point' : 'points'}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

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

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                let buttonClass = 'glass-card-hover text-[#F5EFD9]';
                let isSelected = selectedAnswer === option;
                
                if (showFeedback && feedbackData) {
                  if (option === feedbackData.correctAnswer) {
                    buttonClass = 'bg-green-500/30 border-2 border-green-500 text-green-200';
                  } else if (isSelected && !feedbackData.isCorrect) {
                    buttonClass = 'bg-red-500/30 border-2 border-red-500 text-red-200';
                  }
                } else if (isSelected) {
                  buttonClass = 'bg-[#C9A84C] text-[#1B2042]';
                }
                
                return (
                  <motion.button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    whileTap={{ scale: 0.98 }}
                    disabled={showFeedback || isValidating || timeLeft <= 0}
                    className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                      showFeedback || isValidating || timeLeft <= 0 ? 'opacity-60 cursor-not-allowed' : ''
                    } ${buttonClass}`}
                    data-testid={`answer-option-${idx}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        buttonClass.includes('bg-[#C9A84C]') || buttonClass.includes('green') || buttonClass.includes('red')
                          ? 'bg-[#1B2042] text-[#C9A84C]'
                          : 'bg-white/10'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span>{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      {selectedAnswer && !showFeedback && !isValidating && timeLeft > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="px-6 py-4"
        >
          <button
            onClick={handleSubmitAnswer}
            className="cta-button w-full"
            data-testid="submit-answer-button"
          >
            Valider la réponse
          </button>
        </motion.div>
      )}

      {/* Loading indicator */}
      {isValidating && (
        <div className="px-6 py-4">
          <div className="flex items-center justify-center gap-2 text-[#F5EFD9]">
            <div className="spinner" style={{ width: '20px', height: '20px' }} />
            <span>Validation en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGame;
