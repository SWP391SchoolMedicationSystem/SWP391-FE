import apiClient, { API_ENDPOINTS, buildApiUrl } from "./config.js";

// Data mapping functions
const mapStudentData = (apiStudent) => {
  return {
    id: apiStudent.studentId,
    studentId: apiStudent.studentCode,
    fullName: apiStudent.fullname,
    dateOfBirth: apiStudent.dob,
    age: apiStudent.age,
    gender: apiStudent.gender === true ? "Nam" : "Nữ", // API returns boolean
    bloodType: apiStudent.bloodType,
    className: apiStudent.classname, // Now using classname directly from API
    parentId: apiStudent.parent?.parentid,
    parentName: apiStudent.parent?.fullname || "Chưa có thông tin",
    parentPhone: apiStudent.parent?.phone || "Chưa có thông tin",
    parentEmail: apiStudent.parent?.email || "Chưa có thông tin",
    parentAddress: apiStudent.parent?.address || "Chưa có thông tin",
    healthStatus: "Bình thường", // Default value
    enrollmentDate: apiStudent.createdAt
      ? apiStudent.createdAt.split("T")[0]
      : "Chưa có thông tin",
    // Additional fields that might be needed
    allergies: "Chưa có thông tin",
    emergencyContact: apiStudent.parent?.phone || "Chưa có thông tin",
    address: apiStudent.parent?.address || "Chưa có thông tin",
    height: "Chưa có thông tin",
    weight: "Chưa có thông tin",
    notes: "Chưa có thông tin",
  };
};

// Mapping function for blog data (ensures unified fields)
const mapBlogData = (apiBlog) => {
  return {
    id: apiBlog.blogId || apiBlog.id || apiBlog.blogid,
    blogId: apiBlog.blogId || apiBlog.id || apiBlog.blogid,
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
    createdByName: apiBlog.createdByName || "",
    updatedBy: apiBlog.updatedBy,
    updatedByName: apiBlog.updatedByName || "",
    updatedAt: apiBlog.updatedAt,
    approvedBy: apiBlog.approvedBy,
    approvedByName: apiBlog.approvedByName || "",
    approvedOn: apiBlog.approvedOn,
    image: apiBlog.image,
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
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const payload = {
        blogId: blogId,
        approvedBy: userInfo.userId || 0,
        approvedOn: new Date().toISOString(),
        status: "Published",
        ...approvalData,
      };
      const response = await apiClient.post(
        API_ENDPOINTS.BLOG.APPROVE,
        payload
      );
      return response;
    } catch (error) {
      console.error("Error approving blog:", error);
      throw error;
    }
  },

  // Reject blog
  rejectBlog: async (blogId, reason) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const payload = {
        blogId: blogId,
        approvedBy: userInfo.userId || 0,
        approvedOn: new Date().toISOString(),
        status: "Rejected",
        message: reason || "Bài viết không đạt yêu cầu",
      };
      const response = await apiClient.post(API_ENDPOINTS.BLOG.REJECT, payload);
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
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

      // API mới yêu cầu blogID trong body
      const payload = {
        blogID: blogId,
        title: blogData.title,
        content: blogData.content,
        updatedBy: userInfo.userId || 0,
        status: blogData.status || "Draft",
        isDeleted:
          typeof blogData.isDeleted === "boolean" ? blogData.isDeleted : false,
      };

      const response = await apiClient.put(API_ENDPOINTS.BLOG.UPDATE, payload);
      return response;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  },

  // Delete blog post (soft delete)
  deleteBlog: async (blogId) => {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.BLOG.DELETE}?id=${blogId}`
      );
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

// Manager Health Record Services
export const managerHealthService = {
  // Get health records by student ID
  getHealthRecordsByStudent: async (studentId) => {
    try {
      console.log("🔍 Getting health records for student:", studentId);
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

  // Get full health record by student ID
  getFullHealthRecord: async (studentId) => {
    try {
      console.log("🔍 Getting full health record for studentId:", studentId);
      console.log(
        "📍 Endpoint:",
        API_ENDPOINTS.HEALTH_RECORD.GET_FULL_BY_STUDENT
      );

      // Use query parameter
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_FULL_BY_STUDENT}?studentId=${studentId}`;
      console.log("🌐 Built URL:", url);
      console.log(
        "🌐 Full URL will be:",
        `${apiClient.defaults.baseURL}${url}`
      );

      const response = await apiClient.get(url);
      console.log("✅ Full health record response:", response);
      return response;
    } catch (error) {
      console.error("❌ Error getting full health record:", error);
      throw error;
    }
  },
};

export default {
  managerBlogService,
  managerStudentService,
  managerStaffService,
  managerNotificationService,
  managerEmailService,
  managerAccountService,
  managerHealthService,
};
