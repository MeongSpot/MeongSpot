import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import App from '@/App';

const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
<<<<<<< HEAD
const MyPage = lazy(() => import('@/pages/MyPage'));
const MyMeetUpRoomPage = lazy(() => import('@/pages/meetup/MyMeetUpRoomPage'));
const AllMeetUpRoomPage = lazy(() => import('@/pages/meetup/AllMeetUpRoomPage'));
const ChatPage = lazy(() => import('@/pages/chat/ChatPage'));
const GroupChatPage = lazy(() => import('@/pages/chat/GroupChatPage'));
=======
const MyPage = lazy(() => import('@/pages/mypage/MyPage'));
const MyMeetUpRoomPage = lazy(() => import('@/pages/MyMeetUpRoomPage'));
const AllMeetUpRoomPage = lazy(() => import('@/pages/AllMeetUpRoomPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const GroupChatPage = lazy(() => import('@/pages/GroupChatPage'));
>>>>>>> 004287d70d268d67e81db030a35c3775132bb8f0
const KakaoMapPage = lazy(() => import('@/pages/KakaoMapPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/SignupPage'));
const SingleChatPage = lazy(() => import('@/pages/SingleChatPage'));
const MeetUpDogListPage = lazy(() => import('@/pages/meetup/MeetUpDogListPage'));
const AlarmPage = lazy(() => import('@/pages/AlarmPage'));
const ParticipateDogPage = lazy(() => import('@/pages/meetup/ParticipateDogPage'));
const CreateRoomPage = lazy(() => import('@/pages/meetup/CreateRoomPage'));

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
<<<<<<< HEAD
        path: 'MeetUpDogList',
        element: <MeetUpDogListPage />,
      },
      {
        path: 'alarm',
        element: <AlarmPage />,
      },
      {
        path: 'participateDog/:id',
        element: <ParticipateDogPage />,
      },
      {
        path: 'allMeetUpRoom/create',
        element: <CreateRoomPage />,
=======
        path: 'meetupdoglist',
        element: <MeetUpDogListPage />
>>>>>>> 004287d70d268d67e81db030a35c3775132bb8f0
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
