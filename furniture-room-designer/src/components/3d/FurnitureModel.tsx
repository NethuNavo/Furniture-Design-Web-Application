"use client";

import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { PlannerItem } from "@/lib/plannerUtils";

type FurnitureModelProps = {
  item: PlannerItem;
  position: [number, number, number];
  rotation?: [number, number, number];
  modelPath?: string;
};

export function FurnitureModel({ item, position, rotation = [0, 0, 0], modelPath }: FurnitureModelProps) {
  if (modelPath) {
    return (
      <Suspense fallback={<FallbackFurniture item={item} position={position} rotation={rotation} />}>
        <GLTFFurniture item={item} position={position} rotation={rotation} modelPath={modelPath} />
      </Suspense>
    );
  }

  return <FallbackFurniture item={item} position={position} rotation={rotation} />;
}

type GLTFFurnitureProps = FurnitureModelProps & {
  modelPath: string;
};

function GLTFFurniture({ item, position, rotation, modelPath }: GLTFFurnitureProps) {
  // `useGLTF` uses GLTFLoader internally and lets us swap in real models later
  const gltf = useGLTF(modelPath);
  const clonedScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
          if (material instanceof THREE.MeshStandardMaterial) {
            material.roughness = Math.min(material.roughness ?? 0.8, 0.92);
            material.metalness = material.metalness ?? 0.08;
          }
        });
      }
    });
  }, [clonedScene]);

  return <primitive object={clonedScene} position={position} rotation={rotation} scale={0.9} />;
}

