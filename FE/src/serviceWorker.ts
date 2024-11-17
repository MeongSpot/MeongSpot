// src/serviceWorker.ts
import { onMessage } from 'firebase/messaging';
import { messaging } from './firebaseConfig';

export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // 서비스 워커 등록
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);

        // Firebase messaging 초기화 후 포그라운드에서 알림 받기
        if (messaging) {
          onMessage(messaging, (payload) => {
            console.log('Received foreground message:', payload);

            // data에 있는 title과 body를 사용
            const title = payload.data?.title || 'Default Title';
            const body = payload.data?.body || 'Default Body';

            // 알림 표시
            if (Notification.permission === 'granted') {
              new Notification(title, {
                body: body,
                icon: '/icons/favicon-96x96.png', // 알림 아이콘
              });
            }
          });
        }
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
};
