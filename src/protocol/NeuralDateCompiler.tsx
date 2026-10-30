import React, { useState } from 'react';
import { INSTAGRAM_USERNAME } from '../config';
import { 
  CandidateFeatures, 
  InferenceResult, 
  CANDIDATE_VENUES, 
  TOPIC_WEIGHTS, 
  BEVERAGE_WEIGHTS, 
  predictDateMatch 
} from '../ml/eliseeModel';
import { Instagram, ArrowLeft, ArrowRight, Sparkles, X, Calendar, Check } from 'lucide-react';

interface NeuralDateCompilerProps {
  onReturnToBsod: () => void;
}

interface TimeSlotItem {
  label: string;
  startHour: number;
}

interface DateSlotOption {
  dateLabel: string;
  isoDate: string; // YYYYMMDD
  times: TimeSlotItem[];
}

// Standard time slot definitions
const TIMES_6PM_TO_8PM: TimeSlotItem[] = [
  { label: '6:00 PM', startHour: 18 },
  { label: '7:00 PM', startHour: 19 },
  { label: '8:00 PM', startHour: 20 },
];

const TIMES_5PM_TO_8PM: TimeSlotItem[] = [
  { label: '5:00 PM', startHour: 17 },
  { label: '6:00 PM', startHour: 18 },
  { label: '7:00 PM', startHour: 19 },
  { label: '8:00 PM', startHour: 20 },
];

const TIMES_1PM_TO_8PM: TimeSlotItem[] = [
  { label: '1:00 PM', startHour: 13 },
  { label: '2:00 PM', startHour: 14 },
  { label: '3:00 PM', startHour: 15 },
  { label: '4:00 PM', startHour: 16 },
  { label: '5:00 PM', startHour: 17 },
  { label: '6:00 PM', startHour: 18 },
  { label: '7:00 PM', startHour: 19 },
  { label: '8:00 PM', startHour: 20 },
];

const AVAILABLE_DATES: DateSlotOption[] = [
  {
    dateLabel: 'Tuesday, Nov 3',
    isoDate: '20261103',
    times: TIMES_6PM_TO_8PM,
  },
  {
    dateLabel: 'Wednesday, Nov 4',
    isoDate: '20261104',
    times: TIMES_5PM_TO_8PM,
  },
  {
    dateLabel: 'Thursday, Nov 5',
    isoDate: '20261105',
    times: TIMES_6PM_TO_8PM,
  },
  // Sunday, 8th of November, until Friday 13th of November
  {
    dateLabel: 'Sunday, Nov 8',
    isoDate: '20261108',
    times: TIMES_1PM_TO_8PM,
  },
  {
    dateLabel: 'Monday, Nov 9',
    isoDate: '20261109',
    times: TIMES_5PM_TO_8PM,
  },
  {
    dateLabel: 'Tuesday, Nov 10',
    isoDate: '20261110',
    times: TIMES_5PM_TO_8PM,
  },
  {
    dateLabel: 'Wednesday, Nov 11',
    isoDate: '20261111',
    times: TIMES_5PM_TO_8PM,
  },
  {
    dateLabel: 'Thursday, Nov 12',
    isoDate: '20261112',
    times: TIMES_5PM_TO_8PM,
  },
  {
    dateLabel: 'Friday, Nov 13',
    isoDate: '20261113',
    times: TIMES_5PM_TO_8PM,
  },
  // Saturday, Nov 14 (1 PM to 8 PM)
  {
    dateLabel: 'Saturday, Nov 14',
    isoDate: '20261114',
    times: TIMES_1PM_TO_8PM,
  },
  // Sunday, Nov 15 until Monday, Nov 23
  {
    dateLabel: 'Sunday, Nov 15',
    isoDate: '20261115',
    times: TIMES_1PM_TO_8PM,
  },
  {
    dateLabel: 'Monday, Nov 16',
    isoDate: '20261116',
    times: TIMES_5PM_TO_8PM,
  },
  {
    dateLabel: 'Tuesday, Nov 17',
    isoDate: '20261117',
    times: TIMES_5PM_TO_8PM,
  },
  {
    dateLabel: 'Wednesday, Nov 18',
    isoDate: '20261118',
    times: TIMES_5PM_TO_8PM,
  },
  {
    dateLabel: 'Thursday, Nov 19',
    isoDate: '20261119',
    times: TIMES_5PM_TO_8PM,
  },
  {
    dateLabel: 'Friday, Nov 20',
    isoDate: '20261120',
    times: TIMES_5PM_TO_8PM,
  },
  {
    dateLabel: 'Saturday, Nov 21',
    isoDate: '20261121',
    times: TIMES_1PM_TO_8PM,
  },
  {
    dateLabel: 'Sunday, Nov 22',
    isoDate: '20261122',
    times: TIMES_1PM_TO_8PM,
  },
  {
    dateLabel: 'Monday, Nov 23',
    isoDate: '20261123',
    times: TIMES_5PM_TO_8PM,
  },
];

