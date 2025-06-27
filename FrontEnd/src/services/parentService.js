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

  // Get my children (students under this parent)
  getMyChildren: async (parentId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STUDENT.GET_BY_PARENT, parentId);
      console.log("🌐 Calling Parent API:", url);
      console.log("👨‍👩‍👧‍👦 Parent ID:", parentId);

      const response = await apiClient.get(url);
      console.log("📥 Raw API response - My Children:", response);
      console.log("📊 Response is array?", Array.isArray(response));
      console.log("📈 Children count:", response?.length);

      return response;
    } catch (error) {
      console.error("❌ Error getting my children:", error);
      throw error;
    }
  },

  // Get health records for a specific child
  getChildHealthRecords: async (studentId) => {
    try {
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT}?studentId=${studentId}`;
      console.log("🌐 Calling Health Records API:", url);
      console.log("🆔 Student ID for health records:", studentId);

      const response = await apiClient.get(url);
      console.log("📥 Raw API response - Health Records:", response);
      console.log("📊 Response is array?", Array.isArray(response));
      console.log("📈 Records count:", response?.length);

      const records = Array.isArray(response) ? response : [];
      const mappedRecords = records.map(parentService.mapHealthRecordData);
      console.log("✅ Mapped health records:", mappedRecords);

      return mappedRecords;
    } catch (error) {
      console.error("❌ Error getting child health records:", error);
      return [];
    }
  },

  // Update health record
  updateHealthRecord: async (recordId, recordData) => {
    try {
      const url = `${API_ENDPOINTS.HEALTH_RECORD.UPDATE}?id=${recordId}`;
      console.log("🌐 Calling Update Health Record API:", url);
      console.log("📝 Record ID:", recordId);
      console.log("📊 Update data:", recordData);

      const response = await apiClient.put(url, recordData);
      console.log("✅ Health record updated successfully:", response);

      return response;
    } catch (error) {
      console.error("❌ Error updating health record:", error);
      throw error;
    }
  },

  // Map health record data for display
  mapHealthRecordData: (apiRecord) => {
    const getCategoryName = (categoryId) => {
      const categories = {
        1: "Khám tổng quát",
        2: "Dị ứng",
        3: "Tiêm chủng",
        4: "Khám định kỳ",
        5: "Tai nạn/Chấn thương",
        6: "Khác",
      };
      return categories[categoryId] || `Danh mục ${categoryId}`;
    };

    return {
      id: apiRecord.healthrecordid || apiRecord.id,
      studentId: apiRecord.studentid,
      categoryId: apiRecord.healthcategoryid,
      categoryName: getCategoryName(apiRecord.healthcategoryid),
      date: apiRecord.healthrecorddate
        ? new Date(apiRecord.healthrecorddate).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Chưa có ngày",
      title: apiRecord.healthrecordtitle || "Chưa có tiêu đề",
      description: apiRecord.healthrecorddescription || "Chưa có mô tả",
      staffId: apiRecord.staffid,
      isConfirmed: apiRecord.isconfirm || false,
      createdBy: apiRecord.createdby || "Hệ thống",
      createdDate: apiRecord.createddate
        ? new Date(apiRecord.createddate).toLocaleDateString("vi-VN")
        : null,
      modifiedBy: apiRecord.modifiedby,
      modifiedDate: apiRecord.modifieddate
        ? new Date(apiRecord.modifieddate).toLocaleDateString("vi-VN")
        : null,
      isDeleted: apiRecord.isdeleted || false,
    };
  },

  // Update parent profile
  updateProfile: async (parentData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const payload = {
        parentid: userInfo.userId || 0,
        fullname: parentData.fullname || "",
        email: parentData.email || "",
        phone: parentData.phone || "",
        address: parentData.address || "",
      };

      const response = await apiClient.put(
        "https://api-schoolhealth.purintech.id.vn/api/Parent/parent",
        payload
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
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT}?studentId=${studentId}`;
      const response = await apiClient.get(url);
      const records = Array.isArray(response) ? response : [];
      return records.map(parentService.mapHealthRecordData);
    } catch (error) {
      console.error("Error getting health records:", error);
      return [];
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
