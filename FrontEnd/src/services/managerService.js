import apiClient, { API_ENDPOINTS, buildApiUrl } from "./config.js";

// Import consultation service
import {
  consultationRequestService,
  consultationTypeService,
} from "./consultationService.js";

// Helper function to convert classid to className
const getClassNameFromId = (classid) => {
  const classMap = {
    1: "Lớp Mầm",
    2: "Lớp Chồi",
    3: "Lớp Lá",
    // Có thể thêm nhiều lớp hơn nếu cần
  };
  return classMap[classid] || `Lớp ${classid}`;
};

// Data mapping functions
const mapStudentData = (apiStudent) => {
  console.log("Raw API student data:", apiStudent);

  // ID thực tế từ field studentId (không phải studentid)
  const actualId = apiStudent.studentId || apiStudent.id;
  console.log("Actual student ID for API calls:", actualId);

  // Get first parent from listparent array if available
  const firstParent =
    apiStudent.listparent && apiStudent.listparent.length > 0
      ? apiStudent.listparent[0]
      : null;

  // Format date of birth
  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa có thông tin";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  return {
    id: actualId, // Sử dụng studentId (số) cho API calls
    studentId:
      apiStudent.studentCode || `HS${String(actualId).padStart(3, "0")}`, // Mã học sinh hiển thị
    fullName: apiStudent.fullname || "Chưa có thông tin",
    dateOfBirth: formatDate(apiStudent.dob),
    age: apiStudent.age || 0,
    gender: apiStudent.gender === true ? "Nam" : "Nữ", // API returns boolean
    bloodType: apiStudent.bloodType || "Chưa có thông tin",
    classId: apiStudent.classid,
    parentId: apiStudent.parentid,
    className: getClassNameFromId(apiStudent.classid), // Map classid to className
    parentName: firstParent ? firstParent.fullname : "Chưa có thông tin",
    parentPhone: firstParent ? firstParent.phone : "Chưa có thông tin",
    parentEmail: firstParent ? firstParent.email : "Chưa có thông tin",
    address: firstParent ? firstParent.address : "Chưa có thông tin",
    healthStatus: "Bình thường", // Default value
    enrollmentDate: "Chưa có thông tin", // API không có field này
    // Additional fields that might be needed
    allergies: "Chưa có thông tin",
    emergencyContact: firstParent ? firstParent.phone : "Chưa có thông tin",
    height: "Chưa có thông tin",
    weight: "Chưa có thông tin",
    notes: "Chưa có thông tin",
    // Keep original fields for debugging
    originalStudentId: apiStudent.studentId,
    originalData: apiStudent,
  };
};

// Mapping function for blog data (ensures unified fields)
const mapBlogData = (apiBlog) => {
  return {
    id: apiBlog.id || apiBlog.blogid || apiBlog.blogId,
    title: apiBlog.title,
    content: apiBlog.content,
    author: "", // to be filled later
    category: apiBlog.category || "N/A",
    status: apiBlog.status,
    createdDate:
      apiBlog.createdAt?.split("T")[0] || apiBlog.createdDate || "N/A",
    featured: apiBlog.featured || false,
    isDeleted: apiBlog.isDeleted ?? apiBlog.isdeleted ?? false,
    createdById: apiBlog.createdBy || apiBlog.createdby || apiBlog.authorId,
  };
};

// Manager Blog Services
export const managerBlogService = {
  // Get all blogs (including pending ones for approval)
  getAllBlogs: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BLOG.GET_ALL);
      if (!Array.isArray(response)) return [];

      // Fetch staff list once
      let staffMap = {};
      try {
        const staffList = await apiClient.get(API_ENDPOINTS.STAFF.GET_ALL);
        if (Array.isArray(staffList)) {
          staffMap = staffList.reduce((acc, s) => {
            acc[s.staffid] = s.fullname;
            return acc;
          }, {});
        }
      } catch (err) {
        console.warn("Cannot fetch staff list", err);
      }

      return response.map((b) => {
        const mapped = mapBlogData(b);
        mapped.author =
          staffMap[mapped.createdById] || `User #${mapped.createdById || "?"}`;
        return mapped;
      });
    } catch (error) {
      console.error("Error getting all blogs:", error);
      throw error;
    }
  },

  // Approve blog
  approveBlog: async (blogId, approvalData) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.BLOG.APPROVE, blogId);
      const response = await apiClient.post(url, approvalData);
      return response;
    } catch (error) {
      console.error("Error approving blog:", error);
      throw error;
    }
  },

  // Reject blog
  rejectBlog: async (blogId, reason) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.BLOG.REJECT, blogId);
      const response = await apiClient.post(url, { reason });
      return response;
    } catch (error) {
      console.error("Error rejecting blog:", error);
      throw error;
    }
  },

  // Create blog post
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

  // Get blog by ID
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

