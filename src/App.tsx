import React, { useState } from 'react';
import { AppScreen } from './types';
import { Screen1 } from './components/Screen1';
import { RepairProgress } from './components/RepairProgress';
import { Screen2 } from './components/Screen2';
import { ScreenSystemFailure } from './components/ScreenSystemFailure';
import { Screen4 } from './components/Screen4';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('SCREEN_1');

  const handleRestart = () => {
    setScreen('SCREEN_1');
  };

  return (
    <div className="min-h-screen bg-[#0078d7] text-white flex flex-col justify-center items-center font-mono selection:bg-white selection:text-[#0078d7] antialiased p-4">
      <main className="w-full flex flex-col justify-center items-center">
        {screen === 'SCREEN_1' && (
          <Screen1
            onTryRepair={() => setScreen('DIAGNOSTIC_LOAD')}
          />
        )}

        {screen === 'DIAGNOSTIC_LOAD' && (
          <RepairProgress
            speed="normal"
            onRepairComplete={() => setScreen('SYSTEM_DIAGNOSTICS')}
          />
        )}

        {screen === 'SYSTEM_DIAGNOSTICS' && (
          <Screen2
            onTooDrunk={() => setScreen('SYSTEM_FAILURE')}
            onMeetDeveloper={() => setScreen('SUPPORT_TICKET')}
          />
        )}

        {screen === 'SYSTEM_FAILURE' && (
          <ScreenSystemFailure
            onReload={() => setScreen('QUICK_RELOAD')}
          />
        )}

        {screen === 'QUICK_RELOAD' && (
          <RepairProgress
            speed="fast"
            onRepairComplete={() => setScreen('SYSTEM_DIAGNOSTICS')}
          />
        )}

        {screen === 'SUPPORT_TICKET' && (
          <Screen4
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
