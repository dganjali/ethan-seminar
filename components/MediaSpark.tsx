'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface MediaSparkProps {
  currentSection: number;
}

const SECTION_POSITIONS: Record<number, [number, number, number]> = {
  0: [2, 1, 0],       // Title
  1: [-3, -1, 1],     // Topic
  2: [3, 2, -1],      // Problem Statement
  3: [-2, 2, 2],      // GAP
  4: [3, 0, 1],       // Methodology
  5: [0, 0, 3],       // Question
  6: [-3, 1, 0],      // Focus
  7: [2, -2, 1],      // Purpose
  8: [-2, 0, -2],     // Context
  9: [3, 1, 1],       // Scope
  10: [-1, 2, 0],     // Scale
  11: [2, -1, 2],     // Value
  12: [-3, -2, -1],   // Feasibility
  13: [3, 2, 0],      // Next Steps
  14: [0, 1, 2],      // References
};

export default function MediaSpark({ currentSection }: MediaSparkProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const vec = new THREE.Vector3();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Smoothly interpolate position based on current section
    const targetPos = SECTION_POSITIONS[currentSection] || [0, 0, 0];
    vec.set(targetPos[0], targetPos[1], targetPos[2]);
    meshRef.current.position.lerp(vec, 0.05);

    // Provide a very subtle pulsing effect by scaling
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    meshRef.current.scale.set(pulse, pulse, pulse);
  });

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        {/* Simple glowing effect using emissive property without heavy post-processing */}
        <meshStandardMaterial 
          color="#88ccff" 
          emissive="#0088ff"
          emissiveIntensity={0.8}
          roughness={0.4}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}
