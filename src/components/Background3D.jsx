import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function CompassModel({ paused }) {
  const group = useRef();
  const needle = useRef();
  const ringA = useRef();
  const ringB = useRef();

  useFrame((_, delta) => {
    if (paused) return;
    if (group.current) group.current.rotation.y += delta * 0.12;
    if (needle.current) needle.current.rotation.z += delta * 0.08;
    if (ringA.current) ringA.current.rotation.x += delta * 0.18;
    if (ringB.current) ringB.current.rotation.y -= delta * 0.14;
  });

  const matMetal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c8c8c8",
        metalness: 0.85,
        roughness: 0.28,
      }),
    [],
  );
  const matRed = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9f1d20",
        metalness: 0.55,
        roughness: 0.35,
        emissive: "#3a0a0c",
        emissiveIntensity: 0.35,
      }),
    [],
  );
  const matDark = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a1e1e",
        metalness: 0.7,
        roughness: 0.45,
      }),
    [],
  );
  const matRing = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#3a4040",
        metalness: 0.8,
        roughness: 0.3,
      }),
    [],
  );

  return (
    <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.35}>
      <group ref={group} scale={1.15}>
        {/* outer gyro rings */}
        <mesh ref={ringA} rotation={[Math.PI / 2.4, 0.2, 0]} material={matRing}>
          <torusGeometry args={[2.35, 0.035, 16, 96]} />
        </mesh>
        <mesh ref={ringB} rotation={[0.4, Math.PI / 3, 0.1]} material={matRed}>
          <torusGeometry args={[2.05, 0.028, 16, 96]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={matDark}>
          <torusGeometry args={[1.75, 0.04, 16, 80]} />
        </mesh>

        {/* dial plate */}
        <mesh rotation={[-Math.PI / 2.15, 0, 0]} position={[0, 0.02, 0]} material={matDark}>
          <cylinderGeometry args={[1.45, 1.45, 0.06, 64]} />
        </mesh>

        {/* compass needle */}
        <group ref={needle}>
          {/* North */}
          <mesh position={[0, 0.08, -0.55]} rotation={[Math.PI / 2, 0, 0]} material={matMetal}>
            <coneGeometry args={[0.12, 1.1, 4]} />
          </mesh>
          {/* South */}
          <mesh position={[0, 0.08, 0.55]} rotation={[-Math.PI / 2, 0, 0]} material={matRed}>
            <coneGeometry args={[0.12, 1.1, 4]} />
          </mesh>
          {/* East / West stubs */}
          <mesh position={[0.55, 0.08, 0]} rotation={[0, 0, -Math.PI / 2]} material={matMetal}>
            <coneGeometry args={[0.07, 0.7, 4]} />
          </mesh>
          <mesh position={[-0.55, 0.08, 0]} rotation={[0, 0, Math.PI / 2]} material={matMetal}>
            <coneGeometry args={[0.07, 0.7, 4]} />
          </mesh>
        </group>

        {/* pivot */}
        <mesh position={[0, 0.12, 0]} material={matRed}>
          <sphereGeometry args={[0.12, 24, 24]} />
        </mesh>
        <mesh position={[0, 0.12, 0]} material={matMetal}>
          <sphereGeometry args={[0.05, 16, 16]} />
        </mesh>

        {/* cardinal posts */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={deg}
              position={[Math.sin(rad) * 1.55, 0.05, Math.cos(rad) * 1.55]}
              material={deg === 0 || deg === 180 ? matRed : matMetal}
            >
              <boxGeometry args={[0.04, 0.08, 0.14]} />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

function Scene({ paused }) {
  return (
    <>
      <color attach="background" args={["#080909"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={0.85} color="#f0f0f0" />
      <directionalLight position={[-3, -2, -4]} intensity={0.25} color="#9f1d20" />
      <pointLight position={[0, 2, 2]} intensity={0.4} color="#c0262a" distance={10} />
      <CompassModel paused={paused} />
      <fog attach="fog" args={["#080909", 6, 14]} />
    </>
  );
}

export default function Background3D() {
  const [paused, setPaused] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      setPaused(mq.matches);
      // keep model visible but still if reduced motion
    };
    apply();
    mq.addEventListener("change", apply);

    // disable on very small / weak devices optionally via saveData
    if (navigator.connection?.saveData) setEnabled(false);

    return () => mq.removeEventListener("change", apply);
  }, []);

  if (!enabled) return null;

  return (
    <div className="bg3d" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 2.2, 5.2], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene paused={paused} />
        </Suspense>
      </Canvas>
      <div className="bg3d-veil" />
    </div>
  );
}
