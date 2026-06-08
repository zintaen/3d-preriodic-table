import { useRef } from 'react';
import { Canvas, } from '@react-three/fiber';
import * as THREE from 'three';

export interface OrbitalViewerProps {
  
  l: number; // 0=s, 1=p, 2=d
  ml?: number;
}

const CloudMaterial = () => (
  <meshPhongMaterial 
    color="#80D1E3" 
    transparent={true} 
    opacity={0.6} 
    blending={THREE.AdditiveBlending}
    depthWrite={false}
    side={THREE.DoubleSide}
  />
);

const SOrbital = () => {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <CloudMaterial />
    </mesh>
  );
};

const POrbital = ({ ml }: { ml?: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Rotate based on ml (-1, 0, 1) -> x, y, z alignment
  const rotation: [number, number, number] = 
    ml === -1 ? [0, 0, Math.PI / 2] : 
    ml === 1 ? [Math.PI / 2, 0, 0] : 
    [0, 0, 0];

  return (
    <group ref={groupRef} rotation={rotation}>
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <CloudMaterial />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <CloudMaterial />
      </mesh>
    </group>
  );
};

const DOrbital = () => {
  // Rough approximation for d orbitals
  return (
    <group>
      <mesh position={[1, 1, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <CloudMaterial />
      </mesh>
      <mesh position={[-1, -1, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <CloudMaterial />
      </mesh>
      <mesh position={[-1, 1, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <CloudMaterial />
      </mesh>
      <mesh position={[1, -1, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <CloudMaterial />
      </mesh>
    </group>
  );
};

export const OrbitalViewer: React.FC<OrbitalViewerProps> = ({ l, ml }) => {
  return (
    <Canvas camera={{ position: [0, 0, 8] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {l === 0 && <SOrbital />}
      {l === 1 && <POrbital ml={ml} />}
      {l >= 2 && <DOrbital />}
    </Canvas>
  );
};
