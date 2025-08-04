import apiClient, { API_ENDPOINTS, buildApiUrl } from './config.js';

// Admin Dashboard Statistics Service
export const adminDashboardService = {
  // Get dashboard statistics from API
  getDashboardStatistics: async () => {
    try {
      console.log(
        '🔄 adminDashboardService.getDashboardStatistics: Fetching from API...'
      );
      const response = await apiClient.get(
        API_ENDPOINTS.DASHBOARD.USERS_STATISTICS
      );
      console.log('📊 Dashboard statistics response:', response);

      // Return the response data directly since apiClient already extracts response.data
      return response;
    } catch (error) {
      console.error('❌ Error getting dashboard statistics:', error);
      throw error;
    }
  },
};

// Admin Staff Management Services
export const adminStaffService = {
  // Get all staff
  getAllStaff: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STAFF.GET_ALL);
      return response;
    } catch (error) {
      console.error('Error getting all staff:', error);
      throw error;
    }
  },

  // Register new staff
  registerStaff: async staffData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.STAFF.REGISTER,
        staffData
      );
      return response;
    } catch (error) {
      console.error('Error registering staff:', error);
      throw error;
    }
  },

  // Update staff
  updateStaff: async staffData => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.STAFF.UPDATE,
        staffData
      );
      return response;
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  },

  // Delete staff
  deleteStaff: async staffId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STAFF.DELETE, staffId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  },
};

// Admin Email Template Services
export const adminEmailService = {
  // Get all email templates
  getEmailTemplates: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.EMAIL.GET_TEMPLATES);
      return response;
    } catch (error) {
      console.error('Error getting email templates:', error);
      throw error;
    }
  },

  // Create email template
  createEmailTemplate: async templateData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.EMAIL.CREATE_TEMPLATE,
        templateData
      );
      return response;
    } catch (error) {
      console.error('Error creating email template:', error);
      throw error;
    }
  },

  // Update email template
  updateEmailTemplate: async templateData => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.EMAIL.UPDATE_TEMPLATE,
        templateData
      );
      return response;
    } catch (error) {
      console.error('Error updating email template:', error);
      throw error;
    }
  },

  // Delete email template
  deleteEmailTemplate: async templateId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.EMAIL.DELETE_TEMPLATE, templateId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error deleting email template:', error);
      throw error;
    }
  },

  // Send single email
  sendEmail: async emailData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.EMAIL.SEND,
        emailData
      );
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  // Send bulk emails
  sendBulkEmails: async emailData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.EMAIL.SEND_BY_LIST,
        emailData
      );
      return response;
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      throw error;
    }
  },
};

// Admin Blog Management Services
export const adminBlogService = {
  // Get all blogs
  getAllBlogs: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BLOG.GET_ALL);
      return response;
    } catch (error) {
      console.error('Error getting all blogs:', error);
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
      console.error('Error approving blog:', error);
      throw error;
    }
  },
};

// Admin System Management Services (Need to create API endpoints)
export const adminSystemService = {
  // Get system logs - MOCK DATA (API chưa có)
  getSystemLogs: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            timestamp: '2024-03-15 10:30:25',
            level: 'INFO',
            action: 'USER_LOGIN',
            user: 'manager@school.com',
            details: 'Manager đăng nhập thành công',
            ipAddress: '192.168.1.100',
          },
          {
            id: 2,
            timestamp: '2024-03-15 10:25:15',
            level: 'WARNING',
            action: 'FAILED_LOGIN',
            user: 'unknown@email.com',
            details: 'Đăng nhập thất bại - Sai mật khẩu',
            ipAddress: '192.168.1.105',
          },
          {
            id: 3,
            timestamp: '2024-03-15 09:45:30',
            level: 'INFO',
            action: 'BLOG_CREATED',
            user: 'nurse@school.com',
            details: "Tạo bài viết mới: 'Hướng dẫn rửa tay đúng cách'",
            ipAddress: '192.168.1.102',
          },
          {
            id: 4,
            timestamp: '2024-03-15 09:30:12',
            level: 'ERROR',
            action: 'API_ERROR',
            user: 'system',
            details: 'Lỗi kết nối database - Timeout',
            ipAddress: 'localhost',
          },
        ]);
      }, 500);
    });
  },

  // Get system statistics - MOCK DATA (API chưa có)
  getSystemStats: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalUsers: 156,
          totalStudents: 892,
          totalStaff: 24,
          totalParents: 132,
          activeBlogs: 15,
          pendingBlogs: 3,
          totalHealthRecords: 1250,
          todayLogins: 45,
          systemUptime: '99.9%',
          lastBackup: '2024-03-15 02:00:00',
        });
      }, 500);
    });
  },
};

