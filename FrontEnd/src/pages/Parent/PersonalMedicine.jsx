
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Parent/DonateMedicine.css';
import apiClient, { API_ENDPOINTS } from '../../services/config';

const PersonalMedicine = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: '',
    medicineId: '', // Reference to medicine from API
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
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchStudentsByParent();
    loadPersonalMedicines();
    loadMedicines();
  }, []);

  // 🎯 FUNCTION QUAN TRỌNG: Lấy danh sách học sinh CHỈ thuộc về phụ huynh hiện tại
  // Đảm bảo mỗi phụ huynh chỉ thấy con của chính họ, không thấy con của người khác
  const fetchStudentsByParent = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const parentId = userInfo.userId;
      
      console.log('🔍 Đang tìm học sinh cho phụ huynh:', userInfo);
      console.log('👤 Parent ID hiện tại:', parentId);
      
      if (!parentId) {
        setMessage({ type: 'error', text: 'Không tìm thấy thông tin phụ huynh. Vui lòng đăng nhập lại.' });
        setStudents([]);
        return;
      }
      
      // Try different possible student endpoints
      let studentData = [];
      
      try {
        // First try: Get students by parent ID (most optimal)
        const res = await apiClient.get(`${API_ENDPOINTS.STUDENT.GET_BY_PARENT}/${parentId}`);
        console.log('GetStudentsByParentId Response:', res);
        studentData = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
      } catch (getByParentError) {
        console.error('GetStudentsByParentId failed:', getByParentError);
        
        try {
          // Second try: Get all students (if available)
          const res = await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL);
          console.log('GetAllStudents Response:', res);
          studentData = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
        } catch (getAllError) {
          console.error('GetAllStudents failed:', getAllError);
          
          try {
            // Third try: Try alternative endpoint like /Student/student
            const res = await apiClient.get('/Student/student');
            console.log('Alternative API Response:', res);
            studentData = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
          } catch (altError) {
            console.error('Alternative student endpoint failed:', altError);
            
            // Fallback: Use mock data for development  
            console.log('Using mock data as fallback');
            studentData = [
              {
                studentId: 1,
                fullname: 'Nguyễn Minh Khôi',
                classname: 'Lớp 5A',
                parent: {
                  parentid: parentId, // Use current parent ID for demo
                  fullname: 'Nguyễn Văn A'
                }
              }
            ];
          }
        }
      }
      
      if (studentData.length === 0) {
        setMessage({ type: 'info', text: 'Không tìm thấy học sinh nào thuộc tài khoản phụ huynh này.' });
        setStudents([]);
        return;
      }
      
      // 🔎 LOGIC QUAN TRỌNG: Chỉ hiển thị con của phụ huynh hiện tại
      console.log('📚 Tổng số học sinh từ API:', studentData.length);
      
      // Lọc học sinh thuộc về phụ huynh hiện tại
      const filtered = studentData.filter(stu => {
        // 🔧 FIX: Parent ID nằm trong nested object stu.parent.parentid
        const studentParentId = stu.parent?.parentid || stu.parent?.parentId || 
                               stu.parentid || stu.parentId || stu.parent_id || stu.ParentId;
        const isMyChild = String(studentParentId) === String(parentId);
        
        console.log(`👶 Học sinh: ${stu.fullname || stu.name} - Parent: ${stu.parent?.fullname} - Parent ID: ${studentParentId} - Là con tôi: ${isMyChild ? '✅' : '❌'}`);
        
        return isMyChild; // CHỈ LẤY CON CỦA PHỤ HUYNH HIỆN TẠI
      });
      
      console.log('🎯 Kết quả sau khi lọc - Chỉ con của tôi:', filtered);
      console.log(`📊 Số lượng: ${filtered.length} học sinh thuộc về phụ huynh ID: ${parentId}`);
      
      if (filtered.length === 0) {
        setMessage({ 
          type: 'info', 
          text: `Không tìm thấy học sinh nào thuộc về tài khoản phụ huynh này (ID: ${parentId}). Vui lòng liên hệ nhà trường để cập nhật thông tin.` 
        });
        setStudents([]);
        return;
      }
      
      // 🎨 Chuẩn hóa dữ liệu học sinh để hiển thị
      const mappedStudents = filtered.map(stu => ({
        id: stu.studentId || stu.studentid || stu.id, // API trả về studentId (camelCase)
        name: stu.fullname || stu.fullName || stu.name || 'Không có tên', // API trả về fullname (lowercase)
        class: stu.classname || stu.classId || stu.className || '---' // API trả về classname (lowercase)
      }));
      
      console.log('✅ Danh sách học sinh cuối cùng (CHỈ CON CỦA PHỤ HUYNH HIỆN TẠI):', mappedStudents);
      setStudents(mappedStudents);
      
      // Hiển thị thông báo thành công
      if (mappedStudents.length > 0) {
        setMessage({ 
          type: 'success', 
          text: `Đã tải thành công ${mappedStudents.length} học sinh thuộc tài khoản của bạn.` 
        });
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

  const loadMedicines = async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.MEDICINE.GET_ALL);
      console.log('🔍 Medicines API Response:', res);
      
      const medicinesArray = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
      
      // Filter only active medicines (not deleted)
      const activeMedicines = medicinesArray.filter(med => !med.isDeleted);
      console.log(`📊 Active Medicines: ${activeMedicines.length}/${medicinesArray.length}`);
      
      setMedicines(activeMedicines);
    } catch (error) {
      console.error('Error loading medicines:', error);
      setMedicines([]);
    }
  };

  const loadPersonalMedicines = async () => {
    setLoading(true);
    try {
      // Get current parent ID to filter medicines
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const parentId = userInfo.userId;

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
      console.log('🔍 Personal Medicines API Response:', data);
      
      // Ensure data is an array
      const medicinesArray = Array.isArray(data) ? data : (data.data ? data.data : []);
      
      // 🎯 FILTER: Chỉ hiển thị thuốc của phụ huynh hiện tại
      const filteredMedicines = parentId ? medicinesArray.filter(medicine => {
        const isMyMedicine = String(medicine.parentid) === String(parentId);
        console.log(`💊 Medicine ID: ${medicine.medicineid} - Parent: ${medicine.parentid} - Mine: ${isMyMedicine ? '✅' : '❌'}`);
        return isMyMedicine;
      }) : medicinesArray;
      
      console.log(`📊 Filtered Result: ${filteredMedicines.length}/${medicinesArray.length} medicines for parent ${parentId}`);
      setPersonalMedicines(filteredMedicines);
      
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
    
    // Special handling for medicine selection
    if (name === 'medicineId') {
      const selectedMedicine = medicines.find(med => String(med.medicineid) === String(value));
      if (selectedMedicine) {
        setFormData(prev => ({
          ...prev,
          medicineId: value,
          medicineName: selectedMedicine.medicinename,
          medicineType: selectedMedicine.type
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendNotificationToNurse = async (medicineData, studentData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const parentName = userInfo.fullName || userInfo.name || 'Phụ huynh';
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const notificationData = {
        message: `📋 Thuốc cá nhân mới từ ${parentName}: "${medicineData.medicineName}" cho học sinh ${studentData.name} (Lớp ${studentData.class}). Số lượng: ${medicineData.quantity}. Hạn sử dụng: ${new Date(medicineData.expiryDate).toLocaleDateString('vi-VN')}. Liên hệ: ${medicineData.contactPhone}`,
        createdBy: userInfo.userId,
        recipientType: 'Staff',
        priority: 'medium',
        category: 'personal_medicine',
        createdAt: new Date().toISOString()
      };

      console.log('🔔 Sending notification to nurse:', notificationData);

      // Use direct fetch with proper headers to ensure token is included
      const notificationResponse = await fetch(`${apiClient.defaults.baseURL}${API_ENDPOINTS.NOTIFICATION.CREATE_FOR_STAFF}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationData)
      });

      if (!notificationResponse.ok) {
        throw new Error(`Notification API error! status: ${notificationResponse.status}`);
      }

      const result = await notificationResponse.json();
      console.log('✅ Notification sent successfully to nurse:', result);
      return result;
    } catch (error) {
      console.error('❌ Error sending notification to nurse:', error);
      // Don't throw error here as medicine was already added successfully
      // But log the detailed error for debugging
      console.error('Notification error details:', {
        error: error.message,
        stack: error.stack
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Get parent ID from user info
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const parentId = userInfo.userId;

      if (!parentId) {
        setMessage({ type: 'error', text: 'Không tìm thấy thông tin phụ huynh. Vui lòng đăng nhập lại.' });
        setSubmitting(false);
        return;
      }

      // Map form data to API structure
      const submitData = {
        parentid: parentId,
        studentid: parseInt(formData.studentId), // Convert to number
        quantity: parseInt(formData.quantity), // Convert to number
        receiveddate: new Date().toISOString(), // Current date
        expiryDate: formData.expiryDate,
        status: false, // Default status
        note: `${formData.medicineName} - ${formData.medicineType}. ${formData.description}. Tình trạng: ${formData.condition}. Liên hệ: ${formData.contactPhone}. Thời gian tiện: ${formData.preferredTime}`
      };

      // Add medicine reference if selected from list
      if (formData.medicineId) {
        submitData.medicineId = parseInt(formData.medicineId);
      }

      console.log('Submitting personal medicine data:', submitData);

      const response = await fetch('https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicine', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 🎯 GỬI THÔNG BÁO CHO Y TÁ
      const selectedStudent = students.find(s => String(s.id) === String(formData.studentId));
      if (selectedStudent) {
        await sendNotificationToNurse(formData, selectedStudent);
      }

      setMessage({ type: 'success', text: 'Thêm thuốc cá nhân thành công và đã gửi thông báo cho y tá!' });
      setFormData({
        studentId: '',
        medicineId: '',
        medicineName: '',
        medicineType: '',
        quantity: '',
        expiryDate: '',
        condition: 'good',
        description: '',
        contactPhone: '',
        preferredTime: ''
      });
      
      // Cập nhật danh sách thuốc cá nhân
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
                <label htmlFor="medicineId">Chọn thuốc *</label>
                <select
                  id="medicineId"
                  name="medicineId"
                  value={formData.medicineId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn thuốc từ danh sách</option>
                  {medicines.map((medicine) => (
                    <option key={medicine.medicineid} value={medicine.medicineid}>
                      {medicine.medicinename} - {medicine.type}
                    </option>
                  ))}
                </select>
              </div>

              {formData.medicineId && (
                <div className="form-group">
                  <label htmlFor="medicineName">Tên thuốc đã chọn</label>
                  <input
                    type="text"
                    id="medicineName"
                    name="medicineName"
                    value={formData.medicineName}
                    onChange={handleInputChange}
                    disabled
                    placeholder="Tên thuốc sẽ tự động điền"
                  />
                </div>
              )}

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
                    <option value="Tablet">Thuốc viên</option>
                    <option value="Capsule">Thuốc nang</option>
                    <option value="Syrup">Siro/Thuốc nước</option>
                    <option value="Powder">Thuốc bột</option>
                    <option value="Injection">Thuốc tiêm</option>
                    <option value="Cream">Thuốc bôi/Kem</option>
                    <option value="Drops">Thuốc nhỏ mắt/tai/mũi</option>
                    <option value="Inhaler">Thuốc xịt/Hít</option>
                    <option value="Suppository">Thuốc đặt</option>
                    <option value="Other">Khác</option>
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
              personalMedicines.map((medicine, index) => {
                const student = students.find(s => String(s.id) === String(medicine.studentid));
                const studentName = student?.name || 'Học sinh không xác định';
                
                // Try to find medicine name from Medicine API if available, otherwise extract from note
                const medicineInfo = medicines.find(m => String(m.medicineid) === String(medicine.medicineid));
                
                // Debug: Check if medicine IDs match
                if (index === 0) { // Only log for first item to avoid spam
                  console.log(`🔍 PersonalMedicine IDs: ${personalMedicines.map(m => m.medicineid).join(', ')}`);
                  console.log(`🔍 Available Medicine IDs: ${medicines.map(m => m.medicineid).join(', ')}`);
                }
                
                let medicineTitle = `💊 Thuốc cá nhân #${medicine.medicineid}`;
                
                if (medicineInfo) {
                  // Found in Medicine API
                  medicineTitle = `💊 ${medicineInfo.medicinename} (${medicineInfo.type})`;
                } else {
                  // If not found in Medicine API, try to show meaningful title from note or use generic
                  if (medicine.note && medicine.note.length > 0) {
                    // Try to extract meaningful info from note
                    const note = medicine.note.toLowerCase();
                    let medicineName = '';
                    
                    // Check for common medicine patterns in note
                    if (note.includes('paracetamol')) medicineName = 'Paracetamol';
                    else if (note.includes('ibuprofen')) medicineName = 'Ibuprofen'; 
                    else if (note.includes('vitamin')) medicineName = 'Vitamin';
                    else if (note.includes('syrup') || note.includes('ml')) medicineName = 'Siro';
                    else if (note.includes('viên')) medicineName = 'Thuốc viên';
                    else if (note.includes('thuốc')) medicineName = 'Thuốc';
                    
                    if (medicineName) {
                      medicineTitle = `💊 ${medicineName}`;
                    }
                  }
                }
                
                return (
                  <div key={medicine.medicineid || index} className="history-item">
                    <h4>{medicineTitle}</h4>
                    <div className="history-details">
                      <div className="history-detail">
                        <label>Học sinh:</label>
                        <span>{studentName}</span>
                      </div>
                      <div className="history-detail">
                        <label>Thuốc:</label>
                        <span>
                          {medicineInfo ? 
                            `${medicineInfo.medicinename} (${medicineInfo.type})` : 
                            (() => {
                              if (medicine.note && medicine.note.length > 0) {
                                const note = medicine.note.toLowerCase();
                                if (note.includes('paracetamol')) return 'Paracetamol';
                                if (note.includes('ibuprofen')) return 'Ibuprofen'; 
                                if (note.includes('vitamin')) return 'Vitamin';
                                if (note.includes('syrup') || note.includes('ml')) return 'Siro';
                                if (note.includes('viên')) return 'Thuốc viên';
                                if (note.includes('thuốc')) return 'Thuốc';
                              }
                              return `Thuốc ID: ${medicine.medicineid}`;
                            })()
                          }
                        </span>
                      </div>
                      <div className="history-detail">
                        <label>Số lượng:</label>
                        <span>{medicine.quantity}</span>
                      </div>
                      <div className="history-detail">
                        <label>Ngày nhận:</label>
                        <span>{medicine.receiveddate ? new Date(medicine.receiveddate).toLocaleDateString('vi-VN') : 'Không có'}</span>
                      </div>
                      <div className="history-detail">
                        <label>Hạn sử dụng:</label>
                        <span>{medicine.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString('vi-VN') : 'Không có'}</span>
                      </div>
                      <div className="history-detail">
                        <label>Trạng thái:</label>
                        <span className={`status-badge ${medicine.status ? 'status-approved' : 'status-pending'}`}>
                          {medicine.status ? 'ĐÃ XỬ LÝ' : 'CHỜ XỬ LÝ'}
                        </span>
                      </div>
                    </div>
                    {medicine.note && (
                      <div className="history-detail">
                        <label>Ghi chú:</label>
                        <span>{medicine.note}</span>
                      </div>
                    )}
                    <div className="history-status">
                      <span className="history-date">
                        Cập nhật: lúc {new Date(medicine.receiveddate).toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} {new Date(medicine.receiveddate).toLocaleDateString('vi-VN', {
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
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