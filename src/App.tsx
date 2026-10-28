import React, { useState } from 'react';
import { AppScreen } from './types';
import { Screen1 } from './components/Screen1';
import { RepairProgress } from './components/RepairProgress';
import { Screen2 } from './components/Screen2';
import { Screen3 } from './components/Screen3';
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
            onRepairComplete={() => setScreen('SCREEN_2')}
          />
        )}

        {screen === 'SCREEN_2' && (
          <Screen2
            onTryRepair={() => setScreen('SCREEN_3')}
          />
        )}

        {screen === 'SCREEN_3' && (
          <Screen3
            onContactHumanSupport={() => setScreen('SCREEN_4')}
          />
        )}

        {screen === 'SCREEN_4' && (
          <Screen4
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
