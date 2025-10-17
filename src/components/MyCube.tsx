import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, ThreeElements, useThree } from "@react-three/fiber";

function MyCube(props: ThreeElements["group"]) {
  const groupRef = useRef<THREE.Group>(null!);
  const { viewport } = useThree();

  // Mouse interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [previousMousePosition, setPreviousMousePosition] = useState({
    x: 0,
    y: 0,
  });
  const rotationVelocity = useRef({ x: 0, y: 0 });

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
    if (!isDragging) {
      // Auto-rotation when not dragging
      groupRef.current.rotation.x += delta * 0.3 + rotationVelocity.current.x;
      groupRef.current.rotation.y += delta * 0.5 + rotationVelocity.current.y;

      // Damping - slow down velocity over time
      rotationVelocity.current.x *= 0.95;
      rotationVelocity.current.y *= 0.95;
    }

    // Floating animation
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3;
  });

  const handlePointerDown = (e: any) => {
    setIsDragging(true);
    setPreviousMousePosition({ x: e.clientX, y: e.clientY });
    e.stopPropagation();
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: any) => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Update rotation based on mouse movement
      groupRef.current.rotation.y += deltaX * 0.01;
      groupRef.current.rotation.x += deltaY * 0.01;

      // Set velocity for momentum effect
      rotationVelocity.current.x = deltaY * 0.01;
      rotationVelocity.current.y = deltaX * 0.01;

      setPreviousMousePosition({ x: e.clientX, y: e.clientY });
      e.stopPropagation();
    }
  };

  // Create a single cubie
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
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.32, 0.32, 0.32)]} />
          <lineBasicMaterial color="#000000" linewidth={3} />
        </lineSegments>
      </group>
    );
  };

  // Generate all 27 cubies
  const renderCubies = () => {
    const cubies = [];
    const positions = [-0.34, 0, 0.34];

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const position: [number, number, number] = [
            positions[x],
            positions[y],
            positions[z],
          ];

          const faceColors = [
            x === 2 ? colors.red : "#1a1a1a",
            x === 0 ? colors.orange : "#1a1a1a",
            y === 2 ? colors.white : "#1a1a1a",
            y === 0 ? colors.yellow : "#1a1a1a",
            z === 2 ? colors.green : "#1a1a1a",
            z === 0 ? colors.blue : "#1a1a1a",
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
    <group
      {...props}
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      {renderCubies()}

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
