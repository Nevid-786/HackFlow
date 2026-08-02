import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './Redux/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Lazy-loaded pages — each becomes its own chunk, fetched only when visited
const Login = lazy(() => import('./Pages/Login.jsx'));
const Signup = lazy(() => import('./Pages/Signup.jsx'));
const Home = lazy(() => import('./Pages/Home.jsx'));
const PostHackathon = lazy(() => import('./Pages/PostHackathon.jsx'));
const Hackathon = lazy(() => import('./Pages/Hackathon.jsx'));
const HackathonInfo = lazy(() => import('./Pages/HackathonInfo.jsx'));
const CreateTeam = lazy(() => import('./Pages/CreateTeam.jsx'));
const Team = lazy(() => import('./Pages/Team.jsx'));
const UpdateHackathon = lazy(() => import('./Pages/UpdateHackathon.jsx'));
const ProfileEdit = lazy(() => import('./Pages/ProfileEdit.jsx'));
const ProfilePage = lazy(() => import('./Pages/Profile.jsx'));
const UserList = lazy(() => import('./Pages/MembersPage.jsx'));

// Simple fallback shown while a route chunk loads
const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-2 border-gray-200 border-t-[#6C5CE7] rounded-full animate-spin" />
  </div>
);

// Wraps a lazy page in Suspense so each route gets its own loading boundary
const withSuspense = (Component) => (
  <Suspense fallback={<PageFallback />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // layout, loaded eagerly
    children: [
      { index: true, element: withSuspense(Home) },
      { path: "login", element: withSuspense(Login) },
      { path: "signup", element: withSuspense(Signup) },
      { path: "home", element: withSuspense(Home) },
      { path: "posthackathon", element: withSuspense(PostHackathon) },
      { path: "hackathon", element: withSuspense(Hackathon) },
      { path: "hackathon/:id", element: withSuspense(HackathonInfo) },
      { path: "hackathon/addteam/", element: withSuspense(CreateTeam) },
      { path: "hackathon/team/:team_id", element: withSuspense(Team) },
      { path: "hackathon/update/:id", element: withSuspense(UpdateHackathon) },
      { path: "/profile/edit", element: withSuspense(ProfileEdit) },
      { path: "/profile/:id", element: withSuspense(ProfilePage) },
      { path: "/members", element: withSuspense(UserList) },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);