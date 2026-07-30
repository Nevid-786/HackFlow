
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './Redux/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Home from './Pages/Home.jsx';
import PostHackathon from "./Pages/PostHackathon.jsx"
import Signup from './Pages/Signup.jsx';
import Hackathon from './Pages/Hackathon.jsx';
import Hackathoninfo from './Pages/Hackathoninfo.jsx';
import AddTeam from './components/addTeam.jsx';
import Team from './Pages/Team.jsx';



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,       // now acts as a layout, not a page
    children: [
      { index: true, element: <Home /> },       // "/"
      { path: "login", element: <Login /> },      // "/login"
      { path: "signup", element: <Signup /> },    // "/signup"
      { path: "home", element: <Home /> },        // "/home" (or drop if index covers it)
      { path: "posthackathon", element: <PostHackathon /> },
      { path: "hackathon", element: <Hackathon /> },
      { path: "hackathon/:id", element: <Hackathoninfo /> },
      { path: "hackathon/addteam/", element: <AddTeam /> },
      { path: "hackathon/team/:team_id", element: <Team/> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        
      <RouterProvider router={router} />
    </Provider>
  );


