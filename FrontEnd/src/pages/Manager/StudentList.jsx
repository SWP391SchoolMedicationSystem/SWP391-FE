import React, { useState, useRef } from "react";
import "../../css/Manager/StudentList.css";

function StudentList() {
  // Mock data for preschool students
  const [students] = useState([
    {
      id: 1,
      studentId: "MN001",
      fullName: "Nguyễn Văn An",
      dateOfBirth: "2020-05-15",
      gender: "Nam",
      className: "Mầm",
      parentName: "Nguyễn Thị Hoa",
      parentPhone: "0912345678",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      healthStatus: "Bình thường",
      allergies: "Không",
      emergencyContact: "0987654321",
      enrollmentDate: "2024-01-15",
      bloodType: "O+",
      height: "95cm",
      weight: "14kg",
      notes: "Bé khỏe mạnh, hoạt bát",
    },
    {
      id: 2,
      studentId: "MN002",
      fullName: "Trần Thị Bình",
      dateOfBirth: "2020-08-22",
      gender: "Nữ",
      className: "Chồi",
      parentName: "Trần Văn Nam",
      parentPhone: "0923456789",
      address: "456 Đường DEF, Quận 2, TP.HCM",
      healthStatus: "Có dị ứng",
      allergies: "Dị ứng với sữa bò",
      emergencyContact: "0976543210",
      enrollmentDate: "2024-01-20",
      bloodType: "A+",
      height: "92cm",
      weight: "13.5kg",
      notes: "Cần chú ý chế độ ăn",
    },
    {
      id: 3,
      studentId: "MN003",
      fullName: "Lê Minh Cường",
      dateOfBirth: "2019-12-10",
      gender: "Nam",
      className: "Lá 1",
      parentName: "Lê Thị Mai",
      parentPhone: "0934567890",
      address: "789 Đường GHI, Quận 3, TP.HCM",
      healthStatus: "Bình thường",
      allergies: "Không",
      emergencyContact: "0965432109",
      enrollmentDate: "2023-09-01",
      bloodType: "B+",
      height: "98cm",
      weight: "15kg",
      notes: "Bé thông minh, ham học hỏi",
    },
    {
      id: 4,
      studentId: "MN004",
      fullName: "Phạm Thị Diệu",
      dateOfBirth: "2019-03-08",
      gender: "Nữ",
      className: "Lá 2",
      parentName: "Phạm Văn Hùng",
      parentPhone: "0945678901",
      address: "321 Đường JKL, Quận 4, TP.HCM",
      healthStatus: "Cần theo dõi",
      allergies: "Dị ứng phấn hoa",
      emergencyContact: "0954321098",
      enrollmentDate: "2023-09-01",
      bloodType: "AB+",
      height: "102cm",
      weight: "16kg",
      notes: "Cần chú ý khi ra ngoài trời",
    },
    {
      id: 5,
      studentId: "MN005",
      fullName: "Hoàng Văn Em",
      dateOfBirth: "2019-07-30",
      gender: "Nam",
      className: "Lá 3",
      parentName: "Hoàng Thị Lan",
      parentPhone: "0956789012",
      address: "654 Đường MNO, Quận 5, TP.HCM",
      healthStatus: "Bình thường",
      allergies: "Không",
      emergencyContact: "0943210987",
      enrollmentDate: "2023-09-01",
      bloodType: "O-",
      height: "105cm",
      weight: "17kg",
      notes: "Bé năng động, thích chơi thể thao",
    },
    {
      id: 6,
      studentId: "MN006",
      fullName: "Võ Thị Phượng",
      dateOfBirth: "2020-11-18",
      gender: "Nữ",
      className: "Chồi",
      parentName: "Võ Văn Giang",
      parentPhone: "0967890123",
      address: "987 Đường PQR, Quận 6, TP.HCM",
      healthStatus: "Bình thường",
      allergies: "Không",
      emergencyContact: "0932109876",
      enrollmentDate: "2024-01-15",
      bloodType: "A-",
      height: "90cm",
      weight: "13kg",
      notes: "Bé nhút nhát, cần khuyến khích",
    },
  ]);

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const fileInputRef = useRef(null);

  // Available classes for preschool
  const classes = ["Mầm", "Chồi", "Lá 1", "Lá 2", "Lá 3"];

  // Filter students based on search and class filter
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass =
      filterClass === "" || student.className === filterClass;
    return matchesSearch && matchesClass;
  });

  // Handle viewing student information
  const handleViewStudent = (student) => {
    setCurrentStudent(student);
    setShowModal(true);
  };

  // Handle file import
  const handleFileImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Here you would normally send the file to your backend API
      console.log("File selected:", file.name);
      alert(`Đã chọn file: ${file.name}\nSẽ gửi đến API backend để xử lý.`);

      // Reset file input
      event.target.value = "";
    }
  };

  // Get health status badge class
  const getHealthStatusClass = (status) => {
    switch (status) {
      case "Bình thường":
        return "status-normal";
      case "Cần theo dõi":
        return "status-watch";
      case "Có dị ứng":
        return "status-allergy";
      default:
        return "status-normal";
    }
  };

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <h1>Danh Sách Học Sinh</h1>
        <p>Quản lý thông tin học sinh trường mầm non</p>
      </div>

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
              <option value="">Tất cả lớp</option>
              {classes.map((className) => (
                <option key={className} value={className}>
                  {className}
                </option>
              ))}
            </select>
          </div>

          <button className="import-btn" onClick={handleFileImport}>
            📁 Import File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".xlsx,.xls,.csv"
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Student Table */}
      <div className="table-container">
        <table className="student-table">
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
                  <div className="student-info">
                    <strong>{student.fullName}</strong>
                    <small>{student.bloodType}</small>
                  </div>
                </td>
                <td className="class-name">{student.className}</td>
                <td>
                  <div className="parent-info">
                    <div>{student.parentName}</div>
                    <small>{student.parentPhone}</small>
                  </div>
                </td>
                <td>{student.dateOfBirth}</td>
                <td>{student.gender}</td>
                <td>
                  <span
                    className={`health-status ${getHealthStatusClass(
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
                    <label>Giới tính:</label>
                    <span>{currentStudent.gender}</span>
                  </div>
                  <div className="detail-item">
                    <label>Lớp:</label>
                    <span>{currentStudent.className}</span>
                  </div>
                  <div className="detail-item">
                    <label>Ngày nhập học:</label>
                    <span>{currentStudent.enrollmentDate}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tình trạng sức khỏe:</label>
                    <span
                      className={`health-status ${getHealthStatusClass(
                        currentStudent.healthStatus
                      )}`}
                    >
                      {currentStudent.healthStatus}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Dị ứng:</label>
                    <span>{currentStudent.allergies}</span>
                  </div>
                  <div className="detail-item">
                    <label>Nhóm máu:</label>
                    <span>{currentStudent.bloodType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Chiều cao:</label>
                    <span>{currentStudent.height}</span>
                  </div>
                  <div className="detail-item">
                    <label>Cân nặng:</label>
                    <span>{currentStudent.weight}</span>
                  </div>
                  <div className="detail-item">
                    <label>Tên phụ huynh:</label>
                    <span>{currentStudent.parentName}</span>
                  </div>
                  <div className="detail-item">
                    <label>SĐT phụ huynh:</label>
                    <span>{currentStudent.parentPhone}</span>
                  </div>
                  <div className="detail-item">
                    <label>SĐT khẩn cấp:</label>
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
