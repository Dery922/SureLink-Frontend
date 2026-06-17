import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import Categories from "./Pages/Categories";
import CategoryResults from "./Pages/CategoryResults";
import ProviderOnboardingGate from "./Pages/ProviderOnboardingGate";
import ProviderOnboardingStep1Profile from "./Pages/ProviderOnboardingStep1Profile";
import ProviderOnboardingStep2Verification from "./Pages/ProviderOnboardingStep2Verification";
import ProviderOnboardingStep3Review from "./Pages/ProviderOnboardingStep3Review";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ProviderProfile from "./Pages/ProviderProfile";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import BookingConfirmation from "./Pages/BookingConfirmation";
import BookingFlow from "./Pages/BookingFlow";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "./APIs/api.js";
import {
  loginSuccess,
  loginFailure,
  setInitializingFalse,
} from "./redux/features/auth/authSlice.js";
import LoginPage from "./Pages/adminPages/Login.jsx";

function App() {
  const [initializing, setInitializing] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);

  //this useEffect make sure we users are always login
  //   useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     const token = localStorage.getItem("authToken");

  //     // 1. If no token exists, send them to login (if they aren't already there)
  //     if (!token) {
  //       setInitializing(false);
  //       if (location.pathname !== "/login") navigate("/login");
  //       return;
  //     }

  //     try {
  //       // 2. Token exists! Verify it automatically against the backend
  //       const res = await api.get("/auth/me", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       // 3. Keep user state in React context
  //       setUser(res.data.data.user);

  //       // 4. Auto-route them past login straight into the dashboard
  //       if (location.pathname === "/login") {
  //         navigate("/dashboard");
  //       }
  //     } catch (err) {
  //       console.error("Auto-login token expired or invalid:", err);
  //       localStorage.removeItem("authToken"); // Clean bad token
  //       navigate("/login");
  //     } finally {
  //       setInitializing(false);
  //     }
  //   };

  //   checkAuthStatus();
  // }, []);

  useEffect(() => {
    const autoRestoreSession = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        dispatch(setInitializingFalse());
        return;
      }

      try {
        // Automatically verify token against backend on mount
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const activeUser = res.data.data.user;
        dispatch(loginSuccess(activeUser));

        // If they are hanging out on public login pages, route them past it
        if (location.pathname === "/login" || location.pathname === "/signin") {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Auto-login token expired or invalid:", err.message);
        localStorage.removeItem("authToken");
        dispatch(loginFailure());
      }
    };

    autoRestoreSession();
  }, [dispatch]);

  // if (initializing) {
  //   return <div>Loading your profile...</div>; // Show a splash spinner
  // }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/get-started" element={<Auth />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route
          path="/become-provider"
          element={<Navigate to="/provider-onboarding/profile" replace />}
        />
        <Route path="/category/:id" element={<Categories />} />
        <Route path="/category-results" element={<CategoryResults />} />
        <Route
          path="/provider/onboarding"
          element={<ProviderOnboardingGate />}
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/booking/:providerId" element={<BookingFlow />} />
        <Route
          path="/provider-onboarding/profile"
          element={<ProviderOnboardingStep1Profile />}
        />
        <Route
          path="/provider-onboarding/verification"
          element={<ProviderOnboardingStep2Verification />}
        />
        <Route
          path="/booking-confirmation/:proverId"
          element={<BookingConfirmation />}
        />
        <Route
          path="/provider-onboarding/review"
          element={<ProviderOnboardingStep3Review />}
        />
        {/* Administrators routes start here */}
        <Route path="/admin-login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
