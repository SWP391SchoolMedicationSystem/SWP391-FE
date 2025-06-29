import apiClient, { API_ENDPOINTS, buildApiUrl } from "./config.js";

// Nurse Health Records Services
export const nurseHealthService = {
  // Get all health records
  getAllHealthRecords: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH_RECORD.GET_ALL);
      return response;
    } catch (error) {
      console.error("Error getting all health records:", error);
      throw error;
    }
  },

  // Get health records by student ID
  getHealthRecordsByStudent: async (studentId) => {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT,
        studentId
      );
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error("Error getting health records by student:", error);
      throw error;
    }
  },

  // Create new health record
  createHealthRecord: async (healthRecordData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.HEALTH_RECORD.ADD,
        healthRecordData
      );
      return response;
    } catch (error) {
      console.error("Error creating health record:", error);
      throw error;
    }
  },

  // Update health record
  updateHealthRecord: async (recordId, healthRecordData) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.HEALTH_RECORD.UPDATE, recordId);
      const response = await apiClient.put(url, healthRecordData);
      return response;
    } catch (error) {
      console.error("Error updating health record:", error);
      throw error;
    }
  },
};

// Mapping function để chuẩn hoá dữ liệu blog cho Nurse UI
const mapBlogData = (apiBlog) => ({
  id: apiBlog.id || apiBlog.blogid || apiBlog.blogId,
  title: apiBlog.title,
  content: apiBlog.content,
  author: apiBlog.author || apiBlog.createdByName || "Unknown",
  category: apiBlog.category || "N/A",
  status: apiBlog.status,
  createdDate: apiBlog.createdAt?.split("T")[0] || apiBlog.createdDate || "N/A",
  views: apiBlog.views || apiBlog.readCount || 0,
  featured: apiBlog.featured || false,
  isDeleted: apiBlog.isDeleted ?? apiBlog.isdeleted ?? false,
});

// Nurse Blog Services
export const nurseBlogService = {
  // Get all blogs (for nurse to see their own posts)
  getAllBlogs: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BLOG.GET_ALL);
      return Array.isArray(response) ? response.map(mapBlogData) : [];
    } catch (error) {
      console.error("Error getting all blogs:", error);
      throw error;
    }
  },

  // Create new blog post
  createBlog: async (blogData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.BLOG.ADD, blogData);
      return response;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  },

  // Update blog post
  updateBlog: async (blogId, blogData) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.BLOG.UPDATE, blogId);

      const { title, content, status, image, updatedBy, isDeleted } = blogData;

      const payload = {
        title,
        content,
        status,
        image,
        isDeleted: typeof isDeleted === "boolean" ? isDeleted : false,
        updatedBy:
          updatedBy ||
          JSON.parse(localStorage.getItem("userInfo") || "{}").userId ||
          0,
        updatedAt: new Date().toISOString(),
      };

      const response = await apiClient.put(url, payload);
      return response;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  },

  // Delete blog post
  deleteBlog: async (blogId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.BLOG.DELETE, blogId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }
  },

  // Get blog by ID (for editing/view)
  getBlogById: async (blogId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.BLOG.GET_BY_ID, blogId);
      const response = await apiClient.get(url);
      return mapBlogData(response);
    } catch (error) {
      console.error("Error getting blog by ID:", error);
      throw error;
    }
  },
};

// Data mapping function for student data
const mapStudentDataForNurse = (apiStudent) => {
  return {
    id: apiStudent.studentid,
    studentId: apiStudent.studentCode || `ST${apiStudent.studentid}`,
    fullName: apiStudent.fullname,
    dateOfBirth: apiStudent.dob,
    age: apiStudent.age,
    gender: apiStudent.gender === true ? "Nam" : "Nữ",
    bloodType: apiStudent.bloodType || "Chưa có thông tin",
    classId: apiStudent.classid,
    parentId: apiStudent.parentid,
    className: `Lớp ${apiStudent.classid}`,
    parentName: "Chưa có thông tin", // API doesn't return parent info
    parentPhone: "Chưa có thông tin",
    healthStatus: "Bình thường", // Default value
    enrollmentDate: apiStudent.createdAt
      ? apiStudent.createdAt.split("T")[0]
      : "Chưa có thông tin",
    allergies: "Chưa có thông tin",
    emergencyContact: "Chưa có thông tin",
    height: "Chưa có thông tin",
    weight: "Chưa có thông tin",
    notes: "Chưa có thông tin",
  };
};

// Nurse Student Services
export const nurseStudentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL);
      // Transform API response to match component expected structure
      if (Array.isArray(response)) {
        return response.map(mapStudentDataForNurse);
      }
      return [];
    } catch (error) {
      console.error("Error getting all students:", error);
      throw error;
    }
  },

  // Get student by ID
  getStudentById: async (studentId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STUDENT.GET_BY_ID, studentId);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error("Error getting student by ID:", error);
      throw error;
    }
  },
};

// Nurse Notification Services
export const nurseNotificationService = {
  // Get notifications for staff
  getNotifications: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.NOTIFICATION.GET_FOR_STAFF
      );
      return response;
    } catch (error) {
      console.error("Error getting nurse notifications:", error);
      throw error;
    }
  },

  // Create notification for parents
  createNotificationForParents: async (notificationData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.NOTIFICATION.CREATE_FOR_PARENT,
        notificationData
      );
      return response;
    } catch (error) {
      console.error("Error creating notification for parents:", error);
      throw error;
    }
  },

  // Mark notification as read (delete)
  markAsRead: async (notificationId) => {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.NOTIFICATION.DELETE,
        notificationId
      );
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },
};

