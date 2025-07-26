import { useState, useCallback } from 'react';

const useLoading = (initialStates = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialStates);

  const setLoading = useCallback((key, value) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const startLoading = useCallback(
    key => {
      setLoading(key, true);
    },
    [setLoading]
  );

  const stopLoading = useCallback(
    key => {
      setLoading(key, false);
    },
    [setLoading]
  );

  const withLoading = useCallback(
    async (key, asyncFunction) => {
      try {
        startLoading(key);
        const result = await asyncFunction();
        return result;
      } finally {
        stopLoading(key);
      }
    },
    [startLoading, stopLoading]
  );

  const isLoading = useCallback(
    key => {
      return loadingStates[key] || false;
    },
    [loadingStates]
  );

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean);
  }, [loadingStates]);

  const resetAllLoading = useCallback(() => {
    setLoadingStates(initialStates);
  }, [initialStates]);

  return {
    loadingStates,
    setLoading,
    startLoading,
    stopLoading,
    withLoading,
    isLoading,
    isAnyLoading,
    resetAllLoading,
  };
};

export default useLoading;
