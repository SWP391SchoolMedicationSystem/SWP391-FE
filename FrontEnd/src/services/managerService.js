import apiClient, { API_ENDPOINTS, buildApiUrl } from './config.js';

// Data mapping functions
const mapStudentData = apiStudent => {
  return {
    id: apiStudent.studentId,
    studentId: apiStudent.studentCode,
    fullName: apiStudent.fullname,
    dateOfBirth: apiStudent.dob,
    age: apiStudent.age,
    gender: apiStudent.gender === true ? 'Nam' : 'Nữ', // API returns boolean
    bloodType: apiStudent.bloodType,
    className: apiStudent.classname, // Now using classname directly from API
    parentId: apiStudent.parent?.parentid,
    parentName: apiStudent.parent?.fullname || 'Chưa có thông tin',
    parentPhone: apiStudent.parent?.phone || 'Chưa có thông tin',
    parentEmail: apiStudent.parent?.email || 'Chưa có thông tin',
    parentAddress: apiStudent.parent?.address || 'Chưa có thông tin',
    healthStatus: 'Bình thường', // Default value
    enrollmentDate: apiStudent.createdAt
      ? apiStudent.createdAt.split('T')[0]
      : 'Chưa có thông tin',
    // Additional fields that might be needed
    allergies: 'Chưa có thông tin',
    emergencyContact: apiStudent.parent?.phone || 'Chưa có thông tin',
    address: apiStudent.parent?.address || 'Chưa có thông tin',
    height: 'Chưa có thông tin',
    weight: 'Chưa có thông tin',
    notes: 'Chưa có thông tin',
  };
};

