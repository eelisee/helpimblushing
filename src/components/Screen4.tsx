import React, { useState } from 'react';
import { Instagram } from 'lucide-react';
import { INSTAGRAM_USERNAME } from '../config';
import { BsodEmoticon } from './BsodEmoticon';

interface Screen4Props {
  onRestart: () => void;
}

const PRESET_MESSAGE =
  "Hi! My system seems to have encountered an unexpected situation, and I have a feeling the developer might have something to do with it. 😉";

export const Screen4: React.FC<Screen4Props> = ({ onRestart }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const instagramUrl = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(PRESET_MESSAGE);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = PRESET_MESSAGE;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleOpenInstagram = () => {
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-5 sm:px-8 py-8 sm:py-16 text-white font-mono select-none">
      {/* Emoticon matching the other screens */}
      <BsodEmoticon />

      {/* Header */}
      <div className="space-y-3 mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
          SUPPORT TICKET
        </h1>
        <p className="text-base sm:text-lg text-white/95 leading-relaxed">
          Contact human developer directly.
        </p>
      </div>

      {/* Suggested Description Box matching the BSOD aesthetic */}
      <div className="p-4 sm:p-5 border-2 border-white bg-transparent space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs text-white/70 border-b border-white/20 pb-2">
          <span>SUGGESTED DESCRIPTION:</span>
          <span>@{INSTAGRAM_USERNAME}</span>
        </div>

        <div className="p-3 border border-white/40 text-white font-mono text-xs sm:text-sm leading-relaxed italic bg-white/5">
          "{PRESET_MESSAGE}"
        </div>

        {/* Action Buttons: [ COPY ] and [ <Instagram Icon> ] */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleCopy}
            className={`w-full py-3 px-3 font-mono font-bold text-xs sm:text-sm tracking-wider border-2 border-white rounded-none cursor-pointer transition-all active:translate-y-0.5 text-center whitespace-nowrap ${
              copied
                ? 'bg-emerald-300 text-slate-900 border-emerald-300'
                : 'bg-white text-[#0078d7] hover:bg-white/90'
            }`}
          >
            {copied ? '[ COPIED ]' : '[ COPY ]'}
          </button>

          <button
            onClick={handleOpenInstagram}
            aria-label="Open Instagram"
            title="Open Instagram Profile"
            className="w-full py-3 px-3 bg-transparent hover:bg-white/15 text-white font-mono font-bold text-xs sm:text-sm tracking-wider border-2 border-white rounded-none cursor-pointer transition-colors active:translate-y-0.5 flex items-center justify-center whitespace-nowrap"
          >
            <span className="inline-flex items-center gap-1.5">
              [ <Instagram className="w-4 h-4 inline-block" /> ]
            </span>
          </button>
        </div>
      </div>

      {/* Subtle reboot link */}
      <div className="text-center pt-2">
        <button
          onClick={onRestart}
          className="text-xs text-white/50 hover:text-white underline cursor-pointer font-mono"
        >
          [ Reboot System ]
        </button>
      </div>
    </div>
  );
};
