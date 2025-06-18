import { useApi, useApiCall, usePaginatedApi } from "./useApi";
import {
  managerBlogService,
  managerStudentService,
  managerStaffService,
  managerNotificationService,
  managerEmailService,
  managerVaccinationService,
  managerAccountService,
} from "../../services/managerService";

// Hook for manager blog operations
export const useManagerBlogs = () => {
  return useApi(managerBlogService.getPendingBlogs);
};

// Hook for student management
export const useManagerStudents = (page = 1, pageSize = 10) => {
  return useApi(() => managerStudentService.getAllStudents());
};

// Hook for staff management
export const useManagerStaff = () => {
  return useApi(managerStaffService.getAllStaff);
};

// Hook for manager notifications
export const useManagerNotifications = () => {
  return useApi(managerNotificationService.getNotifications);
};

// Hook for vaccination data
export const useVaccinations = () => {
  return useApi(managerVaccinationService.getVaccinationList);
};

// Hook for parent accounts
export const useParentAccounts = () => {
  return useApi(managerAccountService.getAllParents);
};

// Hook for manager actions
export const useManagerActions = () => {
  const { execute, loading, error } = useApiCall();

  const approveBlog = async (blogId) => {
    return execute(() => managerBlogService.approveBlog(blogId));
  };

  const rejectBlog = async (blogId, reason) => {
    return execute(() => managerBlogService.rejectBlog(blogId, reason));
  };

  const createStudent = async (studentData) => {
    return execute(() => managerStudentService.addStudent(studentData));
  };

  const updateStudent = async (studentData) => {
    return execute(() => managerStudentService.updateStudent(studentData));
  };

  const deleteStudent = async (studentId) => {
    return execute(() => managerStudentService.deleteStudent(studentId));
  };

  const createStaff = async (staffData) => {
    return execute(() => managerStaffService.createStaff(staffData));
  };

  const updateStaff = async (staffId, staffData) => {
    return execute(() => managerStaffService.updateStaff(staffId, staffData));
  };

  const deleteStaff = async (staffId) => {
    return execute(() => managerStaffService.deleteStaff(staffId));
  };

  const sendNotification = async (notificationData) => {
    return execute(() =>
      managerNotificationService.sendNotification(notificationData)
    );
  };

  const sendEmail = async (emailData) => {
    return execute(() => managerEmailService.sendEmail(emailData));
  };

  const scheduleVaccination = async (vaccinationData) => {
    return execute(() =>
      managerVaccinationService.scheduleVaccination(vaccinationData)
    );
  };

  return {
    approveBlog,
    rejectBlog,
    createStudent,
    updateStudent,
    deleteStudent,
    createStaff,
    updateStaff,
    deleteStaff,
    sendNotification,
    sendEmail,
    scheduleVaccination,
    loading,
    error,
  };
};

export default {
  useManagerBlogs,
  useManagerStudents,
  useManagerStaff,
  useManagerNotifications,
  useVaccinations,
  useParentAccounts,
  useManagerActions,
};
