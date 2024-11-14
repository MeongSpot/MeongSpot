import { useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { MarkAsReadResponse } from '@/types/alarm';

function useMarkAlarmAsRead() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const markAsRead = async (notificationId: number) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axiosInstance.patch<MarkAsReadResponse>(
                `/api/notifications/read`,
                { notificationId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.code === "NO100") {
                setSuccessMessage(response.data.message); // 성공 메시지 설정
            } else {
                setError("알림 읽음 처리 실패: " + response.data.message);
            }
        } catch (error) {
            setError("알림 읽음 처리 중 에러 발생: " + (error));
        } finally {
            setLoading(false);
        }
    };

    return { markAsRead, loading, error, successMessage };
}

export default useMarkAlarmAsRead;
