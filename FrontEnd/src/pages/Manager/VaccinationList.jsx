import React, { useState } from "react";
import "../../css/Manager/VaccinationList.css";

function VaccinationList() {
  // Mock data for student vaccination records
  const [students, setStudents] = useState([
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
  const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'view'
  const [currentStudent, setCurrentStudent] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    studentId: "",
    fullName: "",
    className: "",
    dateOfBirth: "",
    parentName: "",
    parentPhone: "",
    vaccineName: "",
    vaccineType: "",
    scheduledDate: "",
    status: "Chờ tiêm",
    notes: "",
    healthStatus: "Tốt",
    consentForm: "Chưa ký",
  });

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
  const healthStatuses = ["Tốt", "Bình thường", "Có dị ứng", "Cần theo dõi"];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open modal for adding new record
  const handleAddRecord = () => {
    setModalMode("add");
    setFormData({
      studentId: "",
      fullName: "",
      className: "",
      dateOfBirth: "",
      parentName: "",
      parentPhone: "",
      vaccineName: "",
      vaccineType: "",
      scheduledDate: "",
      status: "Chờ tiêm",
      notes: "",
      healthStatus: "Tốt",
      consentForm: "Chưa ký",
    });
    setCurrentStudent(null);
    setShowModal(true);
  };

  // Open modal for editing record
  const handleEditRecord = (student) => {
    setModalMode("edit");
    setFormData({
      studentId: student.studentId,
      fullName: student.fullName,
      className: student.className,
      dateOfBirth: student.dateOfBirth,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      vaccineName: student.vaccineName,
      vaccineType: student.vaccineType,
      scheduledDate: student.scheduledDate,
      status: student.status,
      notes: student.notes,
      healthStatus: student.healthStatus,
      consentForm: student.consentForm,
    });
    setCurrentStudent(student);
    setShowModal(true);
  };

  // Open modal for viewing record
  const handleViewRecord = (student) => {
    setModalMode("view");
    setCurrentStudent(student);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === "add") {
      const newStudent = {
        id: students.length + 1,
        ...formData,
        actualDate:
          formData.status === "Đã tiêm"
            ? new Date().toISOString().split("T")[0]
            : null,
        createdDate: new Date().toISOString().split("T")[0],
      };
      setStudents((prev) => [newStudent, ...prev]);
    } else if (modalMode === "edit") {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === currentStudent.id
            ? {
                ...student,
                ...formData,
                actualDate:
                  formData.status === "Đã tiêm" && !student.actualDate
                    ? new Date().toISOString().split("T")[0]
                    : student.actualDate,
              }
            : student
        )
      );
    }

    setShowModal(false);
  };

  // Handle delete record
  const handleDeleteRecord = (studentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) {
      setStudents((prev) => prev.filter((student) => student.id !== studentId));
    }
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "" || student.status === filterStatus;
    const matchesClass =
      filterClass === "" || student.className === filterClass;
    const matchesVaccine =
      filterVaccine === "" || student.vaccineName === filterVaccine;

    return matchesSearch && matchesStatus && matchesClass && matchesVaccine;
  });

  // Get statistics
  const stats = {
    total: students.length,
    vaccinated: students.filter((s) => s.status === "Đã tiêm").length,
    refused: students.filter((s) => s.status === "Từ chối").length,
    pending: students.filter((s) => s.status === "Chờ tiêm").length,
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Đã tiêm":
        return "status-vaccinated";
      case "Từ chối":
        return "status-refused";
      case "Chờ tiêm":
        return "status-pending";
      case "Hoãn tiêm":
        return "status-postponed";
      default:
        return "status-default";
    }
  };

  return (
    <div className="vaccination-management">
      <div className="page-header">
        <h1>Danh sách học sinh tiêm chủng</h1>
        <p>Quản lý thông tin tiêm chủng của học sinh</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Tổng số học sinh</p>
          </div>
        </div>
        <div className="stat-card vaccinated">
          <div className="stat-icon">💉</div>
          <div className="stat-info">
            <h3>{stats.vaccinated}</h3>
            <p>Đã tiêm chủng</p>
          </div>
        </div>
        <div className="stat-card refused">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{stats.refused}</h3>
            <p>Từ chối tiêm</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Chờ tiêm chủng</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã HS, lớp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
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

        <button className="add-btn" onClick={handleAddRecord}>
          + Thêm bản ghi
        </button>
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
                    <button
                      className="btn-edit"
                      onClick={() => handleEditRecord(student)}
                      title="Chỉnh sửa"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteRecord(student.id)}
                      title="Xóa"
                    >
                      🗑️
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
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalMode === "add" && "Thêm bản ghi tiêm chủng"}
                {modalMode === "edit" && "Chỉnh sửa bản ghi"}
                {modalMode === "view" && "Chi tiết bản ghi"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {modalMode === "view" && currentStudent ? (
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
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Mã học sinh *</label>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Họ tên *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Lớp *</label>
                      <select
                        name="className"
                        value={formData.className}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn lớp</option>
                        {classes.map((className) => (
                          <option key={className} value={className}>
                            {className}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Ngày sinh *</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Tên phụ huynh *</label>
                      <input
                        type="text"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>SĐT phụ huynh *</label>
                      <input
                        type="tel"
                        name="parentPhone"
                        value={formData.parentPhone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Tên vaccine *</label>
                      <select
                        name="vaccineName"
                        value={formData.vaccineName}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Chọn vaccine</option>
                        {vaccines.map((vaccine) => (
                          <option key={vaccine} value={vaccine}>
                            {vaccine}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Loại vaccine</label>
                      <input
                        type="text"
                        name="vaccineType"
                        value={formData.vaccineType}
                        onChange={handleInputChange}
                        placeholder="Ví dụ: Pfizer, Moderna..."
                      />
                    </div>

                    <div className="form-group">
                      <label>Ngày hẹn tiêm *</label>
                      <input
                        type="date"
                        name="scheduledDate"
                        value={formData.scheduledDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Trạng thái *</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Tình trạng sức khỏe</label>
                      <select
                        name="healthStatus"
                        value={formData.healthStatus}
                        onChange={handleInputChange}
                      >
                        {healthStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Phiếu đồng ý</label>
                      <select
                        name="consentForm"
                        value={formData.consentForm}
                        onChange={handleInputChange}
                      >
                        <option value="Chưa ký">Chưa ký</option>
                        <option value="Đã ký">Đã ký</option>
                        <option value="Từ chối">Từ chối</option>
                      </select>
                    </div>

                    <div className="form-group full-width">
                      <label>Ghi chú</label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Nhập ghi chú..."
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowModal(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn-submit">
                      {modalMode === "add" ? "Thêm" : "Cập nhật"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VaccinationList;