// Medicine Services - Real API Integration
export const nurseMedicationService = {
  // Get all medicines
  getAllMedicines: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MEDICINE.GET_ALL);
      return Array.isArray(response) ? response.map(mapMedicineData) : [];
    } catch (error) {
      console.error("Error getting all medicines:", error);
      throw error;
    }
  },

  // Search medicines by name
  searchMedicinesByName: async (searchTerm) => {
    try {
      const url = `${
        API_ENDPOINTS.MEDICINE.SEARCH_BY_NAME
      }?searchTerm=${encodeURIComponent(searchTerm)}`;
      const response = await apiClient.get(url);
      return Array.isArray(response) ? response.map(mapMedicineData) : [];
    } catch (error) {
      console.error("Error searching medicines by name:", error);
      throw error;
    }
  },

  // Add new medicine
  addMedicine: async (medicineData) => {
    try {
      const payload = {
        medicinename: medicineData.medicinename,
        medicinecategoryid: medicineData.medicinecategoryid,
        type: medicineData.type,
        quantity: medicineData.quantity,
        createdat: new Date().toISOString(),
        createdby:
          medicineData.createdby ||
          JSON.parse(localStorage.getItem("userInfo") || "{}").fullName ||
          "Nurse",
      };

      const response = await apiClient.post(
        API_ENDPOINTS.MEDICINE.ADD,
        payload
      );
      return response;
    } catch (error) {
      console.error("Error adding medicine:", error);
      throw error;
    }
  },

  // Update medicine
  updateMedicine: async (medicineId, medicineData) => {
    try {
      const payload = {
        medicineid: medicineId,
        medicinename: medicineData.medicinename,
        medicinecategoryid: medicineData.medicinecategoryid,
        type: medicineData.type,
        quantity: medicineData.quantity,
        updatedat: new Date().toISOString(),
        updatedby:
          medicineData.updatedby ||
          JSON.parse(localStorage.getItem("userInfo") || "{}").fullName ||
          "Nurse",
      };

      const response = await apiClient.put(
        API_ENDPOINTS.MEDICINE.UPDATE,
        payload
      );
      return response;
    } catch (error) {
      console.error("Error updating medicine:", error);
      throw error;
    }
  },

  // Delete medicine
  deleteMedicine: async (medicineId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.MEDICINE.DELETE, medicineId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error deleting medicine:", error);
      throw error;
    }
  },
};

// Helper function to map medicine data from API
const mapMedicineData = (apiMedicine) => {
  return {
    id: apiMedicine.medicineid,
    medicineName: apiMedicine.medicinename,
    categoryId: apiMedicine.medicinecategoryid,
    type: apiMedicine.type,
    quantity: apiMedicine.quantity,
    createdAt: apiMedicine.createdat
      ? new Date(apiMedicine.createdat).toLocaleDateString("vi-VN")
      : "Chưa có thông tin",
    updatedAt: apiMedicine.updatedat
      ? new Date(apiMedicine.updatedat).toLocaleDateString("vi-VN")
      : "Chưa cập nhật",
    createdBy: apiMedicine.createdby || "Hệ thống",
    updatedBy: apiMedicine.updatedby || null,
    // Original data for editing
    originalData: apiMedicine,
  };
};

// Vaccination Services (Need to create API endpoints)
export const nurseVaccinationService = {
  // Get vaccination list - MOCK DATA (API chưa có)
  getVaccinationList: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            studentName: "Nguyễn Văn An",
            vaccineName: "Vắc xin COVID-19",
            scheduledDate: "2024-03-20",
            status: "scheduled",
            dose: "Mũi 1",
            notes: "Kiểm tra sức khỏe trước khi tiêm",
          },
          {
            id: 2,
            studentName: "Trần Thị Bình",
            vaccineName: "Vắc xin Cúm mùa",
            scheduledDate: "2024-03-18",
            status: "completed",
            dose: "Mũi duy nhất",
            completedDate: "2024-03-18",
          },
        ]);
      }, 500);
    });
  },

  // Update vaccination status - MOCK DATA (API chưa có)
  updateVaccinationStatus: async (vaccinationId, status) => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: vaccinationId,
          status: status,
          updatedAt: new Date().toISOString(),
        });
      }, 300);
    });
  },
};

// Chat Services (Need to create API endpoints)
export const nurseChatService = {
  // Get chat messages with parents - MOCK DATA (API chưa có)
  getChatMessages: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            parentName: "Nguyễn Thị Lan",
            studentName: "Nguyễn Văn An",
            lastMessage: "Con em hôm nay bị sốt nhẹ",
            timestamp: "2024-03-15 09:30",
            unreadCount: 2,
            status: "active",
          },
          {
            id: 2,
            parentName: "Trần Văn Nam",
            studentName: "Trần Thị Bình",
            lastMessage: "Cảm ơn y tá đã tư vấn",
            timestamp: "2024-03-14 16:45",
            unreadCount: 0,
            status: "resolved",
          },
        ]);
      }, 500);
    });
  },

  // Send message to parent - MOCK DATA (API chưa có)
  sendMessage: async (messageData) => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...messageData,
          timestamp: new Date().toLocaleString("vi-VN"),
        });
      }, 300);
    });
  },
};

export default {
  nurseHealthService,
  nurseBlogService,
  nurseStudentService,
  nurseNotificationService,
  nurseMedicationService,
  nurseVaccinationService,
  nurseChatService,
};
