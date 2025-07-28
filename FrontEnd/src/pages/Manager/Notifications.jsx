/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useManagerNotifications } from '../../utils/hooks/useManager';
import {
  managerNotificationService,
  managerStaffService,
} from '../../services/managerService';
import '../../css/Manager/Notifications.css';

// Material-UI Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import MessageIcon from '@mui/icons-material/Message';
import BadgeIcon from '@mui/icons-material/Badge';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

import * as signalR from '@microsoft/signalr'; // Import thư viện SignalR client
const Notifications = () => {
  const [notificationType, setNotificationType] = useState('staff'); // "staff" hoặc "parent"

  const [signalRConnection, setSignalRConnection] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [parentMap, setParentMap] = useState({}); // Map parent ID to parent name
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

  useEffect(() => {
    if (!signalRConnection) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(
          `https://api-schoolhealth.purintech.id.vn/hubs/notifications`,
          {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets,
          }
        )
        .withAutomaticReconnect()
        .build();

      setSignalRConnection(newConnection);
    }

    console.log('signalRConnection', signalRConnection);
    // Cleanup function for connection
    return () => {
      if (
        signalRConnection &&
        signalRConnection.state === signalR.HubConnectionState.Connected
      ) {
        signalRConnection.stop();
      }
    };
  }, [signalRConnection]); // Dependency on 'connection' to prevent re-creation if already exists

  // --- SignalR Event Handlers ---
  useEffect(() => {
    if (signalRConnection) {
      signalRConnection
        .start()
        .then(() => {
          console.log('Kết nối SignalR đã được thiết lập và xác thực!');

          // Đăng ký sự kiện nhận tin nhắn riêng tư
          signalRConnection.on(
            'ReceivePrivateMessage',
            (
              senderId,
              receiverId,
              content,
              senderUsername,
              receiverUsername,
              timestamp
            ) => {
              // task to do when receive notification
            }
          );

          // Đăng ký sự kiện nhận lỗi từ Hub
          signalRConnection.on('ReceiveError', errorMsg => {
            console.error('Lỗi từ SignalR Hub:', errorMsg);
            alert(`Lỗi: ${errorMsg}`); // Sử dụng alert tạm thời, nên thay bằng modal
          });
        })
        .catch(e => {
          console.error('Lỗi khi thiết lập kết nối SignalR:', e);
          // Có thể hiển thị thông báo lỗi cho người dùng
        });

      // Cleanup for event listeners
      return () => {
        signalRConnection.off('ReceivePrivateMessage');
        signalRConnection.off('ReceiveError');
      };
    }
  }, [signalRConnection]); // selectedUser đã được loại bỏ khỏi dependency array vì chúng ta dùng ref

  // Fetch all parents once and cache them
  const [allParents, setAllParents] = useState([]);
  const [parentsLoading, setParentsLoading] = useState(false);

  // Fetch all parents data once
  useEffect(() => {
    const fetchAllParents = async () => {
      setParentsLoading(true);
      try {
        const response = await fetch(
          `https://api-schoolhealth.purintech.id.vn/api/Parent/parent`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const parents = await response.json();
          setAllParents(parents);
        }
      } catch (error) {
        console.error('Error fetching all parents:', error);
      } finally {
        setParentsLoading(false);
      }
    };

    fetchAllParents();
  }, []);

  // Fetch all staff once and cache them
  const [allStaff, setAllStaff] = useState([]);
  const [staffLoading, setStaffLoading] = useState(false);

  // Fetch all staff data once
  useEffect(() => {
    const fetchAllStaff = async () => {
      setStaffLoading(true);
      try {
        const response = await fetch(
          `https://api-schoolhealth.purintech.id.vn/api/Staff/staff`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.ok) {
          const staff = await response.json();
          setAllStaff(staff);
        }
      } catch (error) {
        console.error('Error fetching all staff:', error);
      } finally {
        setStaffLoading(false);
      }
    };

    fetchAllStaff();
  }, []);

  // Function to get parent name from cached data
  const getParentNameFromCache = parentId => {
    const parent = allParents.find(
      p => p.parentid === parentId || p.parentid === Number(parentId)
    );
    return parent ? parent.fullname : null;
  };

  // Function to get staff name from cached data
  const getStaffNameFromCache = staffId => {
    const staff = allStaff.find(
      s => s.staffid === staffId || s.staffid === Number(staffId)
    );
    return staff ? staff.fullname : null;
  };

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
      // Validation: Không cho phép gửi thông báo cho admin và manager
      if (notificationType === 'staff') {
        const hasAdminOrManager = allStaff.some(
          staff => staff.roleid === 1 || staff.roleid === 2
        );

        if (hasAdminOrManager) {
          alert('Không thể gửi thông báo cho Admin và Manager!');
          setSubmitLoading(false);
          return;
        }
      }

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
      .filter(Boolean)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo thời gian mới nhất trước

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

  // Handle close modal
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedNotification(null);
  };

  const handleTypeChange = newType => {
    setNotificationType(newType);
  };

  // Component for displaying parent information
  const ParentDisplay = ({
    detail,
    getParentNameFromCache,
    parentsLoading,
  }) => {
    const parentName = getParentNameFromCache(detail.parentId);

    return (
      <div
        style={{
          background: 'white',
          padding: '15px',
          borderRadius: '10px',
          border: '1px solid #e9ecef',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <FamilyRestroomIcon sx={{ color: '#97a19b', fontSize: '1.1rem' }} />
          <span
            style={{
              color: '#2f5148',
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {parentsLoading ? (
              'Đang tải...'
            ) : parentName ? (
              <>
                {parentName} (ID: {detail.parentId})
              </>
            ) : (
              `Phụ huynh ID: ${detail.parentId} (Không tìm thấy)`
            )}
          </span>
        </div>
        <p
          style={{
            margin: 0,
            color: '#97a19b',
            fontSize: '0.9rem',
            fontFamily: 'Satoshi, sans-serif',
            lineHeight: 1.5,
          }}
        >
          {detail.message}
        </p>
      </div>
    );
  };

  // Component for displaying staff information
  const StaffDisplay = ({ detail, getStaffNameFromCache, staffLoading }) => {
    const staffName = getStaffNameFromCache(detail.staffid);

    return (
      <div
        style={{
          background: 'white',
          padding: '15px',
          borderRadius: '10px',
          border: '1px solid #e9ecef',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <BadgeIcon sx={{ color: '#97a19b', fontSize: '1.1rem' }} />
          <span
            style={{
              color: '#2f5148',
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {staffLoading ? (
              'Đang tải...'
            ) : staffName ? (
              <>
                {staffName} (ID: {detail.staffid})
              </>
            ) : (
              `Nhân viên ID: ${detail.staffid} (Không tìm thấy)`
            )}
          </span>
        </div>
        <p
          style={{
            margin: 0,
            color: '#97a19b',
            fontSize: '0.9rem',
            fontFamily: 'Satoshi, sans-serif',
            lineHeight: 1.5,
          }}
        >
          {detail.message}
        </p>
      </div>
    );
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
              maxWidth: '800px',
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
                background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                color: 'white',
                borderRadius: '20px 20px 0 0',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: 'white',
                  fontFamily:
                    "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <InfoIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                Chi Tiết Thông Báo
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '8px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CloseIcon sx={{ fontSize: '1.5rem' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '30px' }}>
              {/* Notification Title Header */}
              <div
                style={{
                  background:
                    'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  padding: '20px',
                  borderRadius: '15px',
                  marginBottom: '25px',
                  textAlign: 'center',
                  border: '1px solid #e9ecef',
                }}
              >
                <h4
                  style={{
                    margin: 0,
                    color: '#2f5148',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <NotificationsIcon
                    sx={{ color: '#97a19b', fontSize: '1.6rem' }}
                  />
                  {selectedNotification.title}
                </h4>
              </div>

              {/* Notification Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '20px',
                  marginBottom: '25px',
                }}
              >
                {/* General Information */}
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '15px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <h5
                    style={{
                      margin: '0 0 20px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <InfoIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                    Thông tin chung
                  </h5>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <CategoryIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
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
                      </div>
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
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <CalendarTodayIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Ngày tạo:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {new Date(
                          selectedNotification.createdAt
                        ).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <PersonIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Người tạo:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {getStaffNameFromCache(
                          selectedNotification.createdBy
                        ) || `ID: ${selectedNotification.createdBy}`}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 15px',
                        background: 'white',
                        borderRadius: '10px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <GroupIcon
                          sx={{ color: '#97a19b', fontSize: '1.1rem' }}
                        />
                        <span
                          style={{
                            color: '#97a19b',
                            fontFamily: 'Satoshi, sans-serif',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                          }}
                        >
                          Đối tượng:
                        </span>
                      </div>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {selectedNotification.targetType === 'parent'
                          ? 'Phụ Huynh'
                          : 'Nhân Viên'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '15px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <h5
                    style={{
                      margin: '0 0 15px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <MessageIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    Nội dung chi tiết
                  </h5>
                  <div
                    style={{
                      background: 'white',
                      padding: '15px',
                      borderRadius: '12px',
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

              {/* Recipients List */}
              {selectedNotification.targetType === 'parent' && (
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '15px',
                    border: '1px solid #e9ecef',
                    marginBottom: '20px',
                  }}
                >
                  <h5
                    style={{
                      margin: '0 0 20px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FamilyRestroomIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    Danh sách phụ huynh nhận thông báo
                  </h5>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '15px',
                    }}
                  >
                    {selectedNotification.notificationParentDetails.map(
                      (detail, index) => (
                        <ParentDisplay
                          key={index}
                          detail={detail}
                          getParentNameFromCache={getParentNameFromCache}
                          parentsLoading={parentsLoading}
                        />
                      )
                    )}
                  </div>
                </div>
              )}

              {selectedNotification.targetType === 'staff' && (
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '20px',
                    borderRadius: '15px',
                    border: '1px solid #e9ecef',
                    marginBottom: '20px',
                  }}
                >
                  <h5
                    style={{
                      margin: '0 0 20px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <BadgeIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                    Danh sách nhân viên nhận thông báo
                  </h5>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '15px',
                    }}
                  >
                    {selectedNotification.notificationstaffdetails
                      .filter(detail => {
                        // Filter out admin and manager (roleid 1 and 2)
                        const staff = allStaff.find(
                          s =>
                            s.staffid === detail.staffid ||
                            s.staffid === Number(detail.staffid)
                        );
                        return (
                          staff && staff.roleid !== 1 && staff.roleid !== 2
                        );
                      })
                      .map((detail, index) => (
                        <StaffDisplay
                          key={index}
                          detail={detail}
                          getStaffNameFromCache={getStaffNameFromCache}
                          staffLoading={staffLoading}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '20px 30px',
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
