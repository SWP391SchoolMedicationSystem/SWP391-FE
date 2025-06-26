import React, { useState, useEffect } from 'react';
import '../../css/Parent/DonateMedicine.css';

// Mock data đơn thuốc gửi cho học sinh
const mockMedicineRequests = [
  {
    id: 1,
    studentName: 'Nguyễn Minh Khôi',
    class: '5A',
    parentName: 'Lê Văn H.',
    medicineName: 'Paracetamol 500mg',
    medicineType: 'Thuốc giảm đau',
    quantity: '20 viên',
    expiryDate: '2024-12-31',
    condition: 'Còn tốt',
    description: 'Thuốc giảm đau, hạ sốt cho trẻ em',
    contactPhone: '0123456789',
    preferredTime: 'Sáng 8-12h',
    status: 'pending',
    createdAt: '2024-03-10T10:30:00Z',
  },
  {
    id: 2,
    studentName: 'Trần Thị Bích',
    class: '4B',
    parentName: 'Nguyễn Thị T.',
    medicineName: 'Vitamin C',
    medicineType: 'Vitamin',
    quantity: '30 viên',
    expiryDate: '2024-11-15',
    condition: 'Rất tốt',
    description: 'Vitamin C tăng cường sức đề kháng',
    contactPhone: '0987654321',
    preferredTime: 'Chiều 14-18h',
    status: 'approved',
    createdAt: '2024-02-28T14:20:00Z',
  },
];

const statusMap = {
  pending: { class: 'status-pending', text: 'Chờ duyệt' },
  approved: { class: 'status-approved', text: 'Đã chấp thuận' },
  rejected: { class: 'status-rejected', text: 'Từ chối' },
  completed: { class: 'status-approved', text: 'Hoàn thành' },
};

const ViewStudentMedicine = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    // TODO: Replace with real API call
    setLoading(true);
    setTimeout(() => {
      setRequests(mockMedicineRequests);
      setLoading(false);
    }, 500);
  }, []);

  const handleApprove = (id) => {
    setActionLoading(id);
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: 'approved' } : req
        )
      );
      setActionLoading(null);
    }, 600);
  };

  const handleReject = (id) => {
    setActionLoading(id);
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: 'rejected' } : req
        )
      );
      setActionLoading(null);
    }, 600);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="donate-medicine-container">
      <div className="donate-header">
        <div>
          <h1>Đơn Thuốc Phụ Huynh Gửi Cho Học Sinh</h1>
          <p>Xem, kiểm tra và duyệt các đơn thuốc phụ huynh gửi cho học sinh</p>
        </div>
      </div>
      <div className="donate-history-section">
        <div className="history-header">
          <h3>📦 Danh Sách Đơn Thuốc Gửi</h3>
        </div>
        <div className="history-content">
          {loading ? (
            <div className="empty-history">
              <h4>Đang tải...</h4>
            </div>
          ) : requests.length === 0 ? (
            <div className="empty-history">
              <h4>Chưa có đơn thuốc nào</h4>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="history-item">
                <h4>{req.medicineName}</h4>
                <div className="history-details">
                  <div className="history-detail">
                    <label>Học sinh:</label>
                    <span>{req.studentName} - Lớp {req.class}</span>
                  </div>
                  <div className="history-detail">
                    <label>Phụ huynh:</label>
                    <span>{req.parentName}</span>
                  </div>
                  <div className="history-detail">
                    <label>Loại thuốc:</label>
                    <span>{req.medicineType}</span>
                  </div>
                  <div className="history-detail">
                    <label>Số lượng:</label>
                    <span>{req.quantity}</span>
                  </div>
                  <div className="history-detail">
                    <label>Hạn sử dụng:</label>
                    <span>{req.expiryDate}</span>
                  </div>
                  <div className="history-detail">
                    <label>Tình trạng:</label>
                    <span>{req.condition}</span>
                  </div>
                  <div className="history-detail">
                    <label>SĐT liên hệ:</label>
                    <span>{req.contactPhone}</span>
                  </div>
                  <div className="history-detail">
                    <label>Thời gian thuận tiện:</label>
                    <span>{req.preferredTime}</span>
                  </div>
                </div>
                {req.description && (
                  <div className="history-detail">
                    <label>Mô tả:</label>
                    <span>{req.description}</span>
                  </div>
                )}
                <div className="history-status">
                  <span className={`status-badge ${statusMap[req.status]?.class}`}>{statusMap[req.status]?.text}</span>
                  <span className="history-date">{formatDate(req.createdAt)}</span>
                </div>
                {req.status === 'pending' && (
                  <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                    <button
                      className="submit-btn"
                      style={{ width: 140, background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}
                      onClick={() => handleApprove(req.id)}
                      disabled={actionLoading === req.id}
                    >
                      {actionLoading === req.id ? 'Đang duyệt...' : 'Chấp thuận'}
                    </button>
                    <button
                      className="submit-btn"
                      style={{ width: 140, background: 'linear-gradient(135deg, #dc3545 0%, #fd7e14 100%)' }}
                      onClick={() => handleReject(req.id)}
                      disabled={actionLoading === req.id}
                    >
                      {actionLoading === req.id ? 'Đang xử lý...' : 'Từ chối'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewStudentMedicine; 