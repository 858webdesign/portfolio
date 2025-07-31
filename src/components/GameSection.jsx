'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GameSection({ showGame }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!showGame) return;

    const el = document.getElementById('vite-game-root');
    if (el) el.dataset.mounted = ''; // 🧼 Clear stale mount marker

    const mountGame = () => {
      if (window.__vite_game_mount__) {
        alert('🚀 Mounting game via window.__vite_game_mount__()');
        window.__vite_game_mount__();
      } else {
        alert('⚠️ mount fn not ready');
      }
    };

    const existingScript = document.getElementById('vite-game-script');
    if (!existingScript) {
      alert('📜 Adding Vite game script...');
      const script = document.createElement('script');
      script.src =
        'https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist/assets/index.js';
      script.id = 'vite-game-script';
      script.defer = true;
      script.onload = mountGame;
      document.body.appendChild(script);
    } else {
      mountGame();
    }
  }, [pathname, showGame]);

  if (!showGame) return null;

  return (
    <>
      <h1 className="text-2xl mb-4 text-center">Try This Puzzle:</h1>
      <div id="vite-game-root" className="my-8" />
    </>
  );
}
