
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './Redux/store.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import Home from './Pages/Home.jsx';
import PostHackathon from "./Pages/PostHackathon.jsx"



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path:'/login',
    element:<Login/>
  },
  {
    path:'/signup',
    element:<Login/>
  }
  ,{
    path:"/home",
    element:<Home/>
  }
  ,{
    path:"/posthackathon",
    element:<PostHackathon/>
  }
]);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        
      <RouterProvider router={router} />
    </Provider>
  );


