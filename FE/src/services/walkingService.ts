// services/walkingService.ts
import axiosInstance from '@/services/axiosInstance';
import { StartWalkingRequest, StartWalkingResponse, WalkingLocationPayload } from '@/types/walking';

class WalkingService {
  private socket: WebSocket | null = null;
  // private readonly SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (
  //   import.meta.env.DEV 
  //     ? 'ws://localhost:8082/ws/location'
  //     : 'ws://meongspot.kro.kr/ws/location'
  // );
  private readonly SOCKET_URL = 'ws://meongspot.kro.kr/ws/location'

  private retryCount = 0;
  private readonly MAX_RETRIES = 3;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  async startWalking(dogIds: number[]): Promise<StartWalkingResponse> {
    const response = await axiosInstance.post<StartWalkingResponse>('/api/walking-log/start', {
      dogIds,
    });
    return response.data;
  }

  async endWalking(): Promise<StartWalkingResponse> {
    const response = await axiosInstance.post<StartWalkingResponse>('/api/walking-log/end');
    return response.data;
  }

  connectWebSocket(onError?: (error: Event) => void): WebSocket {
    try {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.close();
      }

      console.log('Attempting to connect to WebSocket:', this.SOCKET_URL);
      this.socket = new WebSocket(this.SOCKET_URL);

      this.socket.onopen = () => {
        console.log('Walking WebSocket connected successfully');
        this.retryCount = 0;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.socket.onclose = (event) => {
        console.log('Walking WebSocket closed:', event);
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
      console.error('Failed to create WebSocket connection:', error);
      throw error;
    }
  }

  getSocketStatus(): string {
    if (!this.socket) return '연결되지 않음';

    switch (this.socket.readyState) {
      case WebSocket.CONNECTING:
        return '연결 중...';
      case WebSocket.OPEN:
        return '연결됨';
      case WebSocket.CLOSING:
        return '연결 종료 중...';
      case WebSocket.CLOSED:
        return '연결 종료됨';
      default:
        return '알 수 없음';
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  sendLocation(location: WalkingLocationPayload): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        const message = JSON.stringify(location);
        console.log('Sending location:', message);
        this.socket.send(message);
      } catch (error) {
        console.error('Failed to send location:', error);
        if (!this.isConnected() && this.retryCount < this.MAX_RETRIES) {
          this.connectWebSocket();
        }
      }
    } else {
      const status = this.getSocketStatus();
      console.error('Walking WebSocket is not connected. Status:', status);
      if (status !== '연결 중...' && this.retryCount < this.MAX_RETRIES) {
        this.connectWebSocket();
      }
    }
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
  }
}

export const walkingService = new WalkingService();
