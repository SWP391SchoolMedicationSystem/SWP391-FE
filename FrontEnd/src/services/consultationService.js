import apiClient, { API_ENDPOINTS, buildApiUrl } from "./config.js";

// ✅ CONSULTATION SERVICE - REAL API IMPLEMENTATION
// Backend APIs available in ConsultationController

// Data transformation functions
const mapConsultationRequest = (apiData) => ({
  id: apiData.consultationid,
  consultationId: apiData.consultationid,
  parentId: apiData.parentid,
  studentId: apiData.studentid,
  typeId: apiData.typeid,
  title: apiData.title,
  content: apiData.content,
  status: apiData.status,
  priority: apiData.priority,
  createdAt: apiData.createdat,
  updatedAt: apiData.updatedat,
  isDeleted: apiData.isdeleted,

  // Computed fields for UI
  createdDate: apiData.createdat ? apiData.createdat.split("T")[0] : null,
  formattedDate: apiData.createdat
    ? new Date(apiData.createdat).toLocaleDateString("vi-VN")
    : "N/A",
});

const mapConsultationType = (apiData) => ({
  id: apiData.typeid,
  typeId: apiData.typeid,
  name: apiData.typename,
  typeName: apiData.typename,
  description: apiData.description,
  isDeleted: apiData.isdeleted,
});

// Consultation Types Services
export const consultationTypeService = {
  // Get all consultation types
  getAll: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CONSULTATION.GET_ALL_TYPES
      );
      return Array.isArray(response) ? response.map(mapConsultationType) : [];
    } catch (error) {
      console.error("Error getting consultation types:", error);
      // Return fallback data if API fails
      return [
        {
          id: 1,
          typeId: 1,
          name: "Khám tổng quát",
          typeName: "Khám tổng quát",
          description: "Khám sức khỏe tổng quát",
        },
        {
          id: 2,
          typeId: 2,
          name: "Tư vấn dinh dưỡng",
          typeName: "Tư vấn dinh dưỡng",
          description: "Tư vấn chế độ ăn uống",
        },
        {
          id: 3,
          typeId: 3,
          name: "Tư vấn thuốc",
          typeName: "Tư vấn thuốc",
          description: "Tư vấn về việc sử dụng thuốc",
        },
        {
          id: 4,
          typeId: 4,
          name: "Khám bệnh",
          typeName: "Khám bệnh",
          description: "Khám và điều trị bệnh",
        },
      ];
    }
  },

  // Create consultation type (Admin/Manager only)
  create: async (typeData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.CONSULTATION.CREATE_TYPE,
        typeData
      );
      return mapConsultationType(response);
    } catch (error) {
      console.error("Error creating consultation type:", error);
      throw error;
    }
  },

  // Update consultation type (Admin/Manager only)
  update: async (typeData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.CONSULTATION.UPDATE_TYPE,
        typeData
      );
      return mapConsultationType(response);
    } catch (error) {
      console.error("Error updating consultation type:", error);
      throw error;
    }
  },

  // Delete consultation type (Admin/Manager only)
  delete: async (typeId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.CONSULTATION.DELETE_TYPE, typeId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error deleting consultation type:", error);
      throw error;
    }
  },
};

// Consultation Requests Services
export const consultationRequestService = {
  // Get all consultation requests
  getAll: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CONSULTATION.GET_ALL_REQUESTS
      );
      return Array.isArray(response)
        ? response.map(mapConsultationRequest)
        : [];
    } catch (error) {
      console.error("Error getting all consultation requests:", error);
      throw error;
    }
  },

  // Get consultations by parent ID
  getByParentId: async (parentId) => {
    try {
      const allConsultations = await consultationRequestService.getAll();
      return allConsultations.filter(
        (consultation) => consultation.parentId === parentId
      );
    } catch (error) {
      console.error("Error getting consultations by parent ID:", error);
      return [];
    }
  },

  // Get consultations by student ID
  getByStudentId: async (studentId) => {
    try {
      const allConsultations = await consultationRequestService.getAll();
      return allConsultations.filter(
        (consultation) => consultation.studentId === studentId
      );
    } catch (error) {
      console.error("Error getting consultations by student ID:", error);
      return [];
    }
  },

  // Create consultation request
  create: async (requestData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.CONSULTATION.CREATE_REQUEST,
        requestData
      );
      return mapConsultationRequest(response);
    } catch (error) {
      console.error("Error creating consultation request:", error);
      throw error;
    }
  },

  // Update consultation request
  update: async (requestData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.CONSULTATION.UPDATE_REQUEST,
        requestData
      );
      return mapConsultationRequest(response);
    } catch (error) {
      console.error("Error updating consultation request:", error);
      throw error;
    }
  },

  // Delete consultation request
  delete: async (requestId) => {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.CONSULTATION.DELETE_REQUEST,
        requestId
      );
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error deleting consultation request:", error);
      throw error;
    }
  },
};

// Combined service for convenience
export const consultationService = {
  types: consultationTypeService,
  requests: consultationRequestService,

  // Quick access methods
  getAllTypes: consultationTypeService.getAll,
  getAllRequests: consultationRequestService.getAll,
  getRequestsByParent: consultationRequestService.getByParentId,
  getRequestsByStudent: consultationRequestService.getByStudentId,
  createRequest: consultationRequestService.create,
  updateRequest: consultationRequestService.update,
  deleteRequest: consultationRequestService.delete,
};

export default consultationService;
