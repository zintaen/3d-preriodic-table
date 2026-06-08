import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from './GlassCard';
import { AtomBuilder } from './AtomBuilder';
import { MoleculeViewer } from './MoleculeViewer';
import { OrbitalViewer } from './OrbitalViewer';
import { PeriodicTable } from './PeriodicTable';
import { ElementDetails } from './ElementDetails';
import { useGameStore } from '../store/gameStore';
import { getElementByAtomicNumber, fetchCompoundSDF, type ElementData } from '../services/pubchem';
import { Beaker, Orbit, Info } from 'lucide-react';

// Helper to parse Electron Configuration string to (n, l)
const parseElectronConfig = (config?: string) => {
  if (!config) return { l: 0 };
  const tokens = config.split(' ');
  const last = tokens[tokens.length - 1]; // e.g., '2p2', '3d10'
  
  if (last.includes('f')) return { l: 3 };
  if (last.includes('d')) return { l: 2 };
  if (last.includes('p')) return { l: 1 };
  return { l: 0 }; // s
};

export const DashboardLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [sdfData, setSdfData] = useState<string>('');
  const [element, setElement] = useState<ElementData | null>(null);
  const { protons } = useGameStore();

  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'vi' : 'en');
  
  useEffect(() => {
    let active = true;
    const fetchElementData = async () => {
      try {
        const el = await getElementByAtomicNumber(protons);
        if (el && active) {
          setElement(el);
          const sdf = await fetchCompoundSDF(el.Name);
          if (active) setSdfData(sdf);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (active) setSdfData('');
      }
    };
    fetchElementData();
    return () => { active = false; };
  }, [protons]);

  const { l } = parseElectronConfig(element?.ElectronConfiguration);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 font-sans">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-ochre">
          {t('app.title')}
        </h1>
        <button onClick={toggleLang} className="px-4 py-2 border border-white/20 rounded hover:bg-white/10 transition-colors">
          {i18n.language === 'en' ? 'EN' : 'VI'}
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Left Column: Grid */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          <GlassCard className="p-4 md:p-6 overflow-hidden">
            <PeriodicTable />
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-4 flex-1">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Beaker size={20} className="text-ochre" />
                {t('panels.molecule_viewer')} {element ? `- ${element.Name}` : ''}
              </h2>
              <MoleculeViewer sdfData={sdfData} styleMode="stick" elementName={element?.Name} />
            </GlassCard>
            
            <GlassCard className="p-4 h-96">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Orbit size={20} className="text-ochre" />
                {t('panels.quantum_orbitals')}
              </h2>
              {/* ml logic can be rotated on interval or fixed */}
              <OrbitalViewer l={l} ml={0} />
            </GlassCard>
          </div>
        </div>

        {/* Right Column: Details & Controls */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          <GlassCard className="p-4 md:p-6 min-h-[300px]">
             <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <Info size={20} className="text-ochre" />
              {t('app.properties', 'Properties')}
            </h2>
            <ElementDetails />
          </GlassCard>

          <AtomBuilder />
        </div>

      </div>
    </div>
  );
};
