import React, { useState, useEffect } from "react";
import "../../css/Parent/ManageHealthRecords.css";
import { useParentStudents } from "../../utils/hooks/useParent";

function ManageHealthRecords() {
  // Main states
  const [myChildren, setMyChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loadingHealthRecords, setLoadingHealthRecords] = useState(false);
  const [healthRecordsError, setHealthRecordsError] = useState("");

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
          const transformedStudents = studentsData.map((student) => ({
            id: student.id || student.studentid || Math.random(),
            studentId: student.id || student.studentid,
            fullName: student.fullname || "Không có tên",
            name: student.fullname || "Không có tên",
            studentCode: student.studentCode || "Không có mã",
            dateOfBirth: student.dob || "Không có thông tin",
            gender: student.gender === false ? "Nữ" : "Nam", // API: false = Nữ, true = Nam
            className: `Lớp ${student.classid || "?"}`,
            address: student.listparent?.[0]?.address || "Không có địa chỉ",
            healthStatus: "Bình thường", // Default value
            age: student.age || 0,
            bloodType: student.bloodType || "Không có thông tin",
            classId: student.classid,
            parentId: student.parentid,
            isDeleted: student.isDeleted || false,
            avatar: student.gender === false ? "👧" : "👦", // Nữ = 👧, Nam = 👦
            parentInfo: student.listparent?.[0] || {},
            healthRecords: [], // Initialize empty, will be loaded on demand
          }));

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

  // Fetch health records for a specific student
  const fetchHealthRecordsByStudent = async (studentId, studentCode) => {
    console.log(`🔍 Fetching health records for studentId: ${studentId}`);
    try {
      const response = await fetch(
        `https://api-schoolhealth.purintech.id.vn/api/HealthRecord/getByStudentId/${studentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        console.error(
          `⚠️ Cannot get health records for student ${studentCode}. Status: ${response.status}`
        );
        return [];
      }

      let data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("❌ Error calling health records API:", err);
      return [];
    }
  };

  // Handle view health records for a child
  const handleViewHealthRecords = async (child) => {
    console.log("🏥 Viewing health records for child:", child);

    setSelectedChild(child);
    setShowHealthModal(true);
    setLoadingHealthRecords(true);
    setHealthRecordsError("");

    try {
      const healthRecords = await fetchHealthRecordsByStudent(
        child.studentId || child.id,
        child.studentCode
      );

      const mappedRecords = healthRecords.map((record) => ({
        id: record.healthrecordid || record.id || Math.random(),
        type: record.healthcategoryid
          ? `Loại ${record.healthcategoryid}`
          : "Khám định kỳ",
        title: record.healthrecordtitle || "Kiểm tra sức khỏe",
        description: record.healthrecorddescription || "Không có mô tả",
        severity: record.isconfirm ? "Đã xác nhận" : "Chưa xác nhận",
        date: record.healthrecorddate
          ? new Date(record.healthrecorddate).toLocaleDateString("vi-VN")
          : new Date().toLocaleDateString("vi-VN"),
        doctor: record.staffid
          ? `Nhân viên ID: ${record.staffid}`
          : "Y tá trường",
        medications: [],
        notes: record.healthrecorddescription || "",
        status: record.isconfirm ? "Đã xác nhận" : "Chưa xác nhận",
        isConfirm: record.isconfirm,
        // Additional API fields
        healthCategoryId: record.healthcategoryid,
        staffId: record.staffid,
        createdBy: record.createdby,
        createdDate: record.createddate,
        modifiedBy: record.modifiedby,
        modifiedDate: record.modifieddate,
        isDeleted: record.isdeleted,
      }));

      // Update the selected child with health records
      const updatedChild = { ...child, healthRecords: mappedRecords };
      setSelectedChild(updatedChild);
    } catch (error) {
      console.error("Error fetching health records:", error);
      setHealthRecordsError("Không thể tải hồ sơ sức khỏe");
    } finally {
      setLoadingHealthRecords(false);
    }
  };

  // Helper function to get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Đã xác nhận":
        return "#28a745";
      case "Chưa xác nhận":
        return "#ffc107";
      default:
        return "#6c757d";
    }
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
                <span className="value">Lớp {child.classId}</span>
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

      {/* Health Records Modal */}
      {showHealthModal && selectedChild && (
        <div
          className="modal-overlay"
          onClick={() => setShowHealthModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🏥 Hồ Sơ Sức Khỏe - {selectedChild.fullName}</h3>
              <button
                className="modal-close"
                onClick={() => setShowHealthModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Child Info */}
              <div className="child-summary">
                <div className="summary-item">
                  <span className="summary-label">Mã học sinh:</span>
                  <span className="summary-value">
                    {selectedChild.studentCode}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Giới tính:</span>
                  <span className="summary-value">{selectedChild.gender}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Tuổi:</span>
                  <span className="summary-value">{selectedChild.age}</span>
                </div>
              </div>

              {/* Health Records */}
              <div className="health-records-section">
                <h4>📋 Danh sách hồ sơ y tế</h4>

                {loadingHealthRecords && (
                  <div className="loading-health">
                    <p>⏳ Đang tải hồ sơ sức khỏe...</p>
                  </div>
                )}

                {healthRecordsError && (
                  <div className="error-health">
                    <p>❌ {healthRecordsError}</p>
                    <button
                      onClick={() => handleViewHealthRecords(selectedChild)}
                      className="retry-health-btn"
                    >
                      🔄 Thử lại
                    </button>
                  </div>
                )}

                {!loadingHealthRecords &&
                  !healthRecordsError &&
                  selectedChild.healthRecords && (
                    <div className="records-list">
                      {selectedChild.healthRecords.length > 0 ? (
                        <>
                          <p className="records-summary">
                            📊 <strong>Tổng cộng:</strong>{" "}
                            {selectedChild.healthRecords.length} hồ sơ y tế
                          </p>
                          {selectedChild.healthRecords
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .map((record, index) => (
                              <div key={record.id} className="record-item">
                                <div className="record-header">
                                  <div className="record-title">
                                    <h5>
                                      <span className="record-number">
                                        #{index + 1}
                                      </span>
                                      {record.title}
                                    </h5>
                                    <span className="record-type">
                                      {record.type}
                                    </span>
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
                                    <span className="record-date">
                                      {record.date}
                                    </span>
                                  </div>
                                </div>

                                <div className="record-content">
                                  <p>
                                    <strong>📝 Mô tả:</strong>{" "}
                                    {record.description}
                                  </p>
                                  <p>
                                    <strong>👨‍⚕️ Nhân viên y tế:</strong>{" "}
                                    {record.doctor}
                                  </p>
                                  <p>
                                    <strong>📋 Loại khám:</strong> {record.type}
                                  </p>
                                  {record.medications &&
                                    record.medications.length > 0 && (
                                      <p>
                                        <strong>💊 Thuốc:</strong>{" "}
                                        {record.medications.join(", ")}
                                      </p>
                                    )}
                                  <p>
                                    <strong>📝 Ghi chú:</strong> {record.notes}
                                  </p>
                                  <p>
                                    <strong>✅ Trạng thái:</strong>
                                    <span
                                      className={`status-badge ${
                                        record.isConfirm
                                          ? "confirmed"
                                          : "pending"
                                      }`}
                                    >
                                      {record.status}
                                    </span>
                                  </p>
                                  <p className="record-timestamp">
                                    <strong>📅 Ngày khám:</strong> {record.date}
                                  </p>
                                  {record.createdDate && (
                                    <p className="record-created">
                                      <strong>📅 Ngày tạo:</strong>{" "}
                                      {new Date(
                                        record.createdDate
                                      ).toLocaleDateString("vi-VN")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                        </>
                      ) : (
                        <div className="no-records">
                          <div className="no-records-icon">📭</div>
                          <p>Chưa có hồ sơ y tế</p>
                          <small>Con em chưa có bản ghi y tế nào</small>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowHealthModal(false)}
                className="close-btn"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageHealthRecords;
