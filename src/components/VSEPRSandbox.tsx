import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { GlassCard } from './GlassCard';

type VSEPRData = {
  name: string;
  angle: string;
  positions: THREE.Vector3[];
  lonePairs: THREE.Vector3[];
};

// Returns positions of atoms and lone pairs based on SN and LP
const getVSEPRData = (bp: number, lp: number): VSEPRData => {
  const sn = bp + lp;
  
  if (sn === 2) {
    if (lp === 0) return { name: 'Linear', angle: '180°', positions: [new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0)], lonePairs: [] };
  } else if (sn === 3) {
    const p1 = new THREE.Vector3(0, 1, 0);
    const p2 = new THREE.Vector3(Math.sqrt(3)/2, -0.5, 0);
    const p3 = new THREE.Vector3(-Math.sqrt(3)/2, -0.5, 0);
    if (lp === 0) return { name: 'Trigonal Planar', angle: '120°', positions: [p1, p2, p3], lonePairs: [] };
    if (lp === 1) return { name: 'Bent', angle: '< 120°', positions: [p2, p3], lonePairs: [p1] };
  } else if (sn === 4) {
    const p1 = new THREE.Vector3(0, 1, 0);
    const p2 = new THREE.Vector3(0, -1/3, Math.sqrt(8)/3);
    const p3 = new THREE.Vector3(-Math.sqrt(2/3), -1/3, -Math.sqrt(2)/3);
    const p4 = new THREE.Vector3(Math.sqrt(2/3), -1/3, -Math.sqrt(2)/3);
    if (lp === 0) return { name: 'Tetrahedral', angle: '109.5°', positions: [p1, p2, p3, p4], lonePairs: [] };
    if (lp === 1) return { name: 'Trigonal Pyramidal', angle: '< 109.5°', positions: [p2, p3, p4], lonePairs: [p1] };
    if (lp === 2) return { name: 'Bent', angle: '<< 109.5°', positions: [p3, p4], lonePairs: [p1, p2] };
  } else if (sn === 5) {
    // simplified
    const ax1 = new THREE.Vector3(0, 1, 0);
    const ax2 = new THREE.Vector3(0, -1, 0);
    const eq1 = new THREE.Vector3(1, 0, 0);
    const eq2 = new THREE.Vector3(-0.5, 0, Math.sqrt(3)/2);
    const eq3 = new THREE.Vector3(-0.5, 0, -Math.sqrt(3)/2);
    if (lp === 0) return { name: 'Trigonal Bipyramidal', angle: '90°, 120°', positions: [ax1, ax2, eq1, eq2, eq3], lonePairs: [] };
    if (lp === 1) return { name: 'Seesaw', angle: '< 90°, < 120°', positions: [ax1, ax2, eq2, eq3], lonePairs: [eq1] };
    if (lp === 2) return { name: 'T-shaped', angle: '< 90°', positions: [ax1, ax2, eq3], lonePairs: [eq1, eq2] };
    if (lp === 3) return { name: 'Linear', angle: '180°', positions: [ax1, ax2], lonePairs: [eq1, eq2, eq3] };
  } else if (sn === 6) {
    const ax1 = new THREE.Vector3(0, 1, 0);
    const ax2 = new THREE.Vector3(0, -1, 0);
    const eq1 = new THREE.Vector3(1, 0, 0);
    const eq2 = new THREE.Vector3(-1, 0, 0);
    const eq3 = new THREE.Vector3(0, 0, 1);
    const eq4 = new THREE.Vector3(0, 0, -1);
    if (lp === 0) return { name: 'Octahedral', angle: '90°', positions: [ax1, ax2, eq1, eq2, eq3, eq4], lonePairs: [] };
    if (lp === 1) return { name: 'Square Pyramidal', angle: '< 90°', positions: [ax1, eq1, eq2, eq3, eq4], lonePairs: [ax2] };
    if (lp === 2) return { name: 'Square Planar', angle: '90°', positions: [eq1, eq2, eq3, eq4], lonePairs: [ax1, ax2] };
    if (lp === 3) return { name: 'T-shaped', angle: '< 90°', positions: [eq1, eq2, eq3], lonePairs: [ax1, ax2, eq4] };
    if (lp === 4) return { name: 'Linear', angle: '180°', positions: [eq1, eq2], lonePairs: [ax1, ax2, eq3, eq4] };
  }

  // fallback/invalid
  return { name: 'Diatomic / Invalid', angle: '-', positions: [new THREE.Vector3(0, 1, 0)], lonePairs: [] };
};

