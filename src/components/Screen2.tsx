import React from 'react';
import { BsodEmoticon } from './BsodEmoticon';

interface Screen2Props {
  onTooDrunk: () => void;
  onMeetDeveloper: () => void;
}

export const Screen2: React.FC<Screen2Props> = ({
  onTooDrunk,
  onMeetDeveloper,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-16 text-white font-mono select-none">
      {/* Emoticon */}
      <BsodEmoticon />

      {/* Main Copy */}
      <div className="space-y-6 mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          SYSTEM DIAGNOSTICS COMPLETE
        </h1>

        <div className="space-y-4 text-base sm:text-lg md:text-xl text-white/95 leading-relaxed">
          <p>The source of the problem has been identified.</p>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            It’s you.
          </p>
        </div>
      </div>

      {/* Exactly Two Retro Status Buttons with smaller text */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={onTooDrunk}
          className="w-full text-center px-4 py-3.5 bg-transparent hover:bg-white/10 active:bg-white/20 text-white font-mono font-bold text-[11px] sm:text-xs md:text-sm tracking-wider border-2 border-white rounded-none cursor-pointer transition-colors shadow-sm focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
        >
          [ I’M TOO DRUNK TO DEBUG THIS ]
        </button>

        <button
          onClick={onMeetDeveloper}
          className="w-full text-center px-4 py-3.5 bg-white text-[#0078d7] hover:bg-white/90 active:bg-white/80 font-mono font-bold text-[11px] sm:text-xs md:text-sm tracking-wider border-2 border-white rounded-none cursor-pointer transition-transform active:translate-y-0.5 shadow-md focus:outline-none whitespace-nowrap overflow-hidden text-ellipsis"
        >
          [ I'D LIKE TO MEET THE DEVELOPER ]
        </button>
      </div>
    </div>
  );
};
