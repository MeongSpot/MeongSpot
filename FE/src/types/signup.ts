export interface SignupData {
  id: string;
  password: string;
  info: {
    name: string;
    nickname: string;
    phone: string;
    birth: {
      year: string;
      month: string;
      day: string;
    };
    gender: 'male' | 'female' | null;
  };
}

export const REGEX = {
  ID: /^[a-z0-9]{4,16}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
  NICKNAME: /^(?:[a-zA-Z]{2,8}|[가-힣]{2,8}|[a-zA-Z0-9가-힣]{2,8})$/,
  PHONE: /^010-\d{4}-\d{4}$/,
  NAME: /^[가-힣]{2,8}$/,
};
