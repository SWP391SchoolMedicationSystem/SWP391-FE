import { useApi, useApiCall } from "./useApi";
import {
  nurseHealthRecordService,
  nurseBlogService,
  nurseStudentService,
  nurseNotificationService,
  medicationService,
  nurseVaccinationService,
  nurseChatService,
} from "../../services/nurseService";

// Hook for nurse health records
export const useNurseHealthRecords = () => {
  return useApi(nurseHealthRecordService.getHealthRecords);
};

// Hook for nurse blog management
export const useNurseBlogs = () => {
  return useApi(nurseBlogService.getBlogs);
};

// Hook for nurse student management
export const useNurseStudents = () => {
  return useApi(nurseStudentService.getStudents);
};

// Hook for nurse notifications
export const useNurseNotifications = () => {
  return useApi(nurseNotificationService.getNotifications);
};

// Hook for medication management
export const useMedications = () => {
  return useApi(medicationService.getMedications);
};

// Hook for vaccination management
export const useNurseVaccinations = () => {
  return useApi(nurseVaccinationService.getVaccinations);
};

// Hook for nurse chat
export const useNurseChat = () => {
  return useApi(nurseChatService.getChatMessages);
};

// Hook for nurse actions
export const useNurseActions = () => {
  const { execute, loading, error } = useApiCall();

  const createHealthRecord = async (recordData) => {
    return execute(() =>
      nurseHealthRecordService.createHealthRecord(recordData)
    );
  };

  const updateHealthRecord = async (recordId, recordData) => {
    return execute(() =>
      nurseHealthRecordService.updateHealthRecord(recordId, recordData)
    );
  };

  const deleteHealthRecord = async (recordId) => {
    return execute(() => nurseHealthRecordService.deleteHealthRecord(recordId));
  };

  const createBlog = async (blogData) => {
    return execute(() => nurseBlogService.createBlog(blogData));
  };

  const updateBlog = async (blogId, blogData) => {
    return execute(() => nurseBlogService.updateBlog(blogId, blogData));
  };

  const deleteBlog = async (blogId) => {
    return execute(() => nurseBlogService.deleteBlog(blogId));
  };

  const updateStudent = async (studentId, studentData) => {
    return execute(() =>
      nurseStudentService.updateStudent(studentId, studentData)
    );
  };

  const sendNotification = async (notificationData) => {
    return execute(() =>
      nurseNotificationService.sendNotification(notificationData)
    );
  };

  const markNotificationAsRead = async (notificationId) => {
    return execute(() => nurseNotificationService.markAsRead(notificationId));
  };

  const createMedication = async (medicationData) => {
    return execute(() => medicationService.createMedication(medicationData));
  };

  const updateMedication = async (medicationId, medicationData) => {
    return execute(() =>
      medicationService.updateMedication(medicationId, medicationData)
    );
  };

  const deleteMedication = async (medicationId) => {
    return execute(() => medicationService.deleteMedication(medicationId));
  };

  const scheduleVaccination = async (vaccinationData) => {
    return execute(() =>
      nurseVaccinationService.scheduleVaccination(vaccinationData)
    );
  };

  const updateVaccination = async (vaccinationId, vaccinationData) => {
    return execute(() =>
      nurseVaccinationService.updateVaccination(vaccinationId, vaccinationData)
    );
  };

  const sendChatMessage = async (messageData) => {
    return execute(() => nurseChatService.sendMessage(messageData));
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
    scheduleVaccination,
    updateVaccination,
    sendChatMessage,
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
  useNurseVaccinations,
  useNurseChat,
  useNurseActions,
};
