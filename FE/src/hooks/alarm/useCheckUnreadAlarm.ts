import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { CheckUnreadNotificationsResponse } from '@/types/alarm';

function useCheckUnreadAlarm() {
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

            console.log('API 응답:', response);
            if (response.data.code === "NO103") {
                const isUnread = typeof response.data.data === "boolean" ? response.data.data : false;
                setExistUnread(isUnread);
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

export default useCheckUnreadAlarm;
