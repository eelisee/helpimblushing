import React from 'react';
import { BsodEmoticon } from './BsodEmoticon';

interface Screen1Props {
  onTryRepair: () => void;
}

export const Screen1: React.FC<Screen1Props> = ({ onTryRepair }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-16 text-white font-mono select-none">
      {/* Authentic Windows Sad Face */}
      <BsodEmoticon />

      {/* Primary Troubleshooting Error Copy */}
      <div className="space-y-6 mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          TROUBLESHOOTING RESULTS
        </h1>

        <div className="space-y-4 text-base sm:text-lg md:text-xl text-white/95 leading-relaxed">
          <p>The problem has been identified.</p>
          <p>Unfortunately, the problem is still here.</p>
        </div>
      </div>

      {/* Retro Action Button */}
      <div className="pt-2">
        <button
          onClick={onTryRepair}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-[#0078d7] hover:bg-white/90 active:bg-white/80 font-mono font-bold text-base sm:text-lg tracking-wider border-2 border-white rounded-none cursor-pointer transition-transform active:translate-y-0.5 shadow-md focus:outline-none whitespace-nowrap"
        >
          [ RUN DIAGNOSTICS ]
        </button>
      </div>
    </div>
  );
};
