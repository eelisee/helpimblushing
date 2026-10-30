import React, { useEffect, useState } from 'react';
import { BsodEmoticon } from './BsodEmoticon';

interface Screen2Props {
  onPersonalVisit: () => void;
  onOpenSupportTicket: () => void;
}

const LINES = [
  { text: 'SYSTEM DIAGNOSTICS COMPLETE', delayAfter: 800 },
  { text: 'The source of the problem has been identified.', delayAfter: 1200 },
  { text: 'It’s you.', delayAfter: 1000 },
];

export const Screen2: React.FC<Screen2Props> = ({ onPersonalVisit, onOpenSupportTicket }) => {
  const [visibleCount, setVisibleCount] = useState<number>(1);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  useEffect(() => {
    if (visibleCount < LINES.length) {
      const delay = LINES[visibleCount - 1].delayAfter;
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // Once "It's you." is displayed, display the choice buttons
      const timer = setTimeout(() => {
        setShowButtons(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [visibleCount]);

  const handleSkipAnimation = () => {
    setVisibleCount(LINES.length);
    setShowButtons(true);
  };

  const isSmiling = visibleCount >= 3;

  return (
    <div className="w-full max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-16 text-white font-mono select-none">
      {/* Emoticon: turns into :) as soon as "It's you." appears */}
      {isSmiling ? (
        <div className="font-mono text-7xl sm:text-8xl md:text-9xl font-light tracking-tighter text-white mb-6 select-none animate-fade-in">
          :)
        </div>
      ) : (
        <BsodEmoticon />
      )}

      {/* Progressive Text Reveal */}
      <div 
        onClick={!showButtons ? handleSkipAnimation : undefined}
        className={`space-y-6 mb-8 min-h-[160px] ${!showButtons ? 'cursor-pointer' : ''}`}
      >
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

      {/* Two Action Buttons: [ OPEN SUPPORT TICKET ] on top, [ CONTACT SUPPORT DIRECTLY ] below */}
      {showButtons && (
        <div className="space-y-3.5 pt-2 animate-fade-in">
          {/* Button 1: Open Support Ticket */}
          <button
            onClick={onOpenSupportTicket}
            className="w-full py-4 px-4 bg-transparent hover:bg-white/10 active:bg-white/20 text-white font-mono font-bold text-xs sm:text-sm tracking-wider border-2 border-white rounded-none cursor-pointer transition-colors whitespace-nowrap text-center"
          >
            [ OPEN SUPPORT TICKET ]
          </button>

          {/* Button 2: Contact Support Directly (to Neural Date Compiler) */}
          <button
            onClick={onPersonalVisit}
            className="w-full py-4 px-4 bg-white text-[#0078d7] hover:bg-white/90 active:bg-white/80 font-mono font-bold text-xs sm:text-sm tracking-wider border-2 border-white rounded-none cursor-pointer transition-transform active:translate-y-0.5 shadow-md whitespace-nowrap text-center"
          >
            [ CONTACT SUPPORT DIRECTLY ]
          </button>
        </div>
      )}
    </div>
  );
};
