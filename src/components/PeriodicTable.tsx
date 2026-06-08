import React, { useEffect, useState } from 'react';
import { fetchPeriodicTable } from '../services/pubchem';
import type { ElementData } from '../services/pubchem';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const getGroup = (z: number): number => {
  if (z === 1) return 1;
  if (z === 2) return 18;
  if (z >= 3 && z <= 4) return z - 2;
  if (z >= 5 && z <= 10) return z + 8;
  if (z >= 11 && z <= 12) return z - 10;
  if (z >= 13 && z <= 18) return z;
  if (z >= 19 && z <= 36) return z - 18;
  if (z >= 37 && z <= 54) return z - 36;
  if (z >= 55 && z <= 56) return z - 54;
  if (z >= 57 && z <= 71) return 3;
  if (z >= 72 && z <= 86) return z - 68;
  if (z >= 87 && z <= 88) return z - 86;
  if (z >= 89 && z <= 103) return 3;
  if (z >= 104 && z <= 118) return z - 100;
  return 1;
};

const getCategoryColor = (cat?: string) => {
  if (!cat) return 'bg-white/5 border-white/10 text-white/80';
  const lcat = cat.toLowerCase();
  if (lcat.includes('alkali metal')) return 'bg-red-500/20 border-red-500/30 text-red-200';
  if (lcat.includes('alkaline earth')) return 'bg-orange-500/20 border-orange-500/30 text-orange-200';
  if (lcat.includes('transition metal')) return 'bg-amber-500/20 border-amber-500/30 text-amber-200';
  if (lcat.includes('post-transition')) return 'bg-teal-500/20 border-teal-500/30 text-teal-200';
  if (lcat.includes('metalloid')) return 'bg-cyan-500/20 border-cyan-500/30 text-cyan-200';
  if (lcat.includes('halogen')) return 'bg-green-500/20 border-green-500/30 text-green-200';
  if (lcat.includes('noble gas')) return 'bg-blue-500/20 border-blue-500/30 text-blue-200';
  if (lcat.includes('lanthanide')) return 'bg-indigo-500/20 border-indigo-500/30 text-indigo-200';
  if (lcat.includes('actinide')) return 'bg-purple-500/20 border-purple-500/30 text-purple-200';
  if (lcat.includes('nonmetal')) return 'bg-lime-500/20 border-lime-500/30 text-lime-200';
  return 'bg-white/5 border-white/10 text-white/80';
};

const uniqueCategories = [
  'Nonmetal', 'Alkali Metal', 'Alkaline Earth Metal', 'Transition Metal',
  'Post-transition Metal', 'Metalloid', 'Halogen', 'Noble Gas',
  'Lanthanide', 'Actinide'
];

export const PeriodicTable: React.FC = () => {
  const [elements, setElements] = useState<ElementData[]>([]);
  const { protons, setElement } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPeriodicTable().then(setElements).catch(console.error);
  }, []);

  if (elements.length === 0) {
    return <div className="p-4 text-center text-white/50 animate-pulse">Loading Periodic Table...</div>;
  }

  const isMatch = (el: ElementData) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = el.Name.toLowerCase().includes(query) || el.Symbol.toLowerCase().includes(query) || el.AtomicNumber.toString().includes(query);
    const matchesCategory = activeCategory ? el.Category?.toLowerCase().includes(activeCategory.toLowerCase()) : true;
    return matchesSearch && matchesCategory;
  };

  const renderElement = (el: ElementData) => {
    const group = getGroup(el.AtomicNumber);
    const period = el.Period;
    const active = protons === el.AtomicNumber;
    const matched = isMatch(el);
    const baseColor = getCategoryColor(el.Category);

    return (
      <motion.button
        key={el.AtomicNumber}
        onClick={() => setElement(el.AtomicNumber)}
        whileHover={matched ? { scale: 1.1, zIndex: 10 } : {}}
        whileTap={matched ? { scale: 0.95 } : {}}
        className={`
          relative flex flex-col items-center justify-center p-1 rounded aspect-square text-xs border transition-all duration-300
          ${!matched ? 'opacity-20 grayscale' : ''}
          ${active ? 'bg-ochre text-slate-900 border-ochre shadow-[0_0_15px_rgba(224,169,109,0.8)] z-10' : `${baseColor} hover:brightness-125`}
        `}
        style={period && group ? { gridColumn: group, gridRow: period } : {}}
      >
        <span className="absolute top-0.5 left-1 text-[8px] opacity-70">{el.AtomicNumber}</span>
        <strong className="text-base font-bold">{el.Symbol}</strong>
        <span className="text-[8px] truncate w-full text-center opacity-60 hidden sm:block">{el.Name}</span>
      </motion.button>
    );
  };

  const mainBlock = elements.filter(e => !(e.AtomicNumber >= 57 && e.AtomicNumber <= 71) && !(e.AtomicNumber >= 89 && e.AtomicNumber <= 103));
  const lanthanides = elements.filter(e => e.AtomicNumber >= 57 && e.AtomicNumber <= 71);
  const actinides = elements.filter(e => e.AtomicNumber >= 89 && e.AtomicNumber <= 103);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-2">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input 
            type="text" 
            placeholder="Search elements..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/30"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
          <select 
            value={activeCategory || ''}
            onChange={e => setActiveCategory(e.target.value || null)}
            className="bg-black/20 border border-white/10 rounded-full py-1.5 px-4 text-xs text-white focus:outline-none"
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-18 gap-1 mb-4" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
            {mainBlock.map(renderElement)}
          </div>
          <div className="flex flex-col gap-1 ml-[16.666%]">
            <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
              {lanthanides.map(renderElement)}
            </div>
            <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
              {actinides.map(renderElement)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
