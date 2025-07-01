import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Parent/PersonalMedicine.css';
import apiClient, { API_ENDPOINTS } from '../../services/config';

const PersonalMedicine = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  
  const [personalMedicines, setPersonalMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [students, setStudents] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [deletingMedicine, setDeletingMedicine] = useState(null);

  useEffect(() => {
    fetchStudentsByParent();
    loadMedicines();
  }, []);

  // Load personal medicines when students list changes
  useEffect(() => {
    if (students.length > 0) {
      loadPersonalMedicines();
    }
  }, [students]);

  const fetchStudentsByParent = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const parentId = userInfo.userId;
      
      console.log('🔍 Current Parent ID:', parentId);
      console.log('👤 User Info:', userInfo);
      
      if (!parentId) {
        setMessage({ type: 'error', text: 'Không tìm thấy thông tin phụ huynh. Vui lòng đăng nhập lại.' });
        return;
      }
      
      // Try to get students by parent ID first
      let studentData = [];
      try {
        const res = await apiClient.get(`${API_ENDPOINTS.STUDENT.GET_BY_PARENT}/${parentId}`);
        console.log('GetStudentsByParentId Response:', res);
        studentData = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
      } catch (getByParentError) {
        console.error('GetStudentsByParentId failed, trying GET_ALL:', getByParentError);
        
        // Fallback: Get all students and filter by parent ID
        const res = await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL);
        const allStudents = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
        
        console.log('📚 All students from API:', allStudents.length);
        
        // 🔒 SECURITY: Only show students belonging to current parent
        studentData = allStudents.filter(stu => {
          const studentParentId = stu.parent?.parentid || stu.parent?.parentId || 
                                 stu.parentid || stu.parentId || stu.parent_id || stu.ParentId;
          const isMyChild = String(studentParentId) === String(parentId);
          
          console.log(`👶 Student: ${stu.fullname} - Parent ID: ${studentParentId} - Is mine: ${isMyChild ? '✅' : '❌'}`);
          
          return isMyChild;
        });
      }
      
      if (studentData.length === 0) {
        setMessage({ 
          type: 'info', 
          text: `Không tìm thấy học sinh nào thuộc về tài khoản phụ huynh này. Vui lòng liên hệ nhà trường để cập nhật thông tin.` 
        });
        setStudents([]);
        return;
      }
      
      const mappedStudents = studentData.map(stu => ({
        id: stu.studentId || stu.studentid || stu.id,
        name: stu.fullname || stu.fullName || stu.name || 'Không có tên',
        class: stu.classname || stu.classId || stu.className || '---'
      }));
      
      // Remove duplicates based on student ID
      const uniqueStudents = mappedStudents.filter((student, index, self) => 
        index === self.findIndex((s) => String(s.id) === String(student.id))
      );
      
      console.log('✅ Final students for parent', parentId, ':', uniqueStudents);
      setStudents(uniqueStudents);
      
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách học sinh của bạn' });
      setStudents([]);
    }
  };

  const loadMedicines = async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.MEDICINE.GET_ALL);
      const medicinesArray = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
      const activeMedicines = medicinesArray.filter(med => !med.isDeleted);
      
      // Remove duplicates based on medicine ID
      const uniqueMedicines = activeMedicines.filter((medicine, index, self) => 
        index === self.findIndex((m) => String(m.medicineid) === String(medicine.medicineid))
      );
      
      setMedicines(uniqueMedicines);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

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
      const allMedicines = Array.isArray(data) ? data : (data.data ? data.data : []);
      
      console.log('🔍 All Personal Medicines from API:', allMedicines.length);
      
      // 🔒 SECURITY: Only show medicines for students belonging to current parent
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      const parentId = userInfo.userId;
      
      if (!parentId) {
        console.error('❌ No parent ID found');
        setPersonalMedicines([]);
        return;
      }
      
      // Get list of student IDs belonging to current parent
      const myStudentIds = students.map(student => String(student.id));
      console.log('👶 My Student IDs:', myStudentIds);
      
      // Filter medicines to only include those for my children
      const filteredMedicines = allMedicines.filter(medicine => {
        const medicineStudentId = String(medicine.studentid);
        const isMine = myStudentIds.includes(medicineStudentId);
        
        console.log(`💊 Medicine for student ${medicineStudentId} - Is mine: ${isMine ? '✅' : '❌'}`);
        
        return isMine;
      });
      
      console.log(`✅ Filtered Personal Medicines: ${filteredMedicines.length}/${allMedicines.length} for parent ${parentId}`);
      
      // Remove any potential duplicates based on unique identifier combinations
      const uniqueMedicines = filteredMedicines.filter((medicine, index, self) => 
        index === self.findIndex((m) => 
          String(m.personalMedicineId || m.id) === String(medicine.personalMedicineId || medicine.id) &&
          String(m.studentid) === String(medicine.studentid) &&
          String(m.medicineid) === String(medicine.medicineid) &&
          String(m.receiveddate) === String(medicine.receiveddate)
        )
      );
      
      console.log(`🔧 Unique Personal Medicines after dedup: ${uniqueMedicines.length}`);
      setPersonalMedicines(uniqueMedicines);
      
    } catch (error) {
      console.error('Error loading personal medicines:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách thuốc cá nhân của con bạn' });
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

    if (name === 'medicineId' && value) {
      const selectedMedicine = medicines.find(m => String(m.medicineid) === String(value));
      if (selectedMedicine) {
        setFormData(prev => ({
          ...prev,
          medicineName: selectedMedicine.medicinename,
          medicineType: selectedMedicine.type
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const requestData = {
        studentid: parseInt(formData.studentId),
        medicineid: parseInt(formData.medicineId),
        quantity: parseInt(formData.quantity),
        expiryDate: formData.expiryDate,
        note: `${formData.description} | Loại: ${formData.medicineType} | SĐT: ${formData.contactPhone} | Thời gian liên hệ: ${formData.preferredTime}`,
        receiveddate: new Date().toISOString(),
        status: false
      };

      const response = await fetch('https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicine', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setMessage({ type: 'success', text: '✅ Đã thêm thuốc cá nhân thành công!' });
      
      // Reset form
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
      
      // Reload data (personal medicines will auto reload when students change)
      fetchStudentsByParent();
    } catch (error) {
      console.error('Error adding personal medicine:', error);
      setMessage({ type: 'error', text: '❌ Có lỗi xảy ra khi thêm thuốc cá nhân' });
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Medicine Functions
  const startEditMedicine = (medicine) => {
    const medicineInfo = medicines.find(m => String(m.medicineid) === String(medicine.medicineid));
    const student = students.find(s => String(s.id) === String(medicine.studentid));
    
    setEditingMedicine({
      ...medicine,
      originalId: medicine.personalMedicineId || medicine.id
    });
    
    setFormData({
      studentId: medicine.studentid || '',
      medicineId: medicine.medicineid || '',
      medicineName: medicineInfo?.medicinename || '',
      medicineType: medicineInfo?.type || '',
      quantity: medicine.quantity || '',
      expiryDate: medicine.expiryDate ? medicine.expiryDate.split('T')[0] : '',
      condition: 'good',
      description: medicine.note ? medicine.note.split(' | ')[0] : '',
      contactPhone: medicine.note ? (medicine.note.match(/SĐT: ([^\|]+)/) || ['', ''])[1].trim() : '',
      preferredTime: medicine.note ? (medicine.note.match(/Thời gian liên hệ: (.+)/) || ['', ''])[1] : ''
    });
  };

  const cancelEdit = () => {
    setEditingMedicine(null);
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
  };

  const updateMedicine = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const updateId = editingMedicine.originalId;
      
      if (!updateId) {
        throw new Error('Không tìm thấy ID để cập nhật');
      }

      const updateData = {
        personalMedicineId: updateId,
        studentid: parseInt(formData.studentId),
        medicineid: parseInt(formData.medicineId),
        quantity: parseInt(formData.quantity),
        expiryDate: formData.expiryDate,
        note: `${formData.description} | Loại: ${formData.medicineType} | SĐT: ${formData.contactPhone} | Thời gian liên hệ: ${formData.preferredTime}`,
        receiveddate: editingMedicine.receiveddate || new Date().toISOString(),
        status: false // Keep as pending
      };

      console.log('✏️ Updating PersonalMedicine ID:', updateId);
      console.log('📋 Update data:', updateData);

      // Try PUT method first
      let response = await fetch(`https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicine/${updateId}`, {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      console.log('📡 PUT response status:', response.status);

      // If PUT doesn't work, try PATCH with partial data
      if (response.status === 405 || response.status === 404) {
        console.log('⚠️ PUT failed, trying PATCH...');
        
        const patchData = {
          quantity: parseInt(formData.quantity),
          expiryDate: formData.expiryDate,
          note: updateData.note
        };

        response = await fetch(`https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicine/${updateId}`, {
          method: 'PATCH',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(patchData)
        });

        console.log('📡 PATCH response status:', response.status);
      }

      // If both PUT and PATCH fail, use DELETE + POST approach
      if (response.status === 405 || response.status === 404) {
        console.log('⚠️ Both PUT and PATCH failed, trying DELETE + POST...');
        
        // Step 1: Delete old record
        const deleteResponse = await fetch(`https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicine/${updateId}`, {
          method: 'DELETE',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`
          }
        });

        console.log('🗑️ DELETE response status:', deleteResponse.status);

        // Step 2: Create new record
        response = await fetch('https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicine', {
          method: 'POST',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            studentid: parseInt(formData.studentId),
            medicineid: parseInt(formData.medicineId),
            quantity: parseInt(formData.quantity),
            expiryDate: formData.expiryDate,
            note: updateData.note,
            receiveddate: new Date().toISOString(),
            status: false
          })
        });

        console.log('📡 POST response status:', response.status);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ UPDATE API Error:', errorText);
        throw new Error(`Lỗi API: ${response.status} - ${errorText}`);
      }

      // Update local state after successful API call
      setPersonalMedicines(prev => 
        prev.map(med => 
          (med.personalMedicineId || med.id) === updateId 
            ? { ...med, ...updateData }
            : med
        )
      );

      setMessage({ type: 'success', text: '✅ Đã cập nhật thuốc cá nhân thành công!' });
      cancelEdit();
      
      console.log('✅ Update successful for ID:', updateId);
      
    } catch (error) {
      console.error('Error updating personal medicine:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Có lỗi xảy ra khi cập nhật thuốc cá nhân: ${error.message}`
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Medicine Functions
  const startDeleteMedicine = (medicine) => {
    setDeletingMedicine(medicine);
  };

  const confirmDelete = async () => {
    if (!deletingMedicine) return;
    
    setSubmitting(true);
    try {
      const deleteId = deletingMedicine.personalMedicineId || deletingMedicine.id;
      
      if (!deleteId) {
        throw new Error('Không tìm thấy ID để xóa');
      }

      console.log('🗑️ Deleting PersonalMedicine ID:', deleteId);

      // Call DELETE API
      const response = await fetch(`https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicine/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`
        }
      });

      console.log('📡 DELETE response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DELETE API Error:', errorText);
        throw new Error(`Lỗi API: ${response.status} - ${errorText}`);
      }

      // Remove from local state after successful API call
      setPersonalMedicines(prev => 
        prev.filter(med => 
          (med.personalMedicineId || med.id) !== deleteId
        )
      );
      
      setMessage({ type: 'success', text: '✅ Đã xóa thuốc cá nhân thành công!' });
      setDeletingMedicine(null);
      
      console.log('✅ Delete successful for ID:', deleteId);
      
    } catch (error) {
      console.error('Error deleting personal medicine:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Có lỗi xảy ra khi xóa thuốc cá nhân: ${error.message}`
      });
    } finally {
      setSubmitting(false);
    }
  };

  const cancelDelete = () => {
    setDeletingMedicine(null);
  };

  return (
    <div className="personal-medicine-container">
      {/* Header */}
      <div className="medicine-header">
        <div>
          <h1>💊 Quản Lý Thuốc Cá Nhân</h1>
          <p>Quản lý thông tin thuốc cá nhân của học sinh, theo dõi liều dùng và lịch trình dùng thuốc</p>
        </div>
        <button 
          onClick={() => {
            fetchStudentsByParent();
            loadMedicines();
          }}
          className="refresh-btn"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Information Section */}
      <div className="medicine-info-section">
        <div className="info-header">
          <h3>ℹ️ Thông Tin Thuốc Cá Nhân</h3>
        </div>
        <div className="info-content">
          <div className="info-column">
            <h4>📋 Quản lý thuốc cá nhân</h4>
            <p>Hệ thống giúp bạn:</p>
            <ul>
              <li>Theo dõi danh sách thuốc cá nhân của học sinh</li>
              <li>Quản lý liều dùng và tần suất dùng thuốc</li>
              <li>Nhắc nhở lịch trình dùng thuốc</li>
              <li>Theo dõi hạn sử dụng và tình trạng thuốc</li>
            </ul>
          </div>

          <div className="info-column">
            <h4>✅ Lưu ý quan trọng</h4>
            <ul>
              <li>Cập nhật thông tin thuốc chính xác và đầy đủ</li>
              <li>Theo dõi hạn sử dụng để tránh sử dụng thuốc hết hạn</li>
              <li>Ghi rõ liều dùng và tần suất để tránh nhầm lẫn</li>
              <li>Thông báo với y tế trường về thuốc đặc biệt</li>
              <li>Bảo quản thuốc đúng cách theo hướng dẫn</li>
            </ul>
          </div>
        </div>

        <div className="contact-info">
          <h4>📞 Liên hệ hỗ trợ</h4>
          <p>Nếu bạn có thắc mắc về quản lý thuốc cá nhân, vui lòng liên hệ:</p>
          <ul>
            <li>Hotline: 1900-xxxx</li>
            <li>Email: schoolhealth@medlearn.com</li>
            <li>Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Thứ 6)</li>
          </ul>
        </div>
      </div>

      {/* Add/Edit Medicine Form */}
      <div className="add-medicine-section">
        <h3>📋 {editingMedicine ? 'Chỉnh Sửa Thuốc Cá Nhân' : 'Thêm Thuốc Cá Nhân'}</h3>
        <p>
          {editingMedicine 
            ? 'Cập nhật thông tin thuốc cá nhân của học sinh' 
            : 'Để tải thông tin thuốc cá nhân của học sinh, theo dõi liều dùng và lịch trình dùng thuốc'
          }
        </p>
        
        {editingMedicine && (
          <div className="edit-notice">
            <span>🔄 Đang chỉnh sửa thuốc cho {students.find(s => String(s.id) === String(editingMedicine.studentid))?.name}</span>
            <button type="button" onClick={cancelEdit} className="cancel-edit-btn">✖ Hủy</button>
          </div>
        )}
        
        {message.text && (
          <div className={`${message.type}-message`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={editingMedicine ? updateMedicine : handleSubmit} className="add-medicine-form" key="medicine-form">
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
              {students.map((student, idx) => (
                <option key={`student_${student.id}_${idx}`} value={student.id}>
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
              {medicines.map((medicine, idx) => (
                <option key={`medicine_${medicine.medicineid}_${idx}`} value={medicine.medicineid}>
                  {medicine.medicinename} - {medicine.type}
                </option>
              ))}
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
            {submitting 
              ? (editingMedicine ? 'Đang cập nhật...' : 'Đang thêm...') 
              : (editingMedicine ? 'Cập nhật thuốc cá nhân' : 'Thêm thuốc cá nhân')
            }
          </button>
        </form>
      </div>

      {/* Medicine List */}
      <div className="medicine-list-section">
        <h3>📊 Danh Sách Thuốc Cá Nhân</h3>
        <div className="medicine-list-content">
          {loading ? (
            <div className="loading" key="loading-state">
              <h4>Đang tải...</h4>
            </div>
          ) : personalMedicines.length === 0 ? (
            <div className="no-data" key="no-data-state">
              <h4>Chưa có thuốc cá nhân nào</h4>
              <p>Chưa có thuốc cá nhân nào được ghi nhận. Hãy bắt đầu bằng cách thêm thuốc mới!</p>
            </div>
          ) : (
            <div className="medicine-grid" key="medicine-grid-container">
              {personalMedicines.map((medicine, index) => {
                const student = students.find(s => String(s.id) === String(medicine.studentid));
                const medicineInfo = medicines.find(m => String(m.medicineid) === String(medicine.medicineid));
                
                // Create truly unique key using multiple identifiers
                const uniqueKey = `medicine_${medicine.personalMedicineId || medicine.id || 'unknown'}_${medicine.studentid || 'nostudent'}_${medicine.medicineid || 'nomedicine'}_${medicine.receiveddate || 'nodate'}_${index}`;
                
                // Debug log for duplicate key detection
                if (process.env.NODE_ENV === 'development') {
                  console.log(`🔑 Medicine ${index} key:`, uniqueKey);
                }
                
                return (
                  <div key={uniqueKey} className="medicine-card">
                    <div className="medicine-card-header">
                      <h4>💊 {medicineInfo?.medicinename || 'Thuốc không xác định'}</h4>
                      <span className={`status-badge ${medicine.status ? 'status-approved' : 'status-pending'}`}>
                        {medicine.status ? 'ĐÃ XỬ LÝ' : 'CHỜ XỬ LÝ'}
                      </span>
                    </div>
                    <div className="medicine-card-body">
                      <div className="medicine-detail">
                        <label>Học sinh:</label>
                        <span>{student?.name || 'Học sinh không xác định'}</span>
                      </div>
                      <div className="medicine-detail">
                        <label>Loại thuốc:</label>
                        <span>{medicineInfo?.type || 'Không xác định'}</span>
                      </div>
                      <div className="medicine-detail">
                        <label>Số lượng:</label>
                        <span>{medicine.quantity}</span>
                      </div>
                      <div className="medicine-detail">
                        <label>Hạn sử dụng:</label>
                        <span>{medicine.expiryDate ? new Date(medicine.expiryDate).toLocaleDateString('vi-VN') : 'Không có'}</span>
                      </div>
                      <div className="medicine-detail">
                        <label>Ngày gửi:</label>
                        <span>{medicine.receiveddate ? new Date(medicine.receiveddate).toLocaleDateString('vi-VN') : 'Không có'}</span>
                      </div>
                      {medicine.note && (
                        <div className="medicine-detail">
                          <label>Ghi chú:</label>
                          <span>{medicine.note}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons - only for pending medicines */}
                    {!medicine.status && (
                      <div className="medicine-card-actions">
                        <button 
                          onClick={() => startEditMedicine(medicine)}
                          className="edit-btn"
                          disabled={submitting}
                        >
                          ✏️ Chỉnh sửa
                        </button>
                        <button 
                          onClick={() => startDeleteMedicine(medicine)}
                          className="delete-btn"
                          disabled={submitting}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingMedicine && (
        <div className="modal-overlay" key="delete-modal-overlay">
          <div className="modal" key="delete-modal">
            <h3>🗑️ Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa thuốc <strong>{medicines.find(m => String(m.medicineid) === String(deletingMedicine.medicineid))?.medicinename}</strong> không?</p>
            <p>Hành động này không thể hoàn tác.</p>
            
            <div className="modal-actions">
              <button onClick={cancelDelete} className="cancel-btn">Hủy</button>
              <button onClick={confirmDelete} className="confirm-delete-btn" disabled={submitting}>
                {submitting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {submitting && (
        <div className="loading-overlay" key="loading-overlay">
          <div className="loading-spinner" key="loading-spinner">
            <h4>{editingMedicine ? 'Đang cập nhật...' : 'Đang thêm thuốc...'}</h4>
            <p>Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalMedicine; 