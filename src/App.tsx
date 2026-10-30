import React, { useState, useEffect } from 'react';
import { AppScreen } from './types';
import { Screen1 } from './components/Screen1';
import { RepairProgress } from './components/RepairProgress';
import { Screen2 } from './components/Screen2';
import { Screen4 } from './components/Screen4';
import { NeuralDateCompiler } from './protocol/NeuralDateCompiler';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('SCREEN_1');

  // Detect direct URL routing on mount (e.g. #/model or #/protocol or ?mode=model)
  useEffect(() => {
    const checkDirectRoute = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();

      if (
        hash.includes('model') ||
        hash.includes('protocol') ||
        hash.includes('neural') ||
        search.includes('model') ||
        search.includes('protocol') ||
        search.includes('neural')
      ) {
        setScreen('PROJECT_02');
      }
    };

    checkDirectRoute();
    window.addEventListener('hashchange', checkDirectRoute);
    return () => window.removeEventListener('hashchange', checkDirectRoute);
  }, []);

  const handleRestart = () => {
    window.location.hash = '';
    setScreen('SCREEN_1');
  };

  const handleReturnToBsod = () => {
    window.location.hash = '';
    setScreen('SCREEN_1');
  };

  return (
    <div className="min-h-screen bg-[#0078d7] text-white flex flex-col justify-center items-center font-mono selection:bg-white selection:text-[#0078d7] antialiased p-4">
      <main className="w-full flex flex-col justify-center items-center">
        {screen === 'SCREEN_1' && (
          <Screen1
            onRunDiagnostics={() => setScreen('DIAGNOSTIC_LOAD')}
            onTooDrunk={() => setScreen('SUPPORT_TICKET')}
          />
        )}

        {screen === 'DIAGNOSTIC_LOAD' && (
          <RepairProgress
            onRepairComplete={() => setScreen('SYSTEM_DIAGNOSTICS')}
          />
        )}

        {screen === 'SYSTEM_DIAGNOSTICS' && (
          <Screen2
            onPersonalVisit={() => setScreen('PROJECT_02')}
            onOpenSupportTicket={() => setScreen('SUPPORT_TICKET')}
          />
        )}

        {screen === 'SUPPORT_TICKET' && (
          <Screen4
            onRestart={handleRestart}
          />
        )}

        {screen === 'PROJECT_02' && (
          <NeuralDateCompiler
            onReturnToBsod={handleReturnToBsod}
          />
        )}
      </main>
    </div>
  );
}
