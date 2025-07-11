import apiClient, { API_ENDPOINTS, buildApiUrl } from './config.js';

// Parent Profile Services
export const parentService = {
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

  // Get my children (students under this parent)
  getMyChildren: async parentId => {
    try {
      const url = buildApiUrl(API_ENDPOINTS.STUDENT.GET_BY_PARENT, parentId);
      console.log('🌐 Calling Parent API:', url);
      console.log('👨‍👩‍👧‍👦 Parent ID:', parentId);

      const response = await apiClient.get(url);
      console.log('📥 Raw API response - My Children:', response);
      console.log('📊 Response is array?', Array.isArray(response));
      console.log('📈 Children count:', response?.length);

      return response;
    } catch (error) {
      console.error('❌ Error getting my children:', error);
      throw error;
    }
  },

  // Get current parent profile
  getProfile: async () => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PARENT.GET);
      return response;
    } catch (error) {
      console.error('Error getting parent profile:', error);
      throw error;
    }
  },

  // Update parent profile
  updateProfile: async parentData => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const payload = {
        parentid: userInfo.userId || 0,
        fullname: parentData.fullname || '',
        email: parentData.email || '',
        phone: parentData.phone || '',
        address: parentData.address || '',
      };

      const response = await apiClient.put(
        'https://api-schoolhealth.purintech.id.vn/api/Parent/parent',
        payload
      );
      return response;
    } catch (error) {
      console.error('Error updating parent profile:', error);
      throw error;
    }
  },

  // Register new parent
  register: async parentData => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.PARENT.REGISTER,
        parentData
      );
      return response;
    } catch (error) {
      console.error('Error registering parent:', error);
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
        return dataToProcess.map(notification => {
          // Lấy thông tin chi tiết cho parent hiện tại (giả sử parentId = 1 cho Parent)
          const currentParentDetail =
            notification.notificationParentDetails?.find(
              detail => detail.parentId === 1
            ) || notification.notificationParentDetails?.[0];

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
            message: currentParentDetail?.message || 'Không có nội dung',
            isRead: currentParentDetail?.isRead || false,
            targetType: 'parent',
          };
        });
      }

      return [];
    } catch (error) {
      console.error('Error getting parent notifications:', error);
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

// Parent Health Records Services
export const parentHealthService = {
  // Get health records for student
  getHealthRecords: async studentId => {
    try {
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT}?studentId=${studentId}`;
      const response = await apiClient.get(url);
      const records = Array.isArray(response) ? response : [];
      return records.map(parentService.mapHealthRecordData);
    } catch (error) {
      console.error('Error getting health records:', error);
      return [];
    }
  },

  // Get health records for a specific child
  getChildHealthRecords: async studentId => {
    try {
      const url = `${API_ENDPOINTS.HEALTH_RECORD.GET_BY_STUDENT}?studentId=${studentId}`;
      console.log('🌐 Calling Health Records API:', url);
      console.log('🆔 Student ID for health records:', studentId);

      const response = await apiClient.get(url);
      console.log('📥 Raw API response - Health Records:', response);
      console.log('📊 Response is array?', Array.isArray(response));
      console.log('📈 Records count:', response?.length);

      const records = Array.isArray(response) ? response : [];
      const mappedRecords = records.map(parentService.mapHealthRecordData);
      console.log('✅ Mapped health records:', mappedRecords);

      return mappedRecords;
    } catch (error) {
      console.error('❌ Error getting child health records:', error);
      return [];
    }
  },

  // Update health record
  updateHealthRecord: async (recordId, recordData) => {
    try {
      const url = `${API_ENDPOINTS.HEALTH_RECORD.UPDATE}?id=${recordId}`;
      console.log('🌐 Calling Update Health Record API:', url);
      console.log('📝 Record ID:', recordId);
      console.log('📊 Update data:', recordData);

      const response = await apiClient.put(url, recordData);
      console.log('✅ Health record updated successfully:', response);

      return response;
    } catch (error) {
      console.error('❌ Error updating health record:', error);
      throw error;
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
      console.error('Error getting published blogs:', error);
      throw error;
    }
  },
};

// Consultation Services (Need to create API endpoints)
export const consultationService = {
  // Get consultations for parent - MOCK DATA (API chưa có)
  getConsultations: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            studentName: 'Nguyễn Văn An',
            type: 'Khám tổng quát',
            status: 'Đang chờ',
            date: '2024-03-15',
            doctor: 'BS. Trần Thị Lan',
            priority: 'medium',
            description: 'Đau bụng thường xuyên sau khi ăn',
          },
          {
            id: 2,
            studentName: 'Trần Thị Bình',
            type: 'Tư vấn dinh dưỡng',
            status: 'Đã hoàn thành',
            date: '2024-03-12',
            doctor: 'BS. Lê Văn Nam',
            priority: 'low',
            description: 'Tư vấn chế độ ăn cho trẻ biếng ăn',
          },
        ]);
      }, 500);
    });
  },

  // Create consultation request - MOCK DATA (API chưa có)
  createConsultation: async consultationData => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...consultationData,
          status: 'Đang chờ',
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
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            senderId: 'parent',
            senderName: 'Phụ huynh',
            message: 'Chào y tá, con em hôm nay bị sốt nhẹ',
            timestamp: '2024-03-15 09:30',
            type: 'text',
          },
          {
            id: 2,
            senderId: 'nurse',
            senderName: 'Y tá Mai',
            message:
              'Chào anh/chị. Nhiệt độ hiện tại của con là bao nhiêu độ ạ?',
            timestamp: '2024-03-15 09:35',
            type: 'text',
          },
        ]);
      }, 500);
    });
  },

  // Send message to nurse - MOCK DATA (API chưa có)
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

// Medicine Donation Services (Need to create API endpoints)
export const donationService = {
  // Submit medicine donation - MOCK DATA (API chưa có)
  submitDonation: async donationData => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...donationData,
          status: 'pending',
          createdAt: new Date().toISOString(),
          parentId:
            JSON.parse(localStorage.getItem('userInfo') || '{}').userId || 0,
        });
      }, 1000);
    });
  },

  // Get donation history for current parent - MOCK DATA (API chưa có)
  getDonationHistory: async () => {
    // TODO: Replace with real API call when backend creates endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            medicineName: 'Paracetamol 500mg',
            medicineType: 'Thuốc giảm đau',
            quantity: '20 viên',
            expiryDate: '2024-12-31',
            condition: 'Còn tốt',
            description: 'Thuốc giảm đau, hạ sốt cho trẻ em',
            status: 'approved',
            createdAt: '2024-03-10T10:30:00Z',
          },
          {
            id: 2,
            medicineName: 'Vitamin C',
            medicineType: 'Vitamin',
            quantity: '30 viên',
            expiryDate: '2024-11-15',
            condition: 'Rất tốt',
            description: 'Vitamin C tăng cường sức đề kháng',
            status: 'completed',
            createdAt: '2024-02-28T14:20:00Z',
          },
          {
            id: 3,
            medicineName: 'Amoxicillin 250mg',
            medicineType: 'Thuốc kháng sinh',
            quantity: '15 viên',
            expiryDate: '2024-10-20',
            condition: 'Còn tốt',
            description: 'Thuốc kháng sinh cho trẻ em',
            status: 'pending',
            createdAt: '2024-03-15T09:15:00Z',
          },
        ]);
      }, 800);
    });
  },
};

// Standalone functions for easier import
export const submitDonation = donationService.submitDonation;
export const getDonationHistory = donationService.getDonationHistory;

export default {
  parentService,
  parentNotificationService,
  parentHealthService,
  parentBlogService,
  consultationService,
  parentChatService,
  donationService,
};
