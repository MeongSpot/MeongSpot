import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import App from '@/App';

const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const MyPage = lazy(() => import('@/pages/MyPage'));
const MeetUpRoomPage = lazy(() => import('@/pages/MeetUpRoomPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const GroupChatPage = lazy(() => import('@/pages/GroupChatPage'));
const KakaoMapPage = lazy(() => import('@/pages/KakaoMapPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const SingleChatPage = lazy(() => import('@/pages/SingleChatPage'));
const MeetUpDogListPage = lazy(() => import('@/pages/MeetUpDogListPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <KakaoMapPage />,
      },
      {
        path: 'myPage',
        element: <MyPage />,
      },
      {
        path: 'meetUpRoom',
        element: <MeetUpRoomPage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'chat/single/:id',
        element: <SingleChatPage />,
      },
      {
        path: 'chat/group/:id',
        element: <GroupChatPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup/*',
        element: <SignupPage />,
      },
      {
        path: 'meetUpDogList',
        element: <MeetUpDogListPage />
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
