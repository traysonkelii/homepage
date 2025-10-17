"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";

interface CameraMetadata {
  last_modified: number;
  size_kb: number;
}

export default function CameraFeed() {
  const [metadata, setMetadata] = useState<CameraMetadata | null>(null);
  const [imageKey, setImageKey] = useState(Date.now());
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(
          "https://live-camera.traysonkelii.com/camera.json"
        );
        const data = await response.json();
        setMetadata(data);
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    // Initial fetch
    fetchMetadata();

    // Refresh image every 5 seconds
    const imageInterval = setInterval(() => {
      setImageKey(Date.now());
    }, 5000);

    // Fetch metadata every 2 seconds
    const metadataInterval = setInterval(fetchMetadata, 2000);

    return () => {
      clearInterval(imageInterval);
      clearInterval(metadataInterval);
    };
  }, []);

  const getTimeAgo = () => {
    if (!metadata) return "Loading...";

    const lastMod = new Date(metadata.last_modified * 1000);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - lastMod.getTime()) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <CameraCard>
      <CameraHeader>
        <HeaderLeft>
          <CameraIcon>📸</CameraIcon>
          <HeaderText>
            <CameraTitle>Live Camera</CameraTitle>
            <CameraSubtitle>Updates every 15 seconds</CameraSubtitle>
          </HeaderText>
        </HeaderLeft>
        <StatusBadge $isOnline={isOnline}>
          <StatusDot $isOnline={isOnline} />
          {isOnline ? "Online" : "Offline"}
        </StatusBadge>
      </CameraHeader>

      <ImageContainer>
        <CameraImage
          src={`https://live-camera.traysonkelii.com/camera.jpg?t=${imageKey}`}
          alt="Live Camera Feed"
          onError={() => setIsOnline(false)}
          onLoad={() => setIsOnline(true)}
        />
        {!isOnline && (
          <OfflineOverlay>
            <OfflineText>📡 Camera Offline</OfflineText>
          </OfflineOverlay>
        )}
      </ImageContainer>

      <CameraFooter>
        <FooterInfo>
          <InfoLabel>Last Update:</InfoLabel>
          <InfoValue>{getTimeAgo()}</InfoValue>
        </FooterInfo>
        {metadata && (
          <FooterInfo>
            <InfoLabel>Size:</InfoLabel>
            <InfoValue>{metadata.size_kb.toFixed(1)} KB</InfoValue>
          </FooterInfo>
        )}
      </CameraFooter>
    </CameraCard>
  );
}

const CameraCard = styled.div`
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
`;

const CameraHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CameraIcon = styled.div`
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5));
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CameraTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
`;

const CameraSubtitle = styled.p`
  font-size: 0.85rem;
  color: #718096;
  margin: 0;
`;

const StatusBadge = styled.div<{ $isOnline: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${(props) =>
    props.$isOnline ? "rgba(72, 187, 120, 0.15)" : "rgba(245, 101, 101, 0.15)"};
  color: ${(props) => (props.$isOnline ? "#68d391" : "#fc8181")};
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const StatusDot = styled.div<{ $isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.$isOnline ? "#68d391" : "#fc8181")};
  animation: ${(props) =>
    props.$isOnline ? "pulse 2s ease-in-out infinite" : "none"};

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
`;

const CameraImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const OfflineOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
`;

const OfflineText = styled.p`
  color: #fc8181;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CameraFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const FooterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  color: #718096;
  font-size: 0.85rem;
  font-weight: 400;
`;

const InfoValue = styled.span`
  color: #a78bfa;
  font-size: 0.85rem;
  font-weight: 600;
`;
