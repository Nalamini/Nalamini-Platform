import axios from 'axios';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
}

interface VideoUploadResult {
  videoId: string;
  videoUrl: string;
  success: boolean;
  error?: string;
}

export class YouTubeService {
  private apiKey: string;
  private channelId: string;
  private oauth2Client: any;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY!;
    this.channelId = process.env.YOUTUBE_CHANNEL_ID!;
    
    if (!this.apiKey) {
      throw new Error('YOUTUBE_API_KEY environment variable is required');
    }
    if (!this.channelId) {
      throw new Error('YOUTUBE_CHANNEL_ID environment variable is required');
    }

    // Initialize OAuth2 client for uploads
    this.initializeOAuth();
  }

  private initializeOAuth() {
    const { OAuth2 } = google.auth;
    this.oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );

    // Set refresh token if available
    if (process.env.GOOGLE_REFRESH_TOKEN) {
      this.oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
      });
    }
  }

  async getChannelVideos(maxResults: number = 50): Promise<YouTubeVideo[]> {
    try {
      console.log('Fetching videos for channel:', this.channelId);
      
      // Verify this is the authorized Nalamini channel
      if (this.channelId !== 'UCp3MOo1CpFCa6awiaedrfhA') {
        throw new Error('Access restricted: Only Nalamini channel videos are allowed');
      }
      
      // Get channel uploads playlist
      const channelResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/channels`,
        {
          params: {
            part: 'contentDetails,snippet',
            id: this.channelId,
            key: this.apiKey
          }
        }
      );

      console.log('Channel response:', JSON.stringify(channelResponse.data, null, 2));

      if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
        throw new Error('Channel not found or has no content');
      }

      const uploadsPlaylistId = channelResponse.data.items[0]?.contentDetails?.relatedPlaylists?.uploads;
      
      if (!uploadsPlaylistId) {
        throw new Error('Could not find uploads playlist for channel');
      }

      // Get videos from the uploads playlist
      const playlistResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems`,
        {
          params: {
            part: 'snippet',
            playlistId: uploadsPlaylistId,
            maxResults,
            key: this.apiKey,
            order: 'date'
          }
        }
      );

      const videoIds = playlistResponse.data.items.map((item: any) => item.snippet.resourceId.videoId);

      if (videoIds.length === 0) {
        return [];
      }

      // Get detailed video information
      const videosResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            id: videoIds.join(','),
            key: this.apiKey
          }
        }
      );

      return videosResponse.data.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnailUrl: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
        publishedAt: video.snippet.publishedAt,
        duration: this.parseDuration(video.contentDetails.duration),
        viewCount: parseInt(video.statistics.viewCount || '0')
      }));

    } catch (error: any) {
      console.error('Error fetching YouTube videos:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw new Error(`Failed to fetch videos from YouTube channel: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  private parseDuration(duration: string): string {
    // Parse ISO 8601 duration (PT1H30M15S) to readable format
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  getVideoEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  getVideoWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  async uploadVideo(videoPath: string, title: string, description: string, tags: string[] = []): Promise<VideoUploadResult> {
    try {
      // Check if OAuth is properly configured
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
        return {
          videoId: '',
          videoUrl: '',
          success: false,
          error: 'YouTube upload requires Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)'
        };
      }

      const youtube = google.youtube({ version: 'v3', auth: this.oauth2Client });

      // Check if video file exists
      if (!fs.existsSync(videoPath)) {
        throw new Error(`Video file not found: ${videoPath}`);
      }

      console.log(`Uploading video to YouTube: ${title}`);
      console.log(`File path: ${videoPath}`);
      console.log(`File size: ${fs.statSync(videoPath).size} bytes`);

      const videoMetadata = {
        snippet: {
          title: title,
          description: `${description}\n\nUploaded via Nalamini Service Platform`,
          tags: [...tags, 'Nalamini', 'Service Platform', 'Tamil Nadu'],
          categoryId: '22', // People & Blogs category
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en'
        },
        status: {
          privacyStatus: 'public', // Options: 'private', 'public', 'unlisted'
          madeForKids: false
        }
      };

      const response = await youtube.videos.insert({
        part: ['snippet', 'status'],
        requestBody: videoMetadata,
        media: {
          body: fs.createReadStream(videoPath)
        }
      });

      const videoId = response.data.id!;
      const videoUrl = this.getVideoWatchUrl(videoId);

      console.log(`Video uploaded successfully: ${videoId}`);
      console.log(`Video URL: ${videoUrl}`);

      return {
        videoId,
        videoUrl,
        success: true
      };

    } catch (error: any) {
      console.error('YouTube upload error:', error);
      return {
        videoId: '',
        videoUrl: '',
        success: false,
        error: error.message || 'Failed to upload video to YouTube'
      };
    }
  }

  async uploadApprovedVideo(videoId: number, videoPath: string, title: string, description: string): Promise<VideoUploadResult> {
    try {
      console.log(`Starting YouTube upload for approved video ID: ${videoId}`);
      
      // Upload to YouTube
      const result = await this.uploadVideo(videoPath, title, description, ['approved', 'community']);
      
      if (result.success) {
        console.log(`Successfully uploaded video ${videoId} to YouTube: ${result.videoId}`);
        
        // Here you could update the database to store the YouTube video ID
        // await db.update(videoUploads).set({ youtubeVideoId: result.videoId }).where(eq(videoUploads.id, videoId));
        
        return result;
      } else {
        console.error(`Failed to upload video ${videoId} to YouTube:`, result.error);
        return result;
      }
      
    } catch (error: any) {
      console.error(`Error uploading approved video ${videoId}:`, error);
      return {
        videoId: '',
        videoUrl: '',
        success: false,
        error: error.message || 'Failed to upload approved video'
      };
    }
  }

  // Get all playlists for the channel
  async getChannelPlaylists(): Promise<any[]> {
    try {
      console.log(`Fetching playlists for channel: ${this.channelId}`);
      
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlists`,
        {
          params: {
            part: 'snippet,contentDetails',
            channelId: this.channelId,
            maxResults: 50,
            key: this.apiKey
          }
        }
      );

      console.log('Playlists response:', JSON.stringify(response.data, null, 2));

      return response.data.items.map((playlist: any) => ({
        id: playlist.id,
        title: playlist.snippet.title,
        description: playlist.snippet.description,
        thumbnailUrl: playlist.snippet.thumbnails.medium?.url || playlist.snippet.thumbnails.default?.url,
        publishedAt: playlist.snippet.publishedAt,
        itemCount: playlist.contentDetails.itemCount
      }));
    } catch (error: any) {
      console.error('Error fetching playlists:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get videos from a specific playlist
  async getPlaylistVideos(playlistId: string, maxResults = 50): Promise<any[]> {
    try {
      console.log(`Fetching videos for playlist: ${playlistId}`);
      
      // Get playlist items
      const playlistResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/playlistItems`,
        {
          params: {
            part: 'snippet',
            playlistId: playlistId,
            maxResults,
            key: this.apiKey
          }
        }
      );

      const videoIds = playlistResponse.data.items
        .filter((item: any) => item.snippet.resourceId.kind === 'youtube#video')
        .map((item: any) => item.snippet.resourceId.videoId);

      if (videoIds.length === 0) {
        return [];
      }

      // Get detailed video information
      const videosResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            id: videoIds.join(','),
            key: this.apiKey
          }
        }
      );

      return videosResponse.data.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnailUrl: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
        publishedAt: video.snippet.publishedAt,
        duration: this.parseDuration(video.contentDetails.duration),
        viewCount: parseInt(video.statistics.viewCount || '0'),
        likeCount: parseInt(video.statistics.likeCount || '0'),
        playlistId: playlistId
      }));
    } catch (error: any) {
      console.error('Error fetching playlist videos:', error.response?.data || error.message);
      throw error;
    }
  }
}

export const youtubeService = new YouTubeService();