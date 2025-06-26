import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitDonation, getDonationHistory } from '../../services/parentService';
import '../../css/Parent/DonateMedicine.css';
import apiClient from '../../services/config';

const GET_ALL_STUDENTS_API = 'https://api-schoolhealth.purintech.id.vn/api/Student/GetAllStudents';

const DonateMedicine = () => {
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
  
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudentsByParent();
    loadDonationHistory();
  }, []);

  const fetchStudentsByParent = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const parentId = userInfo.userId;
      const res = await apiClient.get(GET_ALL_STUDENTS_API);
      // Lọc học sinh theo parentId
      const filtered = Array.isArray(res)
        ? res.filter(stu => String(stu.parentid) === String(parentId))
        : [];
      setStudents(filtered.map(stu => ({
        id: stu.studentid,
        name: stu.fullname,
        class: stu.classid || '---'
      })));
    } catch (err) {
      setStudents([]);
    }
  };

  const loadDonationHistory = async () => {
    setLoading(true);
    try {
      const history = await getDonationHistory();
      setDonationHistory(history);
    } catch (error) {
      console.error('Error loading donation history:', error);
      setMessage({ type: 'error', text: 'Không thể tải lịch sử gửi thuốc' });
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
      await submitDonation(formData);
      setMessage({ type: 'success', text: 'Gửi thông tin thuốc cho học sinh thành công!' });
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
      loadDonationHistory();
    } catch (error) {
      console.error('Error submitting donation:', error);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.' });
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
          <h1>Gửi Thuốc Cho Học Sinh</h1>
          <p>Phụ huynh gửi thuốc cho học sinh mang đến trường, đảm bảo an toàn và đúng quy định</p>
        </div>
      </div>

      {/* Information Section */}
      <div className="donate-info-section">
        <div className="info-header">
          <h3>ℹ️ Thông Tin Gửi Thuốc Cho Học Sinh</h3>
        </div>
        <div className="info-content">
          <div className="info-item">
            <h4>📋 Quy trình gửi thuốc</h4>
            <p>Khi bạn gửi thông tin thuốc cho học sinh, nhà trường sẽ:</p>
            <ul>
              <li>Tiếp nhận thông tin thuốc và liên hệ xác nhận nếu cần</li>
              <li>Hướng dẫn phụ huynh ghi nhãn thuốc rõ ràng (tên học sinh, lớp, liều dùng...)</li>
              <li>Nhận thuốc từ phụ huynh và bàn giao cho y tế trường</li>
              <li>Đảm bảo thuốc được sử dụng đúng cho học sinh</li>
            </ul>
          </div>

          <div className="info-item">
            <h4>✅ Lưu ý khi gửi thuốc cho học sinh</h4>
            <ul>
              <li>Thuốc còn hạn sử dụng, bao bì nguyên vẹn</li>
              <li>Ghi rõ họ tên học sinh, lớp, liều dùng, thời gian dùng trên nhãn thuốc</li>
              <li>Không gửi thuốc kê đơn đặc biệt (thuốc gây nghiện, kiểm soát...)</li>
              <li>Thông báo cho giáo viên chủ nhiệm/y tế trường khi gửi thuốc</li>
            </ul>
          </div>

          <div className="info-item">
            <h4>📞 Liên hệ hỗ trợ</h4>
            <p>Nếu bạn có thắc mắc về việc gửi thuốc cho học sinh, vui lòng liên hệ:</p>
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
        {/* Send Medicine Form */}
        <div className="donate-form-section">
          <div className="form-header">
            <h3>📋 Form Gửi Thuốc Cho Học Sinh</h3>
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
                {submitting ? 'Đang gửi...' : 'Gửi thông tin thuốc cho học sinh'}
              </button>
            </form>
          </div>
        </div>

        {/* Send Medicine History */}
        <div className="donate-history-section">
          <div className="history-header">
            <h3>📊 Lịch Sử Gửi Thuốc</h3>
          </div>
          <div className="history-content">
            {loading ? (
              <div className="empty-history">
                <h4>Đang tải...</h4>
              </div>
            ) : donationHistory.length === 0 ? (
              <div className="empty-history">
                <h4>Chưa có lịch sử gửi thuốc</h4>
                <p>Bạn chưa gửi thuốc nào cho học sinh. Hãy bắt đầu bằng cách điền form bên cạnh!</p>
              </div>
            ) : (
              donationHistory.map((donation, index) => (
                <div key={index} className="history-item">
                  <h4>{donation.medicineName}</h4>
                  <div className="history-details">
                    <div className="history-detail">
                      <label>Loại thuốc:</label>
                      <span>{donation.medicineType}</span>
                    </div>
                    <div className="history-detail">
                      <label>Số lượng:</label>
                      <span>{donation.quantity}</span>
                    </div>
                    <div className="history-detail">
                      <label>Hạn sử dụng:</label>
                      <span>{new Date(donation.expiryDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="history-detail">
                      <label>Tình trạng:</label>
                      <span>{donation.condition}</span>
                    </div>
                    {donation.studentId && (
                      <div className="history-detail">
                        <label>Học sinh:</label>
                        <span>{students.find(s => String(s.id) === String(donation.studentId))?.name || '---'}</span>
                      </div>
                    )}
                  </div>
                  {donation.description && (
                    <div className="history-detail">
                      <label>Mô tả:</label>
                      <span>{donation.description}</span>
                    </div>
                  )}
                  <div className="history-status">
                    {getStatusBadge(donation.status)}
                    <span className="history-date">{formatDate(donation.createdAt)}</span>
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
            <h4>Đang gửi thông tin...</h4>
            <p>Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonateMedicine; 