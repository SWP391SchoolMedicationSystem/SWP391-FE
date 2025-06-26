import React, { useState, useRef } from "react";
import "../../css/Manager/StudentList.css";
import {
  useManagerStudents,
  // useManagerActions, // Comment out unused actions for now
} from "../../utils/hooks/useManager";
import { managerHealthService } from "../../services/managerService";

function StudentList() {
  // Use API hooks
  const { data: students, loading, error, refetch } = useManagerStudents();
  // Uncomment when implementing CRUD operations
  // const { createStudent, updateStudent, deleteStudent, loading: actionLoading } = useManagerActions();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const fileInputRef = useRef(null);

  // Health records state
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loadingHealthRecords, setLoadingHealthRecords] = useState(false);
  const [healthRecordsError, setHealthRecordsError] = useState("");

  // Available classes for preschool (updated to match API classid)
  const classes = [
    { value: "", label: "Tất cả lớp" },
    { value: "1", label: "Lớp 1" },
    { value: "2", label: "Lớp 2" },
    { value: "3", label: "Lớp 3" },
    { value: "4", label: "Lớp 4" },
    { value: "5", label: "Lớp 5" },
  ];

  // API endpoint - để trống theo yêu cầu
  const API_ENDPOINT = ""; // Thêm đường dẫn API ở đây

  // Filter students based on search and class filter
  const filteredStudents = students
    ? students.filter((student) => {
        const matchesSearch =
          student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.parentName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass =
          filterClass === "" || student.classId?.toString() === filterClass;
        return matchesSearch && matchesClass;
      })
    : [];

  // Handle viewing student information
  const handleViewStudent = (student) => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  // Handle viewing student health records
  const handleViewHealthRecords = async (student) => {
    setCurrentStudent(student);
    setShowHealthModal(true);
    setLoadingHealthRecords(true);
    setHealthRecordsError("");

    try {
      console.log("🔍 Fetching health records for student:", student);
      console.log("🔍 Student ID (numeric):", student.id);
      console.log("🔍 Student Code (string):", student.studentId);

      // Use the numeric ID (student.id) for API call
      const studentId = student.id;
      console.log("🔍 Using student ID for API:", studentId, typeof studentId);

      if (studentId === null || studentId === undefined) {
        throw new Error("Không tìm thấy ID học sinh");
      }

      // Special handling for ID = 0 (might be invalid)
      if (studentId === 0) {
        console.warn(
          "⚠️ Student ID is 0, this might be invalid. Trying anyway..."
        );
      }

      const records = await managerHealthService.getHealthRecordsByStudent(
        studentId
      );

      // Filter out deleted records and map for display
      const validRecords = records.filter((record) => !record.isdeleted);
      const mappedRecords = validRecords.map((record) =>
        managerHealthService.mapHealthRecordData(record)
      );

      setHealthRecords(mappedRecords);
      console.log("✅ Health records loaded:", mappedRecords);
    } catch (error) {
      console.error("❌ Error loading health records:", error);
      setHealthRecordsError(`Không thể tải hồ sơ sức khỏe: ${error.message}`);
    } finally {
      setLoadingHealthRecords(false);
    }
  };

  // Handle file import
  const handleFileImport = () => {
    // Reset previous messages
    setImportError("");
    setImportSuccess("");
    fileInputRef.current?.click();
  };

  // Validate file type and size
  const validateFile = (file) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return "Chỉ chấp nhận file Excel (.xlsx, .xls) hoặc CSV (.csv)";
    }

    if (file.size > maxSize) {
      return "File quá lớn. Vui lòng chọn file nhỏ hơn 10MB";
    }

    return null;
  };

  // API call to import file
  const importStudentFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "student_import");

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          // Don't set Content-Type header, let browser set it with boundary for multipart/form-data
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Thêm token nếu cần
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Import error:", error);
      throw error;
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Reset previous messages
    setImportError("");
    setImportSuccess("");

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setImportError(validationError);
      event.target.value = "";
      return;
    }

    // Start importing
    setIsImporting(true);

    try {
      const result = await importStudentFile(file);

      // Handle success
      setImportSuccess(
        `Import thành công! Đã thêm ${result.importedCount || 0} học sinh.`
      );

      // Refresh student list
      refetch();
    } catch (error) {
      // Handle error
      setImportError(`Lỗi import file: ${error.message}`);
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = "";
    }
  };

  // Clear messages after some time
  React.useEffect(() => {
    if (importSuccess) {
      const timer = setTimeout(() => {
        setImportSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [importSuccess]);

  React.useEffect(() => {
    if (importError) {
      const timer = setTimeout(() => {
        setImportError("");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [importError]);

  // Get health status badge class (commented out as not used currently)
  // const getHealthStatusClass = (status) => {
  //   switch (status) {
  //     case "Bình thường":
  //       return "status-normal";
  //     case "Cần theo dõi":
  //       return "status-watch";
  //     case "Có dị ứng":
  //       return "status-allergy";
  //     default:
  //       return "status-normal";
  //   }
  // };

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h1>Danh Sách Học Sinh</h1>
        <p>Quản lý thông tin học sinh trường mầm non</p>
      </div>

      {/* Import Messages */}
      {(importError || importSuccess || isImporting) && (
        <div className="import-messages">
          {isImporting && (
            <div className="message importing">
              <span className="loading-spinner">⏳</span>
              Đang import file, vui lòng đợi...
            </div>
          )}
          {importSuccess && (
            <div className="message success">✅ {importSuccess}</div>
          )}
          {importError && <div className="message error">❌ {importError}</div>}
        </div>
      )}

      {/* Controls */}
      <div className="controls-section">
        <div className="search-filter-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã học sinh, tên phụ huynh..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              {classes.map((classOption) => (
                <option key={classOption.value} value={classOption.value}>
                  {classOption.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className={`import-btn ${isImporting ? "importing" : ""}`}
            onClick={handleFileImport}
            disabled={isImporting}
          >
            {isImporting ? "⏳ Đang import..." : "📁 Import File"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            style={{ display: "none" }}
            disabled={isImporting}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>⏳ Đang tải danh sách học sinh...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>❌ Lỗi khi tải danh sách học sinh: {error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && (!students || students.length === 0) && (
        <div className="empty-state">
          <p>📭 Chưa có học sinh nào trong hệ thống</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Tải lại
          </button>
        </div>
      )}

      {/* Student Table */}
      {!loading && !error && students && students.length > 0 && (
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th>Mã HS</th>
                <th>Họ tên</th>
                <th>Lớp</th>
                <th>Tuổi</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Nhóm máu</th>
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
                      <small>ID: {student.id}</small>
                    </div>
                  </td>
                  <td className="class-name">{student.className}</td>
                  <td>{student.age} tuổi</td>
                  <td>{student.dateOfBirth}</td>
                  <td>{student.gender}</td>
                  <td>
                    <span className="blood-type">{student.bloodType}</span>
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
                        title="Xem hồ sơ sức khỏe"
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
              <p>Không tìm thấy dữ liệu phù hợp với bộ lọc</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterClass("");
                }}
                className="retry-btn"
              >
                🔄 Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* Student Detail Modal */}
      {showModal && currentStudent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thông Tin Chi Tiết Học Sinh</h3>
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
                    <label>Họ và tên:</label>
                    <span>{currentStudent.fullName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày sinh:</label>
                    <span>{currentStudent.dateOfBirth}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tuổi:</label>
                    <span>{currentStudent.age} tuổi</span>
                  </div>
                  <div className="detail-item">
                    <label>Giới tính:</label>
                    <span>{currentStudent.gender}</span>
                  </div>
                  <div className="detail-item">
                    <label>Lớp:</label>
                    <span>{currentStudent.className}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nhóm máu:</label>
                    <span>{currentStudent.bloodType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày nhập học:</label>
                    <span>{currentStudent.enrollmentDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>ID phụ huynh:</label>
                    <span>{currentStudent.parentId}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tình trạng sức khỏe:</label>
                    <span>{currentStudent.healthStatus}</span>
                  </div>
                  <div className="detail-item">
                    <label>Dị ứng:</label>
                    <span>{currentStudent.allergies}</span>
                  </div>
                  <div className="detail-item">
                    <label>Liên hệ khẩn cấp:</label>
                    <span>{currentStudent.emergencyContact}</span>
                  </div>
                  <div className="detail-item">
                    <label>Địa chỉ:</label>
                    <span>{currentStudent.address}</span>
                  </div>
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

      {/* Health Records Modal */}
      {showHealthModal && currentStudent && (
        <div
          className="modal-overlay"
          onClick={() => setShowHealthModal(false)}
        >
          <div
            className="modal-content health-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>🏥 Hồ Sơ Sức Khỏe - {currentStudent.fullName}</h3>
              <button
                className="modal-close"
                onClick={() => setShowHealthModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Student Info Summary */}
              <div className="student-summary">
                <div className="summary-item">
                  <strong>Mã HS:</strong> {currentStudent.studentId}
                </div>
                <div className="summary-item">
                  <strong>Lớp:</strong> {currentStudent.className}
                </div>
                <div className="summary-item">
                  <strong>Tuổi:</strong> {currentStudent.age} tuổi
                </div>
                <div className="summary-item">
                  <strong>Nhóm máu:</strong> {currentStudent.bloodType}
                </div>
              </div>

              {/* Health Records Section */}
              <div className="health-records-section">
                <div className="section-header">
                  <h4>📋 Danh sách hồ sơ y tế</h4>
                  <div className="records-count">
                    {healthRecords.length} bản ghi
                  </div>
                </div>

                {/* Loading State */}
                {loadingHealthRecords && (
                  <div className="loading-state">
                    <div className="loading-spinner">⏳</div>
                    <p>Đang tải hồ sơ sức khỏe...</p>
                  </div>
                )}

                {/* Error State */}
                {healthRecordsError && (
                  <div className="error-state">
                    <p>❌ {healthRecordsError}</p>
                    <button
                      onClick={() => handleViewHealthRecords(currentStudent)}
                      className="retry-btn"
                    >
                      🔄 Thử lại
                    </button>
                  </div>
                )}

                {/* Health Records List */}
                {!loadingHealthRecords && !healthRecordsError && (
                  <div className="health-records-list">
                    {healthRecords.length > 0 ? (
                      healthRecords.map((record, index) => (
                        <div
                          key={`health-${record.id}-${record.studentId}-${index}`}
                          className="health-record-item"
                        >
                          <div className="record-header">
                            <div className="record-title">
                              <h5>{record.title}</h5>
                              <span className="record-date">{record.date}</span>
                            </div>
                            <div className="record-status">
                              <span
                                className={`status-badge ${
                                  record.isConfirmed ? "confirmed" : "pending"
                                }`}
                              >
                                {record.isConfirmed
                                  ? "✅ Đã xác nhận"
                                  : "⏳ Chờ xác nhận"}
                              </span>
                            </div>
                          </div>

                          <div className="record-content">
                            <p className="record-description">
                              {record.description}
                            </p>

                            <div className="record-details">
                              <div className="detail-item">
                                <strong>Loại:</strong> {record.categoryName}
                              </div>
                              {record.staffId && (
                                <div className="detail-item">
                                  <strong>Nhân viên:</strong> ID{" "}
                                  {record.staffId}
                                </div>
                              )}
                              {record.createdBy && (
                                <div className="detail-item">
                                  <strong>Tạo bởi:</strong> {record.createdBy}
                                </div>
                              )}
                              {record.modifiedDate && (
                                <div className="detail-item">
                                  <strong>Sửa lần cuối:</strong>{" "}
                                  {record.modifiedDate}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-records">
                        <div className="no-records-icon">📭</div>
                        <p>Chưa có hồ sơ sức khỏe nào</p>
                        <small>
                          Học sinh chưa có bản ghi y tế trong hệ thống
                        </small>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="modal-actions">
                <button
                  className="btn-close"
                  onClick={() => setShowHealthModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;
