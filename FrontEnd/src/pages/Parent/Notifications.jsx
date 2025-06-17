import React, { useState } from "react";
import "../../css/Parent/Notifications.css";

function Notifications() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Mock data cho thông báo
  const notifications = [
    {
      id: 1,
      title: "Lịch tiêm vaccine sởi - rubella cho học sinh lớp 5",
      content:
        "Thông báo về lịch tiêm vaccine sởi - rubella dành cho các em học sinh lớp 5. Thời gian: 8h00 ngày 20/03/2024. Địa điểm: Phòng y tế trường. Phụ huynh lưu ý cho con em ăn sáng đầy đủ trước khi đến trường.",
      type: "vaccination",
      priority: "high",
      date: "2024-03-15",
      time: "08:30",
      isRead: false,
      sender: "Y tế trường",
    },
    {
      id: 2,
      title: "Kết quả khám sức khỏe định kỳ",
      content:
        "Kết quả khám sức khỏe định kỳ của con em đã được cập nhật. Tình trạng sức khỏe: Bình thường. Chiều cao: 135cm, Cân nặng: 32kg. Phụ huynh có thể xem chi tiết tại mục Lịch sử khám sức khỏe.",
      type: "health",
      priority: "medium",
      date: "2024-03-12",
      time: "14:20",
      isRead: true,
      sender: "BS. Nguyễn Thị Lan",
    },
    {
      id: 3,
      title: "Sự kiện: Ngày hội sức khỏe học đường 2024",
      content:
        "Trường tổ chức Ngày hội sức khỏe học đường 2024. Thời gian: 8h00-16h00 ngày 25/03/2024. Các hoạt động: Tập thể dục, kiểm tra sức khỏe miễn phí, tư vấn dinh dưỡng. Mời phụ huynh và học sinh tham gia.",
      type: "event",
      priority: "medium",
      date: "2024-03-10",
      time: "09:00",
      isRead: true,
      sender: "Ban tổ chức",
    },
    {
      id: 4,
      title: "Cảnh báo dịch tay chân miệng",
      content:
        "Hiện tại trong khu vực đang có dịch tay chân miệng. Phụ huynh lưu ý quan sát con em, nếu có biểu hiện sốt, ban đỏ ở tay chân miệng thì cho nghỉ học và đưa đến cơ sở y tế khám.",
      type: "health",
      priority: "high",
      date: "2024-03-08",
      time: "07:45",
      isRead: false,
      sender: "Y tế trường",
    },
    {
      id: 5,
      title: "Thông báo nghỉ học do thời tiết",
      content:
        "Do ảnh hưởng của bão số 3, trường thông báo học sinh nghỉ học ngày 5/03/2024. Phụ huynh lưu ý giữ an toàn cho con em trong thời gian nghỉ học.",
      type: "general",
      priority: "high",
      date: "2024-03-04",
      time: "20:30",
      isRead: true,
      sender: "Ban giám hiệu",
    },
  ];

  const filterTypes = [
    { id: "all", name: "Tất cả", icon: "📋", color: "#56D0DB" },
    { id: "vaccination", name: "Tiêm chủng", icon: "💉", color: "#2D77C1" },
    { id: "health", name: "Sức khỏe", icon: "🏥", color: "#28a745" },
    { id: "event", name: "Sự kiện", icon: "🎉", color: "#ffc107" },
    { id: "general", name: "Thông báo chung", icon: "📢", color: "#6f42c1" },
  ];

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      selectedFilter === "all" || notification.type === selectedFilter;
    const matchesReadStatus = !showUnreadOnly || !notification.isRead;
    return matchesFilter && matchesReadStatus;
  });

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

  const markAsRead = (id) => {
    // Logic để đánh dấu đã đọc
    console.log("Marking notification as read:", id);
  };

  const markAllAsRead = () => {
    // Logic để đánh dấu tất cả đã đọc
    console.log("Marking all notifications as read");
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
          <button className="mark-all-read-btn" onClick={markAllAsRead}>
            ✅ Đánh dấu tất cả đã đọc
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

        <div className="filter-options">
          <label className="unread-filter">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
            />
            Chỉ hiện thông báo chưa đọc
          </label>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-list">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-card ${
              !notification.isRead ? "unread" : ""
            }`}
            style={{ backgroundColor: getTypeColor(notification.type) }}
          >
            <div className="notification-header">
              <div className="notification-meta">
                <span className="notification-sender">
                  👤 {notification.sender}
                </span>
                <span className="notification-datetime">
                  📅 {notification.date} • ⏰ {notification.time}
                </span>
                <span
                  className="notification-priority"
                  style={{
                    backgroundColor: getPriorityColor(notification.priority),
                    color: "white",
                  }}
                >
                  {getPriorityText(notification.priority)}
                </span>
              </div>
              {!notification.isRead && (
                <div className="unread-indicator">●</div>
              )}
            </div>

            <div className="notification-body">
              <h3 className="notification-title">{notification.title}</h3>
              <p className="notification-content">{notification.content}</p>
            </div>

            <div className="notification-actions">
              {!notification.isRead && (
                <button
                  className="mark-read-btn"
                  onClick={() => markAsRead(notification.id)}
                >
                  ✅ Đánh dấu đã đọc
                </button>
              )}
              <button className="reply-btn">💬 Phản hồi</button>
              <button className="save-btn">💾 Lưu</button>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="no-notifications">
          <div className="no-notifications-icon">📭</div>
          <p>Không có thông báo nào phù hợp với bộ lọc đã chọn</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="notification-stats">
        <div className="stat-item">
          <span className="stat-number">{notifications.length}</span>
          <span className="stat-label">Tổng thông báo</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{unreadCount}</span>
          <span className="stat-label">Chưa đọc</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {notifications.filter((n) => n.priority === "high").length}
          </span>
          <span className="stat-label">Ưu tiên cao</span>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
