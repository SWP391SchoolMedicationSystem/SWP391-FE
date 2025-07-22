import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Parent/MedicineRequest.css';
import apiClient from '../../services/config';
import { CircularProgress, Typography, Box } from '@mui/material';

const MedicineRequest = () => {
  const navigate = useNavigate();
  
  // Tab state - 'medicine', 'absent', or 'other'
  const [activeTab, setActiveTab] = useState('medicine');
  
  // Helper function to get current parent info
  const getCurrentParentInfo = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      
      // Try multiple possible parent ID fields from the JWT token or userInfo
      const parentId = userInfo.parentId || 
                       userInfo.userId || 
                       userInfo.id || 
                       userInfo.Id ||
                       userInfo.parentid;
      
      const parentName = userInfo.fullName || 
                        userInfo.fullname || 
                        userInfo.name || 
                        userInfo.Name ||
                        'Phụ huynh';
      
      return {
        id: parentId,
        name: parentName
      };
    } catch (error) {
      console.error('❌ Error parsing userInfo:', error);
      return { id: null, name: 'Phụ huynh' };
    }
  };

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [students, setStudents] = useState([]);
  
  // Medicine Request Form Data
  const [medicineFormData, setMedicineFormData] = useState({
    studentId: '',
    title: '',
    medicineName: '',
    medicineDescription: '',
    reason: '',
    documentFile: null
  });
  
  // Absent Request Form Data
  const [absentFormData, setAbsentFormData] = useState({
    studentId: '',
    title: '',
    reasonForAbsent: '',
    absentDate: '',
    documentFile: null
  });
  
  // Other Request Form Data
  const [otherFormData, setOtherFormData] = useState({
    studentId: '',
    title: '',
    reason: '',
    documentFile: null
  });
  
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const parentInfo = getCurrentParentInfo();
      
      if (!parentInfo.id) {
        console.error('❌ No parent ID found in localStorage');
        setMessage({ type: 'error', text: 'Không tìm thấy thông tin phụ huynh trong hệ thống. Vui lòng đăng nhập lại.' });
        setStudents([]);
        return;
      }

      // PRIMARY: Use path parameter endpoint as requested by user
      const pathEndpoint = `/Student/GetStudentByParentId/${parentInfo.id}`;
      
      try {
        const res = await apiClient.get(pathEndpoint);
        
        const studentsArray = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
        
        if (studentsArray.length > 0) {
          // Map students to ensure consistent data structure
          const mappedStudents = studentsArray.map(student => ({
            studentId: student.studentId || student.studentid || student.id,
            studentid: student.studentId || student.studentid || student.id,
            id: student.studentId || student.studentid || student.id,
            fullname: student.fullname || student.fullName || student.name,
            fullName: student.fullname || student.fullName || student.name,
            name: student.fullname || student.fullName || student.name,
            classname: student.classname || student.className || student.class || 'Chưa xác định',
            className: student.classname || student.className || student.class || 'Chưa xác định',
            class: student.classname || student.className || student.class || 'Chưa xác định',
            parentId: student.parentId || student.parentid || parentInfo.id,
            parentid: student.parentId || student.parentid || parentInfo.id
          }));
          
          setStudents(mappedStudents);

          // Auto-select if only one student
          if (mappedStudents.length === 1) {
            const studentId = String(mappedStudents[0].studentId);
            setMedicineFormData(prev => ({
              ...prev,
              studentId: studentId
            }));
            setAbsentFormData(prev => ({
              ...prev,
              studentId: studentId
            }));
            setOtherFormData(prev => ({
              ...prev,
              studentId: studentId
            }));
          }

          setMessage({ 
            type: 'success', 
            text: `✅ Đã tải thành công ${mappedStudents.length} học sinh` 
          });
          return;
        }
      } catch (error1) {
        // Path parameter method failed, try query parameter
      }
      
      // FALLBACK: Try query parameter endpoint
      const queryEndpoint = `/Student/GetStudentByParentId?parentId=${parentInfo.id}`;
      
      try {
        const fallbackRes = await apiClient.get(queryEndpoint);
        
        const fallbackStudents = Array.isArray(fallbackRes) ? fallbackRes : (Array.isArray(fallbackRes.data) ? fallbackRes.data : []);
        
        if (fallbackStudents.length > 0) {
          const mappedStudents = fallbackStudents.map(student => ({
            studentId: student.studentId || student.studentid || student.id,
            studentid: student.studentId || student.studentid || student.id,
            id: student.studentId || student.studentid || student.id,
            fullname: student.fullname || student.fullName || student.name,
            fullName: student.fullname || student.fullName || student.name,
            name: student.fullname || student.fullName || student.name,
            classname: student.classname || student.className || student.class || 'Chưa xác định',
            className: student.classname || student.className || student.class || 'Chưa xác định',
            class: student.classname || student.className || student.class || 'Chưa xác định',
            parentId: student.parentId || student.parentid || parentInfo.id,
            parentid: student.parentId || student.parentid || parentInfo.id
          }));
          
          setStudents(mappedStudents);
          
          if (mappedStudents.length === 1) {
            const studentId = String(mappedStudents[0].studentId);
            setMedicineFormData(prev => ({ ...prev, studentId: studentId }));
            setAbsentFormData(prev => ({ ...prev, studentId: studentId }));
            setOtherFormData(prev => ({ ...prev, studentId: studentId }));
          }
          
          setMessage({ 
            type: 'success', 
            text: `✅ Đã tải thành công ${mappedStudents.length} học sinh (fallback)` 
          });
          return;
        }
      } catch (error2) {
        console.error('❌ Query parameter method also failed:', error2.response?.status, error2.response?.data);
      }
      
      // If both methods failed, show detailed error
      console.warn('⚠️ No students found for parent ID:', parentInfo.id);
      setMessage({ 
        type: 'warning', 
        text: `⚠️ Chưa tìm thấy học sinh nào cho phụ huynh này (ID: ${parentInfo.id}). 

Có thể:
• Chưa có học sinh được đăng ký cho tài khoản này
• Dữ liệu chưa được đồng bộ trong hệ thống
• API endpoint trả về 404 Not Found

Vui lòng liên hệ với nhà trường để được hỗ trợ.` 
      });
      setStudents([]);
      
    } catch (error) {
      console.error('❌ Error loading students:', error);
      
      setMessage({ 
        type: 'error', 
        text: `❌ Không thể tải danh sách học sinh: ${error.response?.data?.message || error.message || 'Lỗi kết nối mạng'}

Vui lòng:
• Kiểm tra kết nối internet
• Thử lại sau vài phút
• Liên hệ support nếu vấn đề tiếp tục` 
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === 'medicine') {
      setMedicineFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else if (activeTab === 'absent') {
      setAbsentFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else { // activeTab === 'other'
      setOtherFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ 
          type: 'error', 
          text: 'Chỉ hỗ trợ file ảnh (JPG, PNG) hoặc PDF' 
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ 
          type: 'error', 
          text: 'File không được vượt quá 5MB' 
        });
        return;
      }

      if (activeTab === 'medicine') {
        setMedicineFormData(prev => ({
          ...prev,
          documentFile: file
        }));
      } else if (activeTab === 'absent') {
        setAbsentFormData(prev => ({
          ...prev,
          documentFile: file
        }));
      } else { // activeTab === 'other'
        setOtherFormData(prev => ({
          ...prev,
          documentFile: file
        }));
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const parentInfo = getCurrentParentInfo();
      
      if (!parentInfo.id) {
        throw new Error('Không tìm thấy thông tin phụ huynh');
      }

      if (!activeTab) {
        throw new Error('Vui lòng chọn loại yêu cầu');
      }

      if (activeTab === 'medicine' && !medicineFormData.studentId) {
        throw new Error('Vui lòng chọn học sinh cho yêu cầu thuốc');
      }

      if (activeTab === 'absent' && !absentFormData.studentId) {
        throw new Error('Vui lòng chọn học sinh cho đơn xin nghỉ');
      }

      if (activeTab === 'other' && !otherFormData.studentId) {
        throw new Error('Vui lòng chọn học sinh cho đơn xin khác');
      }

      if (activeTab === 'medicine' && !medicineFormData.title.trim()) {
        throw new Error('Vui lòng nhập tiêu đề yêu cầu');
      }

      if (activeTab === 'absent' && !absentFormData.title.trim()) {
        throw new Error('Vui lòng nhập tiêu đề đơn xin nghỉ');
      }

      if (activeTab === 'other' && !otherFormData.title.trim()) {
        throw new Error('Vui lòng nhập tiêu đề đơn xin khác');
      }

      if (activeTab === 'medicine' && !medicineFormData.medicineName.trim()) {
        throw new Error('Vui lòng nhập tên thuốc');
      }

      if (activeTab === 'medicine' && !medicineFormData.reason.trim()) {
        throw new Error('Vui lòng nhập lý do cần thuốc');
      }

      if (activeTab === 'absent' && !absentFormData.reasonForAbsent.trim()) {
        throw new Error('Vui lòng nhập lý do nghỉ học');
      }

      if (activeTab === 'other' && !otherFormData.reason.trim()) {
        throw new Error('Vui lòng nhập lý do gửi đơn');
      }

      if (activeTab === 'absent' && !absentFormData.absentDate) {
        throw new Error('Vui lòng chọn ngày nghỉ học');
      }

      // Create FormData for multipart/form-data
      const requestData = new FormData();
      requestData.append('ParentId', String(parentInfo.id));
      
      let apiUrl = '';
      
      if (activeTab === 'medicine') {
        requestData.append('StudentId', String(medicineFormData.studentId));
        requestData.append('Title', medicineFormData.title.trim());
        requestData.append('MedicineName', medicineFormData.medicineName.trim());
        requestData.append('MedicineDescription', medicineFormData.medicineDescription.trim() || '');
        requestData.append('Reason', medicineFormData.reason.trim());
        requestData.append('CreatedBy', parentInfo.name);
        
        if (medicineFormData.documentFile) {
          requestData.append('DocumentFile', medicineFormData.documentFile);
        }
        
        apiUrl = 'https://api-schoolhealth.purintech.id.vn/api/Form/form/medicinerequest';
      } else if (activeTab === 'absent') {
        requestData.append('StudentId', String(absentFormData.studentId));
        requestData.append('Title', absentFormData.title.trim());
        requestData.append('ReasonForAbsent', absentFormData.reasonForAbsent.trim());
        requestData.append('AbsentDate', absentFormData.absentDate);
        requestData.append('CreatedBy', parentInfo.name);
        
        if (absentFormData.documentFile) {
          requestData.append('DocumentFile', absentFormData.documentFile);
        } else {
          requestData.append('DocumentFile', '');
        }
        
        apiUrl = 'https://api-schoolhealth.purintech.id.vn/api/Form/form/absentrequest';
      } else { // activeTab === 'other'
        requestData.append('StudentID', String(otherFormData.studentId));
        requestData.append('Title', otherFormData.title.trim());
        requestData.append('Reason', otherFormData.reason.trim());
        requestData.append('CreatedBy', parentInfo.name);
        
        if (otherFormData.documentFile) {
          requestData.append('DocumentFile', otherFormData.documentFile);
        } else {
          requestData.append('DocumentFile', '');
        }
        
        apiUrl = 'https://api-schoolhealth.purintech.id.vn/api/Form/form/otherrequest';
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`
        },
        body: requestData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();

      setMessage({ 
        type: 'success', 
        text: `✅ Gửi ${activeTab === 'medicine' ? 'yêu cầu thuốc' : activeTab === 'absent' ? 'đơn xin nghỉ' : 'đơn xin khác'} thành công! Nhà trường sẽ xem xét và phản hồi sớm nhất.` 
      });
      
      // Reset form
      if (activeTab === 'medicine') {
        setMedicineFormData({
          studentId: students.length === 1 ? String(students[0].studentId || students[0].studentid || students[0].id) : '',
          title: '',
          medicineName: '',
          medicineDescription: '',
          reason: '',
          documentFile: null
        });
        setFilePreview(null);
      } else if (activeTab === 'absent') {
        setAbsentFormData({
          studentId: students.length === 1 ? String(students[0].studentId || students[0].studentid || students[0].id) : '',
          title: '',
          reasonForAbsent: '',
          absentDate: '',
          documentFile: null
        });
        setFilePreview(null);
      } else { // activeTab === 'other'
        setOtherFormData({
          studentId: students.length === 1 ? String(students[0].studentId || students[0].studentid || students[0].id) : '',
          title: '',
          reason: '',
          documentFile: null
        });
        setFilePreview(null);
      }
      
      // Reset file input
      const fileInput = document.getElementById('documentFile');
      if (fileInput) {
        fileInput.value = '';
      }

    } catch (error) {
      console.error('Error submitting request:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Có lỗi xảy ra: ${error.message}` 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const removeFile = () => {
    if (activeTab === 'medicine') {
      setMedicineFormData(prev => ({
        ...prev,
        documentFile: null
      }));
    } else if (activeTab === 'absent') {
      setAbsentFormData(prev => ({
        ...prev,
        documentFile: null
      }));
    } else { // activeTab === 'other'
      setOtherFormData(prev => ({
        ...prev,
        documentFile: null
      }));
    }
    setFilePreview(null);
    
    const fileInput = document.getElementById('documentFile');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="personal-medicine-container">
      {/* Header */}
      <div className="medicine-header" style={{
        background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(47, 81, 72, 0.3)'
      }}>
        <div>
          <h1>{activeTab === 'medicine' ? '💊 Gửi đơn yêu cầu' : activeTab === 'absent' ? '📋 Đơn Xin Nghỉ' : '📝 Đơn Xin Khác'}</h1>
          <p>{activeTab === 'medicine' ? 'Gửi yêu cầu thuốc cho con em đến nhà trường' : activeTab === 'absent' ? 'Gửi đơn xin nghỉ học cho con em đến nhà trường' : 'Gửi đơn xin khác cho con em đến nhà trường'}</p>
        </div>
        <div className="header-buttons">
          <button 
            onClick={() => navigate('/parent')}
            className="refresh-btn"
          >
            ← Về Trang Chủ
          </button>
          <button 
            onClick={async () => {
              setLoading(true);
              try {
                await loadStudents();
                setMessage({ type: 'success', text: '✅ Đã làm mới dữ liệu' });
              } catch (error) {
                setMessage({ type: 'error', text: '❌ Có lỗi khi làm mới dữ liệu' });
              } finally {
                setLoading(false);
              }
            }}
            className="refresh-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Đang tải...
              </>
            ) : (
              <>
                🔄 Làm mới
              </>
            )}
          </button>
        </div>
      </div>

      {/* Information Section */}
      <div className="medicine-info-section">
        <div className="info-header">
                      <h3>ℹ️ Hướng Dẫn {activeTab === 'medicine' ? 'Gửi đơn yêu cầu' : activeTab === 'absent' ? 'Gửi Đơn Xin Nghỉ' : 'Gửi Đơn Xin Khác'}</h3>
        </div>
        <div className="info-content">
          <div className="info-column">
            <h4>📋 Cách thức gửi {activeTab === 'medicine' ? 'yêu cầu' : activeTab === 'absent' ? 'đơn' : 'đơn'}</h4>
            <p>Hệ thống giúp Phụ huynh:</p>
            <ul>
              {activeTab === 'medicine' ? (
                <>
                  <li>Gửi yêu cầu thuốc cần thiết cho con em</li>
                  <li>Đính kèm đơn thuốc từ bác sĩ</li>
                  <li>Mô tả rõ lý do và cách sử dụng</li>
                  <li>Theo dõi trạng thái phê duyệt</li>
                </>
              ) : activeTab === 'absent' ? (
                <>
                  <li>Thông báo nghỉ học của con em</li>
                  <li>Nêu rõ lý do nghỉ học</li>
                  <li>Chọn ngày nghỉ học cụ thể</li>
                  <li>Đính kèm giấy tờ minh chứng (nếu có)</li>
                </>
              ) : (
                <>
                  <li>Gửi đơn xin khác của con em</li>
                  <li>Nêu rõ lý do gửi đơn</li>
                  <li>Đính kèm giấy tờ minh chứng (nếu có)</li>
                </>
              )}
            </ul>
          </div>

          <div className="info-column">
            <h4>✅ Lưu ý quan trọng</h4>
            <ul>
              {activeTab === 'medicine' ? (
                <>
                  <li>Chỉ gửi yêu cầu cho thuốc thực sự cần thiết</li>
                  <li>Đảm bảo thông tin thuốc chính xác và đầy đủ</li>
                  <li>Đính kèm đơn thuốc của bác sĩ (nếu có)</li>
                  <li>File đính kèm không quá 5MB</li>
                  <li>Chờ phản hồi từ y tá trường trong 24h</li>
                </>
              ) : activeTab === 'absent' ? (
                <>
                  <li>Gửi đơn trước ngày nghỉ ít nhất 1 ngày</li>
                  <li>Nêu rõ lý do nghỉ học (ốm, việc gia đình...)</li>
                  <li>Đính kèm giấy bác sĩ nếu nghỉ do ốm đau</li>
                  <li>File đính kèm không quá 5MB</li>
                  <li>Chờ phản hồi từ giáo viên chủ nhiệm</li>
                </>
              ) : (
                <>
                  <li>Gửi đơn xin khác trước ngày nghỉ ít nhất 1 ngày</li>
                  <li>Nêu rõ lý do gửi đơn</li>
                  <li>Đính kèm giấy tờ minh chứng (nếu có)</li>
                  <li>File đính kèm không quá 5MB</li>
                  <li>Chờ phản hồi từ nhà trường</li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="contact-info">
          <h4>📞 Liên hệ hỗ trợ</h4>
          <p>Nếu bạn có thắc mắc về việc gửi {activeTab === 'medicine' ? 'yêu cầu thuốc' : activeTab === 'absent' ? 'đơn xin nghỉ' : 'đơn xin khác'}, vui lòng liên hệ:</p>
          <ul>
            <li>Hotline: 1900-xxxx</li>
            <li>Email: schoolhealth@medlearn.com</li>
            <li>Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Thứ 6)</li>
          </ul>
        </div>
      </div>

      {/* Request Form Section */}
      <div className="add-medicine-section">
        <div className="form-header">
          <h3>📝 Thông Tin {activeTab === 'medicine' ? 'Yêu Cầu Thuốc' : activeTab === 'absent' ? 'Đơn Xin Nghỉ' : 'Đơn Xin Khác'}</h3>
          <p>Vui lòng điền đầy đủ thông tin bên dưới</p>
        </div>

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'medicine' ? 'active' : ''}`}
            onClick={() => setActiveTab('medicine')}
          >
            Yêu cầu thuốc
          </button>
          <button
            className={`tab-btn ${activeTab === 'absent' ? 'active' : ''}`}
            onClick={() => setActiveTab('absent')}
          >
            Yêu cầu vắng
          </button>
          <button
            className={`tab-btn ${activeTab === 'other' ? 'active' : ''}`}
            onClick={() => setActiveTab('other')}
          >
            Đơn xin khác
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-medicine-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentId">Chọn học sinh *</label>
              <select
                id="studentId"
                name="studentId"
                value={activeTab === 'medicine' ? medicineFormData.studentId : activeTab === 'absent' ? absentFormData.studentId : otherFormData.studentId}
                onChange={handleInputChange}
                required
                disabled={loading || students.length === 0}
              >
                <option value="">
                  {loading ? "Đang tải..." : students.length === 0 ? "Không có học sinh" : "Chọn học sinh"}
                </option>
                {students.map((student, idx) => (
                  <option 
                    key={`student_${student.studentId || student.studentid || student.id}_${idx}`} 
                    value={student.studentId || student.studentid || student.id}
                  >
                    {student.fullname || student.fullName || student.name} - Lớp {student.classname || student.className || student.class || '---'}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="title">Tiêu đề yêu cầu *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={activeTab === 'medicine' ? medicineFormData.title : activeTab === 'absent' ? absentFormData.title : otherFormData.title}
                onChange={handleInputChange}
                placeholder="VD: Yêu cầu thuốc hạ sốt cho con"
                required
                maxLength={200}
              />
            </div>
          </div>

          {activeTab === 'medicine' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="medicineName">Tên thuốc *</label>
                  <input
                    type="text"
                    id="medicineName"
                    name="medicineName"
                    value={medicineFormData.medicineName}
                    onChange={handleInputChange}
                    placeholder="VD: Paracetamol, Amoxicillin..."
                    required
                    maxLength={100}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="medicineDescription">Mô tả thuốc</label>
                  <input
                    type="text"
                    id="medicineDescription"
                    name="medicineDescription"
                    value={medicineFormData.medicineDescription}
                    onChange={handleInputChange}
                    placeholder="VD: Viên nang 500mg, dạng siro..."
                    maxLength={200}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="reason">Lý do cần thuốc *</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={medicineFormData.reason}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết tình trạng sức khỏe của con và lý do cần sử dụng thuốc này..."
                  required
                  rows={4}
                  maxLength={500}
                />
                <small className="char-count">
                  {medicineFormData.reason.length}/500 ký tự
                </small>
              </div>
            </>
          )}

          {activeTab === 'absent' && (
            <>
              <div className="form-group full-width">
                <label htmlFor="reasonForAbsent">Lý do vắng *</label>
                <textarea
                  id="reasonForAbsent"
                  name="reasonForAbsent"
                  value={absentFormData.reasonForAbsent}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết lý do vắng của con..."
                  required
                  rows={4}
                  maxLength={500}
                />
                <small className="char-count">
                  {absentFormData.reasonForAbsent.length}/500 ký tự
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="absentDate">Ngày vắng *</label>
                <input
                  type="date"
                  id="absentDate"
                  name="absentDate"
                  value={absentFormData.absentDate}
                  onChange={handleInputChange}
                  required
                  min={getTodayDate()}
                />
              </div>
            </>
          )}

          {activeTab === 'other' && (
            <>
              <div className="form-group full-width">
                <label htmlFor="reason">Lý do gửi đơn *</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={otherFormData.reason}
                  onChange={handleInputChange}
                  placeholder="Mô tả chi tiết lý do gửi đơn xin khác..."
                  required
                  rows={4}
                  maxLength={500}
                />
                <small className="char-count">
                  {otherFormData.reason.length}/500 ký tự
                </small>
              </div>
            </>
          )}

          <div className="form-group full-width">
            <label htmlFor="documentFile">Đính kèm đơn thuốc/tài liệu</label>
            <div className="file-upload-area">
              <input
                type="file"
                id="documentFile"
                name="documentFile"
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/png,application/pdf"
                className="file-input"
              />
              <label htmlFor="documentFile" className="file-upload-label">
                <div className="upload-content">
                  <span className="upload-icon">📎</span>
                  <span className="upload-text">
                    {activeTab === 'medicine' ? medicineFormData.documentFile ? medicineFormData.documentFile.name : 'Chọn file để đính kèm' : activeTab === 'absent' ? absentFormData.documentFile ? absentFormData.documentFile.name : 'Chọn file để đính kèm' : otherFormData.documentFile ? otherFormData.documentFile.name : 'Chọn file để đính kèm'}
                  </span>
                  <span className="upload-hint">
                    JPG, PNG, PDF (tối đa 5MB)
                  </span>
                </div>
              </label>
            </div>

            {activeTab === 'medicine' && medicineFormData.documentFile && (
              <div className="file-preview">
                <div className="file-info">
                  <span className="file-name">📄 {medicineFormData.documentFile.name}</span>
                  <span className="file-size">
                    ({(medicineFormData.documentFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="remove-file-btn"
                    title="Xóa file"
                  >
                    ✕
                  </button>
                </div>
                
                {filePreview && (
                  <div className="image-preview">
                    <img src={filePreview} alt="Preview" />
                  </div>
                )}
              </div>
            )}
            {activeTab === 'absent' && absentFormData.documentFile && (
              <div className="file-preview">
                <div className="file-info">
                  <span className="file-name">📄 {absentFormData.documentFile.name}</span>
                  <span className="file-size">
                    ({(absentFormData.documentFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="remove-file-btn"
                    title="Xóa file"
                  >
                    ✕
                  </button>
                </div>
                
                {filePreview && (
                  <div className="image-preview">
                    <img src={filePreview} alt="Preview" />
                  </div>
                )}
              </div>
            )}
            {activeTab === 'other' && otherFormData.documentFile && (
              <div className="file-preview">
                <div className="file-info">
                  <span className="file-name">📄 {otherFormData.documentFile.name}</span>
                  <span className="file-size">
                    ({(otherFormData.documentFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="remove-file-btn"
                    title="Xóa file"
                  >
                    ✕
                  </button>
                </div>
                
                {filePreview && (
                  <div className="image-preview">
                    <img src={filePreview} alt="Preview" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/parent')}
              className="cancel-btn"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={submitting || loading}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  Đang gửi...
                </>
              ) : (
                <>
                  📤 {activeTab === 'medicine' ? 'Gửi yêu cầu thuốc' : activeTab === 'absent' ? 'Gửi đơn xin nghỉ' : 'Gửi đơn xin khác'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`${message.type}-message`}>
          {message.text}
        </div>
      )}

      {/* Loading Overlay */}
      {(loading || submitting) && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              p: 4,
              bgcolor: 'white',
              borderRadius: 3,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 220,
            }}
          >
            <CircularProgress color="success" sx={{ mb: 2 }} />
            <Typography fontWeight={600} color="success.main" sx={{ mb: 1 }}>
              {loading ? 'Đang tải dữ liệu...' : `Đang gửi ${activeTab === 'medicine' ? 'yêu cầu thuốc' : activeTab === 'absent' ? 'đơn xin nghỉ' : 'đơn xin khác'}...`}
            </Typography>
            <Typography color="text.secondary" fontSize={15}>
              Vui lòng chờ trong giây lát
            </Typography>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default MedicineRequest; 