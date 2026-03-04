import React from 'react';
import { X, Clock } from 'lucide-react';

const CountdownTimer = ({ seconds, timeLeft, onExpire }) => {
  // If timeLeft is provided externally, use it; otherwise manage internally
  const [internalTimeLeft, setInternalTimeLeft] = React.useState(seconds);
  const hasExpiredRef = React.useRef(false);
  const isControlled = timeLeft !== undefined;

  const currentTimeLeft = isControlled ? timeLeft : internalTimeLeft;

  React.useEffect(() => {
    // Empêcher les appels multiples de onExpire qui créent une boucle infinie
    if (currentTimeLeft <= 0) {
      if (!hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpire?.();
      }
      return;
    } else {
      hasExpiredRef.current = false;
    }

    // Only manage timer internally if not controlled
    if (!isControlled) {
      const timer = setInterval(() => {
        setInternalTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentTimeLeft, onExpire, isControlled]);

  // Reset expired flag when timeLeft resets
  React.useEffect(() => {
    if (currentTimeLeft === seconds) {
      hasExpiredRef.current = false;
    }
  }, [currentTimeLeft, seconds]);

  const percentage = (currentTimeLeft / seconds) * 100;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let colorClass = 'stroke-[#2ECC71]';
  if (percentage < 30) {
    colorClass = 'stroke-[#E74C3C]';
  } else if (percentage < 60) {
    colorClass = 'stroke-[#F1C40F]';
  }

  return (
    <div className="relative" data-testid="countdown-timer">
      <svg className="transform -rotate-90" width="60" height="60">
        <circle
          cx="30"
          cy="30"
          r="25"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="5"
          fill="none"
        />
        <circle
          cx="30"
          cy="30"
          r="25"
          className={`${colorClass} transition-all duration-300`}
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-[#F5EFD9]" data-testid="timer-value">
          {currentTimeLeft}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
