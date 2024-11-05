import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import App from '@/App';
import { Navigate } from 'react-router-dom';

const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const MyPage = lazy(() => import('@/pages/mypage/MyPage'));
const Settings = lazy(() => import('@/pages/mypage/Settings'));
const AddDog = lazy(() => import('@/pages/mypage/AddDog'));
const SelectBreed = lazy(() => import('@/pages/mypage/SelectBreed'));
const MyMeetUpRoomPage = lazy(() => import('@/pages/meetup/MyMeetUpRoomPage'));
const AllMeetUpRoomPage = lazy(() => import('@/pages/meetup/AllMeetUpRoomPage'));
const ChatPage = lazy(() => import('@/pages/chat/ChatPage'));
const GroupChatPage = lazy(() => import('@/pages/chat/GroupChatPage'));
const MapPage = lazy(() => import('@/pages/map/MapPage'));
const MeetingMap = lazy(() => import('@/pages/map/MeetingMap'));
const WalkingMap = lazy(() => import('@/pages/map/WalkingMap'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const SignupPage = lazy(() => import('@/pages/signup/SignupPage'));
const SingleChatPage = lazy(() => import('@/pages/chat/SingleChatPage'));
const MeetUpDogListPage = lazy(() => import('@/pages/meetup/MeetUpDogListPage'));
const AlarmPage = lazy(() => import('@/pages/mypage/AlarmPage'));
const ParticipateDogPage = lazy(() => import('@/pages/meetup/ParticipateDogPage'));
const CreateRoomPage = lazy(() => import('@/pages/meetup/CreateRoomPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/', // 메인 경로
        element: <MapPage />,
        children: [
          // MapPage의 중첩 라우트
          {
            index: true,
            element: <Navigate to="/meeting" replace />,
          },
          {
            path: 'meeting',
            element: <MeetingMap />,
          },
          {
            path: 'walking',
            element: <WalkingMap />,
          },
        ],
      },
      {
        path: 'mypage',
        element: <MyPage />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'registerdog',
        element: <AddDog />,
      },
      {
        path: 'selectbreed',
        element: <SelectBreed />,
      },
      {
        path: 'mymeetuproom',
        element: <MyMeetUpRoomPage />,
      },
      {
        path: 'allmeetuproom/:id',
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
        element: <MeetUpDogListPage />,
      },
      {
        path: 'notification',
        element: <AlarmPage />,
      },
      {
        path: 'participatedog/:id',
        element: <ParticipateDogPage />,
      },
      {
        path: 'allmeetuproom/create',
        element: <CreateRoomPage />,
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
