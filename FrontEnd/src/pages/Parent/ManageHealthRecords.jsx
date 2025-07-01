import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Parent/ManageHealthRecords.css";
import { useParentStudents } from "../../utils/hooks/useParent";

function ManageHealthRecords() {
  const navigate = useNavigate();

  // Main states
  const [myChildren, setMyChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get students of current parent
  const {
    data: studentsData,
    loading: studentsLoading,
    error: studentsError,
  } = useParentStudents();

  // Fetch health records for all students
  useEffect(() => {
    const fetchChildrenWithHealthRecords = async () => {
      if (studentsData && studentsData.length > 0) {
        try {
          setLoading(true);
          setError(null);

          // Transform raw API data to component format
          const transformedStudents = studentsData.map((student) => {
            console.log("🔍 Raw student data từ API:", student);
            console.log("🆔 StudentId từ API:", student.studentId);

            return {
              id: student.studentId, // Sử dụng studentId từ API
              studentId: student.studentId, // Field chính để identify
              fullName: student.fullname || "Không có tên",
              name: student.fullname || "Không có tên",
              studentCode: student.studentCode || "Không có mã",
              dateOfBirth: student.dob || "Không có thông tin",
              gender: student.gender === false ? "Nữ" : "Nam", // API: false = Nữ, true = Nam
              className: student.classname || "Không có lớp", // Sử dụng classname từ API
              address: student.parent?.address || "Không có địa chỉ", // Sử dụng parent.address
              healthStatus: "Bình thường", // Default value
              age: student.age || 0,
              bloodType: student.bloodType || "Không có thông tin",
              classId: student.classname || "Không có lớp",
              parentId: student.parent?.parentid, // Sử dụng parent.parentid
              isDeleted: false, // Default value
              avatar: student.gender === false ? "👧" : "👦", // Nữ = 👧, Nam = 👦
              parentInfo: student.parent || {}, // Sử dụng parent object
              healthRecords: [], // Initialize empty, will be loaded on demand
            };
          });

          console.log("🔄 Transformed students:", transformedStudents);
          setMyChildren(transformedStudents);
        } catch (error) {
          console.error("Error processing children data:", error);
          setError("Không thể xử lý thông tin con em");
        } finally {
          setLoading(false);
        }
      } else if (studentsData && studentsData.length === 0) {
        // If no students found, show empty state
        setMyChildren([]);
        setLoading(false);
      }
    };

    if (!studentsLoading) {
      fetchChildrenWithHealthRecords();
    }
  }, [studentsData, studentsLoading]);

  // Handle view health records for a child
  const handleViewHealthRecords = (child) => {
    console.log("🏥 Viewing health records for child:", child);
    console.log("🔍 StudentId from card:", child.studentId);
    console.log("📋 StudentCode from card:", child.studentCode);
    console.log("👤 Student name:", child.fullName);
    console.log(
      "📋 Chuyển sang trang chi tiết hồ sơ sức khỏe với studentId:",
      child.studentId
    );

    // Chuyển trang đến trang chi tiết hồ sơ sức khỏe
    navigate(`/parent/health-records/${child.studentId}`);
  };

  // Show loading state
  if (loading || studentsLoading) {
    return (
      <div className="parent-health-records-container">
        <div className="loading-state">
          <p>⏳ Đang tải thông tin sức khỏe con em...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || studentsError) {
    return (
      <div className="parent-health-records-container">
        <div className="error-state">
          <p>❌ Lỗi: {error || studentsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-btn"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Show empty state if no children data
  if (!loading && !error && myChildren.length === 0) {
    return (
      <div className="parent-health-records-container">
        <div className="page-header">
          <div className="header-content">
            <h1>👨‍👩‍👧‍👦 Hồ Sơ Sức Khỏe Con Em</h1>
            <p>Theo dõi tình trạng sức khỏe và hồ sơ y tế của con em</p>
          </div>
        </div>
        <div className="empty-state">
          <p>📭 Chưa có thông tin con em hoặc chưa có dữ liệu sức khỏe</p>
          <p>Vui lòng liên hệ nhà trường để cập nhật thông tin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="parent-health-records-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>🏥 Hồ Sơ Sức Khỏe Con Em</h1>
          <p>Theo dõi tình trạng sức khỏe của các con</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="refresh-btn"
        >
          🔄 Tải lại
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">👶</div>
          <div className="stat-content">
            <h3>{myChildren.length}</h3>
            <p>Tổng số con</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏥</div>
          <div className="stat-content">
            <h3>
              {myChildren.reduce(
                (sum, child) => sum + (child.healthRecords?.length || 0),
                0
              )}
            </h3>
            <p>Tổng hồ sơ y tế</p>
          </div>
        </div>
      </div>

      {/* Children Cards */}
      <div className="children-grid">
        {myChildren.map((child) => (
          <div key={child.studentId || child.id} className="child-card">
            <div className="card-header">
              <div className="child-avatar">{child.avatar}</div>
              <div className="child-info">
                <h3>{child.fullName}</h3>
                <p>Mã HS: {child.studentCode}</p>
              </div>
            </div>

            <div className="card-body">
              <div className="info-row">
                <span className="label">Ngày sinh:</span>
                <span className="value">{child.dateOfBirth}</span>
              </div>
              <div className="info-row">
                <span className="label">Giới tính:</span>
                <span className="value">{child.gender}</span>
              </div>
              <div className="info-row">
                <span className="label">Tuổi:</span>
                <span className="value">{child.age}</span>
              </div>
              <div className="info-row">
                <span className="label">Nhóm máu:</span>
                <span className="value">{child.bloodType}</span>
              </div>
              <div className="info-row">
                <span className="label">Lớp:</span>
                <span className="value">{child.className}</span>
              </div>
            </div>

            <div className="card-footer">
              <button
                className="health-records-btn"
                onClick={() => handleViewHealthRecords(child)}
              >
                🏥 Xem hồ sơ sức khỏe
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageHealthRecords;
