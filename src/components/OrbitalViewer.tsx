import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface OrbitalViewerProps {
  l: number; // 0=s, 1=p, 2=d, 3=f
  ml?: number;
}

const CloudMaterial = () => (
  <meshPhongMaterial 
    color="#00ffff" 
    emissive="#0088aa"
    emissiveIntensity={0.8}
    transparent={true} 
    opacity={0.3} 
    blending={THREE.AdditiveBlending}
    depthWrite={false}
    side={THREE.DoubleSide}
    shininess={100}
  />
);

const Lobe = ({ position, rotation, scale = 1 }: { position: [number, number, number], rotation?: [number, number, number], scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale + Math.sin(clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation || [0,0,0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <CloudMaterial />
    </mesh>
  );
};

const SOrbital = () => (
  <mesh>
    <sphereGeometry args={[2.5, 64, 64]} />
    <CloudMaterial />
  </mesh>
);

const POrbital = ({ ml }: { ml?: number }) => {
  const rotation: [number, number, number] = 
    ml === -1 ? [0, 0, Math.PI / 2] : 
    ml === 1 ? [Math.PI / 2, 0, 0] : 
    [0, 0, 0];

  return (
    <group rotation={rotation}>
      <Lobe position={[0, 1.2, 0]} scale={1.2} />
      <Lobe position={[0, -1.2, 0]} scale={1.2} />
    </group>
  );
};

const DOrbital = () => {
  return (
    <group>
      <Lobe position={[1.2, 1.2, 0]} scale={0.9} />
      <Lobe position={[-1.2, -1.2, 0]} scale={0.9} />
      <Lobe position={[-1.2, 1.2, 0]} scale={0.9} />
      <Lobe position={[1.2, -1.2, 0]} scale={0.9} />
    </group>
  );
};

const FOrbital = () => {
  // Complex 8-lobe structure for general f-orbital approximation
  return (
    <group>
      <Lobe position={[1, 1, 1]} scale={0.7} />
      <Lobe position={[-1, -1, 1]} scale={0.7} />
      <Lobe position={[-1, 1, -1]} scale={0.7} />
      <Lobe position={[1, -1, -1]} scale={0.7} />
      <Lobe position={[-1, -1, -1]} scale={0.7} />
      <Lobe position={[1, 1, -1]} scale={0.7} />
      <Lobe position={[1, -1, 1]} scale={0.7} />
      <Lobe position={[-1, 1, 1]} scale={0.7} />
    </group>
  );
};

export const OrbitalViewer: React.FC<OrbitalViewerProps> = ({ l, ml }) => {
  return (
    <Canvas camera={{ position: [0, 0, 8] }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={2} />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#0088ff" />
      <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={true} />
      
      {l === 0 && <SOrbital />}
      {l === 1 && <POrbital ml={ml} />}
      {l === 2 && <DOrbital />}
      {l >= 3 && <FOrbital />}
    </Canvas>
  );
};
