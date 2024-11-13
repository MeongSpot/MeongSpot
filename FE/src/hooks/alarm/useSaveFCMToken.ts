import { useState } from 'react';
import axiosInstance from '@/services/axiosInstance';

function useSaveFCMToken() {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const saveFCMToken = async (token: string) => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const response = await axiosInstance.post(
                '/api/notifications/fcm',
                { token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.code === "NO104") {
                setSuccessMessage(response.data.message);
            } else {
                setErrorMessage("FCMToken 저장 실패: " + response.data.message);
            }
        } catch (error) {
            setErrorMessage("FCMToken 저장 중 에러 발생: " + (error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return { saveFCMToken, loading, successMessage, errorMessage };
}

export default useSaveFCMToken;
