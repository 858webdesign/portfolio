"use client";

import { useEffect, useRef, useState } from "react";

const SCRIPT_ID = "vite-game-script";
const SCRIPT_SRC = "https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist/assets/embed-games.js";

export default function GameSection() {
  const rootRef = useRef(null);
  const mountedRef = useRef(false);
  const [status, setStatus] = useState("loading"); // loading | ready | mounting | mounted | error
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const log = (...args) => console.log("[GameSection]", ...args);

    const findMount = () => {
      // Try a few possible globals your bundle might export
      const candidates = [
        window.__vite_game_mount__,
        window.viteGameMount,
        window.ViteGame?.mount,
        window.Game?.mount,
      ].filter(Boolean);
      return candidates[0] || null;
    };

    const tryMount = (attempt = 1) => {
      if (mountedRef.current) return;
      setStatus("mounting");

      const mount = findMount();
      if (!mount) {
        // Exponential-ish backoff up to ~3s
        const nextDelay = Math.min(3000, 150 * Math.pow(1.6, attempt));
        log(`mount fn not found (attempt ${attempt}), retrying in ${nextDelay}ms`);
        if (attempt > 20) {
          setStatus("error");
          setErrMsg("Mount function not found on window. Check embed script export name.");
          return;
        }
        setTimeout(() => tryMount(attempt + 1), nextDelay);
        return;
      }

      try {
        // Call styles: () and (el)
        const res = mount.length > 0 ? mount(el) : mount();
        mountedRef.current = true;
        setStatus("mounted");
        log("✅ Mounted game", { passedContainer: mount.length > 0, result: res });
      } catch (e) {
        log("❌ Mount threw", e);
        setStatus("error");
        setErrMsg(String(e?.message || e));
      }
    };

    const ensureScript = () => {
      if (document.getElementById(SCRIPT_ID)) {
        log("Script already present — mounting");
        setStatus("ready");
        tryMount();
        return;
      }

      // Try classic script first; if bundle is ESM-only, flip to module below
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.defer = true;

      script.onload = () => {
        log("Script loaded (classic).");
        setStatus("ready");
        tryMount();
      };
      script.onerror = () => {
        console.warn("Classic script failed; retrying as type=module…");

        // Remove failed script
        script.remove();

        // Retry as ESM module (some Vite builds output ESM)
        const mod = document.createElement("script");
        mod.id = SCRIPT_ID;
        mod.type = "module";
        mod.crossOrigin = "anonymous";
        mod.src = SCRIPT_SRC;
        mod.onload = () => {
          log("Script loaded (module).");
          setStatus("ready");
          tryMount();
        };
        mod.onerror = () => {
          setStatus("error");
          setErrMsg("Failed to load embed script. Check URL / CORS / CSP.");
        };
        document.body.appendChild(mod);
      };

      document.body.appendChild(script);
    };

    ensureScript();

    return () => {
      // optional: unmount logic if your embed exposes it
      // window.__vite_game_unmount__?.();
    };
  }, []);

  return (
    <>
      <h2 className="text-2xl mb-4 text-center">Try This  Puzzle:</h2>
      <div
        id="vite-game-root"
        ref={rootRef}
        className="my-8 min-h-[200px] border border-dashed rounded-lg p-4"
        data-mounted={mountedRef.current ? "true" : "false"}
      />
      {status !== "mounted" && (
        <p className="text-sm text-center text-gray-500">
          {status === "loading" && "Loading game assets…"}
          {status === "ready" && "Assets ready, mounting…"}
          {status === "mounting" && "Mounting…"}
          {status === "error" && <>Couldn’t mount game. {errMsg}</>}
        </p>
      )}
    </>
  );
}
