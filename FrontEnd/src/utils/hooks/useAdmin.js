import { useApi, useApiCall } from "./useApi";
import {
  adminStaffService,
  adminEmailService,
  adminBlogService,
  systemLogsService,
  statisticsService,
  healthCategoriesService,
} from "../../services/adminService";

// Hook for admin staff management
export const useAdminStaff = () => {
  return useApi(adminStaffService.getAllStaff);
};

// Hook for email templates
export const useEmailTemplates = () => {
  return useApi(adminEmailService.getEmailTemplates);
};

// Hook for admin blog management
export const useAdminBlogs = () => {
  return useApi(adminBlogService.getAllBlogs);
};

// Hook for system logs (mock data)
export const useSystemLogs = () => {
  return useApi(systemLogsService.getSystemLogs);
};

// Hook for system statistics (mock data)
export const useSystemStatistics = () => {
  return useApi(statisticsService.getStatistics);
};

// Hook for health categories (mock data)
export const useHealthCategories = () => {
  return useApi(healthCategoriesService.getCategories);
};

// Hook for admin actions
export const useAdminActions = () => {
  const { execute, loading, error } = useApiCall();

  const createStaff = async (staffData) => {
    return execute(() => adminStaffService.createStaff(staffData));
  };

  const updateStaff = async (staffId, staffData) => {
    return execute(() => adminStaffService.updateStaff(staffId, staffData));
  };

  const deleteStaff = async (staffId) => {
    return execute(() => adminStaffService.deleteStaff(staffId));
  };

  const createEmailTemplate = async (templateData) => {
    return execute(() => adminEmailService.createEmailTemplate(templateData));
  };

  const updateEmailTemplate = async (templateData) => {
    return execute(() => adminEmailService.updateEmailTemplate(templateData));
  };

  const sendEmail = async (emailData) => {
    return execute(() => adminEmailService.sendEmail(emailData));
  };

  const approveBlog = async (blogId) => {
    return execute(() => adminBlogService.approveBlog(blogId));
  };

  const rejectBlog = async (blogId, reason) => {
    return execute(() => adminBlogService.rejectBlog(blogId, reason));
  };

  const createHealthCategory = async (categoryData) => {
    return execute(() => healthCategoriesService.createCategory(categoryData));
  };

  const updateHealthCategory = async (categoryId, categoryData) => {
    return execute(() =>
      healthCategoriesService.updateCategory(categoryId, categoryData)
    );
  };

  const deleteHealthCategory = async (categoryId) => {
    return execute(() => healthCategoriesService.deleteCategory(categoryId));
  };

  return {
    createStaff,
    updateStaff,
    deleteStaff,
    createEmailTemplate,
    updateEmailTemplate,
    sendEmail,
    approveBlog,
    rejectBlog,
    createHealthCategory,
    updateHealthCategory,
    deleteHealthCategory,
    loading,
    error,
  };
};

export default {
  useAdminStaff,
  useEmailTemplates,
  useAdminBlogs,
  useSystemLogs,
  useSystemStatistics,
  useHealthCategories,
  useAdminActions,
};
