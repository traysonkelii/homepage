"use client";
import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";

const VPS_HOST = "humming.traysonkelii.com";
const HEARTBEAT_API = `https://${VPS_HOST}`;
const STREAM_URL = `https://${VPS_HOST}/hummingbird/whep`;

export default function CameraFeed() {
  const [isLive, setIsLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  // 1. HEARTBEAT (Keep the stream alive)
  useEffect(() => {
    const pingServer = async () => {
      try {
        await fetch(`${HEARTBEAT_API}/ping`, { method: "POST" });
        setIsLive(true);
      } catch (e) {
        console.warn("Heartbeat failed", e);
        setIsLive(false);
      }
    };
    pingServer();
    const interval = setInterval(pingServer, 2000);
    return () => clearInterval(interval);
  }, []);

  // 2. VIDEO PLAYER (WHEP Logic)
  useEffect(() => {
    if (!isLive || !videoRef.current) return;

    const startStream = async () => {
      // Clean up old connection
      if (peerConnection.current) peerConnection.current.close();

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnection.current = pc;

      // Add a receive-only transceiver
      pc.addTransceiver("video", { direction: "recvonly" });
      pc.addTransceiver("audio", { direction: "recvonly" });

      // When tracks arrive, attach to video element
      pc.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      // Create Offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send to Server (WHEP)
      try {
        const response = await fetch(STREAM_URL, {
          method: "POST",
          body: offer.sdp,
          headers: {
            "Content-Type": "application/sdp",
          },
        });

        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const answerSdp = await response.text();
        await pc.setRemoteDescription(
          new RTCSessionDescription({ type: "answer", sdp: answerSdp })
        );
      } catch (err) {
        console.error("Stream connection failed:", err);
      }
    };

    startStream();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
    };
  }, [isLive]);

  return (
    <CameraCard>
      <Header>
        <Title>Hummingbird Nest</Title>
        <StatusBadge $active={isLive}>
          {isLive ? (
            <>
              <LiveDot /> LIVE
            </>
          ) : (
            "OFFLINE"
          )}
        </StatusBadge>
      </Header>

      <VideoContainer>
        {isLive ? (
          <StyledVideo
            ref={videoRef}
            autoPlay
            muted
            playsInline
            controls
          />
        ) : (
          <OfflineMessage>
            <Spinner />
            <p>Waking up camera...</p>
          </OfflineMessage>
        )}
      </VideoContainer>
    </CameraCard>
  );
}

// --- STYLES ---

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  object-fit: contain;
`;

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
  font-family: "Inter", sans-serif;
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
`;

const StatusBadge = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  background: ${(props) =>
    props.$active ? "rgba(255, 59, 48, 0.15)" : "rgba(255, 255, 255, 0.1)"};
  color: ${(props) => (props.$active ? "#ff3b30" : "#888")};
  font-size: 0.75rem;
  font-weight: 700;
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