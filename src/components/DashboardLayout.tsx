import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlassCard } from './GlassCard';
import { AtomBuilder } from './AtomBuilder';
import { AtomBuilderGame } from './AtomBuilderGame';
import { MoleculeViewer } from './MoleculeViewer';
import { OrbitalViewer } from './OrbitalViewer';
import { BohrModelViewer } from './BohrModelViewer';
import { PeriodicTable } from './PeriodicTable';
import { ElementDetails } from './ElementDetails';
import { ReactionSandbox } from './ReactionSandbox';
import { ElementSearch } from './ElementSearch';
import { CrystalViewer, type LatticeType } from './CrystalViewer';
import { IsotopeExplorer } from './IsotopeExplorer';
import { VSEPRSandbox } from './VSEPRSandbox';
import { useGameStore } from '../store/gameStore';
import { getElementByAtomicNumber, fetchCompoundSDF, type ElementData } from '../services/pubchem';
import { Beaker, Orbit, Info, Activity, LayoutGrid, FlaskConical, Sun, Moon, Cuboid, Radio } from 'lucide-react';

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

type TabType = 'periodic_table' | 'atom_lab' | 'molecule_viewer' | 'reaction_lab' | 'solid_state' | 'isotopes';

export const DashboardLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [sdfData, setSdfData] = useState<string>('');
  const [element, setElement] = useState<ElementData | null>(null);
  const [atomViewMode, setAtomViewMode] = useState<'quantum' | 'bohr'>('bohr');
  const [moleculeMode, setMoleculeMode] = useState<'3dmol' | 'vsepr'>('3dmol');
  const [latticeType, setLatticeType] = useState<LatticeType>('BCC');
  const [activeTab, setActiveTab] = useState<TabType>('periodic_table');
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const { protons } = useGameStore();

  const toggleLang = () => i18n.changeLanguage(i18n.resolvedLanguage === 'en' ? 'vi' : 'en');
  
  const toggleTheme = () => setIsDark(prev => !prev);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);
  
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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-ochre drop-shadow-sm shrink-0">
          {t('app.title')}
        </h1>
        <div className="flex flex-1 items-center justify-end gap-2 w-full">
          <ElementSearch />
          <button 
            onClick={toggleTheme} 
            className="p-2 border border-slate-300 dark:border-white/20 rounded hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-800 dark:text-white shrink-0"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={toggleLang} className="px-4 py-2 border border-slate-300 dark:border-white/20 rounded hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-bold w-16 text-slate-800 dark:text-white shrink-0">
            {i18n.resolvedLanguage === 'en' ? 'VI' : 'EN'}
          </button>
        </div>
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
        <button 
          onClick={() => setActiveTab('solid_state')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all border-b-4 whitespace-nowrap ${activeTab === 'solid_state' ? 'border-ochre bg-white dark:bg-black/40 text-ochre shadow-sm' : 'border-transparent bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'}`}
        >
          <Cuboid size={20} />
          {t('panels.solid_state', 'Mạng Tinh Thể')}
        </button>
        <button 
          onClick={() => setActiveTab('isotopes')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all border-b-4 whitespace-nowrap ${activeTab === 'isotopes' ? 'border-ochre bg-white dark:bg-black/40 text-ochre shadow-sm' : 'border-transparent bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'}`}
        >
          <Radio size={20} />
          {t('panels.isotopes', 'Đồng Vị & Phóng Xạ')}
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
            <div className="xl:col-span-1 flex flex-col gap-6">
              <AtomBuilder />
              <AtomBuilderGame />
            </div>
          </div>
        )}

        {/* TAB 3: Molecule Viewer */}
        {activeTab === 'molecule_viewer' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlassCard className="p-4 flex flex-col h-[70vh] min-h-[600px]">
              <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-white/10 pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                  <LayoutGrid size={20} className="text-ochre" />
                  {t('panels.molecule_viewer', '3D Molecule Viewer')}
                </h2>
                <div className="flex bg-slate-200 dark:bg-black/40 rounded-full p-1 border border-slate-300 dark:border-white/10">
                  <button
                    onClick={() => setMoleculeMode('3dmol')}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors flex items-center gap-1 ${moleculeMode === '3dmol' ? 'bg-ochre text-white shadow' : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white'}`}
                  >
                    <LayoutGrid size={12} />
                    3D Mol
                  </button>
                  <button
                    onClick={() => setMoleculeMode('vsepr')}
                    className={`px-3 py-1 text-xs font-bold rounded-full transition-colors flex items-center gap-1 ${moleculeMode === 'vsepr' ? 'bg-ochre text-white shadow' : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white'}`}
                  >
                    <Activity size={12} />
                    VSEPR Sandbox
                  </button>
                </div>
              </div>
              <div className="flex-1 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 shadow-inner">
                {moleculeMode === '3dmol' ? (
                  <MoleculeViewer sdfData={sdfData} styleMode="stick" elementName={element?.Name} />
                ) : (
                  <VSEPRSandbox />
                )}
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

        {/* TAB 5: Solid State */}
        {activeTab === 'solid_state' && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="xl:col-span-3">
              <GlassCard className="p-4 flex flex-col h-[70vh] min-h-[600px]">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Cuboid size={20} className="text-ochre" />
                    Crystal Lattice Viewer
                  </h2>
                </div>
                <div className="flex-1 relative rounded-xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 shadow-inner">
                  <CrystalViewer latticeType={latticeType} />
                </div>
              </GlassCard>
            </div>
            <div className="xl:col-span-1">
              <GlassCard className="p-4 md:p-6 h-[70vh] min-h-[600px]">
                <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Lattice Controls</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 dark:text-white/60 mb-2">Lattice Type</label>
                    <select 
                      value={latticeType} 
                      onChange={(e) => setLatticeType(e.target.value as LatticeType)}
                      className="w-full p-2 rounded bg-slate-100 dark:bg-black/40 border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white font-bold"
                    >
                      <option value="SC">Simple Cubic (SC)</option>
                      <option value="BCC">Body-Centered Cubic (BCC)</option>
                      <option value="FCC">Face-Centered Cubic (FCC)</option>
                    </select>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-100 dark:bg-white/5 text-sm text-slate-700 dark:text-white/80">
                    <h3 className="font-bold mb-2">About {latticeType}</h3>
                    {latticeType === 'SC' && <p>Simple Cubic: Atoms are positioned at the 8 corners of a cube. This arrangement is rare in nature, found only in Polonium (Po) under normal conditions.</p>}
                    {latticeType === 'BCC' && <p>Body-Centered Cubic: Atoms at all 8 corners plus one in the center of the cube. Common in Alkali metals and transition metals like Iron (Fe) at room temp.</p>}
                    {latticeType === 'FCC' && <p>Face-Centered Cubic: Atoms at all 8 corners and in the center of all 6 faces. Common in metals like Copper (Cu), Silver (Ag), Gold (Au).</p>}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* TAB 6: Isotopes */}
        {activeTab === 'isotopes' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GlassCard className="p-4 md:p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-ochre/20 rounded-xl text-ochre">
                  <Radio size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Isotopes & Radioactivity</h2>
                  <p className="text-slate-500 dark:text-white/60">
                    Explore stable and radioactive isotopes of {element?.Name}
                  </p>
                </div>
              </div>
            </GlassCard>
            
            <IsotopeExplorer />
          </div>
        )}
      </div>
    </div>
  );
};
