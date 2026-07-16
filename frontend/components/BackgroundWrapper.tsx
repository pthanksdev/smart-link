"use client";

import dynamic from "next/dynamic";

const Background3D = dynamic(() => import("./Background3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 bg-gradient-to-br from-[#050508] via-[#0c1222] to-[#151035]"
    />
  ),
});

export default function BackgroundWrapper() {
  return <Background3D />;
}
