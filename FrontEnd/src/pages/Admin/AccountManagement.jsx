import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { adminStaffService } from '../../services/adminService';
import '../../css/Admin/AccountManagement.css';

const AccountManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Form data
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: 'Password123@',
    roleID: 1,
  });

  // Role mapping
  const roleMapping = {
    1: 'Admin',
    2: 'Manager',
    3: 'Nurse',
  };

  // Role options for dropdown
  const roleOptions = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Manager' },
    { value: 3, label: 'Nurse' },
  ];

  // Load staff data on component mount
  useEffect(() => {
    fetchStaff();
  }, []);

  // Fetch all staff
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminStaffService.getAllStaff();
      setStaff(response || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setError('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = phone => {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(phone);
  };

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roleID' ? parseInt(value) : value,
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle create staff
  const handleCreateStaff = () => {
    setFormData({
      fullname: '',
      email: '',
      phone: '',
      password: 'Password123@',
      roleID: 1,
    });
    setValidationErrors({});
    setShowCreateModal(true);
  };

  // Handle form submit for create
  const handleSubmitCreate = async e => {
    e.preventDefault();

    // Validation
    const errors = {};

    if (!formData.fullname.trim()) {
      errors.fullname = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(formData.email)) {
      errors.email =
        'Email phải có định dạng hợp lệ (ví dụ: example@domain.com)';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setSubmitLoading(true);

    try {
      // Create staff via API
      await adminStaffService.registerStaff(formData);

      // Success - refresh data and close modal
      alert('Tạo tài khoản nhân viên thành công!');
      setShowCreateModal(false);
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        password: 'Password123@',
        roleID: 1,
      });
      fetchStaff();
    } catch (error) {
      console.error('Error creating staff:', error);
      alert('Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại!');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle edit staff
  const handleEditStaff = staffMember => {
    setEditingStaff(staffMember);
    setFormData({
      fullname: staffMember.fullname || '',
      email: staffMember.email || '',
      phone: staffMember.phone || '',
      roleID: staffMember.roleid || 1,
    });
    setValidationErrors({});
    setShowEditModal(true);
  };

  // Handle update staff
  const handleUpdateStaff = async e => {
    e.preventDefault();

    // Validation
    const errors = {};

    if (!formData.fullname.trim()) {
      errors.fullname = 'Vui lòng nhập họ và tên';
    }

    if (!formData.email.trim()) {
      errors.email = 'Vui lòng nhập email';
    } else if (!validateEmail(formData.email)) {
      errors.email =
        'Email phải có định dạng hợp lệ (ví dụ: example@domain.com)';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Số điện thoại phải có 10-11 chữ số';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setSubmitLoading(true);

    try {
      // Update staff via API
      await adminStaffService.updateStaff({
        staffid: editingStaff.staffid,
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        roleid: formData.roleID,
      });

      // Success - refresh data and close modal
      alert('Cập nhật thông tin nhân viên thành công!');
      setShowEditModal(false);
      setEditingStaff(null);
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        password: 'Password123@',
        roleID: 1,
      });
      fetchStaff();
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại!');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete staff
  const handleDeleteStaff = async staffMember => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa nhân viên "${staffMember.fullname}"?`
      )
    ) {
      try {
        await adminStaffService.deleteStaff(staffMember.staffid);
        fetchStaff();
        alert('Xóa tài khoản nhân viên thành công!');
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Không thể xóa tài khoản nhân viên. Vui lòng thử lại.');
      }
    }
  };

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="parent-account-management">
      <div className="page-header">
        <h1>👥 Quản Lý Tài Khoản</h1>
        <p>Tạo và quản lý tài khoản nhân viên trong hệ thống</p>
      </div>

      <div className="tab-content">
        <div className="section-header">
          <div>
            <h2>Tài Khoản Nhân Viên</h2>
          </div>
          <div className="header-actions">
            <button onClick={fetchStaff} className="refresh-btn">
              🔄 Làm mới
            </button>
            <button onClick={handleCreateStaff} className="create-btn">
              ➕ Tạo Tài Khoản Mới
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>⏳ Đang tải danh sách nhân viên...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>❌ {error}</p>
            <button onClick={fetchStaff} className="retry-btn">
              🔄 Thử lại
            </button>
          </div>
        ) : staff.filter(s => !s.isDeleted).length > 0 ? (
          <div className="accounts-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và Tên</th>
                  <th>Email</th>
                  <th>Số Điện Thoại</th>
                  <th>Vai Trò</th>
                  <th>Ngày Tạo</th>
                  <th>Cập Nhật</th>
                  <th>Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {staff
                  .filter(staffMember => !staffMember.isDeleted)
                  .map(staffMember => (
                    <tr key={staffMember.staffid}>
                      <td>{staffMember.staffid}</td>
                      <td>{staffMember.fullname}</td>
                      <td>{staffMember.email}</td>
                      <td>{staffMember.phone}</td>
                      <td>
                        <span
                          className={`role-badge role-${staffMember.roleid}`}
                        >
                          {roleMapping[staffMember.roleid] || 'Unknown'}
                        </span>
                      </td>
                      <td>{formatDate(staffMember.createdAt)}</td>
                      <td>{formatDate(staffMember.updatedAt)}</td>
                      <td className="actions">
                        <button
                          onClick={() => handleEditStaff(staffMember)}
                          className="edit-btn"
                          title="Chỉnh sửa Nhân Viên"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staffMember)}
                          className="delete-btn"
                          title="Xóa Nhân Viên"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>📭 Không tìm thấy nhân viên nào</p>
          </div>
        )}
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowCreateModal(false);
            setValidationErrors({});
          }}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Tạo Tài Khoản Nhân Viên</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowCreateModal(false);
                  setValidationErrors({});
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitCreate} className="modal-body">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                  style={{
                    border: validationErrors.fullname
                      ? '2px solid #dc3545'
                      : '1px solid #ced4da',
                  }}
                />
                {validationErrors.fullname && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    ⚠️ {validationErrors.fullname}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ email"
                  required
                  style={{
                    border: validationErrors.email
                      ? '2px solid #dc3545'
                      : '1px solid #ced4da',
                  }}
                />
                {validationErrors.email && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    ⚠️ {validationErrors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                  style={{
                    border: validationErrors.phone
                      ? '2px solid #dc3545'
                      : '1px solid #ced4da',
                  }}
                />
                {validationErrors.phone && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    ⚠️ {validationErrors.phone}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Mật khẩu mặc định</label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mật khẩu mặc định"
                  readOnly
                />
                <small className="form-help">
                  Mật khẩu mặc định sẽ được gửi qua email
                </small>
              </div>

              <div className="form-group">
                <label>Vai trò *</label>
                <select
                  name="roleID"
                  value={formData.roleID}
                  onChange={handleInputChange}
                  required
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowCreateModal(false);
                    setValidationErrors({});
                  }}
                  className="mui-cancel-btn"
                  sx={{
                    flex: 1,
                    marginRight: '10px',
                    padding: '12px 20px',
                    borderColor: '#6c757d',
                    color: '#6c757d',
                    '&:hover': {
                      borderColor: '#5a6268',
                      backgroundColor: '#f8f9fa',
                    },
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={submitLoading}
                  className="mui-submit-btn"
                  sx={{
                    flex: 1,
                    padding: '12px 20px',
                    backgroundColor: '#28a745',
                    '&:hover': {
                      backgroundColor: '#218838',
                    },
                    '&:disabled': {
                      backgroundColor: '#6c757d',
                    },
                  }}
                >
                  {submitLoading ? '⏳ Đang tạo...' : '➕ Tạo tài khoản'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowEditModal(false);
            setValidationErrors({});
          }}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✏️ Chỉnh Sửa Tài Khoản Nhân Viên</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowEditModal(false);
                  setValidationErrors({});
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateStaff} className="modal-body">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                  style={{
                    border: validationErrors.fullname
                      ? '2px solid #dc3545'
                      : '1px solid #ced4da',
                  }}
                />
                {validationErrors.fullname && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    ⚠️ {validationErrors.fullname}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ email"
                  required
                  style={{
                    border: validationErrors.email
                      ? '2px solid #dc3545'
                      : '1px solid #ced4da',
                  }}
                />
                {validationErrors.email && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    ⚠️ {validationErrors.email}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  required
                  style={{
                    border: validationErrors.phone
                      ? '2px solid #dc3545'
                      : '1px solid #ced4da',
                  }}
                />
                {validationErrors.phone && (
                  <div
                    style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    ⚠️ {validationErrors.phone}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Vai trò *</label>
                <select
                  name="roleID"
                  value={formData.roleID}
                  onChange={handleInputChange}
                  required
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowEditModal(false);
                    setValidationErrors({});
                  }}
                  className="mui-cancel-btn"
                  sx={{
                    flex: 1,
                    marginRight: '10px',
                    padding: '12px 20px',
                    borderColor: '#6c757d',
                    color: '#6c757d',
                    '&:hover': {
                      borderColor: '#5a6268',
                      backgroundColor: '#f8f9fa',
                    },
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={submitLoading}
                  className="mui-submit-btn"
                  sx={{
                    flex: 1,
                    padding: '12px 20px',
                    backgroundColor: '#28a745',
                    '&:hover': {
                      backgroundColor: '#218838',
                    },
                    '&:disabled': {
                      backgroundColor: '#6c757d',
                    },
                  }}
                >
                  {submitLoading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
