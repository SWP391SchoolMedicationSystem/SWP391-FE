import React, { useState, useEffect } from "react";
import "../../css/Parent/ManageHealthRecords.css";
import apiClient from "../../services/config";

function ManageHealthRecords() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Health records modal states
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loadingHealthRecords, setLoadingHealthRecords] = useState(false);
  const [healthRecordsError, setHealthRecordsError] = useState("");

  useEffect(() => {
    fetchMyChildren();
  }, []);

  const fetchMyChildren = async () => {
    try {
      setLoading(true);
      setError("");

      // Get parent ID from localStorage
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const parentId = userInfo.userId;

      console.log("👨‍👩‍👧‍👦 Parent ID from localStorage:", parentId);

      if (!parentId) {
        throw new Error("Không tìm thấy thông tin phụ huynh");
      }

      // Call API to get children by parent ID
      const apiUrl = `https://api-schoolhealth.purintech.id.vn/api/Student/GetStudentByParentId/${parentId}`;
      console.log("🌐 Calling API:", apiUrl);

      const response = await apiClient.get(
        `/Student/GetStudentByParentId/${parentId}`
      );
      console.log("📥 Raw children data:", response);

      if (Array.isArray(response)) {
        const mappedChildren = response.map((child) => ({
          studentId: child.studentId,
          studentCode: child.studentCode,
          fullname: child.fullname,
          dateOfBirth: child.dob,
          gender: child.gender === true ? "Nam" : "Nữ",
          age: child.age,
          bloodType: child.bloodType,
          classId: child.classid,
          avatar: child.gender === true ? "👦" : "👧",
        }));

        console.log("✅ Mapped children:", mappedChildren);
        setChildren(mappedChildren);
      } else {
        setChildren([]);
      }
    } catch (err) {
      console.error("❌ Error fetching children:", err);
      setError(`Không thể tải danh sách con em: ${err.message}`);
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHealthRecords = async (child) => {
    console.log("🏥 Viewing health records for child:", child);
    console.log("🆔 Student ID:", child.studentId);

    setSelectedChild(child);
    setShowHealthModal(true);
    setLoadingHealthRecords(true);
    setHealthRecordsError("");

    try {
      // Call API to get health records by student ID
      const apiUrl = `https://api-schoolhealth.purintech.id.vn/api/HealthRecord/getByStudentId?studentId=${child.studentId}`;
      console.log("🌐 Calling Health Records API:", apiUrl);

      const response = await apiClient.get(
        `/HealthRecord/getByStudentId?studentId=${child.studentId}`
      );
      console.log("📥 Raw health records:", response);

      if (Array.isArray(response)) {
        // Filter out deleted records and map data
        const validRecords = response.filter((record) => !record.isdeleted);

        const mappedRecords = validRecords.map((record) => ({
          id: record.healthrecordid,
          title: record.healthrecordtitle,
          description: record.healthrecorddescription,
          date: new Date(record.healthrecorddate).toLocaleDateString("vi-VN"),
          categoryId: record.healthcategoryid,
          isConfirmed: record.isconfirm,
          createdBy: record.createdby || "Hệ thống",
          modifiedBy: record.modifiedby,
          modifiedDate: record.modifieddate
            ? new Date(record.modifieddate).toLocaleDateString("vi-VN")
            : null,
          status: record.isconfirm ? "Đã xác nhận" : "Chờ xác nhận",
        }));

        console.log("✅ Mapped health records:", mappedRecords);
        setHealthRecords(mappedRecords);
      } else {
        setHealthRecords([]);
      }
    } catch (error) {
      console.error("❌ Error loading health records:", error);
      setHealthRecordsError(`Không thể tải hồ sơ sức khỏe: ${error.message}`);
      setHealthRecords([]);
    } finally {
      setLoadingHealthRecords(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const categories = {
      1: "Khám tổng quát",
      2: "Dị ứng",
      3: "Tiêm chủng",
      4: "Khám định kỳ",
      5: "Tai nạn/Chấn thương",
      6: "Khác",
    };
    return categories[categoryId] || `Danh mục ${categoryId}`;
  };

  if (loading) {
    return (
      <div className="health-records-container">
        <div className="loading-state">
          <p>⏳ Đang tải danh sách con em...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="health-records-container">
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={fetchMyChildren} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="health-records-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>🏥 Hồ Sơ Sức Khỏe Con Em</h1>
          <p>Theo dõi tình trạng sức khỏe của các con</p>
        </div>
        <button onClick={fetchMyChildren} className="refresh-btn">
          🔄 Tải lại
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">👶</div>
          <div className="stat-content">
            <h3>{children.length}</h3>
            <p>Tổng số con</p>
          </div>
        </div>
      </div>

      {/* Children Cards */}
      <div className="children-grid">
        {children.length > 0 ? (
          children.map((child) => (
            <div key={child.studentId} className="child-card">
              <div className="card-header">
                <div className="child-avatar">{child.avatar}</div>
                <div className="child-info">
                  <h3>{child.fullname}</h3>
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
          ))
        ) : (
          <div className="no-children">
            <div className="no-children-icon">👶</div>
            <p>Không tìm thấy con em nào</p>
            <small>Liên hệ nhà trường để cập nhật thông tin</small>
          </div>
        )}
      </div>

      {/* Health Records Modal */}
      {showHealthModal && selectedChild && (
        <div
          className="modal-overlay"
          onClick={() => setShowHealthModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🏥 Hồ Sơ Sức Khỏe - {selectedChild.fullname}</h3>
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

                {!loadingHealthRecords && !healthRecordsError && (
                  <div className="records-list">
                    {healthRecords.length > 0 ? (
                      healthRecords.map((record) => (
                        <div key={record.id} className="record-card">
                          <div className="record-header">
                            <div className="record-title">
                              <h5>{record.title}</h5>
                              <span className="record-category">
                                {getCategoryName(record.categoryId)}
                              </span>
                            </div>
                            <div className="record-meta">
                              <span className="record-date">{record.date}</span>
                              <span
                                className={`record-status ${
                                  record.isConfirmed ? "confirmed" : "pending"
                                }`}
                              >
                                {record.status}
                              </span>
                            </div>
                          </div>

                          <div className="record-content">
                            <p>{record.description}</p>

                            <div className="record-footer">
                              <span className="created-by">
                                Tạo bởi: {record.createdBy}
                              </span>
                              {record.modifiedDate && (
                                <span className="modified-date">
                                  Cập nhật: {record.modifiedDate}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
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
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageHealthRecords;
