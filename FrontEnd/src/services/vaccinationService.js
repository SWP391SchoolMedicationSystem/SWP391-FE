import apiClient, { API_ENDPOINTS, buildApiUrl } from './config.js';

// Vaccination Event Services
export const vaccinationEventService = {
  // Get all vaccination events (All roles can view)
  getAllEvents: async () => {
    try {
      console.log('🌐 Getting all vaccination events');
      const response = await apiClient.get(
        API_ENDPOINTS.VACCINATION_EVENT.GET_ALL
      );
      console.log('📥 Vaccination events response:', response);

      const events = Array.isArray(response) ? response : [];
      return events.map(vaccinationEventService.mapEventData);
    } catch (error) {
      console.error('❌ Error getting vaccination events:', error);
      throw error;
    }
  },

  // Get vaccination event by ID
  getEventById: async eventId => {
    try {
      console.log('🌐 Getting vaccination event by ID:', eventId);
      const url = buildApiUrl(
        API_ENDPOINTS.VACCINATION_EVENT.GET_BY_ID,
        eventId
      );
      const response = await apiClient.get(url);
      console.log('📥 Vaccination event details:', response);

      return vaccinationEventService.mapEventData(response);
    } catch (error) {
      console.error('❌ Error getting vaccination event by ID:', error);
      throw error;
    }
  },

  // Create new vaccination event (Manager only)
  createEvent: async eventData => {
    try {
      console.log('🌐 Creating vaccination event:', eventData);
      const response = await apiClient.post(
        API_ENDPOINTS.VACCINATION_EVENT.CREATE,
        eventData
      );
      console.log('✅ Vaccination event created:', response);

      return vaccinationEventService.mapEventData(response);
    } catch (error) {
      console.error('❌ Error creating vaccination event:', error);
      throw error;
    }
  },

  // Create new vaccination event with file upload (Manager only)
  createEventWithFile: async formData => {
    try {
      console.log('🌐 Creating vaccination event with file...');
      
      // Get token for authorization
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `${apiClient.defaults.baseURL}${API_ENDPOINTS.VACCINATION_EVENT.CREATE}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set Content-Type for FormData - browser will set it with boundary
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Vaccination event with file created:', result);

      return vaccinationEventService.mapEventData(result);
    } catch (error) {
      console.error('❌ Error creating vaccination event with file:', error);
      throw error;
    }
  },

  // Update vaccination event (Manager only)
  updateEvent: async eventData => {
    try {
      console.log('🌐 Updating vaccination event:', eventData);
      const response = await apiClient.put(
        API_ENDPOINTS.VACCINATION_EVENT.UPDATE,
        eventData
      );
      console.log('✅ Vaccination event updated:', response);

      return response;
    } catch (error) {
      console.error('❌ Error updating vaccination event:', error);
      throw error;
    }
  },

  // Delete vaccination event (Manager only)
  deleteEvent: async eventId => {
    try {
      console.log('🌐 Deleting vaccination event:', eventId);
      const url = buildApiUrl(API_ENDPOINTS.VACCINATION_EVENT.DELETE, eventId);
      const response = await apiClient.delete(url);
      console.log('✅ Vaccination event deleted:', response);

      return response;
    } catch (error) {
      console.error('❌ Error deleting vaccination event:', error);
      throw error;
    }
  },

  // Get upcoming vaccination events
  getUpcomingEvents: async () => {
    try {
      console.log('🌐 Getting upcoming vaccination events');
      const response = await apiClient.get(
        API_ENDPOINTS.VACCINATION_EVENT.GET_UPCOMING
      );
      console.log('📥 Upcoming vaccination events:', response);

      const events = Array.isArray(response) ? response : [];
      return events.map(vaccinationEventService.mapEventData);
    } catch (error) {
      console.error('❌ Error getting upcoming vaccination events:', error);
      throw error;
    }
  },

  // Get vaccination events by date range
  getEventsByDateRange: async (startDate, endDate) => {
    try {
      console.log(
        '🌐 Getting vaccination events by date range:',
        startDate,
        endDate
      );
      const url = `${API_ENDPOINTS.VACCINATION_EVENT.GET_BY_DATE_RANGE}?startDate=${startDate}&endDate=${endDate}`;
      const response = await apiClient.get(url);
      console.log('📥 Vaccination events by date range:', response);

      const events = Array.isArray(response) ? response : [];
      return events.map(vaccinationEventService.mapEventData);
    } catch (error) {
      console.error(
        '❌ Error getting vaccination events by date range:',
        error
      );
      throw error;
    }
  },

  // Get vaccination event summary with student list
  getEventSummary: async eventId => {
    try {
      console.log('🌐 Getting vaccination event summary:', eventId);
      const url = buildApiUrl(
        API_ENDPOINTS.VACCINATION_EVENT.GET_SUMMARY,
        eventId
      );
      const response = await apiClient.get(url);
      console.log('📥 Vaccination event summary:', response);

      return response;
    } catch (error) {
      console.error('❌ Error getting vaccination event summary:', error);
      throw error;
    }
  },

  // Get student responses for vaccination event (will attend status)
  getEventResponses: async eventId => {
    try {
      console.log('🌐 Getting vaccination event responses:', eventId);
      const url = buildApiUrl(
        API_ENDPOINTS.VACCINATION_EVENT.GET_RESPONSES,
        eventId
      );
      const response = await apiClient.get(url);
      console.log('📥 Vaccination event responses:', response);

      const responses = Array.isArray(response) ? response : [];
      return responses.map(vaccinationEventService.mapStudentResponseData);
    } catch (error) {
      console.error('❌ Error getting vaccination event responses:', error);
      throw error;
    }
  },

  // Get parent responses for vaccination event (with updated mapping)
  getParentResponses: async eventId => {
    try {
      console.log('🌐 Getting vaccination event parent responses:', eventId);
      const url = buildApiUrl(
        API_ENDPOINTS.VACCINATION_EVENT.GET_PARENT_RESPONSES,
        eventId
      );
      const response = await apiClient.get(url);
      console.log('📥 Vaccination event parent responses:', response);

      const responses = Array.isArray(response) ? response : [];

      // Flatten the responses since each parent can have multiple students
      const flattenedResponses = [];
      responses.forEach(parentResponse => {
        const mappedResponses =
          vaccinationEventService.mapParentResponseData(parentResponse);
        flattenedResponses.push(...mappedResponses);
      });

      return flattenedResponses;
    } catch (error) {
      console.error(
        '❌ Error getting vaccination event parent responses:',
        error
      );
      throw error;
    }
  },

  // Send email to all parents (Manager only)
  sendEmailToAll: async emailData => {
    try {
      console.log('🌐 Sending email to all parents:', emailData);
      const response = await apiClient.post(
        API_ENDPOINTS.VACCINATION_EVENT.SEND_EMAIL_ALL,
        emailData
      );
      console.log('✅ Email sent to all parents:', response);

      return response;
    } catch (error) {
      console.error('❌ Error sending email to all parents:', error);
      throw error;
    }
  },

  // Send email to specific parents (Manager only)
  sendEmailToSpecific: async (parentIds, emailData) => {
    try {
      console.log('🌐 Sending email to specific parents:', {
        parentIds,
        emailData,
      });

      // Ensure parentIds is an array
      const parentIdsArray = Array.isArray(parentIds) ? parentIds : [parentIds];

      const requestBody = {
        ids: parentIdsArray,
        sendVaccinationEmailDTO: emailData,
      };

      const response = await apiClient.post(
        API_ENDPOINTS.VACCINATION_EVENT.SEND_EMAIL_SPECIFIC,
        requestBody
      );
      console.log('✅ Email sent to specific parents:', response);

      return response;
    } catch (error) {
      console.error('❌ Error sending email to specific parents:', error);
      throw error;
    }
  },

  // Send email to specific students (Manager only)
  sendEmailToSpecificStudents: async (studentIds, emailData) => {
    try {
      console.log('🌐 Sending email to specific students:', {
        studentIds,
        emailData,
      });

      // Ensure studentIds is an array
      const studentIdsArray = Array.isArray(studentIds)
        ? studentIds
        : [studentIds];

      const requestBody = {
        ids: studentIdsArray,
        sendVaccinationEmailDTO: emailData,
      };

      const response = await apiClient.post(
        API_ENDPOINTS.VACCINATION_EVENT.SEND_EMAIL_TO_SPECIFIC_STUDENTS,
        requestBody
      );
      console.log('✅ Email sent to specific students:', response);

      return response;
    } catch (error) {
      console.error('❌ Error sending email to specific students:', error);
      throw error;
    }
  },

  // Get parent's own responses for all vaccination events (updated for multiple children)
  getMyResponses: async () => {
    try {
      console.log("🌐 Getting parent's vaccination responses");

      // Get user info to get parent ID
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        throw new Error('User info not found');
      }

      const parsedUserInfo = JSON.parse(userInfo);
      const parentId = parsedUserInfo.userId || parsedUserInfo.id;

      if (!parentId) {
        throw new Error('Parent ID not found');
      }

      // Get all events first
      const allEvents = await vaccinationEventService.getAllEvents();

      // Get responses for each event
      const eventsWithResponses = await Promise.all(
        allEvents.map(async event => {
          try {
            const parentResponses =
              await vaccinationEventService.getParentResponses(event.id);

            // Find all responses for this parent (can have multiple children)
            const myResponses = parentResponses.filter(
              response => response.parentId === parentId
            );

            // Group responses by student for better display
            const responsesByStudent = myResponses.reduce((acc, response) => {
              if (!acc[response.studentId]) {
                acc[response.studentId] = [];
              }
              acc[response.studentId].push(response);
              return acc;
            }, {});

            // Determine overall response status for the event
            let overallStatus = 'Chưa phản hồi';
            if (myResponses.length > 0) {
              const confirmedCount = myResponses.filter(
                r => r.willAttend === true
              ).length;
              const declinedCount = myResponses.filter(
                r => r.willAttend === false
              ).length;
              const pendingCount = myResponses.filter(
                r => r.willAttend === null
              ).length;

              if (pendingCount === myResponses.length) {
                overallStatus = 'Chưa phản hồi';
              } else if (confirmedCount === myResponses.length) {
                overallStatus = 'Đã đồng ý (tất cả)';
              } else if (declinedCount === myResponses.length) {
                overallStatus = 'Đã từ chối (tất cả)';
              } else {
                overallStatus = `Đã phản hồi (${confirmedCount} đồng ý, ${declinedCount} từ chối, ${pendingCount} chưa phản hồi)`;
              }
            }

            return {
              ...event,
              myResponses: myResponses || [],
              responsesByStudent,
              responseStatus: overallStatus,
              totalChildren: myResponses.length,
              confirmedChildren: myResponses.filter(r => r.willAttend === true)
                .length,
              declinedChildren: myResponses.filter(r => r.willAttend === false)
                .length,
              pendingChildren: myResponses.filter(r => r.willAttend === null)
                .length,
            };
          } catch (error) {
            console.error(
              `Error getting responses for event ${event.id}:`,
              error
            );
            return {
              ...event,
              myResponses: [],
              responsesByStudent: {},
              responseStatus: 'Chưa phản hồi',
              totalChildren: 0,
              confirmedChildren: 0,
              declinedChildren: 0,
              pendingChildren: 0,
            };
          }
        })
      );

      return eventsWithResponses;
    } catch (error) {
      console.error("❌ Error getting parent's vaccination responses:", error);
      throw error;
    }
  },

  // Map vaccination event data for display
  mapEventData: apiEvent => {
    return {
      id: apiEvent.vaccinationEventId || apiEvent.id,
      title:
        apiEvent.vaccinationEventName || apiEvent.title || 'Chưa có tiêu đề',
      description: apiEvent.description || 'Chưa có mô tả',
      eventDate: apiEvent.eventDate
        ? new Date(apiEvent.eventDate).toLocaleDateString('vi-VN')
        : 'Chưa có ngày',
      location: apiEvent.location || 'Chưa có địa điểm',
      organizedBy: apiEvent.organizedBy || 'string',
      status: apiEvent.status || 'Active',
      isActive: apiEvent.isActive !== false,
      createdBy: apiEvent.createdBy || 'System',
      createdDate: apiEvent.createdDate
        ? new Date(apiEvent.createdDate).toLocaleDateString('vi-VN')
        : null,
      modifiedBy: apiEvent.modifiedBy || 'System',
      modifiedDate: apiEvent.modifiedDate
        ? new Date(apiEvent.modifiedDate).toLocaleDateString('vi-VN')
        : null,
      isDeleted: apiEvent.isDeleted || false,
      // Additional fields from API response
      totalStudents: apiEvent.totalStudents || 0,
      confirmedCount: apiEvent.confirmedCount || 0,
      declinedCount: apiEvent.declinedCount || 0,
      pendingCount: apiEvent.pendingCount || 0,
    };
  },

  // Map student vaccination response data
  mapStudentResponseData: apiResponse => {
    return {
      id: apiResponse.id || apiResponse.responseId,
      studentId: apiResponse.studentId,
      parentId: apiResponse.parentId,
      studentName: apiResponse.studentName || 'Chưa có tên',
      parentName: apiResponse.parentName || 'Chưa có thông tin phụ huynh',
      parentEmail: apiResponse.parentEmail || 'Chưa có email',
      className: apiResponse.className || 'Chưa có lớp',
      willAttend: apiResponse.willAttend,
      reasonForDecline: apiResponse.reasonForDecline || '',
      responseDate: apiResponse.responseDate
        ? new Date(apiResponse.responseDate).toLocaleDateString('vi-VN')
        : null,
      status: apiResponse.status || 'Pending',
    };
  },

  // Map parent vaccination response data (updated for multiple students per parent)
  mapParentResponseData: apiResponse => {
    // Handle both old single-student format and new multiple-students format
    if (apiResponse.responses && Array.isArray(apiResponse.responses)) {
      // New format: multiple students per parent
      return apiResponse.responses.map(studentResponse => ({
        parentId: apiResponse.parentId,
        studentId: studentResponse.studentId,
        vaccinationEventId: apiResponse.vaccinationEventId,
        willAttend: studentResponse.willAttend,
        reasonForDecline: studentResponse.reasonForDecline || '',
        parentConsent: apiResponse.parentConsent,
        // Add status based on willAttend value
        status:
          studentResponse.willAttend === true
            ? 'Đồng ý'
            : studentResponse.willAttend === false
            ? 'Từ chối'
            : 'Chưa phản hồi',
        statusClass:
          studentResponse.willAttend === true
            ? 'confirmed'
            : studentResponse.willAttend === false
            ? 'declined'
            : 'pending',
      }));
    } else {
      // Old format: single student
      return [
        {
          parentId: apiResponse.parentId,
          studentId: apiResponse.studentId,
          vaccinationEventId: apiResponse.vaccinationEventId,
          willAttend: apiResponse.willAttend,
          reasonForDecline: apiResponse.reasonForDecline || '',
          parentConsent: apiResponse.parentConsent,
          status:
            apiResponse.willAttend === true
              ? 'Đồng ý'
              : apiResponse.willAttend === false
              ? 'Từ chối'
              : 'Chưa phản hồi',
          statusClass:
            apiResponse.willAttend === true
              ? 'confirmed'
              : apiResponse.willAttend === false
              ? 'declined'
              : 'pending',
        },
      ];
    }
  },
};

export default vaccinationEventService;