// Mapping function for blog data (ensures unified fields)
const mapBlogData = apiBlog => {
  return {
    id: apiBlog.blogId || apiBlog.id || apiBlog.blogid,
    blogId: apiBlog.blogId || apiBlog.id || apiBlog.blogid,
    title: apiBlog.title,
    content: apiBlog.content,
    author: '', // to be filled later
    category: apiBlog.category || 'N/A',
    status: apiBlog.status,
    createdDate:
      apiBlog.createdAt?.split('T')[0] || apiBlog.createdDate || 'N/A',
    featured: apiBlog.featured || false,
    isDeleted: apiBlog.isDeleted ?? apiBlog.isdeleted ?? false,
    createdById: apiBlog.createdBy || apiBlog.createdby || apiBlog.authorId,
    createdByName: apiBlog.createdByName || '',
    updatedBy: apiBlog.updatedBy,
    updatedByName: apiBlog.updatedByName || '',
    updatedAt: apiBlog.updatedAt,
    approvedBy: apiBlog.approvedBy,
    approvedByName: apiBlog.approvedByName || '',
    approvedOn: apiBlog.approvedOn,
    image: apiBlog.image,
    // Thêm rejection reason để hiển thị lý do từ chối
    rejectionReason:
      apiBlog.rejectionReason || apiBlog.message || apiBlog.rejectReason || '',
    rejectedBy: apiBlog.rejectedBy || apiBlog.approvedBy || '',
    rejectedByName: apiBlog.rejectedByName || apiBlog.approvedByName || '',
    rejectedOn: apiBlog.rejectedOn || apiBlog.approvedOn || '',
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
        console.warn('Cannot fetch staff list', err);
      }

      return response.map(b => {
        const mapped = mapBlogData(b);
        mapped.author =
          staffMap[mapped.createdById] || `User #${mapped.createdById || '?'}`;
        return mapped;
      });
    } catch (error) {
      console.error('Error getting all blogs:', error);
      throw error;
    }
  },

  // Approve blog
  approveBlog: async (blogId, approvalData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const payload = {
        blogId: blogId,
        approvedBy: userInfo.userId || 0,
        approvedOn: new Date().toISOString(),
        status: 'Published',
        ...approvalData,
      };
      const response = await apiClient.post(
        API_ENDPOINTS.BLOG.APPROVE,
        payload
      );
      return response;
    } catch (error) {
      console.error('Error approving blog:', error);
      throw error;
    }
  },

  // Reject blog
  rejectBlog: async (blogId, reason) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const payload = {
        blogId: blogId,
        approvedBy: userInfo.userId || 0,
        approvedOn: new Date().toISOString(),
        status: 'Rejected',
        message: reason || 'Bài viết không đạt yêu cầu',
      };
      const response = await apiClient.post(API_ENDPOINTS.BLOG.REJECT, payload);
      return response;
    } catch (error) {
      console.error('Error rejecting blog:', error);
      throw error;
    }
  },

  // Create blog post
  createBlog: async (blogData, imageFile = null) => {
    try {
      if (imageFile) {
        // Use FormData for multipart/form-data when image is included
        const formData = new FormData();
        formData.append('Title', blogData.title);
        formData.append('Content', blogData.content);
        formData.append('CreatedBy', blogData.createdBy);
        formData.append('ImageFile', imageFile);

        const response = await apiClient.post(
          API_ENDPOINTS.BLOG.ADD,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        return response;
      } else {
        // Use regular JSON for text-only blog posts
        const response = await apiClient.post(API_ENDPOINTS.BLOG.ADD, blogData);
        return response;
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  // Update blog post
  updateBlog: async (blogId, blogData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

      // Create FormData for multipart/form-data request
      const formData = new FormData();

      // Add required fields according to API spec
      formData.append('BlogID', blogId);
      formData.append('Title', blogData.title || '');
      formData.append('Content', blogData.content || '');
      formData.append('UpdatedBy', userInfo.userId || 0);
      formData.append('Status', blogData.status || 'Draft');
      formData.append(
        'IsDeleted',
        typeof blogData.isDeleted === 'boolean' ? blogData.isDeleted : false
      );

      // Add ImageFile if provided
      if (blogData.imageFile) {
        formData.append('ImageFile', blogData.imageFile);
      }

      const response = await apiClient.put(
        API_ENDPOINTS.BLOG.UPDATE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  // Delete blog post (soft delete)
  deleteBlog: async blogId => {
    try {
      const response = await apiClient.delete(
        `${API_ENDPOINTS.BLOG.DELETE}?id=${blogId}`
      );
      return response;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  // Get blog by ID
  getBlogById: async blogId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.BLOG.GET_BY_ID, blogId);
      const response = await apiClient.get(url);
      return mapBlogData(response);
    } catch (error) {
      console.error('Error getting blog by ID:', error);
      throw error;
    }
  },

  // Upload image for blog
  uploadBlogImage: async (blogId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('blogId', blogId);
      formData.append('image', imageFile);

      const response = await apiClient.post(
        'https://api-schoolhealth.purintech.id.vn/api/Blog/upload-image',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      console.error('Error uploading blog image:', error);
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
      console.error('Error getting all students:', error);
      throw error;
    }
  },

  // Get student by ID
  getStudentById: async studentId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STUDENT.GET_BY_ID, studentId);
      const response = await apiClient.get(url);
      // Transform single student data
      return mapStudentData(response);
    } catch (error) {
      console.error('Error getting student by ID:', error);
      throw error;
    }
  },

  // Add single student
  addStudent: async studentData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.STUDENT.ADD,
        studentData
      );
      return response;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  },

  // Bulk add students
  bulkAddStudents: async studentsData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.STUDENT.BULK_ADD,
        studentsData
      );
      return response;
    } catch (error) {
      console.error('Error bulk adding students:', error);
      throw error;
    }
  },

  // Update student
  updateStudent: async updateData => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.STUDENT.UPDATE,
        updateData
      );
      return response;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  // Delete student
  deleteStudent: async studentId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STUDENT.DELETE, studentId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error deleting student:', error);
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

