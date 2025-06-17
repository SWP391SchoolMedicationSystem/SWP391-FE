import React, { useState } from "react";
import "../../css/Parent/ManageHealthRecords.css";

function ManageHealthRecords() {
  const [selectedChild, setSelectedChild] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock data - Danh sách con em của phụ huynh đăng nhập
  const myChildren = [
    {
      id: 1,
      name: "Nguyễn Minh An",
      studentCode: "MN001",
      dateOfBirth: "2020-05-15",
      gender: "Nam",
      className: "Lớp Mầm",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      healthStatus: "Bình thường",
      avatar: "👶",
      healthRecords: [
        {
          id: 1,
          type: "Dị ứng",
          title: "Dị ứng sữa bò",
          description: "Dị ứng với protein sữa bò, gây nôn và tiêu chảy",
          severity: "Trung bình",
          date: "2024-01-15",
          doctor: "BS. Nguyễn Thị Lan",
          medications: ["Sữa không lactose"],
          notes: "Cho uống sữa đặc biệt, không cho sữa bò thường",
          status: "Đang theo dõi",
        },
        {
          id: 2,
          type: "Khám định kỳ",
          title: "Tiêm chủng định kỳ",
          description: "Tiêm vaccine phòng bệnh theo lịch",
          severity: "Bình thường",
          date: "2024-03-10",
          doctor: "BS. Phạm Văn Minh",
          medications: [],
          notes: "Đã tiêm đủ vaccine theo độ tuổi",
          status: "Hoàn thành",
        },
      ],
    },
    {
      id: 2,
      name: "Nguyễn Thị Bé",
      studentCode: "MN008",
      dateOfBirth: "2019-08-22",
      gender: "Nữ",
      className: "Lớp Chồi",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      healthStatus: "Tốt",
      avatar: "👧",
      healthRecords: [
        {
          id: 3,
          type: "Khám định kỳ",
          title: "Kiểm tra sức khỏe tổng quát",
          description: "Khám sức khỏe định kỳ cho trẻ mầm non",
          severity: "Bình thường",
          date: "2024-02-20",
          doctor: "BS. Lê Thị Mai",
          medications: [],
          notes: "Sức khỏe tốt, phát triển bình thường",
          status: "Hoàn thành",
        },
      ],
    },
  ];

  const getHealthStatusColor = (status) => {
    const colors = {
      Tốt: "#28a745",
      "Bình thường": "#17a2b8",
      "Cần chú ý": "#ffc107",
      "Nghiêm trọng": "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  const getSeverityColor = (severity) => {
    const colors = {
      Nhẹ: "#28a745",
      "Trung bình": "#ffc107",
      Nặng: "#dc3545",
      "Bình thường": "#17a2b8",
    };
    return colors[severity] || "#6c757d";
  };

  const handleViewChild = (child) => {
    setSelectedChild(child);
    setShowDetailModal(true);
  };

  const totalRecords = myChildren.reduce(
    (sum, child) => sum + child.healthRecords.length,
    0
  );

  return (
    <div className="parent-health-records-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>👨‍👩‍👧‍👦 Hồ Sơ Sức Khỏe Con Em</h1>
          <p>Theo dõi tình trạng sức khỏe và hồ sơ y tế của con em</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-cards">
        <div className="stat-card total">
          <div className="stat-icon">👶</div>
          <div className="stat-content">
            <h3>{myChildren.length}</h3>
            <p>Số con em</p>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{totalRecords}</h3>
            <p>Tổng hồ sơ y tế</p>
          </div>
        </div>
        <div className="stat-card monitoring">
          <div className="stat-icon">💚</div>
          <div className="stat-content">
            <h3>
              {
                myChildren.filter((child) => child.healthStatus === "Tốt")
                  .length
              }
            </h3>
            <p>Sức khỏe tốt</p>
          </div>
        </div>
        <div className="stat-card high-priority">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>
              {
                myChildren.filter((child) => child.healthStatus === "Cần chú ý")
                  .length
              }
            </h3>
            <p>Cần chú ý</p>
          </div>
        </div>
      </div>

      {/* Children List */}
      <div className="children-section">
        <div className="section-header">
          <h3>👨‍👩‍👧‍👦 Danh sách con em</h3>
        </div>

        <div className="children-grid">
          {myChildren.map((child) => (
            <div key={child.id} className="child-card">
              <div className="child-header">
                <div className="child-avatar">{child.avatar}</div>
                <div className="child-info">
                  <h4>{child.name}</h4>
                  <p className="child-code">{child.studentCode}</p>
                  <p className="child-birth">Sinh: {child.dateOfBirth}</p>
                  <p className="child-class">🏫 {child.className}</p>
                </div>
                <div className="child-status">
                  <span
                    className="health-badge"
                    style={{
                      backgroundColor: getHealthStatusColor(child.healthStatus),
                    }}
                  >
                    {child.healthStatus}
                  </span>
                </div>
              </div>

              <div className="child-details">
                <div className="detail-row">
                  <span className="detail-label">⚧️ Giới tính:</span>
                  <span>{child.gender}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📋 Hồ sơ y tế:</span>
                  <span>{child.healthRecords.length} bản ghi</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📅 Cập nhật gần nhất:</span>
                  <span>
                    {child.healthRecords.length > 0
                      ? child.healthRecords[child.healthRecords.length - 1].date
                      : "Chưa có"}
                  </span>
                </div>
              </div>

              <div className="child-actions">
                <button
                  className="view-btn"
                  onClick={() => handleViewChild(child)}
                >
                  👁️ Xem hồ sơ chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Child Detail Modal */}
      {showDetailModal && selectedChild && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>📋 Hồ sơ sức khỏe - {selectedChild.name}</h3>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Child Info */}
              <div className="child-info-section">
                <div className="info-grid">
                  <div className="info-item">
                    <label>👤 Họ và tên:</label>
                    <span>{selectedChild.name}</span>
                  </div>
                  <div className="info-item">
                    <label>🏷️ Mã học sinh:</label>
                    <span>{selectedChild.studentCode}</span>
                  </div>
                  <div className="info-item">
                    <label>🎂 Ngày sinh:</label>
                    <span>{selectedChild.dateOfBirth}</span>
                  </div>
                  <div className="info-item">
                    <label>⚧️ Giới tính:</label>
                    <span>{selectedChild.gender}</span>
                  </div>
                  <div className="info-item">
                    <label>🏫 Lớp học:</label>
                    <span>{selectedChild.className}</span>
                  </div>
                  <div className="info-item">
                    <label>🏠 Địa chỉ:</label>
                    <span>{selectedChild.address}</span>
                  </div>
                  <div className="info-item">
                    <label>💚 Tình trạng sức khỏe:</label>
                    <span
                      className="health-badge"
                      style={{
                        backgroundColor: getHealthStatusColor(
                          selectedChild.healthStatus
                        ),
                      }}
                    >
                      {selectedChild.healthStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Health Records */}
              <div className="health-records-section">
                <h4>📋 Hồ sơ y tế</h4>

                {selectedChild.healthRecords.length > 0 ? (
                  <div className="records-list">
                    {selectedChild.healthRecords.map((record) => (
                      <div key={record.id} className="record-item">
                        <div className="record-header">
                          <div className="record-title">
                            <h5>{record.title}</h5>
                            <span className="record-type">{record.type}</span>
                          </div>
                          <div className="record-meta">
                            <span
                              className="severity-badge"
                              style={{
                                backgroundColor: getSeverityColor(
                                  record.severity
                                ),
                              }}
                            >
                              {record.severity}
                            </span>
                            <span className="record-date">{record.date}</span>
                          </div>
                        </div>

                        <div className="record-content">
                          <p>
                            <strong>Mô tả:</strong> {record.description}
                          </p>
                          <p>
                            <strong>Bác sĩ:</strong> {record.doctor}
                          </p>
                          {record.medications.length > 0 && (
                            <p>
                              <strong>Thuốc:</strong>{" "}
                              {record.medications.join(", ")}
                            </p>
                          )}
                          <p>
                            <strong>Ghi chú:</strong> {record.notes}
                          </p>
                          <p>
                            <strong>Trạng thái:</strong> {record.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-records">
                    <p>Chưa có hồ sơ y tế nào</p>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="contact-section">
                <h4>📞 Liên hệ y tá trường</h4>
                <div className="contact-info">
                  <p>
                    <strong>📱 Hotline:</strong> 1900 1234
                  </p>
                  <p>
                    <strong>📧 Email:</strong> nurse@school.edu.vn
                  </p>
                  <p>
                    <strong>🕐 Giờ làm việc:</strong> 7:00 - 17:00 (Thứ 2 - Thứ
                    6)
                  </p>
                  <p className="note">
                    💡{" "}
                    <em>
                      Vui lòng liên hệ y tá trường nếu có thắc mắc về sức khỏe
                      của con em
                    </em>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageHealthRecords;
