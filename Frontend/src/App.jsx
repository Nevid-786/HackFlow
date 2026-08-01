import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authService from "./api/auth";
import { login, logout } from "./redux/AuthSlice";

function App() {
  const dispatch = useDispatch();
  const nav=useNavigate()
  const [loading, setLoading] = useState(true);
  const authStatus =useSelector((state)=> state.auth.authStatus)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const data = await authService.getCurrentUser();
        dispatch(login(data));
       return <Outlet/>
     
      } catch {
        dispatch(logout());
        if(location.pathname == "/signup") {
          nav("/signup");
        }
        else{
          nav("/login")
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return <Outlet />; // renders whichever child route matched
}

export default App;