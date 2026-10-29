import React, { useEffect, useState } from 'react';
import { BsodEmoticon } from './BsodEmoticon';

interface Screen2Props {
  onMeetDeveloper: () => void;
}

const LINES = [
  { text: 'SYSTEM DIAGNOSTICS COMPLETE', delayAfter: 800 },
  { text: 'The source of the problem has been identified.', delayAfter: 1200 },
  { text: 'It’s you.', delayAfter: 1900 },
];

export const Screen2: React.FC<Screen2Props> = ({ onMeetDeveloper }) => {
  const [visibleCount, setVisibleCount] = useState<number>(1);

  useEffect(() => {
    if (visibleCount < LINES.length) {
      const delay = LINES[visibleCount - 1].delayAfter;
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Once "It's you." is displayed, pause for dramatic effect to read along, then auto-forward
      const finalDelay = LINES[LINES.length - 1].delayAfter;
      const finishTimer = setTimeout(() => {
        onMeetDeveloper();
      }, finalDelay);
      return () => clearTimeout(finishTimer);
    }
  }, [visibleCount, onMeetDeveloper]);

  const handleSkip = () => {
    onMeetDeveloper();
  };

  return (
    <div
      onClick={handleSkip}
      className="w-full max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-16 text-white font-mono select-none cursor-pointer"
    >
      {/* Emoticon */}
      <BsodEmoticon />

      {/* Progressive Text Reveal Screen */}
      <div className="space-y-6 mb-10 min-h-[180px]">
        {visibleCount >= 1 && (
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight animate-fade-in">
            {LINES[0].text}
          </h1>
        )}

        <div className="space-y-4 text-base sm:text-lg md:text-xl text-white/95 leading-relaxed">
          {visibleCount >= 2 && (
            <p className="animate-fade-in">
              {LINES[1].text}
            </p>
          )}

          {visibleCount >= 3 && (
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide animate-fade-in pt-1">
              {LINES[2].text}
            </p>
          )}

          {visibleCount < 3 && (
            <span className="inline-block w-2.5 h-5 bg-white animate-pulse align-middle ml-1" />
          )}
        </div>
      </div>
    </div>
  );
};
