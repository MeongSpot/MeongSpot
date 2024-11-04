export interface ValidationResponse {
  isAvailable: boolean;
  message: string;
}

export interface AuthResponse {
  code: string;
  message: string;
  data: string | null;
}

export interface SignupRequest {
  loginId: string;
  password: string;
  name: string;
  nickname: string;
  birth: string;
  phone: string;
  gender: 'MALE' | 'FEMALE';
  uuid: string;
}