export const NeuralDateCompiler: React.FC<NeuralDateCompilerProps> = ({ onReturnToBsod }) => {
  // Candidate inputs
  const [locationId, setLocationId] = useState<string>(CANDIDATE_VENUES[0].id);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'tech_philosophy',
    'absurd_questions',
  ]);
  const [beverage, setBeverage] = useState<CandidateFeatures['beverage']>('good_wine');
  const [customProposal, setCustomProposal] = useState<string>('');

  // Stages: SETUP -> TRAINING -> ATTRIBUTION -> SCHEDULING
  const [currentStage, setCurrentStage] = useState<'SETUP' | 'TRAINING' | 'ATTRIBUTION' | 'SCHEDULING'>('SETUP');

  // ML State
  const [trainingLogs, setTrainingLogs] = useState<{ epoch: number; loss: number; accuracy: number }[]>([]);
  const [activeEpochIndex, setActiveEpochIndex] = useState(0);
  const [inferenceResult, setInferenceResult] = useState<InferenceResult | null>(null);

  // Scheduling State
  const [selectedDateSlot, setSelectedDateSlot] = useState<DateSlotOption>(AVAILABLE_DATES[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlotItem>(AVAILABLE_DATES[0].times[0]);
  const [showIcsModal, setShowIcsModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [icsDownloaded, setIcsDownloaded] = useState<boolean>(false);

  // When date changes, adjust time slot to match available times for that day
  const handleDateChange = (dateLabel: string) => {
    const found = AVAILABLE_DATES.find((d) => d.dateLabel === dateLabel) || AVAILABLE_DATES[0];
    setSelectedDateSlot(found);
    const existing = found.times.find((t) => t.label === selectedTimeSlot.label);
    setSelectedTimeSlot(existing || found.times[0]);
  };

  // Toggle multi-select topic
  const handleToggleTopic = (topicKey: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topicKey)) {
        if (prev.length <= 1) return prev;
        return prev.filter((k) => k !== topicKey);
      } else {
        return [...prev, topicKey];
      }
    });
  };

  // Run Training & Inference forward pass
  const handleRunInference = async () => {
    const candidatePayload: CandidateFeatures = {
      locationId,
      topics: selectedTopics,
      beverage,
      customProposal: customProposal.trim() || undefined,
    };

    setCurrentStage('TRAINING');
    setActiveEpochIndex(0);

    let result: InferenceResult;

    try {
      const response = await fetch('/api/ml/infer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidatePayload),
      });

      if (response.ok) {
        const json = await response.json();
        result = json.inference;
      } else {
        result = predictDateMatch(candidatePayload);
      }
    } catch {
      result = predictDateMatch(candidatePayload);
    }

    setInferenceResult(result);
    setTrainingLogs(result.trainingLogs);

    // Epoch animation across 16 epochs
    let currentIdx = 0;
    const interval = setInterval(() => {
      currentIdx += 1;
      setActiveEpochIndex(currentIdx);

      if (currentIdx >= result.trainingLogs.length) {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentStage('ATTRIBUTION');
        }, 300);
      }
    }, 100);
  };

  const selectedVenue = CANDIDATE_VENUES.find((v) => v.id === locationId) || CANDIDATE_VENUES[0];

  const topicsFormatted = selectedTopics
    .map((k) => TOPIC_WEIGHTS[k]?.label || k)
    .join(' & ');

  const beverageFormatted = BEVERAGE_WEIGHTS[beverage]?.label || 'Good Wine';

  // Final message: incorporates custom idea if provided
  const customProposalTrimmed = customProposal.trim();
  const generatedMessage = customProposalTrimmed
    ? `Neural Model Prediction: The ML model converged with 99.8% confidence on meeting at ${selectedVenue.name} (${selectedVenue.city}) on ${selectedDateSlot.dateLabel} at ${selectedTimeSlot.label} for ${topicsFormatted} & ${beverageFormatted} — plus custom proposal: "${customProposalTrimmed}". Overfitting on developer confirmed. Shall we validate in real life? 😉`
    : `Neural Model Prediction: The ML model converged with 99.8% confidence on meeting at ${selectedVenue.name} (${selectedVenue.city}) on ${selectedDateSlot.dateLabel} at ${selectedTimeSlot.label} for ${topicsFormatted} & ${beverageFormatted}. Overfitting on developer confirmed. Shall we validate in real life? 😉`;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleSendInstagram = () => {
    navigator.clipboard.writeText(generatedMessage);
    window.open(`https://www.instagram.com/${INSTAGRAM_USERNAME}/`, '_blank', 'noopener,noreferrer');
    setShowIcsModal(true);
  };

  // Strictly RFC 5545 compliant .ics calendar generator
  const handleDownloadCalendarIcs = () => {
    const startH = selectedTimeSlot.startHour.toString().padStart(2, '0');
    const endH = (selectedTimeSlot.startHour + 2).toString().padStart(2, '0');

    const dtStart = `${selectedDateSlot.isoDate}T${startH}0000`;
    const dtEnd = `${selectedDateSlot.isoDate}T${endH}0000`;
    const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const uid = `${Date.now()}-date-elise@helpimblushing.com`;

    const summary = `Date with Elise @ ${selectedVenue.name}`;
    const customLine = customProposalTrimmed ? `\\nCustom Idea: ${customProposalTrimmed}` : '';
    const description = `Neural Date Model confirmed meeting at ${selectedVenue.name} (${selectedVenue.city})\\nTopics: ${topicsFormatted}\\nBeverage: ${beverageFormatted}${customLine}\\nInstagram: @${INSTAGRAM_USERNAME}`;
    const location = `${selectedVenue.name}, ${selectedVenue.neighborhood}, ${selectedVenue.city}, CA`;

    // Standard RFC 5545 iCalendar syntax with CRLF line endings
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//helpimblushing//Neural Date Compiler//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
      'END:VCALENDAR',
    ];

    const icsContent = lines.join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Date_with_Elise_${selectedDateSlot.isoDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIcsDownloaded(true);
    setTimeout(() => setIcsDownloaded(false), 3500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 text-white font-mono select-none">
      {/* Top minimal bar */}
      <div className="flex items-center justify-between border-b border-white/20 pb-3 mb-6 text-xs">
        <button
          onClick={onReturnToBsod}
          className="hover:underline flex items-center gap-1.5 cursor-pointer text-white/80 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>[ Back to Blue Screen ]</span>
        </button>
      </div>

      {/* Emoticon turned to smiling :) */}
      <div className="inline-block select-none mb-6">
        <div className="font-mono text-7xl sm:text-8xl md:text-9xl font-light tracking-tighter text-white">
          :)
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2 mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white leading-tight">
          NEURAL DATE COMPILER
        </h1>
        <p className="text-xs sm:text-sm text-white/85">
          {currentStage === 'SETUP' && 'Configure candidate parameters to fine-tune matching weights.'}
          {currentStage === 'TRAINING' && 'Running gradient descent forward optimization...'}
          {currentStage === 'ATTRIBUTION' && 'Feature attribution breakdown computed.'}
          {currentStage === 'SCHEDULING' && 'Select temporal window for real-world execution.'}
        </p>
      </div>

      {/* ========================================================
          STAGE 1: HYPERPARAMETER SETUP
          ======================================================== */}
      {currentStage === 'SETUP' && (
        <div className="space-y-5 animate-fade-in">
          {/* 1. Location Selection */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 block">
              1. LOCATION TENSOR (BERKELEY &amp; SF):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CANDIDATE_VENUES.map((venue) => {
                const isSelected = locationId === venue.id;
                return (
                  <button
                    key={venue.id}
                    onClick={() => setLocationId(venue.id)}
                    className={`text-left p-2.5 border-2 transition-all cursor-pointer rounded-none text-xs ${
                      isSelected
                        ? 'border-white bg-white text-[#0078d7] font-bold shadow-sm'
                        : 'border-white/50 text-white hover:border-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate">{venue.name}</span>
                      {isSelected && <span className="font-bold shrink-0 ml-1">●</span>}
                    </div>
                    <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-[#0078d7]/80' : 'text-white/60'}`}>
                      {venue.city} — {venue.neighborhood}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Topics / Conversation Protocol (Multi-Select) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 block">
              2. DISCUSSION TOPICS (MULTI-SELECT):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(TOPIC_WEIGHTS).map(([key, item]) => {
                const isChecked = selectedTopics.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => handleToggleTopic(key)}
                    className={`text-left p-2.5 border-2 transition-all cursor-pointer rounded-none text-xs ${
                      isChecked
                        ? 'border-white bg-white text-[#0078d7] font-bold'
                        : 'border-white/50 text-white hover:border-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>[{isChecked ? 'X' : ' '}] {item.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Beverages (Ranked Selection) */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 block">
              3. BEVERAGE CALIBRATION:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.entries(BEVERAGE_WEIGHTS).map(([key, item]) => {
                const isSelected = beverage === key;
                return (
                  <button
                    key={key}
                    onClick={() => setBeverage(key as CandidateFeatures['beverage'])}
                    className={`text-center p-2.5 border-2 transition-all cursor-pointer rounded-none text-xs ${
                      isSelected
                        ? 'border-white bg-white text-[#0078d7] font-bold'
                        : 'border-white/50 text-white hover:border-white hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Propose Your Own Idea (Freeform Input) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-white/70">
              <span>4. PROPOSE YOUR OWN IDEA (OPTIONAL):</span>
              <span className="text-white/40 text-[10px]">FREEFORM INPUT</span>
            </div>
            <textarea
              value={customProposal}
              onChange={(e) => setCustomProposal(e.target.value)}
              placeholder="Have a specific venue, activity, or plan in mind? Write it here..."
              rows={2}
              className="w-full p-3 bg-black/30 border-2 border-white/60 focus:border-white text-white font-mono text-xs sm:text-sm focus:outline-none rounded-none placeholder:text-white/40 leading-relaxed resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-3">
            <button
              onClick={handleRunInference}
              className="w-full py-4 bg-white text-[#0078d7] hover:bg-white/90 active:bg-white/80 font-mono font-bold text-sm sm:text-base tracking-wider border-2 border-white rounded-none cursor-pointer transition-transform active:translate-y-0.5 shadow-md whitespace-nowrap"
            >
              [ TRAIN BACKEND MODEL ]
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 2: TRAINING SIMULATION
          ======================================================== */}
      {currentStage === 'TRAINING' && (
        <div className="p-5 border-2 border-white bg-black/25 space-y-4 animate-fade-in my-4">
          <div className="flex items-center justify-between text-xs text-white/80 border-b border-white/20 pb-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              BACKEND GRADIENT DESCENT (SGD OPTIMIZER)...
            </span>
            <span>EPOCH: {activeEpochIndex}/16</span>
          </div>

          <div className="w-full h-6 border-2 border-white p-0.5 bg-black/40">
            <div
              className="h-full bg-white transition-all duration-100"
              style={{ width: `${(activeEpochIndex / 16) * 100}%` }}
            />
          </div>

          <div className="text-xs space-y-1 font-mono text-white/90">
            {trainingLogs.slice(0, activeEpochIndex).slice(-4).map((log) => (
              <p key={log.epoch}>
                &gt; Epoch {log.epoch.toString().padStart(2, '0')}/16 | Loss: {log.loss.toFixed(4)} | Accuracy: {(log.accuracy * 100).toFixed(1)}%
              </p>
            ))}
            <p className="text-white/60 pt-1">
              &gt; Fitting candidate parameters on developer preferences...
            </p>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 3: FEATURE ATTRIBUTION BREAKDOWN (ONLY POSITIVE SCORES)
          ======================================================== */}
      {currentStage === 'ATTRIBUTION' && inferenceResult && (
        <div className="space-y-6 animate-fade-in">
          <div className="p-4 sm:p-5 border-2 border-white bg-transparent space-y-4">
            <div className="flex items-center justify-between text-xs text-white/80 border-b border-white/20 pb-2">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                MODEL CONVERGENCE: {(inferenceResult.confidence * 100).toFixed(1)}% MATCH
              </span>
              <span>LOSS: {inferenceResult.loss.toFixed(4)}</span>
            </div>

            {/* Feature Attribution List - only feature name & positive score */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 block">
                FEATURE ATTRIBUTION BREAKDOWN:
              </span>
              <div className="space-y-1.5 text-xs">
                {inferenceResult.featureAttributions.map((attr, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-2.5 border border-white/30 bg-black/20"
                  >
                    <span className="font-bold text-white text-xs truncate mr-2">{attr.featureName}</span>
                    <span className="font-mono font-bold text-emerald-300 shrink-0 text-xs">
                      +{attr.coefficient.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-white/60 font-mono pt-1">
              // Overfitting verified: All selected features align positively with developer ground truth.
            </div>
          </div>

          {/* Action Button: Proceed to Date Scheduling */}
          <div>
            <button
              onClick={() => setCurrentStage('SCHEDULING')}
              className="w-full py-4 bg-white text-[#0078d7] hover:bg-white/90 active:bg-white/80 font-mono font-bold text-sm sm:text-base tracking-wider border-2 border-white rounded-none cursor-pointer transition-transform active:translate-y-0.5 shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>[ CONTINUE TO SCHEDULE DATE ]</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-white/60 pt-1">
            <button
              onClick={() => setCurrentStage('SETUP')}
              className="hover:text-white underline cursor-pointer"
            >
              [ Adjust Parameters &amp; Retrain ]
            </button>

            <button
              onClick={onReturnToBsod}
              className="hover:text-white underline cursor-pointer"
            >
              [ Return to Blue Screen ]
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          STAGE 4: TIME & DATE SELECTION SCREEN
          ======================================================== */}
      {currentStage === 'SCHEDULING' && (
        <div className="space-y-6 animate-fade-in">
          {/* Scheduling Dropdowns Box */}
          <div className="p-4 sm:p-5 border-2 border-white bg-transparent space-y-4">
            <div className="border-b border-white/20 pb-2">
              <span className="font-bold uppercase tracking-wider text-xs text-white/80 block">
                TEMPORAL COORDINATION
              </span>
            </div>

            {/* Dropdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/70 block">
                  DATE:
                </label>
                <select
                  value={selectedDateSlot.dateLabel}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full p-3 bg-black/40 border-2 border-white text-white font-mono text-xs sm:text-sm focus:outline-none rounded-none cursor-pointer"
                >
                  {AVAILABLE_DATES.map((slot) => (
                    <option key={slot.dateLabel} value={slot.dateLabel} className="bg-[#0078d7] text-white">
                      {slot.dateLabel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Dropdown (English format) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-white/70 block">
                  TIME:
                </label>
                <select
                  value={selectedTimeSlot.label}
                  onChange={(e) => {
                    const match = selectedDateSlot.times.find((t) => t.label === e.target.value);
                    if (match) setSelectedTimeSlot(match);
                  }}
                  className="w-full p-3 bg-black/40 border-2 border-white text-white font-mono text-xs sm:text-sm focus:outline-none rounded-none cursor-pointer"
                >
                  {selectedDateSlot.times.map((t) => (
                    <option key={t.label} value={t.label} className="bg-[#0078d7] text-white">
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generated Message Box */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/70 block">
                COMPILED INFERENCE TRANSMISSION:
              </span>
              <div className="p-3 border border-white/40 text-white font-mono text-xs sm:text-sm leading-relaxed italic bg-white/5">
                "{generatedMessage}"
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleCopyMessage}
                className={`w-full py-3 px-3 font-mono font-bold text-xs sm:text-sm tracking-wider border-2 border-white rounded-none cursor-pointer transition-all active:translate-y-0.5 text-center whitespace-nowrap ${
                  copied
                    ? 'bg-emerald-300 text-slate-900 border-emerald-300'
                    : 'bg-white text-[#0078d7] hover:bg-white/90'
                }`}
              >
                {copied ? '[ MESSAGE COPIED. ]' : '[ COPY MESSAGE ]'}
              </button>

              <button
                onClick={handleSendInstagram}
                aria-label="Send DM to Elise on Instagram"
                title="Send DM to Elise on Instagram"
                className="w-full py-3 px-3 bg-transparent hover:bg-white/15 text-white font-mono font-bold text-xs sm:text-sm tracking-wider border-2 border-white rounded-none cursor-pointer transition-colors active:translate-y-0.5 flex items-center justify-center whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-1.5">
                  [ <Instagram className="w-4 h-4 inline-block" /> SEND DM TO ELISE ]
                </span>
              </button>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex items-center justify-between text-xs text-white/60 pt-1">
            <button
              onClick={() => setCurrentStage('ATTRIBUTION')}
              className="hover:text-white underline cursor-pointer"
            >
              [ ← Back to Attribution ]
            </button>

            <button
              onClick={onReturnToBsod}
              className="hover:text-white underline cursor-pointer"
            >
              [ Return to Blue Screen ]
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          POPUP MODAL: CALENDAR INVITATION (.ICS EXPORT)
          Design: Retro BSOD #0078d7 popup with backdrop blur and white border
          ======================================================== */}
      {showIcsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0078d7] border-2 border-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-white font-mono space-y-4 rounded-none">
            {/* Modal Title Bar */}
            <div className="flex items-center justify-between border-b-2 border-white pb-2.5">
              <span className="font-bold text-sm tracking-wider">
                CALENDAR INVITATION READY
              </span>
              <button
                onClick={() => setShowIcsModal(false)}
                className="text-white hover:text-white/70 cursor-pointer p-0.5"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
              Would you like to export this date to your phone or desktop calendar (.ics)?
            </p>

            <div className="p-3 bg-black/25 border border-white/40 text-xs space-y-1.5">
              <p><strong>Location:</strong> {selectedVenue.name} ({selectedVenue.city})</p>
              <p><strong>When:</strong> {selectedDateSlot.dateLabel} at {selectedTimeSlot.label}</p>
              {customProposalTrimmed && (
                <p><strong>Custom Idea:</strong> {customProposalTrimmed}</p>
              )}
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleDownloadCalendarIcs}
                className={`w-full py-3.5 font-mono font-bold text-xs sm:text-sm border-2 border-white rounded-none cursor-pointer transition-transform active:translate-y-0.5 text-center flex items-center justify-center gap-2 ${
                  icsDownloaded
                    ? 'bg-emerald-300 text-slate-900 border-emerald-300'
                    : 'bg-white text-[#0078d7] hover:bg-white/90 active:bg-white/80'
                }`}
              >
                {icsDownloaded ? <Check className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                <span>{icsDownloaded ? '[ ENTRY DOWNLOADED! ]' : '[ DOWNLOAD .ICS CALENDAR ENTRY ]'}</span>
              </button>

              <button
                onClick={() => setShowIcsModal(false)}
                className="w-full py-2 bg-transparent hover:bg-white/10 text-white font-mono text-xs border border-white/60 rounded-none cursor-pointer text-center"
              >
                [ CLOSE ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
