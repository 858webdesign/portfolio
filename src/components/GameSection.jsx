"use client";
import { useEffect, useRef, useState } from "react";

const SRC = "https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist/assets/embed-games.js";
const ID  = "vite-game-script";

export default function GameSection() {
  const rootRef = useRef(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const el = rootRef.current;

    const tryGlobal = () => {
      const m = window.ViteGame?.mount; // <— expect this now
      if (typeof m === "function") {
        m.length > 0 ? m(el) : m();
        return true;
      }
      return false;
    };

    const inject = () =>
      new Promise((resolve, reject) => {
        if (document.getElementById(ID)) return resolve();
        const s = document.createElement("script");
        s.id = ID;
        s.src = SRC;
        s.defer = true;               // IIFE works as classic script
        s.onload = resolve;
        s.onerror = () => reject(new Error("Failed to load embed script"));
        document.body.appendChild(s);
      });

    (async () => {
      try {
        if (tryGlobal()) return;      // already present?
        await inject();               // load it
        if (tryGlobal()) return;      // now it should exist
        throw new Error("window.ViteGame.mount missing after load");
      } catch (e) {
        setErr(String(e?.message || e));
      }
    })();
  }, []);

  return (
    <>
      <h2 className="text-2xl mb-4 text-center">Try These Puzzles:</h2>
      <div id="vite-game-root" ref={rootRef} className="my-8 min-h-[200px] border border-dashed rounded-lg p-4" />
      {err && <p className="text-sm text-center text-red-600">{err}</p>}
    </>
  );
}
