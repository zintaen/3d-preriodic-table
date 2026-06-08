import React, { useEffect, useRef } from 'react';
import * as $3Dmol from '3dmol';
import { useTranslation } from 'react-i18next';
import { PackageOpen } from 'lucide-react';

export interface MoleculeViewerProps {
  sdfData: string;
  styleMode?: 'stick' | 'sphere' | 'cartoon';
  elementName?: string;
}

export const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ sdfData, styleMode = 'stick', elementName }) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<ReturnType<typeof $3Dmol.createViewer> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Instantiate viewer with transparent background
    viewerRef.current = $3Dmol.createViewer(container, {
      defaultcolors: $3Dmol.elementColors.rasmol,
      backgroundColor: '#f8fafc' // Light mode background
    });

    return () => {
      // Cleanup WebGL context
      if (viewerRef.current) {
        viewerRef.current.clear();
        viewerRef.current = null;
      }
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []); // Only run once on mount

  useEffect(() => {
    if (!viewerRef.current || !sdfData || sdfData.includes('<html')) {
      if (viewerRef.current) viewerRef.current.clear();
      return;
    }

    const viewer = viewerRef.current;
    viewer.clear();
    viewer.addModel(sdfData, 'sdf');
    
    // Apply styling
    let styleObj = {};
    if (styleMode === 'stick') {
      styleObj = { stick: {} };
    } else if (styleMode === 'sphere') {
      styleObj = { sphere: {} };
    } else if (styleMode === 'cartoon') {
      styleObj = { cartoon: {} };
    }
    
    viewer.setStyle({}, styleObj);
    viewer.zoomTo();
    viewer.render();

  }, [sdfData, styleMode]);

  const isValidData = sdfData && !sdfData.includes('<html');

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-lg border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-black/20 flex items-center justify-center">
      {!isValidData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 dark:text-white/50 p-6 text-center z-10">
          <PackageOpen size={48} className="mb-4 opacity-50" />
          <p>{t('messages.no_structure', { element: elementName || 'Unknown' })}</p>
        </div>
      )}
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 20, pointerEvents: isValidData ? 'auto' : 'none' }} 
        data-testid="viewer-container"
      />
    </div>
  );
};
