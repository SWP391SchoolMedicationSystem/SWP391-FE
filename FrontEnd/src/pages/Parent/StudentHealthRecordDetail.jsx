import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../css/Parent/ManageHealthRecords.css";

const StudentHealthRecordDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [healthRecord, setHealthRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔍 StudentId from URL params:", studentId);
    console.log(
      "📋 Đang xem hồ sơ sức khỏe chi tiết của học sinh có ID:",
      studentId
    );
    fetchFullHealthRecord();
  }, [studentId]);

  const fetchFullHealthRecord = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiUrl = `https://api-schoolhealth.purintech.id.vn/api/HealthRecord/fullhealthrecordByStudentId?studentId=${studentId}`;
      console.log("🌐 API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 Raw full health record data:", data);

      setHealthRecord(data);
    } catch (err) {
      console.error("❌ Error fetching full health record:", err);
      setError("Không thể tải thông tin hồ sơ sức khỏe chi tiết");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    try {
      return new Date(dateString).toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    try {
      return new Date(dateString).toLocaleString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const handleGoBack = () => {
    navigate("/parent/health-records");
  };

  if (loading) {
    return (
      <div className="parent-health-records-container">
        <div className="loading-state">
          <p>⏳ Đang tải hồ sơ sức khỏe chi tiết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="parent-health-records-container">
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={fetchFullHealthRecord} className="retry-btn">
            🔄 Thử lại
          </button>
          <button onClick={handleGoBack} className="back-btn">
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  if (!healthRecord) {
    return (
      <div className="parent-health-records-container">
        <div className="error-state">
          <p>📭 Không tìm thấy hồ sơ sức khỏe</p>
          <button onClick={handleGoBack} className="back-btn">
            ← Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Đếm số lượng records
  const vaccinationCount = healthRecord.vaccinationRecords?.length || 0;
  const healthCheckCount = healthRecord.healthChecks?.length || 0;

  return (
    <div className="parent-health-records-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>🏥 Hồ Sơ Sức Khỏe Chi Tiết</h1>
          <p>
            Xem chi tiết hồ sơ sức khỏe của{" "}
            {healthRecord.studentName || `học sinh ID: ${studentId}`}
          </p>
        </div>
        <button onClick={handleGoBack} className="back-btn">
          ← Quay lại danh sách
        </button>
      </div>

      {/* Student Info Section */}
      <div className="student-detail-card">
        <div className="student-header">
          <div className="student-avatar">👤</div>
          <div className="student-main-info">
            <h2>{healthRecord.studentName || "Không có tên"}</h2>
            <p>
              <strong>StudentId:</strong> {studentId}
            </p>
            <p>
              <strong>Tiêu đề hồ sơ:</strong>{" "}
              {healthRecord.healthrecordtitle || "Không có tiêu đề"}
            </p>
          </div>
        </div>

        <div className="student-details-grid">
          <div className="detail-item">
            <label>Danh mục sức khỏe:</label>
            <span>{healthRecord.healthCategory || "Không có thông tin"}</span>
          </div>
          <div className="detail-item">
            <label>Ngày ghi nhận:</label>
            <span>{formatDate(healthRecord.healthRecordDate)}</span>
          </div>
          <div className="detail-item">
            <label>Nhân viên phụ trách:</label>
            <span>{healthRecord.staffName || "Không có thông tin"}</span>
          </div>
          <div className="detail-item">
            <label>Trạng thái xác nhận:</label>
            <span
              className={`status-badge ${
                healthRecord.isConfirm ? "confirmed" : "pending"
              }`}
            >
              {healthRecord.isConfirm ? "Đã xác nhận" : "Chờ xác nhận"}
            </span>
          </div>
        </div>

        {healthRecord.healthrecorddescription && (
          <div className="description-section">
            <h4>📝 Mô tả chi tiết:</h4>
            <p>{healthRecord.healthrecorddescription}</p>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">💉</div>
          <div className="stat-content">
            <h3>{vaccinationCount}</h3>
            <p>Lần tiêm chủng</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏥</div>
          <div className="stat-content">
            <h3>{healthCheckCount}</h3>
            <p>Lần khám sức khỏe</p>
          </div>
        </div>
      </div>

      {/* Vaccination History Section */}
      {vaccinationCount > 0 && (
        <div className="health-records-detail-section">
          <h3>💉 Lịch sử tiêm chủng ({vaccinationCount} lần tiêm)</h3>
          <div className="records-list">
            {healthRecord.vaccinationRecords.map((vaccination, index) => (
              <div key={index} className="record-item">
                <div className="record-header">
                  <div className="record-title">
                    <h4>
                      <span className="record-number">#{index + 1}</span>
                      {vaccination.vaccinename || "Vaccine không xác định"}
                    </h4>
                    <span className="vaccination-status completed">
                      Đã tiêm
                    </span>
                  </div>
                </div>

                <div className="record-content">
                  <p>
                    <strong>📅 Ngày tiêm:</strong>{" "}
                    {formatDate(vaccination.vaccinationdate)}
                  </p>
                  <p>
                    <strong>🏥 Nơi tiêm:</strong>{" "}
                    {vaccination.location || "Trường học"}
                  </p>
                  <p>
                    <strong>👨‍⚕️ Nhân viên thực hiện:</strong>{" "}
                    {vaccination.staff || "Không có thông tin"}
                  </p>
                  {vaccination.notes && (
                    <p>
                      <strong>📝 Ghi chú:</strong> {vaccination.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Check History Section */}
      {healthCheckCount > 0 && (
        <div className="health-records-detail-section">
          <h3>🏥 Lịch sử khám sức khỏe ({healthCheckCount} lần khám)</h3>
          <div className="records-list">
            {healthRecord.healthChecks.map((healthCheck, index) => (
              <div key={index} className="record-item">
                <div className="record-header">
                  <div className="record-title">
                    <h4>
                      <span className="record-number">#{index + 1}</span>
                      {healthCheck.title || "Khám sức khỏe"}
                    </h4>
                    <span className="record-type">
                      {healthCheck.type || "Khám định kỳ"}
                    </span>
                  </div>
                  <div className="record-meta">
                    <span className="record-date">
                      {formatDate(healthCheck.date)}
                    </span>
                  </div>
                </div>

                <div className="record-content">
                  <p>
                    <strong>📝 Mô tả:</strong>{" "}
                    {healthCheck.description || "Không có mô tả"}
                  </p>
                  <p>
                    <strong>👨‍⚕️ Bác sĩ khám:</strong>{" "}
                    {healthCheck.doctor || "Không có thông tin"}
                  </p>
                  {healthCheck.height && (
                    <p>
                      <strong>📏 Chiều cao:</strong> {healthCheck.height} cm
                    </p>
                  )}
                  {healthCheck.weight && (
                    <p>
                      <strong>⚖️ Cân nặng:</strong> {healthCheck.weight} kg
                    </p>
                  )}
                  {healthCheck.notes && (
                    <p>
                      <strong>📝 Ghi chú:</strong> {healthCheck.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {vaccinationCount === 0 && healthCheckCount === 0 && (
        <div className="empty-records">
          <p>📭 Chưa có lịch sử tiêm chủng và khám sức khỏe nào</p>
          <p>
            Thông tin sẽ được cập nhật khi con em thực hiện các hoạt động y tế
            tại trường
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentHealthRecordDetail;
