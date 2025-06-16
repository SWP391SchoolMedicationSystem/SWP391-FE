import React, { useState } from "react";
import "../../css/Nurse/MedicationSchedule.css";

function MedicationSchedule() {
  // Mock data for students with medication schedules
  const [students] = useState([
    {
      id: 1,
      studentId: "MN001",
      fullName: "Nguyễn Văn An",
      className: "Mầm",
      dateOfBirth: "2020-05-15",
      parentName: "Nguyễn Thị Hoa",
      parentPhone: "0912345678",
      condition: "Hen suyễn",
      medications: [
        {
          id: 1,
          name: "Ventolin",
          type: "Xịt định liều",
          dosage: "2 xịt",
          frequency: "Khi cần thiết",
          timesPerDay: "Khi khó thở",
          duration: "Dài hạn",
          notes: "Sử dụng khi khó thở hoặc trước khi vận động",
          startDate: "2024-01-15",
          endDate: null,
          reminders: ["08:00", "14:00", "Khi cần"],
        },
      ],
      lastReminder: "2024-03-20 08:00",
      nextReminder: "2024-03-20 14:00",
      status: "Đang điều trị",
    },
    {
      id: 2,
      studentId: "MN003",
      fullName: "Lê Minh Cường",
      className: "Lá 1",
      dateOfBirth: "2019-12-10",
      parentName: "Lê Thị Mai",
      parentPhone: "0934567890",
      condition: "Viêm amidan",
      medications: [
        {
          id: 2,
          name: "Amoxicillin",
          type: "Viên nang",
          dosage: "250mg",
          frequency: "3 lần/ngày",
          timesPerDay: "3",
          duration: "7 ngày",
          notes: "Uống sau bữa ăn, uống đủ liều theo chỉ định",
          startDate: "2024-03-18",
          endDate: "2024-03-25",
          reminders: ["08:00", "13:00", "18:00"],
        },
        {
          id: 3,
          name: "Paracetamol",
          type: "Siro",
          dosage: "5ml",
          frequency: "Khi cần",
          timesPerDay: "Khi sốt",
          duration: "Theo triệu chứng",
          notes: "Chỉ uống khi sốt trên 38.5°C",
          startDate: "2024-03-18",
          endDate: "2024-03-25",
          reminders: ["Khi sốt"],
        },
      ],
      lastReminder: "2024-03-20 13:00",
      nextReminder: "2024-03-20 18:00",
      status: "Đang điều trị",
    },
    {
      id: 3,
      studentId: "MN005",
      fullName: "Hoàng Văn Em",
      className: "Lá 3",
      dateOfBirth: "2019-07-30",
      parentName: "Hoàng Thị Lan",
      parentPhone: "0956789012",
      condition: "Dị ứng thức ăn",
      medications: [
        {
          id: 4,
          name: "Cetirizine",
          type: "Siro",
          dosage: "2.5ml",
          frequency: "1 lần/ngày",
          timesPerDay: "1",
          duration: "14 ngày",
          notes: "Uống vào buổi tối, tránh các thực phẩm gây dị ứng",
          startDate: "2024-03-15",
          endDate: "2024-03-29",
          reminders: ["19:00"],
        },
      ],
      lastReminder: "2024-03-19 19:00",
      nextReminder: "2024-03-20 19:00",
      status: "Đang điều trị",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Filter students
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition =
      filterCondition === "" || student.condition === filterCondition;
    return matchesSearch && matchesCondition;
  });

  // Get unique conditions for filter
  const conditions = [...new Set(students.map((s) => s.condition))];

  const handleViewDetail = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleSendReminder = (student) => {
    setSelectedStudent(student);
    setShowReminderModal(true);
  };

  const sendReminderToParent = () => {
    // Mock send reminder functionality
    alert(
      `Đã gửi nhắc nhở uống thuốc cho phụ huynh của ${selectedStudent.fullName} qua SMS/Zalo!`
    );
    setShowReminderModal(false);
    setSelectedStudent(null);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Đang điều trị":
        return "status-active";
      case "Hoàn thành":
        return "status-completed";
      case "Tạm dừng":
        return "status-paused";
      default:
        return "status-active";
    }
  };

  const isReminderDue = (nextReminder) => {
    const now = new Date();
    const reminderTime = new Date(nextReminder);
    return reminderTime <= now;
  };

  return (
    <div className="medication-container">
      <div className="medication-header">
        <h1>💊 Lịch Uống Thuốc</h1>
        <p>Quản lý lịch uống thuốc và gửi nhắc nhở cho phụ huynh</p>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{students.length}</h3>
            <p>Học sinh cần uống thuốc</p>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">💊</div>
          <div className="stat-content">
            <h3>
              {students.filter((s) => s.status === "Đang điều trị").length}
            </h3>
            <p>Đang điều trị</p>
          </div>
        </div>
        <div className="stat-card reminder">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3>
              {students.filter((s) => isReminderDue(s.nextReminder)).length}
            </h3>
            <p>Cần nhắc nhở</p>
          </div>
        </div>
        <div className="stat-card conditions">
          <div className="stat-icon">🏥</div>
          <div className="stat-content">
            <h3>{conditions.length}</h3>
            <p>Loại bệnh</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-container">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã học sinh, hoặc bệnh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="filter-select"
          >
            <option value="">Tất cả bệnh</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="medication-table">
          <thead>
            <tr>
              <th>Mã HS</th>
              <th>Họ tên</th>
              <th>Lớp</th>
              <th>Tình trạng bệnh</th>
              <th>Số loại thuốc</th>
              <th>Nhắc nhở tiếp theo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className={
                  isReminderDue(student.nextReminder) ? "reminder-due" : ""
                }
              >
                <td className="student-id">{student.studentId}</td>
                <td>
                  <div className="student-info">
                    <strong>{student.fullName}</strong>
                    <small>{student.parentName}</small>
                  </div>
                </td>
                <td className="class-name">{student.className}</td>
                <td>
                  <div className="condition-info">
                    <span className="condition-badge">{student.condition}</span>
                  </div>
                </td>
                <td className="medication-count">
                  <span className="count-badge">
                    {student.medications.length} loại
                  </span>
                </td>
                <td>
                  <div className="reminder-info">
                    <span
                      className={`reminder-time ${
                        isReminderDue(student.nextReminder) ? "overdue" : ""
                      }`}
                    >
                      {new Date(student.nextReminder).toLocaleString("vi-VN")}
                    </span>
                    {isReminderDue(student.nextReminder) && (
                      <span className="overdue-badge">Đến giờ!</span>
                    )}
                  </div>
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(student.status)}`}
                  >
                    {student.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-detail"
                      onClick={() => handleViewDetail(student)}
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                    <button
                      className={`btn-reminder ${
                        isReminderDue(student.nextReminder) ? "urgent" : ""
                      }`}
                      onClick={() => handleSendReminder(student)}
                      title="Gửi nhắc nhở"
                    >
                      🔔
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="no-data">
            <p>Không tìm thấy học sinh nào cần uống thuốc</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Chi tiết lịch uống thuốc - {selectedStudent.fullName}</h3>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="student-summary">
                <div className="summary-item">
                  <label>Mã học sinh:</label>
                  <span>{selectedStudent.studentId}</span>
                </div>
                <div className="summary-item">
                  <label>Lớp:</label>
                  <span>{selectedStudent.className}</span>
                </div>
                <div className="summary-item">
                  <label>Tình trạng bệnh:</label>
                  <span className="condition-badge">
                    {selectedStudent.condition}
                  </span>
                </div>
                <div className="summary-item">
                  <label>Phụ huynh:</label>
                  <span>
                    {selectedStudent.parentName} - {selectedStudent.parentPhone}
                  </span>
                </div>
              </div>

              <div className="medications-section">
                <h4>Danh sách thuốc ({selectedStudent.medications.length})</h4>
                {selectedStudent.medications.map((med) => (
                  <div key={med.id} className="medication-card">
                    <div className="med-header">
                      <h5>{med.name}</h5>
                      <span className="med-type">{med.type}</span>
                    </div>
                    <div className="med-details">
                      <div className="med-row">
                        <span className="med-label">Liều dùng:</span>
                        <span>{med.dosage}</span>
                      </div>
                      <div className="med-row">
                        <span className="med-label">Tần suất:</span>
                        <span>{med.frequency}</span>
                      </div>
                      <div className="med-row">
                        <span className="med-label">Thời gian uống:</span>
                        <span>{med.reminders.join(", ")}</span>
                      </div>
                      <div className="med-row">
                        <span className="med-label">Thời gian điều trị:</span>
                        <span>
                          {med.startDate} - {med.endDate || "Dài hạn"}
                        </span>
                      </div>
                      <div className="med-row">
                        <span className="med-label">Ghi chú:</span>
                        <span>{med.notes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && selectedStudent && (
        <div
          className="modal-overlay"
          onClick={() => setShowReminderModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Gửi nhắc nhở uống thuốc</h3>
              <button
                className="modal-close"
                onClick={() => setShowReminderModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="reminder-details">
                <p>
                  <strong>Học sinh:</strong> {selectedStudent.fullName}
                </p>
                <p>
                  <strong>Phụ huynh:</strong> {selectedStudent.parentName}
                </p>
                <p>
                  <strong>Số điện thoại:</strong> {selectedStudent.parentPhone}
                </p>
                <p>
                  <strong>Tình trạng bệnh:</strong> {selectedStudent.condition}
                </p>

                <div className="reminder-preview">
                  <h4>Nội dung nhắc nhở:</h4>
                  <div className="message-preview">
                    Xin chào {selectedStudent.parentName},
                    <br />
                    Đây là nhắc nhở uống thuốc cho con{" "}
                    {selectedStudent.fullName} (lớp {selectedStudent.className}
                    ).
                    <br />
                    Tình trạng: {selectedStudent.condition}
                    <br />
                    Các loại thuốc cần uống:
                    <ul>
                      {selectedStudent.medications.map((med, index) => (
                        <li key={index}>
                          {med.name} - {med.dosage} - {med.frequency}
                        </li>
                      ))}
                    </ul>
                    Vui lòng cho con uống thuốc đúng giờ.
                    <br />
                    Trân trọng!
                  </div>
                </div>

                <div className="reminder-actions">
                  <button
                    className="btn-send-sms"
                    onClick={sendReminderToParent}
                  >
                    📱 Gửi SMS
                  </button>
                  <button
                    className="btn-send-zalo"
                    onClick={sendReminderToParent}
                  >
                    💬 Gửi Zalo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicationSchedule;
