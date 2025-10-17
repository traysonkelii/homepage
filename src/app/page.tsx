"use client";
import MyCube from "@/components/MyCube";
import CameraFeed from "@/components/CameraFeed";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import styled from "styled-components";

export default function Home() {
  return (
    <PageContainer>
      <GradientBackground />

      <ContentWrapper>
        <HeroSection>
          <Title>TRAYSON KELII</Title>
          <Subtitle>Developer • Creator • Innovator</Subtitle>
        </HeroSection>

        <MainContent>
          <CanvasSection>
            <CanvasCard>
              <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <spotLight
                  position={[10, 10, 10]}
                  angle={0.15}
                  penumbra={1}
                  intensity={1}
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <MyCube position={[0, 0, 0]} scale={[2, 2, 2]} />
                <OrbitControls enableZoom={false} />
              </Canvas>
            </CanvasCard>
            <CanvasLabel>Interactive 3D • Drag to rotate</CanvasLabel>
          </CanvasSection>

          <CameraSection>
            <CameraFeed />
          </CameraSection>
        </MainContent>
      </ContentWrapper>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
`;

const GradientBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  z-index: -1;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
        circle at 20% 50%,
        rgba(120, 119, 198, 0.3) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(102, 126, 234, 0.3) 0%,
        transparent 50%
      );
    animation: gradientShift 15s ease infinite;
  }

  @keyframes gradientShift {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1;
`;

const HeroSection = styled.div`
  text-align: center;
  padding: 4rem 0 3rem;
  animation: fadeInDown 1s ease;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
  text-shadow: 0 0 80px rgba(102, 126, 234, 0.5);
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: #a0aec0;
  margin: 1rem 0 0;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CanvasSection = styled.div`
  animation: fadeInLeft 1s ease 0.2s both;

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const CanvasCard = styled.div`
  width: 100%;
  height: 500px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 80px rgba(102, 126, 234, 0.4),
      inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  canvas {
    display: block;
  }
`;

const CanvasLabel = styled.p`
  text-align: center;
  color: #718096;
  font-size: 0.9rem;
  margin-top: 1rem;
  font-weight: 300;
  letter-spacing: 0.05em;
`;

const CameraSection = styled.div`
  animation: fadeInRight 1s ease 0.4s both;

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
