import { useState, useCallback } from "react";
import {
  consultationRequestService,
  consultationTypeService,
} from "../../services/consultationService.js";

// ✅ CONSULTATION HOOKS - REAL API IMPLEMENTATION

// Hook for consultation types
export const useConsultationTypes = () => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultationTypeService.getAll();
      setTypes(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch consultation types");
      console.error("Error fetching consultation types:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data: types,
    types,
    loading,
    error,
    fetchTypes,
    refetch: fetchTypes,
  };
};

// Hook for consultation requests
export const useConsultationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultationRequestService.getAll();
      setRequests(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch consultation requests");
      console.error("Error fetching consultation requests:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByParentId = useCallback(async (parentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultationRequestService.getByParentId(parentId);
      setRequests(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch parent consultations");
      console.error("Error fetching parent consultations:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByStudentId = useCallback(async (studentId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await consultationRequestService.getByStudentId(studentId);
      setRequests(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch student consultations");
      console.error("Error fetching student consultations:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data: requests,
    requests,
    loading,
    error,
    fetchRequests,
    fetchByParentId,
    fetchByStudentId,
    refetch: fetchRequests,
  };
};

// Hook for consultation CRUD operations
export const useConsultationCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const createRequest = useCallback(async (requestData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await consultationRequestService.create(requestData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || "Failed to create consultation request");
      console.error("Error creating consultation request:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRequest = useCallback(async (requestData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await consultationRequestService.update(requestData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || "Failed to update consultation request");
      console.error("Error updating consultation request:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRequest = useCallback(async (requestId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await consultationRequestService.delete(requestId);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || "Failed to delete consultation request");
      console.error("Error deleting consultation request:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createType = useCallback(async (typeData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await consultationTypeService.create(typeData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || "Failed to create consultation type");
      console.error("Error creating consultation type:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateType = useCallback(async (typeData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await consultationTypeService.update(typeData);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || "Failed to update consultation type");
      console.error("Error updating consultation type:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteType = useCallback(async (typeId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await consultationTypeService.delete(typeId);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err.message || "Failed to delete consultation type");
      console.error("Error deleting consultation type:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear states
  const clearError = useCallback(() => setError(null), []);
  const clearSuccess = useCallback(() => setSuccess(false), []);

  return {
    loading,
    error,
    success,
    createRequest,
    updateRequest,
    deleteRequest,
    createType,
    updateType,
    deleteType,
    clearError,
    clearSuccess,
  };
};

// Combined hook for full consultation functionality
export const useConsultation = () => {
  const types = useConsultationTypes();
  const requests = useConsultationRequests();
  const crud = useConsultationCRUD();

  // Combined refresh function
  const refreshData = useCallback(async () => {
    await Promise.all([types.refetch(), requests.refetch()]);
  }, [types.refetch, requests.refetch]);

  return {
    types,
    requests,
    crud,
    refreshData,
    // Quick access
    loading: types.loading || requests.loading || crud.loading,
    error: types.error || requests.error || crud.error,
  };
};

export default {
  useConsultationTypes,
  useConsultationRequests,
  useConsultationCRUD,
  useConsultation,
};
