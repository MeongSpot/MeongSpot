export interface FriendListInfo {
  id: number;
  profileImage: string | null;
  nickname: string;
  dogNames: string[];
}

export interface GetFriendsResponse {
  code: string;
  message: string;
  data: FriendListInfo[];
}