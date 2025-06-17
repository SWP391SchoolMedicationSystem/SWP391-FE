import React, { useState } from "react";
import "../../css/Parent/HealthHistory.css";

function HealthHistory() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("all");

  // Mock data cho lịch sử khám sức khỏe
  const healthRecords = [
    {
      id: 1,
      studentName: "Nguyễn Minh Khôi",
      studentId: "HS001",
      checkupDate: "2024-03-10",
      checkupType: "Khám định kỳ",
      doctor: "BS. Nguyễn Thị Lan",
      height: "135 cm",
      weight: "32 kg",
      bloodPressure: "100/60 mmHg",
      heartRate: "85 bpm",
      temperature: "36.5°C",
      generalHealth: "Khỏe mạnh",
      notes: "Học sinh phát triển bình thường, cần bổ sung vitamin D",
      recommendations: "Tăng cường vận động ngoài trời, uống đủ nước",
      status: "completed",
    },
    {
      id: 2,
      studentName: "Nguyễn Minh Khôi",
      studentId: "HS001",
      checkupDate: "2024-01-15",
      checkupType: "Khám bệnh",
      doctor: "BS. Phạm Văn Minh",
      height: "133 cm",
      weight: "30 kg",
      bloodPressure: "95/60 mmHg",
      heartRate: "90 bpm",
      temperature: "37.2°C",
      generalHealth: "Viêm họng nhẹ",
      notes: "Học sinh có dấu hiệu viêm họng, đã điều trị",
      recommendations: "Nghỉ ngơi 2-3 ngày, uống thuốc theo đơn",
      status: "completed",
    },
    {
      id: 3,
      studentName: "Nguyễn Minh Khôi",
      studentId: "HS001",
      checkupDate: "2023-12-20",
      checkupType: "Khám định kỳ",
      doctor: "BS. Lê Thị Hoa",
      height: "132 cm",
      weight: "29 kg",
      bloodPressure: "98/62 mmHg",
      heartRate: "88 bpm",
      temperature: "36.4°C",
      generalHealth: "Khỏe mạnh",
      notes: "Sức khỏe tốt, phát triển đúng độ tuổi",
      recommendations: "Duy trì chế độ ăn uống và sinh hoạt",
      status: "completed",
    },
    {
      id: 4,
      studentName: "Nguyễn Minh Khôi",
      studentId: "HS001",
      checkupDate: "2024-04-15",
      checkupType: "Khám định kỳ",
      doctor: "BS. Nguyễn Thị Lan",
      status: "scheduled",
    },
  ];

  const students = [
    { id: "all", name: "Tất cả con em" },
    { id: "HS001", name: "Nguyễn Minh Khôi" },
    // Có thể thêm nhiều con
  ];

  const filterTypes = [
    { id: "all", name: "Tất cả", icon: "📋" },
    { id: "completed", name: "Đã khám", icon: "✅" },
    { id: "scheduled", name: "Đã lên lịch", icon: "📅" },
  ];

  const filteredRecords = healthRecords.filter((record) => {
    const matchesFilter =
      selectedFilter === "all" || record.status === selectedFilter;
    const matchesStudent =
      selectedStudent === "all" || record.studentId === selectedStudent;
    return matchesFilter && matchesStudent;
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: "#e8f5e8",
      scheduled: "#fff3e0",
    };
    return colors[status] || "#f5f5f5";
  };

  const getStatusText = (status) => {
    const texts = {
      completed: "Đã hoàn thành",
      scheduled: "Đã lên lịch",
    };
    return texts[status] || status;
  };

  return (
    <div className="health-history-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>🏥 Lịch Sử Khám Sức Khỏe</h1>
          <p>Theo dõi lịch sử khám sức khỏe của con em</p>
        </div>
        <button className="export-btn">📊 Xuất báo cáo</button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Học sinh:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="filter-select"
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-buttons">
          {filterTypes.map((filter) => (
            <button
              key={filter.id}
              className={`filter-btn ${
                selectedFilter === filter.id ? "active" : ""
              }`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              <span className="filter-icon">{filter.icon}</span>
              <span>{filter.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>
              {healthRecords.filter((r) => r.status === "completed").length}
            </h3>
            <p>Lần khám đã hoàn thành</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>
              {healthRecords.filter((r) => r.status === "scheduled").length}
            </h3>
            <p>Lịch khám sắp tới</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>32kg</h3>
            <p>Cân nặng hiện tại</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📏</div>
          <div className="stat-content">
            <h3>135cm</h3>
            <p>Chiều cao hiện tại</p>
          </div>
        </div>
      </div>

      {/* Health Records List */}
      <div className="records-list">
        {filteredRecords.map((record) => (
          <div key={record.id} className="record-card">
            <div className="record-header">
              <div className="record-basic-info">
                <h3>{record.studentName}</h3>
                <span className="record-date">📅 {record.checkupDate}</span>
                <span className="record-type">{record.checkupType}</span>
              </div>
              <div
                className="record-status"
                style={{ backgroundColor: getStatusColor(record.status) }}
              >
                {getStatusText(record.status)}
              </div>
            </div>

            {record.status === "completed" && (
              <div className="record-details">
                <div className="record-doctor">
                  <strong>👨‍⚕️ Bác sĩ khám:</strong> {record.doctor}
                </div>

                <div className="health-metrics">
                  <div className="metric-group">
                    <div className="metric-item">
                      <label>Chiều cao:</label>
                      <span>{record.height}</span>
                    </div>
                    <div className="metric-item">
                      <label>Cân nặng:</label>
                      <span>{record.weight}</span>
                    </div>
                    <div className="metric-item">
                      <label>Huyết áp:</label>
                      <span>{record.bloodPressure}</span>
                    </div>
                    <div className="metric-item">
                      <label>Nhịp tim:</label>
                      <span>{record.heartRate}</span>
                    </div>
                    <div className="metric-item">
                      <label>Thân nhiệt:</label>
                      <span>{record.temperature}</span>
                    </div>
                  </div>
                </div>

                <div className="health-assessment">
                  <div className="assessment-item">
                    <label>Tình trạng sức khỏe tổng quát:</label>
                    <span
                      className={
                        record.generalHealth === "Khỏe mạnh"
                          ? "status-healthy"
                          : "status-warning"
                      }
                    >
                      {record.generalHealth}
                    </span>
                  </div>

                  <div className="assessment-item">
                    <label>Ghi chú:</label>
                    <p>{record.notes}</p>
                  </div>

                  <div className="assessment-item">
                    <label>Khuyến nghị:</label>
                    <p>{record.recommendations}</p>
                  </div>
                </div>
              </div>
            )}

            {record.status === "scheduled" && (
              <div className="scheduled-info">
                <p>📅 Lịch khám đã được lên lịch</p>
                <p>👨‍⚕️ Bác sĩ phụ trách: {record.doctor}</p>
                <div className="scheduled-actions">
                  <button className="remind-btn">🔔 Nhắc nhở</button>
                  <button className="reschedule-btn">📅 Đổi lịch</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="no-records">
          <p>Không có bản ghi nào phù hợp với bộ lọc đã chọn</p>
        </div>
      )}
    </div>
  );
}

export default HealthHistory;
