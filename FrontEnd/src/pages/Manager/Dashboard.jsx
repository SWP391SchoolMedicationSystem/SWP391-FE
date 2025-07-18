/* eslint-disable no-unused-vars */
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  useManagerStudents,
  useManagerBlogs,
} from '../../utils/hooks/useManager';
import '../../css/Manager/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState([]);

  // Get real data from APIs
  const { data: students, loading: studentsLoading } = useManagerStudents();
  const { data: blogs, loading: blogsLoading } = useManagerBlogs();

  // Calculate real statistics
  useEffect(() => {
    const calculateStats = () => {
      const totalStudents = students ? students.length : 0;
      const maleStudents = students
        ? students.filter(s => s.gender === 'Nam').length
        : 0;
      const femaleStudents = students
        ? students.filter(s => s.gender === 'Nữ').length
        : 0;
      const totalBlogs = blogs ? blogs.length : 0;
      const pendingBlogs = blogs
        ? blogs.filter(b => b.status === 'pending').length
        : 0;

      const stats = [
        {
          title: 'Tổng Học Sinh',
          value: totalStudents.toString(),
          change: '+8.2%', // Mock percentage
          changeType: 'positive',
          icon: '🎓',
          color: 'blue',
          description: 'Số học sinh trong hệ thống',
        },
        {
          title: 'Học Sinh Nam',
          value: maleStudents.toString(),
          change: `${
            totalStudents > 0
              ? ((maleStudents / totalStudents) * 100).toFixed(1)
              : 0
          }%`,
          changeType: 'neutral',
          icon: '👦',
          color: 'green',
          description: 'Tỷ lệ học sinh nam',
        },
        {
          title: 'Học Sinh Nữ',
          value: femaleStudents.toString(),
          change: `${
            totalStudents > 0
              ? ((femaleStudents / totalStudents) * 100).toFixed(1)
              : 0
          }%`,
          changeType: 'neutral',
          icon: '👧',
          color: 'purple',
          description: 'Tỷ lệ học sinh nữ',
        },
        {
          title: 'Tổng Bài Viết',
          value: totalBlogs.toString(),
          change:
            pendingBlogs > 0 ? `${pendingBlogs} chờ duyệt` : 'Đã duyệt hết',
          changeType: pendingBlogs > 0 ? 'warning' : 'positive',
          icon: '📝',
          color: 'orange',
          description: 'Bài viết trong hệ thống',
        },
      ];

      setDashboardStats(stats);
    };

    if (!studentsLoading && !blogsLoading) {
      calculateStats();
    }
  }, [students, blogs, studentsLoading, blogsLoading]);

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

  // Recent activities - combine real data with mock data
  const getRecentActivities = () => {
    const activities = [];

    // Add recent blog activities if available
    if (blogs && blogs.length > 0) {
      const recentBlogs = blogs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2);

      recentBlogs.forEach(blog => {
        activities.push({
          type: 'blog',
          message: `Bài viết mới: "${blog.title}"`,
          time: new Date(blog.createdAt).toLocaleDateString('vi-VN'),
          icon: '📝',
        });
      });
    }

    // Add recent student activities if available
    if (students && students.length > 0) {
      const recentStudents = students
        .filter(
          s => s.enrollmentDate && s.enrollmentDate !== 'Chưa có thông tin'
        )
        .sort((a, b) => new Date(b.enrollmentDate) - new Date(a.enrollmentDate))
        .slice(0, 1);

      recentStudents.forEach(student => {
        activities.push({
          type: 'student',
          message: `Học sinh mới: ${student.fullName} (${student.className})`,
          time: new Date(student.enrollmentDate).toLocaleDateString('vi-VN'),
          icon: '🎓',
        });
      });
    }

    // Add mock activities for features not yet available
    activities.push(
      {
        type: 'vaccination',
        message: 'Lịch tiêm chủng mới được thêm cho lớp 6A',
        time: '3 giờ trước',
        icon: '💉',
      },
      {
        type: 'system',
        message: 'Sao lưu dữ liệu hoàn tất thành công',
        time: '6 giờ trước',
        icon: '💾',
      }
    );

    return activities.slice(0, 4); // Return max 4 activities
  };

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
      {/* 
      Statistics Cards
      <div className="stats-section">
        <h2 className="section-title">Thống Kê Tổng Quan</h2>
        <div className="stats-grid">
          {studentsLoading || blogsLoading ? (
            <div className="loading-stats">
              <p>⏳ Đang tải thống kê...</p>
            </div>
          ) : (
            dashboardStats.map((stat, index) => (
              <div key={index} className={`stat-card ${stat.color}`}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-title">{stat.title}</div>
                  <div className="stat-description">{stat.description}</div>
                  <div className={`stat-change ${stat.changeType}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div> */}

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Thao Tác Nhanh</h2>
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
            {getRecentActivities().map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="system-status">
          <h3>Trạng Thái Hệ Thống</h3>
          <div className="status-list">
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Cơ sở dữ liệu</span>
              <span className="status-text">Hoạt động</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>API Services</span>
              <span className="status-text">Hoạt động</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Lưu trữ file</span>
              <span className="status-text">Hoạt động</span>
            </div>
            <div className="status-item">
              <div className="status-indicator warning"></div>
              <span>Email Service</span>
              <span className="status-text">Hạn chế</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
