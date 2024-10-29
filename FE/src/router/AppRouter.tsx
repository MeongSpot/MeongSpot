import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import App from '@/App';

const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const MyPage = lazy(() => import('@/pages/MyPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const GroupPage = lazy(() => import('@/pages/GroupPage'));
const KakaoMapPage = lazy(() => import('@/pages/KakaoMapPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // 루트 경로의 기본 페이지
        element: <KakaoMapPage />,
      },
      {
        path: 'myPage',
        element: <MyPage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'group',
        element: <GroupPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
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
