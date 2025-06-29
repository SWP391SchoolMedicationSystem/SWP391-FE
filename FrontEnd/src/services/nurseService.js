import apiClient, { API_ENDPOINTS, buildApiUrl } from "./config.js";

// Import consultation service
import {
  consultationRequestService,
  consultationTypeService,
} from "./consultationService.js";

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
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT}?studentId=${studentId}`;
      const response = await apiClient.get(url);
      const records = Array.isArray(response) ? response : [];
      return records.map(nurseHealthService.mapHealthRecordData);
    } catch (error) {
      console.error("Error getting health records by student:", error);
      return [];
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
      // API endpoint: PUT /api/Blog/update (không cần ID trong URL)
      const url = API_ENDPOINTS.BLOG.UPDATE;

      // Backend UpdateBlogDTO expects exact field names
      const { title, content, status, image, updatedBy, isDeleted } = blogData;

      const payload = {
        blogID: blogId, // Backend expects "blogID"
        title: title,
        content: content,
        status: status || "Draft",
        image: image || null,
        isDeleted: typeof isDeleted === "boolean" ? isDeleted : false,
        updatedBy:
          updatedBy ||
          JSON.parse(localStorage.getItem("userInfo") || "{}").userId ||
          0,
      };

      console.log("Blog update payload:", payload);
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

// Helper function to convert classid to className
const getClassNameFromId = (classid) => {
  const classMap = {
    1: "Mầm",
    2: "Chồi",
    3: "Lá 1",
    4: "Lá 2",
    5: "Lá 3",
  };
  return classMap[classid] || `Lớp ${classid}`;
};

// Data mapping function for student data
const mapStudentDataForNurse = (apiStudent) => {
  console.log("🔄 Mapping API student data:", apiStudent);

  return {
    id: apiStudent.studentId, // Sử dụng studentId từ API (uppercase)
    studentId: apiStudent.studentCode || `ST${apiStudent.studentId}`,
    fullName: apiStudent.fullname,
    dateOfBirth: apiStudent.dob,
    age: apiStudent.age,
    gender: apiStudent.gender === true ? "Nam" : "Nữ",
    bloodType: apiStudent.bloodType || "Chưa có thông tin",
    classId: apiStudent.classid,
    parentId: apiStudent.parentid,
    className: getClassNameFromId(apiStudent.classid),
    parentName: apiStudent.listparent?.[0]?.fullname || "Chưa có thông tin",
    parentPhone: apiStudent.listparent?.[0]?.phone || "Chưa có thông tin",
    healthStatus: "Bình thường",
    enrollmentDate: apiStudent.createdAt
      ? apiStudent.createdAt.split("T")[0]
      : "Chưa có thông tin",
    allergies: "Chưa có thông tin",
    emergencyContact: apiStudent.listparent?.[0]?.phone || "Chưa có thông tin",
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
      console.log("🌐 Calling API:", API_ENDPOINTS.STUDENT.GET_ALL);
      const response = await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL);
      console.log("📥 Raw API response:", response);
      console.log("📊 Response is array?", Array.isArray(response));
      console.log("📈 Response length:", response?.length);

      if (Array.isArray(response)) {
        const mappedData = response.map(mapStudentDataForNurse);
        console.log("✅ Mapped student data:", mappedData);
        return mappedData;
      }
      console.log("⚠️ Response is not an array, returning empty array");
      return [];
    } catch (error) {
      console.error("❌ Error getting all students:", error);
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

// Consultation Services for Nurse
export const nurseConsultationService = {
  // Get all consultation requests (for Nurse to view)
  getAllRequests: consultationRequestService.getAll,

  // Get consultation types (for dropdowns)
  getTypes: consultationTypeService.getAll,

  // Update request status (Nurse can add notes/responses)
  updateRequest: consultationRequestService.update,

  // Get consultations by student ID (for student health records)
  getByStudentId: consultationRequestService.getByStudentId,

  // Create new consultation request on behalf of parent
  createRequest: consultationRequestService.create,
};

export default {
  nurseHealthService,
  nurseBlogService,
  nurseStudentService,
  nurseNotificationService,
  nurseMedicationService,
  nurseVaccinationService,
  nurseChatService,
  nurseConsultationService,
};