function FallbackFurniture({ item, position, rotation }: FurnitureModelProps) {
  const upholstery = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.color || "#d1c2ae"),
        roughness: 0.92,
        metalness: 0.03,
      }),
    [item.color],
  );

  const accent = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(lightenColor(item.color || "#d1c2ae", 0.16)),
        roughness: 0.95,
        metalness: 0.02,
      }),
    [item.color],
  );

  const wood = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#987351",
        roughness: 0.82,
        metalness: 0.08,
      }),
    [],
  );

  const darkWood = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#715642",
        roughness: 0.8,
        metalness: 0.08,
      }),
    [],
  );

  const metal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#7e807b",
        roughness: 0.35,
        metalness: 0.65,
      }),
    [],
  );

  const width = Math.max(item.width / 100, 0.45);
  const depth = Math.max(item.height / 100, 0.45);

  return (
    <group position={position} rotation={rotation}>
      {(item.type === "sofa" || item.type === "sectional-sofa") && (
        <>
          <RoundedBlock args={[width * 1.02, 0.34, depth * 0.94]} position={[0, 0.18, 0.02]} material={upholstery} />
          <RoundedBlock args={[width * 0.96, 0.44, depth * 0.78]} position={[0, 0.36, 0.05]} material={upholstery} />
          <RoundedBlock args={[width * 0.88, 0.42, depth * 0.28]} position={[0, 0.58, -depth * 0.18]} material={upholstery} />
          <RoundedBlock args={[width * 0.22, 0.5, depth * 0.66]} position={[-width * 0.37, 0.34, 0.02]} material={upholstery} />
          <RoundedBlock args={[width * 0.22, 0.5, depth * 0.66]} position={[width * 0.37, 0.34, 0.02]} material={upholstery} />
          <RoundedBlock args={[width * 0.22, 0.16, depth * 0.18]} position={[-width * 0.15, 0.43, -depth * 0.03]} material={accent} />
          <RoundedBlock args={[width * 0.22, 0.16, depth * 0.18]} position={[width * 0.12, 0.43, -depth * 0.01]} material={accent} />
        </>
      )}

      {(item.type === "armchair" || item.type === "accent-chair") && (
        <>
          <RoundedBlock args={[width * 0.82, 0.36, depth * 0.76]} position={[0, 0.18, 0.04]} material={upholstery} />
          <RoundedBlock args={[width * 0.78, 0.44, depth * 0.2]} position={[0, 0.49, -depth * 0.18]} material={upholstery} />
          <RoundedBlock args={[width * 0.18, 0.42, depth * 0.62]} position={[-width * 0.3, 0.28, 0.02]} material={upholstery} />
          <RoundedBlock args={[width * 0.18, 0.42, depth * 0.62]} position={[width * 0.3, 0.28, 0.02]} material={upholstery} />
          <RoundedBlock args={[width * 0.26, 0.14, depth * 0.2]} position={[0, 0.35, -depth * 0.02]} material={accent} />
        </>
      )}

      {(item.type === "coffee-table" || item.type === "side-table") && (
        <>
          <mesh castShadow receiveShadow position={[0, 0.22, 0]}>
            <cylinderGeometry args={[Math.min(width, depth) * 0.32, Math.min(width, depth) * 0.38, 0.08, 32]} />
            <meshStandardMaterial color="#d9c1a0" roughness={0.55} metalness={0.08} />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.11, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 0.22, 18]} />
            <primitive object={wood} attach="material" />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.04, 0]}>
            <cylinderGeometry args={[Math.min(width, depth) * 0.18, Math.min(width, depth) * 0.2, 0.05, 24]} />
            <primitive object={darkWood} attach="material" />
          </mesh>
        </>
      )}

      {item.type === "dining-table" && (
        <>
          <mesh castShadow receiveShadow position={[0, 0.42, 0]}>
            <boxGeometry args={[width, 0.08, depth]} />
            <primitive object={wood} attach="material" />
          </mesh>
          {[
            [-width * 0.36, 0.2, -depth * 0.34],
            [width * 0.36, 0.2, -depth * 0.34],
            [-width * 0.36, 0.2, depth * 0.34],
            [width * 0.36, 0.2, depth * 0.34],
          ].map((leg, index) => (
            <mesh key={index} castShadow receiveShadow position={leg as [number, number, number]}>
              <boxGeometry args={[0.07, 0.4, 0.07]} />
              <primitive object={wood} attach="material" />
            </mesh>
          ))}
        </>
      )}

      {(item.type === "cabinet" || item.type === "storage-shelf" || item.type === "tv-console") && (
        <>
          <mesh castShadow receiveShadow position={[0, item.type === "tv-console" ? 0.26 : 0.56, 0]}>
            <boxGeometry args={[width, item.type === "tv-console" ? 0.52 : 1.12, depth]} />
            <primitive object={darkWood} attach="material" />
          </mesh>
          {item.type !== "tv-console" && (
            <mesh castShadow receiveShadow position={[0, 0.56, depth * 0.505]}>
              <boxGeometry args={[width * 0.86, 0.96, 0.02]} />
              <primitive object={wood} attach="material" />
            </mesh>
          )}
        </>
      )}

      {item.type === "floor-lamp" && (
        <>
          <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.22, 0.26, 0.08, 22]} />
            <primitive object={metal} attach="material" />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 0.72, 0]}>
            <cylinderGeometry args={[0.03, 0.035, 1.35, 16]} />
            <primitive object={metal} attach="material" />
          </mesh>
          <mesh castShadow receiveShadow position={[0, 1.46, 0]}>
            <cylinderGeometry args={[0.22, 0.3, 0.36, 28, 1, true]} />
            <meshStandardMaterial color="#eee5d8" roughness={0.88} metalness={0.02} side={THREE.DoubleSide} />
          </mesh>
        </>
      )}

      {item.type === "bed" && (
        <>
          <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
            <boxGeometry args={[width, 0.22, depth]} />
            <primitive object={wood} attach="material" />
          </mesh>
          <RoundedBlock args={[width * 0.92, 0.16, depth * 0.82]} position={[0, 0.27, 0.03]} material={accent} />
          <RoundedBlock args={[width * 0.96, 0.46, depth * 0.1]} position={[0, 0.48, -depth * 0.44]} material={upholstery} />
        </>
      )}
    </group>
  );
}

function RoundedBlock({
  args,
  position,
  material,
}: {
  args: [number, number, number];
  position: [number, number, number];
  material: THREE.Material;
}) {
  return (
    <mesh castShadow receiveShadow position={position} material={material} scale={args}>
      <sphereGeometry args={[0.5, 32, 22]} />
    </mesh>
  );
}

function lightenColor(hex: string, amount: number) {
  const color = new THREE.Color(hex);
  color.lerp(new THREE.Color("#ffffff"), amount);
  return `#${color.getHexString()}`;
}
