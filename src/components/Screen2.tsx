import React, { useEffect, useState } from 'react';
import { BsodEmoticon } from './BsodEmoticon';

interface Screen2Props {
  onTryRepair: () => void;
}

const LINES = [
  { text: 'RUNNING DIAGNOSTICS…', delayAfter: 600 },
  { text: 'Checking source of the problem…', delayAfter: 800 },
  { text: 'SOURCE IDENTIFIED.', delayAfter: 1200 },
  { text: 'Oh.', delayAfter: 1100 },
  { text: 'It’s you.', delayAfter: 700 },
];

export const Screen2: React.FC<Screen2Props> = ({ onTryRepair }) => {
  const [visibleCount, setVisibleCount] = useState<number>(0);

  useEffect(() => {
    if (visibleCount < LINES.length) {
      const currentDelay = LINES[visibleCount].delayAfter;
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, currentDelay);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  const isComplete = visibleCount >= LINES.length;

  return (
    <div className="w-full max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-16 text-white font-mono select-none">
      {/* Emoticon */}
      <BsodEmoticon />

      {/* Diagnostics Progressive Lines */}
      <div className="space-y-4 sm:space-y-5 mb-10 min-h-[220px]">
        {LINES.slice(0, visibleCount).map((item, index) => {
          const isHeader = index === 0;
          const isIdentified = index === 2;
          const isOh = index === 3;
          const isItsMe = index === 4;

          return (
            <p
              key={index}
              className={`leading-relaxed animate-fade-in ${
                isHeader
                  ? 'text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white'
                  : isIdentified
                  ? 'text-lg sm:text-xl font-bold text-white tracking-wide'
                  : isOh
                  ? 'text-lg sm:text-xl font-medium text-white/95'
                  : isItsMe
                  ? 'text-xl sm:text-2xl font-bold text-white'
                  : 'text-base sm:text-lg text-white/85'
              }`}
            >
              {item.text}
            </p>
          );
        })}

        {!isComplete && (
          <span className="inline-block w-2.5 h-5 bg-white animate-pulse align-middle ml-1" />
        )}
      </div>

      {/* Action Button: [ TRY REPAIR ] */}
      {isComplete && (
        <div className="pt-2 animate-fade-in">
          <button
            onClick={onTryRepair}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-[#0078d7] hover:bg-white/90 active:bg-white/80 font-mono font-bold text-base sm:text-lg tracking-wider border-2 border-white rounded-none cursor-pointer transition-transform active:translate-y-0.5 shadow-md focus:outline-none whitespace-nowrap"
          >
            [ TRY REPAIR ]
          </button>
        </div>
      )}
    </div>
  );
};
