import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./Api/auth";
import { login, logout } from "./Redux/AuthSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const publicPaths = ["/login", "/signup"];

      try {
        const data = await authService.getCurrentUser();
        dispatch(login(data));

        // Logged in but sitting on an auth page (e.g. typed the URL directly)
        if (publicPaths.includes(location.pathname)) {
          navigate("/home");
        }
      } catch {
        dispatch(logout());

        // Logged out and not already on a public page — send to login
        if (!publicPaths.includes(location.pathname)) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#6C5CE7] rounded-full animate-spin" />
      </div>
    );
  }

  return <Outlet />; // renders whichever child route matched
}

export default App;