import React, { useState, useEffect } from "react";
import "../../css/Manager/Dashboard.css";

function Dashboard() {
  // Mock data for dashboard statistics
  const dashboardStats = {
    totalUsers: {
      value: 3782,
      change: "+11.01%",
      changeType: "positive",
    },
    activeManagers: {
      value: 45,
      change: "+6.08%",
      changeType: "positive",
    },
    formCategories: {
      value: 28,
      change: "+9.45%",
      changeType: "positive",
    },
    systemHealth: {
      value: "99.9%",
      change: "-0.05%",
      changeType: "negative",
    },
  };

  // Mock data for user growth trend (monthly)
  const userGrowthData = [
    { month: "Jan", managers: 8, nurses: 15, parents: 25 },
    { month: "Feb", managers: 10, nurses: 18, parents: 30 },
    { month: "Mar", managers: 12, nurses: 22, parents: 35 },
    { month: "Apr", managers: 15, nurses: 25, parents: 40 },
    { month: "May", managers: 18, nurses: 28, parents: 45 },
    { month: "Jun", managers: 20, nurses: 30, parents: 50 },
  ];

  // Mock data for system activity (daily)
  const systemActivityData = [
    { day: "Mon", activity: 450 },
    { day: "Tue", activity: 480 },
    { day: "Wed", activity: 420 },
    { day: "Thu", activity: 650 },
    { day: "Fri", activity: 580 },
    { day: "Sat", activity: 320 },
    { day: "Sun", activity: 380 },
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Bảng Điều Khiển Quản Trị</h1>
        <p className="dashboard-subtitle">
          Quản lý toàn bộ hệ thống y tế từ bảng điều khiển quản trị trung tâm
          này.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total-users">
          <div className="stat-header">
            <h3>Tổng Người Dùng</h3>
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {dashboardStats.totalUsers.value.toLocaleString()}
            </div>
            <div
              className={`stat-change ${dashboardStats.totalUsers.changeType}`}
            >
              {dashboardStats.totalUsers.change}
            </div>
          </div>
        </div>

        <div className="stat-card active-managers">
          <div className="stat-header">
            <h3>Quản Lý Hoạt Động</h3>
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {dashboardStats.activeManagers.value}
            </div>
            <div
              className={`stat-change ${dashboardStats.activeManagers.changeType}`}
            >
              {dashboardStats.activeManagers.change}
            </div>
          </div>
        </div>

        <div className="stat-card form-categories">
          <div className="stat-header">
            <h3>Danh Mục Biểu Mẫu</h3>
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {dashboardStats.formCategories.value}
            </div>
            <div
              className={`stat-change ${dashboardStats.formCategories.changeType}`}
            >
              {dashboardStats.formCategories.change}
            </div>
          </div>
        </div>

        <div className="stat-card system-health">
          <div className="stat-header">
            <h3>Tình Trạng Hệ Thống</h3>
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {dashboardStats.systemHealth.value}
            </div>
            <div
              className={`stat-change ${dashboardStats.systemHealth.changeType}`}
            >
              {dashboardStats.systemHealth.change}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container user-growth">
          <div className="chart-header">
            <h3>Xu Hướng Tăng Trưởng Người Dùng</h3>
            <p>Đăng ký người dùng hàng tháng theo từng vai trò</p>
          </div>
          <div className="chart-placeholder">
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color managers"></span>
                <span>Quản Lý</span>
              </div>
              <div className="legend-item">
                <span className="legend-color nurses"></span>
                <span>Y Tá</span>
              </div>
              <div className="legend-item">
                <span className="legend-color parents"></span>
                <span>Phụ Huynh</span>
              </div>
            </div>
            <div className="chart-data">
              {/* Placeholder for chart - will be replaced with actual chart later */}
              <div className="chart-bars">
                {userGrowthData.map((data, index) => (
                  <div key={index} className="chart-bar-group">
                    <div className="month-label">{data.month}</div>
                    <div className="bars">
                      <div
                        className="bar managers"
                        style={{ height: `${data.managers * 3}px` }}
                        title={`Managers: ${data.managers}`}
                      ></div>
                      <div
                        className="bar nurses"
                        style={{ height: `${data.nurses * 3}px` }}
                        title={`Nurses: ${data.nurses}`}
                      ></div>
                      <div
                        className="bar parents"
                        style={{ height: `${data.parents * 3}px` }}
                        title={`Parents: ${data.parents}`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="chart-container system-activity">
          <div className="chart-header">
            <h3>Tổng Quan Hoạt Động Hệ Thống</h3>
            <p>Sử dụng và hoạt động hệ thống hàng ngày</p>
          </div>
          <div className="chart-placeholder">
            <div className="activity-chart">
              {/* Placeholder for activity chart */}
              <div className="activity-data">
                {systemActivityData.map((data, index) => (
                  <div key={index} className="activity-point">
                    <div className="day-label">{data.day}</div>
                    <div
                      className="activity-bar"
                      style={{ height: `${data.activity / 10}px` }}
                      title={`${data.day}: ${data.activity} activities`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="dashboard-info">
        <div className="info-card recent-activities">
          <h4>Recent Activities</h4>
          <ul>
            <li>New user registration: John Doe (Parent) - 2 hours ago</li>
            <li>Form submitted: Medical History Update - 3 hours ago</li>
            <li>System backup completed successfully - 5 hours ago</li>
            <li>New appointment scheduled - 6 hours ago</li>
          </ul>
        </div>

        <div className="info-card system-status">
          <h4>System Status</h4>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>Database: Online</span>
          </div>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>API Services: Online</span>
          </div>
          <div className="status-item">
            <span className="status-indicator online"></span>
            <span>File Storage: Online</span>
          </div>
          <div className="status-item">
            <span className="status-indicator warning"></span>
            <span>Email Service: Limited</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