// Manager Student Services
export const managerStudentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL);
      // Transform API response to match component expected structure
      if (Array.isArray(response)) {
        return response.map(mapStudentData);
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
      // Transform single student data
      return mapStudentData(response);
    } catch (error) {
      console.error("Error getting student by ID:", error);
      throw error;
    }
  },

  // Add single student
  addStudent: async (studentData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.STUDENT.ADD,
        studentData
      );
      return response;
    } catch (error) {
      console.error("Error adding student:", error);
      throw error;
    }
  },

  // Bulk add students
  bulkAddStudents: async (studentsData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.STUDENT.BULK_ADD,
        studentsData
      );
      return response;
    } catch (error) {
      console.error("Error bulk adding students:", error);
      throw error;
    }
  },

  // Update student
  updateStudent: async (updateData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.STUDENT.UPDATE,
        updateData
      );
      return response;
    } catch (error) {
      console.error("Error updating student:", error);
      throw error;
    }
  },

  // Delete student
  deleteStudent: async (studentId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STUDENT.DELETE, studentId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error deleting student:", error);
      throw error;
    }
  },
};

// Manager Staff Services
export const managerStaffService = {
  // Get all staff
  getAllStaff: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STAFF.GET_ALL);
      return response;
    } catch (error) {
      console.error("Error getting all staff:", error);
      throw error;
    }
  },

  // Register new staff
  registerStaff: async (staffData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.STAFF.REGISTER,
        staffData
      );
      return response;
    } catch (error) {
      console.error("Error registering staff:", error);
      throw error;
    }
  },

  // Update staff
  updateStaff: async (staffData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.STAFF.UPDATE,
        staffData
      );
      return response;
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  },

  // Delete staff
  deleteStaff: async (staffId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STAFF.DELETE, staffId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw error;
    }
  },
};

// Manager Notification Services
export const managerNotificationService = {
  // Get notifications for staff
  getNotifications: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.NOTIFICATION.GET_FOR_STAFF
      );
      return response;
    } catch (error) {
      console.error("Error getting manager notifications:", error);
      throw error;
    }
  },

  // Create notification for parents
  createNotificationForParents: async (notificationData) => {
    try {
      console.log("Service: Creating notification for parents");
      console.log(
        "Service: Endpoint:",
        API_ENDPOINTS.NOTIFICATION.CREATE_FOR_PARENT
      );
      console.log("Service: Data:", notificationData);

      const response = await apiClient.post(
        API_ENDPOINTS.NOTIFICATION.CREATE_FOR_PARENT,
        notificationData
      );

      console.log("Service: Response received:", response);
      return response;
    } catch (error) {
      console.error("Error creating notification for parents:", error);
      console.error("Error details:", error.response?.data || error.message);
      throw error;
    }
  },

  // Create notification for staff
  createNotificationForStaff: async (notificationData) => {
    try {
      console.log("Service: Creating notification for staff");
      console.log(
        "Service: Endpoint:",
        API_ENDPOINTS.NOTIFICATION.CREATE_FOR_STAFF
      );
      console.log("Service: Data:", notificationData);

      const response = await apiClient.post(
        API_ENDPOINTS.NOTIFICATION.CREATE_FOR_STAFF,
        notificationData
      );

      console.log("Service: Response received:", response);
      return response;
    } catch (error) {
      console.error("Error creating notification for staff:", error);
      console.error("Error details:", error.response?.data || error.message);
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

// Manager Email Services
export const managerEmailService = {
  // Get email templates
  getEmailTemplates: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EMAIL.GET_TEMPLATES);
      return response;
    } catch (error) {
      console.error("Error getting email templates:", error);
      throw error;
    }
  },

  // Send single email
  sendEmail: async (emailData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.EMAIL.SEND,
        emailData
      );
      return response;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  },

  // Send bulk emails
  sendBulkEmails: async (emailData) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.EMAIL.SEND_BY_LIST,
        emailData
      );
      return response;
    } catch (error) {
      console.error("Error sending bulk emails:", error);
      throw error;
    }
  },
};

