import axios from 'axios';

// Base API URL
const API_BASE_URL = 'https://api-schoolhealth.purintech.id.vn/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Don't send cookies
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('Request: No token found in localStorage');
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // Log error for debugging
    console.error('API Error:', error);
    console.error('Response Status:', error.response?.status);
    console.error('Response Data:', error.response?.data);
    console.error('Request URL:', error.config?.url);
    console.error('Request Method:', error.config?.method);
    console.error('Request Data:', error.config?.data);

    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      console.error('Unauthorized access - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access denied');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error occurred');
    }

    return Promise.reject(error);
  }
);

// API endpoints - Only the ones we will actually use
export const API_ENDPOINTS = {
  // User/Auth endpoints
  USER: {
    LOGIN: '/User/user', // POST endpoint for login
    GET_ALL: '/User/user', // GET endpoint for users list
    FORGOT_PASSWORD: '/User/ForgotPassword', // POST - Send OTP to email
    VALIDATE_OTP: '/User/ValidateOTP', // POST - Validate OTP code
    RESET_PASSWORD: '/User/ResetPassword', // POST - Reset password
    GOOGLE_LOGIN: '/User/google', // POST endpoint for Google login
  },

  // Blog (5/7 - workflow: Nurse create → Manager approve → Parent view)
  BLOG: {
    GET_ALL: '/Blog/getAll', // Manager xem all blogs
    GET_BY_ID: '/Blog/getById', // Get blog by ID
    GET_PUBLISHED: '/Blog/GetPublishedBlogs', // Parent xem approved blogs
    ADD: '/Blog/add', // Nurse tạo blog
    UPDATE: '/Blog/update', // Manager/Nurse edit blog
    DELETE: '/Blog/delete', // Manager delete blog
    APPROVE: '/Blog/ApproveBlog', // Manager approve blog
    REJECT: '/Blog/RejectBlog', // Manager reject blog
  },

  // Email (5/7 - including admin features)
  EMAIL: {
    SEND: '/Email/sendEmail', // Send single email
    SEND_BY_LIST: '/Email/SendEmailByList', // Send bulk emails
    GET_TEMPLATES: '/Email/GetEmailAllTemplate', // Get email templates
    CREATE_TEMPLATE: '/Email/CreateEmailTemplate', // Admin create template
    UPDATE_TEMPLATE: '/Email/UpdateEmailTemplate', // Admin update template
  },

  // Health Record (6/6 - Full implementation)
  HEALTH_RECORD: {
    GET_ALL: '/HealthRecord/getAll', // Nurse xem all records
    GET_BY_STUDENT: '/HealthRecord/getByStudentId', // Parent health history - uses query parameter
    GET_FULL_BY_STUDENT: '/HealthRecord/fullhealthrecordByStudentId', // Full health record with vaccination & health checks
    ADD: '/HealthRecord/healthrecord', // Nurse tạo health record
    UPDATE: '/HealthRecord/update/{id}', // Nurse update record
    DELETE: '/HealthRecord/delete/{id}', // Delete health record
  },

  // Notification (5/7)
  NOTIFICATION: {
    CREATE_FOR_PARENT: '/Notification/createForParent', // Tạo thông báo cho parent
    CREATE_FOR_STAFF: '/Notification/createForStaff', // Tạo thông báo cho staff
    GET_FOR_PARENT: '/Notification/getNotiForParent', // Parent notifications
    GET_FOR_STAFF: '/Notification/getNotiForStaff', // Staff notifications
    DELETE: '/Notification/delete', // Xóa thông báo
  },

  // Parent (3/5)
  PARENT: {
    GET_ALL: '/Parent/parent', // GET all parents
    GET_BY_ID: '/Parent/parent/{id}', // GET parent by ID
    UPDATE: '/Parent/parent', // PUT update parent
    DELETE: '/Parent/parent/{id}', // DELETE parent
    REGISTER: '/Parent/registration', // POST register parent
  },

  // Staff (4/5)
  STAFF: {
    GET_ALL: '/Staff/staff', // GET all staff
    UPDATE: '/Staff/staff', // PUT update staff
    DELETE: '/Staff/staff/{id}', // DELETE staff
    REGISTER: '/Staff/registration', // POST register staff
  },

  // Student (6/6 - all endpoints needed)
  STUDENT: {
    GET_ALL: '/Student/GetAllStudents', // Manager/Nurse student list
    GET_BY_PARENT_ID: '/Student/GetStudentByParentId', // Get students by parent ID - query parameter
    GET_BY_ID: '/Student/GetStudentById', // Get student details
    GET_BY_PARENT: '/Student/GetStudentByParentId/{parentId}', // Get children by parent ID - path parameter
    ADD: '/Student/AddStudent', // Add single student
    BULK_ADD: '/Student/student', // Bulk import students
    UPDATE: '/Student/UpdateStudent', // Update student
    DELETE: '/Student/DeleteStudent', // Delete student
  },

  // Medicine (4/4 - Full CRUD for Nurse)
  MEDICINE: {
    GET_ALL: '/Medicine/GetAllMedicines', // GET all medicines
    ADD: '/Medicine/AddMedicine', // POST add new medicine
    UPDATE: '/Medicine/UpdateMedicine', // PUT update medicine
    DELETE: '/Medicine/DeleteMedicine', // DELETE medicine
    SEARCH_BY_NAME: '/Medicine/SearchMedicinesByName', // GET search medicines by name
  },

  // Form (Parent requests - Nurse review)
  FORM: {
    GET_ALL: '/Form', // GET all form requests from parents
    GET_BY_ID: '/Form/{id}', // GET specific form request by ID
    UPDATE: '/Form', // PUT update form (approve/decline)
    DELETE: '/Form/{id}', // DELETE form by ID
    GET_BY_PARENT: '/Form/parent/{parentId}', // GET forms by parent ID
    GET_BY_CATEGORY: '/Form/category/{categoryId}', // GET forms by category ID
    GET_BY_STATUS: '/Form/status/{status}', // GET forms by status
  },

  // Vaccination Event (Core feature - All endpoints)
  VACCINATION_EVENT: {
    GET_ALL: '/VaccinationEvent', // Get all vaccination events
    GET_BY_ID: '/VaccinationEvent/{id}', // Get event by ID
    CREATE: '/VaccinationEvent', // POST - Create new event (Manager only)
    UPDATE: '/VaccinationEvent', // PUT - Update event (Manager only)
    DELETE: '/VaccinationEvent/{id}', // DELETE - Delete event (Manager only)
    GET_UPCOMING: '/VaccinationEvent/upcoming', // Get upcoming events
    GET_BY_DATE_RANGE: '/VaccinationEvent/date-range', // Get events by date range
    GET_SUMMARY: '/VaccinationEvent/{id}/summary', // Get event summary with student list
    GET_RESPONSES: '/VaccinationEvent/{id}/responses', // Get student responses (will attend)
    GET_PARENT_RESPONSES: '/VaccinationEvent/{id}/parent-responses', // Get parent responses with consent
    SEND_EMAIL_ALL: '/VaccinationEvent/send-email', // Send email to all parents
    SEND_EMAIL_SPECIFIC: '/VaccinationEvent/send-email-specific', // Send email to specific parents
    SEND_EMAIL_TO_SPECIFIC_STUDENTS:
      '/VaccinationEvent/send-email-to-specific-students', // Send email to specific students
  },
};

// Helper function to build URL with ID or parameters
export const buildApiUrl = (endpoint, id = null) => {
  if (id && endpoint.includes('{id}')) {
    return endpoint.replace('{id}', id);
  }
  if (id && endpoint.includes('{parentId}')) {
    return endpoint.replace('{parentId}', id);
  }
  if (id && endpoint.includes('{studentId}')) {
    return endpoint.replace('{studentId}', id);
  }
  if (id && endpoint.includes('{categoryId}')) {
    return endpoint.replace('{categoryId}', id);
  }
  if (id && endpoint.includes('{status}')) {
    return endpoint.replace('{status}', id);
  }
  return id ? `${endpoint}/${id}` : endpoint;
};

export default apiClient;
