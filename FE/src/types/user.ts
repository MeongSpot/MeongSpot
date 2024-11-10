export interface UserInfo {
  id: number;
  name: string;
  profileImage: string;
  dogs: string[];
};

export interface UserMyPageInfo {
  name: string;
  profileImage: string;
  gender: string;
  nickname: string;
  age: number;
};

export interface UserMyPageInfoResponse {
  code: number;
  message: string;
  data: UserMyPageInfo;
};

export interface UserProfileImageUpdateResponse {
  code: number;
  message: string;
  body: null;
};