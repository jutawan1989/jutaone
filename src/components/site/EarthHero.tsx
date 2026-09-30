import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import * as THREE from "three";
import { EarthScene } from "./EarthCanvas";

const LOGO_URL = "/logo-jutaone.png";

function StaticFallback() {
  return (
    <img
      src={LOGO_URL}
      alt="Logo resmi JUTAONE di atas visual bumi digital"
      className="h-full w-full object-contain"
    />
  );
}

class EarthErrorBoundary extends React.Component<
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
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-background shadow-[var(--shadow-panel)]">
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

        <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center sm:bottom-4">
          <img
            src={LOGO_URL}
            alt="Logo resmi JUTAONE"
            className="w-24 rounded-md border border-border/70 bg-background/90 object-contain shadow-[var(--shadow-panel)] sm:w-32"
          />
        </div>
      </div>
    </EarthErrorBoundary>
  );
}