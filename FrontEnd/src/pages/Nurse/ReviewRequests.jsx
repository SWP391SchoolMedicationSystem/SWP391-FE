import React, { useState, useEffect } from "react";
import { nurseFormService } from "../../services/nurseService";
import { useNurseActions } from "../../utils/hooks/useNurse";
import "../../css/Nurse/ReviewRequests.css";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import CategoryIcon from "@mui/icons-material/Category";
import DateRangeIcon from "@mui/icons-material/DateRange";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";

function ReviewRequests() {
  const { 
    approveForm, 
    declineForm, 
    deleteForm, 
    getFormsByParent, 
    getFormsByCategory 
  } = useNurseActions();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterParent, setFilterParent] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'approve', 'decline', or 'delete'
  const [declineReason, setDeclineReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch requests on component mount
  useEffect(() => {
    const fetchData = async () => {
      const allForms = await nurseFormService.getAllForms();
      setRequests(allForms.filter(form => !form.isDeleted));
    };
    fetchData();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("🔄 Fetching form requests from API...");
      const response = await nurseFormService.getAllForms();
      console.log("✅ API Response:", response);
      const activeForms = response.filter(form => !form.isDeleted);
      setRequests(activeForms);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
      setError(`Không thể tải danh sách yêu cầu: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(request => !request.isDeleted);

  // Handle view request details
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Handle approve action
  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType("approve");
    setShowActionModal(true);
  };

  // Handle decline action
  const handleDecline = (request) => {
    setSelectedRequest(request);
    setActionType("decline");
    setDeclineReason("");
    setShowActionModal(true);
  };

  // Handle delete action
  const handleDelete = (request) => {
    setSelectedRequest(request);
    setActionType("delete");
    setShowActionModal(true);
  };

  // Submit action (approve, decline, or delete)
  const handleSubmitAction = async () => {
    if (!selectedRequest) return;

    if (actionType === "decline" && !declineReason.trim()) {
      alert("Vui lòng nhập lý do từ chối!");
      return;
    }

    try {
      setActionLoading(true);
      console.log(`🔄 ${actionType} request:`, selectedRequest.formId);
      
      let result;
      if (actionType === "approve") {
        result = await approveForm(selectedRequest.formId);
        console.log("✅ Approve result:", result);
      } else if (actionType === "decline") {
        result = await declineForm(selectedRequest.formId, declineReason);
        console.log("✅ Decline result:", result);
      } else if (actionType === "delete") {
        result = await deleteForm(selectedRequest.formId);
        console.log("✅ Delete result:", result);
      }

      // Refresh the requests list
      await fetchRequests();
      
      setShowActionModal(false);
      setSelectedRequest(null);
      setDeclineReason("");
      
      const messages = {
        approve: "Đã phê duyệt yêu cầu thành công!",
        decline: "Đã từ chối yêu cầu thành công!",
        delete: "Đã xóa yêu cầu thành công!"
      };
      alert(messages[actionType]);
    } catch (error) {
      console.error(`❌ Error ${actionType}ing request:`, error);
      const actionNames = {
        approve: "phê duyệt",
        decline: "từ chối", 
        delete: "xóa"
      };
      alert(`Có lỗi xảy ra khi ${actionNames[actionType]} yêu cầu: ${error.message || error}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (statusClass) => {
    return `status-badge status-${statusClass}`;
  };

  // Get category badge class
  const getCategoryBadgeClass = (categoryId) => {
    const categoryClasses = {
      1: "category-leave",
      2: "category-medicine", 
      3: "category-consultation",
      4: "category-other"
    };
    return `category-badge ${categoryClasses[categoryId] || "category-default"}`;
  };

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.statusClass === "pending").length,
    approved: requests.filter(r => r.statusClass === "approved").length,
    declined: requests.filter(r => r.statusClass === "declined").length,
  };

  if (loading) {
    return (
      <div className="review-requests-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>⏳ Đang tải danh sách yêu cầu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-requests-container">
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={fetchRequests} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-requests-container">
      {/* Header */}
      <div className="review-requests-header">
        <h1>📋 Kiểm Duyệt Yêu Cầu</h1>
        <p>Xem và phê duyệt các yêu cầu từ phụ huynh</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">
        <div className="stat-card total">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.total}</h3>
            <p>Tổng yêu cầu</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Chờ xử lý</p>
          </div>
        </div>
        <div className="stat-card approved">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.approved}</h3>
            <p>Đã phê duyệt</p>
          </div>
        </div>
        <div className="stat-card declined">
          <div className="stat-icon">❌</div>
          <div className="stat-info">
            <h3>{stats.declined}</h3>
            <p>Đã từ chối</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên phụ huynh, học sinh hoặc tiêu đề..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="approved">Đã phê duyệt</option>
            <option value="declined">Đã từ chối</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">Tất cả loại đơn</option>
            <option value="1">Đơn xin nghỉ phép</option>
            <option value="2">Đơn xin thuốc</option>
            <option value="3">Đơn xin tư vấn</option>
            <option value="4">Đơn khác</option>
          </select>
        </div>
        <div className="filter-group">
          <input
            type="number"
            placeholder="🔍 Lọc theo ID phụ huynh..."
            value={filterParent}
            onChange={(e) => setFilterParent(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="table-container">
        <table className="requests-table">
          <thead>
            <tr>
              <th>Thông tin phụ huynh</th>
              <th>Thông tin học sinh</th>
              <th>Loại đơn</th>
              <th>Tiêu đề</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.formId}>
                <td>
                  <div className="parent-info">
                    <div className="parent-name">{request.parentName}</div>
                    <div className="parent-id">ID: {request.parentId}</div>
                  </div>
                </td>
                <td>
                  <div className="student-info">
                    <div className="student-name">{request.studentName}</div>
                    <div className="student-id">ID: {request.studentId}</div>
                  </div>
                </td>
                <td>
                  <span className={getCategoryBadgeClass(request.formCategoryId)}>
                    {request.formCategoryName}
                  </span>
                </td>
                <td className="request-title">{request.title}</td>
                <td className="created-date">{request.createdDate}</td>
                <td>
                  <span className={getStatusBadgeClass(request.statusClass)}>
                    {request.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(request)}
                      title="Xem chi tiết"
                    >
                      <InfoIcon />
                    </button>
                    {request.statusClass === "pending" && (
                      <>
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(request)}
                          title="Phê duyệt"
                        >
                          <CheckCircleIcon />
                        </button>
                        <button
                          className="btn-decline"
                          onClick={() => handleDecline(request)}
                          title="Từ chối"
                        >
                          <CancelIcon />
                        </button>
                      </>
                    )}
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(request)}
                      title="Xóa yêu cầu"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRequests.length === 0 && (
          <div className="no-data">
            <p>Không tìm thấy yêu cầu nào</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <InfoIcon style={{ marginRight: "10px" }} />
                Chi tiết yêu cầu
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <PersonIcon className="detail-icon" />
                  <div>
                    <label>Phụ huynh:</label>
                    <span>{selectedRequest.parentName}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <ChildCareIcon className="detail-icon" />
                  <div>
                    <label>Học sinh:</label>
                    <span>{selectedRequest.studentName}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <CategoryIcon className="detail-icon" />
                  <div>
                    <label>Loại đơn:</label>
                    <span>{selectedRequest.formCategoryName}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <DateRangeIcon className="detail-icon" />
                  <div>
                    <label>Ngày tạo:</label>
                    <span>{selectedRequest.createdDate}</span>
                  </div>
                </div>
                <div className="detail-item full-width">
                  <DescriptionIcon className="detail-icon" />
                  <div>
                    <label>Tiêu đề:</label>
                    <span>{selectedRequest.title}</span>
                  </div>
                </div>
                <div className="detail-item full-width">
                  <DescriptionIcon className="detail-icon" />
                  <div>
                    <label>Lý do chi tiết:</label>
                    <div className="reason-content">{selectedRequest.reason}</div>
                  </div>
                </div>
                {selectedRequest.statusClass === "declined" && selectedRequest.reasonForDecline && (
                  <div className="detail-item full-width">
                    <CancelIcon className="detail-icon" />
                    <div>
                      <label>Lý do từ chối:</label>
                      <div className="decline-reason">{selectedRequest.reasonForDecline}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal (Approve/Decline) */}
      {showActionModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowActionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {actionType === "approve" ? (
                  <>
                    <CheckCircleIcon style={{ marginRight: "10px", color: "#4caf50" }} />
                    Phê duyệt yêu cầu
                  </>
                ) : actionType === "decline" ? (
                  <>
                    <CancelIcon style={{ marginRight: "10px", color: "#f44336" }} />
                    Từ chối yêu cầu
                  </>
                ) : (
                                     <>
                     <DeleteIcon style={{ marginRight: "10px", color: "#f44336" }} />
                     Xóa yêu cầu
                   </>
                )}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowActionModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="modal-body">
              <div className="action-confirmation">
                <p>
                  Bạn có chắc muốn{" "}
                  <strong>
                    {actionType === "approve" ? "phê duyệt" : 
                     actionType === "decline" ? "từ chối" : "xóa"}
                  </strong>{" "}
                  yêu cầu "{selectedRequest.title}" của phụ huynh{" "}
                  <strong>{selectedRequest.parentName}</strong>?
                </p>
                {actionType === "delete" && (
                  <div className="delete-warning">
                    <p>⚠️ <strong>Lưu ý:</strong> Yêu cầu sẽ được xóa khỏi danh sách nhưng vẫn được lưu trong hệ thống.</p>
                  </div>
                )}

                {actionType === "decline" && (
                  <div className="decline-reason-input">
                    <label>Lý do từ chối: *</label>
                    <textarea
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Nhập lý do từ chối yêu cầu..."
                      rows={4}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="action-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => setShowActionModal(false)}
                  disabled={actionLoading}
                >
                  Hủy
                </button>
                <button
                  className={`btn-confirm ${
                    actionType === "approve" ? "btn-approve" : 
                    actionType === "decline" ? "btn-decline" : "btn-delete"
                  }`}
                  onClick={handleSubmitAction}
                  disabled={actionLoading}
                >
                                     {actionLoading ? "Đang xử lý..." : 
                    actionType === "approve" ? "Phê duyệt" : 
                    actionType === "decline" ? "Từ chối" : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewRequests; 