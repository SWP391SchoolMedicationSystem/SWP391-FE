import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  useParentNotifications,
  useParentBlogs,
  useParentVaccinationEvents,
  useParentStudents,
} from '../../utils/hooks/useParent';
import { getCurrentDateGMT7 } from '../../utils/dateUtils';
import '../../css/Parent/Dashboard.css';
import * as signalR from '@microsoft/signalr';

// Material-UI Icons
import NotificationsIcon from '@mui/icons-material/Notifications';
import InboxIcon from '@mui/icons-material/Inbox';
import ArticleIcon from '@mui/icons-material/Article';
import ChatIcon from '@mui/icons-material/Chat';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import BoltIcon from '@mui/icons-material/Bolt';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ForumIcon from '@mui/icons-material/Forum';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import PersonIcon from '@mui/icons-material/Person';

function ParentDashboard() {
  const navigate = useNavigate();
  const [quickStats, setQuickStats] = useState([]);
  const [signalRConnection, setSignalRConnection] = useState(null);
  const [realTimeNotifications, setRealTimeNotifications] = useState([]);

  // Get theme from parent layout
  const context = useOutletContext();
  const { theme, isDarkMode } = context || { theme: null, isDarkMode: false };

  // Get real data from APIs
  const { data: notifications, loading: notificationsLoading } =
    useParentNotifications();
  const { data: blogs, loading: blogsLoading } = useParentBlogs();
  const { data: vaccinationEvents, loading: vaccinationEventsLoading } =
    useParentVaccinationEvents();
  const { data: students, loading: studentsLoading } = useParentStudents();

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
              const token = localStorage.getItem('token');
              return token;
            },
          }
        )
        .withAutomaticReconnect()
        .build();

      setSignalRConnection(newConnection);
    }

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
          console.log('🔗 SignalR connected for Parent dashboard');

          // Listen for new notifications
          signalRConnection.on('ReceiveNotification', notification => {
            console.log('📢 New real-time notification:', notification);

            const newNotification = {
              id: Date.now(),
              title:
                notification.Title || notification.title || 'Thông báo mới',
              message: notification.Message || notification.message || '',
              type: notification.Type || 'general',
              targetType: 'parent',
              createdAt: getCurrentDateGMT7(),
              createdBy: 'Hệ thống',
              isNew: true,
            };

            setRealTimeNotifications(prev => [newNotification, ...prev]);
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
              createdAt: getCurrentDateGMT7(),
              createdBy: 'Hệ thống',
              isNew: true,
            };

            setRealTimeNotifications(prev => [newNotification, ...prev]);
          });
        })
        .catch(err => {
          console.error('SignalR connection failed:', err);
        });
    }
  }, [signalRConnection]);

  // Calculate real statistics
  useEffect(() => {
    const calculateStats = () => {
      console.log('🔍 Dashboard - notifications data:', notifications);
      console.log('🔍 Dashboard - vaccination events:', vaccinationEvents);
      console.log('🔍 Dashboard - students data:', students);
      console.log(
        '🔍 Dashboard - realTimeNotifications:',
        realTimeNotifications
      );

      const unreadNotifications = notifications
        ? notifications.filter(n => !n.isRead).length
        : 0;
      const totalBlogs = blogs ? blogs.length : 0;
      const totalVaccinationEvents = vaccinationEvents
        ? vaccinationEvents.length
        : 0;
      const totalChildren = students ? students.length : 0;

      const stats = [
        {
          title: 'Thông báo',
          value: unreadNotifications.toString(),
          icon: (
            <NotificationsIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          ),
          color: 'stat-notification',
        },
        {
          title: 'Số lượng con cái',
          value: totalChildren.toString(),
          icon: <PersonIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />,
          color: 'stat-health',
        },
        {
          title: 'Bài viết sức khỏe',
          value: totalBlogs.toString(),
          icon: <ArticleIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />,
          color: 'stat-vaccine',
        },
        {
          title: 'Sự kiện tiêm chủng',
          value: totalVaccinationEvents.toString(),
          icon: <ChatIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />,
          color: 'stat-message',
        },
      ];

      setQuickStats(stats);
    };

    if (
      !notificationsLoading &&
      !blogsLoading &&
      !vaccinationEventsLoading &&
      !studentsLoading
    ) {
      calculateStats();
    }
  }, [
    notifications,
    blogs,
    vaccinationEvents,
    students,
    notificationsLoading,
    blogsLoading,
    vaccinationEventsLoading,
    studentsLoading,
    realTimeNotifications,
  ]);

  // Get recent notifications from real data
  const getRecentNotifications = () => {
    console.log('🔍 getRecentNotifications called');
    console.log('🔍 notifications from API:', notifications);

    if (!notifications || notifications.length === 0) {
      console.log('🔍 No notifications found');
      return [];
    }

    // Simple approach: just use API notifications
    const recentNotifications = notifications
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      )
      .slice(0, 2)
      .map(notification => ({
        id: notification.notificationId || notification.id,
        title: notification.title || 'Không có tiêu đề',
        content:
          notification.message || notification.content || 'Không có nội dung',
        date: notification.createdAt || notification.date,
        type: notification.type || 'Chung',
        isRead: notification.isRead,
      }));

    console.log('🔍 Recent notifications:', recentNotifications);
    return recentNotifications;
  };

  const handleViewAllNotifications = () => {
    navigate('/parent/notifications');
  };

  const handleViewBlogs = () => {
    navigate('/parent/blogs');
  };

  const handleViewHealthRecords = () => {
    navigate('/parent/health-records');
  };

  const handleMedicineRequest = () => {
    navigate('/parent/medicine-request');
  };

  const handleViewNotificationDetail = notificationId => {
    navigate(`/parent/notifications?notificationId=${notificationId}`);
  };

  return (
    <div
      style={{
        padding: '20px',
        background: theme ? theme.background : '#f2f6f3',
        minHeight: '100vh',
        fontFamily:
          "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '30px',
          borderRadius: '20px',
          background: theme
            ? isDarkMode
              ? 'linear-gradient(135deg, #2a2a2a 0%, #333333 100%)'
              : 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)'
            : 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(47, 81, 72, 0.3)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2.5rem',
              margin: 0,
              fontWeight: 700,
              fontFamily: 'Satoshi, sans-serif',
              color: 'white',
            }}
          >
            Chào mừng, Phụ Huynh!
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              margin: '10px 0 0 0',
              opacity: 0.9,
              fontFamily: 'Satoshi, sans-serif',
              color: 'white',
            }}
          >
            Theo dõi sức khỏe và thông tin học tập của con em
          </p>
        </div>
        <div
          style={{
            fontSize: '1rem',
            opacity: 0.8,
            fontFamily: 'Satoshi, sans-serif',
            color: 'white',
          }}
        >
          <span>
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {notificationsLoading || blogsLoading ? (
          <div
            style={{
              background: theme ? theme.cardBg : 'white',
              padding: '25px',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
              border: theme ? `1px solid ${theme.border}` : '1px solid #c1cbc2',
            }}
          >
            <p
              style={{
                color: theme ? theme.textSecondary : '#97a19b',
                fontFamily: 'Satoshi, sans-serif',
                margin: 0,
              }}
            >
              <HourglassEmptyIcon
                sx={{
                  color: theme ? theme.textSecondary : '#97a19b',
                  fontSize: '1.2rem',
                  marginRight: '8px',
                }}
              />
              Đang tải thống kê...
            </p>
          </div>
        ) : (
          quickStats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: theme ? theme.cardBg : 'white',
                padding: '25px',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
                border: theme
                  ? `1px solid ${theme.border}`
                  : '1px solid #c1cbc2',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  padding: '15px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(191, 239, 161, 0.3)',
                }}
              >
                {stat.icon}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: '2rem',
                    margin: 0,
                    color: theme ? theme.textPrimary : '#2f5148',
                    fontWeight: 700,
                    fontFamily: 'Satoshi, sans-serif',
                  }}
                >
                  {stat.value}
                </h3>
                <p
                  style={{
                    margin: '5px 0 0 0',
                    color: theme ? theme.textSecondary : '#97a19b',
                    fontFamily: 'Satoshi, sans-serif',
                  }}
                >
                  {stat.title}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Recent Notifications */}
      <div
        style={{
          background: theme ? theme.cardBg : 'white',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: theme ? `1px solid ${theme.border}` : '1px solid #c1cbc2',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            padding: '15px 20px',
            borderRadius: '15px',
            background: theme
              ? isDarkMode
                ? 'linear-gradient(135deg, #444444 0%, #555555 100%)'
                : 'linear-gradient(135deg, #a8d895 0%, #bfefa1 100%)'
              : 'linear-gradient(135deg, #a8d895 0%, #bfefa1 100%)',
          }}
        >
          <h3
            style={{
              margin: 0,
              color: theme ? (isDarkMode ? '#ffffff' : '#2f5148') : '#2f5148',
              fontFamily: 'Satoshi, sans-serif',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <NotificationsIcon
              sx={{
                color: theme ? (isDarkMode ? '#ffffff' : '#2f5148') : '#2f5148',
                fontSize: '1.2rem',
                marginRight: '8px',
              }}
            />
            Thông Báo Gần Đây
          </h3>
          <button
            style={{
              background: 'transparent',
              border: theme
                ? `1px solid ${isDarkMode ? '#ffffff' : '#2f5148'}`
                : '1px solid #2f5148',
              color: theme ? (isDarkMode ? '#ffffff' : '#2f5148') : '#2f5148',
              padding: '8px 15px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontFamily: 'Satoshi, sans-serif',
              fontWeight: 500,
              transition: 'all 0.2s ease',
            }}
            onClick={handleViewAllNotifications}
          >
            Xem tất cả
          </button>
        </div>
        <div>
          {getRecentNotifications().length > 0 ? (
            getRecentNotifications().map(notification => (
              <div
                key={notification.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '12px',
                  background: theme
                    ? isDarkMode
                      ? '#333333'
                      : '#f8f9fa'
                    : '#f8f9fa',
                  border: theme
                    ? `1px solid ${theme.border}`
                    : '1px solid #e9ecef',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: '0 0 5px 0',
                      color: theme ? theme.textPrimary : '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {notification.title}
                  </h4>
                  <p
                    style={{
                      margin: '0 0 5px 0',
                      color: theme ? theme.textSecondary : '#97a19b',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.9rem',
                    }}
                  >
                    {notification.content}
                  </p>
                  <span
                    style={{
                      color: theme ? theme.textSecondary : '#97a19b',
                      fontSize: '0.8rem',
                      fontFamily: 'Satoshi, sans-serif',
                    }}
                  >
                    {notification.date}
                  </span>
                </div>
                <button
                  style={{
                    background: theme
                      ? isDarkMode
                        ? '#4a5568'
                        : '#85b06d'
                      : '#85b06d',
                    color: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                  onClick={() => handleViewNotificationDetail(notification.id)}
                >
                  Đọc
                </button>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: theme ? theme.textSecondary : '#97a19b',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              <NotificationsIcon
                sx={{
                  fontSize: '3rem',
                  marginBottom: '10px',
                  opacity: 0.5,
                }}
              />
              <p>Chưa có thông báo nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: theme ? theme.cardBg : 'white',
          borderRadius: '20px',
          padding: '25px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: theme ? `1px solid ${theme.border}` : '1px solid #c1cbc2',
        }}
      >
        <h3
          style={{
            margin: '0 0 20px 0',
            color: theme ? theme.textPrimary : '#2f5148',
            fontFamily: 'Satoshi, sans-serif',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <BoltIcon
            sx={{
              color: theme ? theme.textSecondary : '#97a19b',
              fontSize: '1.3rem',
              marginRight: '8px',
            }}
          />
          Thao Tác Nhanh
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '15px',
          }}
        >
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '1.1rem',
              fontWeight: 500,
              fontFamily: 'Satoshi, sans-serif',
              background: theme
                ? isDarkMode
                  ? '#2d4739'
                  : '#2f5148'
                : '#2f5148',
              color: 'white',
            }}
            onClick={handleViewHealthRecords}
          >
            <AssignmentIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontWeight: 600 }}>
                Xem Hồ Sơ Sức Khỏe
              </span>
              <small
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.8rem',
                }}
              >
                Kiểm tra thông tin sức khỏe chi tiết
              </small>
            </div>
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '1.1rem',
              fontWeight: 500,
              fontFamily: 'Satoshi, sans-serif',
              background: theme
                ? isDarkMode
                  ? '#3a3a3a'
                  : '#bfefa1'
                : '#bfefa1',
              color: theme ? (isDarkMode ? '#ffffff' : '#1a3a2e') : '#1a3a2e',
            }}
            onClick={handleMedicineRequest}
          >
            <LocalPharmacyIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontWeight: 600 }}>
                Gửi đơn yêu cầu
              </span>
              <small
                style={{
                  color: theme
                    ? isDarkMode
                      ? 'rgba(255, 255, 255, 0.7)'
                      : '#1a3a2e'
                    : '#1a3a2e',
                  fontSize: '0.8rem',
                }}
              >
                Gửi yêu cầu thuốc cho con em
              </small>
            </div>
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '15px 20px',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '1.1rem',
              fontWeight: 500,
              fontFamily: 'Satoshi, sans-serif',
              background: theme
                ? isDarkMode
                  ? '#3a3a3a'
                  : '#bfefa1'
                : '#bfefa1',
              color: theme ? (isDarkMode ? '#ffffff' : '#1a3a2e') : '#1a3a2e',
            }}
            onClick={handleViewBlogs}
          >
            <ArticleIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
            <div style={{ textAlign: 'left' }}>
              <span style={{ display: 'block', fontWeight: 600 }}>
                Đọc Blog Sức Khỏe
              </span>
              <small
                style={{
                  color: theme
                    ? isDarkMode
                      ? 'rgba(255, 255, 255, 0.7)'
                      : '#1a3a2e'
                    : '#1a3a2e',
                  fontSize: '0.8rem',
                }}
              >
                Xem các bài viết về sức khỏe học đường
              </small>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;
