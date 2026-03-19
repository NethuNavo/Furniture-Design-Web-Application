"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { PlannerItem } from "@/lib/plannerUtils";

type ThreeRoomPreviewProps = {
  roomWidth: number;
  roomHeight: number;
  wallColor: string;
  floorColor: string;
  items: PlannerItem[];
  className?: string;
};

export function ThreeRoomPreview({
  roomWidth,
  roomHeight,
  wallColor,
  floorColor,
  items,
  className,
}: ThreeRoomPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f8f3ec");

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(8, 7.5, 9);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 18;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(0, 0.7, 0);

    const ambientLight = new THREE.AmbientLight("#fff8f0", 2.1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("#fff4e8", 2.6);
    directionalLight.position.set(7, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight("#fff8f2", 1.2);
    fillLight.position.set(-5, 6, -4);
    scene.add(fillLight);

    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    const roomWidthUnits = Math.max(roomWidth / 100, 3.2);
    const roomDepthUnits = Math.max(roomHeight / 100, 2.8);
    const wallHeightUnits = 2.6;
    const wallThickness = 0.12;

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(roomWidthUnits, 0.08, roomDepthUnits),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(floorColor),
        roughness: 0.82,
        metalness: 0.02,
      }),
    );
    floor.position.set(0, -0.04, 0);
    floor.receiveShadow = true;
    roomGroup.add(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(wallColor),
      roughness: 0.92,
      metalness: 0.02,
    });

    const walls = [
      new THREE.Mesh(
        new THREE.BoxGeometry(roomWidthUnits, wallHeightUnits, wallThickness),
        wallMaterial,
      ),
      new THREE.Mesh(
        new THREE.BoxGeometry(wallThickness, wallHeightUnits, roomDepthUnits),
        wallMaterial,
      ),
    ];

    walls[0].position.set(0, wallHeightUnits / 2, -roomDepthUnits / 2);
    walls[1].position.set(-roomWidthUnits / 2, wallHeightUnits / 2, 0);

    walls.forEach((wall) => {
      wall.receiveShadow = true;
      roomGroup.add(wall);
    });

    const trimMaterial = new THREE.MeshStandardMaterial({
      color: "#6f726f",
      roughness: 0.9,
      metalness: 0.06,
    });

    const trimThickness = 0.06;
    const trimHeight = 0.08;

    const backTrim = new THREE.Mesh(
      new THREE.BoxGeometry(roomWidthUnits, trimHeight, trimThickness),
      trimMaterial,
    );
    backTrim.position.set(0, trimHeight / 2, -roomDepthUnits / 2);
    backTrim.receiveShadow = true;
    roomGroup.add(backTrim);

    const frontTrim = new THREE.Mesh(
      new THREE.BoxGeometry(roomWidthUnits, trimHeight, trimThickness),
      trimMaterial,
    );
    frontTrim.position.set(0, trimHeight / 2, roomDepthUnits / 2);
    frontTrim.receiveShadow = true;
    roomGroup.add(frontTrim);

    const leftTrim = new THREE.Mesh(
      new THREE.BoxGeometry(trimThickness, trimHeight, roomDepthUnits),
      trimMaterial,
    );
    leftTrim.position.set(-roomWidthUnits / 2, trimHeight / 2, 0);
    leftTrim.receiveShadow = true;
    roomGroup.add(leftTrim);

    const rightTrim = new THREE.Mesh(
      new THREE.BoxGeometry(trimThickness, trimHeight, roomDepthUnits),
      trimMaterial,
    );
    rightTrim.position.set(roomWidthUnits / 2, trimHeight / 2, 0);
    rightTrim.receiveShadow = true;
    roomGroup.add(rightTrim);

    items.forEach((item) => {
      const itemWidthUnits = Math.max(item.width / 100, 0.35);
      const itemDepthUnits = Math.max(item.height / 100, 0.35);

      const itemGroup = buildFurnitureMesh(
        item,
        wallColor,
        floorColor,
        itemWidthUnits,
        itemDepthUnits,
      );

      itemGroup.position.set(
        item.x / 100 - roomWidthUnits / 2 + itemWidthUnits / 2,
        0,
        item.y / 100 - roomDepthUnits / 2 + itemDepthUnits / 2,
      );

      roomGroup.add(itemGroup);
    });

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId = 0;
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      controls.dispose();
      renderer.dispose();

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [floorColor, items, roomHeight, roomWidth, wallColor]);

  return (
    <div
      ref={containerRef}
      className={className ?? "h-full min-h-[420px] w-full"}
    />
  );
}

function getItemHeight(type: PlannerItem["type"]) {
  switch (type) {
    case "sofa":
    case "sectional-sofa":
      return 0.9;
    case "armchair":
    case "accent-chair":
      return 0.85;
    case "coffee-table":
    case "side-table":
      return 0.45;
    case "dining-table":
      return 0.8;
    case "storage-shelf":
    case "cabinet":
    case "tv-console":
      return 1.35;
    case "floor-lamp":
      return 1.6;
    case "bed":
      return 0.65;
    default:
      return 0.8;
  }
}

