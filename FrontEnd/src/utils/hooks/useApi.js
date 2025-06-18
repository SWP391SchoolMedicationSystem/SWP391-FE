import { useState, useEffect, useCallback } from "react";

// Generic API hook for handling API calls with loading, error, and data states
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// Hook for API calls that require manual triggering (like POST, PUT, DELETE)
export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return result;
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("API Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};

// Hook specifically for paginated data
export const usePaginatedApi = (
  apiCall,
  initialPage = 1,
  initialPageSize = 10
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(page, pageSize);

      if (Array.isArray(result)) {
        setData(result);
        setTotalCount(result.length);
      } else {
        setData(result.data || result.items || []);
        setTotalCount(result.totalCount || result.total || 0);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  }, [apiCall, page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  const goToPage = (newPage) => {
    setPage(newPage);
  };

  const changePageSize = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  };

  return {
    data,
    loading,
    error,
    page,
    pageSize,
    totalCount,
    refetch,
    goToPage,
    changePageSize,
  };
};

export default { useApi, useApiCall, usePaginatedApi };
