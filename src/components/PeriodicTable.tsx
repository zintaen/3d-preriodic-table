import React, { useEffect, useState, useMemo } from 'react';
import { fetchPeriodicTable, type ElementData } from '../services/pubchem';
import { useGameStore } from '../store/gameStore';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TimelineSlider } from './TimelineSlider';

type LayoutMode = 'table' | 'sphere' | 'helix' | 'grid';

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
  if (z >= 57 && z <= 71) return 3; // Lanthanides stack in group 3 logically, but visually we separate
  if (z >= 72 && z <= 86) return z - 68;
  if (z >= 87 && z <= 88) return z - 86;
  if (z >= 89 && z <= 103) return 3; // Actinides
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

interface ElementNodeProps {
  el: ElementData;
  position: THREE.Vector3;
  active: boolean;
  matched: boolean;
  onClick: () => void;
}

const ElementNode: React.FC<ElementNodeProps> = ({ el, position, active, matched, onClick }) => {
  const baseColor = getCategoryColor(el.Category);
  
  return (
    <group position={position}>
      <Html transform distanceFactor={15} center>
        <button
          onClick={onClick}
          className={`
            relative flex flex-col items-center justify-center p-2 rounded-lg aspect-square border transition-all duration-500 hover:scale-110 hover:z-50
            w-16 h-16 sm:w-24 sm:h-24
            ${!matched ? 'opacity-20 grayscale' : 'opacity-100'}
            ${active ? 'bg-ochre text-slate-900 border-ochre shadow-[0_0_30px_rgba(224,169,109,1)] z-10 scale-125' : `${baseColor} hover:brightness-125 backdrop-blur-sm`}
          `}
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          <span className="absolute top-1 left-2 text-[10px] opacity-70">{el.AtomicNumber}</span>
          <strong className="text-2xl font-bold">{el.Symbol}</strong>
          <span className="text-[10px] truncate w-full text-center opacity-80 mt-1">{el.Name}</span>
        </button>
      </Html>
    </group>
  );
};

export const PeriodicTable: React.FC = () => {
  const [elements, setElements] = useState<ElementData[]>([]);
  const { protons, setElement } = useGameStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('table');
  const [currentYear, setCurrentYear] = useState(2026);
  const { t } = useTranslation();

  useEffect(() => {
    fetchPeriodicTable().then(setElements).catch(console.error);
  }, []);

  const isMatch = (el: ElementData) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = el.Name.toLowerCase().includes(query) || el.Symbol.toLowerCase().includes(query) || el.AtomicNumber.toString().includes(query);
    const matchesCategory = activeCategory ? !!el.Category?.toLowerCase().includes(activeCategory.toLowerCase()) : true;
    
    let matchesTimeline = true;
    if (el.YearDiscovered) {
      if (el.YearDiscovered.toLowerCase() === 'ancient') {
        matchesTimeline = true;
      } else {
        const year = parseInt(el.YearDiscovered, 10);
        if (!isNaN(year)) {
          matchesTimeline = year <= currentYear;
        }
      }
    }
    
    return matchesSearch && matchesCategory && matchesTimeline;
  };

  // Compute Layout Positions
  const layoutPositions = useMemo(() => {
    const positions = new Map<number, THREE.Vector3>();
    const count = elements.length;

    elements.forEach((el, index) => {
      let x = 0, y = 0, z = 0;
      
      if (layoutMode === 'table') {
        const group = getGroup(el.AtomicNumber);
        const period = el.Period;
        const isLanthanide = el.AtomicNumber >= 57 && el.AtomicNumber <= 71;
        const isActinide = el.AtomicNumber >= 89 && el.AtomicNumber <= 103;

        if (isLanthanide) {
          x = (el.AtomicNumber - 57 + 3) * 3 - 27;
          y = - (8 * 3) + 12;
        } else if (isActinide) {
          x = (el.AtomicNumber - 89 + 3) * 3 - 27;
          y = - (9 * 3) + 12;
        } else {
          x = (group * 3) - 28.5;
          y = - (period * 3) + 12;
        }
        z = 0;
      } 
      else if (layoutMode === 'sphere') {
        const phi = Math.acos(-1 + (2 * index) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const radius = 18;
        x = radius * Math.cos(theta) * Math.sin(phi);
        y = radius * Math.sin(theta) * Math.sin(phi);
        z = radius * Math.cos(phi);
      }
      else if (layoutMode === 'helix') {
        const theta = index * 0.4;
        const radius = 12;
        x = radius * Math.cos(theta);
        y = -(index * 0.3) + 15;
        z = radius * Math.sin(theta);
      }
      else if (layoutMode === 'grid') {
        const size = Math.ceil(Math.pow(count, 1/3));
        const spacing = 8;
        const offsetX = (size * spacing) / 2;
        const offsetY = (size * spacing) / 2;
        const offsetZ = (size * spacing) / 2;
        
        x = ((index % size) * spacing) - offsetX;
        y = (Math.floor((index / size) % size) * spacing) - offsetY;
        z = (Math.floor(index / (size * size)) * spacing) - offsetZ;
      }

      positions.set(el.AtomicNumber, new THREE.Vector3(x, y, z));
    });

    return positions;
  }, [elements, layoutMode]);

  if (elements.length === 0) {
    return <div className="p-4 text-center text-white/50 animate-pulse">Loading 3D Periodic Table...</div>;
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-2">
        <div className="relative w-full md:w-64 z-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
          <input 
            type="text" 
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/20 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-ochre shadow-lg backdrop-blur-md"
          />
        </div>

        <div className="flex bg-black/40 rounded-full p-1 border border-white/10 z-10">
          {(['table', 'sphere', 'helix', 'grid'] as LayoutMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setLayoutMode(mode)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${layoutMode === mode ? 'bg-ochre text-slate-900 shadow-md' : 'text-white/60 hover:text-white'}`}
            >
              {t(`layouts.${mode}`, mode)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto z-10">
          <select 
            value={activeCategory || ''}
            onChange={e => setActiveCategory(e.target.value || null)}
            className="bg-black/40 border border-white/20 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:border-ochre shadow-lg backdrop-blur-md"
          >
            <option value="">{t('search.all_categories')}</option>
            {uniqueCategories.map(cat => <option key={cat} value={cat}>{t(`categories.${cat}`, cat)}</option>)}
          </select>
        </div>
      </div>

      <div className="w-full h-[600px] relative rounded-xl overflow-hidden bg-slate-950/50 border border-white/5 shadow-inner">
        <Canvas camera={{ position: [0, 0, 45], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            autoRotate={layoutMode === 'sphere' || layoutMode === 'helix'}
            autoRotateSpeed={0.5}
            makeDefault
          />
          <group>
            {elements.map((el) => (
              <ElementNode
                key={el.AtomicNumber}
                el={el}
                position={layoutPositions.get(el.AtomicNumber) || new THREE.Vector3()}
                active={protons === el.AtomicNumber}
                matched={isMatch(el)}
                onClick={() => setElement(el.AtomicNumber)}
              />
            ))}
          </group>
        </Canvas>
      </div>

      <TimelineSlider currentYear={currentYear} setCurrentYear={setCurrentYear} />
    </div>
  );
};
