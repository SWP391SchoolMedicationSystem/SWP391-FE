import React, { useState, useEffect } from 'react';
import { useNurseNotifications } from '../../utils/hooks/useNurse';
import '../../css/Nurse/Notifications.css';

const Notifications = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const {
    data: notifications,
    loading,
    error,
    refetch,
    fetchNotifications,
  } = useNurseNotifications();

  // Gọi API khi component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mock data for fallback - cập nhật theo cấu trúc API thực tế
  const [mockNotifications] = useState([
    {
      notificationId: 1,
      title: 'Lịch khám sức khỏe định kỳ năm học 2025-2026',
      createdAt: '2025-07-09T12:12:02.687',
      type: 'Sức khỏe',
      isDeleted: false,
      createdby: 'Admin',
      notificationParentDetails: [],
      notificationstaffdetails: [
        {
          notificationId: 1,
          staffid: 3,
          message:
            'Đ/c Y Tá chuẩn bị công tác tổ chức khám sức khỏe định kỳ cho học sinh theo kế hoạch.',
          isRead: true,
          isDeleted: false,
          createdDate: '2025-07-09T12:15:38.99',
          modifiedDate: '2025-07-09T12:15:38.99',
        },
        {
          notificationId: 1,
          staffid: 4,
          message:
            'Đ/c Y Sĩ phối hợp chuẩn bị công tác tổ chức khám sức khỏe định kỳ.',
          isRead: true,
          isDeleted: false,
          createdDate: '2025-07-09T12:15:38.99',
          modifiedDate: '2025-07-09T12:15:38.99',
        },
        {
          notificationId: 1,
          staffid: 5,
          message:
            'Giáo viên chủ nhiệm thông báo lịch khám sức khỏe cho học sinh và phụ huynh lớp mình.',
          isRead: false,
          isDeleted: false,
          createdDate: '2025-07-09T12:15:38.99',
          modifiedDate: '2025-07-09T12:15:38.99',
        },
      ],
    },
    {
      notificationId: 2,
      title: 'Thông báo về dịch bệnh cúm A/H1N1',
      createdAt: '2025-07-10T10:30:00.000',
      type: 'Khẩn cấp',
      isDeleted: false,
      createdby: 'Manager',
      notificationParentDetails: [],
      notificationstaffdetails: [
        {
          notificationId: 2,
          staffid: 3,
          message:
            'Y Tá cần tăng cường giám sát sức khỏe học sinh, phát hiện sớm các triệu chứng cúm.',
          isRead: false,
          isDeleted: false,
          createdDate: '2025-07-10T10:35:00.000',
          modifiedDate: '2025-07-10T10:35:00.000',
        },
        {
          notificationId: 2,
          staffid: 4,
          message:
            'Y Sĩ chuẩn bị thuốc và thiết bị y tế để xử lý các trường hợp khẩn cấp.',
          isRead: false,
          isDeleted: false,
          createdDate: '2025-07-10T10:35:00.000',
          modifiedDate: '2025-07-10T10:35:00.000',
        },
      ],
    },
    {
      notificationId: 3,
      title: 'Nhắc nhở uống thuốc cho học sinh',
      createdAt: '2025-07-11T08:37:01.283',
      type: 'Nhắc nhở',
      isDeleted: false,
      createdby: 'Nurse',
      notificationParentDetails: [],
      notificationstaffdetails: [
        {
          notificationId: 3,
          staffid: 3,
          message:
            'Nhắc nhở: Học sinh Nguyễn Văn An cần uống thuốc vào 9h sáng và 3h chiều.',
          isRead: false,
          isDeleted: false,
          createdDate: '2025-07-11T08:37:01.467',
          modifiedDate: '2025-07-11T08:37:01.613',
        },
        {
          notificationId: 3,
          staffid: 4,
          message:
            'Nhắc nhở: Học sinh Trần Thị Bình cần uống thuốc vào 8h sáng và 2h chiều.',
          isRead: false,
          isDeleted: false,
          createdDate: '2025-07-11T08:37:01.477',
          modifiedDate: '2025-07-11T08:37:01.613',
        },
      ],
    },
  ]);

  const notificationData = notifications || mockNotifications;

  // Hàm xử lý dữ liệu từ API để hiển thị
  const processNotificationData = apiData => {
    if (!apiData) {
      return [];
    }

    if (!Array.isArray(apiData)) {
      return [];
    }

    if (apiData.length === 0) {
      return [];
    }

    const processed = apiData
      .map(notification => {
        // Kiểm tra cấu trúc notification
        if (!notification.notificationId) {
          return null;
        }

        // Lấy thông tin chi tiết cho staff hiện tại (giả sử staffid = 3 cho Nurse)
        const currentStaffDetail =
          notification.notificationstaffdetails?.find(
            detail => detail.staffid === 3
          ) || notification.notificationstaffdetails?.[0];

        return {
          id: notification.notificationId,
          title: notification.title || 'Không có tiêu đề',
          message: currentStaffDetail?.message || 'Không có nội dung',
          type: notification.type || 'Chung',
          targetType: 'staff',
          createdAt: notification.createdAt || new Date().toISOString(),
          createdBy: notification.createdby || 'Hệ thống',
          staffDetails: notification.notificationstaffdetails || [],
        };
      })
      .filter(Boolean); // Loại bỏ các item null

    return processed;
  };

  const processedNotifications = processNotificationData(notificationData);

  // Sử dụng mock data nếu không có dữ liệu từ API
  const displayNotifications =
    processedNotifications.length > 0
      ? processedNotifications
      : processNotificationData(mockNotifications);

  // Thống kê
  const stats = {
    total: displayNotifications.length,
    urgent: displayNotifications.filter(n => n.type === 'Khẩn cấp').length,
  };

  const getTypeBadge = type => {
    const typeMap = {
      'Sức khỏe': { label: 'Sức khỏe', class: 'type-sức-khỏe' },
      'Khẩn cấp': { label: 'Khẩn cấp', class: 'type-khẩn-cấp' },
      'Nhắc nhở': { label: 'Nhắc nhở', class: 'type-nhắc-nhở' },
      'Sự kiện': { label: 'Sự kiện', class: 'type-sự-kiện' },
      Chung: { label: 'Chung', class: 'type-chung' },
      general: { label: 'Chung', class: 'type-general' },
      health: { label: 'Sức khỏe', class: 'type-health' },
      emergency: { label: 'Khẩn cấp', class: 'type-emergency' },
      reminder: { label: 'Nhắc nhở', class: 'type-reminder' },
      event: { label: 'Sự kiện', class: 'type-event' },
    };

    const typeInfo = typeMap[type] || typeMap['Chung'];
    return (
      <span className={`type-badge ${typeInfo.class}`}>{typeInfo.label}</span>
    );
  };

  const handleViewDetail = notification => {
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
          <h1>📢 Quản Lý Thông Báo</h1>
          <p>Xem và quản lý thông báo từ nhà trường</p>
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

        {displayNotifications.length === 0 ? (
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
                  <th>Đối tượng</th>
                  <th>Ngày tạo</th>
                  <th>Người tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {displayNotifications.map((notification, index) => (
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
                    <td className="target-cell">
                      <span
                        className={`target-badge target-${
                          notification.targetType || 'unknown'
                        }`}
                      >
                        {notification.targetType === 'parent'
                          ? '👨‍👩‍👧‍👦 Phụ Huynh'
                          : '👩‍💼 Nhân Viên'}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(notification.createdAt).toLocaleDateString(
                        'vi-VN'
                      )}
                    </td>
                    <td className="creator-cell">
                      {notification.createdBy || 'Hệ thống'}
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
          <div className="modal-content" onClick={e => e.stopPropagation()}>
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
                  <strong>Loại:</strong>{' '}
                  {getTypeBadge(selectedNotification.type)}
                </div>
                <div className="detail-row">
                  <strong>Ngày tạo:</strong>{' '}
                  {new Date(selectedNotification.createdAt).toLocaleString(
                    'vi-VN'
                  )}
                </div>
                <div className="detail-row">
                  <strong>Người tạo:</strong> {selectedNotification.createdBy}
                </div>
                <div className="detail-row">
                  <strong>Đối tượng:</strong>{' '}
                  {selectedNotification.targetType === 'parent'
                    ? 'Phụ Huynh'
                    : 'Nhân Viên'}
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

export default Notifications;
