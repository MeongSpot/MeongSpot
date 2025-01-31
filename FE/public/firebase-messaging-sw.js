/* eslint-disable no-undef */
/* global importScripts, firebase */

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCQ52so6l1znO6O0iMT0B75o-rd0RvmqEE',
  authDomain: 'meongspot.firebaseapp.com',
  projectId: 'meongspot',
  storageBucket: 'meongspot.firebasestorage.app',
  messagingSenderId: '329611335682',
  appId: '1:329611335682:web:a0984d56cd15a51a2a6f1b',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log('백그라운드 메시지 수신:', payload);

  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: '/icons/favicon/favicon-196x196.png',
  //   data: { url: '/' }, // 클릭 시 이동할 URL을 데이터에 포함
  // };

    const notificationTitle = payload.data.title || 'Default Title';
    const notificationOptions = {
    body: payload.data.body || 'Default Body',
    icon: '/icons/favicon/favicon-196x196.png',
    data: { url: '/' }, // 클릭 시 이동할 URL을 데이터에 포함
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close(); // 알림 닫기

  // 클라이언트를 열거나 포커스
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // 열린 창이 없으면 새 창 열기
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
