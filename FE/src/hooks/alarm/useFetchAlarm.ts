import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { Notification, NotificationResponse } from '@/types/alarm';

function useFetchAlarm() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get<NotificationResponse>('/api/notifications');
            console.log('API 응답:', response);
            console.log(response.data)
            if (response.data.code === "NO102") {
                setNotifications(response.data.data.reverse());
            } else {
                setError("알림 목록 조회에 실패했습니다.");
            }
        } catch (error) {
            setError("알림 목록 조회 중 에러가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        console.log('알림목록', notifications)
    }, []);

    return { notifications, loading, error };
}

export default useFetchAlarm;
