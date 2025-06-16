import React from "react";
import { Navigate } from "react-router-dom";
import userService from "../services/userService";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = userService.isAuthenticated();
  const userRole = userService.getCurrentUserRole();

  // Nếu chưa đăng nhập, chuyển về trang login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Nếu có quy định role và user không có quyền truy cập
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Chuyển hướng về trang phù hợp với role của user
    switch (userRole) {
      case "Manager":
        return <Navigate to="/manager" replace />;
      case "Nurse":
        return <Navigate to="/nurse" replace />;
      case "Parent":
        return <Navigate to="/parent" replace />;
      case "Admin":
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
