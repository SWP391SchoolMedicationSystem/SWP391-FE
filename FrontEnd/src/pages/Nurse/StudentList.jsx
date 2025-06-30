import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Nurse/StudentList.css";
import { useNurseStudents } from "../../utils/hooks/useNurse";

function StudentList() {
  const navigate = useNavigate();

  // Use API hooks
  const { data: students, loading, error, refetch } = useNurseStudents();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterHealthStatus, setFilterHealthStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const handleViewHealthRecords = (student) => {
    console.log("🏥 NAVIGATING TO HEALTH RECORDS PAGE");
    console.log("📋 Student Object:", student);
    console.log("🆔 Student ID:", student.id);

    // Navigate to student health record detail page
    navigate(`/nurse/student-health-record/${student.id}`);
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
    </div>
  );
}

export default StudentList;
