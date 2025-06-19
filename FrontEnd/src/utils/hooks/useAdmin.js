import { useApi, useApiCall } from "./useApi";
import {
  adminStaffService,
  adminEmailService,
  adminBlogService,
  adminSystemService,
  adminCategoryService,
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
  return useApi(adminSystemService.getSystemLogs);
};

// Hook for system statistics (mock data)
export const useSystemStatistics = () => {
  return useApi(adminSystemService.getSystemStats);
};

// Hook for health categories (mock data)
export const useHealthCategories = () => {
  return useApi(adminCategoryService.getHealthCategories);
};

// Hook for admin actions
export const useAdminActions = () => {
  const { execute, loading, error } = useApiCall();

  const createStaff = async (staffData) => {
    return execute(() => adminStaffService.registerStaff(staffData));
  };

  const updateStaff = async (staffData) => {
    return execute(() => adminStaffService.updateStaff(staffData));
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
    return execute(() =>
      adminCategoryService.createHealthCategory(categoryData)
    );
  };

  const updateHealthCategory = async (categoryId, categoryData) => {
    return execute(() =>
      adminCategoryService.updateHealthCategory(categoryId, categoryData)
    );
  };

  const deleteHealthCategory = async (categoryId) => {
    return execute(() => adminCategoryService.deleteHealthCategory(categoryId));
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
