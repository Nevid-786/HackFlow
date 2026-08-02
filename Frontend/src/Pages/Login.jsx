import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import authService from "../Api/auth";
import { login } from "../Redux/AuthSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError([]);

    const temp_error = [];
    if (!email || email.length < 5) {
      temp_error.push("Email must be filled and valid");
    }
    if (!password || password.length < 5) {
      temp_error.push("Password must be filled");
    }

    if (temp_error.length > 0) {
      setError(temp_error);
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      dispatch(login(data));
      navigate("/home");
    } catch (error) {
      console.log(error.errors);
      setError((p) => [...p, ...(error.errors || ["Something went wrong. Please try again."])]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  const fields = [
    { id: "email", label: "Email", type: "email", value: email, setter: setEmail, autoComplete: "email", placeholder: "you@hackflow.com" },
    { id: "password", label: "Password", type: "password", value: password, setter: setPassword, autoComplete: "current-password", placeholder: "••••••••" },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-10 bg-[#F5F6FB]">
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* gradient banner, matches dashboard header */}
        <div className="h-20 bg-gradient-to-r from-[#6C5CE7] to-[#38BDF8]" />

        <div className="px-6 sm:px-8 pb-8 -mt-8">
          <div className="w-14 h-14 rounded-full bg-white border-4 border-white shadow flex items-center justify-center mb-4">
            <span className="text-lg font-extrabold text-[#6C5CE7]">HF</span>
          </div>

          <p className="font-mono text-[11px] tracking-widest text-gray-400 uppercase mb-1">
            Welcome back
          </p>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Log in to Hack Flow
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Pick up where you left off.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {fields.map((f) => (
              <div key={f.id}>
                <label
                  htmlFor={f.id}
                  className="block mb-1.5 font-mono text-[11px] uppercase tracking-wider text-gray-400"
                >
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type={f.type}
                  autoComplete={f.autoComplete}
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  placeholder={f.placeholder}
                  required
                  className="w-full px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white border border-gray-300 rounded-md
                    focus:outline-none focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/20
                    hover:border-gray-400 transition-colors"
                />
              </div>
            ))}

            {error.length > 0 && (
              <ul className="space-y-1.5" aria-live="polite" role="alert">
                {error.map((err, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-wider bg-red-100 text-red-500 px-1.5 py-0.5 rounded">
                      error
                    </span>
                    {err}
                  </li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 text-sm font-semibold text-white bg-[#6C5CE7] rounded-md
                hover:bg-[#5B4BD6] active:bg-[#4C3FC0]
                disabled:bg-gray-300 disabled:cursor-not-allowed
                transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Logging in…
                </>
              ) : (
                "Log in"
              )}
            </button>

            <p className="pt-1 text-xs text-center text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#6C5CE7] hover:text-[#5B4BD6] font-semibold">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;