import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import App from '@/App';

const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'));
const MyPage = lazy(() => import('@/components/pages/MyPage'));
const ChatPage = lazy(() => import('@/components/pages/ChatPage'));
const GroupPage = lazy(() => import('@/components/pages/GroupPage'));
const KakaoMapPage = lazy(() => import('@/components/pages/KakaoMapPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <KakaoMapPage />
      },
      {
        path: 'myPage',
        element: <MyPage />
      },
      {
        path: 'chat',
        element: <ChatPage />
      },
      {
        path: 'group',
        element: <GroupPage />
      },
      {
        path: 'kakaoMap',
        element: <KakaoMapPage />
      },
    ],
  },
]);
const AppRouter = () => (
  <Suspense>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
