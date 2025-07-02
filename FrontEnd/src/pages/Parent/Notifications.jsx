import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useParentNotifications } from "../../utils/hooks/useParent";

// Material-UI Icons
import NotificationsIcon from "@mui/icons-material/Notifications";
import ScheduleIcon from "@mui/icons-material/Schedule";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EventIcon from "@mui/icons-material/Event";
import CampaignIcon from "@mui/icons-material/Campaign";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ErrorIcon from "@mui/icons-material/Error";
import InboxIcon from "@mui/icons-material/Inbox";
import FilterListIcon from "@mui/icons-material/FilterList";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

function Notifications() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Get theme from parent layout
  const context = useOutletContext();
  const { theme, isDarkMode } = context || { theme: null, isDarkMode: false };

  // Use API hooks
  const {
    data: notifications,
    loading,
    error,
    refetch,
    fetchNotifications,
    markAsRead: markNotificationAsRead,
  } = useParentNotifications();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filterTypes = [
    {
      id: "all",
      name: "Tất cả",
      icon: <FilterListIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
      color: "#15803d",
    },
    {
      id: "vaccination",
      name: "Tiêm chủng",
      icon: <VaccinesIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
      color: "#15803d",
    },
    {
      id: "health",
      name: "Sức khỏe",
      icon: <LocalHospitalIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
      color: "#15803d",
    },
    {
      id: "event",
      name: "Sự kiện",
      icon: <EventIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
      color: "#15803d",
    },
    {
      id: "general",
      name: "Thông báo chung",
      icon: <CampaignIcon sx={{ color: "#97a19b", fontSize: "1.2rem" }} />,
      color: "#15803d",
    },
  ];

  const filteredNotifications = notifications
    ? notifications.filter((notification) => {
        const matchesFilter =
          selectedFilter === "all" || notification.type === selectedFilter;
        const matchesReadStatus = !showUnreadOnly || !notification.isRead;
        return matchesFilter && matchesReadStatus;
      })
    : [];

  const getPriorityColor = (priority) => {
    const colors = {
      high: "#dc3545",
      medium: "#ffc107",
      low: "#28a745",
    };
    return colors[priority] || "#6c757d";
  };

  const getPriorityText = (priority) => {
    const texts = {
      high: "Ưu tiên cao",
      medium: "Ưu tiên trung bình",
      low: "Ưu tiên thấp",
    };
    return texts[priority] || priority;
  };

  const getTypeColor = (type) => {
    const colors = {
      vaccination: "#e3f2fd",
      health: "#e8f5e8",
      event: "#fff3e0",
      general: "#f3e5f5",
    };
    return colors[type] || "#f5f5f5";
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      // No need to call refetch as the hook handles it automatically
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!notifications) return;

    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter((n) => !n.isRead);
      await Promise.all(
        unreadNotifications.map((notification) =>
          markNotificationAsRead(notification.id)
        )
      );
      // No need to call refetch as the hook handles it automatically
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const unreadCount = notifications
    ? notifications.filter((n) => !n.isRead).length
    : 0;

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
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <NotificationsIcon sx={{ color: "white", fontSize: "2.5rem" }} />
            Thông Báo
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
            Theo dõi các thông báo quan trọng từ nhà trường
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "15px",
          }}
        >
          <span
            style={{
              background: theme
                ? isDarkMode
                  ? "#c3555c"
                  : "#c3555c"
                : "#c3555c",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "0.9rem",
              fontWeight: 600,
              fontFamily: "Satoshi, sans-serif",
              boxShadow: "0 4px 15px rgba(195, 85, 92, 0.3)",
            }}
          >
            {unreadCount} thông báo chưa đọc
          </span>
          <button
            onClick={markAllAsRead}
            disabled={loading || !notifications || unreadCount === 0}
            style={{
              background: theme
                ? isDarkMode
                  ? "#85b06d"
                  : "#85b06d"
                : "#85b06d",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: 600,
              fontFamily: "Satoshi, sans-serif",
              cursor: unreadCount === 0 ? "not-allowed" : "pointer",
              opacity: unreadCount === 0 ? 0.6 : 1,
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(133, 176, 109, 0.3)",
            }}
          >
            {loading ? (
              <>
                <ScheduleIcon sx={{ fontSize: "1.2rem" }} />
                Đang xử lý...
              </>
            ) : (
              <>
                <DoneAllIcon sx={{ fontSize: "1.2rem" }} />
                Đánh dấu tất cả đã đọc
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          background: theme ? theme.cardBg : "white",
          borderRadius: "20px",
          padding: "25px",
          marginBottom: "30px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          {filterTypes.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 18px",
                border: `2px solid ${
                  selectedFilter === filter.id
                    ? filter.color
                    : theme
                    ? theme.border
                    : "#c1cbc2"
                }`,
                borderRadius: "15px",
                background:
                  selectedFilter === filter.id ? filter.color : "transparent",
                color:
                  selectedFilter === filter.id
                    ? "white"
                    : theme
                    ? theme.textPrimary
                    : "#2f5148",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: 500,
                fontFamily: "Satoshi, sans-serif",
                transition: "all 0.3s ease",
              }}
            >
              <span>{filter.icon}</span>
              <span>{filter.name}</span>
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              fontFamily: "Satoshi, sans-serif",
              color: theme ? theme.textSecondary : "#97a19b",
            }}
          >
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
            <span>Chỉ hiển thị chưa đọc</span>
          </label>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            background: theme ? theme.cardBg : "white",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
          }}
        >
          <HourglassEmptyIcon
            sx={{ color: "#97a19b", fontSize: "3rem", marginBottom: "15px" }}
          />
          <p
            style={{
              margin: 0,
              color: theme ? theme.textSecondary : "#97a19b",
              fontFamily: "Satoshi, sans-serif",
              fontSize: "1.1rem",
            }}
          >
            Đang tải thông báo...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          style={{
            background: theme ? theme.cardBg : "white",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
          }}
        >
          <ErrorIcon
            sx={{ color: "#c3555c", fontSize: "3rem", marginBottom: "15px" }}
          />
          <p
            style={{
              margin: "0 0 20px 0",
              color: theme ? theme.textPrimary : "#2f5148",
              fontFamily: "Satoshi, sans-serif",
              fontSize: "1.1rem",
            }}
          >
            Lỗi khi tải thông báo: {error}
          </p>
          <button
            onClick={refetch}
            style={{
              background: theme
                ? isDarkMode
                  ? "#2d4739"
                  : "#2f5148"
                : "#2f5148",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 500,
              fontFamily: "Satoshi, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 auto",
              transition: "all 0.3s ease",
            }}
          >
            <RefreshIcon sx={{ fontSize: "1.2rem" }} />
            Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!notifications || notifications.length === 0) && (
        <div
          style={{
            background: theme ? theme.cardBg : "white",
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            border: theme ? `1px solid ${theme.border}` : "1px solid #c1cbc2",
          }}
        >
          <InboxIcon
            sx={{ color: "#97a19b", fontSize: "3rem", marginBottom: "15px" }}
          />
          <p
            style={{
              margin: "0 0 20px 0",
              color: theme ? theme.textSecondary : "#97a19b",
              fontFamily: "Satoshi, sans-serif",
              fontSize: "1.1rem",
            }}
          >
            Chưa có thông báo nào
          </p>
          <button
            onClick={refetch}
            style={{
              background: theme
                ? isDarkMode
                  ? "#3a3a3a"
                  : "#bfefa1"
                : "#bfefa1",
              color: theme ? (isDarkMode ? "#ffffff" : "#1a3a2e") : "#1a3a2e",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 500,
              fontFamily: "Satoshi, sans-serif",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "0 auto",
              transition: "all 0.3s ease",
            }}
          >
            <RefreshIcon sx={{ fontSize: "1.2rem" }} />
            Tải lại
          </button>
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && notifications && notifications.length > 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  background: theme ? theme.cardBg : "white",
                  borderRadius: "18px",
                  padding: "25px",
                  boxShadow: !notification.isRead
                    ? "0 6px 25px rgba(21, 128, 61, 0.15)"
                    : "0 4px 20px rgba(0, 0, 0, 0.1)",
                  border: !notification.isRead
                    ? `2px solid #15803d`
                    : theme
                    ? `1px solid ${theme.border}`
                    : "1px solid #c1cbc2",
                  transition: "all 0.3s ease",
                  position: "relative",
                }}
              >
                {!notification.isRead && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-2px",
                      width: "12px",
                      height: "12px",
                      background: "#c3555c",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                    gap: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        background: theme
                          ? isDarkMode
                            ? "#4a5568"
                            : "#bfefa1"
                          : "#bfefa1",
                        color: theme
                          ? isDarkMode
                            ? "#ffffff"
                            : "#1a3a2e"
                          : "#1a3a2e",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        fontFamily: "Satoshi, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        width: "fit-content",
                      }}
                    >
                      {
                        filterTypes.find((f) => f.id === notification.type)
                          ?.icon
                      }
                      {
                        filterTypes.find((f) => f.id === notification.type)
                          ?.name
                      }
                    </span>
                    <span
                      style={{
                        color: getPriorityColor(notification.priority),
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        fontFamily: "Satoshi, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <FiberManualRecordIcon sx={{ fontSize: "0.6rem" }} />
                      {getPriorityText(notification.priority)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "5px",
                    }}
                  >
                    <span
                      style={{
                        color: theme ? theme.textSecondary : "#97a19b",
                        fontSize: "0.8rem",
                        fontFamily: "Satoshi, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <CalendarTodayIcon
                        sx={{ color: "#97a19b", fontSize: "0.8rem" }}
                      />
                      {notification.date}
                    </span>
                    <span
                      style={{
                        color: theme ? theme.textSecondary : "#97a19b",
                        fontSize: "0.8rem",
                        fontFamily: "Satoshi, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <AccessTimeIcon
                        sx={{ color: "#97a19b", fontSize: "0.8rem" }}
                      />
                      {notification.time}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <h3
                    style={{
                      margin: "0 0 12px 0",
                      color: theme ? theme.textPrimary : "#2f5148",
                      fontFamily: "Satoshi, sans-serif",
                      fontSize: "1.3rem",
                      fontWeight: 600,
                      lineHeight: 1.4,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {!notification.isRead && (
                      <FiberManualRecordIcon
                        sx={{ color: "#c3555c", fontSize: "0.8rem" }}
                      />
                    )}
                    {notification.title}
                  </h3>
                  <p
                    style={{
                      margin: "0 0 15px 0",
                      color: theme ? theme.textSecondary : "#97a19b",
                      fontFamily: "Satoshi, sans-serif",
                      fontSize: "1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {notification.content}
                  </p>
                  <div
                    style={{
                      color: theme ? theme.textSecondary : "#97a19b",
                      fontSize: "0.9rem",
                      fontFamily: "Satoshi, sans-serif",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <PersonIcon sx={{ color: "#97a19b", fontSize: "1rem" }} />
                    Từ: {notification.sender}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      disabled={loading}
                      style={{
                        background: theme
                          ? isDarkMode
                            ? "#85b06d"
                            : "#85b06d"
                          : "#85b06d",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "10px",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        fontFamily: "Satoshi, sans-serif",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        opacity: loading ? 0.6 : 1,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {loading ? (
                        <ScheduleIcon sx={{ fontSize: "1rem" }} />
                      ) : (
                        <CheckCircleIcon sx={{ fontSize: "1rem" }} />
                      )}
                      Đánh dấu đã đọc
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                background: theme ? theme.cardBg : "white",
                borderRadius: "20px",
                padding: "40px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: theme
                  ? `1px solid ${theme.border}`
                  : "1px solid #c1cbc2",
              }}
            >
              <FilterListIcon
                sx={{
                  color: "#97a19b",
                  fontSize: "3rem",
                  marginBottom: "15px",
                }}
              />
              <p
                style={{
                  margin: "0 0 20px 0",
                  color: theme ? theme.textSecondary : "#97a19b",
                  fontFamily: "Satoshi, sans-serif",
                  fontSize: "1.1rem",
                }}
              >
                Không có thông báo nào phù hợp với bộ lọc
              </p>
              <button
                onClick={() => {
                  setSelectedFilter("all");
                  setShowUnreadOnly(false);
                }}
                style={{
                  background: theme
                    ? isDarkMode
                      ? "#3a3a3a"
                      : "#bfefa1"
                    : "#bfefa1",
                  color: theme
                    ? isDarkMode
                      ? "#ffffff"
                      : "#1a3a2e"
                    : "#1a3a2e",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: 500,
                  fontFamily: "Satoshi, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  margin: "0 auto",
                  transition: "all 0.3s ease",
                }}
              >
                <RefreshIcon sx={{ fontSize: "1.2rem" }} />
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