// Manager Notification Services
export const managerNotificationService = {
  // Get notifications for staff
  getStaffNotifications: async () => {
    try {
      console.log(
        '🌐 Calling Manager API:',
        API_ENDPOINTS.NOTIFICATION.GET_FOR_STAFF
      );

      const response = await apiClient.get(
        API_ENDPOINTS.NOTIFICATION.GET_FOR_STAFF
      );

      console.log('📥 Raw Manager API Response:', response);

      // Xử lý các trường hợp khác nhau của response
      let dataToProcess = response;

      if (
        response &&
        typeof response === 'object' &&
        !Array.isArray(response)
      ) {
        if (response.data) {
          dataToProcess = response.data;
          console.log('📊 Using response.data');
        } else if (response.result) {
          dataToProcess = response.result;
          console.log('📊 Using response.result');
        } else {
          console.log('📊 Using response directly');
        }
      }

      if (Array.isArray(dataToProcess)) {
        console.log(
          '📋 Processing array of manager notifications:',
          dataToProcess.length
        );

        const processedData = dataToProcess.map(notification => {
          const processedNotification = {
            notificationId: notification.notificationId,
            title: notification.title,
            createdAt: notification.createdAt,
            type: notification.type,
            isDeleted: notification.isDeleted,
            createdby: notification.createdby,
            notificationParentDetails:
              notification.notificationParentDetails || [],
            notificationstaffdetails:
              notification.notificationstaffdetails || [],
            targetType: 'staff',
          };

          console.log(
            '📝 Processed manager notification:',
            processedNotification
          );
          return processedNotification;
        });

        console.log('✅ Final processed manager data:', processedData);
        return processedData;
      }

      console.log('⚠️ Manager response is not an array, returning empty array');
      return [];
    } catch (error) {
      console.error('❌ Error getting manager notifications:', error);
      throw error;
    }
  },

  // Get notifications for parents
  getParentNotifications: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.NOTIFICATION.GET_FOR_PARENT
      );

      // Xử lý các trường hợp khác nhau của response
      let dataToProcess = response;

      if (
        response &&
        typeof response === 'object' &&
        !Array.isArray(response)
      ) {
        if (response.data) {
          dataToProcess = response.data;
        } else if (response.result) {
          dataToProcess = response.result;
        } else {
          return [];
        }
      }

      if (Array.isArray(dataToProcess)) {
        return dataToProcess.map(notification => ({
          notificationId: notification.notificationId,
          title: notification.title,
          createdAt: notification.createdAt,
          type: notification.type,
          isDeleted: notification.isDeleted,
          createdby: notification.createdby,
          notificationParentDetails:
            notification.notificationParentDetails || [],
          notificationstaffdetails: notification.notificationstaffdetails || [],
          targetType: 'parent',
        }));
      }

      return [];
    } catch (error) {
      console.error('Error getting parent notifications:', error);
      throw error;
    }
  },

  // Create notification for parents
  createNotificationForParents: async notificationData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.NOTIFICATION.CREATE_FOR_PARENT,
        notificationData
      );
      return response;
    } catch (error) {
      console.error('Error creating notification for parents:', error);
      throw error;
    }
  },

  // Create notification for staff
  createNotificationForStaff: async notificationData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.NOTIFICATION.CREATE_FOR_STAFF,
        notificationData
      );
      return response;
    } catch (error) {
      console.error('Error creating notification for staff:', error);
      throw error;
    }
  },

  // Mark notification as read (delete)
  markAsRead: async notificationId => {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.NOTIFICATION.DELETE,
        notificationId
      );
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
      console.error('Error getting email templates:', error);
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

// Manager Account Management Services
export const managerAccountService = {
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

  // Get parent by ID
  getParentById: async parentId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.PARENT.GET_BY_ID, parentId);
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Error getting parent by ID:', error);
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

  // Toggle parent status (using delete API for soft delete/activate)
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

  // Toggle staff status (using delete API for soft delete/activate)
  toggleStaffStatus: async staffId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STAFF.DELETE, staffId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error toggling staff status:', error);
      throw error;
    }
  },
};

// Manager Health Record Services
export const managerHealthService = {
  // Get health records by student ID
  getHealthRecordsByStudent: async studentId => {
    try {
      console.log('🔍 Getting health records for student:', studentId);
      console.log('📍 Endpoint:', API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT);

      // Use query parameter instead of path parameter
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT}?studentId=${studentId}`;
      console.log('🌐 Built URL:', url);
      console.log(
        '🌐 Full URL will be:',
        `${apiClient.defaults.baseURL}${url}`
      );

      const response = await apiClient.get(url);
      console.log('✅ API Response:', response);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('❌ Error getting health records by student:', error);
      throw error;
    }
  },

  // Get full health record by student ID
  getFullHealthRecord: async studentId => {
    try {
      console.log('🔍 Getting full health record for studentId:', studentId);
      console.log(
        '📍 Endpoint:',
        API_ENDPOINTS.HEALTH_RECORD.GET_FULL_BY_STUDENT
      );

      // Use query parameter
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_FULL_BY_STUDENT}?studentId=${studentId}`;
      console.log('🌐 Built URL:', url);
      console.log(
        '🌐 Full URL will be:',
        `${apiClient.defaults.baseURL}${url}`
      );

      const response = await apiClient.get(url);
      console.log('✅ Full health record response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error getting full health record:', error);
      throw error;
    }
  },
};

