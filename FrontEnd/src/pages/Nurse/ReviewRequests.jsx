import React, { useState, useEffect } from 'react';
import { nurseFormService } from '../../services/nurseService';
import { useNurseActions } from '../../utils/hooks/useNurse';
import '../../css/Nurse/ReviewRequests.css';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CategoryIcon from '@mui/icons-material/Category';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

function ReviewRequests() {
  const {
    approveForm,
    declineForm,
    deleteForm,
    getFormsByParent,
    getFormsByCategory,
  } = useNurseActions();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterParent, setFilterParent] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve', 'decline', or 'delete'
  const [declineReason, setDeclineReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch requests on component mount
  useEffect(() => {
    const fetchData = async () => {
      const allForms = await nurseFormService.getAllForms();
      const cleanForms = allForms
        .filter(form => !form.isDeleted)
        .map(form => ({
          ...form,
          isPending: form.isPending === true || form.isPending === 'true',
          isaccepted: form.isaccepted === true || form.isaccepted === 'true'
        }));
      setRequests(cleanForms);
    };
    fetchData();
  }, []);

  // Auto-refresh disabled - removed to avoid continuous refreshing

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Fetching form requests from API...');
      const response = await nurseFormService.getAllForms();
      console.log('✅ API Response:', response);
      console.log('🔍 Raw form data (first item):', response[0]);
      const activeForms = response.filter(form => !form.isDeleted);
      
      // Clean and normalize the data with detailed logging
      const cleanForms = activeForms.map(form => {
        const cleanedForm = {
          ...form,
          isPending: form.isPending === true || form.isPending === 'true',
          isaccepted: form.isaccepted === true || form.isaccepted === 'true'
        };
        
        // Debug each form's status
        console.log(`🔍 Form ${form.formId}:`, {
          original: { isPending: form.isPending, isaccepted: form.isaccepted },
          cleaned: { isPending: cleanedForm.isPending, isaccepted: cleanedForm.isaccepted },
          status: cleanedForm.isPending ? 'PENDING' : (cleanedForm.isaccepted ? 'APPROVED' : 'DECLINED')
        });
        
        return cleanedForm;
      });

      // Debug: Log pending requests
      const pendingRequests = cleanForms.filter(
        form => form.isPending === true
      );
      console.log('🔍 Pending requests:', pendingRequests);
      console.log('🔍 Total active forms:', cleanForms.length);
      
      setRequests(cleanForms);
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      setError(`Không thể tải danh sách yêu cầu: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    // Always exclude deleted requests
    if (request.isDeleted) return false;

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        request.parentName?.toLowerCase().includes(searchLower) ||
        request.studentName?.toLowerCase().includes(searchLower) ||
        request.title?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Filter by status
    if (filterStatus) {
      if (filterStatus === 'pending' && !request.isPending) return false;
      if (
        filterStatus === 'approved' &&
        (request.isPending || !request.isaccepted)
      )
        return false;
      if (
        filterStatus === 'declined' &&
        (request.isPending || request.isaccepted)
      )
        return false;
    }

    // Filter by category
    if (
      filterCategory &&
      request.formCategoryId?.toString() !== filterCategory
    ) {
      return false;
    }

    // Filter by parent ID
    if (filterParent && request.parentId?.toString() !== filterParent) {
      return false;
    }

    return true;
  });

  // Handle view request details
  const handleViewDetails = request => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  // Handle file download
  const handleDownloadFile = async (request) => {
    try {
      console.log('🔍 Opening file:', {
        filename: request.originalFilename,
        path: request.storedPath
      });

      // Nếu storedPath là URL đầy đủ
      if (request.storedPath && request.storedPath.startsWith('http')) {
        window.open(request.storedPath, '_blank');
        return;
      }

      // Nếu storedPath là đường dẫn tương đối, tạo URL đầy đủ
      if (request.storedPath) {
        const baseUrl = 'https://api-schoolhealth.purintech.id.vn';
        const fullUrl = `${baseUrl}${request.storedPath.startsWith('/') ? '' : '/'}${request.storedPath}`;
        console.log('🔗 Full URL:', fullUrl);
        
        // Mở file trực tiếp trong tab mới (không download)
        window.open(fullUrl, '_blank');
      } else {
        console.error('❌ No file path available');
        alert('Không tìm thấy đường dẫn file!');
      }
    } catch (error) {
      console.error('❌ Error opening file:', error);
      alert('Lỗi khi mở file: ' + error.message);
    }
  };

  // Handle approve action
  const handleApprove = request => {
    setSelectedRequest(request);
    setActionType('approve');
    setShowActionModal(true);
  };

  // Handle decline action
  const handleDecline = request => {
    setSelectedRequest(request);
    setActionType('decline');
    setDeclineReason('');
    setShowActionModal(true);
  };

  // Handle delete action
  const handleDelete = request => {
    setSelectedRequest(request);
    setActionType('delete');
    setShowActionModal(true);
  };

  // Submit action (approve, decline, or delete)
  const handleSubmitAction = async () => {
    if (!selectedRequest) return;

    if (actionType === 'decline' && !declineReason.trim()) {
      alert('Vui lòng nhập lý do từ chối!');
      return;
    }

    try {
      setActionLoading(true);
      console.log(`🔄 ${actionType} request:`, selectedRequest.formId);

      let result;
      if (actionType === 'approve') {
        result = await approveForm(selectedRequest.formId);
        console.log('✅ Approve result:', result);
      } else if (actionType === 'decline') {
        result = await declineForm(selectedRequest.formId, declineReason);
        console.log('✅ Decline result:', result);
      } else if (actionType === 'delete') {
        result = await deleteForm(selectedRequest.formId);
        console.log('✅ Delete result:', result);
      }

      // Refresh the requests list
      await fetchRequests();

      setShowActionModal(false);
      setSelectedRequest(null);
      setDeclineReason('');

      const messages = {
        approve: 'Đã phê duyệt yêu cầu thành công!',
        decline: 'Đã từ chối yêu cầu thành công!',
        delete: 'Đã xóa yêu cầu thành công!',
      };
      alert(messages[actionType]);
    } catch (error) {
      console.error(`❌ Error ${actionType}ing request:`, error);
      const actionNames = {
        approve: 'phê duyệt',
        decline: 'từ chối',
        delete: 'xóa',
      };
      alert(
        `Có lỗi xảy ra khi ${actionNames[actionType]} yêu cầu: ${
          error.message || error
        }`
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Get status badge class based on isPending and isaccepted

  // Get status text based on isPending and isaccepted
  const getStatusText = request => {
    // Debug the status determination
    const status = request.isPending === true ? 'PENDING' : 
                   request.isaccepted === true ? 'APPROVED' : 'DECLINED';
    
    console.log(
      `🎯 ID ${request.formId} | isPending: ${request.isPending} (${typeof request.isPending}), isaccepted: ${request.isaccepted} (${typeof request.isaccepted}) | Status: ${status}`
    );

    if (request.isPending === true) return 'Chờ xử lý';
    if (request.isaccepted === true) return 'Đã phê duyệt';
    return 'Đã từ chối';
  };
  
  const getStatusBadgeClass = request => {
    if (request.isPending === true) {
      return 'status-badge status-pending';
    }
    if (request.isaccepted === true) {
      return 'status-badge status-approved';
    }
    return 'status-badge status-declined';
  };

  // Get category badge class
  const getCategoryBadgeClass = categoryId => {
    const categoryClasses = {
      1: 'category-leave',
      2: 'category-medicine',
      3: 'category-consultation',
      4: 'category-other',
    };
    return `category-badge ${
      categoryClasses[categoryId] || 'category-default'
    }`;
  };

  // Calculate statistics based on isPending and isaccepted
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.isPending).length,
    approved: requests.filter(r => !r.isPending && r.isaccepted).length,
    declined: requests.filter(r => !r.isPending && !r.isaccepted).length,
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
      <div className="review-requests-header" style={{
        background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(47, 81, 72, 0.3)',
        padding: '32px 40px',
        borderRadius: '24px',
      }}>
        <div>
          <h1 style={{ color: 'white' }}>📋 Kiểm Duyệt Yêu Cầu</h1>
          <p style={{ color: 'white', opacity: 0.95 }}>Xem và phê duyệt các yêu cầu từ phụ huynh</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={fetchRequests} 
            className="refresh-button"
            disabled={loading}
            style={{ color: 'white', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(47,81,72,0.08)' }}
          >
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>
        </div>
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
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
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
            onChange={e => setFilterCategory(e.target.value)}
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
            onChange={e => setFilterParent(e.target.value)}
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
            {filteredRequests.map(request => {
              // Debug: Log each request's pending status
              console.log(
                `🔍 Request ${request.formId}: isPending = ${
                  request.isPending
                }, type = ${typeof request.isPending}`
              );
              
              // Debug button visibility
              const shouldShowActionButtons = request.isPending === true;
              console.log(`🔘 Request ${request.formId}: Should show action buttons = ${shouldShowActionButtons}`);
              
              return (
                <tr key={request.formId}>
                  <td>
                    <div className="parent-info">
                      <div className="parent-name" style={{
                        color: '#2f5148',
                        fontWeight: 700,
                        fontSize: '1.08rem',
                        background: 'rgba(47,81,72,0.06)',
                        borderRadius: 8,
                        padding: '2px 10px',
                        display: 'inline-block',
                      }}>{request.parentName}</div>
                      {/* Bỏ ID phụ huynh */}
                    </div>
                  </td>
                  <td>
                    <div className="student-info">
                      <div className="student-name">{request.studentName}</div>
                      {/* Bỏ ID học sinh */}
                    </div>
                  </td>
                  <td>
                    {/* Chỉnh lại loại đơn */}
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 18px',
                      borderRadius: '16px',
                      fontWeight: 600,
                      fontSize: 14,
                      background: request.formCategoryId === 2 ? 'rgba(115,173,103,0.12)' // thuốc
                        : request.formCategoryId === 1 ? 'rgba(33,150,243,0.12)' // nghỉ phép
                        : request.formCategoryId === 3 ? 'rgba(255,152,0,0.12)' // tư vấn
                        : 'rgba(120,120,120,0.10)', // khác
                      color: request.formCategoryId === 2 ? '#2f5148'
                        : request.formCategoryId === 1 ? '#2196f3'
                        : request.formCategoryId === 3 ? '#ff9800'
                        : '#555',
                      border: 'none',
                      boxShadow: 'none',
                    }}>
                      {request.formCategoryName}
                    </span>
                  </td>
                  <td className="request-title">{request.title}</td>
                  <td className="created-date">{request.createdDate}</td>
                  <td>
                    <span className={getStatusBadgeClass(request)}>
                      {getStatusText(request)}
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
                      {shouldShowActionButtons && (
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
                      {/* Chỉ hiển thị nút Delete khi đã chấp thuận hoặc từ chối */}
                      {!shouldShowActionButtons && (
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(request)}
                          title="Xóa yêu cầu"
                        >
                          <DeleteIcon />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
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
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <InfoIcon style={{ marginRight: '10px' }} />
                Chi tiết yêu cầu
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                <CloseIcon />
              </button>
            </div>
            {/* Hiển thị tên nhân viên xử lý (y tá) trên cùng nếu có */}
            {selectedRequest.staffName && (
              <div style={{
                width: '100%',
                textAlign: 'center',
                fontWeight: 700,
                color: '#2f5148',
                fontSize: 17,
                margin: '18px 0 8px 0',
                letterSpacing: 0.5,
              }}>
                Nhân viên xử lý: {selectedRequest.staffName}
              </div>
            )}
            <div className="modal-body">
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px',
                marginBottom: 12,
              }}>
                {/* Dòng 1: Phụ huynh - Học sinh */}
                <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                  <PersonIcon style={{color:'#73ad67',fontSize:28}}/>
                  <div>
                    <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>PHỤ HUYNH:</div>
                    <div style={{fontWeight:700,color:'#2f5148',fontSize:16}}>{selectedRequest.parentName}</div>
                  </div>
                </div>
                <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                  <ChildCareIcon style={{color:'#73ad67',fontSize:28}}/>
                  <div>
                    <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>HỌC SINH:</div>
                    <div style={{fontWeight:700,color:'#2f5148',fontSize:16}}>{selectedRequest.studentName}</div>
                  </div>
                </div>
                {/* Dòng 2: Loại đơn - Ngày tạo */}
                <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                  <CategoryIcon style={{color:'#73ad67',fontSize:28}}/>
                  <div>
                    <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>LOẠI ĐƠN:</div>
                    <div style={{fontWeight:700,color:'#2196f3',fontSize:15}}>{selectedRequest.formCategoryName}</div>
                  </div>
                </div>
                <div style={{background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                  <DateRangeIcon style={{color:'#73ad67',fontSize:28}}/>
                  <div>
                    <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>NGÀY TẠO:</div>
                    <div style={{fontWeight:700,color:'#2f5148',fontSize:15}}>{selectedRequest.createdDate}</div>
                  </div>
                </div>
                {/* Dòng 3: Nhân viên xử lý (nếu có) - trống */}
                <div></div><div></div>
                {/* Dòng 4: Tiêu đề (full width) */}
                <div style={{gridColumn:'1/3',background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                  <DescriptionIcon style={{color:'#73ad67',fontSize:28}}/>
                  <div>
                    <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>TIÊU ĐỀ:</div>
                    <div style={{fontWeight:700,color:'#2f5148',fontSize:15}}>{selectedRequest.title}</div>
                  </div>
                </div>
                {/* Dòng 5: Lý do chi tiết (full width) */}
                <div style={{gridColumn:'1/3',background:'#f8fafc',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'flex-start',gap:12}}>
                  <DescriptionIcon style={{color:'#73ad67',fontSize:28,marginTop:2}}/>
                  <div>
                    <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>LÝ DO CHI TIẾT:</div>
                    <div style={{fontWeight:500,color:'#2f5148',fontSize:15,whiteSpace:'pre-line'}}>
                      {selectedRequest.reason
                        ? selectedRequest.reason.split(/(?=\b(?:Tên thuốc|Chi tiết thuốc|Lí do|Lý do)\b)/g).map((part, idx) => (
                            <div key={idx}>{part.trim()}</div>
                          ))
                        : ''}
                    </div>
                  </div>
                </div>
                {/* Dòng 6: File đính kèm (nếu có, full width) */}
                {selectedRequest.originalFilename && (
                  <div style={{gridColumn:'1/3',background:'#f0f8ff',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'center',gap:12,minHeight:70}}>
                    <AttachFileIcon style={{color:'#2196f3',fontSize:28}}/>
                    <div>
                      <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>FILE ĐÍNH KÈM:</div>
                      <div style={{fontWeight:600,color:'#2196f3',fontSize:15}}>
                        <button 
                          onClick={() => handleDownloadFile(selectedRequest)}
                          style={{
                            color: '#2196f3',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '600'
                          }}
                        >
                          📎 {selectedRequest.originalFilename}
                          <span style={{fontSize:12,color:'#666'}}>(Nhấn để xem)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Dòng 6: Lý do từ chối (nếu có, full width) */}
                {!selectedRequest.isPending &&
                  !selectedRequest.isaccepted &&
                  selectedRequest.reasonfordecline && (
                    <div style={{gridColumn:'1/3',background:'#fff3f3',borderRadius:12,padding:'18px 16px',display:'flex',alignItems:'flex-start',gap:12}}>
                      <CancelIcon style={{color:'#f44336',fontSize:28,marginTop:2}}/>
                      <div>
                        <div style={{fontSize:13,color:'#888',fontWeight:500,marginBottom:2}}>LÝ DO TỪ CHỐI:</div>
                        <div style={{fontWeight:500,color:'#d32f2f',fontSize:15}}>{selectedRequest.reasonfordecline}</div>
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
        <div
          className="modal-overlay"
          onClick={() => setShowActionModal(false)}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {actionType === 'approve' ? (
                  <>
                    <CheckCircleIcon
                      style={{ marginRight: '10px', color: '#4caf50' }}
                    />
                    Phê duyệt yêu cầu
                  </>
                ) : actionType === 'decline' ? (
                  <>
                    <CancelIcon
                      style={{ marginRight: '10px', color: '#f44336' }}
                    />
                    Từ chối yêu cầu
                  </>
                ) : (
                  <>
                    <DeleteIcon
                      style={{ marginRight: '10px', color: '#f44336' }}
                    />
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
                  Bạn có chắc muốn{' '}
                  <strong>
                    {actionType === 'approve'
                      ? 'phê duyệt'
                      : actionType === 'decline'
                      ? 'từ chối'
                      : 'xóa'}
                  </strong>{' '}
                  yêu cầu "{selectedRequest.title}" của phụ huynh{' '}
                  <strong>{selectedRequest.parentName}</strong>?
                </p>
                {actionType === 'delete' && (
                  <div className="delete-warning">
                    <p>
                      ⚠️ <strong>Lưu ý:</strong> Yêu cầu sẽ được xóa khỏi danh
                      sách nhưng vẫn được lưu trong hệ thống.
                    </p>
                  </div>
                )}

                {actionType === 'decline' && (
                  <div className="decline-reason-input">
                    <label>Lý do từ chối: *</label>
                    <textarea
                      value={declineReason}
                      onChange={e => setDeclineReason(e.target.value)}
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
                    actionType === 'approve'
                      ? 'btn-approve'
                      : actionType === 'decline'
                      ? 'btn-decline'
                      : 'btn-delete'
                  }`}
                  onClick={handleSubmitAction}
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? 'Đang xử lý...'
                    : actionType === 'approve'
                    ? 'Phê duyệt'
                    : actionType === 'decline'
                    ? 'Từ chối'
                    : 'Xóa'}
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
