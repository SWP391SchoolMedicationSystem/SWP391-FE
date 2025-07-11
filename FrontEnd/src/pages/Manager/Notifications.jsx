import React, { useState, useEffect } from 'react';
import { useManagerNotifications } from '../../utils/hooks/useManager';
import { managerNotificationService } from '../../services/managerService';
import '../../css/Manager/Notifications.css';

const Notifications = () => {
  const [notificationType, setNotificationType] = useState('staff'); // "staff" hoặc "parent"
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general',
  });

  const {
    data: notifications,
    loading,
    error,
    refetch,
    fetchNotifications,
  } = useManagerNotifications(notificationType);

  // Gọi API khi component mount hoặc khi thay đổi loại thông báo
  useEffect(() => {
    fetchNotifications(notificationType);
  }, [fetchNotifications, notificationType]);

  // Handle form input change
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create notification
  const handleCreateNotification = () => {
    setFormData({
      title: '',
      message: '',
      type: 'general',
    });
    setNotificationType('parent');
    setShowCreateModal(true);
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
      };

      if (notificationType === 'parent') {
        await managerNotificationService.createNotificationForParents(
          notificationData
        );
      } else {
        await managerNotificationService.createNotificationForStaff(
          notificationData
        );
      }

      setShowCreateModal(false);
      setFormData({
        title: '',
        message: '',
        type: 'general',
      });

      // Refresh notifications
      await fetchNotifications(notificationType);
      alert(`Thông báo đã được gửi thành công!`);
    } catch (error) {
      console.error('Create notification failed:', error);
      let errorMessage = 'Không thể tạo thông báo. ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += 'Vui lòng thử lại sau.';
      }
      alert(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

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
        if (!notification.notificationId) {
          return null;
        }

        // Lấy thông tin chi tiết dựa trên loại thông báo
        let details = [];
        let message = 'Không có nội dung';

        if (notificationType === 'parent') {
          details = notification.notificationParentDetails || [];
          // Lấy message từ parent detail đầu tiên
          if (details.length > 0) {
            message = details[0].message || 'Không có nội dung';
          }
        } else {
          details = notification.notificationstaffdetails || [];
          // Lấy thông tin cho staff hiện tại (giả sử staffid = 2 cho Manager)
          const currentStaffDetail =
            details.find(detail => detail.staffid === 2) || details[0];
          if (currentStaffDetail) {
            message = currentStaffDetail.message || 'Không có nội dung';
          }
        }

        return {
          id: notification.notificationId,
          title: notification.title || 'Không có tiêu đề',
          message: message,
          type: notification.type || 'Chung',
          targetType: notificationType,
          createdAt: notification.createdAt || new Date().toISOString(),
          createdBy: notification.createdby || 'Hệ thống',
          details: details,
          notificationParentDetails:
            notification.notificationParentDetails || [],
          notificationstaffdetails: notification.notificationstaffdetails || [],
        };
      })
      .filter(Boolean);

    return processed;
  };

  const processedNotifications = processNotificationData(notifications);

  // Thống kê
  const stats = {
    total: processedNotifications.length,
    urgent: processedNotifications.filter(n => n.type === 'Khẩn cấp').length,
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

  const handleTypeChange = newType => {
    setNotificationType(newType);
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
        <div className="header-actions">
          <button onClick={handleCreateNotification} className="create-btn">
            ➕ Tạo Thông Báo
          </button>
        </div>
      </div>

      {/* Category Toggle */}
      <div className="category-toggle">
        <button
          className={`toggle-btn ${
            notificationType === 'staff' ? 'active' : ''
          }`}
          onClick={() => handleTypeChange('staff')}
        >
          👩‍💼 Thông Báo Nhân Viên
        </button>
        <button
          className={`toggle-btn ${
            notificationType === 'parent' ? 'active' : ''
          }`}
          onClick={() => handleTypeChange('parent')}
        >
          👨‍👩‍👧‍👦 Thông Báo Phụ Huynh
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
          <h2>
            {notificationType === 'staff'
              ? 'Thông Báo Nhân Viên'
              : 'Thông Báo Phụ Huynh'}
          </h2>
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
                  <th>Đối tượng</th>
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

              {selectedNotification.targetType === 'parent' && (
                <div className="detail-section">
                  <h4>Danh sách phụ huynh nhận thông báo</h4>
                  <div className="recipients-list">
                    {selectedNotification.notificationParentDetails.map(
                      (detail, index) => (
                        <div key={index} className="recipient-item">
                          <div className="recipient-info">
                            <span className="recipient-id">
                              Phụ huynh ID: {detail.parentId}
                            </span>
                          </div>
                          <div className="recipient-message">
                            {detail.message}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {selectedNotification.targetType === 'staff' && (
                <div className="detail-section">
                  <h4>Danh sách nhân viên nhận thông báo</h4>
                  <div className="recipients-list">
                    {selectedNotification.notificationstaffdetails.map(
                      (detail, index) => (
                        <div key={index} className="recipient-item">
                          <div className="recipient-info">
                            <span className="recipient-id">
                              Nhân viên ID: {detail.staffid}
                            </span>
                          </div>
                          <div className="recipient-message">
                            {detail.message}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal} className="close-modal-btn">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal tạo thông báo */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📝 Tạo Thông Báo Mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="notification-form">
              <div className="form-group">
                <label htmlFor="target">Gửi đến:</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="target"
                      value="parent"
                      checked={notificationType === 'parent'}
                      onChange={e => setNotificationType(e.target.value)}
                    />
                    <span className="radio-label">👨‍👩‍👧‍👦 Tất cả Phụ huynh</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="target"
                      value="staff"
                      checked={notificationType === 'staff'}
                      onChange={e => setNotificationType(e.target.value)}
                    />
                    <span className="radio-label">👩‍💼 Tất cả Nhân viên</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="title">Tiêu đề:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề thông báo"
                  required
                  maxLength={100}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Loại:</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="general">📋 Chung</option>
                  <option value="health">🏥 Sức khỏe</option>
                  <option value="event">📅 Sự kiện</option>
                  <option value="emergency">🚨 Khẩn cấp</option>
                  <option value="reminder">⏰ Nhắc nhở</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Nội dung:</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Nhập nội dung thông báo..."
                  rows="5"
                  required
                  maxLength={500}
                  className="form-textarea"
                />
                <small className="char-count">
                  {formData.message.length}/500 ký tự
                </small>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="cancel-btn"
                  disabled={submitLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="send-btn"
                  disabled={
                    submitLoading || !formData.title || !formData.message
                  }
                >
                  {submitLoading ? '⏳ Đang gửi...' : '📤 Gửi Thông Báo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
