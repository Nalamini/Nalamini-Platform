import { apiRequest } from "@/lib/queryClient";

interface VideoSession {
  sessionId: string;
  videoId: string;
  startTime: number;
  lastUpdateTime: number;
  totalWatchTime: number;
  pauseCount: number;
  seekCount: number;
  volumeChanges: number;
  playbackSpeed: number;
  videoDuration: number;
  isCompleted: boolean;
}

interface ViewingEvent {
  type: 'play' | 'pause' | 'seek' | 'volumechange' | 'ratechange' | 'ended' | 'timeupdate';
  currentTime: number;
  timestamp: number;
}

class VideoAnalytics {
  private sessions = new Map<string, VideoSession>();
  private updateIntervals = new Map<string, NodeJS.Timeout>();
  private readonly UPDATE_INTERVAL = 5000; // Send updates every 5 seconds
  private readonly MIN_WATCH_TIME = 3; // Minimum 3 seconds to count as a view

  // Generate unique session ID
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get device and browser information
  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let deviceType = 'desktop';
    let browserType = 'unknown';

    // Detect device type
    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      deviceType = /iPad|tablet/i.test(userAgent) ? 'tablet' : 'mobile';
    }

    // Detect browser
    if (userAgent.includes('Chrome')) browserType = 'chrome';
    else if (userAgent.includes('Firefox')) browserType = 'firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browserType = 'safari';
    else if (userAgent.includes('Edge')) browserType = 'edge';

    return { deviceType, browserType };
  }

  // Start tracking a video session
  public startSession(videoId: string, videoDuration: number, viewerId?: number): string {
    const sessionId = this.generateSessionId();
    const { deviceType, browserType } = this.getDeviceInfo();

    const session: VideoSession = {
      sessionId,
      videoId,
      startTime: Date.now(),
      lastUpdateTime: Date.now(),
      totalWatchTime: 0,
      pauseCount: 0,
      seekCount: 0,
      volumeChanges: 0,
      playbackSpeed: 1.0,
      videoDuration,
      isCompleted: false
    };

    this.sessions.set(sessionId, session);

    // Send initial view record
    this.recordView(sessionId, viewerId);

    // Start periodic updates
    this.startPeriodicUpdates(sessionId);

    return sessionId;
  }

  // Record video view start
  private async recordView(sessionId: string, viewerId?: number) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const { deviceType, browserType } = this.getDeviceInfo();

    try {
      await apiRequest("POST", "/api/videos/analytics/view", {
        videoId: session.videoId,
        viewerId,
        sessionId,
        videoDuration: session.videoDuration,
        deviceType,
        browserType,
        ipAddress: '', // Will be set on server side
        referrer: document.referrer || window.location.href
      });
    } catch (error) {
      console.error("Failed to record video view:", error);
    }
  }

  // Handle video events
  public handleEvent(sessionId: string, event: ViewingEvent) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const now = Date.now();
    const timeDiff = (now - session.lastUpdateTime) / 1000;

    switch (event.type) {
      case 'play':
        session.lastUpdateTime = now;
        break;

      case 'pause':
        session.totalWatchTime += timeDiff;
        session.pauseCount++;
        session.lastUpdateTime = now;
        break;

      case 'seek':
        session.seekCount++;
        session.lastUpdateTime = now;
        break;

      case 'volumechange':
        session.volumeChanges++;
        break;

      case 'ratechange':
        session.playbackSpeed = (event as any).playbackRate || 1.0;
        break;

      case 'ended':
        session.totalWatchTime += timeDiff;
        session.isCompleted = true;
        session.lastUpdateTime = now;
        this.endSession(sessionId);
        break;

      case 'timeupdate':
        // Update watch time during playback
        if (timeDiff > 0 && timeDiff < 2) { // Ignore large gaps (indicates pause/seek)
          session.totalWatchTime += timeDiff;
        }
        session.lastUpdateTime = now;
        break;
    }
  }

  // Start periodic updates to server
  private startPeriodicUpdates(sessionId: string) {
    const interval = setInterval(() => {
      this.sendUpdate(sessionId);
    }, this.UPDATE_INTERVAL);

    this.updateIntervals.set(sessionId, interval);
  }

  // Send update to server
  private async sendUpdate(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Only send update if minimum watch time reached
    if (session.totalWatchTime < this.MIN_WATCH_TIME) return;

    const completionPercentage = Math.min(
      (session.totalWatchTime / session.videoDuration) * 100,
      100
    );

    try {
      await apiRequest("PUT", "/api/videos/analytics/session", {
        sessionId,
        totalWatchTime: Math.round(session.totalWatchTime),
        completionPercentage,
        pauseCount: session.pauseCount,
        seekCount: session.seekCount,
        volumeChanges: session.volumeChanges,
        playbackSpeed: session.playbackSpeed,
        isCompleted: session.isCompleted
      });
    } catch (error) {
      console.error("Failed to send video analytics update:", error);
    }
  }

  // End tracking session
  public endSession(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Send final update
    this.sendUpdate(sessionId);

    // Clear interval
    const interval = this.updateIntervals.get(sessionId);
    if (interval) {
      clearInterval(interval);
      this.updateIntervals.delete(sessionId);
    }

    // Remove session
    this.sessions.delete(sessionId);
  }

  // Attach event listeners to YouTube iframe
  public attachToYouTubePlayer(iframe: HTMLIFrameElement, videoId: string, viewerId?: number): string {
    const sessionId = this.startSession(videoId, 0, viewerId); // Duration will be updated when available

    // YouTube iframe API events
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;

      try {
        const data = JSON.parse(event.data);
        
        if (data.event === 'video-progress') {
          this.handleEvent(sessionId, {
            type: 'timeupdate',
            currentTime: data.info?.currentTime || 0,
            timestamp: Date.now()
          });
        }

        if (data.info?.duration && data.info.duration > 0) {
          const session = this.sessions.get(sessionId);
          if (session) {
            session.videoDuration = data.info.duration;
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    window.addEventListener('message', handleMessage);

    // Clean up on session end
    const originalEndSession = this.endSession.bind(this);
    this.endSession = (id: string) => {
      if (id === sessionId) {
        window.removeEventListener('message', handleMessage);
      }
      originalEndSession(id);
    };

    return sessionId;
  }

  // Attach to regular HTML5 video element
  public attachToVideoElement(video: HTMLVideoElement, videoId: string, viewerId?: number): string {
    const sessionId = this.startSession(videoId, video.duration || 0, viewerId);

    const events = [
      'play', 'pause', 'seeked', 'volumechange', 'ratechange', 'ended', 'timeupdate'
    ];

    const eventHandler = (event: Event) => {
      const eventType = event.type === 'seeked' ? 'seek' : event.type as any;
      
      this.handleEvent(sessionId, {
        type: eventType,
        currentTime: video.currentTime,
        timestamp: Date.now()
      });
    };

    events.forEach(eventType => {
      video.addEventListener(eventType, eventHandler);
    });

    // Update duration when available
    if (video.duration && video.duration > 0) {
      const session = this.sessions.get(sessionId);
      if (session) {
        session.videoDuration = video.duration;
      }
    }

    // Clean up on session end
    const originalEndSession = this.endSession.bind(this);
    this.endSession = (id: string) => {
      if (id === sessionId) {
        events.forEach(eventType => {
          video.removeEventListener(eventType, eventHandler);
        });
      }
      originalEndSession(id);
    };

    return sessionId;
  }

  // Get current session stats
  public getSessionStats(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const completionPercentage = session.videoDuration > 0 
      ? (session.totalWatchTime / session.videoDuration) * 100 
      : 0;

    return {
      totalWatchTime: session.totalWatchTime,
      completionPercentage,
      pauseCount: session.pauseCount,
      seekCount: session.seekCount,
      isCompleted: session.isCompleted
    };
  }
}

// Export singleton instance
export const videoAnalytics = new VideoAnalytics();

// Utility function to easily track YouTube videos
export function trackYouTubeVideo(iframe: HTMLIFrameElement, videoId: string, viewerId?: number) {
  return videoAnalytics.attachToYouTubePlayer(iframe, videoId, viewerId);
}

// Utility function to easily track HTML5 videos
export function trackVideoElement(video: HTMLVideoElement, videoId: string, viewerId?: number) {
  return videoAnalytics.attachToVideoElement(video, videoId, viewerId);
}