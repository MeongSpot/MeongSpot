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

export interface UserProfileInfo {
  id: number;
  profileImage: string;
  nickname: string;
  gender: string;
  age: number;
  isFriend: boolean;
}

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

export interface UserProfileInfoResponse {
  code: number;
  message: string;
  data: UserProfileInfo;
};

export interface UserSearchInfo {
  id: number;
  nickname: string;
  profileImage: string
  dogNameList: string[];
}

export interface UserSearchResponse {
  code: number;
  message: string;
  data: UserSearchInfo[];
}

export interface MeetingParticipantsInfo {
  memberId: number;
  profileImage: string | null;
  nickname: string;
  birth: string;
  gender: string;
}