/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  useManagerStudents,
  useManagerBlogs,
  useManagerDashboard,
  useManagerRecentActivities,
  useManagerSystemStatus,
} from '../../utils/hooks/useManager';
import '../../css/Manager/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState([]);

  // Get real data from APIs
  const { data: students, loading: studentsLoading } = useManagerStudents();
  const { data: blogs, loading: blogsLoading } = useManagerBlogs();

  // New dashboard hooks
  const {
    data: stats,
    loading: statsLoading,
    fetchStats,
  } = useManagerDashboard();
  const {
    data: activities,
    loading: activitiesLoading,
    fetchActivities,
  } = useManagerRecentActivities();
  const {
    data: systemStatus,
    loading: statusLoading,
    fetchStatus,
  } = useManagerSystemStatus();

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchStats();
    fetchActivities();
    fetchStatus();
  }, [fetchStats, fetchActivities, fetchStatus]);

  // Calculate real statistics from API data

  // Quick actions for easy navigation
  const quickActions = [
    {
      title: 'Quản Lý Tài Khoản',
      description: 'Thêm, sửa, xóa tài khoản người dùng',
      icon: '👤',
      color: 'blue',
      path: '/manager/accounts',
    },
    {
      title: 'Quản Lý Blog',
      description: 'Tạo và quản lý bài viết blog',
      icon: '📝',
      color: 'green',
      path: '/manager/blogs',
    },
    {
      title: 'Danh Sách Học Sinh',
      description: 'Quản lý thông tin học sinh',
      icon: '🎓',
      color: 'orange',
      path: '/manager/StudentList',
    },
  ];

  const handleQuickAction = path => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div className="dashboard-welcome">
        <div className="welcome-content">
          <h1>Chào mừng trở lại! 👋</h1>
          <p>Quản lý hệ thống y tế trường học một cách hiệu quả</p>
        </div>
        <div className="welcome-date">
          <div className="current-date">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2
          className="section-title"
          style={{
            fontFamily:
              "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          Thao Tác Nhanh
        </h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`quick-action-card ${action.color}`}
              onClick={() => handleQuickAction(action.path)}
            >
              <div className="action-icon">{action.icon}</div>
              <div className="action-content">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="action-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activities & System Status */}
      <div className="bottom-section">
        <div className="recent-activities">
          <h3>Hoạt Động Gần Đây</h3>
          <div className="activities-list">
            {activitiesLoading ? (
              <div className="loading-activities">
                <p>⏳ Đang tải hoạt động...</p>
              </div>
            ) : activities && activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-activities">
                <p>Chưa có hoạt động nào gần đây</p>
              </div>
            )}
          </div>
        </div>

        <div className="system-status">
          <h3>Trạng Thái Hệ Thống</h3>
          <div className="status-list">
            {statusLoading ? (
              <div className="loading-status">
                <p>⏳ Đang kiểm tra trạng thái...</p>
              </div>
            ) : systemStatus && systemStatus.length > 0 ? (
              systemStatus.map((item, index) => (
                <div key={index} className="status-item">
                  <div className={`status-indicator ${item.status}`}></div>
                  <span>{item.name}</span>
                  <span className="status-text">
                    {item.status === 'online' ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-status">
                <p>Không thể kiểm tra trạng thái hệ thống</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
