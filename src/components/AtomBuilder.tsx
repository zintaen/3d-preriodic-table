import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

export const AtomBuilder: React.FC = () => {
  const { protons, neutrons, electrons, addProton, addNeutron, addElectron, reset, getNetCharge, getAtomicMass, isStable } = useGameStore();

  const charge = getNetCharge();
  const chargeStr = charge > 0 ? `+${charge}` : charge < 0 ? `${charge}` : '0';
  const stable = isStable();

  return (
    <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl" data-testid="atom-builder">
      <h2 className="text-2xl font-bold mb-4">Atom Builder</h2>
      
      <div className="flex gap-4 mb-4">
        <button onClick={addProton} className="px-4 py-2 bg-red-500/80 text-white rounded">+ Proton</button>
        <button onClick={addNeutron} className="px-4 py-2 bg-gray-500/80 text-white rounded">+ Neutron</button>
        <button onClick={addElectron} className="px-4 py-2 bg-blue-500/80 text-white rounded">+ Electron</button>
        <button onClick={reset} className="px-4 py-2 bg-black/50 text-white rounded ml-auto">Reset</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-2 bg-black/20 rounded">
          <div>Protons: {protons}</div>
          <div>Neutrons: {neutrons}</div>
          <div>Electrons: {electrons}</div>
        </div>
        <div className="p-2 bg-black/20 rounded">
          <div>Net Charge: <span data-testid="charge">{chargeStr}</span></div>
          <div>Atomic Mass: {getAtomicMass()}</div>
          <div className="flex items-center gap-2 mt-2">
            Stability: 
            <motion.span 
              className={`px-2 py-0.5 rounded ${stable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              animate={stable ? { scale: [1, 1.05, 1], textShadow: "0px 0px 8px rgb(74,222,128)" } : { x: [-2, 2, -2, 2, 0] }}
              transition={{ repeat: Infinity, duration: stable ? 2 : 0.5 }}
            >
              {stable ? 'Stable' : 'Unstable'}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};
