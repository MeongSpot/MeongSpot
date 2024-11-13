import { useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { RespondToInvitationResponse } from '@/types/alarm';
import { getToken } from 'firebase/messaging';
import { messaging } from '@/firebaseConfig';  // Firebase 초기화 설정

function useAddFriend() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // FCM 토큰 가져오는 함수
    const getFcmToken = async () => {
        try {
            const token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, // 환경변수에서 VAPID 키 가져오기
            });
            return token;
        } catch (err) {
            console.error('FCM 토큰 가져오기 실패', err);
            return null;
        }
    };

    const respondToInvitation = async (notificationId: number, accept: boolean) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // FCM 토큰 가져오기
            const fcmToken = await getFcmToken();

            // FCM 토큰이 존재하면 요청에 포함
            const response = await axiosInstance.post<RespondToInvitationResponse>(
                `/api/notifications/invitation/response`,
                { accept, notificationId, fcmToken }, // FCM 토큰을 함께 전송
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.code === "NO105") {
                setSuccessMessage(response.data.message);
            } else {
                setError("친구 초대 응답 실패: " + response.data.message);
            }
        } catch (error) {
            setError("친구 초대 응답 중 에러 발생: " + error);
        } finally {
            setLoading(false);
        }
    };

    return { respondToInvitation, loading, error, successMessage };
}

export default useAddFriend;
