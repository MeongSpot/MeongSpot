import axiosInstance from '@/services/axiosInstance';
import { StartWalkingRequest, StartWalkingResponse, WalkingLocationPayload } from '@/types/walking';
import { LatLng } from '@/types/map';
interface EndWalkingPayload {
  finishedAt: string;
  distance: number;
}

class WalkingService {
  private socket: WebSocket | null = null;
  private readonly SOCKET_URL = 'wss://meongspot.kro.kr/socket/gps/ws/location';
  private readonly MAX_RETRIES = 3;
  private retryCount = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isStarting = false;
  private startTimeout: NodeJS.Timeout | null = null;
  private pathCoordinates: LatLng[] = [];
  private lastSentLocation: LatLng | null = null;

  async startWalking(dogIds: number[]): Promise<StartWalkingResponse> {
    if (this.isStarting) {
      throw new Error('이미 산책 시작 요청이 진행 중입니다.');
    }

    try {
      this.isStarting = true;
      if (this.startTimeout) clearTimeout(this.startTimeout);

      const response = await axiosInstance.post<StartWalkingResponse>('/api/walking-log/start', { dogIds });

      this.pathCoordinates = [];
      this.lastSentLocation = null;
      this.startTimeout = setTimeout(() => {
        this.isStarting = false;
      }, 1000);

      return response.data;
    } catch (error) {
      this.isStarting = false;
      throw error;
    }
  }

  async endWalking(distance: number): Promise<StartWalkingResponse> {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localTime = new Date(now.getTime() - offset);

    const payload: EndWalkingPayload = {
      finishedAt: localTime.toISOString(),
      distance: Math.round(distance),
    };

    const response = await axiosInstance.post<StartWalkingResponse>('/api/walking-log/end', payload);
    this.pathCoordinates = [];
    this.lastSentLocation = null;
    return response.data;
  }

  connectWebSocket(onError?: (error: Event) => void): WebSocket {
    try {
      if (this.isConnecting) {
        console.log('Connection already in progress');
        return this.socket!;
      }

      if (this.socket?.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected');
        return this.socket;
      }

      this.isConnecting = true;
      console.log('Attempting to connect to WebSocket:', this.SOCKET_URL);
      this.socket = new WebSocket(this.SOCKET_URL);

      this.socket.onopen = () => {
        console.log('Walking WebSocket connected successfully');
        this.retryCount = 0;
        this.isConnecting = false;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.socket.onclose = (event) => {
        console.log('Walking WebSocket closed:', event);
        this.isConnecting = false;
        if (!event.wasClean && this.retryCount < this.MAX_RETRIES) {
          console.log(`Attempting to reconnect... (${this.retryCount + 1}/${this.MAX_RETRIES})`);
          this.retryCount++;
          this.reconnectTimeout = setTimeout(() => {
            console.log('Reconnecting...');
            this.connectWebSocket(onError);
          }, 2000);
        } else if (this.retryCount >= this.MAX_RETRIES) {
          console.error('Maximum reconnection attempts reached');
          onError?.(new Event('Maximum WebSocket connection attempts reached'));
        }
      };

      this.socket.onerror = (error) => {
        console.error('Walking WebSocket error:', error);
        this.isConnecting = false;
        onError?.(error);
      };

      this.socket.onmessage = (event) => {
        try {
          console.log('Raw WebSocket message:', event.data);
          const data = JSON.parse(event.data);
          console.log('Parsed WebSocket message:', data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      return this.socket;
    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to create WebSocket connection:', error);
      throw error;
    }
  }

  sendLocation(location: WalkingLocationPayload): void {
    const shouldSend = this.shouldSendLocation(location);
    if (!shouldSend) return;

    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        this.socket.send(JSON.stringify(location));
        this.lastSentLocation = { lat: location.lat, lng: location.lng };
      } catch (error) {
        if (!this.isConnected() && !this.isConnecting && this.retryCount < this.MAX_RETRIES) {
          this.connectWebSocket();
        }
      }
    } else if (!this.isConnecting && this.retryCount < this.MAX_RETRIES) {
      this.connectWebSocket();
    }
  }

  public calculateDistance(point1: LatLng, point2: LatLng): number {
    const R = 6371e3;
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private shouldSendLocation(location: WalkingLocationPayload): boolean {
    if (!this.lastSentLocation) return true;

    const distance = this.calculateDistance(this.lastSentLocation, { lat: location.lat, lng: location.lng });
    return distance >= 2;
  }

  getSocketStatus(): string {
    if (!this.socket) return '연결되지 않음';
    const states = ['연결 중...', '연결됨', '연결 종료 중...', '연결 종료됨'];
    return states[this.socket.readyState] || '알 수 없음';
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  getPathCoordinates(): LatLng[] {
    return this.pathCoordinates;
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.retryCount = 0;
    this.pathCoordinates = [];
    this.lastSentLocation = null;
  }
}

export const walkingService = new WalkingService();
