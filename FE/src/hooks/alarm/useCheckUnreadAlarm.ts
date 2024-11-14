import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { CheckUnreadNotificationsResponse } from '@/types/alarm';

function useCheckUnreadNotifications() {
    const [existUnread, setExistUnread] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkUnreadNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get<CheckUnreadNotificationsResponse>(
                `/api/notifications/read`
            );

            if (response.data.code === "NO103") {
                setExistUnread(response.data.body.existUnread); // 읽지 않은 알림 여부 설정
            } else {
                setError("읽지 않은 알림 조회 실패: " + response.data.message);
            }
        } catch (error) {
            setError("알림 조회 중 에러 발생: " + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUnreadNotifications();
    }, []);

    return { existUnread, loading, error };
}

export default useCheckUnreadNotifications;
