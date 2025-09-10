// src/components/GameSectionClient.jsx
"use client";

import dynamic from "next/dynamic";

// Dynamically import your actual game component on the client only
const GameSection = dynamic(() => import("@/components/GameSection"), {
  ssr: false,
  loading: () => <div className="p-4 border rounded-md mt-6">Loading game…</div>,
});

export default function GameSectionClient(props) {
  return <GameSection {...props} />;
}
