import React, { useEffect, useState } from 'react';
import { BsodEmoticon } from './BsodEmoticon';

interface Screen3Props {
  onContactHumanSupport: () => void;
}

const LINES = [
  { text: 'Attempting to resolve the issue…', delayAfter: 800 },
  { text: 'Running repair protocol...', delayAfter: 1100 },
  { text: 'REPAIR FAILED.', delayAfter: 1000 },
  { text: 'The problem appears to be out of our hands.', delayAfter: 700 },
];

export const Screen3: React.FC<Screen3Props> = ({ onContactHumanSupport }) => {
  const [visibleCount, setVisibleCount] = useState<number>(0);

  useEffect(() => {
    if (visibleCount < LINES.length) {
      const delay = LINES[visibleCount].delayAfter;
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  const isComplete = visibleCount >= LINES.length;

  return (
    <div className="w-full max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-16 text-white font-mono select-none">
      <BsodEmoticon />

      <div className="space-y-5 mb-10 min-h-[200px]">
        {LINES.slice(0, visibleCount).map((item, index) => {
          const isFailed = index === 2;
          const isOutOfHands = index === 3;

          return (
            <p
              key={index}
              className={`leading-relaxed animate-fade-in ${
                isFailed
                  ? 'text-xl sm:text-2xl font-bold text-white tracking-wide pt-1'
                  : isOutOfHands
                  ? 'text-base sm:text-lg text-white/95 font-medium'
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

      {isComplete && (
        <div className="pt-2 animate-fade-in">
          <button
            onClick={onContactHumanSupport}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-[#0078d7] hover:bg-white/90 active:bg-white/80 font-mono font-bold text-base sm:text-lg tracking-wider border-2 border-white rounded-none cursor-pointer transition-transform active:translate-y-0.5 shadow-md focus:outline-none whitespace-nowrap"
          >
            [ HUMAN SUPPORT ]
          </button>
        </div>
      )}
    </div>
  );
};
