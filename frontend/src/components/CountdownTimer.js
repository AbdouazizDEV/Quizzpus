import React from 'react';
import { X, Clock } from 'lucide-react';

const CountdownTimer = ({ seconds, onExpire }) => {
  const [timeLeft, setTimeLeft] = React.useState(seconds);

  React.useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const percentage = (timeLeft / seconds) * 100;
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
          {timeLeft}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
