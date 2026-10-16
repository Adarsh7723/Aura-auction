import React, { useState, useEffect } from 'react';
import { formatTimeRemaining } from '../utils/formatters';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endTime: number;
  className?: string;
  showIcon?: boolean;
  onEnd?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  endTime,
  className = '',
  showIcon = true,
  onEnd
}) => {
  const [remaining, setRemaining] = useState(() => formatTimeRemaining(endTime));

  useEffect(() => {
    const update = () => {
      const res = formatTimeRemaining(endTime);
      setRemaining(res);
      if (res.isEnded && onEnd) {
        onEnd();
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime, onEnd]);

  if (remaining.isEnded) {
    return (
      <span className={`text-xs font-mono font-medium text-slate-500 ${className}`}>
        Closed
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono text-xs tabular-nums ${
        remaining.isUrgent ? 'text-amber-700 font-semibold' : 'text-slate-700'
      } ${className}`}
    >
      {showIcon && (
        <Clock
          className={`w-3.5 h-3.5 ${
            remaining.isUrgent ? 'text-amber-600' : 'text-slate-400'
          }`}
        />
      )}
      <span>{remaining.formatted}</span>
    </div>
  );
};
