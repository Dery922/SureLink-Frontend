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
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import api from "./APIs/api.js";
import {
  loginSuccess,
  loginFailure,
  setInitializingFalse,
} from "./redux/features/auth/authSlice.js";
import LoginPage from "./Pages/adminPages/Login.jsx";
import CustomerOnboarding from "./Pages/CustomerOnboardingGate.jsx";
import ProviderDashboard from "./Pages/ProviderDashboard.jsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx";
import SaturnContactMenu from "./components/SaturnContactMenu.jsx";
import ChatWidget from "./components/chat/ChatWidget.jsx";
import ManageProfile from "./Pages/ManageProfile.jsx";

function App() {
  const [initializing, setInitializing] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useSelector((state) => state.auth);

  const excludedPaths = [
    "/signup",
    "/login",
    "/signin",
    "/reset-password",
    "/verify-email",
    "/register",
    "/get-started",
  ];
  const showChat = !excludedPaths.includes(location.pathname);

  useEffect(() => {
    // 🚀 THE LIFECYCLE GUARD: Track whether this specific effect execution is still active
    let isMounted = true;

    const autoRestoreSession = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        dispatch(setInitializingFalse());
        return;
      }

      try {
        // Inject authorization token cleanly onto your Axios instance defaults
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        //when the page is refresh call this route which  return the user object
        const res = await api.get("/auth/me");
        if (!isMounted) return;

        // Isolate the clean database profile fields
        const activeUser =
          res.data?.data?.user || res.data?.user || res.data?.data;

        if (!activeUser) {
          throw new Error("No user document found in API response wrapper.");
        }

        // Commit object directly to storages
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(activeUser));

        // 🚀 DISPATCH THE FLAT OBJECT ALONE
        dispatch(loginSuccess(activeUser));

        // Onboarding routing redirects
        if (
          location.pathname === "/login" ||
          location.pathname === "/signin" ||
          location.pathname === "/register"
        ) {
          if (activeUser?.onboarding?.completed === false) {
            const currentType = activeUser?.type || activeUser?.role;
            if (currentType === "provider") {
              navigate("/provider/onboarding");
            } else {
              navigate("/customer/onboarding");
            }
          } else {
            navigate("/");
          }
        }
      } catch (err) {
        // Only run the error handler and clear storage if this is the active lifecycle instance
        if (isMounted) {
          console.error(
            "💥 SCRIPT LEVEL AUTOMATIC RECOVERY DROPPED:",
            err.message,
          );
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          dispatch(loginFailure());
        }
      }
    };

    autoRestoreSession();

    // 🚀 CLEANUP FUNCTION: Runs immediately if React remounts the component
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // if (initializing) {
  //   return <div>Loading your profile...</div>; // Show a splash spinner
  // }

  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            zIndex: 999999,
          },
        }}
      />
      {showChat && <ChatWidget />}
      {/* <SaturnContactMenu /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/get-started" element={<Auth />} />
        <Route path="/provider/:id" element={<ProviderProfile />} />
        <Route
          path="/provider/manage/profile-page"
          element={<ManageProfile />}
        />
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
        <Route path="/customer/onboarding" element={<CustomerOnboarding />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/booking/:id" element={<BookingFlow />} />
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
          path="/provider-dashbaord"
          element={
            <ProtectedRoute>
              {" "}
              <ProviderDashboard />
            </ProtectedRoute>
          }
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
