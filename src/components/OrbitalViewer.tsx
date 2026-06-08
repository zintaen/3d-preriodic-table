import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface OrbitalViewerProps {
  l: number; // 0=s, 1=p, 2=d, 3=f
  ml?: number;
}

// Generate point clouds for different orbital shapes
const generateOrbitalPoints = (l: number, ml: number = 0, numPoints: number = 20000): Float32Array => {
  const positions = new Float32Array(numPoints * 3);
  let i = 0;

  while (i < numPoints * 3) {
    // Generate random point in a bounding box [-3, 3]
    const x = (Math.random() - 0.5) * 6;
    const y = (Math.random() - 0.5) * 6;
    const z = (Math.random() - 0.5) * 6;

    const r = Math.sqrt(x*x + y*y + z*z);
    if (r > 3 || r === 0) continue;

    const theta = Math.acos(z / r);
    const phi = Math.atan2(y, x);

    let probability = 0;

    // Approximate spherical harmonics |Y_l^m|^2 and radial function
    const radialSq = Math.exp(-r); // Simple exponential decay for density

    if (l === 0) {
      // s-orbital: spherical
      probability = radialSq;
    } 
    else if (l === 1) {
      // p-orbital: lobes along axis
      // ml = 0 (pz), ml = 1 (px), ml = -1 (py)
      let angular = 0;
      if (ml === 0) angular = Math.cos(theta); // pz
      else if (ml === 1) angular = Math.sin(theta) * Math.cos(phi); // px
      else angular = Math.sin(theta) * Math.sin(phi); // py
      
      probability = angular * angular * radialSq * (r*r); 
    }
    else if (l === 2) {
      // d-orbital (simplified approximations)
      let angular = 0;
      if (ml === 0) {
        // dz^2
        angular = 3 * Math.cos(theta) * Math.cos(theta) - 1;
      } else if (Math.abs(ml) === 1) {
        // dxz, dyz
        angular = Math.sin(theta) * Math.cos(theta) * (ml === 1 ? Math.cos(phi) : Math.sin(phi));
      } else {
        // dx^2-y^2, dxy
        angular = Math.sin(theta) * Math.sin(theta) * (ml === 2 ? Math.cos(2*phi) : Math.sin(2*phi));
      }
      probability = angular * angular * radialSq * (r*r*r);
    }
    else {
      // f-orbital (very simplified aesthetic approximation for complex lobes)
      let angular = 0;
      if (ml === 0) angular = Math.cos(theta) * (5 * Math.cos(theta) * Math.cos(theta) - 3);
      else angular = Math.sin(theta) * Math.sin(theta) * Math.sin(theta) * Math.cos(3*phi); // one of the f shapes
      probability = angular * angular * radialSq * (r*r*r*r);
    }

    // Rejection sampling
    if (Math.random() < probability * 5) { // scaled up for more points
      positions[i++] = x;
      positions[i++] = y;
      positions[i++] = z;
    }
  }

  return positions;
};

const PointCloudOrbital: React.FC<{ l: number; ml?: number }> = ({ l, ml = 0 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => generateOrbitalPoints(l, ml, 25000), [l, ml]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      pointsRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  // Pick color based on l
  const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff88'];
  const color = colors[Math.min(l, 3)];

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={color}
        transparent={true}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const OrbitalViewer: React.FC<OrbitalViewerProps> = ({ l, ml = 0 }) => {
  return (
    <Canvas camera={{ position: [0, 0, 8] }}>
      <ambientLight intensity={0.2} />
      <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={true} />
      <PointCloudOrbital l={l} ml={ml} />
    </Canvas>
  );
};
