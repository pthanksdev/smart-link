"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 90;
const CONNECT_DISTANCE = 3.2;

function buildNetwork() {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const velocities: THREE.Vector3[] = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    velocities.push(
      new THREE.Vector3(
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
        (Math.random() - 0.5) * 0.008,
      ),
    );
  }

  const linePositions: number[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    for (let j = i + 1; j < PARTICLE_COUNT; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < CONNECT_DISTANCE) {
        linePositions.push(
          positions[i * 3],
          positions[i * 3 + 1],
          positions[i * 3 + 2],
          positions[j * 3],
          positions[j * 3 + 1],
          positions[j * 3 + 2],
        );
      }
    }
  }

  return {
    positions,
    velocities,
    linePositions: new Float32Array(linePositions),
  };
}

export function ParticleNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const network = useMemo(() => buildNetwork(), []);
  const positions = useMemo(
    () => new Float32Array(network.positions),
    [network.positions],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04 + mouse.current.x * 0.15;
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.08 + mouse.current.y * 0.1;
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] += network.velocities[i].x;
      positions[i * 3 + 1] += network.velocities[i].y;
      positions[i * 3 + 2] += network.velocities[i].z;

      if (Math.abs(positions[i * 3]) > 9) network.velocities[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 6) network.velocities[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 5) network.velocities[i].z *= -1;
    }

    if (pointsRef.current) {
      const attr = pointsRef.current.geometry.getAttribute("position");
      attr.needsUpdate = true;
    }

    if (linesRef.current?.material instanceof THREE.LineBasicMaterial) {
      linesRef.current.material.opacity = 0.15 + Math.sin(t * 0.8) * 0.05;
    }

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      mouse.current.x * 1.5,
      0.02,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      mouse.current.y * 1.2,
      0.02,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group
      ref={groupRef}
      onPointerMove={(e) => {
        mouse.current.x = (e.pointer.x - 0.5) * 2;
        mouse.current.y = -(e.pointer.y - 0.5) * 2;
      }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#818cf8" />
      <pointLight position={[-10, -5, 5]} intensity={0.6} color="#38bdf8" />

      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#93c5fd"
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={network.linePositions.length / 3}
            array={network.linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.2} />
      </lineSegments>

      <mesh position={[0, 0, -2]}>
        <torusGeometry args={[3.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.35} wireframe />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 6]}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.08} wireframe />
      </mesh>
    </group>
  );
}
