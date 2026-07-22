import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  console.log(isAuthenticated);
  const location = useLocation();

  if (loading) {
    return (
      <div className="p-5 text-center text-sm font-medium animate-pulse">
        Verifying access...
      </div>
    );
  }

  // 🔒 Redirection layer for unauthorized visits
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export function OnboardingRoute({ children }) {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading)
    return (
      <div className="p-5 text-center animate-pulse">Syncing pipeline...</div>
    );
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // 🔒 Redirection layer: Kick fully onboarded users away from registration pages
  if (user?.completed === true || user?.onboarding?.completed === true) {
    const role = user?.type || user?.role;
    return (
      <Navigate
        to={role === "provider" ? "/provider-dashboard" : "/customer/dashboard"}
        replace
      />
    );
  }

  return children;
}
