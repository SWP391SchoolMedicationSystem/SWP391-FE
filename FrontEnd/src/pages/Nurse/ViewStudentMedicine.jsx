import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import '../../css/Parent/DonateMedicine.css';
import apiClient, { API_ENDPOINTS } from '../../services/config';

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
  const [students, setStudents] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadPersonalMedicines();
    loadStudents();
    loadMedicines();
  }, []);

  // Load all personal medicines from parents
  const loadPersonalMedicines = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicines', {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔍 Personal Medicines API Response:', data);
      
      // Ensure data is an array
      const medicinesArray = Array.isArray(data) ? data : (data.data ? data.data : []);
      
      // Map to display format
      const mappedRequests = medicinesArray.map(medicine => {
        const student = students.find(s => String(s.id) === String(medicine.studentid));
        const medicineInfo = medicines.find(m => String(m.medicineid) === String(medicine.medicineid));
        
        // Extract medicine name from note or use medicine API data
        let medicineName = 'Thuốc không xác định';
        let medicineType = 'Chưa xác định';
        let parentName = 'Chưa có thông tin';
        let contactPhone = 'Chưa có thông tin';
        
        if (medicineInfo) {
          medicineName = medicineInfo.medicinename;
          medicineType = medicineInfo.type;
        } else if (medicine.note) {
          // Try to extract info from note
          const note = medicine.note.toLowerCase();
          if (note.includes('paracetamol')) medicineName = 'Paracetamol';
          else if (note.includes('ibuprofen')) medicineName = 'Ibuprofen';
          else if (note.includes('vitamin')) medicineName = 'Vitamin';
          
          // Extract phone from note
          const phoneMatch = medicine.note.match(/\d{10,11}/);
          if (phoneMatch) contactPhone = phoneMatch[0];
          
          // Extract medicine type from note  
          if (note.includes('viên')) medicineType = 'Thuốc viên';
          else if (note.includes('siro')) medicineType = 'Siro';
        }
        
        // Get student and parent info
        if (student) {
          parentName = student.parentName || 'Chưa có thông tin';
        }
        
        return {
          id: medicine.medicineid,
          studentName: student?.name || student?.fullName || 'Học sinh không xác định',
          class: student?.class || student?.className || 'Không xác định',
          parentName: parentName,
          medicineName: medicineName,
          medicineType: medicineType,
          quantity: medicine.quantity,
          expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString('vi-VN') : 'Không có',
          condition: 'Chưa xác định', // This info is in note, could extract if needed
          note: medicine.note || 'Không có ghi chú',
          contactPhone: contactPhone,
          status: medicine.status ? 'approved' : 'pending',
          createdAt: medicine.receiveddate || new Date().toISOString(),
          originalData: medicine // Keep original data for updates
        };
      });
      
      console.log(`📊 Mapped Personal Medicines: ${mappedRequests.length} items`);
      setRequests(mappedRequests);
      
    } catch (error) {
      console.error('Error loading personal medicines:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách thuốc cá nhân từ phụ huynh' });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Load students for mapping
  const loadStudents = async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL);
      const studentsArray = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
      
      const mappedStudents = studentsArray.map(stu => ({
        id: stu.studentId || stu.studentid || stu.id,
        name: stu.fullname || stu.fullName || stu.name || 'Không có tên',
        class: stu.classname || stu.classId || stu.className || '---',
        parentName: stu.parent?.fullname || 'Chưa có thông tin'
      }));
      
      setStudents(mappedStudents);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  // Load medicines for mapping
  const loadMedicines = async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.MEDICINE.GET_ALL);
      const medicinesArray = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
      const activeMedicines = medicinesArray.filter(med => !med.isDeleted);
      setMedicines(activeMedicines);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  // Update medicine status via API
  const updateMedicineStatus = async (medicineId, newStatus) => {
    try {
      const originalMedicine = requests.find(req => req.id === medicineId)?.originalData;
      if (!originalMedicine) {
        throw new Error('Không tìm thấy dữ liệu thuốc gốc');
      }

      const updateData = {
        ...originalMedicine,
        status: newStatus === 'approved', // Convert to boolean
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicine?id=${medicineId}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating medicine status:', error);
      throw error;
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await updateMedicineStatus(id, 'approved');
      
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: 'approved' } : req
        )
      );
      
      setMessage({ type: 'success', text: '✅ Đã chấp thuận đơn thuốc thành công!' });
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Có lỗi xảy ra khi chấp thuận đơn thuốc' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await updateMedicineStatus(id, 'rejected');
      
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: 'rejected' } : req
        )
      );
      
      setMessage({ type: 'success', text: '✅ Đã từ chối đơn thuốc!' });
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Có lỗi xảy ra khi từ chối đơn thuốc' });
    } finally {
      setActionLoading(null);
    }
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
          <h1>💊 Đơn Thuốc Từ Phụ Huynh</h1>
          <p>Xem, kiểm tra và duyệt các đơn thuốc phụ huynh gửi cho học sinh</p>
        </div>
        <button 
          onClick={loadPersonalMedicines}
          className="submit-btn"
          style={{ width: 'auto', padding: '10px 20px' }}
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Statistics */}
      <div className="donate-info-section">
        <div className="info-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="info-item" style={{ textAlign: 'center' }}>
            <h4>📊 Tổng số đơn</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{requests.length}</p>
          </div>
          <div className="info-item" style={{ textAlign: 'center' }}>
            <h4>⏳ Chờ duyệt</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="info-item" style={{ textAlign: 'center' }}>
            <h4>✅ Đã duyệt</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="info-item" style={{ textAlign: 'center' }}>
            <h4>❌ Từ chối</h4>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>
              {requests.filter(r => r.status === 'rejected').length}
            </p>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`${message.type}-message`} style={{ marginBottom: '20px' }}>
          {message.text}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: 24, marginTop: 24 }}>
        <Table
          data={requests}
          columns={columns}
          loading={loading}
          emptyMessage="Chưa có đơn thuốc nào từ phụ huynh. Khi phụ huynh gửi thuốc cá nhân cho con, các đơn thuốc sẽ hiển thị tại đây để bạn duyệt."
        />
      </div>
    </div>
  );
};

export default ViewStudentMedicine; 