import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  verificationUuid: string;
  setIsAuthenticated: (value: boolean) => void;
  setVerificationUuid: (uuid: string) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  verificationUuid: '',
  setIsAuthenticated: (value: boolean) => set({ isAuthenticated: value }),
  setVerificationUuid: (uuid: string) => set({ verificationUuid: uuid }),
}));

export default useAuthStore;
