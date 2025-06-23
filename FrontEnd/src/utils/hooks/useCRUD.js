import { useState, useCallback } from "react";

// Custom hook for CRUD operations
export const useCRUD = (initialData = [], apiConfig = {}) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Extract API configuration
  const { baseEndpoint = "", endpoints = {} } = apiConfig;

  // Generic API call function
  const callAPI = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // CRUD operations
  const operations = {
    // Read all
    fetchAll: useCallback(
      async (customEndpoint) => {
        const endpoint = customEndpoint || endpoints.fetchAll || baseEndpoint;
        try {
          const result = await callAPI(endpoint);
          setData(result.data || result);
          return result;
        } catch (err) {
          console.error("Fetch error:", err);
        }
      },
      [callAPI, endpoints.fetchAll, baseEndpoint]
    ),

    // Create
    create: useCallback(
      async (newItem, customEndpoint) => {
        const endpoint = customEndpoint || endpoints.create || baseEndpoint;
        try {
          const result = await callAPI(endpoint, {
            method: "POST",
            body: JSON.stringify(newItem),
          });

          if (result.success) {
            setData((prev) => [...prev, result.data]);
          }
          return result;
        } catch (err) {
          console.error("Create error:", err);
          throw err;
        }
      },
      [callAPI, endpoints.create, baseEndpoint]
    ),

    // Update
    update: useCallback(
      async (id, updatedItem, customEndpoint) => {
        const endpoint =
          customEndpoint ||
          (endpoints.update
            ? `${endpoints.update}/${id}`
            : `${baseEndpoint}/${id}`);
        try {
          const result = await callAPI(endpoint, {
            method: "PUT",
            body: JSON.stringify(updatedItem),
          });

          if (result.success) {
            setData((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, ...updatedItem } : item
              )
            );
          }
          return result;
        } catch (err) {
          console.error("Update error:", err);
          throw err;
        }
      },
      [callAPI, endpoints.update, baseEndpoint]
    ),

    // Delete (soft delete by status change)
    remove: useCallback(
      async (id, isDeleted = true, customEndpoint) => {
        const endpoint =
          customEndpoint ||
          (endpoints.delete
            ? `${endpoints.delete}/${id}`
            : `${baseEndpoint}/${id}`);
        try {
          const result = await callAPI(endpoint, {
            method: "PUT",
            body: JSON.stringify({ isDeleted }),
          });

          if (result.success) {
            setData((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, isDeleted } : item
              )
            );
          }
          return result;
        } catch (err) {
          console.error("Delete error:", err);
          throw err;
        }
      },
      [callAPI, endpoints.delete, baseEndpoint]
    ),

    // File upload
    uploadFile: useCallback(
      async (file, additionalData = {}, customEndpoint) => {
        const endpoint =
          customEndpoint || endpoints.upload || `${baseEndpoint}/upload`;
        setLoading(true);
        setError(null);

        try {
          const formData = new FormData();
          formData.append("file", file);

          Object.keys(additionalData).forEach((key) => {
            formData.append(key, additionalData[key]);
          });

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed! status: ${response.status}`);
          }

          const result = await response.json();
          return result;
        } catch (err) {
          setError(err.message);
          throw err;
        } finally {
          setLoading(false);
        }
      },
      [endpoints.upload, baseEndpoint]
    ),

    // Generic API call (for custom operations)
    callAPI: useCallback(
      async (endpoint, options = {}) => {
        return await callAPI(endpoint, options);
      },
      [callAPI]
    ),
  };

  return {
    data,
    setData,
    loading,
    error,
    setError,
    ...operations,
  };
};

// Hook for filtering and searching
export const useFilter = (data, initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) => {
    // Search filter
    const matchesSearch =
      !searchTerm ||
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Custom filters
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value || value === "") return true;
      return item[key] === value;
    });

    return matchesSearch && matchesFilters;
  });

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchTerm("");
  }, [initialFilters]);

  return {
    filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
  };
};

// Hook for modal management
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("view"); // 'view', 'edit', 'create'
  const [currentItem, setCurrentItem] = useState(null);

  const openModal = useCallback((item = null, modalMode = "view") => {
    setCurrentItem(item);
    setMode(modalMode);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setCurrentItem(null);
    setMode("view");
  }, []);

  return {
    isOpen,
    mode,
    currentItem,
    openModal,
    closeModal,
    setCurrentItem,
  };
};
