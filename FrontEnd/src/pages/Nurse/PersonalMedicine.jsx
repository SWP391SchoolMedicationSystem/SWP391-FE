import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Nurse/PersonalMedicine.css';
import apiClient, { API_ENDPOINTS } from '../../services/config';
import { CircularProgress, Typography, Box } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';   

dayjs.extend(utc);
dayjs.extend(timezone);

const PersonalMedicine = () => {
  const navigate = useNavigate();
  
  // Helper function to get current nurse name
  const getCurrentNurseName = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      return userInfo.fullName || userInfo.fullname || userInfo.name || 'Y tá';
    } catch (error) {
      return 'Y tá';
    }
  };
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [students, setStudents] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [parents, setParents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [personalMedicines, setPersonalMedicines] = useState([]);
  const [parentMedicineGroups, setParentMedicineGroups] = useState([]);
  const [expandedParent, setExpandedParent] = useState(null);
  const [parentSearchTerm, setParentSearchTerm] = useState('');
  const [showParentDropdown, setShowParentDropdown] = useState(false);
  const [selectedParentName, setSelectedParentName] = useState('');
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [addFormData, setAddFormData] = useState({
    medicineId: '',
    parentId: '',
    studentId: '',
    quantity: '',
    receivedDate: dayjs().tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DDTHH:mm'),
    expiryDate: '',
    note: ''
  });

  useEffect(() => {
    const loadData = async () => {
      await loadStudents(); // Load students first
      await loadMedicines();
      await loadPersonalMedicines(); // Load existing personal medicines
    };
    
    loadData();
  }, []);

  // Load parents after students data is available
  useEffect(() => {
    if (students.length > 0) {
      loadParents();
    }
  }, [students]);

  // Re-group medicines when all data is available
  useEffect(() => {
    if (students.length > 0 && parents.length > 0 && medicines.length > 0 && personalMedicines.length > 0) {
      groupMedicinesByParent(personalMedicines);
    }
  }, [students, parents, medicines, personalMedicines]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.searchable-select')) {
        setShowParentDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadStudents = async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.STUDENT.GET_ALL);
      const studentsArray = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
      
      const mappedStudents = studentsArray.map(stu => ({
        id: stu.studentId,
        name: stu.fullname,
        class: stu.classname,
        parentName: stu.parent?.fullname,
        parentId: stu.parentid || stu.parent?.parentid,
      }));
      
      // Remove duplicates based on student ID
      const uniqueStudents = mappedStudents.filter((student, index, self) => 
        index === self.findIndex((s) => String(s.id) === String(student.id))
      );
      
      setStudents(uniqueStudents);
      
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách học sinh' });
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
      setMessage({ type: 'error', text: 'Không thể tải danh sách thuốc' });
    }
  };

    const loadParents = async () => {
    try {
      if (students.length === 0) {
        setParents([]);
        return;
      }
      
      // Extract unique parents from students
      const parentMap = new Map();
      
      students.forEach(student => {
        const parentId = student.parentId || student._raw_student?.parentId;
        const parentName = student.parentName || student._raw_student?.parentName;
        
        if (parentId && parentName && parentName !== 'Chưa có thông tin') {
          const key = String(parentId);
          if (!parentMap.has(key)) {
            parentMap.set(key, {
              id: parentId,
              name: parentName,
              email: '',
              phone: '',
              studentCount: 1,
              studentNames: [student.name]
            });
          } else {
            const parent = parentMap.get(key);
            parent.studentCount++;
            parent.studentNames.push(student.name);
          }
        }
      });
      
      const parentsArray = Array.from(parentMap.values());
      
      setParents(parentsArray);
      
      if (parentsArray.length === 0) {
        setMessage({ type: 'warning', text: 'Không tìm thấy thông tin phụ huynh từ dữ liệu học sinh' });
      }
      
    } catch (error) {
      console.error('Error loading parents:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách phụ huynh' });
      setParents([]);
    }
  };

  const loadPersonalMedicines = async () => {
    try {
      const response = await fetch('https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicines', {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const medicinesArray = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
      
      // Filter out soft-deleted records
      const activeMedicines = medicinesArray.filter(medicine => {
        const isDeleted = medicine.isDeleted === true || medicine.isdeleted === true || medicine.status === false;
        return !isDeleted;
      });
      
      setPersonalMedicines(activeMedicines);
      
    } catch (error) {
      console.error('Error loading personal medicines:', error);
      setMessage({ type: 'error', text: 'Không thể tải danh sách thuốc từ phụ huynh' });
      setPersonalMedicines([]);
      setParentMedicineGroups([]);
    }
  };

  const groupMedicinesByParent = (medicines) => {
    const parentGroups = {};
    
    medicines.forEach(medicine => {
      const parentId = medicine.parentid || medicine.parentId;
      
      // Find parent name from students data or parents data
      let parentName = 'Phụ huynh không xác định';
      
      // First try to find from parents array
      const parentInfo = parents.find(p => String(p.id) === String(parentId));
      if (parentInfo) {
        parentName = parentInfo.name;
      } else {
        // If not found in parents, try to find from students data
        const studentWithParent = students.find(s => String(s.parentId) === String(parentId));
        if (studentWithParent) {
          parentName = studentWithParent.parentName;
        }
      }
      
      if (!parentGroups[parentId]) {
        parentGroups[parentId] = {
          parentId: parentId,
          parentName: parentName,
          medicines: [],
          totalMedicines: 0
        };
      }
      
      // Find medicine and student details
      const medicineId = medicine.medicineid || medicine.medicineId;
      const studentId = medicine.studentid || medicine.studentId;
      
      const medicineDetail = medicines.find(m => 
        String(m.medicineid || m.id) === String(medicineId)
      );
      const studentDetail = students.find(s => 
        String(s.id) === String(studentId)
      );
      
      // Let's try different approaches to get the medicine name
      let medicineName = 'Thuốc không xác định';
      
      if (medicineDetail) {
        medicineName = medicineDetail.medicineName || `Thuốc ID: ${medicineId}`;
      } else {
        // If not found in medicines list, check if medicine info is directly in personal medicine record
        medicineName = medicine.medicineName || `Thuốc ID: ${medicineId}`;
      }
      
      // Safe date formatting for display
      const formatDisplayDate = (dateValue) => {
        if (!dateValue) return 'Chưa có ngày';
        try {
          const date = new Date(dateValue);
          if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
          return date.toLocaleDateString('vi-VN');
        } catch (error) {
          return 'Ngày không hợp lệ';
        }
      };
                           
      parentGroups[parentId].medicines.push({
        ...medicine,
        medicineName: medicineName,
        medicineType: medicineDetail?.type || 'Không xác định',
        studentName: studentDetail?.name || medicine.studentName || `Học sinh ID: ${studentId}`,
        className: studentDetail?.class || medicine.className || '---',
        receivedDate: formatDisplayDate(medicine.receiveddate),
        expiryDate: formatDisplayDate(medicine.expiryDate)
      });
      
      parentGroups[parentId].totalMedicines++;
    });
    
    const groupsArray = Object.values(parentGroups);
    setParentMedicineGroups(groupsArray);
  };

  const toggleParentExpansion = (parentId) => {
    setExpandedParent(expandedParent === parentId ? null : parentId);
  };

  const handleParentSearch = (e) => {
    const value = e.target.value;
    setParentSearchTerm(value);
    setShowParentDropdown(true);
    setSelectedParentName(value);
    
    // Clear parent selection if search is cleared
    if (!value) {
      setAddFormData(prev => ({
        ...prev,
        parentId: '',
        studentId: ''
      }));
    }
  };

  const handleParentSelect = (parent) => {
    setAddFormData(prev => ({
      ...prev,
      parentId: parent.id,
      studentId: '' // Clear student selection when parent changes
    }));
    setSelectedParentName(parent.name);
    setParentSearchTerm(parent.name);
    setShowParentDropdown(false);

    // Auto-populate student if parent has only one child
    const parentStudents = students.filter(student => 
      String(student.parentId) === String(parent.id)
    );
    
    if (parentStudents.length === 1) {
      setAddFormData(prev => ({
        ...prev,
        studentId: String(parentStudents[0].id)
      }));
    }
  };

  const getFilteredParents = () => {
    if (!parentSearchTerm) return parents;
    
    return parents.filter(parent =>
      parent.name.toLowerCase().includes(parentSearchTerm.toLowerCase())
    );
  };

  // Edit Medicine Functions
  const handleEditMedicine = (medicine, parentId) => {
    // Prevent opening edit form if already editing or submitting
    if (showEditForm || submitting) {
      return;
    }
    
    const parentInfo = parents.find(p => String(p.id) === String(parentId));
    const studentInfo = students.find(s => String(s.id) === String(medicine.studentid));
    
    // Safe date handling
    const formatDateForInput = (dateValue) => {
      if (!dateValue) return '';
      
      try {
        // If it's already a date string in YYYY-MM-DD format, return as is
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateValue)) {
          return dateValue.split('T')[0];
        }
        
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return '';
        
        // Use local date to avoid timezone issues
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.warn('Invalid date value:', dateValue);
        return '';
      }
    };
    
    const editData = {
      ...medicine,
      parentName: parentInfo?.name || 'Unknown Parent',
      studentName: studentInfo?.name || 'Unknown Student',
      // Safe date formatting - use original API data
      receivedDateFormatted: formatDateForInput(medicine.receiveddate),
      expiryDateFormatted: formatDateForInput(medicine.expiryDate),
      // Also keep original values for fallback
      originalReceivedDate: medicine.receiveddate,
      originalExpiryDate: medicine.expiryDate
    };
    
    setEditingMedicine(editData);
    setShowEditForm(true);
  };

  const handleUpdateMedicine = async (updatedData) => {
    // Prevent multiple simultaneous updates
    if (submitting) {
      return;
    }

    setSubmitting(true);
    
    try {
      // Get the correct ID for the personal medicine record
      const personalMedicineId = editingMedicine.personalmedicineid;
      
      if (!personalMedicineId) {
        throw new Error('Không tìm thấy ID của thuốc để cập nhật');
      }

      // Use PUT method to update the medicine
      const updateData = {
        personalMedicineId: personalMedicineId,
        medicineid: parseInt(editingMedicine.medicineid),
        parentid: parseInt(editingMedicine.parentid),
        studentid: parseInt(editingMedicine.studentid),
        quantity: parseInt(updatedData.quantity),
        createdby: getCurrentNurseName(),
        receiveddate: new Date(updatedData.receivedDate).toISOString(),
        expiryDate: new Date(updatedData.expiryDate).toISOString(),
        status: true,
        note: updatedData.note || '',
        isDeleted: false
      };

      const response = await fetch('https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicine', {
        method: 'PUT',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể cập nhật thuốc: ${response.status} - ${errorText}`);
      }

      // Close modal and reset state before reloading
      setShowEditForm(false);
      setEditingMedicine(null);
      setMessage({ type: 'success', text: '✅ Đã cập nhật thuốc thành công!' });
      
      // Reload data to reflect changes
      await loadPersonalMedicines();

    } catch (error) {
      console.error('❌ Error updating medicine:', error);
      setMessage({ 
        type: 'error', 
        text: `❌ Có lỗi xảy ra khi cập nhật: ${error.message}` 
      });
      
      // Don't close the modal on error so user can retry
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Medicine Functions
  const handleDeleteMedicine = (medicine) => {
    setMedicineToDelete(medicine);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteMedicine = async () => {
    setSubmitting(true);
    try {
      const personalMedicineId = medicineToDelete.personalmedicineid;
      
      if (!personalMedicineId) {
        throw new Error('Không tìm thấy ID của thuốc để xóa');
      }
      
      const response = await fetch(`https://api-schoolhealth.purintech.id.vn/api/PersonalMedicine/Personalmedicine/${personalMedicineId}`, {
        method: 'DELETE',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token') || ''}`
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      setMessage({ type: 'success', text: '✅ Đã xóa thuốc thành công!' });
      setShowDeleteConfirm(false);
      setMedicineToDelete(null);
      
      // Add a small delay before reloading to ensure soft delete is processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      await loadPersonalMedicines();
    } catch (error) {
      console.error('❌ Error deleting medicine:', error);
      setMessage({ type: 'error', text: `❌ Có lỗi xảy ra khi xóa: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };





  // Add Medicine Form Functions
  const toggleAddForm = () => {
    if (showAddForm) {
      // Closing the form, reset everything
      resetAddForm();
    }
    setShowAddForm(!showAddForm);
  };

  const resetAddForm = () => {
    setAddFormData({
      medicineId: '',
      parentId: '',
      studentId: '',
      quantity: '',
      receivedDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      note: ''
    });
    setParentSearchTerm('');
    setSelectedParentName('');
    setShowParentDropdown(false);
    setEditingMedicine(null);
    setShowEditForm(false);
    setShowDeleteConfirm(false);
    setMedicineToDelete(null);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-populate student when parent is selected
    if (name === 'parentId' && value) {
      const parentStudents = students.filter(student => 
        String(student.parentId) === String(value)
      );
      
      if (parentStudents.length === 1) {
        setAddFormData(prev => ({
          ...prev,
          studentId: String(parentStudents[0].id)
        }));
      } else if (parentStudents.length === 0) {
        setAddFormData(prev => ({
          ...prev,
          studentId: ''
        }));
      } else {
        setAddFormData(prev => ({
          ...prev,
          studentId: ''
        }));
      }
    }
  };
  
  // Get students for selected parent
  const getStudentsForParent = (parentId) => {
    if (!parentId) {
      return students;
    }
    
    const filteredStudents = students.filter(student => {
      const studentParentId = String(student.parentId || '');
      const targetParentId = String(parentId);
      const match = studentParentId === targetParentId;
      
      return match;
    });
    
    return filteredStudents;
  };

  const handleAddFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const requestData = {
        medicineid: parseInt(addFormData.medicineId),
        parentid: parseInt(addFormData.parentId),
        studentid: parseInt(addFormData.studentId),
        quantity: parseInt(addFormData.quantity),
        createdby: getCurrentNurseName(),
        receiveddate: new Date(addFormData.receivedDate).toISOString(),
        expiryDate: new Date(addFormData.expiryDate).toISOString(),
        status: true, // Medicine has been received
        note: addFormData.note || ''
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
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      setMessage({ type: 'success', text: '✅ Đã thêm thuốc từ phụ huynh thành công!' });
      toggleAddForm();
      // Reload personal medicines to show the new entry
      await loadPersonalMedicines();
    } catch (error) {
      console.error('Error adding personal medicine:', error);
      setMessage({ type: 'error', text: `❌ Có lỗi xảy ra khi thêm thuốc: ${error.message}` });
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="personal-medicine-container">
      {/* Header */}
      <div className="medicine-header">
        <div>
          <h1>💊 Đơn Thuốc Từ Phụ Huynh</h1>
          <p>Xem, kiểm tra và duyệt các đơn thuốc cá nhân gửi từ phụ huynh cho học sinh</p>
        </div>
                <div className="header-buttons">
          <button 
            onClick={async () => {
              setLoading(true);
              try {
                await loadStudents();
                await loadMedicines();
                await loadPersonalMedicines();
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
          <h3>ℹ️ Thông Tin Đơn Thuốc Từ Phụ Huynh</h3>
        </div>
        <div className="info-content">
          <div className="info-column">
            <h4>📋 Quản lý đơn thuốc cá nhân</h4>
            <p>Hệ thống giúp Y tá:</p>
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
  
          <ul>
            <li>Hotline: 1900-xxxx</li>
            <li>Email: schoolhealth@medlearn.com</li>
            <li>Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Thứ 6)</li>
          </ul>
        </div>
      </div>

      {/* Action Section */}
      <div className="action-section">
        <div className="action-header">
          <h3>📝 Thêm Thuốc Từ Phụ Huynh</h3>
          <button 
            onClick={toggleAddForm}
            className="add-medicine-btn"
          >
            {showAddForm ? '❌ Đóng form' : '➕ Thêm thuốc nhận từ phụ huynh'}
          </button>
        </div>
      </div>

      {/* Add Medicine Form */}
      {showAddForm && (
        <div className="add-medicine-section">
          <h3>📝 Thêm Thuốc Nhận Từ Phụ Huynh</h3>
          <p>Ghi nhận thông tin thuốc khi phụ huynh gửi đến trường</p>
          
          <form onSubmit={handleAddFormSubmit} className="add-medicine-form">
            <div className="form-group">
              <label htmlFor="parentId">Chọn phụ huynh *</label>
              <div className="searchable-select">
                <input
                  type="text"
                  id="parentId"
                  name="parentSearch"
                  value={parentSearchTerm}
                  onChange={handleParentSearch}
                  onFocus={() => setShowParentDropdown(true)}
                  placeholder={parents.length === 0 ? "Đang tải phụ huynh..." : "Gõ để tìm phụ huynh..."}
                  className="searchable-input"
                  required={!addFormData.parentId}
                  disabled={parents.length === 0}
                />
                
                {showParentDropdown && parents.length > 0 && (
                  <div className="dropdown-menu">
                    {getFilteredParents().length === 0 ? (
                      <div className="dropdown-item no-results">
                        Không tìm thấy phụ huynh nào
                      </div>
                    ) : (
                      getFilteredParents().map((parent, idx) => (
                        <div
                          key={`parent_${parent.id}_${idx}`}
                          className="dropdown-item"
                          onClick={() => handleParentSelect(parent)}
                        >
                          <div className="parent-info">
                            <span className="parent-name">{parent.name}</span>
                            <span className="student-count">
                              {parent.studentCount} con
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
                
                {/* Hidden input for form validation */}
                <input
                  type="hidden"
                  name="parentId"
                  value={addFormData.parentId}
                  required
                />
              </div>
              
              {parents.length === 0 && (
                <small className="form-help">
                  Đang tải danh sách phụ huynh...
                </small>
              )}
              {parents.length > 0 && !addFormData.parentId && (
                <small className="form-help">
                  Đã tải {parents.length} phụ huynh. Gõ để tìm kiếm phụ huynh.
                </small>
              )}
              {addFormData.parentId && selectedParentName && (
                <small className="form-help selected-parent">
                  ✅ Đã chọn: {selectedParentName}
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="studentId">Chọn học sinh *</label>
              <select
                id="studentId"
                name="studentId"
                value={addFormData.studentId}
                onChange={handleAddFormChange}
                required
                disabled={!addFormData.parentId}
              >
                <option value="">
                  {addFormData.parentId ? "Chọn học sinh" : "Vui lòng chọn phụ huynh trước"}
                </option>
                {getStudentsForParent(addFormData.parentId).map((student, idx) => (
                  <option key={`student_${student.id}_${idx}`} value={student.id}>
                    {student.name} - Lớp {student.class} {!addFormData.parentId && `(PH: ${student.parentName})`}
                  </option>
                ))}
              </select>
              {addFormData.parentId && getStudentsForParent(addFormData.parentId).length === 0 && (
                <small className="form-help">
                  Không tìm thấy học sinh nào cho phụ huynh này
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="medicineId">Chọn thuốc *</label>
              <select
                id="medicineId"
                name="medicineId"
                value={addFormData.medicineId}
                onChange={handleAddFormChange}
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
                value={addFormData.quantity}
                onChange={handleAddFormChange}
                required
                min="1"
                placeholder="Số viên/hộp"
              />
            </div>

            <div className="form-group">
              <label htmlFor="receivedDate">Ngày nhận thuốc *</label>
              <input
                type="date"
                id="receivedDate"
                name="receivedDate"
                value={addFormData.receivedDate}
                onChange={handleAddFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Hạn sử dụng *</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={addFormData.expiryDate}
                onChange={handleAddFormChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="note">Ghi chú</label>
              <textarea
                id="note"
                name="note"
                value={addFormData.note}
                onChange={handleAddFormChange}
                placeholder="Ghi chú về thuốc, liều dùng, thời gian dùng..."
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={toggleAddForm}
                className="cancel-btn"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Đang thêm...' : 'Thêm thuốc'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Medicines List Section */}
      <div className="medicines-list-section">
        <div className="list-header">
          <h3>📋 Danh Sách Thuốc Đã Thêm</h3>
          <p>Danh sách thuốc mà phụ huynh đã gửi cho học sinh, được tổ chức theo phụ huynh</p>
        </div>
        
        {parentMedicineGroups.length === 0 ? (
          <div className="empty-state">
            <p>📭 Chưa có thuốc nào được thêm từ phụ huynh</p>
            <p>Sử dụng form bên dưới để thêm thuốc mới</p>
          </div>
        ) : (
          <div className="parent-medicine-groups">
            {parentMedicineGroups.map((group, index) => (
              <div key={`parent_${group.parentId}_${index}`} className="parent-group">
                <div 
                  className="parent-header"
                  onClick={() => toggleParentExpansion(group.parentId)}
                >
                  <div className="parent-info">
                    <h4>👨‍👩‍👧‍👦 {group.parentName}</h4>
                    <span className="medicine-count">
                      {group.totalMedicines} thuốc đã gửi
                    </span>
                  </div>
                  <button className="expand-btn">
                    {expandedParent === group.parentId ? '▼' : '▶'}
                  </button>
                </div>
                
                {expandedParent === group.parentId && (
                  <div className="medicines-list">
                    {group.medicines.map((medicine, medIndex) => (
                      <div 
                        key={`medicine_${group.parentId}_${medicine.personalmedicineid || medIndex}_${medicine.medicineid}_${medIndex}`} 
                        className="medicine-item"
                      >
                                                 <div className="medicine-info">
                           <div className="medicine-header">
                             <div className="medicine-title">
                               <h5>💊 {medicine.medicineName}</h5>
                               {medicine.medicineType && medicine.medicineType !== 'Không xác định' && (
                                 <span className="medicine-type">({medicine.medicineType})</span>
                               )}
                             </div>
                             <div className="medicine-actions">
                               <button 
                                 className="action-btn edit-btn"
                                 onClick={() => handleEditMedicine(medicine, group.parentId)}
                                 title="Chỉnh sửa thuốc"
                                 disabled={
                                   submitting || 
                                   showEditForm || 
                                   (!medicine.id && !medicine.personalmedicineid && !medicine.personalMedicineId)
                                 }
                               >
                                 ✏️ Sửa
                               </button>
                               <button 
                                 className="action-btn delete-btn"
                                 onClick={() => handleDeleteMedicine(medicine)}
                                 title="Xóa thuốc"
                                 disabled={
                                   submitting || 
                                   showDeleteConfirm || 
                                   (!medicine.id && !medicine.personalmedicineid && !medicine.personalMedicineId)
                                 }
                               >
                                 🗑️ Xóa
                               </button>
                             </div>
                           </div>
                          
                          <div className="medicine-details">
                            <div className="detail-row">
                              <span className="label">Học sinh:</span>
                              <span className="value">
                                {medicine.studentName} - Lớp {medicine.className}
                              </span>
                            </div>
                            
                            <div className="detail-row">
                              <span className="label">Số lượng:</span>
                              <span className="value">{medicine.quantity}</span>
                            </div>
                            
                            <div className="detail-row">
                              <span className="label">Ngày nhận:</span>
                              <span className="value">{medicine.receivedDate}</span>
                            </div>
                            
                            <div className="detail-row">
                              <span className="label">Hạn sử dụng:</span>
                              <span className="value">{medicine.expiryDate}</span>
                            </div>
                            
                            {medicine.note && (
                              <div className="detail-row">
                                <span className="label">Ghi chú:</span>
                                <span className="value">{medicine.note}</span>
                              </div>
                            )}
                            
                            <div className="detail-row">
                              <span className="label">Người tạo:</span>
                              <span className="value">{getCurrentNurseName()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {message.text && (
        <div className={`${message.type}-message`}>
          {message.text}
        </div>
      )}

      {/* Edit Medicine Modal */}
      {showEditForm && editingMedicine && (
        <div className="modal-overlay">
          <div className="modal edit-modal" style={{ display: 'block' }}>
            <div className="modal-header">
              <h3>✏️ Chỉnh Sửa Thuốc</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingMedicine(null);
                }}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body" style={{ display: 'block' }}>
              <div className="medicine-info-display">
                <p><strong>Thuốc:</strong> {editingMedicine.medicineName}</p>
                <p><strong>Phụ huynh:</strong> {editingMedicine.parentName}</p>
                <p><strong>Học sinh:</strong> {editingMedicine.studentName}</p>
              </div>
              
              <div className="edit-note">
                <p><small>💡 <strong>Lưu ý:</strong> Chỉ có thể chỉnh sửa số lượng, ngày nhận, hạn sử dụng và ghi chú.</small></p>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleUpdateMedicine({
                  quantity: formData.get('quantity'),
                  receivedDate: formData.get('receivedDate'),
                  expiryDate: formData.get('expiryDate'),
                  note: formData.get('note')
                });
              }}>
                <div className="form-group">
                  <label>Số lượng *</label>
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={editingMedicine.quantity}
                    required
                    min="1"
                  />
                </div>
                
                <div className="form-group">
                  <label>Ngày nhận *</label>
                  <input
                    type="date"
                    name="receivedDate"
                    defaultValue={editingMedicine.receivedDateFormatted || editingMedicine.originalReceivedDate || ''}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Hạn sử dụng *</label>
                  <input
                    type="date"
                    name="expiryDate"
                    defaultValue={editingMedicine.expiryDateFormatted || editingMedicine.originalExpiryDate || ''}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Ghi chú</label>
                  <textarea
                    name="note"
                    defaultValue={editingMedicine.note || ''}
                    placeholder="Ghi chú về thuốc, liều dùng..."
                  />
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingMedicine(null);
                    }}
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={submitting}
                  >
                    {submitting ? 'Đang xử lý...' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && medicineToDelete && (
        <div className="modal-overlay">
          <div className="modal confirm-modal">
            <div className="modal-header">
              <h3>🗑️ Xóa Thuốc</h3>
            </div>
            
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa thuốc này không?</p>
              <div className="medicine-info-display">
                <p><strong>Thuốc:</strong> {medicineToDelete.medicineName}</p>
                <p><strong>Số lượng:</strong> {medicineToDelete.quantity}</p>
                <p><strong>Ngày nhận:</strong> {medicineToDelete.receivedDate}</p>
              </div>
              <p className="warning-text">⚠️ Hành động này không thể hoàn tác!</p>
            </div>
            
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setMedicineToDelete(null);
                }}
              >
                Hủy
              </button>
              <button 
                className="delete-btn"
                onClick={confirmDeleteMedicine}
                disabled={submitting}
              >
                {submitting ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {submitting && (
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
            <CircularProgress sx={{ color: '#2f5148', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#2f5148', fontWeight: 600, mb: 1 }}>
              Đang xử lý...
            </Typography>
            <Typography variant="body2" sx={{ color: '#2f5148', opacity: 0.8 }}>
              {showEditForm ? 'Đang cập nhật thông tin thuốc...' : 
               showDeleteConfirm ? 'Đang xóa thuốc...' : 
               'Vui lòng chờ trong giây lát'}
            </Typography>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default PersonalMedicine; 