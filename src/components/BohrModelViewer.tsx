import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface BohrModelViewerProps {
  protons: number;
}

const getSimpleShells = (z: number) => {
  const shells = [];
  let remaining = z;
  // Stylized capacities to distribute up to 118 electrons nicely
  const caps = [2, 8, 18, 32, 32, 18, 8];
  for (const cap of caps) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, cap);
    shells.push(take);
    remaining -= take;
  }
  return shells;
};

const Nucleus = ({ protons }: { protons: number }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = clock.elapsedTime * 0.1;
    }
  });

  // Render a clump of spheres to represent nucleus
  const particles = [];
  // Cap visual particles to avoid lag for super heavy elements
  const visualProtons = Math.min(protons, 40); 
  const visualNeutrons = Math.min(protons, 40);

  for (let i = 0; i < visualProtons; i++) {
    particles.push(
      <mesh key={`p-${i}`} position={[(Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshPhongMaterial color="#ff3366" shininess={100} />
      </mesh>
    );
  }
  for (let i = 0; i < visualNeutrons; i++) {
    particles.push(
      <mesh key={`n-${i}`} position={[(Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshPhongMaterial color="#3366ff" shininess={100} />
      </mesh>
    );
  }

  return <group ref={meshRef}>{particles}</group>;
};

const ElectronShell = ({ radius, count, speedOffset }: { radius: number, count: number, speedOffset: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * speedOffset;
      // Add a slight wobble
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const electrons = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    electrons.push(
      <mesh key={i} position={[x, 0, z]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshPhongMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
    );
  }

  return (
    <group ref={groupRef}>
      {/* Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      {electrons}
    </group>
  );
};

export const BohrModelViewer: React.FC<BohrModelViewerProps> = ({ protons }) => {
  const shells = getSimpleShells(protons);

  return (
    <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      
      <Nucleus protons={protons} />
      
      {shells.map((count, i) => (
        <ElectronShell 
          key={i} 
          radius={2.5 + i * 1.5} 
          count={count} 
          speedOffset={(2 - (i * 0.2)) * (i % 2 === 0 ? 1 : -1)} 
        />
      ))}
    </Canvas>
  );
};
