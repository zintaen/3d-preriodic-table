import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from './GlassCard';
import { AtomBuilder } from './AtomBuilder';
import { MoleculeViewer } from './MoleculeViewer';
import { OrbitalViewer } from './OrbitalViewer';
import { BohrModelViewer } from './BohrModelViewer';
import { PeriodicTable } from './PeriodicTable';
import { ElementDetails } from './ElementDetails';
import { ReactionSandbox } from './ReactionSandbox';
import { useGameStore } from '../store/gameStore';
import { getElementByAtomicNumber, fetchCompoundSDF, type ElementData } from '../services/pubchem';
import { Beaker, Orbit, Info, Activity, LayoutGrid, FlaskConical } from 'lucide-react';

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

type TabType = 'periodic_table' | 'atom_lab' | 'molecule_viewer' | 'reaction_lab';

export const DashboardLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [sdfData, setSdfData] = useState<string>('');
  const [element, setElement] = useState<ElementData | null>(null);
  const [atomViewMode, setAtomViewMode] = useState<'quantum' | 'bohr'>('bohr');
  const [activeTab, setActiveTab] = useState<TabType>('periodic_table');
  const { protons } = useGameStore();

  const toggleLang = () => i18n.changeLanguage(i18n.resolvedLanguage === 'en' ? 'vi' : 'en');
  
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 md:p-8 font-sans transition-colors duration-300">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-ochre drop-shadow-sm">
          {t('app.title')}
        </h1>
        <button onClick={toggleLang} className="px-4 py-2 border border-slate-300 dark:border-white/20 rounded hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-bold w-16 text-slate-800 dark:text-white">
          {i18n.resolvedLanguage === 'en' ? 'VI' : 'EN'}
        </button>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-2 md:gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setActiveTab('periodic_table')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all border-b-4 whitespace-nowrap ${activeTab === 'periodic_table' ? 'border-ochre bg-white dark:bg-black/40 text-ochre shadow-sm' : 'border-transparent bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'}`}
        >
          <LayoutGrid size={20} />
          {t('panels.periodic_table')}
        </button>
        <button 
          onClick={() => setActiveTab('atom_lab')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all border-b-4 whitespace-nowrap ${activeTab === 'atom_lab' ? 'border-ochre bg-white dark:bg-black/40 text-ochre shadow-sm' : 'border-transparent bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'}`}
        >
          <Orbit size={20} />
          {t('panels.atom_lab')}
        </button>
        <button 
          onClick={() => setActiveTab('molecule_viewer')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all border-b-4 whitespace-nowrap ${activeTab === 'molecule_viewer' ? 'border-ochre bg-white dark:bg-black/40 text-ochre shadow-sm' : 'border-transparent bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'}`}
        >
          <Beaker size={20} />
          {t('panels.molecule_viewer')}
        </button>
        <button 
          onClick={() => setActiveTab('reaction_lab')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all border-b-4 whitespace-nowrap ${activeTab === 'reaction_lab' ? 'border-ochre bg-white dark:bg-black/40 text-ochre shadow-sm' : 'border-transparent bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'}`}
        >
          <FlaskConical size={20} />
          {t('panels.reaction_lab', 'Phòng Phản Ứng')}
        </button>
      </div>

      <div className="mt-4">
        {/* TAB 1: Periodic Table */}
        {activeTab === 'periodic_table' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="xl:col-span-3">
              <GlassCard className="p-4 md:p-6 overflow-hidden h-[70vh] min-h-[600px]">
                <PeriodicTable />
              </GlassCard>
            </div>
            <div className="xl:col-span-1">
              <GlassCard className="p-4 md:p-6 h-[70vh] min-h-[600px] overflow-y-auto">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-slate-200 dark:border-white/10 pb-2 text-slate-800 dark:text-white">
                  <Info size={20} className="text-ochre" />
                  {t('app.properties', 'Properties')}
                </h2>
                <ElementDetails />
              </GlassCard>
            </div>
          </div>
        )}

        {/* TAB 2: Atom Lab */}
        {activeTab === 'atom_lab' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="xl:col-span-2">
              <GlassCard className="p-4 flex flex-col h-[70vh] min-h-[600px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Orbit size={20} className="text-ochre" />
                    {t('panels.atom_viewer', 'Atom Viewer')} {element ? `- ${element.Name}` : ''}
                  </h2>
                  <div className="flex bg-slate-200 dark:bg-black/40 rounded-full p-1 border border-slate-300 dark:border-white/10">
                    <button
                      onClick={() => setAtomViewMode('bohr')}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-colors flex items-center gap-1 ${atomViewMode === 'bohr' ? 'bg-ochre text-white shadow' : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white'}`}
                    >
                      <Activity size={12} />
                      {t('view.bohr', 'Bohr Model')}
                    </button>
                    <button
                      onClick={() => setAtomViewMode('quantum')}
                      className={`px-3 py-1 text-xs font-bold rounded-full transition-colors flex items-center gap-1 ${atomViewMode === 'quantum' ? 'bg-ochre text-white shadow' : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white'}`}
                    >
                      <Orbit size={12} />
                      {t('view.quantum', 'Quantum')}
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 shadow-inner">
                  {atomViewMode === 'bohr' ? (
                    <BohrModelViewer protons={protons} />
                  ) : (
                    <OrbitalViewer l={l} ml={0} />
                  )}
                </div>
              </GlassCard>
            </div>
            <div className="xl:col-span-1">
              <AtomBuilder />
            </div>
          </div>
        )}

        {/* TAB 3: Molecule Viewer */}
        {activeTab === 'molecule_viewer' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlassCard className="p-4 flex flex-col h-[70vh] min-h-[600px]">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-white">
                <Beaker size={20} className="text-ochre" />
                {t('panels.molecule_viewer')} {element ? `- ${element.Name}` : ''}
              </h2>
              <div className="flex-1 rounded-xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 shadow-inner">
                <MoleculeViewer sdfData={sdfData} styleMode="stick" elementName={element?.Name} />
              </div>
            </GlassCard>
          </div>
        )}

        {/* TAB 4: Reaction Sandbox */}
        {activeTab === 'reaction_lab' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ReactionSandbox />
          </div>
        )}
      </div>
    </div>
  );
};
