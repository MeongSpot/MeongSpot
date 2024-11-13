import { useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { DeleteNotificationResponse } from '@/types/alarm';

function useDeleteAlram() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const deleteNotification = async (notificationId: number) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axiosInstance.delete<DeleteNotificationResponse>(
                `/api/notifications`,
                {
                    params: { notificationId: notificationId },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.code === "NO101") {
                setSuccessMessage(response.data.message); // 성공 메시지 설정
            } else {
                setError("알림 삭제 실패: " + response.data.message);
            }
        } catch (error) {
            setError("알림 삭제 중 에러 발생: " + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteNotification, loading, error, successMessage };
}

export default useDeleteAlram;
