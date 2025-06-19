import React, { useState, useEffect } from "react";
import "../../css/Parent/Notifications.css";
import { useParentNotifications } from "../../utils/hooks/useParent";

function Notifications() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

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
    { id: "all", name: "Tất cả", icon: "📋", color: "#56D0DB" },
    { id: "vaccination", name: "Tiêm chủng", icon: "💉", color: "#2D77C1" },
    { id: "health", name: "Sức khỏe", icon: "🏥", color: "#28a745" },
    { id: "event", name: "Sự kiện", icon: "🎉", color: "#ffc107" },
    { id: "general", name: "Thông báo chung", icon: "📢", color: "#6f42c1" },
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
    <div className="notifications-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>🔔 Thông Báo</h1>
          <p>Theo dõi các thông báo quan trọng từ nhà trường</p>
        </div>
        <div className="header-actions">
          <span className="unread-count">{unreadCount} thông báo chưa đọc</span>
          <button
            className="mark-all-read-btn"
            onClick={markAllAsRead}
            disabled={loading || !notifications || unreadCount === 0}
          >
            {loading ? "⏳ Đang xử lý..." : "✅ Đánh dấu tất cả đã đọc"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-buttons">
          {filterTypes.map((filter) => (
            <button
              key={filter.id}
              className={`filter-btn ${
                selectedFilter === filter.id ? "active" : ""
              }`}
              onClick={() => setSelectedFilter(filter.id)}
              style={{
                borderColor: filter.color,
                backgroundColor:
                  selectedFilter === filter.id ? filter.color : "transparent",
                color: selectedFilter === filter.id ? "white" : filter.color,
              }}
            >
              <span className="filter-icon">{filter.icon}</span>
              <span>{filter.name}</span>
            </button>
          ))}
        </div>

        <div className="toggle-controls">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
            />
            <span>Chỉ hiển thị chưa đọc</span>
          </label>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>⏳ Đang tải thông báo...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>❌ Lỗi khi tải thông báo: {error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!notifications || notifications.length === 0) && (
        <div className="empty-state">
          <p>📭 Chưa có thông báo nào</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Tải lại
          </button>
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && notifications && notifications.length > 0 && (
        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${
                  !notification.isRead ? "unread" : ""
                }`}
              >
                <div className="notification-header">
                  <div className="notification-meta">
                    <span
                      className="notification-type"
                      style={{
                        backgroundColor: getTypeColor(notification.type),
                      }}
                    >
                      {
                        filterTypes.find((f) => f.id === notification.type)
                          ?.icon
                      }{" "}
                      {
                        filterTypes.find((f) => f.id === notification.type)
                          ?.name
                      }
                    </span>
                    <span
                      className="notification-priority"
                      style={{
                        color: getPriorityColor(notification.priority),
                      }}
                    >
                      🚩 {getPriorityText(notification.priority)}
                    </span>
                  </div>
                  <div className="notification-date">
                    <span>📅 {notification.date}</span>
                    <span>🕒 {notification.time}</span>
                  </div>
                </div>

                <div className="notification-content">
                  <h3 className="notification-title">
                    {!notification.isRead && (
                      <span className="unread-dot">🔴</span>
                    )}
                    {notification.title}
                  </h3>
                  <p className="notification-text">{notification.content}</p>
                  <div className="notification-sender">
                    <span>👤 Từ: {notification.sender}</span>
                  </div>
                </div>

                <div className="notification-actions">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="mark-read-btn"
                      disabled={loading}
                    >
                      {loading ? "⏳" : "✅"} Đánh dấu đã đọc
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>📭 Không có thông báo nào phù hợp với bộ lọc</p>
              <button
                onClick={() => {
                  setSelectedFilter("all");
                  setShowUnreadOnly(false);
                }}
                className="retry-btn"
              >
                🔄 Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notifications;
