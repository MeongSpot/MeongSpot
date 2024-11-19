// stores/usePhoneVerificationStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PhoneVerificationState {
  attempts: number;
  lastAttemptTime: number | null;
  incrementAttempt: () => void;
  resetAttempts: () => void;
  canRequestVerification: () => boolean;
  timeUntilNextAttempt: () => number;
}

const MAX_ATTEMPTS = 5; // 최대 시도 횟수
const ATTEMPT_RESET_TIME = 24 * 60 * 60 * 1000; // 24시간 후 초기화
const COOLDOWN_TIME = 60 * 1000; // 재시도 대기 시간 (1분)

const usePhoneVerificationStore = create<PhoneVerificationState>((set, get) => ({
  attempts: 0,
  lastAttemptTime: null,

  incrementAttempt: () => {
    set((state) => ({
      attempts: state.attempts + 1,
      lastAttemptTime: Date.now(),
    }));
  },

  resetAttempts: () => {
    set({ attempts: 0, lastAttemptTime: null });
  },

  canRequestVerification: () => {
    const state = get();
    const now = Date.now();

    // 24시간이 지났으면 시도 횟수 초기화
    if (state.lastAttemptTime && now - state.lastAttemptTime >= ATTEMPT_RESET_TIME) {
      get().resetAttempts();
      return true;
    }

    // 최대 시도 횟수 체크
    if (state.attempts >= MAX_ATTEMPTS) {
      return false;
    }

    // 재시도 대기 시간 체크
    if (state.lastAttemptTime && now - state.lastAttemptTime < COOLDOWN_TIME) {
      return false;
    }

    return true;
  },

  timeUntilNextAttempt: () => {
    const state = get();
    if (!state.lastAttemptTime) return 0;

    const now = Date.now();
    const timePassed = now - state.lastAttemptTime;

    if (state.attempts >= MAX_ATTEMPTS) {
      return Math.max(0, ATTEMPT_RESET_TIME - timePassed);
    }

    return Math.max(0, COOLDOWN_TIME - timePassed);
  },
}));

export default usePhoneVerificationStore;
