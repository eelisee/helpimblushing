import React from 'react';
import { BsodEmoticon } from './BsodEmoticon';

interface ScreenSystemFailureProps {
  onReload: () => void;
}

export const ScreenSystemFailure: React.FC<ScreenSystemFailureProps> = ({ onReload }) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-5 sm:px-8 py-8 sm:py-16 text-white font-mono select-none">
      <BsodEmoticon />

      <div className="space-y-6 mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          SYSTEM FAILURE
        </h1>
      </div>

      <div className="pt-2">
        <button
          onClick={onReload}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-[#0078d7] hover:bg-white/90 active:bg-white/80 font-mono font-bold text-base sm:text-lg tracking-wider border-2 border-white rounded-none cursor-pointer transition-transform active:translate-y-0.5 shadow-md focus:outline-none whitespace-nowrap"
        >
          [ RELOAD ]
        </button>
      </div>
    </div>
  );
};