// Manager Account Management Services
export const managerAccountService = {
  // Get all parents
  getAllParents: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PARENT.GET_ALL);
      return response;
    } catch (error) {
      console.error("Error getting all parents:", error);
      throw error;
    }
  },

  // Get parent by ID
  getParentById: async (parentId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.PARENT.GET_BY_ID, parentId);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error("Error getting parent by ID:", error);
      throw error;
    }
  },

  // Update parent
  updateParent: async (parentData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.PARENT.UPDATE,
        parentData
      );
      return response;
    } catch (error) {
      console.error("Error updating parent:", error);
      throw error;
    }
  },

  // Get all staff
  getAllStaff: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STAFF.GET_ALL);
      return response;
    } catch (error) {
      console.error("Error getting all staff:", error);
      throw error;
    }
  },

  // Update staff
  updateStaff: async (staffData) => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.STAFF.UPDATE,
        staffData
      );
      return response;
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  },

  // Delete parent
  deleteParent: async (parentId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.PARENT.DELETE, parentId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error deleting parent:", error);
      throw error;
    }
  },

  // Delete staff
  deleteStaff: async (staffId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STAFF.DELETE, staffId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw error;
    }
  },

  // Toggle parent status (using delete API for soft delete/activate)
  toggleParentStatus: async (parentId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.PARENT.DELETE, parentId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error toggling parent status:", error);
      throw error;
    }
  },

  // Toggle staff status (using delete API for soft delete/activate)
  toggleStaffStatus: async (staffId) => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STAFF.DELETE, staffId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error("Error toggling staff status:", error);
      throw error;
    }
  },
};

// Manager Health Record Services (Re-added)
export const managerHealthService = {
  // Get health records by student ID
  getHealthRecordsByStudent: async (studentId) => {
    try {
      console.log("🔍 Input studentId:", studentId, typeof studentId);
      console.log("📍 Endpoint:", API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT);

      // Use query parameter instead of path parameter
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT}?studentId=${studentId}`;
      console.log("🌐 Built URL:", url);
      console.log(
        "🌐 Full URL will be:",
        `${apiClient.defaults.baseURL}${url}`
      );

      const response = await apiClient.get(url);
      console.log("✅ API Response:", response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error("❌ Error getting health records by student:", error);
      throw error;
    }
  },
};

// Vaccination Services (Need to create API endpoints)
export const managerVaccinationService = {
  // Get vaccination list - MOCK DATA (API chưa có)
  getVaccinationList: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            studentName: "Nguyễn Văn An",
            studentId: 1,
            vaccineName: "Vắc xin COVID-19",
            scheduledDate: "2024-03-20",
            status: "scheduled",
            dose: "Mũi 1",
            notes: "Kiểm tra sức khỏe trước khi tiêm",
            class: "Lớp 1A",
          },
          {
            id: 2,
            studentName: "Trần Thị Bình",
            studentId: 2,
            vaccineName: "Vắc xin Cúm mùa",
            scheduledDate: "2024-03-18",
            status: "completed",
            dose: "Mũi duy nhất",
            completedDate: "2024-03-18",
            class: "Lớp 2B",
          },
        ]);
      }, 500);
    });
  },

  // Schedule vaccination - MOCK DATA (API chưa có)
  scheduleVaccination: async (vaccinationData) => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...vaccinationData,
          status: "scheduled",
          createdAt: new Date().toISOString(),
        });
      }, 300);
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

// Consultation Services for Manager
export const managerConsultationService = {
  // Get all consultation requests (for Manager to review)
  getAllRequests: consultationRequestService.getAll,

  // Get consultation types
  getTypes: consultationTypeService.getAll,

  // Approve/Reject consultation requests
  updateRequest: consultationRequestService.update,

  // Delete consultation request
  deleteRequest: consultationRequestService.delete,

  // Create/Update/Delete consultation types (Manager permission)
  createType: consultationTypeService.create,
  updateType: consultationTypeService.update,
  deleteType: consultationTypeService.delete,

  // Get consultations by parent/student for reporting
  getByParentId: consultationRequestService.getByParentId,
  getByStudentId: consultationRequestService.getByStudentId,
};

export default {
  managerBlogService,
  managerStudentService,
  managerStaffService,
  managerNotificationService,
  managerEmailService,
  managerAccountService,
  managerHealthService,
  managerVaccinationService,
  managerConsultationService,
};
