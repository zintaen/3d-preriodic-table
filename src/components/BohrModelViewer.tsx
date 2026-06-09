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

const randPos = () => [(Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.5];

const Nucleus = ({ protons }: { protons: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pMeshRef = useRef<THREE.InstancedMesh>(null);
  const nMeshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = React.useMemo(() => new THREE.Object3D(), []);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.2;
      groupRef.current.rotation.x = clock.elapsedTime * 0.1;
    }
  });

  // Cap visual particles to avoid lag for super heavy elements
  const visualProtons = Math.min(protons, 40); 
  const visualNeutrons = Math.min(protons, 40);

  const particleData = React.useMemo(() => {
    const pData = [];
    const nData = [];
    for (let i = 0; i < visualProtons; i++) pData.push(randPos());
    for (let i = 0; i < visualNeutrons; i++) nData.push(randPos());
    return { pData, nData };
  }, [visualProtons, visualNeutrons]);

  React.useLayoutEffect(() => {
    if (pMeshRef.current) {
      particleData.pData.forEach((pos, i) => {
        dummy.position.set(pos[0], pos[1], pos[2]);
        dummy.updateMatrix();
        pMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      pMeshRef.current.instanceMatrix.needsUpdate = true;
    }
    if (nMeshRef.current) {
      particleData.nData.forEach((pos, i) => {
        dummy.position.set(pos[0], pos[1], pos[2]);
        dummy.updateMatrix();
        nMeshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      nMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [particleData, dummy]);

  return (
    <group ref={groupRef}>
      {visualProtons > 0 && (
        <instancedMesh ref={pMeshRef} args={[undefined, undefined, visualProtons]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshPhongMaterial color="#ff3366" shininess={100} />
        </instancedMesh>
      )}
      {visualNeutrons > 0 && (
        <instancedMesh ref={nMeshRef} args={[undefined, undefined, visualNeutrons]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshPhongMaterial color="#3366ff" shininess={100} />
        </instancedMesh>
      )}
    </group>
  );
};

const ElectronShell = ({ radius, count, speedOffset }: { radius: number, count: number, speedOffset: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = React.useMemo(() => new THREE.Object3D(), []);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * speedOffset;
      // Add a slight wobble
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
  });

  React.useLayoutEffect(() => {
    if (meshRef.current && count > 0) {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        dummy.position.set(x, 0, z);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [count, radius, dummy]);

  return (
    <group ref={groupRef}>
      {/* Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.02, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
      {count > 0 && (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshPhongMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </instancedMesh>
      )}
    </group>
  );
};

export const BohrModelViewer: React.FC<BohrModelViewerProps> = ({ protons }) => {
  const shells = getSimpleShells(protons);

  return (
    <Canvas frameloop="demand" camera={{ position: [0, 6, 12], fov: 45 }}>
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
