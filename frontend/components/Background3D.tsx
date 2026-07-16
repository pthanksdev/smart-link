"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

const COUNT = 100;
const FOCAL = 400;
const CONNECT_DIST = 120;

function initParticles(): Particle[] {
  return Array.from({ length: COUNT }, () => ({
    x: (Math.random() - 0.5) * 1400,
    y: (Math.random() - 0.5) * 900,
    z: (Math.random() - 0.5) * 900,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    vz: (Math.random() - 0.5) * 0.6,
  }));
}

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = initParticles();
    let width = 0;
    let height = 0;
    let rotation = 0;
    let frameId = 0;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width;
      canvas!.height = height;
    }

    function project(
      x: number,
      y: number,
      z: number,
      rotY: number,
    ): { sx: number; sy: number; scale: number } {
      const cos = Math.cos(rotY);
      const sin = Math.sin(rotY);
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const tilt = Math.sin(rotY * 0.5) * 0.15;
      const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
      const rz2 = y * Math.sin(tilt) + rz * Math.cos(tilt);

      const camZ = rz2 + 700 + mouseRef.current.y * 80;
      const scale = FOCAL / (FOCAL + camZ);
      const sx = width / 2 + (rx + mouseRef.current.x * 120) * scale;
      const sy = height / 2 + ry * scale;
      return { sx, sy, scale };
    }

    function draw() {
      ctx!.clearRect(0, 0, width, height);
      rotation += 0.0018;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (Math.abs(p.x) > 700) p.vx *= -1;
        if (Math.abs(p.y) > 450) p.vy *= -1;
        if (Math.abs(p.z) > 450) p.vz *= -1;
      }

      const projected = particles.map((p) => ({
        p,
        ...project(p.x, p.y, p.z, rotation),
      }));

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.p.x - b.p.x;
          const dy = a.p.y - b.p.y;
          const dz = a.p.z - b.p.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.35 * Math.min(a.scale, b.scale);
            ctx!.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.sx, a.sy);
            ctx!.lineTo(b.sx, b.sy);
            ctx!.stroke();
          }
        }
      }

      for (const { sx, sy, scale } of projected) {
        const radius = Math.max(1.2, 3 * scale);
        const glow = ctx!.createRadialGradient(sx, sy, 0, sx, sy, radius * 3);
        glow.addColorStop(0, `rgba(147, 197, 253, ${0.9 * scale})`);
        glow.addColorStop(1, "rgba(147, 197, 253, 0)");
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(sx, sy, radius * 3, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.fillStyle = `rgba(191, 219, 254, ${0.95 * scale})`;
        ctx!.beginPath();
        ctx!.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      frameId = requestAnimationFrame(draw);
    }

    function onMove(e: MouseEvent) {
      mouseRef.current.x = e.clientX / width - 0.5;
      mouseRef.current.y = e.clientY / height - 0.5;
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#0c1222] to-[#151035]" />
      <canvas
        ref={canvasRef}
        className="pointer-events-auto absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.18),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(56,189,248,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050508_72%)]" />
    </div>
  );
}
