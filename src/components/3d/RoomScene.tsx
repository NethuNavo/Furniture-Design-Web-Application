"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import type { PlannerItem } from "@/lib/plannerUtils";
import { LightingSetup } from "@/components/3d/LightingSetup";
import { FurnitureModel } from "@/components/3d/FurnitureModel";

type RoomShape = "rectangle" | "square" | "l-shape" | "open-plan" | "u-shape";

type RoomSceneProps = {
  roomWidth: number;
  roomHeight: number;
  wallColor: string;
  floorColor: string;
  roomShape?: RoomShape;
  items: PlannerItem[];
};

export function RoomScene({
  roomWidth,
  roomHeight,
  wallColor,
  floorColor,
  roomShape = "rectangle",
  items,
}: RoomSceneProps) {
  return (
    <div className="h-[72vh] min-h-[560px] w-full overflow-hidden rounded-[2rem] border border-stone-300/60 bg-[radial-gradient(circle_at_top,#ffffff_0%,#f5efe7_52%,#eee4d7_100%)] shadow-soft-lg">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [6.8, 4.6, 7.2], fov: 42 }}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.05;
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          (gl as THREE.WebGLRenderer & { useLegacyLights?: boolean }).useLegacyLights = false;
        }}
      >
        <color attach="background" args={["#f7f2eb"]} />

        <Suspense
          fallback={
            <Html center>
              <div className="rounded-full border border-stone-300 bg-white/90 px-4 py-2 text-sm text-charcoal shadow-soft">
                Loading 3D room...
              </div>
            </Html>
          }
        >
          <ScandinavianRoom
            roomWidth={roomWidth}
            roomHeight={roomHeight}
            wallColor={wallColor}
            floorColor={floorColor}
            roomShape={roomShape}
            items={items}
          />
          <LightingSetup />
        </Suspense>

        <OrbitControls
          enablePan={true}
          minDistance={4}
          maxDistance={18}
          minPolarAngle={0}
          maxPolarAngle={Math.PI - 0.15}
          target={[0, 0.8, 0]}
        />
      </Canvas>
    </div>
  );
}

function ScandinavianRoom({
  roomWidth,
  roomHeight,
  wallColor,
  floorColor,
  roomShape,
  items,
}: RoomSceneProps & { roomShape: RoomShape }) {
  const width = Math.max(roomWidth / 100, 4.6);
  const depth = Math.max(roomHeight / 100, 4.2);
  const wallHeight = 3;
  const wallThickness = 0.08;
  const floorTexture = useWoodFloorTexture();
  const roomFootprint = useMemo(
    () => createRoomFootprint(roomShape, width, depth),
    [roomShape, width, depth],
  );

  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(wallColor),
        roughness: 0.94,
        metalness: 0.01,
      }),
    [wallColor],
  );

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial
  map={floorTexture}
  color={new THREE.Color(floorColor)}
/>
      </mesh>

      <RoomWalls
        shape={roomFootprint}
        wallHeight={wallHeight}
        wallThickness={wallThickness}
        material={wallMaterial}
      />

      {items.map((item) => {
        const itemWidthUnits = Math.max(item.width / 100, 0.42);
        const itemDepthUnits = Math.max(item.height / 100, 0.42);

        return (
          <FurnitureModel
            key={item.id}
            item={item}
            position={[
              item.x / 100 - width / 2 + itemWidthUnits / 2,
              0.02,
              item.y / 100 - depth / 2 + itemDepthUnits / 2,
            ]}
          />
        );
      })}
    </group>
  );
}

function RoomWalls({
  shape,
  wallHeight,
  wallThickness,
  material,
}: {
  shape: THREE.Shape;
  wallHeight: number;
  wallThickness: number;
  material: THREE.Material;
}) {
  const points = useMemo(() => shape.getPoints(), [shape]);

  const wallSegments = useMemo(() => {
    const segments: Array<{ center: [number, number, number]; length: number; angle: number }> = [];

    for (let index = 0; index < points.length - 1; index += 1) {
      if (index > 1) break;

      const start = points[index];
      const end = points[index + 1];
      const dx = end.x - start.x;
      const dz = end.y - start.y;
      const length = Math.hypot(dx, dz);

      if (length < 0.001) continue;

      segments.push({
        center: [(start.x + end.x) / 2, wallHeight / 2, (start.y + end.y) / 2],
        length,
        angle: Math.atan2(dz, dx),
      });
    }

    return segments;
  }, [points, wallHeight]);

  return (
    <group>
      {wallSegments.map((segment, index) => (
        <mesh
          key={index}
          position={segment.center}
          rotation={[0, -segment.angle, 0]}
          receiveShadow
          material={material}
        >
          <boxGeometry args={[segment.length, wallHeight, wallThickness]} />
        </mesh>
      ))}
    </group>
  );
}

function createRoomFootprint(roomShape: RoomShape, width: number, depth: number) {
  const halfW = width / 2;
  const halfD = depth / 2;

  const path = new THREE.Shape();

  if (roomShape === "l-shape") {
    path.moveTo(-halfW, -halfD);
    path.lineTo(halfW, -halfD);
    path.lineTo(halfW, depth * 0.14);
    path.lineTo(width * 0.16, depth * 0.14);
    path.lineTo(width * 0.16, halfD);
    path.lineTo(-halfW, halfD);
    path.lineTo(-halfW, -halfD);
    return path;
  }

  if (roomShape === "u-shape") {
    path.moveTo(-halfW, -halfD);
    path.lineTo(halfW, -halfD);
    path.lineTo(halfW, halfD);
    path.lineTo(width * 0.26, halfD);
    path.lineTo(width * 0.26, -depth * 0.08);
    path.lineTo(-width * 0.26, -depth * 0.08);
    path.lineTo(-width * 0.26, halfD);
    path.lineTo(-halfW, halfD);
    path.lineTo(-halfW, -halfD);
    return path;
  }

  if (roomShape === "open-plan") {
    path.moveTo(-halfW, -halfD);
    path.lineTo(halfW, -halfD);
    path.lineTo(halfW, halfD * 0.82);
    path.lineTo(halfW * 0.68, halfD);
    path.lineTo(-halfW, halfD);
    path.lineTo(-halfW, -halfD);
    return path;
  }

  path.moveTo(-halfW, -halfD);
  path.lineTo(halfW, -halfD);
  path.lineTo(halfW, halfD);
  path.lineTo(-halfW, halfD);
  path.lineTo(-halfW, -halfD);
  return path;
}

function useWoodFloorTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");

    if (!context) {
      return new THREE.CanvasTexture(canvas);
    }

    context.fillStyle = "#d7bf9f";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let index = 0; index < 14; index += 1) {
      const plankX = index * 38;
      context.fillStyle = index % 2 === 0 ? "#d9c29f" : "#cfb28f";
      context.fillRect(plankX, 0, 34, canvas.height);
      context.strokeStyle = "rgba(116,88,59,0.14)";
      context.strokeRect(plankX, 0, 34, canvas.height);

      for (let grain = 0; grain < 18; grain += 1) {
        context.strokeStyle = `rgba(130,95,62,${0.06 + Math.random() * 0.06})`;
        context.beginPath();
        context.moveTo(plankX + 4, grain * 28);
        context.bezierCurveTo(
          plankX + 16,
          grain * 28 + 8,
          plankX + 20,
          grain * 28 - 6,
          plankX + 28,
          grain * 28 + 12,
        );
        context.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}