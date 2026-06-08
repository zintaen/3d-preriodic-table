import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getIsotopesByProtons } from '../data/isotopes';
import { GlassCard } from './GlassCard';
import { Radio } from 'lucide-react';

export const IsotopeExplorer: React.FC = () => {
  const { protons, neutrons } = useGameStore();
  const isotopes = getIsotopesByProtons(protons);

  if (isotopes.length === 0) {
    return (
      <GlassCard className="p-6 text-center">
        <Radio size={48} className="mx-auto mb-4 text-slate-300 dark:text-white/20" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Isotope Data</h3>
        <p className="text-slate-500 dark:text-white/60">
          We don't have detailed isotope data for element #{protons} yet. Try Hydrogen (1), Carbon (6), Oxygen (8), or Uranium (92).
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {isotopes.map((iso) => {
        const isoNeutrons = iso.massNumber - iso.atomicNumber;
        const isActive = neutrons === isoNeutrons;
        const isStable = iso.halfLife === 'Stable';

        return (
          <GlassCard 
            key={iso.massNumber} 
            className={`p-4 transition-all ${isActive ? 'ring-2 ring-ochre shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-white/5'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="text-2xl font-black text-slate-800 dark:text-white">
                <sup>{iso.massNumber}</sup>
                <sub>{iso.atomicNumber}</sub>
                {iso.symbol.split(' ')[0].replace(/-\d+/, '')}
              </div>
              <div className={`px-2 py-1 rounded text-xs font-bold ${isStable ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'} flex items-center gap-1`}>
                {!isStable && <Radio size={12} className="animate-pulse" />}
                {isStable ? 'Stable' : 'Radioactive'}
              </div>
            </div>
            
            <div className="text-sm font-bold text-slate-700 dark:text-white/90 mb-4">
              {iso.symbol}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-1">
                <span className="text-slate-500 dark:text-white/60">Protons</span>
                <span className="font-bold text-slate-800 dark:text-white">{iso.atomicNumber}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-1">
                <span className="text-slate-500 dark:text-white/60">Neutrons</span>
                <span className="font-bold text-slate-800 dark:text-white">{isoNeutrons}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-1">
                <span className="text-slate-500 dark:text-white/60">Natural Abundance</span>
                <span className="font-bold text-slate-800 dark:text-white">{iso.abundance}%</span>
              </div>
              {!isStable && (
                <>
                  <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-1">
                    <span className="text-slate-500 dark:text-white/60">Half-Life</span>
                    <span className="font-bold text-slate-800 dark:text-white">{iso.halfLife}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-1">
                    <span className="text-slate-500 dark:text-white/60">Decay Mode</span>
                    <span className="font-bold text-slate-800 dark:text-white">{iso.decayMode}</span>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
