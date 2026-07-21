// hooks/useProviderStatus.js
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import api from "../APIs/api";

export const useProviderStatus = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [providerStatus, setProviderStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }

    const fetchProviderStatus = async () => {
      try {
        const response = await api.get(`/providers/status/${user.id}`);
        setProviderStatus(response.data.status); // 'pending', 'approved', 'rejected', null
      } catch (error) {
        console.error("Error fetching provider status:", error);
        setProviderStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProviderStatus();
  }, [user?.id, isAuthenticated]);

  return {
    isProvider: user?.role === "provider" || user?.type === "provider",
    isPending: providerStatus === "pending",
    isRejected: providerStatus === "rejected",
    canApply: !user?.role && !providerStatus,
    status: providerStatus,
    loading,
  };
};
