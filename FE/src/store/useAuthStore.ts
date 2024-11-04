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
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
          // 상태 초기화
          set({ 
            isAuthenticated: false, 
            token: null, 
            loginId: null,
            verificationUuid: '',
          });
          // localStorage 초기화
          localStorage.removeItem('auth-storage');
        } catch (error) {
          console.error('로그아웃 상태 초기화 실패:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;