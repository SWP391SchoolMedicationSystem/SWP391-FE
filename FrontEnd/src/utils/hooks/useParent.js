import { useApi, useApiCall } from "./useApi";
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

// Hook for parent notifications
export const useParentNotifications = () => {
  return useApi(parentNotificationService.getNotifications);
};

// Hook for parent health records
export const useParentHealthRecords = (studentId) => {
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
  useParentBlogs,
  useConsultations,
  useParentChat,
  useParentActions,
};
