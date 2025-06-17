import { useNavigate } from "react-router-dom";
import "../../css/Manager/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // Enhanced dashboard statistics
  const dashboardStats = [
    {
      title: "Tổng Người Dùng",
      value: "3,782",
      change: "+11.01%",
      changeType: "positive",
      icon: "👥",
      color: "blue",
      description: "Tổng số người dùng trong hệ thống",
    },
    {
      title: "Học Sinh Đang Học",
      value: "2,456",
      change: "+8.2%",
      changeType: "positive",
      icon: "🎓",
      color: "green",
      description: "Số học sinh hiện tại",
    },
    {
      title: "Lịch Tiêm Hôm Nay",
      value: "24",
      change: "+15.3%",
      changeType: "positive",
      icon: "💉",
      color: "purple",
      description: "Lịch tiêm chủng hôm nay",
    },
    {
      title: "Tình Trạng Hệ Thống",
      value: "99.9%",
      change: "-0.05%",
      changeType: "negative",
      icon: "⚡",
      color: "orange",
      description: "Thời gian hoạt động hệ thống",
    },
  ];

  // Quick actions for easy navigation
  const quickActions = [
    {
      title: "Quản Lý Tài Khoản",
      description: "Thêm, sửa, xóa tài khoản người dùng",
      icon: "👤",
      color: "blue",
      path: "/manager/accounts",
    },
    {
      title: "Quản Lý Blog",
      description: "Tạo và quản lý bài viết blog",
      icon: "📝",
      color: "green",
      path: "/manager/blogs",
    },
    {
      title: "Danh Sách Tiêm Chủng",
      description: "Theo dõi lịch tiêm chủng học sinh",
      icon: "💉",
      color: "purple",
      path: "/manager/vaccinations",
    },
    {
      title: "Danh Sách Học Sinh",
      description: "Quản lý thông tin học sinh",
      icon: "🎓",
      color: "orange",
      path: "/manager/StudentList",
    },
  ];

  // Recent activities
  const recentActivities = [
    {
      type: "user",
      message: "Tài khoản mới được tạo: Nguyễn Văn A (Phụ huynh)",
      time: "2 giờ trước",
      icon: "👤",
    },
    {
      type: "vaccination",
      message: "Lịch tiêm chủng mới được thêm cho lớp 6A",
      time: "3 giờ trước",
      icon: "💉",
    },
    {
      type: "blog",
      message: "Bài viết mới: 'Hướng dẫn chăm sóc sức khỏe học sinh'",
      time: "5 giờ trước",
      icon: "📝",
    },
    {
      type: "system",
      message: "Sao lưu dữ liệu hoàn tất thành công",
      time: "6 giờ trước",
      icon: "💾",
    },
  ];

  const handleQuickAction = (path) => {
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
            {new Date().toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-section">
        <h2 className="section-title">Thống Kê Tổng Quan</h2>
        <div className="stats-grid">
          {dashboardStats.map((stat, index) => (
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
          ))}
        </div>
      </div>

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
            {recentActivities.map((activity, index) => (
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
