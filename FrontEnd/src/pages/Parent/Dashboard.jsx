import React from "react";
import "../../css/Parent/Dashboard.css";

function ParentDashboard() {
  // Mock data
  const studentInfo = {
    name: "Nguyễn Minh Khôi",
    class: "5A",
    studentId: "HS001",
    school: "Trường Tiểu học Nguyễn Du",
  };

  const healthSummary = {
    lastCheckup: "2024-03-10",
    nextCheckup: "2024-06-10",
    vaccinationStatus: "Đầy đủ",
    healthStatus: "Khỏe mạnh",
  };

  const recentNotifications = [
    {
      id: 1,
      title: "Lịch tiêm vaccine mới",
      content: "Thông báo lịch tiêm vaccine sởi - rubella cho học sinh lớp 5",
      date: "2024-03-15",
      type: "vaccination",
    },
    {
      id: 2,
      title: "Kết quả khám sức khỏe định kỳ",
      content: "Kết quả khám sức khỏe của con em đã được cập nhật",
      date: "2024-03-12",
      type: "health",
    },
    {
      id: 3,
      title: "Sự kiện sức khỏe trường học",
      content: "Chương trình tập thể dục buổi sáng dành cho học sinh",
      date: "2024-03-08",
      type: "event",
    },
  ];

  const quickStats = [
    {
      title: "Tổng số lần khám",
      value: "12",
      icon: "🏥",
      color: "stat-health",
    },
    {
      title: "Vaccine đã tiêm",
      value: "8/8",
      icon: "💉",
      color: "stat-vaccine",
    },
    {
      title: "Thông báo mới",
      value: "3",
      icon: "🔔",
      color: "stat-notification",
    },
    {
      title: "Tin nhắn chưa đọc",
      value: "1",
      icon: "💬",
      color: "stat-message",
    },
  ];

  return (
    <div className="parent-dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Chào mừng, Phụ Huynh!</h1>
          <p>Theo dõi sức khỏe và thông tin học tập của con em</p>
        </div>
        <div className="header-date">
          <span>
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        {quickStats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="main-content-grid">
        {/* Student Information */}
        <div className="info-card">
          <div className="card-header">
            <h3>👦 Thông Tin Học Sinh</h3>
          </div>
          <div className="card-content">
            <div className="student-info">
              <div className="info-item">
                <label>Họ và tên:</label>
                <span>{studentInfo.name}</span>
              </div>
              <div className="info-item">
                <label>Lớp:</label>
                <span>{studentInfo.class}</span>
              </div>
              <div className="info-item">
                <label>Mã học sinh:</label>
                <span>{studentInfo.studentId}</span>
              </div>
              <div className="info-item">
                <label>Trường:</label>
                <span>{studentInfo.school}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Summary */}
        <div className="info-card">
          <div className="card-header">
            <h3>🏥 Tóm Tắt Sức Khỏe</h3>
          </div>
          <div className="card-content">
            <div className="health-summary">
              <div className="info-item">
                <label>Khám gần nhất:</label>
                <span>{healthSummary.lastCheckup}</span>
              </div>
              <div className="info-item">
                <label>Khám tiếp theo:</label>
                <span>{healthSummary.nextCheckup}</span>
              </div>
              <div className="info-item">
                <label>Tình trạng vaccine:</label>
                <span className="status-complete">
                  {healthSummary.vaccinationStatus}
                </span>
              </div>
              <div className="info-item">
                <label>Tình trạng sức khỏe:</label>
                <span className="status-healthy">
                  {healthSummary.healthStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="info-card notifications-card">
          <div className="card-header">
            <h3>🔔 Thông Báo Gần Đây</h3>
            <button className="view-all-btn">Xem tất cả</button>
          </div>
          <div className="card-content">
            <div className="notifications-list">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.type}`}
                >
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.content}</p>
                    <span className="notification-date">
                      {notification.date}
                    </span>
                  </div>
                  <div className="notification-action">
                    <button className="read-btn">Đọc</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>⚡ Thao Tác Nhanh</h3>
        <div className="actions-grid">
          <button className="action-btn health-btn">
            <span className="action-icon">📋</span>
            <span>Xem Hồ Sơ Sức Khỏe</span>
          </button>
          <button className="action-btn consultation-btn">
            <span className="action-icon">💬</span>
            <span>Đặt Lịch Tư Vấn</span>
          </button>
          <button className="action-btn chat-btn">
            <span className="action-icon">🗨️</span>
            <span>Chat Với Y Tá</span>
          </button>
          <button className="action-btn blog-btn">
            <span className="action-icon">📰</span>
            <span>Đọc Blog Sức Khỏe</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ParentDashboard;