function buildFurnitureMesh(
  item: PlannerItem,
  wallColor: string,
  floorColor: string,
  width: number,
  depth: number,
) {
  const group = new THREE.Group();

  const upholstery = new THREE.MeshStandardMaterial({
    color: new THREE.Color(item.color),
    roughness: 0.95,
    metalness: 0.02,
  });

  const lightAccent = new THREE.MeshStandardMaterial({
    color: new THREE.Color(lightenColor(item.color, 0.18)),
    roughness: 0.96,
    metalness: 0.02,
  });

  const wood = new THREE.MeshStandardMaterial({
    color: new THREE.Color("#8b6545"),
    roughness: 0.85,
    metalness: 0.05,
  });

  const neutral = new THREE.MeshStandardMaterial({
    color: new THREE.Color(lightenColor(floorColor, 0.02)),
    roughness: 0.92,
    metalness: 0.02,
  });

  const shade = new THREE.MeshStandardMaterial({
    color: new THREE.Color(lightenColor(wallColor, 0.05)),
    roughness: 0.97,
    metalness: 0.01,
  });

  if (item.type === "sofa" || item.type === "sectional-sofa") {
    addSoftBlock(group, width * 1.02, 0.34, depth * 0.96, 0, 0.08, 0.04, upholstery);
    addSoftBlock(group, width * 0.98, 0.42, depth * 0.8, 0, 0.24, 0.08, upholstery);
    addSoftBlock(group, width * 0.9, 0.32, depth * 0.42, 0, 0.48, -depth * 0.12, upholstery);
    addSoftBlock(group, width * 0.28, 0.42, depth * 0.68, -width * 0.38, 0.28, 0.02, upholstery);
    addSoftBlock(group, width * 0.28, 0.42, depth * 0.68, width * 0.38, 0.28, 0.02, upholstery);
    addSoftBlock(group, width * 0.24, 0.15, depth * 0.18, -width * 0.15, 0.39, -depth * 0.02, lightAccent);
    addSoftBlock(group, width * 0.24, 0.15, depth * 0.18, width * 0.12, 0.39, -depth * 0.01, lightAccent);
    addSoftBlock(group, width * 0.18, 0.12, depth * 0.14, width * 0.3, 0.4, 0.06, lightAccent);
    return group;
  }

  if (item.type === "armchair" || item.type === "accent-chair") {
    addSoftBlock(group, width * 0.8, 0.46, depth * 0.74, 0, 0.22, 0.01, upholstery);
    addSoftBlock(group, width * 0.74, 0.5, depth * 0.18, 0, 0.55, -depth * 0.24, upholstery);
    addSoftBlock(group, width * 0.18, 0.44, depth * 0.64, -width * 0.31, 0.26, 0, upholstery);
    addSoftBlock(group, width * 0.18, 0.44, depth * 0.64, width * 0.31, 0.26, 0, upholstery);
    addSoftBlock(group, width * 0.34, 0.13, depth * 0.22, 0, 0.4, -depth * 0.02, lightAccent);
    return group;
  }

  if (item.type === "bed") {
    addBox(group, width, 0.26, depth, 0, 0.13, 0, neutral);
    addBox(group, width * 0.9, 0.18, depth * 0.78, 0, 0.34, 0.03, lightAccent);
    addBox(group, width * 0.94, 0.55, depth * 0.08, 0, 0.52, -depth * 0.46, upholstery);
    return group;
  }

  if (
    item.type === "coffee-table" ||
    item.type === "side-table" ||
    item.type === "dining-table"
  ) {
    const topHeight = item.type === "coffee-table" ? 0.08 : 0.1;
    const legHeight = item.type === "coffee-table" ? 0.28 : 0.62;

    addBox(group, width, topHeight, depth, 0, legHeight + topHeight / 2, 0, wood);

    const legOffsetX = width * 0.38;
    const legOffsetZ = depth * 0.38;

    addBox(group, 0.08, legHeight, 0.08, -legOffsetX, legHeight / 2, -legOffsetZ, wood);
    addBox(group, 0.08, legHeight, 0.08, legOffsetX, legHeight / 2, -legOffsetZ, wood);
    addBox(group, 0.08, legHeight, 0.08, -legOffsetX, legHeight / 2, legOffsetZ, wood);
    addBox(group, 0.08, legHeight, 0.08, legOffsetX, legHeight / 2, legOffsetZ, wood);

    return group;
  }

  if (
    item.type === "cabinet" ||
    item.type === "storage-shelf" ||
    item.type === "tv-console"
  ) {
    addBox(
      group,
      width,
      item.type === "tv-console" ? 0.7 : 1.2,
      depth,
      0,
      item.type === "tv-console" ? 0.35 : 0.6,
      0,
      wood,
    );
    return group;
  }

  if (item.type === "floor-lamp") {
    addBox(group, 0.14, 1.25, 0.14, 0, 0.63, 0, wood);
    addBox(group, 0.5, 0.35, 0.5, 0, 1.42, 0, shade);
    return group;
  }

  addBox(
    group,
    width,
    getItemHeight(item.type),
    depth,
    0,
    getItemHeight(item.type) / 2,
    0,
    upholstery,
  );

  return group;
}

function addBox(
  group: THREE.Group,
  width: number,
  height: number,
  depth: number,
  x: number,
  y: number,
  z: number,
  material: THREE.Material,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
}

function addSoftBlock(
  group: THREE.Group,
  width: number,
  height: number,
  depth: number,
  x: number,
  y: number,
  z: number,
  material: THREE.Material,
) {
  const geometry = new THREE.SphereGeometry(0.5, 28, 20);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(width, height, depth);
  mesh.position.set(x, y + height / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
}

function lightenColor(hex: string, amount: number) {
  const color = new THREE.Color(hex);
  color.lerp(new THREE.Color("#ffffff"), amount);
  return `#${color.getHexString()}`;
}