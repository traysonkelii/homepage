import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, ThreeElements } from "@react-three/fiber";

function MyCube(props: ThreeElements["group"]) {
  const groupRef = useRef<THREE.Group>(null!);

  // Rubik's cube standard colors
  const colors = {
    white: "#ffffff",
    yellow: "#ffd500",
    red: "#c41e3a",
    orange: "#ff5800",
    green: "#009e60",
    blue: "#0051ba",
  };

  useFrame((state, delta) => {
    groupRef.current.rotation.x += delta * 0.3;
    groupRef.current.rotation.y += delta * 0.5;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3;
  });

  // Create a single cubie (small cube)
  const Cubie = ({
    position,
    faceColors,
  }: {
    position: [number, number, number];
    faceColors: string[];
  }) => {
    const materials = faceColors.map(
      (color) =>
        new THREE.MeshStandardMaterial({
          color: color,
          metalness: 0.2,
          roughness: 0.3,
        })
    );

    return (
      <group position={position}>
        <mesh>
          <boxGeometry args={[0.32, 0.32, 0.32]} />
          <primitive object={materials} attach="material" />
        </mesh>
        {/* Black edges */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.32, 0.32, 0.32)]} />
          <lineBasicMaterial color="#000000" linewidth={3} />
        </lineSegments>
      </group>
    );
  };

  // Generate all 27 cubies (3x3x3)
  const renderCubies = () => {
    const cubies = [];
    const positions = [-0.34, 0, 0.34]; // Positions for 3x3x3 grid

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const position: [number, number, number] = [
            positions[x],
            positions[y],
            positions[z],
          ];

          // Determine face colors based on position
          // [right, left, top, bottom, front, back]
          const faceColors = [
            x === 2 ? colors.red : "#1a1a1a", // Right face
            x === 0 ? colors.orange : "#1a1a1a", // Left face
            y === 2 ? colors.white : "#1a1a1a", // Top face
            y === 0 ? colors.yellow : "#1a1a1a", // Bottom face
            z === 2 ? colors.green : "#1a1a1a", // Front face
            z === 0 ? colors.blue : "#1a1a1a", // Back face
          ];

          cubies.push(
            <Cubie
              key={`${x}-${y}-${z}`}
              position={position}
              faceColors={faceColors}
            />
          );
        }
      }
    }

    return cubies;
  };

  return (
    <group {...props} ref={groupRef}>
      {renderCubies()}

      {/* Subtle outer glow */}
      <mesh scale={1.15}>
        <boxGeometry args={[1.1, 1.1, 1.1]} />
        <meshBasicMaterial
          color="#c0c0c0"
          transparent={true}
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

export default MyCube;
