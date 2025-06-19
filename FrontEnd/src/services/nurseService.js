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

// Nurse Blog Services
export const nurseBlogService = {
  // Get all blogs (for nurse to see their own posts)
  getAllBlogs: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BLOG.GET_ALL);
      return response;
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
      const response = await apiClient.put(url, blogData);
      return response;
    } catch (error) {
      console.error("Error updating blog:", error);
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

// Medication Services (Need to create API endpoints)
export const nurseMedicationService = {
  // Get medication schedule - MOCK DATA (API chưa có)
  getMedicationSchedule: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            studentName: "Nguyễn Văn An",
            studentId: 1,
            medicationName: "Paracetamol",
            dosage: "500mg",
            frequency: "2 lần/ngày",
            startDate: "2024-03-10",
            endDate: "2024-03-15",
            time: ["08:00", "20:00"],
            status: "active",
            notes: "Uống sau ăn",
          },
          {
            id: 2,
            studentName: "Trần Thị Bình",
            studentId: 2,
            medicationName: "Vitamin C",
            dosage: "100mg",
            frequency: "1 lần/ngày",
            startDate: "2024-03-01",
            endDate: "2024-03-31",
            time: ["09:00"],
            status: "active",
            notes: "Tăng sức đề kháng",
          },
        ]);
      }, 500);
    });
  },

  // Handle medicine administration - MOCK DATA (API chưa có)
  handleMedicine: async (medicationId, action) => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: medicationId,
          action: action,
          timestamp: new Date().toISOString(),
          status: "completed",
        });
      }, 300);
    });
  },
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
