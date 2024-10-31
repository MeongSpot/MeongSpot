import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import App from '@/App';

const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const MyPage = lazy(() => import('@/pages/mypage/MyPage'));
const MyMeetUpRoomPage = lazy(() => import('@/pages/MyMeetUpRoomPage'));
const AllMeetUpRoomPage = lazy(() => import('@/pages/AllMeetUpRoomPage'));
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
        path: 'mypage',
        element: <MyPage />,
      },
      {
        path: 'mymeetuproom',
        element: <MyMeetUpRoomPage />,
      },
      {
        path: 'allmeetuproom',
        element: <AllMeetUpRoomPage />,
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
        path: 'meetupdoglist',
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