export const VSEPRSandbox: React.FC = () => {
  const [bp, setBp] = useState<number>(2);
  const [lp, setLp] = useState<number>(0);

  const data = useMemo(() => getVSEPRData(bp, lp), [bp, lp]);

  const centralColor = '#6366f1'; // indigo
  const ligandColor = '#10b981'; // emerald
  const lpColor = '#f59e0b'; // amber

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <div className="flex-1 min-h-[400px] relative bg-slate-100 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <Canvas camera={{ position: [3, 2, 3], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} />
          
          <group scale={[1.2, 1.2, 1.2]}>
            {/* Central Atom */}
            <Sphere args={[0.3, 32, 32]}>
              <meshStandardMaterial color={centralColor} metalness={0.2} roughness={0.3} />
            </Sphere>

            {/* Ligands */}
            {data.positions.map((p, i) => {
              const start = new THREE.Vector3(0,0,0);
              const end = p.clone().multiplyScalar(1.2);
              const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
              const orient = new THREE.Matrix4().lookAt(start, end, new THREE.Vector3(0,1,0));
              const quat = new THREE.Quaternion().setFromRotationMatrix(orient).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2));
              
              return (
                <group key={`bp-${i}`}>
                  <Sphere args={[0.2, 32, 32]} position={end}>
                    <meshStandardMaterial color={ligandColor} metalness={0.2} roughness={0.3} />
                  </Sphere>
                  <Cylinder args={[0.05, 0.05, end.length(), 16]} position={mid} quaternion={quat}>
                    <meshStandardMaterial color="#cbd5e1" />
                  </Cylinder>
                </group>
              );
            })}

            {/* Lone Pairs */}
            {data.lonePairs.map((p, i) => {
              // Visualize lone pairs as semitransparent lobes/spheres
              const end = p.clone().multiplyScalar(0.8);
              return (
                <Sphere key={`lp-${i}`} args={[0.3, 16, 16]} position={end}>
                  <meshStandardMaterial color={lpColor} transparent opacity={0.4} />
                </Sphere>
              );
            })}
          </group>
          <OrbitControls autoRotate autoRotateSpeed={1.5} />
        </Canvas>
      </div>
      
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
        <GlassCard className="p-4">
          <h3 className="font-bold mb-4 text-slate-800 dark:text-white">VSEPR Controls</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-500 dark:text-white/60 mb-2">Bonding Pairs (BP): {bp}</label>
            <input 
              type="range" 
              min="1" max="6" 
              value={bp} 
              onChange={(e) => setBp(Number(e.target.value))} 
              className="w-full accent-ochre"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-bold text-slate-500 dark:text-white/60 mb-2">Lone Pairs (LP): {lp}</label>
            <input 
              type="range" 
              min="0" max={Math.max(0, 6 - bp)} 
              value={lp} 
              onChange={(e) => setLp(Number(e.target.value))} 
              className="w-full accent-ochre"
            />
            <div className="text-[10px] text-slate-400 mt-1">Max Steric Number (BP + LP) = 6</div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <h3 className="font-bold mb-3 text-slate-800 dark:text-white">Geometry</h3>
          <div className="space-y-2 text-sm text-slate-700 dark:text-white/80">
            <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-1">
              <span className="text-slate-500">Steric Number</span>
              <span className="font-bold text-slate-800 dark:text-white">{bp + lp}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-1">
              <span className="text-slate-500">Shape</span>
              <span className="font-bold text-ochre text-right max-w-[120px]">{data.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-1">
              <span className="text-slate-500">Ideal Angle</span>
              <span className="font-bold text-slate-800 dark:text-white">{data.angle}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
