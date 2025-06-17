import React, { useRef } from "react";
import { useCRUD, useFilter, useModal } from "../../utils/hooks/useCRUD";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import SearchFilters from "../../components/common/SearchFilters";
import "../../styles/main.scss";

function StudentListOptimized() {
  // Custom hooks
  const {
    data: students,
    loading,
    error,
    uploadFile,
  } = useCRUD([
    // Mock data moved to separate file or API
    {
      id: 1,
      studentId: "MN001",
      fullName: "Nguyễn Văn An",
      dateOfBirth: "2020-05-15",
      gender: "Nam",
      className: "Mầm",
      parentName: "Nguyễn Thị Hoa",
      parentPhone: "0912345678",
      healthStatus: "Bình thường",
      allergies: "Không",
    },
    // ... other mock data
  ]);

  const { filteredData, searchTerm, setSearchTerm, updateFilter } =
    useFilter(students);
  const { isOpen, mode, currentItem, openModal, closeModal } = useModal();
  const fileInputRef = useRef(null);

  // Configuration
  const API_ENDPOINT = ""; // API endpoint
  const classes = ["Mầm", "Chồi", "Lá 1", "Lá 2", "Lá 3"];

  // Table columns configuration
  const columns = [
    { key: "studentId", header: "Mã học sinh", width: "10%" },
    {
      key: "fullName",
      header: "Họ và tên",
      width: "20%",
      render: (value, row) => (
        <div className="name-cell">
          <div className="user-avatar">{value.charAt(0)}</div>
          <span>{value}</span>
        </div>
      ),
    },
    { key: "className", header: "Lớp", width: "10%" },
    { key: "parentName", header: "Phụ huynh", width: "20%" },
    { key: "parentPhone", header: "SĐT", width: "15%" },
    {
      key: "healthStatus",
      header: "Tình trạng sức khỏe",
      width: "15%",
      render: (value) => (
        <span className={`status-badge ${getHealthStatusClass(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      width: "10%",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => openModal(row, "view")}
          >
            👁️
          </button>
        </div>
      ),
    },
  ];

  // Filter configuration
  const filters = [
    {
      key: "className",
      placeholder: "Chọn lớp",
      value: "",
      options: classes.map((cls) => ({ value: cls, label: cls })),
    },
  ];

  // Helper functions
  const getHealthStatusClass = (status) => {
    switch (status) {
      case "Bình thường":
        return "status-success";
      case "Có dị ứng":
      case "Cần theo dõi":
        return "status-warning";
      default:
        return "status-success";
    }
  };

  // File import handlers
  const handleFileImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await uploadFile(API_ENDPOINT, file, { type: "student_import" });
      // Success handled by hook
    } catch (error) {
      console.error("Import error:", error);
    }

    event.target.value = "";
  };

  // Loading & Error states
  if (loading)
    return (
      <div className="container">
        <div className="loading-container">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <div className="error-container">
          <p>Lỗi: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Danh Sách Học Sinh</h1>
          <p>Quản lý thông tin học sinh mầm non</p>
        </div>
      </div>

      {/* Search & Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={updateFilter}
        onImport={handleFileImport}
        importLoading={loading}
      />

      {/* Students Table */}
      <Table
        data={filteredData}
        columns={columns}
        loading={loading}
        emptyMessage="Không tìm thấy học sinh nào"
      />

      {/* Student Detail Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Thông Tin Chi Tiết Học Sinh"
      >
        {currentItem && (
          <div className="student-details">
            <div className="form-row">
              <div className="form-group">
                <label>Mã học sinh:</label>
                <p>{currentItem.studentId}</p>
              </div>
              <div className="form-group">
                <label>Họ và tên:</label>
                <p>{currentItem.fullName}</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Ngày sinh:</label>
                <p>{currentItem.dateOfBirth}</p>
              </div>
              <div className="form-group">
                <label>Giới tính:</label>
                <p>{currentItem.gender}</p>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Lớp:</label>
                <p>{currentItem.className}</p>
              </div>
              <div className="form-group">
                <label>Tình trạng sức khỏe:</label>
                <span
                  className={`status-badge ${getHealthStatusClass(
                    currentItem.healthStatus
                  )}`}
                >
                  {currentItem.healthStatus}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label>Phụ huynh:</label>
              <p>{currentItem.parentName}</p>
            </div>
            <div className="form-group">
              <label>Số điện thoại:</label>
              <p>{currentItem.parentPhone}</p>
            </div>
            <div className="form-group">
              <label>Dị ứng:</label>
              <p>{currentItem.allergies}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
      />
    </div>
  );
}

export default StudentListOptimized;