// Manager Vaccination Services
export const managerVaccinationService = {
  // Get all vaccination events
  getAllVaccinationEvents: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.VACCINATION_EVENT.GET_ALL
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error getting all vaccination events:', error);
      throw error;
    }
  },

  // Get upcoming vaccination events
  getUpcomingVaccinationEvents: async () => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.VACCINATION_EVENT.GET_UPCOMING
      );
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.error('Error getting upcoming vaccination events:', error);
      throw error;
    }
  },

  // Create vaccination event
  createVaccinationEvent: async eventData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.VACCINATION_EVENT.CREATE,
        eventData
      );
      return response;
    } catch (error) {
      console.error('Error creating vaccination event:', error);
      throw error;
    }
  },

  // Update vaccination event
  updateVaccinationEvent: async eventData => {
    try {
      const response = await apiClient.put(
        API_ENDPOINTS.VACCINATION_EVENT.UPDATE,
        eventData
      );
      return response;
    } catch (error) {
      console.error('Error updating vaccination event:', error);
      throw error;
    }
  },

  // Delete vaccination event
  deleteVaccinationEvent: async eventId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.VACCINATION_EVENT.DELETE, eventId);
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error deleting vaccination event:', error);
      throw error;
    }
  },

  // Get vaccination event by ID
  getVaccinationEventById: async eventId => {
    try {
      const url = buildApiUrl(
        API_ENDPOINTS.VACCINATION_EVENT.GET_BY_ID,
        eventId
      );
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Error getting vaccination event by ID:', error);
      throw error;
    }
  },

  // Send email to all parents for vaccination event
  sendEmailToAllParents: async (eventId, emailData) => {
    try {
      const response = await apiClient.post(
        `${API_ENDPOINTS.VACCINATION_EVENT.SEND_EMAIL_ALL}?eventId=${eventId}`,
        emailData
      );
      return response;
    } catch (error) {
      console.error('Error sending email to all parents:', error);
      throw error;
    }
  },
};

