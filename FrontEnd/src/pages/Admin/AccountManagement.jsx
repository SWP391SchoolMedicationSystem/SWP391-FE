import React, { useState, useEffect } from 'react';
import { adminStaffService } from '../../services/adminService';
import '../../css/Admin/AccountManagement.css';

const AccountManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: 'Password123',
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

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roleID' ? parseInt(value) : value,
    }));
  };

  // Handle create staff
  const handleCreateStaff = () => {
    setFormData({
      fullname: '',
      email: '',
      phone: '',
      password: 'Password123',
      roleID: 1,
    });
    setShowCreateModal(true);
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Validate form
      if (!formData.fullname.trim()) {
        alert('Vui lòng nhập họ và tên');
        return;
      }
      if (!formData.email.trim()) {
        alert('Vui lòng nhập email');
        return;
      }
      if (!formData.phone.trim()) {
        alert('Vui lòng nhập số điện thoại');
        return;
      }

      // Create staff via API
      await adminStaffService.registerStaff(formData);

      // Success - refresh data and close modal
      alert('Tạo tài khoản nhân viên thành công!');
      setShowCreateModal(false);
      setFormData({
        fullname: '',
        email: '',
        phone: '',
        password: 'Password123',
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

  // Format date for display
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="account-management-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>👥 Quản Lý Tài Khoản</h1>
          <p>Tạo và quản lý tài khoản nhân viên trong hệ thống</p>
        </div>
        <div className="header-actions">
        
          <button onClick={handleCreateStaff} className="create-btn">
            ➕ Tạo tài khoản
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{staff.length}</h3>
            <p>Tổng nhân viên</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍💼</div>
          <div className="stat-content">
            <h3>{staff.filter(s => s.roleid === 1).length}</h3>
            <p>Admin</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>{staff.filter(s => s.roleid === 2).length}</h3>
            <p>Manager</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👩‍⚕️</div>
          <div className="stat-content">
            <h3>{staff.filter(s => s.roleid === 3).length}</h3>
            <p>Nurse</p>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="staff-section">
        <h2>📋 Danh sách nhân viên</h2>

        {loading ? (
          <div className="loading-state">
            <p>⏳ Đang tải danh sách nhân viên...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>❌ {error}</p>
            <button onClick={fetchStaff} className="retry-btn">
              🔄 Thử lại
            </button>
          </div>
        ) : staff.length > 0 ? (
          <div className="staff-table-container">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                  <th>Cập nhật</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {staff.map(staffMember => (
                  <tr key={staffMember.staffid}>
                    <td>{staffMember.staffid}</td>
                    <td>
                      <div className="staff-name">
                        <strong>{staffMember.fullname}</strong>
                      </div>
                    </td>
                    <td>{staffMember.email}</td>
                    <td>{staffMember.phone}</td>
                    <td>
                      <span className={`role-badge role-${staffMember.roleid}`}>
                        {roleMapping[staffMember.roleid] || 'Unknown'}
                      </span>
                    </td>
                    <td>{formatDate(staffMember.createdAt)}</td>
                    <td>{formatDate(staffMember.updatedAt)}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn" title="Chỉnh sửa">
                          ✏️
                        </button>
                        <button className="delete-btn" title="Xóa">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-staff">
            <div className="no-staff-icon">👥</div>
            <p>Chưa có nhân viên nào trong hệ thống</p>
            <button onClick={handleCreateStaff} className="create-first-btn">
              ➕ Tạo nhân viên đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Tạo Tài Khoản Nhân Viên</h3>
              <button
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                />
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
                />
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
                />
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
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="cancel-btn"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitLoading}
                >
                  {submitLoading ? '⏳ Đang tạo...' : '➕ Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
