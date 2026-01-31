"use client";
import { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";

const CAMERA_API_BASE = 'https://live-camera.traysonkelii.com';

interface StreamStats {
  fps: number;
  frame_count: number;
  camera_active: boolean;
  streaming_allowed: boolean;
  current_window: string | null;
  next_window: {
    name: string;
    time: string;
    duration: number;
  } | null;
  latest_video: string | null;
  recording: boolean;
}

export default function CameraFeed() {
  const [stats, setStats] = useState<StreamStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Poll for stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${CAMERA_API_BASE}/api/stats`);
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, []);

  const isLive = stats?.streaming_allowed || false;
  
  const formatNextTime = (isoTime: string) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <CameraCard>
      <Header>
        <Title>Hummingbird Nest</Title>
        <StatusBadge $isLive={isLive}>
          {isLive ? (
            <>
              <LiveDot />
              LIVE FEED
            </>
          ) : (
            <>
              <MoonIcon>🌙</MoonIcon>
              SLEEPING
            </>
          )}
        </StatusBadge>
      </Header>

      <VideoContainer>
        {loading ? (
          <OfflineMessage>
            <p>Connecting to Nest...</p>
          </OfflineMessage>
        ) : isLive ? (
          // --- LIVE VIEW ---
          <>
             {/* Use a cache buster to ensure the image refreshes if connection drops */}
            <LiveStream
              src={`${CAMERA_API_BASE}/video_feed`}
              alt="Live Stream"
              onError={(e) => {
                 // Simple retry logic if stream breaks
                 const target = e.target as HTMLImageElement;
                 setTimeout(() => {
                    target.src = `${CAMERA_API_BASE}/video_feed?t=${Date.now()}`;
                 }, 1000);
              }}
            />
            {stats && (
              <OverlayStats>
                FPS: {stats.fps}
                {stats.recording && <RecTag>● REC</RecTag>}
              </OverlayStats>
            )}
          </>
        ) : (
          // --- NIGHT / SLEEPING VIEW ---
          <NightModeOverlay>
            <SleepAnimation>
              <BirdWrapper>🐦</BirdWrapper>
              <ZzzWrapper>
                <Zzz $delay="0s">z</Zzz>
                <Zzz $delay="1s">z</Zzz>
                <Zzz $delay="2s">z</Zzz>
              </ZzzWrapper>
            </SleepAnimation>
            <NightTitle>Shhh... The birds are sleeping.</NightTitle>
            <NightSubText>
              Camera is in night mode to not disturb the nest.
            </NightSubText>
            
            {stats?.next_window && (
              <NextWindowPill>
                Next Stream: {formatNextTime(stats.next_window.time)}
              </NextWindowPill>
            )}
          </NightModeOverlay>
        )}
      </VideoContainer>
    </CameraCard>
  );
}

// --- ANIMATIONS ---

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
`;

const zzzFloat = keyframes`
  0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translate(20px, -30px) scale(1.2); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

// --- STYLED COMPONENTS ---

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

const StatusBadge = styled.div<{ $isLive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  background: ${props => props.$isLive 
    ? 'rgba(255, 59, 48, 0.15)' 
    : 'rgba(94, 92, 230, 0.15)'};
  color: ${props => props.$isLive ? '#ff3b30' : '#5e5ce6'};
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

const MoonIcon = styled.span`
  font-size: 0.9em;
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

// --- NIGHT MODE STYLES ---

const NightModeOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #0a0a12 0%, #1a1a2e 100%);
  color: #e0e0ff;
  text-align: center;
  padding: 2rem;
`;

const SleepAnimation = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const BirdWrapper = styled.div`
  font-size: 4rem;
  animation: ${float} 4s ease-in-out infinite;
  filter: drop-shadow(0 10px 10px rgba(0,0,0,0.5));
`;

const ZzzWrapper = styled.div`
  position: absolute;
  top: -10px;
  right: -20px;
  width: 40px;
  height: 40px;
`;

const Zzz = styled.span<{ $delay: string }>`
  position: absolute;
  font-weight: bold;
  font-size: 1.2rem;
  color: #8e8eff;
  opacity: 0;
  animation: ${zzzFloat} 3s ease-in infinite;
  animation-delay: ${props => props.$delay};
`;

const NightTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
  color: #fff;
`;

const NightSubText = styled.p`
  font-size: 0.9rem;
  color: #8888aa;
  margin: 0 0 2rem 0;
`;

const NextWindowPill = styled.div`
  background: rgba(255, 255, 255, 0.1);
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-size: 0.85rem;
  color: #b0b0d0;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const OfflineMessage = styled.div`
  color: #666;
  font-size: 0.9rem;
`;