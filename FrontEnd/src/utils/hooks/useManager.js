import { useApi, useApiCall, usePaginatedApi } from "./useApi";
import {
  managerBlogService,
  managerStudentService,
  managerStaffService,
  managerNotificationService,
  managerEmailService,
  managerAccountService,
} from "../../services/managerService";
import { useState, useCallback } from "react";

// Hook for manager blog operations
export const useManagerBlogs = () => {
  return useApi(managerBlogService.getAllBlogs);
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
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await managerNotificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNotificationForParents = useCallback(
    async (notificationData) => {
      try {
        const result =
          await managerNotificationService.createNotificationForParents(
            notificationData
          );
        // Refresh notifications after creating
        await fetchNotifications();
        return result;
      } catch (err) {
        console.error("Failed to create notification for parents:", err);
        throw err;
      }
    },
    [fetchNotifications]
  );

  const createNotificationForStaff = useCallback(
    async (notificationData) => {
      try {
        const result =
          await managerNotificationService.createNotificationForStaff(
            notificationData
          );
        // Refresh notifications after creating
        await fetchNotifications();
        return result;
      } catch (err) {
        console.error("Failed to create notification for staff:", err);
        throw err;
      }
    },
    [fetchNotifications]
  );

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        const result = await managerNotificationService.markAsRead(
          notificationId
        );
        // Refresh notifications after marking as read
        await fetchNotifications();
        return result;
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
    notifications,
    loading,
    error,
    fetchNotifications,
    createNotificationForParents,
    createNotificationForStaff,
    markAsRead,
    refetch,
  };
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

  const createBlog = async (blogData) => {
    return execute(() => managerBlogService.createBlog(blogData));
  };

  const updateBlog = async (blogId, blogData) => {
    return execute(() => managerBlogService.updateBlog(blogId, blogData));
  };

  const deleteBlog = async (blogId) => {
    return execute(() => managerBlogService.deleteBlog(blogId));
  };

  const getBlogById = async (blogId) => {
    return execute(() => managerBlogService.getBlogById(blogId));
  };

  const sendNotification = async (notificationData) => {
    return execute(() =>
      managerNotificationService.sendNotification(notificationData)
    );
  };

  const sendEmail = async (emailData) => {
    return execute(() => managerEmailService.sendEmail(emailData));
  };

  return {
    approveBlog,
    rejectBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlogById,
    createStudent,
    updateStudent,
    deleteStudent,
    createStaff,
    updateStaff,
    deleteStaff,
    sendNotification,
    sendEmail,

    loading,
    error,
  };
};

// Hook cho Account Management
export const useManagerAccounts = () => {
  const [parentsList, setParentsList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all parents
  const fetchParents = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const data = await managerAccountService.getAllParents();
      setParentsList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch parents:", err);
      setError("Failed to load parents list");
      setParentsList([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // Fetch all staff
  const fetchStaff = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const data = await managerAccountService.getAllStaff();
      setStaffList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
      setError("Failed to load staff list");
      setStaffList([]);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // Update parent
  const updateParent = useCallback(
    async (parentData) => {
      try {
        setLoading(true);
        setError(null);

        const result = await managerAccountService.updateParent(parentData);

        // Refresh parents list
        await fetchParents(false);

        return result;
      } catch (err) {
        console.error("Failed to update parent:", err);
        setError("Failed to update parent information");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchParents]
  );

  // Update staff
  const updateStaff = useCallback(
    async (staffData) => {
      try {
        setLoading(true);
        setError(null);

        const result = await managerAccountService.updateStaff(staffData);

        // Refresh staff list
        await fetchStaff(false);

        return result;
      } catch (err) {
        console.error("Failed to update staff:", err);
        setError("Failed to update staff information");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchStaff]
  );

  // Delete parent
  const deleteParent = useCallback(
    async (parentId) => {
      try {
        setLoading(true);
        setError(null);

        const result = await managerAccountService.deleteParent(parentId);

        // Refresh parents list
        await fetchParents(false);

        return result;
      } catch (err) {
        console.error("Failed to delete parent:", err);
        setError("Failed to delete parent");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchParents]
  );

  // Delete staff
  const deleteStaff = useCallback(
    async (staffId) => {
      try {
        setLoading(true);
        setError(null);

        const result = await managerAccountService.deleteStaff(staffId);

        // Refresh staff list
        await fetchStaff(false);

        return result;
      } catch (err) {
        console.error("Failed to delete staff:", err);
        setError("Failed to delete staff");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchStaff]
  );

  // Fetch all accounts (parents + staff)
  const fetchAllAccounts = useCallback(async () => {
    await Promise.all([fetchParents(false), fetchStaff(false)]);
  }, [fetchParents, fetchStaff]);

  // Toggle parent status
  const toggleParentStatus = useCallback(
    async (parentId) => {
      try {
        setLoading(true);
        setError(null);

        const result = await managerAccountService.toggleParentStatus(parentId);

        // Refresh parents list
        await fetchParents(false);

        return result;
      } catch (err) {
        console.error("Failed to toggle parent status:", err);
        setError("Failed to update parent status");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchParents]
  );

  // Toggle staff status
  const toggleStaffStatus = useCallback(
    async (staffId) => {
      try {
        setLoading(true);
        setError(null);

        const result = await managerAccountService.toggleStaffStatus(staffId);

        // Refresh staff list
        await fetchStaff(false);

        return result;
      } catch (err) {
        console.error("Failed to toggle staff status:", err);
        setError("Failed to update staff status");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchStaff]
  );

  // Retry function
  const refetch = useCallback(() => {
    fetchAllAccounts();
  }, [fetchAllAccounts]);

  return {
    // Data
    parentsList,
    staffList,
    loading,
    error,

    // Actions
    fetchParents,
    fetchStaff,
    fetchAllAccounts,
    updateParent,
    updateStaff,
    toggleParentStatus,
    toggleStaffStatus,
    refetch,
  };
};

export default {
  useManagerBlogs,
  useManagerStudents,
  useManagerStaff,
  useManagerNotifications,
  useParentAccounts,
  useManagerActions,
  useManagerAccounts,
};
