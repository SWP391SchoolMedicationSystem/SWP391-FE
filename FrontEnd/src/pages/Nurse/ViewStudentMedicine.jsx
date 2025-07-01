import React, { useState, useEffect } from 'react';
import Table from '../../components/common/Table';
import '../../css/Nurse/ViewStudentMedicine.css';
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
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load students and medicines first
        const [studentsRes, medicinesRes] = await Promise.all([
          apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL),
          apiClient.get(API_ENDPOINTS.MEDICINE.GET_ALL)
        ]);
        
        // Process students data
        const studentsArray = Array.isArray(studentsRes) ? studentsRes : (Array.isArray(studentsRes.data) ? studentsRes.data : []);
        const mappedStudents = studentsArray.map(stu => ({
          id: stu.studentId || stu.studentid || stu.id,
          name: stu.fullname || stu.fullName || stu.name || 'Không có tên',
          class: stu.classname || stu.classId || stu.className || '---',
          parentName: stu.parent?.fullname || 'Chưa có thông tin'
        }));
        setStudents(mappedStudents);
        
        // Process medicines data
        const medicinesArray = Array.isArray(medicinesRes) ? medicinesRes : (Array.isArray(medicinesRes.data) ? medicinesRes.data : []);
        const activeMedicines = medicinesArray.filter(med => !med.isDeleted);
        setMedicines(activeMedicines);
        
        // Now load personal medicines with the fresh data
        await loadPersonalMedicines(mappedStudents, activeMedicines);
        
      } catch (error) {
        console.error('Error loading data:', error);
        
        let errorMessage = 'Không thể tải dữ liệu hệ thống';
        if (error.response?.status === 401) {
          errorMessage = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!';
        } else if (error.response?.status === 403) {
          errorMessage = 'Không có quyền truy cập. Vui lòng kiểm tra quyền nurse!';
        } else if (error.response?.status >= 500) {
          errorMessage = 'Lỗi máy chủ. Vui lòng thử lại sau!';
        } else if (error.message?.includes('Network')) {
          errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra internet!';
        }
        
        setMessage({ type: 'error', text: `❌ ${errorMessage}` });
        setRequests([]);
        setStudents([]);
        setMedicines([]);
      }
    };
    
    loadData();
  }, []);

  // Load all personal medicines from parents
  const loadPersonalMedicines = async (studentsData = null, medicinesData = null) => {
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
      
      // Ensure data is an array
      const medicinesArray = Array.isArray(data) ? data : (data.data ? data.data : []);
      
      // Use passed data or fallback to state
      const studentsToUse = studentsData || students;
      const medicinesToUse = medicinesData || medicines;
      
      // Map to display format
      const mappedRequests = medicinesArray.map((medicine, index) => {
        const student = studentsToUse.find(s => String(s.id) === String(medicine.studentid));
        const medicineInfo = medicinesToUse.find(m => String(m.medicineid) === String(medicine.medicineid));
        
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
        
        // Create unique ID to avoid React key duplicates
        const uniqueId = medicine.personalMedicineId || 
                        medicine.id || 
                        `pm_${index}_${medicine.medicineid || 0}_${medicine.studentid || 0}_${medicine.parentid || 0}`;

        return {
          id: uniqueId,
          medicineId: medicine.medicineid,
          studentId: medicine.studentid,
          studentName: student?.name || student?.fullName || 'Học sinh không xác định',
          class: student?.class || student?.className || 'Không xác định',
          parentName: parentName,
          medicineName: medicineName,
          medicineType: medicineType,
          quantity: medicine.quantity,
          expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString('vi-VN') : 'Không có',
          condition: 'Chưa xác định',
          note: medicine.note || 'Không có ghi chú',
          contactPhone: contactPhone,
          status: medicine.status ? 'approved' : 'pending',
          createdAt: medicine.receiveddate || new Date().toISOString(),
          originalData: medicine
        };
      });
      
      // Remove duplicates based on unique PersonalMedicine ID only
      // Allow multiple medicines for same student (different medicine types)
      const uniqueRequests = mappedRequests.filter((request, index, self) => 
        index === self.findIndex((r) => 
          r.id === request.id || 
          (r.originalData.personalMedicineId && r.originalData.personalMedicineId === request.originalData.personalMedicineId)
        )
      );

      setRequests(uniqueRequests);
      
    } catch (error) {
      console.error('Error loading personal medicines:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách thuốc cá nhân từ phụ huynh' });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };



  const updateMedicineStatus = async (personalMedicineId, newStatus) => {
    // Simple local update only - no API calls
    return { 
      success: true, 
      method: 'local-only', 
      id: personalMedicineId, 
      status: newStatus
    };
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
      
      setStatusFilter('all');
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
      
      setStatusFilter('all');
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
        <div className="view-student-medicine-container">
      <div className="medicine-header">
        <div>
          <h1>💊 Đơn Thuốc Từ Phụ Huynh</h1>
          <p>Xem, kiểm tra và duyệt các đơn thuốc phụ huynh gửi cho học sinh</p>
        </div>
                <button 
          onClick={() => {
            const loadData = async () => {
              try {
                const [studentsRes, medicinesRes] = await Promise.all([
                  apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL),
                  apiClient.get(API_ENDPOINTS.MEDICINE.GET_ALL)
                ]);
                
                const studentsArray = Array.isArray(studentsRes) ? studentsRes : (Array.isArray(studentsRes.data) ? studentsRes.data : []);
                const mappedStudents = studentsArray.map(stu => ({
                  id: stu.studentId || stu.studentid || stu.id,
                  name: stu.fullname || stu.fullName || stu.name || 'Không có tên',
                  class: stu.classname || stu.classId || stu.className || '---',
                  parentName: stu.parent?.fullname || 'Chưa có thông tin'
                }));
                setStudents(mappedStudents);
                
                const medicinesArray = Array.isArray(medicinesRes) ? medicinesRes : (Array.isArray(medicinesRes.data) ? medicinesRes.data : []);
                const activeMedicines = medicinesArray.filter(med => !med.isDeleted);
                setMedicines(activeMedicines);
                
                await loadPersonalMedicines(mappedStudents, activeMedicines);
              } catch (error) {
                console.error('Error refreshing data:', error);
                setMessage({ type: 'error', text: 'Không thể làm mới dữ liệu' });
              }
            };
            loadData();
          }}
          className="refresh-btn"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Filter and Statistics */}
      <div className="medicine-info-section">
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px', fontWeight: '600' }}>Lọc theo trạng thái:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #dee2e6',
              background: 'white',
              fontWeight: '500'
            }}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã chấp thuận</option>
            <option value="rejected">Đã từ chối</option>
          </select>
        </div>
        
        <div className="info-content">
          <div className="info-item">
            <h4>📊 Tổng số đơn</h4>
            <p style={{ color: '#3b82f6' }}>{requests.length}</p>
          </div>
          <div className="info-item">
            <h4>⏳ Chờ duyệt</h4>
            <p style={{ color: '#f59e0b' }}>
              {requests.filter(r => r.status === 'pending').length}
            </p>
          </div>
          <div className="info-item">
            <h4>✅ Đã duyệt</h4>
            <p style={{ color: '#10b981' }}>
              {requests.filter(r => r.status === 'approved').length}
            </p>
          </div>
          <div className="info-item">
            <h4>❌ Từ chối</h4>
            <p style={{ color: '#ef4444' }}>
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

      <div className="table-container">
        <Table
          data={statusFilter === 'all' ? requests : requests.filter(req => req.status === statusFilter)}
          columns={columns}
          loading={loading}
          emptyMessage={
            statusFilter === 'all' 
              ? "Chưa có đơn thuốc nào từ phụ huynh. Khi phụ huynh gửi thuốc cá nhân cho con, các đơn thuốc sẽ hiển thị tại đây để bạn duyệt."
              : `Không có đơn thuốc nào với trạng thái "${statusFilter === 'pending' ? 'Chờ duyệt' : statusFilter === 'approved' ? 'Đã chấp thuận' : 'Đã từ chối'}"`
          }
        />
      </div>
    </div>
  );
};

export default ViewStudentMedicine; 