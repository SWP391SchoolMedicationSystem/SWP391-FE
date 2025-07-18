/* eslint-disable no-undef */
import { useApi, useApiCall } from './useApi';
import { useState, useCallback } from 'react';
import {
  nurseHealthService,
  nurseBlogService,
  nurseStudentService,
  nurseNotificationService,
  nurseMedicationService,
  nurseChatService,
  nurseFormService,
} from '../../services/nurseService';

// Hook for nurse health records
export const useNurseHealthRecords = () => {
  return useApi(nurseHealthService.getAllHealthRecords);
};

// Hook for nurse blog management
export const useNurseBlogs = () => {
  return useApi(nurseBlogService.getAllBlogs);
};

// Hook for nurse student management
export const useNurseStudents = () => {
  return useApi(nurseStudentService.getAllStudents);
};

// Hook for nurse notifications with enhanced functionality
export const useNurseNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await nurseNotificationService.getNotifications();
      const finalData = Array.isArray(data) ? data : [];
      setNotifications(finalData);

      console.log('fetch noti', finalData);
    } catch (err) {
      console.error('Failed to fetch nurse notifications:', err);
      setError('Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(
    async notificationId => {
      try {
        await nurseNotificationService.markAsRead(notificationId);
        // Refresh notifications after marking as read
        await fetchNotifications();
      } catch (err) {
        console.error('Failed to mark notification as read:', err);
        throw err;
      }
    },
    [fetchNotifications]
  );

  const refetch = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    data: notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    refetch,
  };
};

// Hook for medication management
export const useMedications = () => {
  return useApi(nurseMedicationService.getMedicationSchedule);
};

// Hook for nurse chat
export const useNurseChat = () => {
  return useApi(nurseChatService.getChatMessages);
};

// Hook for nurse forms (parent requests)
export const useNurseForms = () => {
  return useApi(nurseFormService.getAllForms);
};

// Hook for nurse actions
export const useNurseActions = () => {
  const { execute, loading, error } = useApiCall();

  const createHealthRecord = async recordData => {
    return execute(() =>
      nurseHealthRecordService.createHealthRecord(recordData)
    );
  };

  const updateHealthRecord = async (recordId, recordData) => {
    return execute(() =>
      nurseHealthRecordService.updateHealthRecord(recordId, recordData)
    );
  };

  const deleteHealthRecord = async recordId => {
    return execute(() => nurseHealthRecordService.deleteHealthRecord(recordId));
  };

  const createBlog = async (blogData, imageFile = null) => {
    return execute(() => nurseBlogService.createBlog(blogData, imageFile));
  };

  const updateBlog = async (blogId, blogData) => {
    return execute(() => nurseBlogService.updateBlog(blogId, blogData));
  };

  const deleteBlog = async blogId => {
    return execute(() => nurseBlogService.deleteBlog(blogId));
  };

  const updateStudent = async (studentId, studentData) => {
    return execute(() =>
      nurseStudentService.updateStudent(studentId, studentData)
    );
  };

  const sendNotification = async notificationData => {
    return execute(() =>
      nurseNotificationService.sendNotification(notificationData)
    );
  };

  const markNotificationAsRead = async notificationId => {
    return execute(() => nurseNotificationService.markAsRead(notificationId));
  };

  const createMedication = async medicationData => {
    return execute(() => medicationService.createMedication(medicationData));
  };

  const updateMedication = async (medicationId, medicationData) => {
    return execute(() =>
      medicationService.updateMedication(medicationId, medicationData)
    );
  };

  const deleteMedication = async medicationId => {
    return execute(() => medicationService.deleteMedication(medicationId));
  };

  const sendChatMessage = async messageData => {
    return execute(() => nurseChatService.sendMessage(messageData));
  };

  const approveForm = async (formId, staffId) => {
    return execute(() => nurseFormService.approveForm(formId, staffId));
  };

  const declineForm = async (formId, reason, staffId) => {
    return execute(() => nurseFormService.declineForm(formId, reason, staffId));
  };

  const getFormById = async formId => {
    return execute(() => nurseFormService.getFormById(formId));
  };

  const getFormsByParent = async parentId => {
    return execute(() => nurseFormService.getFormsByParent(parentId));
  };

  const getFormsByCategory = async categoryId => {
    return execute(() => nurseFormService.getFormsByCategory(categoryId));
  };

  const deleteForm = async formId => {
    return execute(() => nurseFormService.deleteForm(formId));
  };

  return {
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord,
    createBlog,
    updateBlog,
    deleteBlog,
    updateStudent,
    sendNotification,
    markNotificationAsRead,
    createMedication,
    updateMedication,
    deleteMedication,

    sendChatMessage,
    approveForm,
    declineForm,
    getFormById,
    getFormsByParent,
    getFormsByCategory,
    deleteForm,
    loading,
    error,
  };
};

export default {
  useNurseHealthRecords,
  useNurseBlogs,
  useNurseStudents,
  useNurseNotifications,
  useMedications,

  useNurseChat,
  useNurseForms,
  useNurseActions,
};
