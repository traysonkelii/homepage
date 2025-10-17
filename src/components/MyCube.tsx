import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame, ThreeElements } from "@react-three/fiber";

function MyCube(props: ThreeElements["mesh"]) {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    // Smooth rotation
    mesh.current.rotation.x += delta * 0.3;
    mesh.current.rotation.y += delta * 0.5;

    // Subtle floating animation
    mesh.current.position.y = Math.sin(state.clock.elapsedTime) * 0.3;
  });

  return (
    <mesh {...props} ref={mesh}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#667eea"
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      >
        {/* Add wireframe overlay for cool effect */}
      </meshStandardMaterial>

      {/* Wireframe overlay */}
      <mesh>
        <boxGeometry args={[1.01, 1.01, 1.01]} />
        <meshBasicMaterial
          color="#a78bfa"
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* Glow effect */}
      <mesh scale={1.15}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color="#667eea"
          transparent={true}
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  );
}

export default MyCube;
