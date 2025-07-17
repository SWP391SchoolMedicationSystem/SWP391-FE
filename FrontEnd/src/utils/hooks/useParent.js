import React, { useState, useCallback } from 'react';
import { useApi, useApiCall } from './useApi';
import {
  parentService,
  parentNotificationService,
  parentHealthService,
  parentBlogService,
  consultationService,
  parentChatService,
} from '../../services/parentService';

// Hook for parent profile data
export const useParentProfile = () => {
  return useApi(parentService.getProfile);
};

// Hook for parent notifications
export const useParentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await parentNotificationService.getNotifications();
      const finalData = Array.isArray(data) ? data : [];
      setNotifications(finalData);
    } catch (err) {
      console.error('Failed to fetch parent notifications:', err);
      setError('Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(
    async notificationId => {
      try {
        await parentNotificationService.markAsRead(notificationId);
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

// Hook for parent students (get children)
export const useParentStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current parent ID from localStorage
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const parentId = userInfo.userId;

      if (!parentId) {
        throw new Error('Không tìm thấy thông tin phụ huynh');
      }

          const data = await parentService.getMyChildren(parentId);

      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ Failed to fetch parent students:', err);
      setError(err.message || 'Không thể tải danh sách con em');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Auto-fetch on mount
  React.useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    data: students,
    loading,
    error,
    refetch,
    fetchStudents,
  };
};

// Hook for parent health records
export const useParentHealthRecords = studentId => {
  return useApi(
    () => parentHealthService.getHealthRecords(studentId),
    [studentId]
  );
};

// Hook for published blogs (parent view)
export const useParentBlogs = () => {
  return useApi(parentBlogService.getPublishedBlogs);
};

// Hook for consultation data
export const useConsultations = () => {
  return useApi(consultationService.getConsultations);
};

// Hook for chat messages
export const useParentChat = () => {
  return useApi(parentChatService.getChatMessages);
};

// Hook for parent actions
export const useParentActions = () => {
  const { execute, loading, error } = useApiCall();

  const updateProfile = async profileData => {
    return execute(() => parentService.updateProfile(profileData));
  };

  const markNotificationAsRead = async notificationId => {
    return execute(() => parentNotificationService.markAsRead(notificationId));
  };

  const createConsultation = async consultationData => {
    return execute(() =>
      consultationService.createConsultation(consultationData)
    );
  };

  const sendChatMessage = async messageData => {
    return execute(() => parentChatService.sendMessage(messageData));
  };

  return {
    updateProfile,
    markNotificationAsRead,
    createConsultation,
    sendChatMessage,
    loading,
    error,
  };
};

export default {
  useParentProfile,
  useParentNotifications,
  useParentStudents,
  useParentHealthRecords,
  useParentBlogs,
  useConsultations,
  useParentChat,
  useParentActions,
};
