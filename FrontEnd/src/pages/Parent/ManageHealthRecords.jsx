import React, { useState } from "react";
import "../../css/Parent/ManageHealthRecords.css";

function ManageHealthRecords() {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data
  const healthRecords = [
    {
      id: 1,
      studentName: "Nguyễn Minh Khôi",
      recordType: "Tiền sử bệnh",
      title: "Dị ứng thức ăn",
      description: "Dị ứng với tôm cua và các loại hải sản",
      severity: "medium",
      date: "2024-01-15",
      status: "active",
      doctor: "BS. Nguyễn Thị Lan",
      medications: ["Thuốc chống dị ứng Cetirizine"],
      notes: "Tránh tiếp xúc với hải sản, luôn mang theo thuốc",
    },
    {
      id: 2,
      studentName: "Nguyễn Minh Khôi",
      recordType: "Bệnh mãn tính",
      title: "Hen suyễn nhẹ",
      description: "Hen suyễn do vận động mạnh",
      severity: "low",
      date: "2023-09-10",
      status: "monitoring",
      doctor: "BS. Phạm Văn Minh",
      medications: ["Bình xịt Ventolin"],
      notes: "Tránh vận động quá sức, nghỉ ngơi khi khó thở",
    },
    {
      id: 3,
      studentName: "Nguyễn Minh Khôi",
      recordType: "Thông tin sức khỏe",
      title: "Nhóm máu",
      description: "Nhóm máu O+",
      severity: "info",
      date: "2023-08-01",
      status: "active",
      doctor: "Y tá Lê Thị Hoa",
      medications: [],
      notes: "Thông tin nhóm máu cho trường hợp cấp cứu",
    },
  ];

  const recordTypes = [
    { id: "medical_history", name: "Tiền sử bệnh", icon: "📋" },
    { id: "chronic_disease", name: "Bệnh mãn tính", icon: "🏥" },
    { id: "allergy", name: "Dị ứng", icon: "⚠️" },
    { id: "medication", name: "Thuốc đang dùng", icon: "💊" },
    { id: "health_info", name: "Thông tin sức khỏe", icon: "📄" },
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      high: "#dc3545",
      medium: "#ffc107",
      low: "#28a745",
      info: "#17a2b8",
    };
    return colors[severity] || "#6c757d";
  };

  const getSeverityText = (severity) => {
    const texts = {
      high: "Cao",
      medium: "Trung bình",
      low: "Thấp",
      info: "Thông tin",
    };
    return texts[severity] || severity;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "#28a745",
      monitoring: "#ffc107",
      resolved: "#6c757d",
    };
    return colors[status] || "#6c757d";
  };

  const getStatusText = (status) => {
    const texts = {
      active: "Đang theo dõi",
      monitoring: "Cần giám sát",
      resolved: "Đã khỏi",
    };
    return texts[status] || status;
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  return (
    <div className="manage-health-records-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>📋 Quản Lý Hồ Sơ Sức Khỏe</h1>
          <p>Quản lý và theo dõi hồ sơ sức khỏe của con em</p>
        </div>
        <div className="header-actions">
          <button className="add-record-btn">➕ Thêm hồ sơ mới</button>
          <button className="export-btn">📊 Xuất báo cáo</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-cards">
        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{healthRecords.length}</h3>
            <p>Tổng số hồ sơ</p>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <h3>{healthRecords.filter((r) => r.status === "active").length}</h3>
            <p>Đang theo dõi</p>
          </div>
        </div>
        <div className="stat-card monitoring">
          <div className="stat-icon">🟡</div>
          <div className="stat-content">
            <h3>
              {healthRecords.filter((r) => r.status === "monitoring").length}
            </h3>
            <p>Cần giám sát</p>
          </div>
        </div>
        <div className="stat-card high-priority">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{healthRecords.filter((r) => r.severity === "high").length}</h3>
            <p>Mức độ cao</p>
          </div>
        </div>
      </div>

      {/* Record Types Filter */}
      <div className="filter-section">
        <h3>📂 Phân loại hồ sơ</h3>
        <div className="record-types">
          {recordTypes.map((type) => (
            <button key={type.id} className="type-btn">
              <span className="type-icon">{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Health Records List */}
      <div className="records-section">
        <h3>📋 Danh sách hồ sơ sức khỏe</h3>
        <div className="records-grid">
          {healthRecords.map((record) => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <div className="record-title">
                  <h4>{record.title}</h4>
                  <span className="record-type">{record.recordType}</span>
                </div>
                <div className="record-meta">
                  <span
                    className="severity-badge"
                    style={{
                      backgroundColor: getSeverityColor(record.severity),
                    }}
                  >
                    {getSeverityText(record.severity)}
                  </span>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(record.status) }}
                  >
                    {getStatusText(record.status)}
                  </span>
                </div>
              </div>

              <div className="record-content">
                <p className="record-description">{record.description}</p>

                <div className="record-details">
                  <div className="detail-item">
                    <span className="detail-label">📅 Ngày tạo:</span>
                    <span>{record.date}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">👨‍⚕️ Bác sĩ:</span>
                    <span>{record.doctor}</span>
                  </div>
                  {record.medications.length > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">💊 Thuốc:</span>
                      <span>{record.medications.join(", ")}</span>
                    </div>
                  )}
                </div>

                <div className="record-notes">
                  <strong>📝 Ghi chú:</strong>
                  <p>{record.notes}</p>
                </div>
              </div>

              <div className="record-actions">
                <button
                  className="view-btn"
                  onClick={() => handleViewRecord(record)}
                >
                  👁️ Xem chi tiết
                </button>
                <button className="edit-btn">✏️ Chỉnh sửa</button>
                <button className="share-btn">📤 Chia sẻ</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Health Information */}
      <div className="important-info">
        <h3>⚠️ Thông tin quan trọng</h3>
        <div className="info-grid">
          <div className="info-card emergency">
            <div className="info-header">
              <span className="info-icon">🚨</span>
              <h4>Thông tin cấp cứu</h4>
            </div>
            <div className="info-content">
              <p>
                <strong>Dị ứng:</strong> Hải sản (tôm, cua)
              </p>
              <p>
                <strong>Nhóm máu:</strong> O+
              </p>
              <p>
                <strong>Thuốc cần thiết:</strong> Cetirizine, Ventolin
              </p>
            </div>
          </div>
          <div className="info-card contact">
            <div className="info-header">
              <span className="info-icon">📞</span>
              <h4>Liên hệ khẩn cấp</h4>
            </div>
            <div className="info-content">
              <p>
                <strong>Phụ huynh:</strong> 0901-234-567
              </p>
              <p>
                <strong>Bác sĩ gia đình:</strong> 0912-345-678
              </p>
              <p>
                <strong>Y tế trường:</strong> 1900-1234
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* View Record Modal */}
      {showModal && selectedRecord && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📋 Chi tiết hồ sơ sức khỏe</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="record-detail">
                <div className="detail-section">
                  <h4>📄 Thông tin cơ bản</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Tiêu đề:</label>
                      <span>{selectedRecord.title}</span>
                    </div>
                    <div className="detail-item">
                      <label>Loại hồ sơ:</label>
                      <span>{selectedRecord.recordType}</span>
                    </div>
                    <div className="detail-item">
                      <label>Mức độ:</label>
                      <span
                        style={{
                          color: getSeverityColor(selectedRecord.severity),
                        }}
                      >
                        {getSeverityText(selectedRecord.severity)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Trạng thái:</label>
                      <span
                        style={{ color: getStatusColor(selectedRecord.status) }}
                      >
                        {getStatusText(selectedRecord.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>📝 Mô tả chi tiết</h4>
                  <p>{selectedRecord.description}</p>
                </div>

                {selectedRecord.medications.length > 0 && (
                  <div className="detail-section">
                    <h4>💊 Thuốc đang sử dụng</h4>
                    <ul>
                      {selectedRecord.medications.map((med, index) => (
                        <li key={index}>{med}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="detail-section">
                  <h4>📋 Ghi chú và hướng dẫn</h4>
                  <p>{selectedRecord.notes}</p>
                </div>

                <div className="detail-section">
                  <h4>👨‍⚕️ Thông tin y tế</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Ngày tạo:</label>
                      <span>{selectedRecord.date}</span>
                    </div>
                    <div className="detail-item">
                      <label>Bác sĩ phụ trách:</label>
                      <span>{selectedRecord.doctor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
              <button className="btn-primary">✏️ Chỉnh sửa</button>
              <button className="btn-success">📤 Chia sẻ với y tá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageHealthRecords;
