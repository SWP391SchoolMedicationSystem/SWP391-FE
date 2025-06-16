import React, { useState } from "react";
import "../../css/Nurse/VaccinationList.css";

function VaccinationList() {
  // Mock data for student vaccination records
  const [students] = useState([
    {
      id: 1,
      studentId: "MN001",
      fullName: "Nguyễn Văn An",
      className: "Mầm",
      dateOfBirth: "2020-05-15",
      parentName: "Nguyễn Thị Hoa",
      parentPhone: "0912345678",
      vaccineName: "Vaccine Viêm gan B",
      vaccineType: "Engerix-B",
      scheduledDate: "2024-03-20",
      actualDate: "2024-03-20",
      status: "Đã tiêm",
      notes: "Tiêm thành công, không có tác dụng phụ",
      healthStatus: "Tốt",
      consentForm: "Đã ký",
      createdDate: "2024-03-15",
    },
    {
      id: 2,
      studentId: "MN002",
      fullName: "Trần Thị Bình",
      className: "Chồi",
      dateOfBirth: "2020-08-22",
      parentName: "Trần Văn Nam",
      parentPhone: "0923456789",
      vaccineName: "Vaccine DPT",
      vaccineType: "Adacel",
      scheduledDate: "2024-03-20",
      actualDate: null,
      status: "Từ chối",
      notes: "Phụ huynh từ chối cho con tiêm vaccine",
      healthStatus: "Bình thường",
      consentForm: "Từ chối",
      createdDate: "2024-03-15",
      rejectionReason: "Lo ngại về tác dụng phụ",
    },
    {
      id: 3,
      studentId: "MN003",
      fullName: "Lê Minh Cường",
      className: "Lá 1",
      dateOfBirth: "2019-12-10",
      parentName: "Lê Thị Mai",
      parentPhone: "0934567890",
      vaccineName: "Vaccine Cúm",
      vaccineType: "Vaxigrip",
      scheduledDate: "2024-03-22",
      actualDate: "2024-03-22",
      status: "Đã tiêm",
      notes: "Tiêm thành công, có phản ứng nhẹ tại chỗ tiêm",
      healthStatus: "Tốt",
      consentForm: "Đã ký",
      createdDate: "2024-03-18",
    },
    {
      id: 4,
      studentId: "MN004",
      fullName: "Phạm Thị Diệu",
      className: "Lá 2",
      dateOfBirth: "2019-03-08",
      parentName: "Phạm Văn Hùng",
      parentPhone: "0945678901",
      vaccineName: "Vaccine Viêm gan B",
      vaccineType: "Engerix-B",
      scheduledDate: "2024-03-25",
      actualDate: null,
      status: "Chờ tiêm",
      notes: "Đã hẹn lịch tiêm",
      healthStatus: "Tốt",
      consentForm: "Đã ký",
      createdDate: "2024-03-20",
    },
    {
      id: 5,
      studentId: "MN005",
      fullName: "Hoàng Văn Em",
      className: "Lá 3",
      dateOfBirth: "2019-07-30",
      parentName: "Hoàng Thị Lan",
      parentPhone: "0956789012",
      vaccineName: "Vaccine DPT",
      vaccineType: "Adacel",
      scheduledDate: "2024-03-20",
      actualDate: null,
      status: "Từ chối",
      notes: "Học sinh có tiền sử dị ứng",
      healthStatus: "Có dị ứng",
      consentForm: "Từ chối",
      createdDate: "2024-03-15",
      rejectionReason: "Có tiền sử dị ứng với thành phần vaccine",
    },
    {
      id: 6,
      studentId: "MN006",
      fullName: "Võ Thị Phượng",
      className: "Chồi",
      dateOfBirth: "2020-11-18",
      parentName: "Võ Văn Giang",
      parentPhone: "0967890123",
      vaccineName: "Vaccine Cúm",
      vaccineType: "Vaxigrip",
      scheduledDate: "2024-03-22",
      actualDate: "2024-03-22",
      status: "Đã tiêm",
      notes: "Tiêm thành công, không có phản ứng bất thường",
      healthStatus: "Tốt",
      consentForm: "Đã ký",
      createdDate: "2024-03-18",
    },
  ]);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterVaccine, setFilterVaccine] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Available options
  const statuses = ["Chờ tiêm", "Đã tiêm", "Từ chối", "Hoãn tiêm"];
  const classes = ["Mầm", "Chồi", "Lá 1", "Lá 2", "Lá 3"];
  const vaccines = [
    "Vaccine Viêm gan B",
    "Vaccine DPT",
    "Vaccine Cúm",
    "Vaccine MMR",
    "Vaccine Varicella",
    "Vaccine Polio",
  ];

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" || student.status === filterStatus;
    const matchesClass =
      filterClass === "" || student.className === filterClass;
    const matchesVaccine =
      filterVaccine === "" || student.vaccineName === filterVaccine;

    return matchesSearch && matchesStatus && matchesClass && matchesVaccine;
  });

  // Handle viewing record
  const handleViewRecord = (student) => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Đã tiêm":
        return "status-completed";
      case "Chờ tiêm":
        return "status-pending";
      case "Từ chối":
        return "status-rejected";
      case "Hoãn tiêm":
        return "status-delayed";
      default:
        return "status-pending";
    }
  };

  // Statistics
  const stats = {
    total: students.length,
    completed: students.filter((s) => s.status === "Đã tiêm").length,
    pending: students.filter((s) => s.status === "Chờ tiêm").length,
    rejected: students.filter((s) => s.status === "Từ chối").length,
  };

  return (
    <div className="vaccination-container">
      <div className="vaccination-header">
        <h1>📋 Danh Sách Tiêm Chủng</h1>
        <p>Xem thông tin tiêm chủng của học sinh</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng số học sinh</p>
          </div>
        </div>
        <div className="stat-card completed">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.completed}</h3>
            <p>Đã tiêm chủng</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pending}</h3>
            <p>Chờ tiêm chủng</p>
          </div>
        </div>
        <div className="stat-card rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{stats.rejected}</h3>
            <p>Từ chối</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-container">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc mã học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Tất cả trạng thái</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="filter-select"
          >
            <option value="">Tất cả lớp</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>

          <select
            value={filterVaccine}
            onChange={(e) => setFilterVaccine(e.target.value)}
            className="filter-select"
          >
            <option value="">Tất cả vaccine</option>
            {vaccines.map((vaccine) => (
              <option key={vaccine} value={vaccine}>
                {vaccine}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="vaccination-table">
          <thead>
            <tr>
              <th>Mã HS</th>
              <th>Họ tên</th>
              <th>Lớp</th>
              <th>Phụ huynh</th>
              <th>Vaccine</th>
              <th>Ngày hẹn</th>
              <th>Trạng thái</th>
              <th>Sức khỏe</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="student-id">{student.studentId}</td>
                <td>
                  <div className="student-info">
                    <strong>{student.fullName}</strong>
                    <small>{student.dateOfBirth}</small>
                  </div>
                </td>
                <td className="class-name">{student.className}</td>
                <td>
                  <div className="parent-info">
                    <div>{student.parentName}</div>
                    <small>{student.parentPhone}</small>
                  </div>
                </td>
                <td>
                  <div className="vaccine-info">
                    <div>{student.vaccineName}</div>
                    <small>{student.vaccineType}</small>
                  </div>
                </td>
                <td>{student.scheduledDate}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusBadgeClass(
                      student.status
                    )}`}
                  >
                    {student.status}
                  </span>
                </td>
                <td>
                  <span
                    className={`health-status ${
                      student.healthStatus === "Có dị ứng"
                        ? "warning"
                        : "normal"
                    }`}
                  >
                    {student.healthStatus}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewRecord(student)}
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="no-data">
            <p>Không tìm thấy dữ liệu phù hợp</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && currentStudent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết bản ghi tiêm chủng</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="student-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Mã học sinh:</label>
                    <span>{currentStudent.studentId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Họ tên:</label>
                    <span>{currentStudent.fullName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Lớp:</label>
                    <span>{currentStudent.className}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày sinh:</label>
                    <span>{currentStudent.dateOfBirth}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phụ huynh:</label>
                    <span>{currentStudent.parentName}</span>
                  </div>
                  <div className="detail-item">
                    <label>SĐT phụ huynh:</label>
                    <span>{currentStudent.parentPhone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tên vaccine:</label>
                    <span>{currentStudent.vaccineName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Loại vaccine:</label>
                    <span>{currentStudent.vaccineType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày hẹn:</label>
                    <span>{currentStudent.scheduledDate}</span>
                  </div>
                  {currentStudent.actualDate && (
                    <div className="detail-item">
                      <label>Ngày tiêm thực tế:</label>
                      <span>{currentStudent.actualDate}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <label>Trạng thái:</label>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        currentStudent.status
                      )}`}
                    >
                      {currentStudent.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Tình trạng sức khỏe:</label>
                    <span>{currentStudent.healthStatus}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phiếu đồng ý:</label>
                    <span>{currentStudent.consentForm}</span>
                  </div>
                  {currentStudent.rejectionReason && (
                    <div className="detail-item full-width">
                      <label>Lý do từ chối:</label>
                      <span className="rejection-reason">
                        {currentStudent.rejectionReason}
                      </span>
                    </div>
                  )}
                  <div className="detail-item full-width">
                    <label>Ghi chú:</label>
                    <span>{currentStudent.notes}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VaccinationList;
