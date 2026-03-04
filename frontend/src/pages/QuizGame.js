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
    setFeedbackData({
      isCorrect: data.is_correct,
      pointsEarned: data.points_earned,
      explanation: data.explanation,
      correctAnswer: data.correct_answer
    });
    setCurrentScore(data.current_score);
    setTotalPoints(data.total_points);
    setShowFeedback(true);
    setIsValidating(false);
    
    // Auto-advance after 3 seconds
    feedbackTimeoutRef.current = setTimeout(() => {
      if (data.is_complete) {
        finishQuizSession();
      } else {
        moveToNextQuestion();
      }
    }, 3000);
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

            {/* Feedback Display */}
            {showFeedback && feedbackData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl ${
                  feedbackData.isCorrect 
                    ? 'bg-green-500/20 border-2 border-green-500' 
                    : 'bg-red-500/20 border-2 border-red-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  {feedbackData.isCorrect ? (
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={24} />
                  ) : (
                    <XCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                  )}
                  <div className="flex-1">
                    <p className={`font-bold text-lg mb-2 ${
                      feedbackData.isCorrect ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {feedbackData.isCorrect ? '✅ Correct !' : '❌ Incorrect'}
                    </p>
                    {!feedbackData.isCorrect && (
                      <p className="text-[#F5EFD9] mb-2">
                        <span className="opacity-60">Bonne réponse :</span>{' '}
                        <span className="font-semibold">{feedbackData.correctAnswer}</span>
                      </p>
                    )}
                    {feedbackData.explanation && (
                      <p className="text-[#F5EFD9]/80 text-sm mb-2">
                        {feedbackData.explanation}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles size={16} className="text-[#C9A84C]" />
                      <span className="text-[#C9A84C] font-bold">
                        +{feedbackData.pointsEarned} points
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

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
