import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

export type LatticeType = 'SC' | 'BCC' | 'FCC';

interface CrystalViewerProps {
  latticeType: LatticeType;
  color?: string;
  size?: number; // scale multiplier, default 1
}

const generatePoints = (type: LatticeType) => {
  const points: THREE.Vector3[] = [];
  
  // Create a 2x2x2 cell grid
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        // Corners (Simple Cubic base)
        points.push(new THREE.Vector3(x, y, z));
        
        if (x < 1 && y < 1 && z < 1) {
          if (type === 'BCC') {
            // Body center
            points.push(new THREE.Vector3(x + 0.5, y + 0.5, z + 0.5));
          }
          if (type === 'FCC') {
            // Face centers
            points.push(new THREE.Vector3(x + 0.5, y + 0.5, z));
            points.push(new THREE.Vector3(x + 0.5, y, z + 0.5));
            points.push(new THREE.Vector3(x, y + 0.5, z + 0.5));
            // the other faces
            points.push(new THREE.Vector3(x + 0.5, y + 0.5, z + 1));
            points.push(new THREE.Vector3(x + 0.5, y + 1, z + 0.5));
            points.push(new THREE.Vector3(x + 1, y + 0.5, z + 0.5));
          }
        }
      }
    }
  }

  // Deduplicate points (floating point safety)
  const uniquePoints: THREE.Vector3[] = [];
  points.forEach(p => {
    if (!uniquePoints.some(up => up.distanceTo(p) < 0.01)) {
      uniquePoints.push(p);
    }
  });

  return uniquePoints;
};

// Generate bonds between nearest neighbors
const generateBonds = (points: THREE.Vector3[], type: LatticeType) => {
  const bonds: { start: THREE.Vector3, end: THREE.Vector3, length: number }[] = [];
  
  let threshold = 1.05; // SC nearest neighbor distance is 1
  if (type === 'BCC') threshold = Math.sqrt(0.5*0.5 * 3) + 0.05; // ~0.866
  if (type === 'FCC') threshold = Math.sqrt(0.5*0.5 * 2) + 0.05; // ~0.707

  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = points[i].distanceTo(points[j]);
      if (dist < threshold) {
        bonds.push({ start: points[i], end: points[j], length: dist });
      }
    }
  }
  return bonds;
};

export const CrystalViewer: React.FC<CrystalViewerProps> = ({ 
  latticeType, 
  color = '#4ade80',
  size = 1
}) => {
  const points = useMemo(() => generatePoints(latticeType), [latticeType]);
  const bonds = useMemo(() => generateBonds(points, latticeType), [points, latticeType]);

  const atomRadius = latticeType === 'SC' ? 0.2 : latticeType === 'BCC' ? 0.18 : 0.15;

  return (
    <Canvas camera={{ position: [4, 3, 4], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      <group scale={[size, size, size]}>
        {/* Atoms */}
        {points.map((p, idx) => (
          <Sphere key={`atom-${idx}`} args={[atomRadius, 32, 32]} position={p}>
            <meshStandardMaterial 
              color={color} 
              metalness={0.4} 
              roughness={0.2} 
            />
          </Sphere>
        ))}

        {/* Bonds */}
        {bonds.map((bond, idx) => {
          const midpoint = new THREE.Vector3().addVectors(bond.start, bond.end).multiplyScalar(0.5);
          const orientation = new THREE.Matrix4();
          orientation.lookAt(bond.start, bond.end, new THREE.Vector3(0, 1, 0));
          const quaternion = new THREE.Quaternion().setFromRotationMatrix(orientation);
          // Cylinder points up by default, rotate it to face Z
          quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2));

          return (
            <Cylinder 
              key={`bond-${idx}`} 
              args={[atomRadius * 0.2, atomRadius * 0.2, bond.length, 8]} 
              position={midpoint}
              quaternion={quaternion}
            >
              <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
            </Cylinder>
          );
        })}
      </group>
      
      <OrbitControls enablePan={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
};
