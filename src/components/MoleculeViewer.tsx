import React, { useEffect, useRef } from 'react';
import * as $3Dmol from '3dmol';

export interface MoleculeViewerProps {
  sdfData: string;
  styleMode?: 'stick' | 'sphere' | 'cartoon';
}

export const MoleculeViewer: React.FC<MoleculeViewerProps> = ({ sdfData, styleMode = 'stick' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Instantiate viewer
    viewerRef.current = $3Dmol.createViewer(containerRef.current, {
      defaultcolors: $3Dmol.elementColors.rasmol
    });

    return () => {
      // Cleanup WebGL context
      if (viewerRef.current) {
        viewerRef.current.clear();
        viewerRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Only run once on mount

  useEffect(() => {
    if (!viewerRef.current || !sdfData) return;

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

  return <div ref={containerRef} style={{ width: '100%', height: '400px', position: 'relative' }} data-testid="viewer-container"></div>;
};
