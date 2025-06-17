import React, { useState } from "react";
import "../../css/Parent/Consultation.css";

function Consultation() {
  const [showForm, setShowForm] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  // Mock data
  const consultationRequests = [
    {
      id: 1,
      studentName: "Nguyễn Minh Khôi",
      requestDate: "2024-03-15",
      appointmentDate: "2024-03-20",
      appointmentTime: "14:00",
      concern: "Đau bụng thường xuyên",
      description:
        "Con em thường xuyên đau bụng sau khi ăn, đặc biệt là vào buổi chiều. Muốn được bác sĩ tư vấn về chế độ ăn uống.",
      doctor: "BS. Nguyễn Thị Lan",
      status: "scheduled",
      priority: "medium",
    },
    {
      id: 2,
      studentName: "Nguyễn Minh Khôi",
      requestDate: "2024-03-10",
      appointmentDate: "2024-03-12",
      appointmentTime: "10:30",
      concern: "Kiểm tra sức khỏe tổng quát",
      description:
        "Muốn kiểm tra sức khỏe tổng quát cho con trước khi tham gia hoạt động thể thao.",
      doctor: "BS. Phạm Văn Minh",
      status: "completed",
      priority: "low",
      result: "Sức khỏe tốt, có thể tham gia hoạt động thể thao bình thường",
    },
  ];

  const [formData, setFormData] = useState({
    studentName: "Nguyễn Minh Khôi",
    concern: "",
    description: "",
    urgency: "medium",
    preferredDate: "",
    preferredTime: "",
    contactMethod: "phone",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting consultation request:", formData);
    setShowForm(false);
    // Reset form
    setFormData({
      studentName: "Nguyễn Minh Khôi",
      concern: "",
      description: "",
      urgency: "medium",
      preferredDate: "",
      preferredTime: "",
      contactMethod: "phone",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#ffc107",
      scheduled: "#17a2b8",
      completed: "#28a745",
      cancelled: "#dc3545",
    };
    return colors[status] || "#6c757d";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Đang chờ xử lý",
      scheduled: "Đã lên lịch",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return texts[status] || status;
  };

  const getPriorityText = (priority) => {
    const texts = {
      high: "Khẩn cấp",
      medium: "Bình thường",
      low: "Không gấp",
    };
    return texts[priority] || priority;
  };

  return (
    <div className="consultation-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>💬 Tư Vấn Y Tế Riêng Tư</h1>
          <p>Đặt lịch tư vấn riêng với bác sĩ trường</p>
        </div>
        <button className="new-request-btn" onClick={() => setShowForm(true)}>
          ➕ Gửi yêu cầu mới
        </button>
      </div>

      {/* Quick Info */}
      <div className="info-cards">
        <div className="info-card">
          <div className="info-icon">⏰</div>
          <div className="info-content">
            <h3>Thời gian làm việc</h3>
            <p>Thứ 2 - Thứ 6: 8:00 - 17:00</p>
            <p>Thứ 7: 8:00 - 12:00</p>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">📞</div>
          <div className="info-content">
            <h3>Liên hệ khẩn cấp</h3>
            <p>Hotline: 1900-1234</p>
            <p>Email: yte@truong.edu.vn</p>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">👨‍⚕️</div>
          <div className="info-content">
            <h3>Đội ngũ bác sĩ</h3>
            <p>3 bác sĩ chuyên khoa</p>
            <p>2 y tá điều dưỡng</p>
          </div>
        </div>
      </div>

      {/* Consultation Requests List */}
      <div className="requests-section">
        <h3>📋 Lịch sử yêu cầu tư vấn</h3>
        <div className="requests-list">
          {consultationRequests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-info">
                  <h4>{request.concern}</h4>
                  <span className="request-student">
                    👦 {request.studentName}
                  </span>
                </div>
                <div className="request-meta">
                  <span
                    className="request-status"
                    style={{ backgroundColor: getStatusColor(request.status) }}
                  >
                    {getStatusText(request.status)}
                  </span>
                  <span className="request-priority">
                    🔹 {getPriorityText(request.priority)}
                  </span>
                </div>
              </div>

              <div className="request-content">
                <p>
                  <strong>Mô tả:</strong> {request.description}
                </p>
                <div className="request-details">
                  <span>📅 Ngày gửi: {request.requestDate}</span>
                  {request.appointmentDate && (
                    <span>
                      🗓️ Lịch hẹn: {request.appointmentDate} -{" "}
                      {request.appointmentTime}
                    </span>
                  )}
                  <span>👨‍⚕️ Bác sĩ: {request.doctor}</span>
                </div>
                {request.result && (
                  <div className="request-result">
                    <strong>Kết quả tư vấn:</strong>
                    <p>{request.result}</p>
                  </div>
                )}
              </div>

              <div className="request-actions">
                <button
                  className="view-detail-btn"
                  onClick={() => setSelectedConsultation(request)}
                >
                  👁️ Xem chi tiết
                </button>
                {request.status === "scheduled" && (
                  <>
                    <button className="reschedule-btn">📅 Đổi lịch</button>
                    <button className="cancel-btn">❌ Hủy</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Request Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📝 Gửi yêu cầu tư vấn mới</h3>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="consultation-form">
              <div className="form-group">
                <label>Học sinh</label>
                <select
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  required
                >
                  <option value="Nguyễn Minh Khôi">Nguyễn Minh Khôi</option>
                </select>
              </div>

              <div className="form-group">
                <label>Vấn đề quan tâm *</label>
                <input
                  type="text"
                  value={formData.concern}
                  onChange={(e) =>
                    setFormData({ ...formData, concern: e.target.value })
                  }
                  placeholder="Ví dụ: Đau bụng, kiểm tra sức khỏe..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả chi tiết *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết về triệu chứng, thời gian xuất hiện..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mức độ khẩn cấp</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) =>
                      setFormData({ ...formData, urgency: e.target.value })
                    }
                  >
                    <option value="low">Không gấp</option>
                    <option value="medium">Bình thường</option>
                    <option value="high">Khẩn cấp</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phương thức liên hệ</label>
                  <select
                    value={formData.contactMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactMethod: e.target.value,
                      })
                    }
                  >
                    <option value="phone">Điện thoại</option>
                    <option value="email">Email</option>
                    <option value="inperson">Gặp trực tiếp</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ngày mong muốn</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredDate: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Giờ mong muốn</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferredTime: e.target.value,
                      })
                    }
                  >
                    <option value="">Chọn giờ</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  ✅ Gửi yêu cầu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Consultation;
