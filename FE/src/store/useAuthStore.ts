import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  verificationUuid: string;
  token: string | null;
  loginId: string | null;
  fcmToken: string | null;
  setIsAuthenticated: (value: boolean) => void;
  setVerificationUuid: (uuid: string) => void;
  login: (loginId: string, token: string) => void;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
  setAccessToken: (token: string) => void;
  setFcmToken: (token: string) => void; // fcmToken 설정
  getFcmToken: () => string | null; // fcmToken 조회
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      verificationUuid: '',
      token: null,
      loginId: null,
      fcmToken: null,
      setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
      setVerificationUuid: (uuid: string) => set({ verificationUuid: uuid }),
      login: (loginId: string, token: string) =>
        set({
          isAuthenticated: true,
          loginId,
          token,
        }),
      logout: async () => {
        try {
          set({
            isAuthenticated: false,
            token: null,
            loginId: null,
            verificationUuid: '',
            fcmToken: null,
          });
          localStorage.removeItem('auth-storage');
        } catch (error) {
          console.error('로그아웃 상태 초기화 실패:', error);
        }
      },
      getAccessToken: () => get().token,
      setAccessToken: (token: string) => {
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        set({ token: formattedToken, isAuthenticated: true });
      },
      setFcmToken: (token: string) => set({ fcmToken: token }), // FCM 토큰 설정
      getFcmToken: () => get().fcmToken, // FCM 토큰 조회
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
