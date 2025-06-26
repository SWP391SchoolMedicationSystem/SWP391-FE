import React, { useState } from "react";
import "../../css/Nurse/StudentList.css";
import { useNurseStudents } from "../../utils/hooks/useNurse";
import { nurseHealthService } from "../../services/nurseService";

function StudentList() {
  // Use API hooks
  const { data: students, loading, error, refetch } = useNurseStudents();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterHealthStatus, setFilterHealthStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Health records states
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedStudentForHealth, setSelectedStudentForHealth] =
    useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loadingHealthRecords, setLoadingHealthRecords] = useState(false);
  const [healthRecordsError, setHealthRecordsError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Available options
  const classes = ["Mầm", "Chồi", "Lá 1", "Lá 2", "Lá 3"];
  const genders = ["Nam", "Nữ"];
  const healthStatuses = ["Tốt", "Bình thường", "Yếu"];

  // Use real students from API
  const studentData = students || [];

  // Debug API response
  console.log("👥 API students response:", students);
  console.log("📊 Using studentData:", studentData);
  console.log("📈 Total students available:", studentData.length);

  if (studentData.length === 0 && !loading) {
    console.log("⚠️ No students data available - check API connection");
  }

  // Filter students with safety checks
  const filteredStudents = studentData.filter((student) => {
    const matchesSearch =
      (student.fullName &&
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.studentId &&
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.parentName &&
        student.parentName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesClass =
      filterClass === "" || student.className === filterClass;
    const matchesGender =
      filterGender === "" || student.gender === filterGender;
    const matchesHealthStatus =
      filterHealthStatus === "" || student.healthStatus === filterHealthStatus;

    return (
      matchesSearch && matchesClass && matchesGender && matchesHealthStatus
    );
  });

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleViewHealthRecords = async (student) => {
    console.log("🏥 CLICKED HEALTH RECORDS BUTTON");
    console.log("📋 Student Object:", student);
    console.log("🆔 Student ID:", student.id);
    console.log("👤 Student Name:", student.fullName);
    console.log("📝 Student Code:", student.studentId);

    setSelectedStudentForHealth(student);
    setShowHealthModal(true);
    setLoadingHealthRecords(true);
    setHealthRecordsError("");

    try {
      const studentId = student.id;
      console.log("🔍 Using studentId for API call:", studentId);

      if (!studentId || studentId === 0) {
        console.error("❌ Invalid student ID:", studentId);
        throw new Error("Không tìm thấy ID học sinh hợp lệ");
      }

      const records = await nurseHealthService.getHealthRecordsByStudent(
        studentId
      );
      console.log("📊 API Response - Health Records:", records);
      console.log("📈 Total records received:", records?.length || 0);

      // Filter out deleted records and format for UI
      const validRecords = records.filter((record) => !record.isDeleted);
      console.log("✅ Valid records (not deleted):", validRecords.length);

      const mappedRecords = validRecords.map((record) => ({
        id: record.id,
        type: record.categoryName,
        title: record.title,
        description: record.description,
        severity: record.isConfirmed ? "Bình thường" : "Chờ xác nhận",
        date: record.date,
        doctor: record.createdBy,
        medications: [],
        notes: record.description,
        status: record.isConfirmed ? "Hoàn thành" : "Đang theo dõi",
        staffId: record.staffId,
        categoryId: record.categoryId,
        modifiedDate: record.modifiedDate,
      }));

      console.log("🎯 Final mapped records:", mappedRecords);
      setHealthRecords(mappedRecords);
    } catch (error) {
      console.error("❌ Error loading health records:", error);
      setHealthRecordsError(`Không thể tải hồ sơ sức khỏe: ${error.message}`);
      setHealthRecords([]);
    } finally {
      setLoadingHealthRecords(false);
    }
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

  const handleSaveRecord = async (recordData) => {
    try {
      if (recordData.id === Date.now() || !recordData.title) {
        // Create new record
        const createData = {
          ...recordData,
          studentId: selectedStudentForHealth.id,
        };
        await nurseHealthService.createHealthRecord(createData);
      } else {
        // Update existing record
        await nurseHealthService.updateHealthRecord(recordData.id, recordData);
      }

      // Refresh health records
      if (selectedStudentForHealth) {
        await handleViewHealthRecords(selectedStudentForHealth);
      }
      setShowEditModal(false);
      setEditingRecord(null);
    } catch (error) {
      console.error("Error saving record:", error);
      alert(`Không thể lưu hồ sơ y tế: ${error.message}`);
    }
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

  const getHealthStatusClass = (status) => {
    switch (status) {
      case "Tốt":
        return "health-good";
      case "Bình thường":
        return "health-normal";
      case "Yếu":
        return "health-weak";
      default:
        return "health-normal";
    }
  };

  const getClassBadgeColor = (className) => {
    const colors = {
      Mầm: "badge-mam",
      Chồi: "badge-choi",
      "Lá 1": "badge-la1",
      "Lá 2": "badge-la2",
      "Lá 3": "badge-la3",
    };
    return colors[className] || "badge-default";
  };

  // Statistics
  const stats = {
    total: studentData.length,
    male: studentData.filter((s) => s.gender === "Nam").length,
    female: studentData.filter((s) => s.gender === "Nữ").length,
    healthy: studentData.filter((s) => s.healthStatus === "Tốt").length,
  };

  // Show loading state
  if (loading) {
    return (
      <div className="student-list-container">
        <div className="loading-state">
          <p>⏳ Đang tải danh sách học sinh...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="student-list-container">
        <div className="error-state">
          <p>❌ Lỗi khi tải danh sách học sinh: {error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="page-header">
        <div className="header-content">
          <h1>👥 Danh Sách Học Sinh</h1>
          <p>Xem thông tin học sinh trong trường</p>
        </div>
        <button onClick={refetch} className="refresh-btn">
          🔄 Tải lại
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng học sinh</p>
          </div>
        </div>
        <div className="stat-card male">
          <div className="stat-icon">👦</div>
          <div className="stat-content">
            <h3>{stats.male}</h3>
            <p>Nam</p>
          </div>
        </div>
        <div className="stat-card female">
          <div className="stat-icon">👧</div>
          <div className="stat-content">
            <h3>{stats.female}</h3>
            <p>Nữ</p>
          </div>
        </div>
        <div className="stat-card healthy">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>{stats.healthy}</h3>
            <p>Sức khỏe tốt</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="controls-section">
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên, mã học sinh, hoặc phụ huynh..."
          />
        </div>

        <div className="filter-box">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
          >
            <option value="">Tất cả lớp</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>

          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <option value="">Tất cả giới tính</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>

          <select
            value={filterHealthStatus}
            onChange={(e) => setFilterHealthStatus(e.target.value)}
          >
            <option value="">Tất cả sức khỏe</option>
            {healthStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Mã HS</th>
              <th>Họ tên</th>
              <th>Lớp</th>
              <th>Phụ huynh</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Sức khỏe</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="student-id">{student.studentId}</td>
                <td>
                  <div className="student-name-info">
                    <strong>{student.fullName}</strong>
                    <small>{student.bloodType}</small>
                  </div>
                </td>
                <td>
                  <span
                    className={`class-badge ${getClassBadgeColor(
                      student.className
                    )}`}
                  >
                    {student.className}
                  </span>
                </td>
                <td>
                  <div className="parent-info">
                    <div>{student.parentName}</div>
                    <small>{student.parentPhone}</small>
                  </div>
                </td>
                <td>{student.dateOfBirth}</td>
                <td>
                  <span
                    className={`gender-badge ${student.gender.toLowerCase()}`}
                  >
                    {student.gender}
                  </span>
                </td>
                <td>
                  <span
                    className={`health-badge ${getHealthStatusClass(
                      student.healthStatus
                    )}`}
                  >
                    {student.healthStatus}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewStudent(student)}
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-health"
                      onClick={() => handleViewHealthRecords(student)}
                      title="Hồ sơ sức khỏe"
                    >
                      🏥
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="no-data">
            <p>Không tìm thấy học sinh nào</p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      {showModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thông tin chi tiết - {selectedStudent.fullName}</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Mã học sinh:</label>
                  <span>{selectedStudent.studentId}</span>
                </div>
                <div className="detail-item">
                  <label>Họ tên:</label>
                  <span>{selectedStudent.fullName}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày sinh:</label>
                  <span>{selectedStudent.dateOfBirth}</span>
                </div>
                <div className="detail-item">
                  <label>Giới tính:</label>
                  <span>{selectedStudent.gender}</span>
                </div>
                <div className="detail-item">
                  <label>Lớp:</label>
                  <span>{selectedStudent.className}</span>
                </div>
                <div className="detail-item">
                  <label>Nhóm máu:</label>
                  <span>{selectedStudent.bloodType}</span>
                </div>
                <div className="detail-item">
                  <label>Chiều cao:</label>
                  <span>{selectedStudent.height}</span>
                </div>
                <div className="detail-item">
                  <label>Cân nặng:</label>
                  <span>{selectedStudent.weight}</span>
                </div>
                <div className="detail-item">
                  <label>Tình trạng sức khỏe:</label>
                  <span
                    className={`health-badge ${getHealthStatusClass(
                      selectedStudent.healthStatus
                    )}`}
                  >
                    {selectedStudent.healthStatus}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Dị ứng:</label>
                  <span
                    className={
                      selectedStudent.allergies !== "Không"
                        ? "allergy-warning"
                        : ""
                    }
                  >
                    {selectedStudent.allergies}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Phụ huynh:</label>
                  <span>{selectedStudent.parentName}</span>
                </div>
                <div className="detail-item">
                  <label>SĐT phụ huynh:</label>
                  <span>{selectedStudent.parentPhone}</span>
                </div>
                <div className="detail-item">
                  <label>Liên hệ khẩn cấp:</label>
                  <span>{selectedStudent.emergencyContact}</span>
                </div>
                <div className="detail-item">
                  <label>Ngày nhập học:</label>
                  <span>{selectedStudent.enrollmentDate}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Ghi chú:</label>
                  <span>{selectedStudent.notes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Health Records Modal */}
      {showHealthModal && selectedStudentForHealth && (
        <div
          className="modal-overlay"
          onClick={() => setShowHealthModal(false)}
        >
          <div
            className="modal-content large-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>🏥 Hồ Sơ Sức Khỏe - {selectedStudentForHealth.fullName}</h3>
              <button
                className="modal-close"
                onClick={() => setShowHealthModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Student Basic Info */}
              <div className="student-basic-info">
                <div className="info-row">
                  <span>
                    <strong>Mã học sinh:</strong>{" "}
                    {selectedStudentForHealth.studentId}
                  </span>
                  <span>
                    <strong>Lớp:</strong> {selectedStudentForHealth.className}
                  </span>
                  <span>
                    <strong>Giới tính:</strong>{" "}
                    {selectedStudentForHealth.gender}
                  </span>
                </div>
              </div>

              {/* Health Records Section */}
              <div className="health-records-section">
                <div className="section-header">
                  <h4>📋 Danh sách hồ sơ y tế</h4>
                  <button className="btn-primary" onClick={handleAddRecord}>
                    ➕ Thêm hồ sơ mới
                  </button>
                </div>

                {/* Loading State */}
                {loadingHealthRecords && (
                  <div className="loading-state">
                    <p>⏳ Đang tải hồ sơ y tế...</p>
                  </div>
                )}

                {/* Error State */}
                {healthRecordsError && (
                  <div className="error-state">
                    <p>❌ {healthRecordsError}</p>
                    <button
                      onClick={() =>
                        handleViewHealthRecords(selectedStudentForHealth)
                      }
                      className="retry-btn"
                    >
                      🔄 Thử lại
                    </button>
                  </div>
                )}

                {/* Health Records List */}
                {!loadingHealthRecords && !healthRecordsError && (
                  <div className="records-list">
                    {healthRecords.length > 0 ? (
                      healthRecords.map((record) => (
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
                              <strong>Bác sĩ/Nhân viên:</strong> {record.doctor}
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

                          <div className="record-actions">
                            <button
                              className="edit-btn"
                              onClick={() => handleEditRecord(record)}
                            >
                              ✏️ Sửa
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-records">
                        <div className="no-records-icon">📭</div>
                        <p>Chưa có hồ sơ y tế nào</p>
                        <small>
                          Học sinh chưa có bản ghi y tế trong hệ thống
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditModal && editingRecord && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
                ×
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
                      rows="3"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Bác sĩ/Nhân viên</label>
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
                      <option value="Cần xử lý">Cần xử lý</option>
                    </select>
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
                      rows="2"
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

export default StudentList;
