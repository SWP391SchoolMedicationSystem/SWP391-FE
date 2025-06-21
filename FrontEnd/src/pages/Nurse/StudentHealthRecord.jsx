import React, { useState } from "react";
import "../../css/Nurse/StudentHealthRecord.css";

function StudentHealthRecord() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Mock data - Danh sách lớp và học sinh
  const classesData = [
    {
      id: "mam",
      name: "Lớp Mầm",
      students: [
        {
          id: 1,
          name: "Nguyễn Minh An",
          studentCode: "MN001",
          dateOfBirth: "2020-05-15",
          gender: "Nam",
          address: "123 Đường ABC, Quận 1, TP.HCM",
          parentName: "Nguyễn Văn A",
          parentPhone: "0901234567",
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
          name: "Trần Thị Bé",
          studentCode: "MN002",
          dateOfBirth: "2020-08-22",
          gender: "Nữ",
          address: "456 Đường DEF, Quận 3, TP.HCM",
          parentName: "Trần Văn B",
          parentPhone: "0907654321",
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
        {
          id: 3,
          name: "Lê Văn Bình",
          studentCode: "MN003",
          dateOfBirth: "2020-12-03",
          gender: "Nam",
          address: "789 Đường GHI, Quận 7, TP.HCM",
          parentName: "Lê Thị C",
          parentPhone: "0912345678",
          healthStatus: "Cần chú ý",
          avatar: "👦",
          healthRecords: [
            {
              id: 4,
              type: "Vấn đề phát triển",
              title: "Chậm nói",
              description: "Chậm phát triển ngôn ngữ so với độ tuổi",
              severity: "Trung bình",
              date: "2024-02-20",
              doctor: "BS. Nguyễn Văn Đức",
              medications: [],
              notes: "Cần tham gia các hoạt động kích thích ngôn ngữ",
              status: "Đang theo dõi",
            },
          ],
        },
      ],
    },
    {
      id: "choi",
      name: "Lớp Chồi",
      students: [
        {
          id: 4,
          name: "Phạm Thị Lan",
          studentCode: "MN004",
          dateOfBirth: "2019-04-18",
          gender: "Nữ",
          address: "321 Đường JKL, Quận 5, TP.HCM",
          parentName: "Phạm Văn D",
          parentPhone: "0923456789",
          healthStatus: "Bình thường",
          avatar: "👧",
          healthRecords: [],
        },
        {
          id: 5,
          name: "Hoàng Văn Tùng",
          studentCode: "MN005",
          dateOfBirth: "2019-07-09",
          gender: "Nam",
          address: "654 Đường MNO, Quận 10, TP.HCM",
          parentName: "Hoàng Thị E",
          parentPhone: "0934567890",
          healthStatus: "Tốt",
          avatar: "👦",
          healthRecords: [
            {
              id: 5,
              type: "Dị ứng",
              title: "Dị ứng phấn hoa",
              description:
                "Dị ứng phấn hoa vào mùa xuân, gây hắt hơi và chảy nước mũi",
              severity: "Nhẹ",
              date: "2024-03-05",
              doctor: "BS. Võ Thị Hạnh",
              medications: ["Thuốc chống dị ứng cho trẻ em"],
              notes: "Tránh ra ngoài khi có gió lớn, đeo khẩu trang",
              status: "Đang theo dõi",
            },
          ],
        },
      ],
    },
    {
      id: "la",
      name: "Lớp Lá",
      students: [
        {
          id: 6,
          name: "Đỗ Thị Mai",
          studentCode: "MN006",
          dateOfBirth: "2018-11-15",
          gender: "Nữ",
          address: "987 Đường PQR, Quận 2, TP.HCM",
          parentName: "Đỗ Văn F",
          parentPhone: "0945678901",
          healthStatus: "Tốt",
          avatar: "👧",
          healthRecords: [
            {
              id: 6,
              type: "Khám định kỳ",
              title: "Khám sức khỏe trước khi vào lớp 1",
              description: "Kiểm tra sức khỏe tổng quát chuẩn bị vào tiểu học",
              severity: "Bình thường",
              date: "2024-03-15",
              doctor: "BS. Trần Văn Hùng",
              medications: [],
              notes: "Đã sẵn sàng cho bậc tiểu học",
              status: "Hoàn thành",
            },
          ],
        },
        {
          id: 7,
          name: "Vũ Minh Quân",
          studentCode: "MN007",
          dateOfBirth: "2018-06-20",
          gender: "Nam",
          address: "147 Đường STU, Quận 4, TP.HCM",
          parentName: "Vũ Thị G",
          parentPhone: "0956789012",
          healthStatus: "Cần chú ý",
          avatar: "👦",
          healthRecords: [
            {
              id: 7,
              type: "Vấn đề hành vi",
              title: "Tăng động giảm chú ý",
              description: "Khó tập trung, hiếu động quá mức",
              severity: "Trung bình",
              date: "2024-01-20",
              doctor: "BS. Lê Thị Hương",
              medications: [],
              notes: "Cần môi trường học tập phù hợp, giảm kích thích",
              status: "Đang theo dõi",
            },
          ],
        },
      ],
    },
  ];

  const allClasses = classesData;
  const selectedClassData = allClasses.find((cls) => cls.id === selectedClass);
  const students = selectedClass
    ? selectedClassData
      ? selectedClassData.students
      : []
    : allClasses.flatMap((cls) => cls.students);

  // Function to get class name for a student
  const getStudentClassName = (studentId) => {
    for (const cls of allClasses) {
      if (cls.students.find((s) => s.id === studentId)) {
        return cls.name;
      }
    }
    return "";
  };

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

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleEditRecord = (record) => {
    setEditingRecord(record);
    setShowEditModal(true);
  };

  const handleAddRecord = () => {
    setEditingRecord({
      id: Date.now(),
      type: "",
      title: "",
      description: "",
      severity: "Nhẹ",
      date: new Date().toISOString().split("T")[0],
      doctor: "",
      medications: [],
      notes: "",
      status: "Đang theo dõi",
    });
    setShowEditModal(true);
  };

  const handleSaveRecord = (recordData) => {
    // TODO: Call API to save record
    setShowEditModal(false);
    setEditingRecord(null);
  };

  const totalStudents = allClasses.reduce(
    (sum, cls) => sum + cls.students.length,
    0
  );
  const studentsWithRecords = allClasses.reduce(
    (sum, cls) =>
      sum + cls.students.filter((s) => s.healthRecords.length > 0).length,
    0
  );

  return (
    <div className="manage-health-records-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>📋 Hồ Sơ Sức Khỏe Học Sinh</h1>
          <p>Quản lý và theo dõi hồ sơ sức khỏe của các học sinh theo lớp</p>
        </div>
        <div className="header-actions">
          <button className="export-btn">📊 Xuất báo cáo</button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-cards">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{totalStudents}</h3>
            <p>Tổng số học sinh</p>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{studentsWithRecords}</h3>
            <p>Có hồ sơ sức khỏe</p>
          </div>
        </div>
        <div className="stat-card monitoring">
          <div className="stat-icon">🏥</div>
          <div className="stat-content">
            <h3>{allClasses.length}</h3>
            <p>Số lớp học</p>
          </div>
        </div>
        <div className="stat-card high-priority">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>
              {allClasses.reduce(
                (sum, cls) =>
                  sum +
                  cls.students.filter((s) => s.healthStatus === "Cần chú ý")
                    .length,
                0
              )}
            </h3>
            <p>Cần chú ý</p>
          </div>
        </div>
      </div>

      {/* Class Filter */}
      <div className="filter-section">
        <h3>📚 Chọn lớp học</h3>
        <div className="class-buttons">
          <button
            className={`class-btn ${selectedClass === "" ? "active" : ""}`}
            onClick={() => setSelectedClass("")}
          >
            <span className="class-icon">📖</span>
            <span>Tất cả lớp</span>
          </button>
          {allClasses.map((cls) => (
            <button
              key={cls.id}
              className={`class-btn ${
                selectedClass === cls.id ? "active" : ""
              }`}
              onClick={() => setSelectedClass(cls.id)}
            >
              <span className="class-icon">🎒</span>
              <span>{cls.name}</span>
              <span className="student-count">({cls.students.length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Students List */}
      <div className="students-section">
        <div className="section-header">
          <h3>
            👨‍🎓 Danh sách học sinh{" "}
            {selectedClassData ? `- ${selectedClassData.name}` : ""}
          </h3>
          {selectedStudent && (
            <button className="add-record-btn" onClick={handleAddRecord}>
              ➕ Thêm hồ sơ mới
            </button>
          )}
        </div>

        <div className="students-grid">
          {students.map((student) => (
            <div key={student.id} className="student-card">
              <div className="student-header">
                <div className="student-avatar">{student.avatar}</div>
                <div className="student-info">
                  <h4>{student.name}</h4>
                  <p className="student-code">{student.studentCode}</p>
                  <p className="student-birth">Sinh: {student.dateOfBirth}</p>
                  {!selectedClass && (
                    <p className="student-class">
                      🏫 {getStudentClassName(student.id)}
                    </p>
                  )}
                </div>
                <div className="student-status">
                  <span
                    className="health-badge"
                    style={{
                      backgroundColor: getHealthStatusColor(
                        student.healthStatus
                      ),
                    }}
                  >
                    {student.healthStatus}
                  </span>
                </div>
              </div>

              <div className="student-details">
                <div className="detail-row">
                  <span className="detail-label">👨‍👩‍👧‍👦 Phụ huynh:</span>
                  <span>{student.parentName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📞 Số điện thoại:</span>
                  <span>{student.parentPhone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📋 Hồ sơ:</span>
                  <span>{student.healthRecords.length} bản ghi</span>
                </div>
              </div>

              <div className="student-actions">
                <button
                  className="view-btn"
                  onClick={() => handleViewStudent(student)}
                >
                  👁️ Xem hồ sơ
                </button>
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="no-data">
            <p>
              {selectedClass
                ? `Không có học sinh nào trong ${selectedClassData?.name}`
                : "Vui lòng chọn lớp để xem danh sách học sinh"}
            </p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>📋 Hồ sơ sức khỏe - {selectedStudent.name}</h3>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Student Info */}
              <div className="student-info-section">
                <div className="info-grid">
                  <div className="info-item">
                    <label>👤 Họ và tên:</label>
                    <span>{selectedStudent.name}</span>
                  </div>
                  <div className="info-item">
                    <label>🏷️ Mã học sinh:</label>
                    <span>{selectedStudent.studentCode}</span>
                  </div>
                  <div className="info-item">
                    <label>🎂 Ngày sinh:</label>
                    <span>{selectedStudent.dateOfBirth}</span>
                  </div>
                  <div className="info-item">
                    <label>⚧️ Giới tính:</label>
                    <span>{selectedStudent.gender}</span>
                  </div>
                  <div className="info-item">
                    <label>🏠 Địa chỉ:</label>
                    <span>{selectedStudent.address}</span>
                  </div>
                  <div className="info-item">
                    <label>👨‍👩‍👧‍👦 Phụ huynh:</label>
                    <span>{selectedStudent.parentName}</span>
                  </div>
                  <div className="info-item">
                    <label>📞 Số điện thoại:</label>
                    <span>{selectedStudent.parentPhone}</span>
                  </div>
                  <div className="info-item">
                    <label>💚 Tình trạng sức khỏe:</label>
                    <span
                      className="health-badge"
                      style={{
                        backgroundColor: getHealthStatusColor(
                          selectedStudent.healthStatus
                        ),
                      }}
                    >
                      {selectedStudent.healthStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Health Records */}
              <div className="health-records-section">
                <div className="section-header">
                  <h4>📋 Hồ sơ y tế</h4>
                  <button className="add-record-btn" onClick={handleAddRecord}>
                    ➕ Thêm hồ sơ mới
                  </button>
                </div>

                {selectedStudent.healthRecords.length > 0 ? (
                  <div className="records-list">
                    {selectedStudent.healthRecords.map((record) => (
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
                            <button
                              className="edit-btn"
                              onClick={() => handleEditRecord(record)}
                            >
                              ✏️ Sửa
                            </button>
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
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditModal && editingRecord && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                {editingRecord.id === Date.now() || !editingRecord.title
                  ? "➕ Thêm hồ sơ mới"
                  : "✏️ Sửa hồ sơ"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveRecord(editingRecord);
                }}
              >
                <div className="form-grid">
                  <div className="form-group">
                    <label>Loại hồ sơ</label>
                    <select
                      value={editingRecord.type}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          type: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Chọn loại</option>
                      <option value="Khám định kỳ">Khám định kỳ</option>
                      <option value="Dị ứng">Dị ứng</option>
                      <option value="Bệnh mãn tính">Bệnh mãn tính</option>
                      <option value="Vấn đề sức khỏe">Vấn đề sức khỏe</option>
                      <option value="Vấn đề phát triển">
                        Vấn đề phát triển
                      </option>
                      <option value="Vấn đề hành vi">Vấn đề hành vi</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Tiêu đề</label>
                    <input
                      type="text"
                      value={editingRecord.title}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          title: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Mức độ nghiêm trọng</label>
                    <select
                      value={editingRecord.severity}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          severity: e.target.value,
                        })
                      }
                    >
                      <option value="Nhẹ">Nhẹ</option>
                      <option value="Trung bình">Trung bình</option>
                      <option value="Nặng">Nặng</option>
                      <option value="Bình thường">Bình thường</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Ngày</label>
                    <input
                      type="date"
                      value={editingRecord.date}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Bác sĩ</label>
                    <input
                      type="text"
                      value={editingRecord.doctor}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          doctor: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select
                      value={editingRecord.status}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Đang theo dõi">Đang theo dõi</option>
                      <option value="Hoàn thành">Hoàn thành</option>
                      <option value="Cần giám sát">Cần giám sát</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Mô tả</label>
                    <textarea
                      value={editingRecord.description}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Ghi chú</label>
                    <textarea
                      value={editingRecord.notes}
                      onChange={(e) =>
                        setEditingRecord({
                          ...editingRecord,
                          notes: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentHealthRecord;
