import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import App from '@/App';
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/store/useAuthStore';

// Lazy-loaded components
const ErrorPage = lazy(() => import('@/pages/ErrorPage'));
const MyPage = lazy(() => import('@/pages/mypage/MyPage'));
const UserProfile = lazy(() => import('@/pages/profile/UserProfile'));
const UpdateUser = lazy(() => import('@/pages/mypage/UpdateUser'));
const Settings = lazy(() => import('@/pages/mypage/Settings'));
const DogDetail = lazy(() => import('@/pages/mypage/DogDetail'));
const AddDog = lazy(() => import('@/pages/mypage/AddDog'));
const SelectBreed = lazy(() => import('@/pages/mypage/SelectBreed'));
const FriendsList = lazy(() => import('@/pages/mypage/FriendsList'));
const SearchUser = lazy(() => import('@/pages/mypage/SearchUser'));
const WalkingLogList = lazy(() => import('@/pages/walkinglog/WalkingLogList'));
const WalkingLogDetail = lazy(() => import('@/pages/walkinglog/WalkingLogDetail'));
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

// Auth guard component
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public route guard
const PublicGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: (
          <AuthGuard>
            <MapPage />
          </AuthGuard>
        ),
        children: [
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
        element: (
          <AuthGuard>
            <MyPage />
          </AuthGuard>
        ),
      },
      {
        path: 'profile/:id',
        element: (
          <AuthGuard>
            <UserProfile />
          </AuthGuard>
        ),
      },
      {
        path: 'mypage/update',
        element: (
          <AuthGuard>
            <UpdateUser />
          </AuthGuard>
        ),
      },
      {
        path: 'settings',
        element: (
          <AuthGuard>
            <Settings />
          </AuthGuard>
        ),
      },
      {
        path: 'dog/:id',
        element: (
          <AuthGuard>
            <DogDetail />
          </AuthGuard>
        ),
      },
      {
        path: 'registerdog',
        element: (
          <AuthGuard>
            <AddDog />
          </AuthGuard>
        ),
      },
      {
        path: 'selectbreed',
        element: (
          <AuthGuard>
            <SelectBreed />
          </AuthGuard>
        ),
      },
      {
        path: 'friendslist',
        element: <FriendsList />,
      },
      {
        path: 'searchuser',
        element: <SearchUser />,
      },
      {
        path: 'walkinglog',
        element: (
          <AuthGuard>
            <WalkingLogList />
          </AuthGuard>
        ),
      },
      {
        path: 'walkinglog/:id',
        element: (
          <AuthGuard>
            <WalkingLogDetail />
          </AuthGuard>
        ),
      },
      {
        path: 'mymeetuproom',
        element: (
          <AuthGuard>
            <MyMeetUpRoomPage />
          </AuthGuard>
        ),
      },
      {
        path: 'allmeetuproom/:spotId',
        element: (
          <AuthGuard>
            <AllMeetUpRoomPage />
          </AuthGuard>
        ),
      },
      {
        path: 'chat',
        element: (
          <AuthGuard>
            <ChatPage />
          </AuthGuard>
        ),
      },
      {
        path: 'chat/single/:id',
        element: (
          <AuthGuard>
            <SingleChatPage />
          </AuthGuard>
        ),
      },
      {
        path: 'chat/group/:id',
        element: (
          <AuthGuard>
            <GroupChatPage />
          </AuthGuard>
        ),
      },
      // Public routes
      {
        path: 'login',
        element: (
          <PublicGuard>
            <LoginPage />
          </PublicGuard>
        ),
      },
      {
        path: 'signup/*',
        element: (
          <PublicGuard>
            <SignupPage />
          </PublicGuard>
        ),
      },
      // Protected routes
      {
        path: 'meetupdoglist/:id',
        element: (
          <AuthGuard>
            <MeetUpDogListPage />
          </AuthGuard>
        ),
      },
      {
        path: 'notification',
        element: (
          <AuthGuard>
            <AlarmPage />
          </AuthGuard>
        ),
      },
      {
        path: 'participatedog/:id',
        element: (
          <AuthGuard>
            <ParticipateDogPage />
          </AuthGuard>
        ),
      },
      {
        path: 'allmeetuproom/:id/create',
        element: (
          <AuthGuard>
            <CreateRoomPage />
          </AuthGuard>
        ),
      },
    ],
  },
]);

const AppRouter = () => (
  <Suspense fallback={<div></div>}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRouter;
