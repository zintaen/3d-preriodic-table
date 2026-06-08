import React from 'react';
import { useTranslation } from 'react-i18next';
import { getSpectralLines, wavelengthToColor } from '../data/spectra';
import { Activity } from 'lucide-react';

export interface EmissionSpectrumProps {
  atomicNumber: number;
}

export const EmissionSpectrum: React.FC<EmissionSpectrumProps> = ({ atomicNumber }) => {
  const { t } = useTranslation();
  const lines = getSpectralLines(atomicNumber);

  // The visible spectrum bounds we are rendering
  const minWl = 400;
  const maxWl = 700;
  const range = maxWl - minWl;

  return (
    <div className="w-full mt-4">
      <h3 className="text-sm font-bold flex items-center gap-1.5 mb-2 text-slate-800 dark:text-white/90">
        <Activity size={16} className="text-ochre" />
        {t('properties.emission_spectrum', 'Emission Spectrum')}
      </h3>
      
      <div className="relative w-full h-12 bg-black rounded overflow-hidden shadow-inner flex border border-slate-300 dark:border-white/10">
        {/* Continuous background gradient to show the spectrum bounds very faintly */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgb(138,43,226), rgb(0,0,255), rgb(0,255,0), rgb(255,255,0), rgb(255,165,0), rgb(255,0,0))'
          }}
        />

        {lines.map((wl, i) => {
          // Calculate percentage position from 400nm to 700nm
          const pos = Math.max(0, Math.min(100, ((wl - minWl) / range) * 100));
          const color = wavelengthToColor(wl);
          
          return (
            <div 
              key={`${wl}-${i}`}
              className="absolute top-0 bottom-0 w-0.5"
              style={{
                left: `${pos}%`,
                backgroundColor: color,
                boxShadow: `0 0 4px 1px ${color}`
              }}
              title={`${Math.round(wl)} nm`}
            />
          );
        })}
      </div>
      
      <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-1">
        <span>400 nm</span>
        <span>700 nm</span>
      </div>
    </div>
  );
};
