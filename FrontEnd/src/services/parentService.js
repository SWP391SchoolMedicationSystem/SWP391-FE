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

  // Get students of current parent
  getStudents: async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      console.log("🔍 Current user info:", userInfo);

      if (!userInfo.userId) {
        throw new Error("User ID not found in localStorage");
      }

      // Step 1: Get parent record to find parentId
      console.log("📞 Fetching parent data...");
      const parentResponse = await apiClient.get(API_ENDPOINTS.PARENT.GET_ALL);
      console.log("👨‍👩‍👧‍👦 Parent response:", parentResponse);

      // Find the parent record that matches the current user's userId
      // Try multiple possible field names for userId
      const currentParent = Array.isArray(parentResponse)
        ? parentResponse.find(
            (parent) =>
              parent.userid === userInfo.userId ||
              parent.userId === userInfo.userId ||
              parent.UserId === userInfo.userId ||
              parent.id === userInfo.userId ||
              parent.parentid === userInfo.userId ||
              parent.parentId === userInfo.userId
          )
        : null;

      if (!currentParent) {
        console.error("❌ Parent not found for userId:", userInfo.userId);
        console.error("❌ Available parent records:", parentResponse);
        console.error(
          "❌ Searching for userId:",
          userInfo.userId,
          typeof userInfo.userId
        );

        // Try to find any parent record for debugging
        if (Array.isArray(parentResponse) && parentResponse.length > 0) {
          console.error(
            "❌ Sample parent record structure:",
            parentResponse[0]
          );

          // TEMPORARY FALLBACK: Use first parent for testing
          console.warn("⚠️ Using first parent as fallback for testing...");
          const fallbackParent = parentResponse[0];
          console.log("✅ Using fallback parent:", fallbackParent);

          // Use the fallback parent
          const parentId =
            fallbackParent.parentid ||
            fallbackParent.parentId ||
            fallbackParent.id;
          if (parentId) {
            const url = buildApiUrl(
              API_ENDPOINTS.STUDENT.GET_BY_PARENT_ID,
              parentId
            );
            console.log("📞 Fetching students from URL (fallback):", url);

            const response = await apiClient.get(url);
            console.log("🎓 Students response (fallback):", response);

            const students = Array.isArray(response) ? response : [];
            console.log(
              `✅ Found ${students.length} students for fallback parent`
            );

            return students;
          }
        }

        throw new Error(
          `Parent record not found for user ID: ${userInfo.userId}`
        );
      }

      console.log("✅ Found parent:", currentParent);

      // Step 2: Use NEW API to get students by parentId
      const url = buildApiUrl(
        API_ENDPOINTS.STUDENT.GET_BY_PARENT_ID,
        currentParent.parentid
      );
      console.log("📞 Fetching students from URL:", url);

      const response = await apiClient.get(url);
      console.log("🎓 Students response:", response);

      // Transform data if needed
      const students = Array.isArray(response) ? response : [];
      console.log(`✅ Found ${students.length} students for parent`);

      return students;
    } catch (error) {
      console.error("❌ Error getting parent students:", error);

      // Provide more specific error messages
      if (error.response?.status === 404) {
        throw new Error(
          "API endpoint not found - Backend chưa implement GetStudentsByParentId"
        );
      } else if (error.response?.status === 500) {
        throw new Error("Server error - Vui lòng thử lại sau");
      } else if (error.message.includes("Parent record not found")) {
        throw new Error(
          "Không tìm thấy thông tin phụ huynh - Vui lòng liên hệ quản trị viên"
        );
      }

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

// Consultation Services - ✅ REAL API IMPLEMENTATION
export const consultationService = {
  // Get all consultation types (for dropdowns)
  getConsultationTypes: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CONSULTATION.GET_ALL_TYPES
      );
      return response;
    } catch (error) {
      console.error("Error getting consultation types:", error);
      // Fallback to basic types if API fails
      return [
        {
          typeid: 1,
          typename: "Khám tổng quát",
          description: "Khám sức khỏe tổng quát",
        },
        {
          typeid: 2,
          typename: "Tư vấn dinh dưỡng",
          description: "Tư vấn chế độ ăn uống",
        },
        {
          typeid: 3,
          typename: "Tư vấn thuốc",
          description: "Tư vấn về việc sử dụng thuốc",
        },
      ];
    }
  },

  // Get all consultation requests
  getAllConsultations: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CONSULTATION.GET_ALL_REQUESTS
      );
      return response;
    } catch (error) {
      console.error("Error getting all consultations:", error);
      throw error;
    }
  },

  // Get consultations for specific parent (filtered by parentId)
  getConsultations: async (parentId = null) => {
    try {
      const allConsultations = await consultationService.getAllConsultations();

      // If parentId is provided, filter by it
      if (parentId) {
        return allConsultations.filter(
          (consultation) =>
            consultation.parentId === parentId ||
            consultation.parentid === parentId
        );
      }

      return allConsultations;
    } catch (error) {
      console.error("Error getting parent consultations:", error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  },

  // Create consultation request
  createConsultation: async (consultationData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.CONSULTATION.CREATE_REQUEST,
        consultationData
      );
      return response;
    } catch (error) {
      console.error("Error creating consultation:", error);
      throw error;
    }
  },

  // Update consultation request
  updateConsultation: async (consultationData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.CONSULTATION.UPDATE_REQUEST,
        consultationData
      );
      return response;
    } catch (error) {
      console.error("Error updating consultation:", error);
      throw error;
    }
  },

  // Delete consultation request
  deleteConsultation: async (consultationId) => {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.CONSULTATION.DELETE_REQUEST,
        consultationId
      );
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error deleting consultation:", error);
      throw error;
    }
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
