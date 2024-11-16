import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppRouter from './router/AppRouter';
import { messaging } from './firebaseConfig';
import { onMessage } from 'firebase/messaging';

// 포그라운드 메시지 핸들러 설정
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

// 포그라운드 메시지 수신 처리
if (messaging) {
  onMessage(messaging, (payload) => {
    console.log('Received foreground message:', payload);
    const title = payload.data?.title || 'Default Title';
    const body = payload.data?.body || 'Default Body';

    // 브라우저 알림 생성
    // if (Notification.permission === 'granted') {
    //   new Notification(payload.notification?.title || '새 알림', {
    //     body: payload.notification?.body,
    //     icon: '/icons/favicon/favicon-96x96.png',
    //   });
    // }

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/icons/favicon/favicon-96x96.png',
      });
    }


  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
);
