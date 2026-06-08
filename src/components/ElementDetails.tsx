import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getElementByAtomicNumber, type ElementData } from '../services/pubchem';
import { motion } from 'framer-motion';

export const ElementDetails: React.FC = () => {
  const { protons } = useGameStore();
  const [element, setElement] = useState<ElementData | null>(null);

  useEffect(() => {
    getElementByAtomicNumber(protons).then(setElement).catch(console.error);
  }, [protons]);

  if (!element) {
    return <div className="p-4 text-center opacity-50 animate-pulse">Loading Details...</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      key={protons}
      className="flex flex-col h-full text-sm"
    >
      <div className="flex items-end gap-4 border-b border-white/20 pb-4 mb-4">
        <div className="text-5xl font-black text-ochre">{element.Symbol}</div>
        <div>
          <div className="text-xl font-bold">{element.Name}</div>
          <div className="text-xs opacity-60">Atomic Number: {element.AtomicNumber}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
        <div>
          <div className="text-xs opacity-50">Category</div>
          <div className="font-semibold capitalize text-white/90">{element.Category || 'Unknown'}</div>
        </div>
        <div>
          <div className="text-xs opacity-50">Atomic Mass</div>
          <div className="font-semibold text-white/90">{element.AtomicMass} u</div>
        </div>
        <div className="col-span-2">
          <div className="text-xs opacity-50">Electron Config</div>
          <div className="font-mono text-xs bg-black/20 p-1 rounded inline-block mt-1">
            {element.ElectronConfiguration || 'Unknown'}
          </div>
        </div>
        <div>
          <div className="text-xs opacity-50">Electronegativity</div>
          <div className="font-semibold text-white/90">{element.Electronegativity || 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs opacity-50">Atomic Radius</div>
          <div className="font-semibold text-white/90">{element.AtomicRadius ? `${element.AtomicRadius} pm` : 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs opacity-50">Ionization Energy</div>
          <div className="font-semibold text-white/90">{element.IonizationEnergy ? `${element.IonizationEnergy} eV` : 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs opacity-50">Year Discovered</div>
          <div className="font-semibold text-white/90">{element.YearDiscovered || 'Ancient'}</div>
        </div>
      </div>
    </motion.div>
  );
};
