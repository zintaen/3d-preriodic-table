import React from 'react';
import { useTranslation } from 'react-i18next';

export interface TimelineSliderProps {
  currentYear: number;
  setCurrentYear: (year: number) => void;
  minYear?: number;
  maxYear?: number;
}

export const TimelineSlider: React.FC<TimelineSliderProps> = ({ 
  currentYear, 
  setCurrentYear,
  minYear = 1700,
  maxYear = 2026
}) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col items-center gap-2 mt-4 bg-black/40 p-4 rounded-xl border border-white/10 shadow-lg backdrop-blur-md">
      <div className="flex justify-between w-full text-xs font-bold text-white/60 uppercase tracking-widest">
        <span>{t('timeline.ancient', 'Ancient')}</span>
        <span className="text-ochre text-lg">{currentYear === maxYear ? t('timeline.present', 'Present') : currentYear}</span>
        <span>{t('timeline.present', 'Present')}</span>
      </div>
      <input
        type="range"
        min={minYear}
        max={maxYear}
        value={currentYear}
        onChange={(e) => setCurrentYear(Number(e.target.value))}
        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-ochre"
      />
      <div className="text-[10px] text-white/40 mt-1 text-center max-w-md">
        {t('timeline.description', 'Drag the slider to see when elements were discovered. Elements discovered after the selected year will fade away.')}
      </div>
    </div>
  );
};
