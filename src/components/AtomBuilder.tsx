import React from 'react';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Atom } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AtomBuilder: React.FC = () => {
  const { protons, neutrons, electrons, addProton, addNeutron, addElectron, reset, getNetCharge, getAtomicMass, isStable } = useGameStore();
  const { t } = useTranslation();

  const charge = getNetCharge();
  const chargeStr = charge > 0 ? `+${charge}` : charge < 0 ? `${charge}` : '0';
  const stable = isStable();

  return (
    <GlassCard className="p-4 md:p-6" data-testid="atom-builder">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-white/10 pb-2 text-slate-800 dark:text-white">
        <Atom size={20} className="text-ochre" />
        {t('panels.atom_builder', 'Atom Builder')}
      </h2>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={addProton} className="flex-1 min-w-[80px] px-2 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded text-sm md:text-base whitespace-nowrap transition-colors">{t('atom.add_proton')}</button>
        <button onClick={addNeutron} className="flex-1 min-w-[80px] px-2 py-2 bg-slate-500/80 hover:bg-slate-500 text-white rounded text-sm md:text-base whitespace-nowrap transition-colors">{t('atom.add_neutron')}</button>
        <button onClick={addElectron} className="flex-1 min-w-[80px] px-2 py-2 bg-blue-500/80 hover:bg-blue-500 text-white rounded text-sm md:text-base whitespace-nowrap transition-colors">{t('atom.add_electron')}</button>
        <button onClick={reset} className="flex-none min-w-[70px] px-4 py-2 bg-slate-300 dark:bg-black/50 text-slate-800 dark:text-white rounded text-sm md:text-base transition-colors hover:bg-slate-400 dark:hover:bg-black/70">{t('atom.reset')}</button>
      </div>

      <div className="grid grid-cols-2 gap-4 text-slate-800 dark:text-white/90">
        <div className="p-2 bg-slate-200/50 dark:bg-black/20 rounded">
          <div>{t('atom.protons')}: {protons}</div>
          <div>{t('atom.neutrons')}: {neutrons}</div>
          <div>{t('atom.electrons')}: {electrons}</div>
        </div>
        <div className="p-2 bg-slate-200/50 dark:bg-black/20 rounded">
          <div>{t('atom.net_charge')}: <span data-testid="charge">{chargeStr}</span></div>
          <div>{t('atom.atomic_mass')}: {getAtomicMass()}</div>
          <div className="flex items-center gap-2 mt-2">
            {t('atom.stability')}: 
            <motion.span 
              className={`px-2 py-0.5 rounded ${stable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              animate={stable ? { scale: [1, 1.05, 1], textShadow: "0px 0px 8px rgb(74,222,128)" } : { x: [-2, 2, -2, 2, 0] }}
              transition={{ repeat: Infinity, duration: stable ? 2 : 0.5 }}
            >
              {stable ? t('atom.stable') : t('atom.unstable')}
            </motion.span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
