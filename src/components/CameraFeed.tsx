"use client";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

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

class VideoCache {
  private dbName = 'camera-cache';
  private storeName = 'videos';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async get(key: string): Promise<Blob | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async set(key: string, value: Blob): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

export default function CameraFeed() {
  const [stats, setStats] = useState<StreamStats | null>(null);
  const [cachedVideoUrl, setCachedVideoUrl] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [lastCachedVideo, setLastCachedVideo] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cacheRef = useRef<VideoCache>(new VideoCache());
  const downloadingRef = useRef<boolean>(false);

  // Initialize cache
  useEffect(() => {
    cacheRef.current.init().then(() => {
      console.log('Video cache initialized');
      loadCachedVideo();
    }).catch(err => {
      console.error('Failed to initialize cache:', err);
    });
  }, []);

  // Load cached video from IndexedDB
  const loadCachedVideo = async () => {
    try {
      const cachedBlob = await cacheRef.current.get('latest_video');
      const cachedFilename = localStorage.getItem('cached_video_filename');
      
      if (cachedBlob) {
        console.log('Found cached blob, size:', cachedBlob.size);
        const url = URL.createObjectURL(cachedBlob);
        setCachedVideoUrl(url);
        setLastCachedVideo(cachedFilename);
        console.log('Loaded cached video:', cachedFilename);
      }
    } catch (error) {
      console.error('Failed to load cached video:', error);
    }
  };

  // Download and cache new video
  const downloadAndCacheVideo = async (videoFilename: string) => {
    if (downloadingRef.current) return;
    if (videoFilename === lastCachedVideo) return;
    
    downloadingRef.current = true;
    setDownloadProgress(0);
    setVideoError(null);
    
    try {
      console.log('Downloading new video:', videoFilename);
      
      const response = await fetch(`${CAMERA_API_BASE}/latest_video`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const contentLength = parseInt(response.headers.get('Content-Length') || '0');
      
      if (!reader) {
        throw new Error('No reader available');
      }

      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        receivedLength += value.length;
        
        if (contentLength > 0) {
          const progress = (receivedLength / contentLength) * 100;
          setDownloadProgress(progress);
        }
      }

      console.log(`Downloaded ${receivedLength} bytes`);

      // Create blob from chunks
      // In downloadAndCacheVideo function, change:
      const blob = new Blob(chunks, { type: 'video/mp4' }); // or keep auto-detect
      console.log('Created blob, size:', blob.size);
      
      // Save to IndexedDB
      await cacheRef.current.set('latest_video', blob);
      localStorage.setItem('cached_video_filename', videoFilename);
      
      // Revoke old URL if exists
      if (cachedVideoUrl) {
        URL.revokeObjectURL(cachedVideoUrl);
      }
      
      // Create URL and display
      const url = URL.createObjectURL(blob);
      console.log('Created object URL:', url);
      setCachedVideoUrl(url);
      setLastCachedVideo(videoFilename);
      setDownloadProgress(null);
      
      console.log('Video cached successfully:', videoFilename);
      
    } catch (error) {
      console.error('Failed to download/cache video:', error);
      setVideoError(`Download failed: ${error}`);
      setDownloadProgress(null);
    } finally {
      downloadingRef.current = false;
    }
  };

  // Fetch stats and check for new videos
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${CAMERA_API_BASE}/api/stats`);
        const data = await response.json();
        setStats(data);
        
        // If we're offline and there's a new video available, download it
        if (!data.streaming_allowed && data.latest_video && data.latest_video !== lastCachedVideo) {
          console.log('New video detected:', data.latest_video);
          downloadAndCacheVideo(data.latest_video);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000);
    return () => clearInterval(interval);
  }, [lastCachedVideo]);

  // Handle video events
  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.error('Failed to play video:', err);
        setVideoError('Failed to play video');
      });
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.currentTarget;
    console.error('Video error:', video.error);
    setVideoError(`Video error: ${video.error?.message || 'Unknown error'}`);
  };

  const formatNextWindow = () => {
    if (!stats?.next_window) return 'No upcoming streams';
    const date = new Date(stats.next_window.time);
    return `${stats.next_window.name} at ${date.toLocaleTimeString()}`;
  };

  const isLive = stats?.streaming_allowed || false;

  return (
    <CameraCard>
      <Header>
        <Title>📹 Camera Stream</Title>
        <StatusBadge $isLive={isLive}>
          {isLive ? (
            <>
              <LiveDot />
              LIVE
            </>
          ) : (
            <>
              <ReplayIcon>📼</ReplayIcon>
              REPLAY
            </>
          )}
        </StatusBadge>
      </Header>

      {stats?.current_window && isLive && (
        <CurrentWindow>{stats.current_window}</CurrentWindow>
      )}

      <VideoContainer>
        {isLive ? (
          <LiveStream
            src={`${CAMERA_API_BASE}/video_feed`}
            alt="Live Stream"
          />
        ) : cachedVideoUrl ? (
          <>
            <ReplayVideo
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              src={cachedVideoUrl}
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              controls={false}
            />
            <CachedBadge>
              <CachedIcon>💾</CachedIcon>
              Cached Locally
            </CachedBadge>
            {videoError && (
              <ErrorOverlay>{videoError}</ErrorOverlay>
            )}
          </>
        ) : downloadProgress !== null ? (
          <DownloadingMessage>
            <h3>Downloading Video...</h3>
            <ProgressBar>
              <ProgressFill $progress={downloadProgress} />
            </ProgressBar>
            <p>{downloadProgress.toFixed(0)}%</p>
          </DownloadingMessage>
        ) : (
          <OfflineMessage>
            <h3>No Video Available</h3>
            <p>Waiting for first recording...</p>
          </OfflineMessage>
        )}
      </VideoContainer>

      {!isLive && stats?.next_window && (
        <NextStreamInfo>
          <InfoIcon>⏰</InfoIcon>
          <div>
            <InfoTitle>Next Stream</InfoTitle>
            <InfoText>{formatNextWindow()}</InfoText>
          </div>
        </NextStreamInfo>
      )}

      {isLive && stats && (
        <Stats>
          <StatItem>
            <StatLabel>FPS</StatLabel>
            <StatValue>{stats.fps}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Frames</StatLabel>
            <StatValue>{stats.frame_count.toLocaleString()}</StatValue>
          </StatItem>
          {stats.recording && (
            <StatItem>
              <RecordingIndicator>● REC</RecordingIndicator>
            </StatItem>
          )}
        </Stats>
      )}
    </CameraCard>
  );
}

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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(20, 20, 20, 0.8);
  border-bottom: 1px solid rgba(192, 192, 192, 0.1);
`;

const Title = styled.h2`
  color: #e0e0e0;
  margin: 0;
  font-size: 1.5rem;
`;

const StatusBadge = styled.div<{ $isLive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${props => props.$isLive 
    ? 'rgba(255, 0, 0, 0.2)' 
    : 'rgba(255, 255, 0, 0.2)'};
  color: ${props => props.$isLive ? '#ff4444' : '#ffff00'};
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.1em;
`;

const LiveDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff0000;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const ReplayIcon = styled.span`
  font-size: 1.2em;
`;

const CurrentWindow = styled.div`
  color: #ffff00;
  font-size: 0.9em;
  padding: 0.5rem 1.5rem;
  text-align: center;
  background: rgba(255, 255, 0, 0.1);
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
`;

const LiveStream = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const ReplayVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const CachedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(5px);
`;

const CachedIcon = styled.span`
  font-size: 1.2em;
`;

const ErrorOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  padding: 10px;
  font-size: 0.9em;
  text-align: center;
`;

const OfflineMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  padding: 40px;
  
  h3 {
    color: #f00;
    margin-bottom: 20px;
  }
  
  p {
    color: #aaa;
  }
`;

const DownloadingMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  text-align: center;
  padding: 40px;
  
  h3 {
    color: #0ff;
    margin-bottom: 20px;
  }
  
  p {
    color: #0ff;
    font-size: 1.5em;
    margin-top: 10px;
  }
`;

const ProgressBar = styled.div`
  width: 80%;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  margin: 20px 0;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #00ff00);
  transition: width 0.3s ease;
`;

const NextStreamInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(20, 20, 20, 0.6);
  border-top: 1px solid rgba(192, 192, 192, 0.1);
`;

const InfoIcon = styled.div`
  font-size: 2rem;
`;

const InfoTitle = styled.div`
  color: #c0c0c0;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const InfoText = styled.div`
  color: #808080;
  font-size: 0.85rem;
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1rem 1.5rem;
  background: rgba(20, 20, 20, 0.8);
  border-top: 1px solid rgba(192, 192, 192, 0.1);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const StatLabel = styled.div`
  color: #909090;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const StatValue = styled.div`
  color: #c0c0c0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const RecordingIndicator = styled.div`
  color: #ff0000;
  font-size: 0.85rem;
  font-weight: 600;
  animation: blink 2s ease-in-out infinite;

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
`;
