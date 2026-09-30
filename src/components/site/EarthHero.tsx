import { Canvas } from "@react-three/fiber";
import { Component, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import * as THREE from "three";
import { EarthScene } from "./EarthCanvas";

const LOGO_URL = "/logo-jutaone.png";

function StaticFallback() {
  return (
    <img
      src={LOGO_URL}
      alt="Logo resmi JUTAONE"
      className="h-full w-full object-contain"
    />
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
        {/* The original logo remains visible while the 3D Earth rotates in its globe area. */}
        <div className="absolute inset-x-0 top-0 h-[68%]">
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

        <img
          src={LOGO_URL}
          alt="Logo JUTAONE dengan bumi digital"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain mix-blend-screen"
        />
      </div>
    </EarthErrorBoundary>
  );
}
