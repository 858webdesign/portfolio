"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Use env var so dev/prod can point to different URLs without code edits.
 * e.g. NEXT_PUBLIC_GAMES_SRC="https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist/assets/embed-games.js"
 */
const SRC =
  process.env.NEXT_PUBLIC_GAMES_SRC ??
  "https://backend.petereichhorst.com/wp-content/plugins/headless-frontend/react/games/dist/assets/embed-games.js";

const ID = "vite-game-script";

export default function GameSection() {
  const rootRef = useRef(null);
  const didInit = useRef(false);       // guard StrictMode double-run
  const [status, setStatus] = useState("idle"); // idle|loading|ready|mounted|error
  const [err, setErr] = useState("");

  useEffect(() => {
    if (didInit.current) return;       // prevent double-effect in dev
    didInit.current = true;

    const el = rootRef.current;

    const tryMountNow = () => {
      const m = window.ViteGame?.mount || window.__vite_game_mount__;
      if (typeof m === "function") {
        try {
          m.length > 0 ? m(el) : m();
          setStatus("mounted");
          return true;
        } catch (e) {
          setStatus("error");
          setErr(String(e?.message || e));
          return true; // stop further retries; it threw
        }
      }
      return false;
    };

    const waitForGlobal = (msTotal = 3000, step = 100) =>
      new Promise((resolve) => {
        let waited = 0;
        const tick = () => {
          if (tryMountNow()) return resolve(true);
          waited += step;
          if (waited >= msTotal) return resolve(false);
          setTimeout(tick, step);
        };
        tick();
      });

    const injectScript = () =>
      new Promise((resolve, reject) => {
        let s = document.getElementById(ID);
        if (s) return resolve(true);

        s = document.createElement("script");
        s.id = ID;
        s.src = SRC;
        s.defer = true; // IIFE classic script
        s.onload = () => resolve(true);
        s.onerror = () => reject(new Error("Failed to load embed script"));
        document.body.appendChild(s);
      });

    (async () => {
      try {
        setStatus("loading");

        // If global already present (e.g., loaded by shortcode on same page), mount immediately.
        if (tryMountNow()) return;

        // Inject (idempotent)
        await injectScript();
        setStatus("ready");

        // Poll for the global for up to 3s without throwing
        const ok = await waitForGlobal(3000, 100);
        if (!ok) {
          setStatus("error");
          setErr("window.ViteGame.mount not found within timeout");
        }
      } catch (e) {
        setStatus("error");
        setErr(String(e?.message || e));
      }
    })();
  }, []);

  return (
    <>
      <h2 className="text-2xl mb-4 text-center"></h2>
      <div
        id="vite-game-root"
        ref={rootRef}
        className="my-8 min-h-[200px] text-center border border-dashed rounded-lg p-4"
      />
      {status !== "mounted" && (
        <p className="text-sm text-center text-gray-500">
          {status === "loading" && "Loading game…"}
          {status === "ready" && "Preparing to mount…"}
          {status === "error" && <>Couldn’t mount. {err}</>}
        </p>
      )}
    </>
  );
}
