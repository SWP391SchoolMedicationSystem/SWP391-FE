import React, { useState, useEffect } from 'react';
import { useNurseNotifications } from '../../utils/hooks/useNurse';
import '../../css/Nurse/Notifications.css';
import NotificationsIcon from '@mui/icons-material/Notifications';
import TitleIcon from '@mui/icons-material/Title';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import * as signalR from '@microsoft/signalr'; // Import SignalR client

const Notifications = () => {
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [signalRConnection, setSignalRConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [realTimeNotifications, setRealTimeNotifications] = useState([]);

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
      .filter(Boolean) // Loại bỏ các item null
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo thời gian mới nhất trước

    return processed;
  };

  const processedNotifications = processNotificationData(notificationData);

  // Sử dụng mock data nếu không có dữ liệu từ API
  const displayNotifications =
    processedNotifications.length > 0
      ? processedNotifications
      : processNotificationData(mockNotifications);

  // SignalR Connection Setup
  useEffect(() => {
    if (!signalRConnection) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(
          'https://api-schoolhealth.purintech.id.vn/hubs/notifications',
          {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
            accessTokenFactory: () => {
              // Lấy JWT token từ localStorage
              const token = localStorage.getItem('token');
              console.log(
                '🔑 Sending JWT token to SignalR:',
                token ? 'Token found' : 'No token'
              );
              return token;
            },
          }
        )
        .withAutomaticReconnect()
        .build();

      setSignalRConnection(newConnection);
    }

    // Cleanup function for connection
    return () => {
      if (
        signalRConnection &&
        signalRConnection.state === signalR.HubConnectionState.Connected
      ) {
        signalRConnection.stop();
      }
    };
  }, [signalRConnection]);

  // SignalR Event Handlers
  useEffect(() => {
    if (signalRConnection) {
      signalRConnection
        .start()
        .then(() => {
          console.log('🔗 SignalR connected for Nurse notifications');
          setConnectionStatus('Connected');

          // Listen for staff notifications
          signalRConnection.on('ReceiveNotification', notification => {
            console.log('📢 New staff notification:', notification);

            const newNotification = {
              id: Date.now(),
              title:
                notification.Title || notification.title || 'Thông báo mới',
              message: notification.Message || notification.message || '',
              type: notification.Type || 'general',
              targetType: 'staff',
              createdAt: new Date().toISOString(),
              createdBy: 'Hệ thống',
              isNew: true,
            };

            setRealTimeNotifications(prev => [newNotification, ...prev]);

            // Show browser notification
            if (Notification.permission === 'granted') {
              new Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/favicon.ico',
                tag: 'nurse-notification',
              });
            }

            // Refresh notifications after receiving new one
            // setTimeout(() => {
            //   fetchNotifications();
            // }, 1000);
          });

          // Listen for staff-specific notifications
          signalRConnection.on('ReceiveStaffNotification', notification => {
            console.log('👩‍⚕️ Nurse notification:', notification);

            const newNotification = {
              id: Date.now(),
              title:
                notification.Title ||
                notification.title ||
                'Thông báo nhân viên',
              message: notification.Message || notification.message || '',
              type: notification.Type || 'general',
              targetType: 'staff',
              createdAt: new Date().toISOString(),
              createdBy: 'Hệ thống',
              isNew: true,
            };

            setRealTimeNotifications(prev => [newNotification, ...prev]);

            // Show browser notification
            if (Notification.permission === 'granted') {
              new Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/favicon.ico',
                tag: 'nurse-notification',
              });
            }

            // Refresh notifications
            setTimeout(() => {
              fetchNotifications();
            }, 1000);
          });

          // Listen for errors
          signalRConnection.on('ReceiveError', errorMsg => {
            console.error('❌ SignalR Error:', errorMsg);
            setConnectionStatus('Error');
          });

          // Request notification permission
          if (
            'Notification' in window &&
            Notification.permission === 'default'
          ) {
            Notification.requestPermission();
          }
        })
        .catch(e => {
          console.error('❌ SignalR connection failed:', e);
          setConnectionStatus('Failed');
        });

      // Cleanup event listeners
      return () => {
        if (signalRConnection) {
          signalRConnection.off('ReceiveNotification');
          signalRConnection.off('ReceiveStaffNotification');
          signalRConnection.off('ReceiveError');
        }
      };
    }
  }, [signalRConnection, fetchNotifications]);

  // Combine API notifications with real-time notifications
  const allNotifications = [...realTimeNotifications, ...displayNotifications]
    .filter(
      (notification, index, self) =>
        index === self.findIndex(n => n.id === notification.id)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
        <div className="connection-status">
          {connectionStatus === 'Connected' ? (
            <div className="connection-indicator connected">
              <WifiIcon sx={{ fontSize: '1.2rem', color: '#4CAF50' }} />
              <span>Kết nối trực tiếp</span>
            </div>
          ) : (
            <div className="connection-indicator disconnected">
              <WifiOffIcon sx={{ fontSize: '1.2rem', color: '#f44336' }} />
              <span>Mất kết nối</span>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách thông báo */}
      <div className="notifications-section">
        <div className="section-header">
          <h2>Thông Báo Gần Đây</h2>
        </div>

        {allNotifications.length === 0 ? (
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
                {allNotifications.map((notification, index) => (
                  <tr
                    key={notification.id || index}
                    className={`notification-row ${
                      notification.isNew ? 'new-notification' : ''
                    }`}
                  >
                    <td className="title-cell">
                      <div className="title-content">
                        {notification.isNew && (
                          <NotificationsActiveIcon
                            sx={{
                              fontSize: '1rem',
                              color: '#4CAF50',
                              marginRight: '5px',
                            }}
                          />
                        )}
                        {notification.title}
                      </div>
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
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto',
              border: '1px solid #c1cbc2',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '25px',
                borderBottom: '1px solid #e9ecef',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: '#2f5148',
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <InfoIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
                Chi Tiết Thông Báo
              </h3>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#97a19b',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '5px',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                }}
                onClick={handleCloseModal}
              >
                <CloseIcon sx={{ fontSize: '1.5rem' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '25px' }}>
              {/* Basic Information */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '15px',
                  marginBottom: '25px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <span
                    style={{
                      color: '#97a19b',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <TitleIcon sx={{ fontSize: '0.9rem' }} />
                    Tiêu đề:
                  </span>
                  <span
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textAlign: 'right',
                      maxWidth: '60%',
                    }}
                  >
                    {selectedNotification.title}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <span
                    style={{
                      color: '#97a19b',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <CategoryIcon sx={{ fontSize: '0.9rem' }} />
                    Loại:
                  </span>
                  <span
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    {getTypeBadge(selectedNotification.type)}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    gridColumn: '1 / -1',
                  }}
                >
                  <span
                    style={{
                      color: '#97a19b',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <DateRangeIcon sx={{ fontSize: '0.9rem' }} />
                    Ngày nhận:
                  </span>
                  <span
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    {new Date(selectedNotification.createdAt).toLocaleString(
                      'vi-VN'
                    )}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 15px 0',
                    color: '#2f5148',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <MessageIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                  Nội dung thông báo
                </h4>
                <div
                  style={{
                    color: '#2f5148',
                    fontSize: '1rem',
                    fontFamily: 'Satoshi, sans-serif',
                    lineHeight: 1.6,
                    fontWeight: 500,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {selectedNotification.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '20px 25px',
                borderTop: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleCloseModal}
                style={{
                  background: '#bfefa1',
                  color: '#1a3a2e',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  fontFamily: 'Satoshi, sans-serif',
                  transition: 'all 0.3s ease',
                }}
              >
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
