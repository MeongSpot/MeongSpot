import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  verificationUuid: string;
  token: string | null;
  loginId: string | null;
  setIsAuthenticated: (value: boolean) => void;
  setVerificationUuid: (uuid: string) => void;
  login: (loginId: string, token: string) => void;
  logout: () => Promise<void>;
  getAccessToken: () => string | null; // 추가
  setAccessToken: (token: string) => void; // 추가
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // get 추가
      isAuthenticated: false,
      verificationUuid: '',
      token: null,
      loginId: null,
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
          });
          localStorage.removeItem('auth-storage');
        } catch (error) {
          console.error('로그아웃 상태 초기화 실패:', error);
        }
      },
      getAccessToken: () => get().token, // 추가
      setAccessToken: (token: string) => {
        // 추가
        const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        set({ token: formattedToken, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useAuthStore;
