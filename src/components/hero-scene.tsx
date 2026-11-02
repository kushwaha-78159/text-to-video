"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Core() {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.12;
    mesh.current.rotation.y += delta * 0.2;
    mesh.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.12;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={mesh} scale={1.65}>
        <icosahedronGeometry args={[1, 32]} />
        <MeshDistortMaterial
          color="#8555ff"
          emissive="#351078"
          emissiveIntensity={0.7}
          roughness={0.15}
          metalness={0.85}
          distort={0.34}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function Orbit({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  return (
    <mesh ref={ref} rotation={[0.8, 0.3, 0]}>
      <torusGeometry args={[radius, 0.008, 12, 180]} />
      <meshBasicMaterial color={color} transparent opacity={0.75} />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="hero-scene">
      <Canvas camera={{ position: [0, 0, 5.8], fov: 42 }} dpr={[1, 1.7]}>
        <ambientLight intensity={1.1} />
        <pointLight position={[4, 3, 4]} intensity={35} color="#a77bff" />
        <pointLight position={[-4, -2, 3]} intensity={22} color="#20d9ff" />
        <Stars radius={80} depth={45} count={1500} factor={3} fade speed={0.6} />
        <Core />
        <Orbit radius={2.25} speed={0.17} color="#a88aff" />
        <Orbit radius={2.65} speed={-0.12} color="#22d3ee" />
      </Canvas>
    </div>
  );
}
