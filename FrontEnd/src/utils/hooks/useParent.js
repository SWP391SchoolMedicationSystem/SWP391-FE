import { useApi, useApiCall } from "./useApi";
import { useState, useCallback } from "react";
import {
  parentService,
  parentNotificationService,
  parentHealthService,
  parentBlogService,
  consultationService,
  parentChatService,
} from "../../services/parentService";

// Hook for parent profile data
export const useParentProfile = () => {
  return useApi(parentService.getProfile);
};

// Hook for parent notifications with enhanced functionality
export const useParentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await parentNotificationService.getNotifications();
      console.log("Raw parent notifications data:", data);

      // Transform API data to match component expectations
      const transformedData = Array.isArray(data)
        ? data.map((notification) => {
            // Map API type to component filter types
            const mapNotificationType = (apiType) => {
              if (!apiType) return "general";
              const type = apiType.toLowerCase();
              if (type.includes("vaccination") || type.includes("tiêm"))
                return "vaccination";
              if (type.includes("health") || type.includes("sức khỏe"))
                return "health";
              if (type.includes("event") || type.includes("sự kiện"))
                return "event";
              return "general";
            };

            return {
              id: notification.id || Math.random().toString(36),
              title: notification.title || "Thông báo",
              content: notification.message || "Không có nội dung",
              type: mapNotificationType(notification.type),
              isRead: !notification.isDeleted, // Assuming isDeleted means read
              priority: "medium", // Default priority since API doesn't provide it
              sender: notification.createdby || "Hệ thống",
              date: notification.createdAt
                ? new Date(notification.createdAt).toLocaleDateString("vi-VN")
                : new Date().toLocaleDateString("vi-VN"),
              time: notification.createdAt
                ? new Date(notification.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
              createdAt: notification.createdAt,
              createdby: notification.createdby,
              modifiedby: notification.modifiedby,
              modifieddate: notification.modifieddate,
            };
          })
        : [];

      console.log("Transformed parent notifications:", transformedData);
      setNotifications(transformedData);
    } catch (err) {
      console.error("Failed to fetch parent notifications:", err);
      if (err.response?.status === 500) {
        setError("Lỗi server: Không thể tải thông báo. Vui lòng thử lại sau.");
      } else {
        setError("Không thể tải thông báo");
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await parentNotificationService.markAsRead(notificationId);
        // Refresh notifications after marking as read
        await fetchNotifications();
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
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

// Hook for parent health records
export const useParentHealthRecords = (studentId) => {
  return useApi(
    () => parentHealthService.getHealthRecords(studentId),
    [studentId]
  );
};

// Hook for parent's students
export const useParentStudents = () => {
  return useApi(parentService.getStudents);
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

  const updateProfile = async (profileData) => {
    return execute(() => parentService.updateProfile(profileData));
  };

  const markNotificationAsRead = async (notificationId) => {
    return execute(() => parentNotificationService.markAsRead(notificationId));
  };

  const createConsultation = async (consultationData) => {
    return execute(() =>
      consultationService.createConsultation(consultationData)
    );
  };

  const sendChatMessage = async (messageData) => {
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
  useParentHealthRecords,
  useParentStudents,
  useParentBlogs,
  useConsultations,
  useParentChat,
  useParentActions,
};
