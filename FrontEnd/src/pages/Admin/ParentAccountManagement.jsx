import React, { useState, useEffect } from 'react';
import { useAdminParents, useAdminActions } from '../../utils/hooks/useAdmin';
import { adminStudentService } from '../../services/adminService';
import Modal from '../../components/common/Modal';
import '../../css/Admin/ParentAccountManagement.css';

const ParentAccountManagement = () => {
  const { data: parentsList, loading, error, refetch } = useAdminParents();
  const {
    createParent,
    updateParent,
    toggleParentStatus,
    loading: actionLoading,
  } = useAdminActions();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [_editingParent, setEditingParent] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: 'Password123@',
    address: '',
    students: [
      {
        studentCode: 'String',
        fullname: '',
        age: 0,
        bloodType: 'A+',
        gender: true,
        classid: 1, // Lớp Mầm A
        parentid: 123,
        dob: new Date().toISOString().split('T')[0],
      },
    ],
  });
  const [_studentCount, setStudentCount] = useState(1);

  // Student form data for adding new student
  const [studentFormData, setStudentFormData] = useState({
    fullname: '',
    age: 0,
    bloodType: 'A+',
    gender: true,
    classid: 1,
    parentid: 0,
    dob: new Date().toISOString().split('T')[0],
  });

  // Load data on mount
  useEffect(() => {
    // Chỉ gọi refetch khi component mount lần đầu
    // Không cần dependency vì chúng ta chỉ muốn load data một lần
  }, []);

  // Handle form input change
  const handleInputChange = e => {
    const { name, value } = e.target;

    // Special handling for phone number - only allow numbers
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle student form input change
  const handleStudentChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      students: prev.students.map((student, i) =>
        i === index ? { ...student, [field]: value } : student
      ),
    }));
  };

  // Add new student
  const addStudent = () => {
    setFormData(prev => ({
      ...prev,
      students: [
        ...prev.students,
        {
          studentCode: 'String',
          fullname: '',
          age: 0,
          bloodType: 'A+',
          gender: true,
          classid: 1, // Lớp Mầm A
          parentid: 123,
          dob: new Date().toISOString().split('T')[0],
        },
      ],
    }));
    setStudentCount(prev => prev + 1);
  };

  // Remove student
  const removeStudent = index => {
    if (formData.students.length > 1) {
      setFormData(prev => ({
        ...prev,
        students: prev.students.filter((_, i) => i !== index),
      }));
      setStudentCount(prev => prev - 1);
    }
  };

  // Validate form data
  const validateForm = (isEditMode = false) => {
    const errors = [];

    // Validate parent information
    if (!formData.fullname.trim()) {
      errors.push('Họ và tên phụ huynh không được để trống');
    }

    if (!formData.email.trim()) {
      errors.push('Email không được để trống');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Email không đúng định dạng');
    }

    if (!formData.phone.trim()) {
      errors.push('Số điện thoại không được để trống');
    } else if (!/^[0-9]+$/.test(formData.phone)) {
      errors.push('Số điện thoại chỉ được nhập số');
    } else if (formData.phone.length < 10 || formData.phone.length > 11) {
      errors.push('Số điện thoại phải có 10-11 chữ số');
    }

    // Only validate students if not in edit mode
    if (!isEditMode) {
      formData.students.forEach((student, index) => {
        if (!student.fullname.trim()) {
          errors.push(`Họ và tên học sinh ${index + 1} không được để trống`);
        }

        if (!student.age || student.age < 0 || student.age > 18) {
          errors.push(`Tuổi học sinh ${index + 1} phải từ 0-18 tuổi`);
        }

        if (!student.dob) {
          errors.push(`Ngày sinh học sinh ${index + 1} không được để trống`);
        } else {
          const dob = new Date(student.dob);
          const today = new Date();
          if (dob > today) {
            errors.push(
              `Ngày sinh học sinh ${
                index + 1
              } không được là ngày trong tương lai`
            );
          }
        }

        if (!student.classid) {
          errors.push(`Lớp học sinh ${index + 1} không được để trống`);
        }
      });
    }

    return errors;
  };

  // Handle create parent
  const handleCreateParent = async e => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(false);
    if (validationErrors.length > 0) {
      alert('Vui lòng kiểm tra lại thông tin:\n' + validationErrors.join('\n'));
      return;
    }

    try {
      await createParent(formData);
      setShowCreateModal(false);
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        password: 'Password123@',
        address: '',
        students: [
          {
            studentCode: 'String',
            fullname: '',
            age: 0,
            bloodType: 'A+',
            gender: true,
            classid: 1, // Lớp Mầm A
            parentid: 123,
            dob: new Date().toISOString().split('T')[0],
          },
        ],
      });
      setStudentCount(1);
      refetch();
      alert('Tạo tài khoản phụ huynh thành công!');
    } catch (error) {
      console.error('Create failed:', error);
      let errorMessage = 'Không thể tạo tài khoản phụ huynh.';
      if (error.response && error.response.data) {
        if (error.response.data.innerMessage) {
          errorMessage = error.response.data.innerMessage;
        } else if (error.response.data.errors) {
          const errorKeys = Object.keys(error.response.data.errors);
          if (errorKeys.length > 0) {
            errorMessage = error.response.data.errors[errorKeys[0]][0];
          }
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert('Tạo tài khoản phụ huynh thất bại: ' + errorMessage);
    }
  };

  // Handle edit parent
  const handleEditParent = parent => {
    setEditingParent(parent);
    setFormData({
      fullname: parent.fullname || '',
      email: parent.email || '',
      phone: parent.phone || '',
      address: parent.address || '',
    });
    setShowEditModal(true);
  };

  // Handle update parent
  const handleUpdateParent = async e => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm(true);
    if (validationErrors.length > 0) {
      alert('Vui lòng kiểm tra lại thông tin:\n' + validationErrors.join('\n'));
      return;
    }

    try {
      await updateParent({
        parentid: _editingParent.parentid,
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });
      setShowEditModal(false);
      setEditingParent(null);
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        password: 'Password123@',
        address: '',
        students: [],
      });
      refetch();
      alert('Cập nhật thông tin phụ huynh thành công!');
    } catch (error) {
      console.error('Update failed:', error);
      let errorMessage = 'Không thể cập nhật thông tin phụ huynh.';
      if (error.response && error.response.data) {
        if (error.response.data.innerMessage) {
          errorMessage = error.response.data.innerMessage;
        } else if (error.response.data.errors) {
          const errorKeys = Object.keys(error.response.data.errors);
          if (errorKeys.length > 0) {
            errorMessage = error.response.data.errors[errorKeys[0]][0];
          }
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert('Cập nhật thông tin phụ huynh thất bại: ' + errorMessage);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async parent => {
    try {
      await toggleParentStatus(parent.parentid);
      refetch();
      alert(
        `Đã ${
          parent.isDeleted ? 'kích hoạt' : 'vô hiệu hóa'
        } tài khoản phụ huynh!`
      );
    } catch (error) {
      console.error('Toggle status failed:', error);
      alert('Không thể thay đổi trạng thái tài khoản. Vui lòng thử lại.');
    }
  };

  // Handle add student button click
  const handleAddStudent = parent => {
    setSelectedParent(parent);
    setStudentFormData({
      studentCode: '',
      fullname: '',
      age: 0,
      bloodType: 'A+',
      gender: true,
      classid: 1,
      parentid: parent.parentid,
      dob: new Date().toISOString().split('T')[0],
    });
    setShowAddStudentModal(true);
  };

  // Handle student form input change
  const handleStudentFormChange = e => {
    const { name, value } = e.target;
    setStudentFormData(prev => ({
      ...prev,
      [name]:
        name === 'age' || name === 'classid'
          ? parseInt(value)
          : name === 'gender'
          ? value === 'true'
          : value,
    }));
  };

  // Handle add student form submit
  const handleAddStudentSubmit = async e => {
    e.preventDefault();

    // Validate student form
    const errors = [];
    if (!studentFormData.fullname.trim()) {
      errors.push('Họ và tên học sinh không được để trống');
    }
    if (
      !studentFormData.age ||
      studentFormData.age < 0 ||
      studentFormData.age > 18
    ) {
      errors.push('Tuổi học sinh phải từ 0-18 tuổi');
    }
    if (!studentFormData.dob) {
      errors.push('Ngày sinh không được để trống');
    } else {
      const dob = new Date(studentFormData.dob);
      const today = new Date();
      if (dob > today) {
        errors.push('Ngày sinh không được là ngày trong tương lai');
      }
    }

    if (errors.length > 0) {
      alert('Vui lòng kiểm tra lại thông tin:\n' + errors.join('\n'));
      return;
    }

    try {
      // Call API to add student using adminStudentService
      await adminStudentService.addStudent(studentFormData);

      alert('Thêm học sinh thành công!');
      setShowAddStudentModal(false);
      setSelectedParent(null);
      setStudentFormData({
        fullname: '',
        age: 0,
        bloodType: 'A+',
        gender: true,
        classid: 1,
        parentid: 0,
        dob: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Add student failed:', error);
      alert('Không thể thêm học sinh. Vui lòng thử lại.');
    }
  };

  // Get status badge class
  const getStatusBadgeClass = parent => {
    return parent.isDeleted ? 'inactive' : 'active';
  };

  // Get account status text
  const getAccountStatus = parent => {
    return parent.isDeleted ? 'Vô hiệu hóa' : 'Hoạt động';
  };

  // Loading state
  if (loading) {
    return (
      <div className="parent-account-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>⏳ Đang tải danh sách tài khoản phụ huynh...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="parent-account-management">
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={refetch} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="parent-account-management">
      <div className="page-header">
        <h1>👨‍👩‍👧‍👦 Quản Lý Tài Khoản Phụ Huynh</h1>
        <p>Quản lý tài khoản phụ huynh trong hệ thống</p>
      </div>

      <div className="tab-content">
        <div className="section-header">
          <h2>Tài Khoản Phụ Huynh</h2>
          <div className="header-actions">
            <button onClick={() => refetch()} className="refresh-btn">
              🔄 Làm mới
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="create-btn"
            >
              ➕ Tạo Tài Khoản Mới
            </button>
          </div>
        </div>

        {!parentsList || parentsList.length === 0 ? (
          <div className="empty-state">
            <p>📭 Không tìm thấy tài khoản phụ huynh nào</p>
          </div>
        ) : (
          <div className="accounts-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th>Địa Chỉ</th>
                  <th>Trạng Thái</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {parentsList.map(parent => (
                  <tr key={parent.parentid}>
                    <td>{parent.parentid}</td>
                    <td>{parent.fullname}</td>
                    <td>{parent.email}</td>
                    <td>{parent.phone}</td>
                    <td>{parent.address || 'N/A'}</td>
                    <td>
                      <button
                        className={`status-toggle ${getStatusBadgeClass(
                          parent
                        )}`}
                        onClick={() => handleToggleStatus(parent)}
                        title={`Nhấp để ${
                          parent.isDeleted ? 'kích hoạt' : 'vô hiệu hóa'
                        } tài khoản`}
                      >
                        {getAccountStatus(parent)}
                      </button>
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleEditParent(parent)}
                        className="edit-btn"
                        title="Chỉnh sửa Phụ Huynh"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleAddStudent(parent)}
                        className="add-student-btn"
                        title="Thêm Học Sinh"
                      >
                        👶
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setFormData({
              fullname: '',
              email: '',
              phone: '',
              password: 'Password123@',
              address: '',
              students: [
                {
                  studentCode: 'String',
                  fullname: '',
                  age: 0,
                  bloodType: 'A+',
                  gender: true,
                  classid: 1, // Lớp Mầm A
                  parentid: 123,
                  dob: new Date().toISOString().split('T')[0],
                },
              ],
            });
            setStudentCount(1);
          }}
          title="Tạo Tài Khoản Phụ Huynh Mới"
        >
          <form onSubmit={handleCreateParent} className="create-form">
            <div className="form-section">
              <h3>Thông Tin Phụ Huynh</h3>

              <div className="form-group">
                <label htmlFor="fullname">Họ và Tên *</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên đầy đủ"
                  required
                />
                <small>Nhập họ và tên đầy đủ</small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  required
                />
                <small>Nhập đúng định dạng email</small>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Số Điện Thoại *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại (chỉ số)"
                  maxLength="11"
                  required
                />
                <small>Chỉ nhập số, độ dài 10-11 chữ số</small>
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật Khẩu</label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  readOnly
                />
                <small>Mật khẩu mặc định: Password123@</small>
              </div>

              <div className="form-group">
                <label htmlFor="address">Địa Chỉ</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h3>Thông Tin Học Sinh</h3>
                <button
                  type="button"
                  onClick={addStudent}
                  className="add-student-btn"
                >
                  ➕ Thêm Học Sinh
                </button>
              </div>

              {formData.students.map((student, index) => (
                <div key={index} className="student-form">
                  <div className="student-header">
                    <h4 style={{ color: 'white' }}>Học Sinh {index + 1}</h4>
                    {formData.students.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStudent(index)}
                        className="remove-student-btn"
                      >
                        🗑️ Xóa
                      </button>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Họ và Tên *</label>
                      <input
                        type="text"
                        value={student.fullname}
                        onChange={e =>
                          handleStudentChange(index, 'fullname', e.target.value)
                        }
                        placeholder="Nhập họ và tên học sinh"
                        required
                      />
                      <small>Nhập họ và tên đầy đủ</small>
                    </div>

                    <div className="form-group">
                      <label>Tuổi *</label>
                      <input
                        type="number"
                        min="0"
                        max="18"
                        value={student.age}
                        onChange={e => {
                          const value = parseInt(e.target.value) || 0;
                          if (value >= 0 && value <= 6) {
                            handleStudentChange(index, 'age', value);
                          }
                        }}
                        placeholder="0-6"
                        required
                      />
                      <small>Tuổi từ 3-6</small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Nhóm Máu</label>
                      <select
                        value={student.bloodType}
                        onChange={e =>
                          handleStudentChange(
                            index,
                            'bloodType',
                            e.target.value
                          )
                        }
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Giới Tính</label>
                      <select
                        value={student.gender}
                        onChange={e =>
                          handleStudentChange(
                            index,
                            'gender',
                            e.target.value === 'true'
                          )
                        }
                      >
                        <option value={true}>Nam</option>
                        <option value={false}>Nữ</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Lớp *</label>
                      <select
                        value={student.classid}
                        onChange={e =>
                          handleStudentChange(
                            index,
                            'classid',
                            parseInt(e.target.value)
                          )
                        }
                        required
                      >
                        <option value={1}>Lớp Mầm A (ID: 1)</option>
                        <option value={2}>Lớp Mầm B (ID: 2)</option>
                        <option value={3}>Lớp Mầm C (ID: 3)</option>
                        <option value={4}>Lớp Chồi A (ID: 4)</option>
                        <option value={5}>Lớp Chồi B (ID: 5)</option>
                        <option value={6}>Lớp Chồi C (ID: 6)</option>
                        <option value={7}>Lớp Lá A (ID: 7)</option>
                        <option value={8}>Lớp Lá B (ID: 8)</option>
                        <option value={9}>Lớp Lá C (ID: 9)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Ngày Sinh *</label>
                      <input
                        type="date"
                        value={student.dob}
                        onChange={e =>
                          handleStudentChange(index, 'dob', e.target.value)
                        }
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <small>Không được chọn ngày trong tương lai</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    fullname: '',
                    email: '',
                    phone: '',
                    password: 'Password123@',
                    address: '',
                    students: [
                      {
                        studentCode: 'String',
                        fullname: '',
                        age: 0,
                        bloodType: 'A+',
                        gender: true,
                        classid: 1, // Lớp Mầm A
                        parentid: 123,
                        dob: new Date().toISOString().split('T')[0],
                      },
                    ],
                  });
                  setStudentCount(1);
                }}
                className="cancel-btn"
                disabled={actionLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={actionLoading}
              >
                {actionLoading ? '⏳ Đang tạo...' : '💾 Tạo Tài Khoản'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingParent(null);
            setFormData({
              fullname: '',
              email: '',
              phone: '',
              password: 'Password123@',
              address: '',
              students: [],
            });
          }}
          title="Chỉnh Sửa Tài Khoản Phụ Huynh"
        >
          <form onSubmit={handleUpdateParent} className="edit-form">
            <div className="form-group">
              <label htmlFor="edit-fullname">Họ và Tên</label>
              <input
                type="text"
                id="edit-fullname"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-email">Email</label>
              <input
                type="email"
                id="edit-email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-phone">Số Điện Thoại</label>
              <input
                type="tel"
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                pattern="[0-9]+"
                title="Chỉ được nhập số"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-address">Địa Chỉ</label>
              <textarea
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingParent(null);
                  setFormData({
                    fullname: '',
                    email: '',
                    phone: '',
                    password: 'Password123@',
                    address: '',
                    students: [],
                  });
                }}
                className="cancel-btn"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={actionLoading}
              >
                {actionLoading ? '⏳ Đang lưu...' : '💾 Lưu Thay Đổi'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && selectedParent && (
        <Modal
          isOpen={showAddStudentModal}
          onClose={() => {
            setShowAddStudentModal(false);
            setSelectedParent(null);
            setStudentFormData({
              studentCode: '',
              fullname: '',
              age: 0,
              bloodType: 'A+',
              gender: true,
              classid: 1,
              parentid: 0,
              dob: new Date().toISOString().split('T')[0],
            });
          }}
          title={`Thêm Học Sinh cho ${selectedParent.fullname}`}
        >
          <form onSubmit={handleAddStudentSubmit} className="add-student-form">
            <div className="form-group">
              <label htmlFor="studentFullname">Họ và Tên Học Sinh *</label>
              <input
                type="text"
                id="studentFullname"
                name="fullname"
                value={studentFormData.fullname}
                onChange={handleStudentFormChange}
                placeholder="Nhập họ và tên học sinh"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentAge">Tuổi *</label>
                <input
                  type="number"
                  id="studentAge"
                  name="age"
                  min="0"
                  max="18"
                  value={studentFormData.age}
                  onChange={handleStudentFormChange}
                  placeholder="0-18"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="studentBloodType">Nhóm Máu</label>
                <select
                  id="studentBloodType"
                  name="bloodType"
                  value={studentFormData.bloodType}
                  onChange={handleStudentFormChange}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentGender">Giới Tính</label>
                <select
                  id="studentGender"
                  name="gender"
                  value={studentFormData.gender}
                  onChange={handleStudentFormChange}
                >
                  <option value={true}>Nam</option>
                  <option value={false}>Nữ</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="studentClass">Lớp *</label>
                <select
                  id="studentClass"
                  name="classid"
                  value={studentFormData.classid}
                  onChange={handleStudentFormChange}
                  required
                >
                  <option value={1}>Lớp Mầm A (ID: 1)</option>
                  <option value={2}>Lớp Mầm B (ID: 2)</option>
                  <option value={3}>Lớp Mầm C (ID: 3)</option>
                  <option value={4}>Lớp Chồi A (ID: 4)</option>
                  <option value={5}>Lớp Chồi B (ID: 5)</option>
                  <option value={6}>Lớp Chồi C (ID: 6)</option>
                  <option value={7}>Lớp Lá A (ID: 7)</option>
                  <option value={8}>Lớp Lá B (ID: 8)</option>
                  <option value={9}>Lớp Lá C (ID: 9)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="studentDob">Ngày Sinh *</label>
              <input
                type="date"
                id="studentDob"
                name="dob"
                value={studentFormData.dob}
                onChange={handleStudentFormChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setShowAddStudentModal(false);
                  setSelectedParent(null);
                  setStudentFormData({
                    fullname: '',
                    age: 0,
                    bloodType: 'A+',
                    gender: true,
                    classid: 1,
                    parentid: 0,
                    dob: new Date().toISOString().split('T')[0],
                  });
                }}
                className="cancel-btn"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={actionLoading}
              >
                {actionLoading ? '⏳ Đang thêm...' : '➕ Thêm Học Sinh'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ParentAccountManagement;
