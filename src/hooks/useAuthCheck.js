// src/hooks/useAuthCheck.js
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const useAuthCheck = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const checkAuth = useCallback(
    (redirectTo = "/login") => {
      if (!loading && !isAuthenticated) {
        // Store the current path to redirect back after login
        sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
        navigate(redirectTo);
        return false;
      }
      return true;
    },
    [isAuthenticated, loading, navigate],
  );

  return { checkAuth, isAuthenticated, user, loading };
};

export default useAuthCheck;
