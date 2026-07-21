// src/hooks/useProviderStats.js

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getProviderStats,
  getProviderSimpleStats,
  getProviderDashboard,
  getRatingDistribution,
  getPerformanceMetrics,
} from "../services/providerStatsService";
import { useCustomMessage } from "../components/CustomMessage";

// ==========================================
// USE PROVIDER STATS HOOK
// Fetches detailed provider statistics
// ==========================================
export const useProviderStats = (providerId, options = {}) => {
  const { simple = false, autoFetch = true } = options;
  const { error: showError } = useCustomMessage();
  const hasFetched = useRef(false);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!providerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      if (simple) {
        response = await getProviderSimpleStats(providerId);
      } else {
        response = await getProviderStats(providerId);
      }

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || "Failed to fetch provider statistics");
        showError(response.message || "Failed to load provider statistics");
      }
    } catch (err) {
      console.error("❌ Error fetching provider stats:", err);
      setError(err.message || "Failed to fetch provider statistics");
      showError("Failed to load provider statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [providerId, simple, showError]);

  useEffect(() => {
    if (autoFetch && providerId && !hasFetched.current) {
      hasFetched.current = true;
      fetchStats();
    }
  }, [autoFetch, fetchStats, providerId]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    refetch: () => {
      hasFetched.current = false;
      fetchStats();
    },
  };
};

// ==========================================
// USE PROVIDER DASHBOARD HOOK
// Fetches dashboard data for the logged-in provider
// ==========================================
export const useProviderDashboard = (autoFetch = true) => {
  const { error: showError } = useCustomMessage();
  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    if (!isMounted.current) return;

    setLoading(true);
    setError(null);

    try {
      console.log("📊 Fetching provider dashboard...");
      const response = await getProviderDashboard();

      console.log("📊 Dashboard response:", response);

      if (!isMounted.current) return;

      if (response.success) {
        setDashboardData(response.data);
        setError(null);
      } else {
        setError(response.message || "Failed to fetch dashboard data");
        // Don't show error toast for dashboard failures - let the component handle it
      }
    } catch (err) {
      console.error("❌ Error fetching dashboard:", err);
      if (!isMounted.current) return;
      setError(err.message || "Failed to fetch dashboard data");
      // Don't show error toast here - let the component handle it
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []); // Empty dependency array - function is stable

  useEffect(() => {
    isMounted.current = true;

    // Only fetch if autoFetch is true and we haven't fetched yet
    if (autoFetch && !hasFetched.current) {
      hasFetched.current = true;
      fetchDashboard();
    }

    // Cleanup
    return () => {
      isMounted.current = false;
    };
  }, [autoFetch, fetchDashboard]); // fetchDashboard is stable, so this runs once

  return {
    dashboardData,
    loading,
    error,
    refetch: () => {
      hasFetched.current = false;
      fetchDashboard();
    },
  };
};

// ==========================================
// USE PROVIDER RATING DISTRIBUTION HOOK
// ==========================================
export const useProviderRatingDistribution = (providerId, autoFetch = true) => {
  const { error: showError } = useCustomMessage();
  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  const [ratingData, setRatingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRatings = useCallback(async () => {
    if (!providerId || !isMounted.current) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getRatingDistribution(providerId);

      if (!isMounted.current) return;

      if (response.success) {
        setRatingData(response.data);
      } else {
        setError(response.message || "Failed to fetch rating distribution");
      }
    } catch (err) {
      console.error("❌ Error fetching rating distribution:", err);
      if (!isMounted.current) return;
      setError(err.message || "Failed to fetch rating distribution");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [providerId]);

  useEffect(() => {
    isMounted.current = true;

    if (autoFetch && providerId && !hasFetched.current) {
      hasFetched.current = true;
      fetchRatings();
    }

    return () => {
      isMounted.current = false;
    };
  }, [autoFetch, fetchRatings, providerId]);

  return {
    ratingData,
    loading,
    error,
    refetch: () => {
      hasFetched.current = false;
      fetchRatings();
    },
  };
};

// ==========================================
// USE PROVIDER PERFORMANCE METRICS HOOK
// ==========================================
export const useProviderPerformance = (
  providerId,
  period = 30,
  autoFetch = true,
) => {
  const { error: showError } = useCustomMessage();
  const hasFetched = useRef(false);
  const isMounted = useRef(true);

  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPerformance = useCallback(async () => {
    if (!providerId || !isMounted.current) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getPerformanceMetrics(providerId, period);

      if (!isMounted.current) return;

      if (response.success) {
        setPerformanceData(response.data);
      } else {
        setError(response.message || "Failed to fetch performance metrics");
      }
    } catch (err) {
      console.error("❌ Error fetching performance metrics:", err);
      if (!isMounted.current) return;
      setError(err.message || "Failed to fetch performance metrics");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [providerId, period]);

  useEffect(() => {
    isMounted.current = true;

    if (autoFetch && providerId && !hasFetched.current) {
      hasFetched.current = true;
      fetchPerformance();
    }

    return () => {
      isMounted.current = false;
    };
  }, [autoFetch, fetchPerformance, providerId]);

  return {
    performanceData,
    loading,
    error,
    refetch: () => {
      hasFetched.current = false;
      fetchPerformance();
    },
  };
};
