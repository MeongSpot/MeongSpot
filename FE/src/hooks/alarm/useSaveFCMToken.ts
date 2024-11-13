import { useState } from 'react';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/firebaseConfig'; // Firebase 초기화 설정 파일에서 가져옴
import axiosInstance from '@/services/axiosInstance';

function useSaveFCMToken() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                throw new Error('사용자가 알림을 거부했습니다.');
            }
        } catch (error: any) {
            setErrorMessage("알림 권한 요청 중 오류가 발생했습니다.");
            throw error;
        }
    };

    const saveFCMToken = async (token?: string) => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            // 알림 권한 확인
            await requestPermission();

            // Firebase에서 FCM 토큰을 가져옴 (token이 없을 때)
            const fcmToken = token || (await getToken(messaging, { vapidKey: import.meta.env.VITE_PUBLIC_VAPID_KEY }));

            // 서버로 FCM 토큰 저장 요청
            const response = await axiosInstance.post(
                '/api/notifications/fcm',
                { token: fcmToken },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.code === "NO104") {
                setSuccessMessage(response.data.message || 'FCM 토큰이 성공적으로 저장되었습니다.');
            } else {
                setErrorMessage("FCM 토큰 저장 실패: " + (response.data.message || '알 수 없는 오류'));
            }
        } catch (error) {
            setErrorMessage("FCM 토큰 저장 중 에러 발생: " + error);
        } finally {
            setLoading(false);
        }
    };

    return { saveFCMToken, loading, successMessage, errorMessage };
}

export default useSaveFCMToken;