// Admin Category/Form Management Services (Need to create API endpoints)
export const adminCategoryService = {
  // Get health categories - MOCK DATA (API chưa có)
  getHealthCategories: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            healthcategoryid: 1,
            healthcategoryname: 'Khám tổng quát',
            healthcategorydescription: 'Khám sức khỏe định kỳ toàn diện',
            isdeleted: false,
            createddate: '2024-01-15',
          },
          {
            healthcategoryid: 2,
            healthcategoryname: 'Khám chuyên khoa',
            healthcategorydescription: 'Khám bệnh chuyên sâu theo từng khoa',
            isdeleted: false,
            createddate: '2024-01-20',
          },
          {
            healthcategoryid: 3,
            healthcategoryname: 'Tiêm chủng',
            healthcategorydescription: 'Tiêm vắc xin phòng bệnh',
            isdeleted: false,
            createddate: '2024-02-01',
          },
        ]);
      }, 500);
    });
  },

  // Create health category - MOCK DATA (API chưa có)
  createHealthCategory: async categoryData => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          healthcategoryid: Date.now(),
          ...categoryData,
          isdeleted: false,
          createddate: new Date().toISOString(),
        });
      }, 300);
    });
  },

  // Update health category - MOCK DATA (API chưa có)
  updateHealthCategory: async (categoryId, categoryData) => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          healthcategoryid: categoryId,
          ...categoryData,
          modifieddate: new Date().toISOString(),
        });
      }, 300);
    });
  },

  // Delete health category - MOCK DATA (API chưa có)
  deleteHealthCategory: async categoryId => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          healthcategoryid: categoryId,
          isdeleted: true,
          modifieddate: new Date().toISOString(),
        });
      }, 300);
    });
  },
};

// Admin Manager Management Services (Need to create API endpoints)
export const adminManagerService = {
  // Get all managers - MOCK DATA (API chưa có)
  getAllManagers: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            staffid: 1,
            fullname: 'Nguyễn Văn Quản',
            email: 'manager1@school.com',
            phone: '0901111111',
            roleid: 2, // Manager role
            createdAt: '2024-01-10',
            isDeleted: false,
            role: { rolename: 'Manager' },
          },
          {
            staffid: 2,
            fullname: 'Trần Thị Lan',
            email: 'manager2@school.com',
            phone: '0902222222',
            roleid: 2,
            createdAt: '2024-02-15',
            isDeleted: false,
            role: { rolename: 'Manager' },
          },
        ]);
      }, 500);
    });
  },

  // Create manager - Will use existing staff registration API
  createManager: async managerData => {
    try {
      const staffData = {
        ...managerData,
        roleID: 2, // Manager role ID
      };
      const response = await apiClient.post(
        API_ENDPOINTS.STAFF.REGISTER,
        staffData
      );
      return response;
    } catch (error) {
      console.error('Error creating manager:', error);
      throw error;
    }
  },

  // Update manager - Will use existing staff update API
  updateManager: async managerData => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.STAFF.UPDATE,
        managerData
      );
      return response;
    } catch (error) {
      console.error('Error updating manager:', error);
      throw error;
    }
  },

  // Delete manager - Will use existing staff delete API
  deleteManager: async managerId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STAFF.DELETE, managerId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error deleting manager:', error);
      throw error;
    }
  },
};

// Admin Parent Management Services
export const adminParentService = {
  // Get all parents
  getAllParents: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PARENT.GET_ALL);
      return response;
    } catch (error) {
      console.error('Error getting all parents:', error);
      throw error;
    }
  },

  // Create new parent account
  createParent: async parentData => {
    try {
      const response = await apiClient.post(
        'https://api-schoolhealth.purintech.id.vn/api/Parent/registration',
        parentData
      );
      return response;
    } catch (error) {
      console.error('Error creating parent account:', error);
      throw error;
    }
  },

  // Update parent
  updateParent: async parentData => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.PARENT.UPDATE,
        parentData
      );
      return response;
    } catch (error) {
      console.error('Error updating parent:', error);
      throw error;
    }
  },

  // Delete parent
  deleteParent: async parentId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.PARENT.DELETE, parentId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error deleting parent:', error);
      throw error;
    }
  },

  // Toggle parent status
  toggleParentStatus: async parentId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.PARENT.DELETE, parentId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error toggling parent status:', error);
      throw error;
    }
  },
};

// Admin Student Management Services
export const adminStudentService = {
  // Add new student
  addStudent: async studentData => {
    try {
      // Remove studentCode from data since backend will generate it
      const { studentCode: _, ...dataToSend } = studentData;
      const response = await apiClient.post(
        'https://api-schoolhealth.purintech.id.vn/api/Student/AddStudent',
        dataToSend
      );
      return response;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },
};

export default {
  adminStaffService,
  adminEmailService,
  adminBlogService,
  adminSystemService,
  adminCategoryService,
  adminManagerService,
  adminParentService,
  adminStudentService,
};
