import React, { useState, useEffect } from "react";
import { useNurseNotifications } from "../../utils/hooks/useNurse";
import "../../css/Nurse/Notifications.css";

function NurseNotifications() {
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
  } = useNurseNotifications();

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filterTypes = [
    { id: "all", name: "Tất cả", icon: "📋", color: "#56D0DB" },
    { id: "general", name: "Thông báo chung", icon: "📢", color: "#6f42c1" },
    { id: "health", name: "Sức khỏe", icon: "🏥", color: "#28a745" },
    { id: "emergency", name: "Khẩn cấp", icon: "🚨", color: "#dc3545" },
    { id: "reminder", name: "Nhắc nhở", icon: "⏰", color: "#ffc107" },
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
      general: "#f3e5f5",
      health: "#e8f5e8",
      emergency: "#ffebee",
      reminder: "#fff3e0",
    };
    return colors[type] || "#f5f5f5";
  };

  const getTypeIcon = (type) => {
    const icons = {
      general: "📢",
      health: "🏥",
      emergency: "🚨",
      reminder: "⏰",
    };
    return icons[type] || "📋";
  };

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      // No need to call refetch as the hook handles it automatically
    } catch (error) {
      console.error("Error marking notification as read:", error);
      alert("Không thể đánh dấu đã đọc. Vui lòng thử lại.");
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
      alert("Không thể đánh dấu tất cả đã đọc. Vui lòng thử lại.");
    }
  };

  const unreadCount = notifications
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="nurse-notifications-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>🔔 Thông Báo Y Tá</h1>
          <p>Theo dõi các thông báo quan trọng từ quản lý</p>
        </div>
        <div className="header-actions">
          <div className="stats-badges">
            <span className="total-badge">
              📊 {notifications?.length || 0} thông báo
            </span>
            <span className="unread-badge">🔴 {unreadCount} chưa đọc</span>
          </div>
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
            <span className="toggle-text">Chỉ hiển thị chưa đọc</span>
          </label>
          <button onClick={refetch} className="refresh-btn" disabled={loading}>
            {loading ? "⏳" : "🔄"} Làm mới
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>⏳ Đang tải thông báo...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <div className="error-icon">❌</div>
          <h3>Lỗi khi tải thông báo</h3>
          <p>{error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!notifications || notifications.length === 0) && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>Chưa có thông báo nào</h3>
          <p>Bạn sẽ nhận được thông báo từ quản lý tại đây</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Tải lại
          </button>
        </div>
      )}

      {/* Notifications List */}
      {!loading && !error && notifications && notifications.length > 0 && (
        <div className="notifications-content">
          {filteredNotifications.length > 0 ? (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-card ${
                    !notification.isRead ? "unread" : "read"
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
                        {getTypeIcon(notification.type)}{" "}
                        {
                          filterTypes.find((f) => f.id === notification.type)
                            ?.name
                        }
                      </span>
                      {notification.priority && (
                        <span
                          className="notification-priority"
                          style={{
                            color: getPriorityColor(notification.priority),
                            backgroundColor: `${getPriorityColor(
                              notification.priority
                            )}20`,
                          }}
                        >
                          {getPriorityText(notification.priority)}
                        </span>
                      )}
                    </div>
                    <div className="notification-actions">
                      <span className="notification-date">
                        {formatDate(
                          notification.createdAt || notification.date
                        )}
                      </span>
                      {!notification.isRead && (
                        <button
                          className="mark-read-btn"
                          onClick={() => markAsRead(notification.id)}
                          title="Đánh dấu đã đọc"
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="notification-body">
                    <h3 className="notification-title">{notification.title}</h3>
                    <p className="notification-message">
                      {notification.message || notification.content}
                    </p>
                  </div>

                  {notification.createdby && (
                    <div className="notification-footer">
                      <span className="notification-sender">
                        👤 Từ: {notification.createdby}
                      </span>
                    </div>
                  )}

                  {!notification.isRead && (
                    <div className="unread-indicator">
                      <span className="unread-dot"></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>Không tìm thấy thông báo</h3>
              <p>
                Không có thông báo nào phù hợp với bộ lọc "
                {filterTypes.find((f) => f.id === selectedFilter)?.name}"
                {showUnreadOnly && " chưa đọc"}.
              </p>
              <button
                onClick={() => {
                  setSelectedFilter("all");
                  setShowUnreadOnly(false);
                }}
                className="clear-filters-btn"
              >
                🔄 Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NurseNotifications;
