"use client";

import { Environment, ContactShadows } from "@react-three/drei";

export function LightingSetup() {
  return (
    <>
      <ambientLight intensity={0.45} color="#fff6ec" />

      <directionalLight
        castShadow
        intensity={2.4}
        color="#fff1db"
        position={[6, 8, 4]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00008}
      />

      <directionalLight intensity={0.7} color="#dce8f3" position={[-5, 4, -3]} />

      <Environment preset="apartment" environmentIntensity={0.95} />

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.28}
        scale={16}
        blur={2.6}
        far={5.5}
        resolution={1024}
        color="#7b6b5d"
      />
    </>
  );
}

