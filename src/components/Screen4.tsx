import React, { useState } from 'react';
import { Instagram } from 'lucide-react';
import { INSTAGRAM_USERNAME } from '../config';

interface Screen4Props {
  onRestart: () => void;
}

interface Inquiry {
  id: string;
  buttonLabel: string;
  message: string;
}

const INQUIRIES: Inquiry[] = [
  {
    id: 'error_question',
    buttonLabel: 'QUESTION ABOUT ERROR',
    message: 'Hi, I scanned your QR code and have one question. Is the developer always this hard to debug? 🤓',
  },
  {
    id: 'speak_developer',
    buttonLabel: "I'D LIKE TO SPEAK TO THE DEVELOPER",
    message: "Hi! Windows says manual intervention is required. I'd like to speak to the developer 😉",
  },
  {
    id: 'found_fix',
    buttonLabel: 'I THINK I FOUND A FIX',
    message: 'I think I found a fix for your problem. Coffee or a drink to debug in person? ☕✨',
  },
];

export const Screen4: React.FC<Screen4Props> = ({ onRestart }) => {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry>(INQUIRIES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const instagramUrl = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(selectedInquiry.message);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = selectedInquiry.message;
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

  const handleSelectInquiry = (inquiry: Inquiry) => {
    // Only switch selection - do not auto-copy
    setSelectedInquiry(inquiry);
    setCopied(false);
  };

  const handleOpenInstagram = () => {
    // Only open Instagram - do not auto-copy
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 text-white font-mono select-none">
      {/* Header */}
      <div className="space-y-1 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
          SUPPORT TICKET CREATED
        </h1>
        <p className="text-xs sm:text-sm text-white/85">
          Please select the nature of your inquiry:
        </p>
      </div>

      {/* 3 Inquiry Buttons - guaranteed 1 line each */}
      <div className="space-y-2 mb-4">
        {INQUIRIES.map((inquiry) => {
          const isSelected = inquiry.id === selectedInquiry.id;
          return (
            <button
              key={inquiry.id}
              onClick={() => handleSelectInquiry(inquiry)}
              className={`w-full text-left px-3 py-2.5 font-mono font-bold text-[11px] sm:text-xs md:text-sm border-2 transition-all cursor-pointer rounded-none whitespace-nowrap overflow-hidden text-ellipsis ${
                isSelected
                  ? 'border-white bg-white text-[#0078d7]'
                  : 'border-white/50 text-white hover:border-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-1 overflow-hidden">
                <span className="truncate">[ {inquiry.buttonLabel} ]</span>
                {isSelected && <span className="text-[10px] uppercase font-bold shrink-0 ml-1">●</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Suggested Description Box */}
      <div className="p-3.5 border-2 border-white bg-black/25 space-y-2.5 mb-4">
        <div className="flex items-center justify-between text-[11px] text-white/70 border-b border-white/20 pb-1.5">
          <span>SUGGESTED DESCRIPTION:</span>
          <span>@{INSTAGRAM_USERNAME}</span>
        </div>

        <div className="p-2.5 bg-black/40 border border-white/30 text-white font-mono text-xs sm:text-sm leading-relaxed italic">
          "{selectedInquiry.message}"
        </div>

        {/* Action Buttons: [ COPY ] and [ <Instagram Icon> ] */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCopy}
            className={`w-full py-2.5 px-3 font-mono font-bold text-xs sm:text-sm tracking-wider border-2 border-white rounded-none cursor-pointer transition-all active:translate-y-0.5 text-center whitespace-nowrap ${
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
            title="Open Instagram"
            className="w-full py-2.5 px-3 bg-transparent hover:bg-white/15 text-white font-mono font-bold text-xs sm:text-sm tracking-wider border-2 border-white rounded-none cursor-pointer transition-colors active:translate-y-0.5 flex items-center justify-center whitespace-nowrap"
          >
            <span className="inline-flex items-center gap-1">
              [ <Instagram className="w-4 h-4 inline-block" /> ]
            </span>
          </button>
        </div>
      </div>

      {/* Subtle reboot link */}
      <div className="text-center pt-1">
        <button
          onClick={onRestart}
          className="text-[11px] text-white/50 hover:text-white underline cursor-pointer font-mono"
        >
          [ Reboot System ]
        </button>
      </div>
    </div>
  );
};
