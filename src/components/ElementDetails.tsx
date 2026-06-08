import React, { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getElementByAtomicNumber, type ElementData } from '../services/pubchem';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Lightbulb } from 'lucide-react';

export const ElementDetails: React.FC = () => {
  const { protons } = useGameStore();
  const [element, setElement] = useState<ElementData | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    getElementByAtomicNumber(protons).then(setElement).catch(console.error);
  }, [protons]);

  if (!element) {
    return <div className="p-4 text-center opacity-50 animate-pulse">Loading Details...</div>;
  }

  const fact = t(`funFacts.${protons}`, { defaultValue: '' });

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      key={protons}
      className="flex flex-col text-sm pr-2"
    >
      <div className="flex items-end gap-4 border-b border-white/20 pb-4 mb-4">
        <div className="text-5xl font-black text-ochre">{element.Symbol}</div>
        <div>
          <div className="text-xl font-bold">{element.Name}</div>
          <div className="text-xs opacity-60">{t('properties.atomic_number')}: {element.AtomicNumber}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-6">
        <div>
          <div className="text-xs opacity-50">{t('properties.category')}</div>
          <div className="font-semibold capitalize text-white/90">{element.Category ? t(`categories.${element.Category}`, element.Category) : t('categories.Unknown')}</div>
        </div>
        <div>
          <div className="text-xs opacity-50">{t('properties.atomic_mass')}</div>
          <div className="font-semibold text-white/90">{element.AtomicMass} {t('properties.u')}</div>
        </div>
        <div className="col-span-2">
          <div className="text-xs opacity-50">{t('properties.electron_config')}</div>
          <div className="font-mono text-xs bg-black/20 p-1 rounded inline-block mt-1">
            {element.ElectronConfiguration || 'Unknown'}
          </div>
        </div>
        <div>
          <div className="text-xs opacity-50">{t('properties.electronegativity')}</div>
          <div className="font-semibold text-white/90">{element.Electronegativity || 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs opacity-50">{t('properties.atomic_radius')}</div>
          <div className="font-semibold text-white/90">{element.AtomicRadius ? `${element.AtomicRadius} ${t('properties.pm')}` : 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs opacity-50">{t('properties.ionization_energy')}</div>
          <div className="font-semibold text-white/90">{element.IonizationEnergy ? `${element.IonizationEnergy} ${t('properties.ev')}` : 'N/A'}</div>
        </div>
        <div>
          <div className="text-xs opacity-50">{t('properties.year_discovered')}</div>
          <div className="font-semibold text-white/90">{element.YearDiscovered || 'Ancient'}</div>
        </div>
      </div>

      {fact && (
        <div className="mt-auto bg-ochre/10 border border-ochre/30 rounded-lg p-4 flex gap-3 shadow-inner">
          <Lightbulb className="text-ochre shrink-0" size={24} />
          <div>
            <div className="text-xs font-bold text-ochre uppercase tracking-wider mb-1">{t('properties.did_you_know')}</div>
            <div className="text-sm text-white/90 leading-relaxed">{fact}</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
