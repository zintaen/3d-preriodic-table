import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { fetchPeriodicTable, type ElementData } from '../services/pubchem';
import { useGameStore } from '../store/gameStore';

export const ElementSearch: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [elements, setElements] = useState<ElementData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setElement } = useGameStore();

  useEffect(() => {
    fetchPeriodicTable().then(setElements).catch(console.error);
  }, []);

  const filtered = React.useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const q = query.toLowerCase().trim();
    const matches = elements.filter(
      (el) =>
        el.Name.toLowerCase().includes(q) ||
        el.Symbol.toLowerCase().includes(q) ||
        el.AtomicNumber.toString() === q
    );
    return matches.slice(0, 8); // limit to 8 results for UX
  }, [query, elements]);


  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (atomicNumber: number) => {
    setElement(atomicNumber);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-64 z-50">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-slate-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-black/30 border border-slate-300 dark:border-white/20 rounded-full text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ochre transition-all"
          placeholder={t('search.placeholder', 'Search elements...')}
        />
      </div>

      {isOpen && query.trim() && (
        <div className="absolute mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
          {filtered.length > 0 ? (
            <ul className="max-h-64 overflow-y-auto">
              {filtered.map((el) => (
                <li key={el.AtomicNumber}>
                  <button
                    onClick={() => handleSelect(el.AtomicNumber)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-3 transition-colors"
                  >
                    <div className="w-8 h-8 rounded bg-ochre/20 text-ochre font-black flex items-center justify-center shrink-0">
                      {el.Symbol}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 dark:text-white text-sm">
                        {el.Name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {t('properties.atomic_number')}: {el.AtomicNumber}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
              {t('search.no_results', 'No elements found.')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
