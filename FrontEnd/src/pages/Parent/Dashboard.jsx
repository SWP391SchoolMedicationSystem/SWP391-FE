import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  useParentNotifications,
  useParentBlogs,
} from "../../utils/hooks/useParent";
import "../../css/Parent/Dashboard.css";

// Material-UI Icons
import NotificationsIcon from "@mui/icons-material/Notifications";
import InboxIcon from "@mui/icons-material/Inbox";
import ArticleIcon from "@mui/icons-material/Article";
import ChatIcon from "@mui/icons-material/Chat";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import BoltIcon from "@mui/icons-material/Bolt";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ForumIcon from "@mui/icons-material/Forum";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";

function ParentDashboard() {
  const navigate = useNavigate();
  const [quickStats, setQuickStats] = useState([]);

  // Get theme from parent layout
  const context = useOutletContext();
  const { theme, isDarkMode } = context || { theme: null, isDarkMode: false };

  // Get real data from APIs
  const { data: notifications, loading: notificationsLoading } =
    useParentNotifications();
  const { data: blogs, loading: blogsLoading } = useParentBlogs();

  // Mock data for features not yet available via API
  const studentInfo = {
    name: "Nguyễn Minh Khôi",
    class: "5A",
    studentId: "HS001",
    school: "Trường Tiểu học Nguyễn Du",
  };

  const healthSummary = {
    lastCheckup: "2024-03-10",
    nextCheckup: "2024-06-10",
    vaccinationStatus: "Đầy đủ",
    healthStatus: "Khỏe mạnh",
  };

  // Calculate real statistics
  useEffect(() => {
    const calculateStats = () => {
      const totalNotifications = notifications ? notifications.length : 0;
      const unreadNotifications = notifications
        ? notifications.filter((n) => !n.isRead).length
        : 0;
      const totalBlogs = blogs ? blogs.length : 0;

      const stats = [
        {
          title: "Thông báo mới",
          value: unreadNotifications.toString(),
          icon: (
            <NotificationsIcon sx={{ color: "#97a19b", fontSize: "2.5rem" }} />
          ),
          color: "stat-notification",
        },
        {
          title: "Tổng thông báo",
          value: totalNotifications.toString(),
          icon: <InboxIcon sx={{ color: "#97a19b", fontSize: "2.5rem" }} />,
          color: "stat-health",
        },
        {
          title: "Bài viết sức khỏe",
          value: totalBlogs.toString(),
          icon: <ArticleIcon sx={{ color: "#97a19b", fontSize: "2.5rem" }} />,
          color: "stat-vaccine",
        },
        {
          title: "Tin nhắn chưa đọc",
          value: "1", // Mock data - chat API not available
          icon: <ChatIcon sx={{ color: "#97a19b", fontSize: "2.5rem" }} />,
          color: "stat-message",
        },
      ];

      setQuickStats(stats);
    };

    if (!notificationsLoading && !blogsLoading) {
      calculateStats();
    }
  }, [notifications, blogs, notificationsLoading, blogsLoading]);

  // Get recent notifications from real data
  const getRecentNotifications = () => {
    if (!notifications || notifications.length === 0) {
      // Return mock data if no real notifications
      return [
        {
          id: 1,
          title: "Lịch tiêm vaccine mới",
          content:
            "Thông báo lịch tiêm vaccine sởi - rubella cho học sinh lớp 5",
          date: "2024-03-15",
          type: "vaccination",
        },
        {
          id: 2,
          title: "Kết quả khám sức khỏe định kỳ",
          content: "Kết quả khám sức khỏe của con em đã được cập nhật",
          date: "2024-03-12",
          type: "health",
        },
      ];
    }

    // Use real notifications data
    return notifications
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      )
      .slice(0, 3)
      .map((notification) => ({
        id: notification.id,
        title: notification.title,
        content: notification.content,
        date: notification.date,
        type: notification.type,
        isRead: notification.isRead,
      }));
  };

  const handleViewAllNotifications = () => {
    navigate("/parent/notifications");
  };

  const handleViewBlogs = () => {
    navigate("/parent/blogs");
  };

  const handleViewHealthHistory = () => {
    navigate("/parent/health-history");
  };

  const handleConsultation = () => {
    navigate("/parent/consultation");
  };

  const handleChatWithNurse = () => {
    navigate("/parent/chat");
  };

  const handlePersonalMedicine = () => {
    navigate("/parent/personal-medicine");
  };

  return (
    <div
      style={{
        padding: "20px",
        background: theme ? theme.background : "#f2f6f3",
        minHeight: "100vh",
        fontFamily:
          "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          padding: "30px",
          borderRadius: "20px",
          background: theme
            ? isDarkMode
              ? "linear-gradient(135deg, #2a2a2a 0%, #333333 100%)"
              : "linear-gradient(135deg, #2f5148 0%, #73ad67 100%)"
            : "linear-gradient(135deg, #2f5148 0%, #73ad67 100%)",
          color: "white",
          boxShadow: "0 4px 20px rgba(47, 81, 72, 0.3)",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2.5rem",
              margin: 0,
              fontWeight: 700,
              fontFamily: "Satoshi, sans-serif",
              color: "white",
            }}
          >
            Chào mừng, Phụ Huynh!
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              margin: "10px 0 0 0",
              opacity: 0.9,
              fontFamily: "Satoshi, sans-serif",
              color: "white",
            }}
          >
            Theo dõi sức khỏe và thông tin học tập của con em
          </p>
        </div>
        <div
          style={{
            fontSize: "1rem",
            opacity: 0.8,
            fontFamily: "Satoshi, sans-serif",
            color: "white",
          }}
        >
          <span>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {notificationsLoading || blogsLoading ? (
          <div
            style={{
              background: theme ? theme.cardBg : "white",
              padding: "25px",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 2px 10px rgba(193, 203, 194, 0.3)",
              border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
            }}
          >
            <p
              style={{
                color: theme ? theme.textSecondary : "#97a19b",
                fontFamily: "Satoshi, sans-serif",
                margin: 0,
              }}
            >
              <HourglassEmptyIcon
                sx={{
                  color: theme ? theme.textSecondary : "#97a19b",
                  fontSize: "1.2rem",
                  marginRight: "8px",
                }}
              />
              Đang tải thống kê...
            </p>
          </div>
        ) : (
          quickStats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: theme ? theme.cardBg : "white",
                padding: "25px",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                boxShadow: "0 2px 10px rgba(193, 203, 194, 0.3)",
                border: theme
                  ? `1px solid ${theme.border}`
                  : "1px solid #c1cbc2",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  padding: "15px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(191, 239, 161, 0.3)",
                }}
              >
                {stat.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "2rem",
                    margin: 0,
                    color: theme ? theme.textPrimary : "#2f5148",
                    fontWeight: 700,
                    fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  {stat.value}
                </h3>
                <p
                  style={{
                    margin: "5px 0 0 0",
                    color: theme ? theme.textSecondary : "#97a19b",
                    fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  {stat.title}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Notifications */}
      <div
        style={{
          background: theme ? theme.cardBg : "white",
          borderRadius: "20px",
          padding: "25px",
          marginBottom: "30px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            padding: "15px 20px",
            borderRadius: "15px",
            background: theme
              ? isDarkMode
                ? "linear-gradient(135deg, #444444 0%, #555555 100%)"
                : "linear-gradient(135deg, #a8d895 0%, #bfefa1 100%)"
              : "linear-gradient(135deg, #a8d895 0%, #bfefa1 100%)",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: theme ? (isDarkMode ? "#ffffff" : "#2f5148") : "#2f5148",
              fontFamily: "Satoshi, sans-serif",
              display: "flex",
              alignItems: "center",
            }}
          >
            <NotificationsIcon
              sx={{
                color: theme ? (isDarkMode ? "#ffffff" : "#2f5148") : "#2f5148",
                fontSize: "1.2rem",
                marginRight: "8px",
              }}
            />
            Thông Báo Gần Đây
          </h3>
          <button
            style={{
              background: "transparent",
              border: theme
                ? `1px solid ${isDarkMode ? "#ffffff" : "#2f5148"}`
                : "1px solid #2f5148",
              color: theme ? (isDarkMode ? "#ffffff" : "#2f5148") : "#2f5148",
              padding: "8px 15px",
              borderRadius: "10px",
              cursor: "pointer",
              fontFamily: "Satoshi, sans-serif",
              fontWeight: 500,
              transition: "all 0.2s ease",
            }}
            onClick={handleViewAllNotifications}
          >
            Xem tất cả
          </button>
        </div>
        <div>
          {getRecentNotifications().map((notification) => (
            <div
              key={notification.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px",
                marginBottom: "10px",
                borderRadius: "12px",
                background: theme
                  ? isDarkMode
                    ? "#333333"
                    : "#f8f9fa"
                  : "#f8f9fa",
                border: theme
                  ? `1px solid ${theme.border}`
                  : "1px solid #e9ecef",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    margin: "0 0 5px 0",
                    color: theme ? theme.textPrimary : "#2f5148",
                    fontFamily: "Satoshi, sans-serif",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  {notification.title}
                </h4>
                <p
                  style={{
                    margin: "0 0 5px 0",
                    color: theme ? theme.textSecondary : "#97a19b",
                    fontFamily: "Satoshi, sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  {notification.content}
                </p>
                <span
                  style={{
                    color: theme ? theme.textSecondary : "#97a19b",
                    fontSize: "0.8rem",
                    fontFamily: "Satoshi, sans-serif",
                  }}
                >
                  {notification.date}
                </span>
              </div>
              <button
                style={{
                  background: theme
                    ? isDarkMode
                      ? "#4a5568"
                      : "#85b06d"
                    : "#85b06d",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Đọc
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: theme ? theme.cardBg : "white",
          borderRadius: "20px",
          padding: "25px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
        }}
      >
        <h3
          style={{
            margin: "0 0 20px 0",
            color: theme ? theme.textPrimary : "#2f5148",
            fontFamily: "Satoshi, sans-serif",
            display: "flex",
            alignItems: "center",
          }}
        >
          <BoltIcon
            sx={{
              color: theme ? theme.textSecondary : "#97a19b",
              fontSize: "1.3rem",
              marginRight: "8px",
            }}
          />
          Thao Tác Nhanh
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "15px",
          }}
        >
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "15px 20px",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: "1.1rem",
              fontWeight: 500,
              fontFamily: "Satoshi, sans-serif",
              background: theme
                ? isDarkMode
                  ? "#2d4739"
                  : "#2f5148"
                : "#2f5148",
              color: "white",
            }}
            onClick={handleViewHealthHistory}
          >
            <AssignmentIcon sx={{ color: "#97a19b", fontSize: "1.5rem" }} />
            <div style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontWeight: 600 }}>
                Xem Hồ Sơ Sức Khỏe
              </span>
              <small
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.8rem",
                }}
              >
                Kiểm tra lịch sử khám bệnh và thông tin sức khỏe
              </small>
            </div>
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "15px 20px",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: "1.1rem",
              fontWeight: 500,
              fontFamily: "Satoshi, sans-serif",
              background: theme
                ? isDarkMode
                  ? "#3a3a3a"
                  : "#bfefa1"
                : "#bfefa1",
              color: theme ? (isDarkMode ? "#ffffff" : "#1a3a2e") : "#1a3a2e",
            }}
            onClick={handleConsultation}
          >
            <ChatIcon sx={{ color: "#97a19b", fontSize: "1.5rem" }} />
            <div style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontWeight: 600 }}>
                Đặt Lịch Tư Vấn
              </span>
              <small
                style={{
                  color: theme
                    ? isDarkMode
                      ? "rgba(255, 255, 255, 0.7)"
                      : "#1a3a2e"
                    : "#1a3a2e",
                  fontSize: "0.8rem",
                }}
              >
                Đặt lịch hẹn tư vấn với bác sĩ
              </small>
            </div>
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "15px 20px",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: "1.1rem",
              fontWeight: 500,
              fontFamily: "Satoshi, sans-serif",
              background: theme
                ? isDarkMode
                  ? "#3a3a3a"
                  : "#bfefa1"
                : "#bfefa1",
              color: theme ? (isDarkMode ? "#ffffff" : "#1a3a2e") : "#1a3a2e",
            }}
            onClick={handleChatWithNurse}
          >
            <ForumIcon sx={{ color: "#97a19b", fontSize: "1.5rem" }} />
            <div style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontWeight: 600 }}>
                Chat Với Y Tá
              </span>
              <small
                style={{
                  color: theme
                    ? isDarkMode
                      ? "rgba(255, 255, 255, 0.7)"
                      : "#1a3a2e"
                    : "#1a3a2e",
                  fontSize: "0.8rem",
                }}
              >
                Liên hệ trực tiếp với y tá trường
              </small>
            </div>
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "15px 20px",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: "1.1rem",
              fontWeight: 500,
              fontFamily: "Satoshi, sans-serif",
              background: theme
                ? isDarkMode
                  ? "#3a3a3a"
                  : "#bfefa1"
                : "#bfefa1",
              color: theme ? (isDarkMode ? "#ffffff" : "#1a3a2e") : "#1a3a2e",
            }}
            onClick={handleViewBlogs}
          >
            <ArticleIcon sx={{ color: "#97a19b", fontSize: "1.5rem" }} />
            <div style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontWeight: 600 }}>
                Đọc Blog Sức Khỏe
              </span>
              <small
                style={{
                  color: theme
                    ? isDarkMode
                      ? "rgba(255, 255, 255, 0.7)"
                      : "#1a3a2e"
                    : "#1a3a2e",
                  fontSize: "0.8rem",
                }}
              >
                Xem các bài viết về sức khỏe học đường
              </small>
            </div>
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "15px 20px",
              border: "none",
              borderRadius: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              fontSize: "1.1rem",
              fontWeight: 500,
              fontFamily: "Satoshi, sans-serif",
              background: theme
                ? isDarkMode
                  ? "#2d4739"
                  : "#2f5148"
                : "#2f5148",
              color: "white",
            }}
            onClick={handlePersonalMedicine}
          >
            <LocalPharmacyIcon sx={{ color: "#97a19b", fontSize: "1.5rem" }} />
            <div style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontWeight: 600 }}>
                Thuốc Cá Nhân
              </span>
              <small
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.8rem",
                }}
              >
                Quản lý thông tin thuốc và đơn thuốc
              </small>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;
