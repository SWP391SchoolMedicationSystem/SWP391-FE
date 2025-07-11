import React, { useState, useEffect } from "react";
import { useParentNotifications } from "../../utils/hooks/useParent";
import "../../css/Parent/Notifications.css";

const ParentNotifications = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    data: notifications,
    loading,
    error,
    refetch,
    fetchNotifications,
  } = useParentNotifications();

  // Gọi API khi component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Hàm xử lý dữ liệu từ API để hiển thị
  const processNotificationData = (apiData) => {
    if (!apiData) {
      return [];
    }
    
    if (!Array.isArray(apiData)) {
      return [];
    }
    
    if (apiData.length === 0) {
      return [];
    }
    
    const processed = apiData.map(notification => {
      if (!notification.notificationId) {
        return null;
      }
      
      // Lấy thông tin chi tiết cho parent hiện tại (giả sử parentId = 1 cho Parent)
      const currentParentDetail = notification.notificationParentDetails?.find(
        detail => detail.parentId === 1
      ) || notification.notificationParentDetails?.[0];

      return {
        id: notification.notificationId,
        title: notification.title || "Không có tiêu đề",
        message: currentParentDetail?.message || "Không có nội dung",
        type: notification.type || "Chung",
        targetType: "parent",
        createdAt: notification.createdAt || new Date().toISOString(),
        createdBy: notification.createdby || "Hệ thống",
        notificationParentDetails: notification.notificationParentDetails || [],
      };
    }).filter(Boolean);
    
    return processed;
  };

  const processedNotifications = processNotificationData(notifications);

  // Thống kê
  const stats = {
    total: processedNotifications.length,
    urgent: processedNotifications.filter(n => n.type === "Khẩn cấp").length,
  };

  const getTypeBadge = (type) => {
    const typeMap = {
      "Sức khỏe": { label: "Sức khỏe", class: "type-sức-khỏe" },
      "Khẩn cấp": { label: "Khẩn cấp", class: "type-khẩn-cấp" },
      "Nhắc nhở": { label: "Nhắc nhở", class: "type-nhắc-nhở" },
      "Sự kiện": { label: "Sự kiện", class: "type-sự-kiện" },
      "Chung": { label: "Chung", class: "type-chung" },
      "general": { label: "Chung", class: "type-general" },
      "health": { label: "Sức khỏe", class: "type-health" },
      "emergency": { label: "Khẩn cấp", class: "type-emergency" },
      "reminder": { label: "Nhắc nhở", class: "type-reminder" },
      "event": { label: "Sự kiện", class: "type-event" },
    };

    const typeInfo = typeMap[type] || typeMap["Chung"];
    return (
      <span className={`type-badge ${typeInfo.class}`}>{typeInfo.label}</span>
    );
  };

  const handleViewDetail = (notification) => {
    setSelectedNotification(notification);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedNotification(null);
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>⏳ Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-container">
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="page-header">
        <div className="header-content">
          <h1>📢 Thông Báo</h1>
          <p>Xem thông báo từ nhà trường</p>
        </div>
        <button onClick={refetch} className="refresh-btn">
          🔄 Làm mới
        </button>
      </div>

      {/* Thống kê */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-title">Tổng Thông Báo</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚨</div>
          <div className="stat-content">
            <div className="stat-value">{stats.urgent}</div>
            <div className="stat-title">Khẩn Cấp</div>
          </div>
        </div>
      </div>

      {/* Danh sách thông báo */}
      <div className="notifications-section">
        <div className="section-header">
          <h2>Thông Báo Gần Đây</h2>
        </div>

        {processedNotifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Chưa có thông báo nào</h3>
            <p>Chưa có thông báo nào được gửi</p>
          </div>
        ) : (
          <div className="notifications-table-container">
            <table className="notifications-table">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Loại</th>
                  <th>Nội dung</th>
                  <th>Ngày tạo</th>
                  <th>Người tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {processedNotifications.map((notification, index) => (
                  <tr
                    key={notification.id || index}
                    className="notification-row"
                  >
                    <td className="title-cell">
                      <div className="title-content">{notification.title}</div>
                    </td>
                    <td className="type-cell">
                      {getTypeBadge(notification.type)}
                    </td>
                    <td className="message-cell">
                      <div className="message-content">
                        {notification.message.length > 100 
                          ? `${notification.message.substring(0, 100)}...` 
                          : notification.message}
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(notification.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td className="creator-cell">
                      {notification.createdBy || "Hệ thống"}
                    </td>
                    <td className="action-cell">
                      <button
                        onClick={() => handleViewDetail(notification)}
                        className="view-detail-btn"
                        title="Xem chi tiết"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal xem chi tiết */}
      {showDetailModal && selectedNotification && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📋 Chi Tiết Thông Báo</h3>
              <button onClick={handleCloseModal} className="close-btn">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Thông tin chung</h4>
                <div className="detail-row">
                  <strong>Tiêu đề:</strong> {selectedNotification.title}
                </div>
                <div className="detail-row">
                  <strong>Loại:</strong> {getTypeBadge(selectedNotification.type)}
                </div>
                <div className="detail-row">
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(selectedNotification.createdAt).toLocaleString("vi-VN")}
                </div>
                <div className="detail-row">
                  <strong>Người tạo:</strong> {selectedNotification.createdBy}
                </div>
              </div>
              
              <div className="detail-section">
                <h4>Nội dung chi tiết</h4>
                <div className="message-detail">
                  {selectedNotification.message}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal} className="close-modal-btn">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentNotifications;
