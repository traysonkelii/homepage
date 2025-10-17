"use client";
import MyCube from "@/components/MyCube";
import { Canvas } from "@react-three/fiber";
import styled from "styled-components";

export default function Home() {
  return (
    <Holder>
      <h1>TRAYSON KELII</h1>
      <h3>Coming Soon</h3>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <MyCube position={[0, 0, 0]} scale={[3, 3, 3]} />
      </Canvas>
    </Holder>
  );
}

const Holder = styled.div`
  text-align: center;
  background-color: white;
  color: black;
  margin-top: 20%;
`;