// Manager Dashboard Services
export const managerDashboardService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      // Fetch all required data in parallel
      const [
        students,
        parents,
        staff,
        blogs,
        staffNotifications,
        parentNotifications,
      ] = await Promise.all([
        apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL),
        apiClient.get(API_ENDPOINTS.PARENT.GET_ALL),
        apiClient.get(API_ENDPOINTS.STAFF.GET_ALL),
        apiClient.get(API_ENDPOINTS.BLOG.GET_ALL),
        apiClient.get(API_ENDPOINTS.NOTIFICATION.GET_FOR_STAFF),
        apiClient.get(API_ENDPOINTS.NOTIFICATION.GET_FOR_PARENT),
      ]);

      // Process students data
      const totalStudents = Array.isArray(students) ? students.length : 0;
      const maleStudents = Array.isArray(students)
        ? students.filter(s => s.gender === true).length
        : 0;
      const femaleStudents = Array.isArray(students)
        ? students.filter(s => s.gender === false).length
        : 0;

      // Group students by class
      const studentsByClass = Array.isArray(students)
        ? students.reduce((acc, student) => {
            const className = student.classname || 'Chưa phân lớp';
            acc[className] = (acc[className] || 0) + 1;
            return acc;
          }, {})
        : {};

      // Process blogs data
      const totalBlogs = Array.isArray(blogs) ? blogs.length : 0;
      const pendingBlogs = Array.isArray(blogs)
        ? blogs.filter(b => b.status === 'pending').length
        : 0;
      const approvedBlogs = Array.isArray(blogs)
        ? blogs.filter(b => b.status === 'Published').length
        : 0;
      const rejectedBlogs = Array.isArray(blogs)
        ? blogs.filter(b => b.status === 'Rejected').length
        : 0;

      // Process notifications data
      const totalStaffNotifications = Array.isArray(staffNotifications)
        ? staffNotifications.length
        : 0;
      const totalParentNotifications = Array.isArray(parentNotifications)
        ? parentNotifications.length
        : 0;
      const totalNotifications =
        totalStaffNotifications + totalParentNotifications;

      // Process parents and staff data
      const totalParents = Array.isArray(parents) ? parents.length : 0;
      const totalStaff = Array.isArray(staff) ? staff.length : 0;

      return {
        students: {
          total: totalStudents,
          male: maleStudents,
          female: femaleStudents,
          byClass: studentsByClass,
        },
        parents: {
          total: totalParents,
        },
        staff: {
          total: totalStaff,
        },
        blogs: {
          total: totalBlogs,
          pending: pendingBlogs,
          approved: approvedBlogs,
          rejected: rejectedBlogs,
        },
        notifications: {
          total: totalNotifications,
          staff: totalStaffNotifications,
          parent: totalParentNotifications,
        },
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw error;
    }
  },

  // Get recent activities
  getRecentActivities: async () => {
    try {
      const [
        blogs,
        students,
        staffNotifications,
        parentNotifications,
        vaccinationEvents,
      ] = await Promise.all([
        apiClient.get(API_ENDPOINTS.BLOG.GET_ALL),
        apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL),
        apiClient.get(API_ENDPOINTS.NOTIFICATION.GET_FOR_STAFF),
        apiClient.get(API_ENDPOINTS.NOTIFICATION.GET_FOR_PARENT),
        apiClient.get(API_ENDPOINTS.VACCINATION_EVENT.GET_UPCOMING),
      ]);

      const activities = [];

      // Add recent blogs
      if (Array.isArray(blogs)) {
        const recentBlogs = blogs
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        recentBlogs.forEach(blog => {
          activities.push({
            type: 'blog',
            message: `Bài viết mới: "${blog.title}"`,
            time: new Date(blog.createdAt).toLocaleDateString('vi-VN'),
            icon: '📝',
            status: blog.status,
          });
        });
      }

      // Add recent students
      if (Array.isArray(students)) {
        const recentStudents = students
          .filter(s => s.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 2);

        recentStudents.forEach(student => {
          activities.push({
            type: 'student',
            message: `Học sinh mới: ${student.fullname} (${
              student.classname || 'Chưa phân lớp'
            })`,
            time: new Date(student.createdAt).toLocaleDateString('vi-VN'),
            icon: '🎓',
          });
        });
      }

      // Add recent notifications
      const allNotifications = [
        ...(Array.isArray(staffNotifications)
          ? staffNotifications.map(n => ({ ...n, target: 'staff' }))
          : []),
        ...(Array.isArray(parentNotifications)
          ? parentNotifications.map(n => ({ ...n, target: 'parent' }))
          : []),
      ];

      const recentNotifications = allNotifications
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2);

      recentNotifications.forEach(notification => {
        activities.push({
          type: 'notification',
          message: `Thông báo mới: ${notification.title}`,
          time: new Date(notification.createdAt).toLocaleDateString('vi-VN'),
          icon: '🔔',
          target: notification.target,
        });
      });

      // Add upcoming vaccination events
      if (Array.isArray(vaccinationEvents)) {
        const upcomingEvents = vaccinationEvents
          .filter(event => new Date(event.eventDate) > new Date())
          .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
          .slice(0, 1);

        upcomingEvents.forEach(event => {
          activities.push({
            type: 'vaccination',
            message: `Sự kiện tiêm chủng sắp tới: ${
              event.eventName || 'Tiêm chủng'
            } - ${new Date(event.eventDate).toLocaleDateString('vi-VN')}`,
            time: new Date(event.eventDate).toLocaleDateString('vi-VN'),
            icon: '💉',
          });
        });
      }

      return activities
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 6);
    } catch (error) {
      console.error('Error getting recent activities:', error);
      throw error;
    }
  },

  // Get system status
  getSystemStatus: async () => {
    try {
      // Test API endpoints health
      const endpoints = [
        { name: 'Cơ sở dữ liệu', endpoint: API_ENDPOINTS.STUDENT.GET_ALL },
        { name: 'API Services', endpoint: API_ENDPOINTS.STAFF.GET_ALL },
        { name: 'Email Service', endpoint: API_ENDPOINTS.EMAIL.GET_TEMPLATES },
        { name: 'File Storage', endpoint: API_ENDPOINTS.BLOG.GET_ALL },
      ];

      const statusChecks = await Promise.allSettled(
        endpoints.map(async ({ name, endpoint }) => {
          try {
            await apiClient.get(endpoint);
            return { name, status: 'online' };
          } catch (error) {
            return { name, status: 'offline' };
          }
        })
      );

      return statusChecks.map(check => {
        if (check.status === 'fulfilled') {
          return check.value;
        }
        return { name: 'Unknown', status: 'offline' };
      });
    } catch (error) {
      console.error('Error getting system status:', error);
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
  managerVaccinationService,
  managerDashboardService,
};
