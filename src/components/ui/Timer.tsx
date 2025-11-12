import React, { useEffect, useState } from 'react';
import { Clock, Pause, Play } from 'lucide-react';

interface TimerProps {
  initialSeconds: number;
  onTimeUp?: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  initialSeconds,
  onTimeUp,
  isPaused,
  onTogglePause,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, secondsLeft, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const isLowTime = secondsLeft < 60;
  const isVeryLowTime = secondsLeft < 30;

  const timerColor = isVeryLowTime
    ? 'text-red-600'
    : isLowTime
    ? 'text-orange-600'
    : 'text-gray-700';

  return (
    <div className={`flex items-center gap-3 ${timerColor}`}>
      <Clock className="w-5 h-5" />
      <span className="text-lg font-mono font-semibold">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
      <button
        onClick={onTogglePause}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
      >
        {isPaused ? (
          <Play className="w-4 h-4" />
        ) : (
          <Pause className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
