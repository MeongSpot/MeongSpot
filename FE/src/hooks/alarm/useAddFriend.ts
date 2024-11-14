import { useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { RespondToInvitationResponse } from '@/types/alarm';

function useAddFriend() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const respondToInvitation = async (notificationId: number, accept: boolean) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // 친구 초대 응답 요청
            const response = await axiosInstance.post<RespondToInvitationResponse>(
                `/api/notifications/invitation/response`,
                { accept, notificationId },
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
