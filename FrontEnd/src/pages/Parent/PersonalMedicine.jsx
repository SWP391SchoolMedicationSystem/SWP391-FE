import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Parent/DonateMedicine.css';
import apiClient, { API_ENDPOINTS } from '../../services/config';

const PersonalMedicine = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    medicineName: '',
    medicineType: '',
    quantity: '',
    expiryDate: '',
    condition: 'good',
    description: '',
    contactPhone: '',
    preferredTime: ''
  });
  
  const [personalMedicines, setPersonalMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudentsByParent();
    loadPersonalMedicines();
  }, []);

  const fetchStudentsByParent = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const parentId = userInfo.userId;
      
      console.log('User Info:', userInfo);
      console.log('Parent ID:', parentId);
      
      if (!parentId) {
        setMessage({ type: 'error', text: 'Không tìm thấy thông tin phụ huynh. Vui lòng đăng nhập lại.' });
        setStudents([]);
        return;
      }
      
      const res = await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL);
      console.log('API Response:', res);
      console.log('Is Array:', Array.isArray(res));
      
      // Check if response is wrapped in data property
      const studentData = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
      
      if (studentData.length === 0) {
        setMessage({ type: 'info', text: 'Không tìm thấy học sinh nào trong hệ thống.' });
        setStudents([]);
        return;
      }
      
      // Lọc học sinh theo parentId
      const filtered = studentData.filter(stu => {
        console.log('Student:', stu, 'Parent ID from student:', stu.parentid, 'Parent ID from user:', parentId);
        // Try multiple possible field names for parentId
        const studentParentId = stu.parentid || stu.parentId || stu.parent_id || stu.ParentId;
        return String(studentParentId) === String(parentId);
      });
      
      console.log('Filtered students:', filtered);
      
      if (filtered.length === 0) {
        setMessage({ type: 'info', text: 'Không tìm thấy học sinh nào thuộc tài khoản phụ huynh này.' });
        setStudents([]);
        return;
      }
      
      const mappedStudents = filtered.map(stu => ({
        id: stu.studentid || stu.studentId || stu.id,
        name: stu.fullname || stu.fullName || stu.name || 'Không có tên',
        class: stu.classid || stu.classId || stu.className || '---'
      }));
      
      console.log('Mapped students:', mappedStudents);
      setStudents(mappedStudents);
      
      // Clear any previous error messages
      if (message.type === 'error' || message.type === 'info') {
        setMessage({ type: '', text: '' });
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      if (err.response?.status === 401) {
        setMessage({ type: 'error', text: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' });
      } else if (err.response?.status === 403) {
        setMessage({ type: 'error', text: 'Không có quyền truy cập danh sách học sinh.' });
      } else if (err.response?.status >= 500) {
        setMessage({ type: 'error', text: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
      } else {
        setMessage({ type: 'error', text: 'Không thể tải danh sách học sinh: ' + (err.message || 'Lỗi không xác định') });
      }
      setStudents([]);
    }
  };

  const loadPersonalMedicines = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicines', {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Personal Medicines data:', data);
      
      // Ensure data is an array
      const medicinesArray = Array.isArray(data) ? data : (data.data ? data.data : []);
      setPersonalMedicines(medicinesArray);
      
    } catch (error) {
      console.error('Error loading personal medicines:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách thuốc cá nhân' });
      setPersonalMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicines', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMessage({ type: 'success', text: 'Thêm thuốc cá nhân thành công!' });
      setFormData({
        studentId: '',
        medicineName: '',
        medicineType: '',
        quantity: '',
        expiryDate: '',
        condition: 'good',
        description: '',
        contactPhone: '',
        preferredTime: ''
      });
      loadPersonalMedicines();
    } catch (error) {
      console.error('Error submitting personal medicine:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi thêm thuốc. Vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { class: 'status-pending', text: 'Chờ xử lý' },
      'approved': { class: 'status-approved', text: 'Đã chấp nhận' },
      'rejected': { class: 'status-rejected', text: 'Từ chối' },
      'completed': { class: 'status-approved', text: 'Hoàn thành' }
    };
    
    const statusInfo = statusMap[status] || statusMap['pending'];
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="donate-medicine-container">
      {/* Header */}
      <div className="donate-header">
        <div>
          <h1>💊 Quản Lý Thuốc Cá Nhân</h1>
          <p>Quản lý thông tin thuốc cá nhân của học sinh, theo dõi liều dùng và lịch trình dùng thuốc</p>
        </div>
      </div>

      {/* Information Section */}
      <div className="donate-info-section">
        <div className="info-header">
          <h3>ℹ️ Thông Tin Thuốc Cá Nhân</h3>
        </div>
        <div className="info-content">
          <div className="info-item">
            <h4>📋 Quản lý thuốc cá nhân</h4>
            <p>Hệ thống giúp bạn:</p>
            <ul>
              <li>Theo dõi danh sách thuốc cá nhân của học sinh</li>
              <li>Quản lý liều dùng và tần suất dùng thuốc</li>
              <li>Nhắc nhở lịch trình dùng thuốc</li>
              <li>Theo dõi hạn sử dụng và tình trạng thuốc</li>
            </ul>
          </div>

          <div className="info-item">
            <h4>✅ Lưu ý khi quản lý thuốc cá nhân</h4>
            <ul>
              <li>Cập nhật thông tin thuốc chính xác và đầy đủ</li>
              <li>Theo dõi hạn sử dụng để tránh sử dụng thuốc hết hạn</li>
              <li>Ghi rõ liều dùng và tần suất để tránh nhầm lẫn</li>
              <li>Thông báo với y tế trường về thuốc đặc biệt</li>
              <li>Bảo quản thuốc đúng cách theo hướng dẫn</li>
            </ul>
          </div>

          <div className="info-item">
            <h4>📞 Liên hệ hỗ trợ</h4>
            <p>Nếu bạn có thắc mắc về quản lý thuốc cá nhân, vui lòng liên hệ:</p>
            <ul>
              <li>Hotline: 1900-xxxx</li>
              <li>Email: schoolhealth@medlearn.com</li>
              <li>Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Thứ 6)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="donate-content">
        {/* Personal Medicine Form */}
        <div className="donate-form-section">
          <div className="form-header">
            <h3>📋 Thêm Thuốc Cá Nhân</h3>
          </div>
          <div className="form-content">
            {message.text && (
              <div className={`${message.type}-message`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="studentId">Chọn học sinh *</label>
                <select
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn học sinh</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} - Lớp {student.class}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="medicineName">Tên thuốc *</label>
                <input
                  type="text"
                  id="medicineName"
                  name="medicineName"
                  value={formData.medicineName}
                  onChange={handleInputChange}
                  required
                  placeholder="Ví dụ: Paracetamol, Amoxicillin..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="medicineType">Loại thuốc *</label>
                  <select
                    id="medicineType"
                    name="medicineType"
                    value={formData.medicineType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn loại thuốc</option>
                    <option value="painkiller">Thuốc giảm đau</option>
                    <option value="antibiotic">Thuốc kháng sinh</option>
                    <option value="vitamin">Vitamin</option>
                    <option value="cold">Thuốc cảm cúm</option>
                    <option value="fever">Thuốc hạ sốt</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Số lượng *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="Số viên/hộp"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Hạn sử dụng *</label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="condition">Tình trạng thuốc *</label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="good">Còn tốt</option>
                    <option value="excellent">Rất tốt</option>
                    <option value="fair">Tạm được</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Mô tả chi tiết (liều dùng, thời gian dùng...)</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả về thuốc, liều dùng, thời gian dùng, lưu ý cho y tế trường..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactPhone">Số điện thoại liên hệ *</label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  required
                  placeholder="0123456789"
                />
              </div>

              <div className="form-group">
                <label htmlFor="preferredTime">Thời gian thuận tiện liên hệ</label>
                <input
                  type="text"
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Sáng 8-12h, Chiều 14-18h"
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Đang thêm...' : 'Thêm thuốc cá nhân'}
              </button>
            </form>
          </div>
        </div>

        {/* Personal Medicine List */}
        <div className="donate-history-section">
          <div className="history-header">
            <h3>📊 Danh Sách Thuốc Cá Nhân</h3>
          </div>
          <div className="history-content">
            {loading ? (
              <div className="empty-history">
                <h4>Đang tải...</h4>
              </div>
            ) : personalMedicines.length === 0 ? (
              <div className="empty-history">
                <h4>Chưa có thuốc cá nhân nào</h4>
                <p>Chưa có thuốc cá nhân nào được ghi nhận. Hãy bắt đầu bằng cách thêm thuốc mới!</p>
              </div>
            ) : (
              personalMedicines.map((medicine, index) => (
                <div key={index} className="history-item">
                  <h4>{medicine.medicineName || medicine.name || 'Không có tên thuốc'}</h4>
                  <div className="history-details">
                    <div className="history-detail">
                      <label>Loại thuốc:</label>
                      <span>{medicine.medicineType || medicine.type || 'Không xác định'}</span>
                    </div>
                    <div className="history-detail">
                      <label>Số lượng:</label>
                      <span>{medicine.quantity || 'Không xác định'}</span>
                    </div>
                    <div className="history-detail">
                      <label>Hạn sử dụng:</label>
                      <span>{medicine.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString('vi-VN') : 'Không có'}</span>
                    </div>
                    <div className="history-detail">
                      <label>Tình trạng:</label>
                      <span>{medicine.condition || 'Không xác định'}</span>
                    </div>
                    {medicine.studentId && (
                      <div className="history-detail">
                        <label>Học sinh:</label>
                        <span>{students.find(s => String(s.id) === String(medicine.studentId))?.name || '---'}</span>
                      </div>
                    )}
                  </div>
                  {medicine.description && (
                    <div className="history-detail">
                      <label>Ghi chú:</label>
                      <span>{medicine.description}</span>
                    </div>
                  )}
                  <div className="history-status">
                    {getStatusBadge(medicine.status || 'active')}
                    <span className="history-date">{formatDate(medicine.createdAt || medicine.created)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {submitting && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <h4>Đang thêm thuốc...</h4>
            <p>Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalMedicine; 