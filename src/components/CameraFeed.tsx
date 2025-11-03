"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";

interface StreamStats {
  fps: number;
  frame_count: number;
  uptime: number;
  camera_active: boolean;
}

export default function CameraFeed() {
  const [stats, setStats] = useState<StreamStats | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://live-camera.traysonkelii.com/api/stats');
        const data = await response.json();
        setStats(data);
        setIsOnline(data.camera_active);
      } catch (error) {
        setIsOnline(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <CameraCard>
      <CameraHeader>
        <HeaderLeft>
          <CameraIcon>📹</CameraIcon>
          <HeaderText>
            <CameraTitle>Live Camera</CameraTitle>
            <CameraSubtitle>Real-time streaming</CameraSubtitle>
          </HeaderText>
        </HeaderLeft>
        <StatusBadge $isOnline={isOnline}>
          <StatusDot $isOnline={isOnline} />
          {isOnline ? 'LIVE' : 'Offline'}
        </StatusBadge>
      </CameraHeader>

      <ImageContainer>
        <CameraImage
          src="https://live-camera.traysonkelii.com/video_feed"
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
        {stats && (
          <>
            <FooterInfo>
              <InfoLabel>FPS:</InfoLabel>
              <InfoValue>{stats.fps.toFixed(1)}</InfoValue>
            </FooterInfo>
            <FooterInfo>
              <InfoLabel>Frames:</InfoLabel>
              <InfoValue>{stats.frame_count.toLocaleString()}</InfoValue>
            </FooterInfo>
            <FooterInfo>
              <InfoLabel>Uptime:</InfoLabel>
              <InfoValue>{Math.floor(stats.uptime / 60)}m</InfoValue>
            </FooterInfo>
          </>
        )}
      </CameraFooter>
    </CameraCard>
  );
}

// ... (keep all the same styled components from before)

const CameraCard = styled.div`
  background: rgba(30, 30, 30, 0.6);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
    inset 0 0 0 1px rgba(192, 192, 192, 0.2);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 30px 80px rgba(192, 192, 192, 0.2),
      inset 0 0 0 1px rgba(192, 192, 192, 0.3);
  }
`;

const CameraHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(20, 20, 20, 0.8);
  border-bottom: 1px solid rgba(192, 192, 192, 0.1);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CameraIcon = styled.div`
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(192, 192, 192, 0.3));
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CameraTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #e0e0e0;
  margin: 0;
`;

const CameraSubtitle = styled.p`
  font-size: 0.85rem;
  color: #909090;
  margin: 0;
`;

const StatusBadge = styled.div<{ $isOnline: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${(props) =>
    props.$isOnline
      ? "rgba(200, 200, 200, 0.15)"
      : "rgba(100, 100, 100, 0.15)"};
  color: ${(props) => (props.$isOnline ? "#d0d0d0" : "#808080")};
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
`;

const StatusDot = styled.div<{ $isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => (props.$isOnline ? "#c0c0c0" : "#606060")};
  animation: ${(props) =>
    props.$isOnline ? "pulse 2s ease-in-out infinite" : "none"};
  box-shadow: ${(props) =>
    props.$isOnline ? "0 0 8px rgba(192, 192, 192, 0.8)" : "none"};

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
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
`;

const OfflineText = styled.p`
  color: #808080;
  font-size: 1.25rem;
  font-weight: 600;
`;

const CameraFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: rgba(20, 20, 20, 0.8);
  border-top: 1px solid rgba(192, 192, 192, 0.1);
`;

const FooterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  color: #909090;
  font-size: 0.85rem;
  font-weight: 400;
`;

const InfoValue = styled.span`
  color: #c0c0c0;
  font-size: 0.85rem;
  font-weight: 600;
`;
