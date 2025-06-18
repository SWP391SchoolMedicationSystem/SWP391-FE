import apiClient, { API_ENDPOINTS, buildApiUrl } from "./config.js";

// Parent Profile Services
export const parentService = {
  // Get current parent profile
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PARENT.GET);
      return response;
    } catch (error) {
      console.error("Error getting parent profile:", error);
      throw error;
    }
  },

  // Update parent profile
  updateProfile: async (parentData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.PARENT.UPDATE,
        parentData
      );
      return response;
    } catch (error) {
      console.error("Error updating parent profile:", error);
      throw error;
    }
  },

  // Register new parent
  register: async (parentData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.PARENT.REGISTER,
        parentData
      );
      return response;
    } catch (error) {
      console.error("Error registering parent:", error);
      throw error;
    }
  },
};

// Parent Notifications Services
export const parentNotificationService = {
  // Get notifications for parent
  getNotifications: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.NOTIFICATION.GET_FOR_PARENT
      );
      return response;
    } catch (error) {
      console.error("Error getting parent notifications:", error);
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

// Parent Health Records Services
export const parentHealthService = {
  // Get health records for student
  getHealthRecords: async (studentId) => {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT,
        studentId
      );
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error("Error getting health records:", error);
      throw error;
    }
  },
};

// Parent Blog Services
export const parentBlogService = {
  // Get published blogs (approved by manager)
  getPublishedBlogs: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BLOG.GET_PUBLISHED);
      return response;
    } catch (error) {
      console.error("Error getting published blogs:", error);
      throw error;
    }
  },
};

// Consultation Services (Need to create API endpoints)
export const consultationService = {
  // Get consultations for parent - MOCK DATA (API chưa có)
  getConsultations: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            studentName: "Nguyễn Văn An",
            type: "Khám tổng quát",
            status: "Đang chờ",
            date: "2024-03-15",
            doctor: "BS. Trần Thị Lan",
            priority: "medium",
            description: "Đau bụng thường xuyên sau khi ăn",
          },
          {
            id: 2,
            studentName: "Trần Thị Bình",
            type: "Tư vấn dinh dưỡng",
            status: "Đã hoàn thành",
            date: "2024-03-12",
            doctor: "BS. Lê Văn Nam",
            priority: "low",
            description: "Tư vấn chế độ ăn cho trẻ biếng ăn",
          },
        ]);
      }, 500);
    });
  },

  // Create consultation request - MOCK DATA (API chưa có)
  createConsultation: async (consultationData) => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...consultationData,
          status: "Đang chờ",
          createdAt: new Date().toISOString(),
        });
      }, 500);
    });
  },
};

// Chat Services (Need to create API endpoints)
export const parentChatService = {
  // Get chat messages with nurse - MOCK DATA (API chưa có)
  getChatMessages: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            senderId: "parent",
            senderName: "Phụ huynh",
            message: "Chào y tá, con em hôm nay bị sốt nhẹ",
            timestamp: "2024-03-15 09:30",
            type: "text",
          },
          {
            id: 2,
            senderId: "nurse",
            senderName: "Y tá Mai",
            message:
              "Chào anh/chị. Nhiệt độ hiện tại của con là bao nhiêu độ ạ?",
            timestamp: "2024-03-15 09:35",
            type: "text",
          },
        ]);
      }, 500);
    });
  },

  // Send message to nurse - MOCK DATA (API chưa có)
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
  parentService,
  parentNotificationService,
  parentHealthService,
  parentBlogService,
  consultationService,
  parentChatService,
};
