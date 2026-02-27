import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Trop d’écrans, pas assez de savoir ?",
      subtitle: "Change ça avec Quizz+",
      image: "https://images.unsplash.com/photo-1680878898191-7c8a1e3b8180?w=800&fit=crop",
      bgColor: "from-[#1B2042] to-[#2C3E7A]"
    },
    {
      title: "Joue. Apprends. Gagne.",
      subtitle: "Des quizz courts, des récompenses réelles, une culture qui grandit.",
      image: "https://images.unsplash.com/photo-1680878903102-92692799ef36?w=800&fit=crop",
      bgColor: "from-[#1B2042] to-[#3B4A7A]"
    },
    {
      title: "Rejoins des milliers de joueurs",
      subtitle: "Classements hebdos, compétitions live, badges exclusifs.",
      image: "https://images.unsplash.com/photo-1605896163420-830698e44fb1?w=800&fit=crop",
      bgColor: "from-[#1B2042] to-[#4A5A8A]"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.setItem('hasSeenOnboarding', 'true');
      navigate('/signup');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-[#1B2042] relative overflow-hidden" data-testid="onboarding-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex flex-col"
        >
          {/* Image with gradient overlay */}
          <div className="relative h-1/2 overflow-hidden">
            <img
              src={slides[currentSlide].image}
              alt="Onboarding"
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${slides[currentSlide].bgColor} opacity-80`} />
          </div>

          {/* Content */}
          <div className="flex-1 bg-[#1B2042] px-8 py-12 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#F5EFD9] mb-4" data-testid={`onboarding-title-${currentSlide}`}>
                {slides[currentSlide].title}
              </h2>
              <p className="text-lg text-[#F5EFD9]/70">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-[#C9A84C]'
                      : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Button */}
            <button
              onClick={handleNext}
              data-testid="onboarding-next-button"
              className="cta-button w-full flex items-center justify-center gap-2"
            >
              {currentSlide < slides.length - 1 ? 'Suivant' : 'Commencer maintenant'}
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Skip button */}
      <button
        onClick={handleSkip}
        data-testid="onboarding-skip-button"
        className="absolute top-6 right-6 text-[#F5EFD9]/60 hover:text-[#F5EFD9] font-medium z-10"
      >
        Passer
      </button>
    </div>
  );
};

export default Onboarding;
