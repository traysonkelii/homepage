"use client";
import { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";

// CONFIG
const VPS_HOST = "humming.traysonkelii.com";
const HEARTBEAT_API = `https://${VPS_HOST}`;
const STREAM_URL = `https://${VPS_HOST}/hummingbird/whep`;

type StreamState = "offline" | "ready" | "connecting" | "live" | "error";

export default function CameraFeed() {
  const [streamState, setStreamState] = useState<StreamState>("offline");
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  // 1. HEARTBEAT (The "Doorbell")
  // Checks if the VPS is reachable. If yes, we move to 'ready'.
  useEffect(() => {
    const pingServer = async () => {
      try {
        const res = await fetch(`${HEARTBEAT_API}/ping`, { method: "POST" });
        if (res.ok) {
          setStreamState((prev) => (prev === "offline" ? "ready" : prev));
        } else {
          setStreamState("offline");
        }
      } catch (e) {
        setStreamState("offline");
      }
    };

    // Ping immediately, then every 2s
    pingServer();
    const interval = setInterval(pingServer, 2000);
    return () => clearInterval(interval);
  }, []);

  // 2. START STREAM (Triggered by Button)
  const startStream = async () => {
    setStreamState("connecting");

    // Cleanup old connection if exists
    if (peerConnection.current) peerConnection.current.close();

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnection.current = pc;

    // Connect audio/video
    pc.addTransceiver("video", { direction: "recvonly" });
    pc.addTransceiver("audio", { direction: "recvonly" });

    // When stream arrives, attach to video tag
    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
        // Wait for the video to actually have data before showing "Live"
        videoRef.current.onplaying = () => setStreamState("live");
      }
    };

    try {
      // Create Offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send to Server (WHEP)
      const response = await fetch(STREAM_URL, {
        method: "POST",
        body: offer.sdp,
        headers: { "Content-Type": "application/sdp" },
      });

      if (!response.ok) throw new Error("Stream handshake failed");

      const answerSdp = await response.text();
      await pc.setRemoteDescription(
        new RTCSessionDescription({ type: "answer", sdp: answerSdp })
      );
    } catch (err) {
      console.error("Connection failed:", err);
      setStreamState("error");
      // Clean up
      pc.close();
    }
  };

  return (
    <CameraCard>
      <Header>
        <Title>Hummingbird Nest</Title>
        <StatusBadge $status={streamState}>
          <StatusDot $status={streamState} />
          {streamState === "live"
            ? "LIVE FEED"
            : streamState === "offline"
            ? "OFFLINE"
            : "STANDBY"}
        </StatusBadge>
      </Header>

      <VideoContainer>
        {/* The Video Player (Hidden until live to avoid black box) */}
        <StyledVideo
          ref={videoRef}
          autoPlay
          muted
          playsInline
          controls
          $visible={streamState === "live"}
        />

        {/* --- OVERLAYS --- */}

        {/* 1. OFFLINE STATE */}
        {streamState === "offline" && (
          <Overlay>
            <Spinner />
            <StatusText>Waking up camera...</StatusText>
          </Overlay>
        )}

        {/* 2. READY STATE (Click to Play) */}
        {streamState === "ready" && (
          <Overlay>
            <PlayButton onClick={startStream}>
              <PlayIcon />
              Watch Live
            </PlayButton>
            <StatusText>Camera is ready</StatusText>
          </Overlay>
        )}

        {/* 3. CONNECTING STATE */}
        {streamState === "connecting" && (
          <Overlay>
            <Spinner />
            <StatusText>Establishing secure connection...</StatusText>
          </Overlay>
        )}

        {/* 4. ERROR STATE */}
        {streamState === "error" && (
          <Overlay>
            <StatusText style={{ color: "#ff3b30" }}>
              Connection Failed
            </StatusText>
            <RetryButton onClick={startStream}>Try Again</RetryButton>
          </Overlay>
        )}
      </VideoContainer>
    </CameraCard>
  );
}

// --- ICONS & STYLES ---

const PlayIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    style={{ marginRight: "8px" }}
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const CameraCard = styled.div`
  background: #111;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  font-family: "Inter", sans-serif;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledVideo = styled.video<{ $visible: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* Hide video element until it is actually playing to avoid ugly partial loads */
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 0.5s ease;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  z-index: 2;
`;

const PlayButton = styled.button`
  background: #fff;
  color: #000;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 100px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
  &:active {
    transform: scale(0.95);
  }
`;

const RetryButton = styled(PlayButton)`
  background: rgba(255, 59, 48, 0.2);
  color: #ff3b30;
  border: 1px solid #ff3b30;

  &:hover {
    background: rgba(255, 59, 48, 0.4);
    box-shadow: 0 0 20px rgba(255, 59, 48, 0.2);
  }
`;

const StatusText = styled.p`
  color: rgba(255, 255, 255, 0.7);
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(255, 59, 48, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 59, 48, 0); }
`;

const StatusBadge = styled.div<{ $status: StreamState }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.1);
  color: #888;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${(props) =>
    props.$status === "live" &&
    css`
      background: rgba(255, 59, 48, 0.15);
      color: #ff3b30;
    `}

  ${(props) =>
    props.$status === "ready" &&
    css`
      background: rgba(50, 215, 75, 0.15);
      color: #32d74b;
    `}
`;

const StatusDot = styled.div<{ $status: StreamState }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;

  ${(props) =>
    props.$status === "live" &&
    css`
      animation: ${pulse} 2s infinite;
    `}
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;