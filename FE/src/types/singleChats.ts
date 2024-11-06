export interface Chat {
  id: number;
  name: string;
  message: string;
  sender: string;
  time: string;
  profileImage: string;
}

export interface ChatRoom {
  id: number;
  name: string;
  profileImage: string;
  messages: { message: string; time: string }[];
}
