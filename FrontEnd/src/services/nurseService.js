import apiClient, { API_ENDPOINTS, buildApiUrl } from './config.js';

// Nurse Health Records Services
export const nurseHealthService = {
  // Get all health records
  getAllHealthRecords: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH_RECORD.GET_ALL);
      return response;
    } catch (error) {
      console.error('Error getting all health records:', error);
      throw error;
    }
  },

  // Get health records by student ID
  getHealthRecordsByStudent: async studentId => {
    try {
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT}?studentId=${studentId}`;
      const response = await apiClient.get(url);
      const records = Array.isArray(response) ? response : [];
      return records.map(nurseHealthService.mapHealthRecordData);
    } catch (error) {
      console.error('Error getting health records by student:', error);
      return [];
    }
  },

  // Map health record data for display
  mapHealthRecordData: apiRecord => {
    const getCategoryName = categoryId => {
      const categories = {
        1: 'Khám tổng quát',
        2: 'Dị ứng',
        3: 'Tiêm chủng',
        4: 'Khám định kỳ',
        5: 'Tai nạn/Chấn thương',
        6: 'Khác',
      };
      return categories[categoryId] || `Danh mục ${categoryId}`;
    };

    return {
      id: apiRecord.healthrecordid || apiRecord.id,
      studentId: apiRecord.studentid,
      categoryId: apiRecord.healthcategoryid,
      categoryName: getCategoryName(apiRecord.healthcategoryid),
      date: apiRecord.healthrecorddate
        ? new Date(apiRecord.healthrecorddate).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'Chưa có ngày',
      title: apiRecord.healthrecordtitle || 'Chưa có tiêu đề',
      description: apiRecord.healthrecorddescription || 'Chưa có mô tả',
      staffId: apiRecord.staffid,
      isConfirmed: apiRecord.isconfirm || false,
      createdBy: apiRecord.createdby || 'Hệ thống',
      createdDate: apiRecord.createddate
        ? new Date(apiRecord.createddate).toLocaleDateString('vi-VN')
        : null,
      modifiedBy: apiRecord.modifiedby,
      modifiedDate: apiRecord.modifieddate
        ? new Date(apiRecord.modifieddate).toLocaleDateString('vi-VN')
        : null,
      isDeleted: apiRecord.isdeleted || false,
    };
  },

  // Create new health record
  createHealthRecord: async healthRecordData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.HEALTH_RECORD.ADD,
        healthRecordData
      );
      return response;
    } catch (error) {
      console.error('Error creating health record:', error);
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
      console.error('Error updating health record:', error);
      throw error;
    }
  },

  // Get full health record by student ID (includes vaccination and health checks)
  getFullHealthRecord: async studentId => {
    try {
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_FULL_BY_STUDENT}?studentId=${studentId}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('Error getting full health record:', error);
      throw error;
    }
  },
};

// Mapping function để chuẩn hoá dữ liệu blog cho Nurse UI
const mapBlogData = apiBlog => ({
  id: apiBlog.blogId || apiBlog.id || apiBlog.blogid,
  blogId: apiBlog.blogId || apiBlog.id || apiBlog.blogid,
  title: apiBlog.title,
  content: apiBlog.content,
  author: apiBlog.createdByName || apiBlog.author || 'Unknown',
  createdByName: apiBlog.createdByName || '',
  updatedByName: apiBlog.updatedByName || '',
  category: apiBlog.category || 'N/A',
  status: apiBlog.status,
  createdDate: apiBlog.createdAt?.split('T')[0] || apiBlog.createdDate || 'N/A',
  readCount: apiBlog.readCount || apiBlog.views || 0,
  featured: apiBlog.featured || false,
  isDeleted: apiBlog.isDeleted ?? apiBlog.isdeleted ?? false,
  approvedBy: apiBlog.approvedBy,
  approvedByName: apiBlog.approvedByName || '',
  approvedOn: apiBlog.approvedOn,
  updatedAt: apiBlog.updatedAt,
  image: apiBlog.image,
  // Thêm rejection reason để hiển thị lý do từ chối
  rejectionReason:
    apiBlog.rejectionReason || apiBlog.message || apiBlog.rejectReason || '',
  rejectedBy: apiBlog.rejectedBy || '',
  rejectedByName: apiBlog.rejectedByName || '',
  rejectedOn: apiBlog.rejectedOn || '',
});

// Nurse Blog Services
export const nurseBlogService = {
  // Get all blogs (for nurse to see their own posts)
  getAllBlogs: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.BLOG.GET_ALL);
      return Array.isArray(response) ? response.map(mapBlogData) : [];
    } catch (error) {
      console.error('Error getting all blogs:', error);
      throw error;
    }
  },

  // Create new blog post
  createBlog: async blogData => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.BLOG.ADD, blogData);
      return response;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  // Update blog post
  updateBlog: async (blogId, blogData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

      // API mới yêu cầu blogID trong body
      const payload = {
        blogID: blogData.blogID || blogId,
        title: blogData.title,
        content: blogData.content,
        updatedBy: blogData.updatedBy || userInfo.userId || 0,
        status: blogData.status || 'Draft',
        isDeleted:
          typeof blogData.isDeleted === 'boolean' ? blogData.isDeleted : false,
      };

      const response = await apiClient.put(API_ENDPOINTS.BLOG.UPDATE, payload);
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

  // Get blog by ID (for editing/view)
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
};

// Data mapping function for student data
const mapStudentDataForNurse = apiStudent => {
  return {
    id: apiStudent.studentId,
    studentId: apiStudent.studentCode,
    fullName: apiStudent.fullname,
    dateOfBirth: apiStudent.dob,
    age: apiStudent.age,
    gender: apiStudent.gender === true ? 'Nam' : 'Nữ',
    bloodType: apiStudent.bloodType || 'Chưa có thông tin',
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
    allergies: 'Chưa có thông tin',
    emergencyContact: apiStudent.parent?.phone || 'Chưa có thông tin',
    height: 'Chưa có thông tin',
    weight: 'Chưa có thông tin',
    notes: 'Chưa có thông tin',
  };
};

// Nurse Student Services
export const nurseStudentService = {
  // Get all students
  getAllStudents: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL);
      // Transform API response to match component expected structure
      if (Array.isArray(response)) {
        return response.map(mapStudentDataForNurse);
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
      return response;
    } catch (error) {
      console.error('Error getting student by ID:', error);
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

      // Xử lý các trường hợp khác nhau của response
      let dataToProcess = response;

      // Nếu response là object có data property
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

      // Xử lý dữ liệu từ API để phù hợp với UI
      if (Array.isArray(dataToProcess)) {
        const processedData = dataToProcess.map(notification => {
          // Lấy thông tin chi tiết cho staff hiện tại (giả sử staffid = 3 cho Nurse)
          const currentStaffDetail =
            notification.notificationstaffdetails?.find(
              detail => detail.staffid === 3
            ) || notification.notificationstaffdetails?.[0];

          return {
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
            // Thêm thông tin đã xử lý cho UI
            message: currentStaffDetail?.message || 'Không có nội dung',
            isRead: currentStaffDetail?.isRead || false,
            targetType: 'staff',
          };
        });

        return processedData;
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error getting nurse notifications:', error);
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

// Medicine Services - Real API Integration
export const nurseMedicationService = {
  // Get all medicines
  getAllMedicines: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.MEDICINE.GET_ALL);
      if (Array.isArray(response)) {
        // Filter out soft-deleted medicines (isDeleted = true)
        const activeMedicines = response.filter(
          medicine => !medicine.isDeleted
        );
        return activeMedicines.map(mapMedicineData);
      }
      return [];
    } catch (error) {
      console.error('Error getting all medicines:', error);
      throw error;
    }
  },

  // Search medicines by name
  searchMedicinesByName: async searchTerm => {
    try {
      const url = `${
        API_ENDPOINTS.MEDICINE.SEARCH_BY_NAME
      }?searchTerm=${encodeURIComponent(searchTerm)}`;
      const response = await apiClient.get(url);
      if (Array.isArray(response)) {
        // Filter out soft-deleted medicines (isDeleted = true)
        const activeMedicines = response.filter(
          medicine => !medicine.isDeleted
        );
        return activeMedicines.map(mapMedicineData);
      }
      return [];
    } catch (error) {
      console.error('Error searching medicines by name:', error);
      throw error;
    }
  },

  // Add new medicine
  addMedicine: async medicineData => {
    try {
      const payload = {
        medicinename: medicineData.medicinename,
        medicinecategoryid: medicineData.medicinecategoryid,
        type: medicineData.type,
        quantity: medicineData.quantity,
        createdat: new Date().toISOString(),
        createdby:
          medicineData.createdby ||
          JSON.parse(localStorage.getItem('userInfo') || '{}').fullName ||
          'Nurse',
      };

      const response = await apiClient.post(
        API_ENDPOINTS.MEDICINE.ADD,
        payload
      );
      return response;
    } catch (error) {
      console.error('Error adding medicine:', error);
      throw error;
    }
  },

  // Update medicine
  updateMedicine: async (medicineId, medicineData) => {
    try {
      const payload = {
        medicineid: medicineId,
        medicinename: medicineData.medicinename,
        medicinecategoryid: medicineData.medicinecategoryid,
        type: medicineData.type,
        quantity: medicineData.quantity,
        updatedat: new Date().toISOString(),
        updatedby:
          medicineData.updatedby ||
          JSON.parse(localStorage.getItem('userInfo') || '{}').fullName ||
          'Nurse',
      };

      const response = await apiClient.put(
        API_ENDPOINTS.MEDICINE.UPDATE,
        payload
      );
      return response;
    } catch (error) {
      console.error('Error updating medicine:', error);
      throw error;
    }
  },

  // Delete medicine
  deleteMedicine: async medicineId => {
    try {
      const url = `${API_ENDPOINTS.MEDICINE.DELETE}?id=${medicineId}`;
      const response = await apiClient.delete(url);
      return response;
    } catch (error) {
      console.error('Error deleting medicine:', error);
      throw error;
    }
  },
};

// Helper function to map medicine data from API
const mapMedicineData = apiMedicine => {
  return {
    id: apiMedicine.medicineid,
    medicineName: apiMedicine.medicinename,
    categoryId: apiMedicine.medicinecategoryid,
    type: apiMedicine.type,
    quantity: apiMedicine.quantity,
    isDeleted: apiMedicine.isDeleted || false,
    createdAt: apiMedicine.createdat
      ? new Date(apiMedicine.createdat).toLocaleDateString('vi-VN')
      : 'Chưa có thông tin',
    updatedAt: apiMedicine.updatedat
      ? new Date(apiMedicine.updatedat).toLocaleDateString('vi-VN')
      : 'Chưa cập nhật',
    createdBy: apiMedicine.createdby || 'Hệ thống',
    updatedBy: apiMedicine.updatedby || null,
    // Original data for editing
    originalData: apiMedicine,
  };
};

// Chat Services (Need to create API endpoints)
export const nurseChatService = {
  // Get chat messages with parents - MOCK DATA (API chưa có)
  getChatMessages: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            parentName: 'Nguyễn Thị Lan',
            studentName: 'Nguyễn Văn An',
            lastMessage: 'Con em hôm nay bị sốt nhẹ',
            timestamp: '2024-03-15 09:30',
            unreadCount: 2,
            status: 'active',
          },
          {
            id: 2,
            parentName: 'Trần Văn Nam',
            studentName: 'Trần Thị Bình',
            lastMessage: 'Cảm ơn y tá đã tư vấn',
            timestamp: '2024-03-14 16:45',
            unreadCount: 0,
            status: 'resolved',
          },
        ]);
      }, 500);
    });
  },

  // Send message to parent - MOCK DATA (API chưa có)
  sendMessage: async messageData => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...messageData,
          timestamp: new Date().toLocaleString('vi-VN'),
        });
      }, 300);
    });
  },
};

export default {
  nurseHealthService,
  nurseBlogService,
  nurseStudentService,
  nurseNotificationService,
  nurseMedicationService,
  nurseChatService,
};
