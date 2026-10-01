import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import * as THREE from "three";
import { EarthScene } from "./EarthCanvas";

function StaticFallback() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-[#020916] px-5 py-8 text-center shadow-[var(--shadow-panel)]">
      <img
        src="/logo-jutaone-header.svg"
        alt="Logo JUTAONE"
        className="mb-3 h-auto w-full max-w-[320px] object-contain"
      />
      <p className="text-xs tracking-[0.12em] text-gold">The Future of Gold &amp; Silver Intelligence</p>
    </div>
  );
}

class EarthErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Earth WebGL scene failed", error, info);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function EarthHero() {
  const [webGLAvailable, setWebGLAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setWebGLAvailable(supportsWebGL());
  }, []);

  if (webGLAvailable !== true) return <StaticFallback />;

  return (
    <EarthErrorBoundary fallback={<StaticFallback />}>
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-[#020916] shadow-[var(--shadow-panel)]">
        <div className="absolute inset-x-0 top-0 h-[77%]">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 4.35], fov: 42, near: 0.1, far: 30 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.outputColorSpace = THREE.SRGBColorSpace;
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.08;
            }}
          >
            <color attach="background" args={["#020916"]} />
            <Suspense fallback={null}>
              <EarthScene />
            </Suspense>
          </Canvas>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-[7%] z-10 flex justify-center">
          <img
            src="/logo-jutaone-symbol.svg"
            alt=""
            aria-hidden="true"
            className="h-[245px] w-[245px] max-h-[58%] max-w-[58%] object-contain drop-shadow-[0_0_22px_rgba(245,190,70,0.28)]"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 bg-gradient-to-t from-[#020916] via-[#020916]/95 to-transparent px-4 pb-7 pt-12 text-center">
          <p className="font-display text-3xl font-bold uppercase tracking-[0.1em] text-gold-gradient sm:text-4xl">
            JUTAONE
          </p>
          <div className="flex w-full items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/80 sm:w-12" />
            <p className="text-xs text-gold sm:text-sm">The Future of Gold &amp; Silver Intelligence</p>
            <span className="h-px w-8 bg-gold/80 sm:w-12" />
          </div>
          <p className="text-[9px] uppercase tracking-[0.35em] text-silver/80">
            AI-Powered Precious Metals Analysis
          </p>
        </div>
      </div>
    </EarthErrorBoundary>
  );
}
