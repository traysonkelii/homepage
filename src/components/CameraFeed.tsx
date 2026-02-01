"use client";
import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const CAMERA_API_BASE = 'https://live-camera.traysonkelii.com';

interface StreamStats {
  fps: number;
  camera_active: boolean;
  recording: boolean;
}

export default function CameraFeed() {
  const [stats, setStats] = useState<StreamStats | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // Poll for stats to check connectivity and recording status
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${CAMERA_API_BASE}/api/stats`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          setIsOffline(false);
        } else {
          setIsOffline(true);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setIsOffline(true);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <CameraCard>
      <Header>
        <Title>Hummingbird Nest</Title>
        <StatusBadge $active={!isOffline}>
          {!isOffline ? (
            <>
              <LiveDot />
              LIVE
            </>
          ) : (
            <>OFFLINE</>
          )}
        </StatusBadge>
      </Header>

      <VideoContainer>
        {!isOffline ? (
          <>
            <LiveStream
              src={`${CAMERA_API_BASE}/video_feed`}
              alt="Live Stream"
              onError={(e) => {
                 // Retry logic: reload image if stream drops
                 const target = e.target as HTMLImageElement;
                 setTimeout(() => {
                    target.src = `${CAMERA_API_BASE}/video_feed?t=${Date.now()}`;
                 }, 1000);
              }}
            />
            {stats && (
              <OverlayStats>
                {stats.recording && <RecTag>● REC</RecTag>}
              </OverlayStats>
            )}
          </>
        ) : (
          <OfflineMessage>
            <Spinner />
            <p>Connecting to Nest...</p>
          </OfflineMessage>
        )}
      </VideoContainer>
    </CameraCard>
  );
}

// --- STYLED COMPONENTS ---

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CameraCard = styled.div`
  background: #111;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6),
              inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  background: rgba(20, 20, 20, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Title = styled.h2`
  color: #fff;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

const StatusBadge = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  background: ${props => props.$active 
    ? 'rgba(255, 59, 48, 0.15)' 
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#ff3b30' : '#888'};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
`;

const LiveDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LiveStream = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const OverlayStats = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  color: #fff;
  font-size: 0.7rem;
  font-family: monospace;
  pointer-events: none;
  display: flex;
  gap: 8px;
`;

const RecTag = styled.span`
  color: #ff3b30;
  font-weight: bold;
`;

const OfflineMessage = styled.div`
  color: #666;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #ff3b30;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;