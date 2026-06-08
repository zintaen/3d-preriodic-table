import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { getElementByAtomicNumber, type ElementData } from '../services/pubchem';
import { GlassCard } from './GlassCard';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// Ordered by energy level (Aufbau principle)
const ORBITALS = [
  { name: '1s', capacity: 2 },
  { name: '2s', capacity: 2 },
  { name: '2p', capacity: 6 },
  { name: '3s', capacity: 2 },
  { name: '3p', capacity: 6 },
  { name: '4s', capacity: 2 },
  { name: '3d', capacity: 10 },
  { name: '4p', capacity: 6 },
  { name: '5s', capacity: 2 },
  { name: '4d', capacity: 10 },
  { name: '5p', capacity: 6 },
  { name: '6s', capacity: 2 },
  { name: '4f', capacity: 14 },
];

export const AtomBuilderGame: React.FC = () => {
  const { protons } = useGameStore();
  const [element, setElement] = useState<ElementData | null>(null);
  
  // State: electrons placed per orbital
  const [placed, setPlaced] = useState<Record<string, number>>({});
  const [prevProtons, setPrevProtons] = useState(protons);

  if (protons !== prevProtons) {
    setPrevProtons(protons);
    setPlaced({}); // Reset game on element change
  }
  
  useEffect(() => {
    getElementByAtomicNumber(protons).then(setElement);
  }, [protons]);

  const totalPlaced = Object.values(placed).reduce((a, b) => a + b, 0);
  const target = protons; // neutral atom
  const isComplete = totalPlaced === target;

  const handleAdd = (orbName: string, capacity: number) => {
    if (totalPlaced >= target) return;
    const current = placed[orbName] || 0;
    if (current < capacity) {
      setPlaced({ ...placed, [orbName]: current + 1 });
    }
  };

  const handleRemove = (orbName: string) => {
    const current = placed[orbName] || 0;
    if (current > 0) {
      setPlaced({ ...placed, [orbName]: current - 1 });
    }
  };

  // Simplified Check: Are they filled in the correct Aufbau order?
  let isCorrect = true;
  if (isComplete) {
    let remaining = target;
    for (const orb of ORBITALS) {
      const expected = Math.min(remaining, orb.capacity);
      const actual = placed[orb.name] || 0;
      if (actual !== expected) {
        // Exception: Cr (24) and Cu (29) violate simple Aufbau. We will ignore anomalies for this simple game
        // or just accept any configuration that adds up to target for now if we want to be lenient, 
        // but strict Aufbau check is more educational.
        if (target !== 24 && target !== 29 && target !== 47 && target !== 79) {
          isCorrect = false;
        }
      }
      remaining -= expected;
      if (remaining <= 0) break;
    }
  }

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Electron Builder Game</h2>
          <p className="text-sm text-slate-500 dark:text-white/60">
            Build the electron configuration for {element?.Name} ({target} electrons)
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-ochre">
            {totalPlaced} / {target} e⁻
          </div>
          <button 
            onClick={() => setPlaced({})}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 mt-1 justify-end"
          >
            <RefreshCw size={12} /> Reset
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        {ORBITALS.map(orb => {
          const current = placed[orb.name] || 0;
          // Only show up to the orbitals that could possibly be needed
          const index = ORBITALS.findIndex(o => o.name === orb.name);
          const needsToShow = target > 0 && index <= Math.ceil(target / 2) + 2; 

          if (!needsToShow) return null;

          return (
            <div key={orb.name} className="flex flex-col items-center gap-2">
              <div className="text-xs font-bold text-slate-500 dark:text-white/50">{orb.name}</div>
              <button 
                onClick={() => handleAdd(orb.name, orb.capacity)}
                onContextMenu={(e) => { e.preventDefault(); handleRemove(orb.name); }}
                className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center font-bold text-lg transition-all ${
                  current === orb.capacity 
                    ? 'border-green-500 bg-green-500/20 text-green-600 dark:text-green-400' 
                    : current > 0 
                      ? 'border-ochre bg-ochre/20 text-ochre'
                      : 'border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-black/20 text-slate-400'
                }`}
              >
                {current > 0 ? current : ''}
              </button>
              <div className="text-[10px] text-slate-400">Max: {orb.capacity}</div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-500 dark:text-white/50 italic mb-4">
        Tip: Left click to add an electron, Right click to remove. Fill according to the Aufbau principle!
      </div>

      {isComplete && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center gap-3 ${
            isCorrect 
              ? 'bg-green-500/20 border border-green-500/50 text-green-700 dark:text-green-400' 
              : 'bg-red-500/20 border border-red-500/50 text-red-700 dark:text-red-400'
          }`}
        >
          {isCorrect ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <div>
            <div className="font-bold">{isCorrect ? 'Correct Configuration!' : 'Incorrect Configuration'}</div>
            <div className="text-sm">
              {isCorrect 
                ? 'Great job following the Aufbau principle!' 
                : 'Electrons must be filled in order of increasing energy levels (1s, 2s, 2p, 3s...). Check your work!'}
            </div>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
};
