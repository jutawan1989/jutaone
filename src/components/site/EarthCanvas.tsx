import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// One full rotation every 30 seconds, independent of frame rate.
const ROTATION_SPEED = (Math.PI * 2) / 30;

function Earth() {
  const earthRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [dayMap, nightMap, waterMap, cloudMap] = useLoader(THREE.TextureLoader, [
    "/textures/earth-day.jpg",
    "/textures/earth-night.jpg",
    "/textures/earth-water.png",
    "/textures/earth-clouds.png",
  ]);

  useEffect(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;
    cloudMap.colorSpace = THREE.SRGBColorSpace;
    dayMap.anisotropy = 4;
    nightMap.anisotropy = 4;
    cloudMap.anisotropy = 4;
  }, [cloudMap, dayMap, nightMap]);

  useFrame((_, rawDelta) => {
    // Always rotate. Cap large deltas after tab suspension to avoid jumps.
    const delta = Math.min(rawDelta, 0.05);
    if (earthRef.current) earthRef.current.rotation.y += ROTATION_SPEED * delta;
    if (cloudsRef.current) cloudsRef.current.rotation.y += ROTATION_SPEED * 1.08 * delta;
  });

  return (
    <group rotation-z={-0.18}>
      <group ref={earthRef} rotation-y={-1.45}>
        <mesh>
          <sphereGeometry args={[1.42, 96, 64]} />
          <meshPhongMaterial
            map={dayMap}
            specularMap={waterMap}
            specular={new THREE.Color("#8ecfff")}
            shininess={18}
            emissive={new THREE.Color("#d99a32")}
            emissiveMap={nightMap}
            emissiveIntensity={1.05}
          />
        </mesh>
      </group>

      <mesh ref={cloudsRef} rotation-y={-1.45}>
        <sphereGeometry args={[1.445, 72, 48]} />
        <meshPhongMaterial
          map={cloudMap}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh scale={1.12}>
        <sphereGeometry args={[1.42, 64, 48]} />
        <shaderMaterial
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={/* glsl */ `
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vNormal = normalize(normalMatrix * normal);
              vViewPosition = -mvPosition.xyz;
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            void main() {
              float rim = pow(1.0 - max(dot(normalize(vViewPosition), vNormal), 0.0), 3.2);
              vec3 blue = vec3(0.11, 0.52, 1.0);
              vec3 silver = vec3(0.62, 0.76, 0.9);
              gl_FragColor = vec4(mix(blue, silver, rim * 0.25), rim * 0.65);
            }
          `}
        />
      </mesh>
    </group>
  );
}

function OrbitalEffects() {
  return (
    <group rotation={[1.1, 0.18, 0.38]}>
      <mesh>
        <torusGeometry args={[1.82, 0.006, 8, 160]} />
        <meshBasicMaterial color="#d9ab55" transparent opacity={0.48} />
      </mesh>
      <mesh rotation-z={0.4}>
        <torusGeometry args={[1.96, 0.003, 8, 160]} />
        <meshBasicMaterial color="#b7cae6" transparent opacity={0.26} />
      </mesh>
    </group>
  );
}

function StarField() {
  const positions = useMemo(() => {
    const values = new Float32Array(360 * 3);
    let seed = 17;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 360; i += 1) {
      const radius = 4.5 + random() * 5;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      values[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      values[i * 3 + 1] = radius * Math.cos(phi);
      values[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return values;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#dce8f8" size={0.018} transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

export function EarthScene() {
  return (
    <>
      <ambientLight intensity={0.34} color="#48698c" />
      <directionalLight position={[-3.5, 2.5, 4]} intensity={2.8} color="#c8e7ff" />
      <pointLight position={[3.6, 1.3, 2.6]} intensity={24} distance={9} color="#f0b84f" />
      <Earth />
      <OrbitalEffects />
      <StarField />
    </>
  );
}
