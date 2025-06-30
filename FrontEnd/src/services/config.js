import axios from "axios";

// Base API URL
const API_BASE_URL = "https://api-schoolhealth.purintech.id.vn/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Don't send cookies
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Request: Token added to headers");
    } else {
      console.warn("Request: No token found in localStorage");
    }
    console.log("Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log("Response: Success", response.status, response.config.url);
    return response.data;
  },
  (error) => {
    // Log error for debugging
    console.error("API Error:", error);
    console.error("Response Status:", error.response?.status);
    console.error("Response Data:", error.response?.data);
    console.error("Request URL:", error.config?.url);
    console.error("Request Method:", error.config?.method);
    console.error("Request Data:", error.config?.data);

    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      console.error("Unauthorized access - redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error("Access denied");
    } else if (error.response?.status >= 500) {
      // Server error
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

// API endpoints - Only the ones we will actually use
export const API_ENDPOINTS = {
  // User/Auth endpoints
  USER: {
    LOGIN: "/User/user", // POST endpoint for login
    GET_ALL: "/User/user", // GET endpoint for users list
  },

  // Blog (5/7 - workflow: Nurse create → Manager approve → Parent view)
  BLOG: {
    GET_ALL: "/Blog/getAll", // Manager xem all blogs
    GET_BY_ID: "/Blog/getById", // Get blog by ID
    GET_PUBLISHED: "/Blog/GetPublishedBlogs", // Parent xem approved blogs
    ADD: "/Blog/add", // Nurse tạo blog
    UPDATE: "/Blog/update", // Manager/Nurse edit blog
    DELETE: "/Blog/delete", // Manager delete blog
    APPROVE: "/Blog/ApproveBlog", // Manager approve blog
    REJECT: "/Blog/RejectBlog", // Manager reject blog
  },

  // Email (5/7 - including admin features)
  EMAIL: {
    SEND: "/Email/sendEmail", // Send single email
    SEND_BY_LIST: "/Email/SendEmailByList", // Send bulk emails
    GET_TEMPLATES: "/Email/GetEmailAllTemplate", // Get email templates
    CREATE_TEMPLATE: "/Email/CreateEmailTemplate", // Admin create template
    UPDATE_TEMPLATE: "/Email/UpdateEmailTemplate", // Admin update template
  },

  // Health Record (4/6)
  HEALTH_RECORD: {
    GET_ALL: "/HealthRecord/getAll", // Nurse xem all records
    GET_BY_STUDENT: "/HealthRecord/getByStudentId", // Parent health history
    ADD: "/HealthRecord/add", // Nurse tạo health record
    UPDATE: "/HealthRecord/update", // Nurse update record
  },

  // Notification (5/7)
  NOTIFICATION: {
    CREATE_FOR_PARENT: "/Notification/createForParent", // Tạo thông báo cho parent
    CREATE_FOR_STAFF: "/Notification/createForStaff", // Tạo thông báo cho staff
    GET_FOR_PARENT: "/Notification/getNotiForParent", // Parent notifications
    GET_FOR_STAFF: "/Notification/getNotiForStaff", // Staff notifications
    DELETE: "/Notification/delete", // Xóa thông báo
  },

  // Parent (3/5)
  PARENT: {
    GET_ALL: "/Parent/parent", // GET all parents
    GET_BY_ID: "/Parent/parent/{id}", // GET parent by ID
    UPDATE: "/Parent/parent", // PUT update parent
    DELETE: "/Parent/parent/{id}", // DELETE parent
    REGISTER: "/Parent/registration", // POST register parent
  },

  // Staff (4/5)
  STAFF: {
    GET_ALL: "/Staff/staff", // GET all staff
    UPDATE: "/Staff/staff", // PUT update staff
    DELETE: "/Staff/staff/{id}", // DELETE staff
    REGISTER: "/Staff/registration", // POST register staff
  },

  // Student (6/6 - all endpoints needed)
  STUDENT: {
    GET_ALL: "/Student/GetAllStudents", // Manager/Nurse student list
    GET_BY_PARENT: "/Student/GetStudentsByParentId", // Get students by parent ID - more optimal
    GET_BY_ID: "/Student/GetStudentById", // Get student details
    ADD: "/Student/AddStudent", // Add single student
    BULK_ADD: "/Student/student", // Bulk import students
    UPDATE: "/Student/UpdateStudent", // Update student
    DELETE: "/Student/DeleteStudent", // Delete student
  },
};

// Helper function to build URL with ID
export const buildApiUrl = (endpoint, id = null) => {
  if (id && endpoint.includes("{id}")) {
    return endpoint.replace("{id}", id);
  }
  return id ? `${endpoint}/${id}` : endpoint;
};

export default apiClient;
