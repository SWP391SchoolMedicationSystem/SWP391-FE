import apiClient, { API_ENDPOINTS, buildApiUrl } from './config.js';

export const healthCheckService = {
  // Get all health checks
  getAllHealthChecks: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH_CHECK.GET_ALL);
      return response;
    } catch (error) {
      console.error('Error fetching health checks:', error);
      throw error;
    }
  },

  // Get health check by ID
  getHealthCheckById: async (id) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.HEALTH_CHECK.GET_BY_ID, id);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching health check by ID:', error);
      throw error;
    }
  },

  // Get health checks by student ID
  getHealthChecksByStudent: async (studentId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.HEALTH_CHECK.GET_BY_STUDENT, studentId);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching health checks by student:', error);
      throw error;
    }
  },

  // Add new health check
  addHealthCheck: async (healthCheckData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.HEALTH_CHECK.ADD, healthCheckData);
      return response;
    } catch (error) {
      console.error('Error adding health check:', error);
      throw error;
    }
  },

  // Update health check
  updateHealthCheck: async (id, healthCheckData) => {
    try {
      // Include the checkid in the request body for PUT requests
      const updateData = {
        checkid: id,
        studentid: healthCheckData.studentid,
        studentName: healthCheckData.studentName || 'string',
        checkdate: healthCheckData.checkdate,
        staffid: healthCheckData.staffid,
        height: healthCheckData.height || 0,
        weight: healthCheckData.weight || 0,
        visionleft: healthCheckData.visionleft || 0,
        visionright: healthCheckData.visionright || 0,
        bloodpressure: healthCheckData.bloodpressure || 'string',
        notes: healthCheckData.notes || 'string'
      };
      const response = await apiClient.put(API_ENDPOINTS.HEALTH_CHECK.UPDATE, updateData);
      return response;
    } catch (error) {
      console.error('Error updating health check:', error);
      throw error;
    }
  },

  // Delete health check
  deleteHealthCheck: async (id) => {
    try {
      // DELETE endpoint uses ID in URL path: /HealthCheck/{id}
      const url = buildApiUrl(API_ENDPOINTS.HEALTH_CHECK.DELETE, id);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error deleting health check:', error);
      throw error;
    }
  },
};

export default healthCheckService; 