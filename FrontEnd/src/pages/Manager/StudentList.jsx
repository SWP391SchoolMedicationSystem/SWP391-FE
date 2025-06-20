import React, { useState, useRef } from "react";
import "../../css/Manager/StudentList.css";
import {
  useManagerStudents,
  useManagerActions,
} from "../../utils/hooks/useManager";

function StudentList() {
  // Use API hooks
  const { data: students, loading, error, refetch } = useManagerStudents();
  const { importStudentsExcel } = useManagerActions();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const fileInputRef = useRef(null);

  // Available classes for preschool (updated to match API classid)
  const classes = [
    { value: "", label: "Tất cả lớp" },
    { value: "1", label: "Lớp 1" },
    { value: "2", label: "Lớp 2" },
    { value: "3", label: "Lớp 3" },
    { value: "4", label: "Lớp 4" },
    { value: "5", label: "Lớp 5" },
  ];

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
      "application/csv", // .csv alternative
      "text/plain", // Sometimes CSV is detected as plain text
      "", // Some browsers don't set type for certain files
    ];

    const allowedExtensions = ["xlsx", "xls", "csv"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Check by extension if type check fails
    const isValidType =
      allowedTypes.includes(file.type) ||
      allowedExtensions.includes(fileExtension);

    if (!isValidType) {
      return `File không được hỗ trợ. Chỉ chấp nhận: .xlsx, .xls, .csv`;
    }

    if (file.size > maxSize) {
      return "File quá lớn. Vui lòng chọn file nhỏ hơn 10MB";
    }

    return null;
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
      const result = await importStudentsExcel(file);

      // Handle success
      setImportSuccess(
        `Import thành công! Đã thêm ${
          result.importedCount || result.count || "nhiều"
        } học sinh.`
      );

      // Refresh student list
      refetch();
    } catch (error) {
      console.error("Import error:", error);

      // Handle specific error types
      let errorMessage = "Không thể import file";

      if (error.response?.status === 415) {
        errorMessage = `API chưa hỗ trợ import file Excel. Vui lòng liên hệ Backend team để thêm endpoint /api/Student/ImportExcel`;
      } else if (error.response?.status === 400) {
        errorMessage = `Dữ liệu không hợp lệ: ${
          error.response?.data?.message ||
          "Kiểm tra lại format dữ liệu trong file"
        }`;
      } else if (error.response?.status === 413) {
        errorMessage =
          "File quá lớn. Vui lòng chọn file nhỏ hơn hoặc chia nhỏ dữ liệu";
      } else if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại";
      } else if (error.response?.status === 403) {
        errorMessage = "Bạn không có quyền import dữ liệu";
      } else if (error.response?.status >= 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau hoặc liên hệ admin";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setImportError(errorMessage);
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = "";
    }
  };

  // Download Excel template
  const downloadTemplate = () => {
    // Create Excel template data with proper structure
    const templateData = [
      {
        "Họ và tên": "Nguyễn Văn A",
        "Mã học sinh": "HS001",
        "Ngày sinh": "01/01/2018",
        "Giới tính": "Nam",
        Lớp: "1",
        "Tên phụ huynh": "Nguyễn Văn B",
        "Số điện thoại": "0123456789",
        "Email phụ huynh": "parent1@example.com",
        "Địa chỉ": "123 Đường ABC, Quận XYZ",
      },
      {
        "Họ và tên": "Trần Thị C",
        "Mã học sinh": "HS002",
        "Ngày sinh": "15/06/2019",
        "Giới tính": "Nữ",
        Lớp: "2",
        "Tên phụ huynh": "Trần Văn D",
        "Số điện thoại": "0987654321",
        "Email phụ huynh": "parent2@example.com",
        "Địa chỉ": "456 Đường XYZ, Quận ABC",
      },
      {
        "Họ và tên": "Lê Minh E",
        "Mã học sinh": "HS003",
        "Ngày sinh": "30/12/2017",
        "Giới tính": "Nam",
        Lớp: "3",
        "Tên phụ huynh": "Lê Thị F",
        "Số điện thoại": "0369852147",
        "Email phụ huynh": "parent3@example.com",
        "Địa chỉ": "789 Đường DEF, Quận MNO",
      },
    ];

    // Convert to CSV format with UTF-8 BOM for Excel compatibility
    const headers = Object.keys(templateData[0]);
    const csvContent = [
      headers.join(","),
      ...templateData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Wrap in quotes and escape internal quotes
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\r\n"); // Use Windows line endings for better Excel compatibility

    // Create and download file with proper CSV encoding
    const BOM = "\uFEFF"; // UTF-8 BOM for Excel to recognize UTF-8
    const blob = new Blob([BOM + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_danh_sach_hoc_sinh.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

          <button
            className="download-template-btn"
            onClick={downloadTemplate}
            title="Tải file mẫu Excel"
          >
            📥 Tải file mẫu
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
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
    </div>
  );
}

export default StudentList;
