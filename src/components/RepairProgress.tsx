import React, { useEffect, useState } from 'react';

interface RepairProgressProps {
  onRepairComplete: () => void;
  speed?: 'normal' | 'fast';
}

export const RepairProgress: React.FC<RepairProgressProps> = ({
  onRepairComplete,
  speed = 'normal',
}) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    // 'normal' is ~5.5s (loved by the user)
    // 'fast' is ~1.8s for the reload after "too drunk to debug"
    const isFast = speed === 'fast';
    const intervalTime = isFast ? 80 : 180;

    const timer = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onRepairComplete();
          }, isFast ? 250 : 400);
          return 100;
        }

        let increment: number;
        if (isFast) {
          increment = Math.floor(Math.random() * 8) + 6;
        } else {
          increment = Math.floor(Math.random() * 4) + 2;
          if (prev >= 42 && prev <= 48) increment = 1;
          if (prev >= 78 && prev <= 84) increment = 1;
        }

        const next = Math.min(prev + increment, 100);
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onRepairComplete, speed]);

  return (
    <div className="w-full max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-16 text-white font-mono select-none">
      {/* Loading header */}
      <div className="space-y-4 mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
          RUNNING SYSTEM DIAGNOSTICS…
        </h1>
        <p className="text-sm sm:text-base text-white/85">
          Windows is analyzing system components and reality parameters.
        </p>
      </div>

      {/* Retro Windows progress bar */}
      <div className="space-y-4 max-w-lg">
        <div className="flex justify-between text-xs sm:text-sm text-white/90 font-mono">
          <span>Analyzing crash dump</span>
          <span className="font-bold tabular-nums">{percent}% complete</span>
        </div>

        {/* Minimal retro frame */}
        <div className="w-full h-7 border-2 border-white p-0.5 bg-black/20">
          <div
            className="h-full bg-white transition-all duration-150"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="pt-2">
          <span className="text-xs text-white/50">
            Please wait while diagnostics run.
          </span>
        </div>
      </div>
    </div>
  );
};
