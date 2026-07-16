"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleNetwork } from "./scene/ParticleNetwork";

export default function Background3D() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0c1222] to-[#151035]" />
      <Canvas
        camera={{ position: [0, 0, 14], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="!absolute inset-0 pointer-events-auto"
      >
        <fog attach="fog" args={["#0c1222", 12, 28]} />
        <Suspense fallback={null}>
          <ParticleNetwork />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.1),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050508_75%)]" />
    </div>
  );
}
