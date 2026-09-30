import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import * as THREE from "three";
import { EarthScene } from "./EarthCanvas";

const LOGO_URL = "/logo-jutaone.png";

function StaticFallback() {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-[#d8ad55]/70 bg-[#020916] p-2 shadow-[0_0_35px_rgba(218,166,65,0.18)]">
      <img src={LOGO_URL} alt="Logo resmi JUTAONE" className="h-full w-full rounded-[1.5rem] object-contain" />
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
      <div className="relative mx-auto aspect-square w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-[#e3b95f]/80 bg-[#020916] p-2 shadow-[0_0_42px_rgba(218,166,65,0.22),0_20px_70px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-[5px] z-20 rounded-[1.65rem] border border-[#f5d98b]/60" />
        <div className="pointer-events-none absolute inset-[10px] z-20 rounded-[1.4rem] border border-[#238ed8]/50" />
        <div className="pointer-events-none absolute inset-x-3 top-3 z-[5] h-[62%] overflow-hidden rounded-t-[1.35rem]">
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

        <div className="pointer-events-none absolute inset-0 z-[8] bg-[radial-gradient(ellipse_at_50%_42%,transparent_35%,rgba(2,9,22,0.2)_75%,rgba(2,9,22,0.65)_100%)]" />
        <img
          src={LOGO_URL}
          alt="Logo JUTAONE dengan bingkai emas dan bumi digital"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain mix-blend-screen"
        />
        <div className="pointer-events-none absolute inset-x-8 bottom-0 z-20 h-px bg-gradient-to-r from-transparent via-[#f3ce73] to-transparent shadow-[0_0_14px_3px_rgba(243,206,115,0.55)]" />
      </div>
    </EarthErrorBoundary>
  );
}
