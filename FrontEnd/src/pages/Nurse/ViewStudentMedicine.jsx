import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
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
    note: 'Thuốc giảm đau, hạ sốt cho trẻ em. Sáng 8-12h',
    contactPhone: '0123456789',
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
    note: 'Vitamin C tăng cường sức đề kháng. Chiều 14-18h',
    contactPhone: '0987654321',
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

  const columns = [
    { header: 'Học sinh', key: 'studentName', render: (v, row) => `${v} - Lớp ${row.class}` },
    { header: 'Phụ huynh', key: 'parentName' },
    { header: 'Tên thuốc', key: 'medicineName' },
    { header: 'Loại thuốc', key: 'medicineType' },
    { header: 'Số lượng', key: 'quantity' },
    { header: 'Hạn sử dụng', key: 'expiryDate' },
    { header: 'Tình trạng', key: 'condition' },
    { header: 'Ghi chú', key: 'note' },
    { header: 'SĐT liên hệ', key: 'contactPhone' },
    {
      header: 'Trạng thái',
      key: 'status',
      render: (v) => <span className={`status-badge ${statusMap[v]?.class}`}>{statusMap[v]?.text}</span>,
    },
    {
      header: 'Ngày gửi',
      key: 'createdAt',
      render: (v) => formatDate(v),
    },
    {
      header: 'Thao tác',
      key: 'actions',
      render: (v, row) =>
        row.status === 'pending' ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="submit-btn"
              style={{ width: 90, background: '#e6f9f0', color: '#1e7e34', fontSize: 13, padding: '7px 0' }}
              onClick={() => handleApprove(row.id)}
              disabled={actionLoading === row.id}
            >
              {actionLoading === row.id ? 'Đang duyệt...' : 'Chấp thuận'}
            </button>
            <button
              className="submit-btn"
              style={{ width: 90, background: '#fbeaea', color: '#c82333', fontSize: 13, padding: '7px 0' }}
              onClick={() => handleReject(row.id)}
              disabled={actionLoading === row.id}
            >
              {actionLoading === row.id ? 'Đang xử lý...' : 'Từ chối'}
            </button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="donate-medicine-container">
      <div className="donate-header">
        <div>
          <h1>Đơn Thuốc Từ Phụ Huynh</h1>
          <p>Xem, kiểm tra và duyệt các đơn thuốc phụ huynh gửi cho học sinh</p>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: 24, marginTop: 24 }}>
        <Table
          data={requests}
          columns={columns}
          loading={loading}
          emptyMessage="Chưa có đơn thuốc nào từ phụ huynh."
        />
      </div>
    </div>
  );
};

export default ViewStudentMedicine; 