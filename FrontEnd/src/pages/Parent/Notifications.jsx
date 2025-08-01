import React, { useState, useEffect } from 'react';
import { useParentNotifications } from '../../utils/hooks/useParent';
import '../../css/Parent/Notifications.css';
// Material-UI Icons
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import * as signalR from '@microsoft/signalr'; // Import SignalR client

const ParentNotifications = () => {
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
  } = useParentNotifications();

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
          console.log('🔗 SignalR connected for Parent notifications');
          setConnectionStatus('Connected');

          // Listen for new notifications
          signalRConnection.on('ReceiveNotification', notification => {
            console.log('📢 New real-time notification:', notification);

            // Add to real-time notifications
            const newNotification = {
              id: Date.now(),
              title:
                notification.Title || notification.title || 'Thông báo mới',
              message: notification.Message || notification.message || '',
              type: notification.Type || 'general',
              targetType: 'parent',
              createdAt: new Date().toISOString(),
              createdBy: 'Hệ thống',
              isNew: true,
            };

            setRealTimeNotifications(prev => [newNotification, ...prev]);

            // Show browser notification if supported
            if (Notification.permission === 'granted') {
              new Notification(newNotification.title, {
                body: newNotification.message,
                icon: '/favicon.ico',
                tag: 'parent-notification',
              });
            }

            // Refresh notifications after receiving new one
            setTimeout(() => {
              fetchNotifications();
            }, 1000);
          });

          // Listen for parent-specific notifications
          signalRConnection.on('ReceiveParentNotification', notification => {
            console.log('👨‍👩‍👧‍👦 Parent notification:', notification);

            const newNotification = {
              id: Date.now(),
              title:
                notification.Title ||
                notification.title ||
                'Thông báo phụ huynh',
              message: notification.Message || notification.message || '',
              type: notification.Type || 'general',
              targetType: 'parent',
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
                tag: 'parent-notification',
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
          signalRConnection.off('ReceiveParentNotification');
          signalRConnection.off('ReceiveError');
        }
      };
    }
  }, [signalRConnection, fetchNotifications]);

  // Gọi API khi component mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

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

        // Lấy thông tin chi tiết cho parent hiện tại (giả sử parentId = 1 cho Parent)
        const currentParentDetail =
          notification.notificationParentDetails?.find(
            detail => detail.parentId === 1
          ) || notification.notificationParentDetails?.[0];

        return {
          id: notification.notificationId,
          title: notification.title || 'Không có tiêu đề',
          message: currentParentDetail?.message || 'Không có nội dung',
          type: notification.type || 'Chung',
          targetType: 'parent',
          createdAt: notification.createdAt || new Date().toISOString(),
          createdBy: notification.createdby || 'Hệ thống',
          notificationParentDetails:
            notification.notificationParentDetails || [],
        };
      })
      .filter(Boolean);

    return processed;
  };

  const processedNotifications = processNotificationData(notifications);

  // Combine API notifications with real-time notifications
  const allNotifications = [...realTimeNotifications, ...processedNotifications]
    .filter(
      (notification, index, self) =>
        index === self.findIndex(n => n.id === notification.id)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Thống kê (removed unused stats variable)

  const getTypeBadge = type => {
    const typeMap = {
      'Sức khỏe': { label: 'Sức khỏe', class: 'type-sức-khỏe' },
      'Khẩn cấp': { label: 'Khẩn cấp', class: 'type-khẩn-cấp' },
      'Nhắc nhở': { label: 'Nhắc nhở', class: 'type-nhắc-nhở' },
      'Sự kiện': { label: 'Sự kiện', class: 'type-sự-kiện' },
      Chung: { label: 'Chung', class: 'type-chung' },
      general: { label: 'Chung', class: 'type-general' },
      health: { label: 'Sức khỏe', class: 'type-health' },
      emergency: { label: 'Khẩn cấp', class: 'type-khẩn-cấp' },
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
          <h1>📢 Thông Báo</h1>
          <p>Xem thông báo từ nhà trường</p>
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
                  <th>Ngày tạo</th>
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
                    <td className="date-cell">
                      {new Date(notification.createdAt).toLocaleDateString(
                        'vi-VN'
                      )}
                    </td>
                    <td className="action-cell">
                      <button
                        onClick={() => handleViewDetail(notification)}
                        className="view-detail-btn"
                        title="Xem chi tiết"
                      >
                        <VisibilityIcon sx={{ fontSize: '1.2rem' }} />
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
              {/* Thông tin chung */}
              <div
                style={{
                  marginBottom: '20px',
                  background: '#f8f9fa',
                  padding: '15px',
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
                  <CategoryIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                  Thông tin chung
                </h4>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '15px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Tiêu đề:
                    </span>
                    <span
                      style={{
                        color: '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      {selectedNotification.title}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Loại:
                    </span>
                    <span
                      style={{
                        color: '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
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
                      padding: '12px 15px',
                      background: 'white',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <ScheduleIcon
                        sx={{ color: '#97a19b', fontSize: '1rem' }}
                      />
                      Ngày tạo:
                    </span>
                    <span
                      style={{
                        color: '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      {new Date(selectedNotification.createdAt).toLocaleString(
                        'vi-VN'
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nội dung chi tiết */}
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '15px',
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
                  <DescriptionIcon
                    sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                  />
                  Nội dung chi tiết
                </h4>
                <div
                  style={{
                    padding: '15px',
                    background: 'white',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: '#2f5148',
                      fontSize: '0.9rem',
                      fontFamily: 'Satoshi, sans-serif',
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedNotification.message}
                  </p>
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
                onClick={handleCloseModal}
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

export default ParentNotifications;
