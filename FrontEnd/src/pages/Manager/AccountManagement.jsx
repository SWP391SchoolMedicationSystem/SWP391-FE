import React, { useState, useEffect } from 'react';
import { useManagerAccounts } from '../../utils/hooks/useManager';
import Modal from '../../components/common/Modal';
import '../../css/Manager/AccountManagement.css';

const AccountManagement = () => {
  const {
    parentsList,
    staffList,
    loading,
    error,
    fetchAllAccounts,
    updateParent,
    updateStaff,
    toggleParentStatus,
    toggleStaffStatus,
    refetch,
  } = useManagerAccounts();

  const [activeTab, setActiveTab] = useState('parents');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Load data on mount
  useEffect(() => {
    fetchAllAccounts();
  }, [fetchAllAccounts]);

  // Check if account can be edited (only Parents and Nurses can be edited by Manager)
  const canEditAccount = (account, accountType) => {
    if (accountType === 'parent') return true;
    if (accountType === 'staff') {
      // Manager can only edit Nurse accounts (roleid = 3), not Admin (1) or Manager (2)
      return account.roleid === 3;
    }
    return false;
  };

  // Handle edit account
  const handleEditAccount = (account, accountType) => {
    if (!canEditAccount(account, accountType)) {
      alert('Bạn không có quyền chỉnh sửa tài khoản này.');
      return;
    }

    setEditingAccount({ ...account, accountType });

    if (accountType === 'parent') {
      setEditFormData({
        parentid: account.parentid,
        fullname: account.fullname || '',
        email: account.email || '',
        phone: account.phone || '',
        address: account.address || '',
      });
    } else {
      setEditFormData({
        staffid: account.staffid,
        fullname: account.fullname || '',
        email: account.email || '',
        phone: account.phone || '',
        roleid: account.roleid || 3,
      });
    }

    setShowEditModal(true);
  };

  // Handle form input change
  const handleInputChange = e => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (editingAccount.accountType === 'parent') {
        await updateParent(editFormData);
      } else {
        await updateStaff(editFormData);
      }

      setShowEditModal(false);
      setEditingAccount(null);
      setEditFormData({});

      // Show success message
      alert('Cập nhật tài khoản thành công!');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Không thể cập nhật tài khoản. Vui lòng thử lại.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Get account status display
  const getAccountStatus = account => {
    if (account.isDeleted) return 'Không hoạt động';
    return 'Hoạt động';
  };

  // Get status badge class
  const getStatusBadgeClass = account => {
    if (account.isDeleted) return 'status-inactive';
    return 'status-active';
  };

  // Check if status can be toggled
  const canToggleStatus = (account, accountType) => {
    if (accountType === 'parent') return true;
    if (accountType === 'staff') {
      // Manager can toggle status for Nurse accounts only, not Admin/Manager
      return account.roleid === 3;
    }
    return false;
  };

  // Handle toggle status
  const handleToggleStatus = async (account, accountType) => {
    if (!canToggleStatus(account, accountType)) {
      alert('Bạn không có quyền thay đổi trạng thái tài khoản này.');
      return;
    }

    const action = account.isDeleted ? 'kích hoạt' : 'vô hiệu hóa';
    const confirmMessage = `Bạn có chắc chắn muốn ${action} ${account.fullname}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      if (accountType === 'parent') {
        await toggleParentStatus(account.parentid);
      } else {
        await toggleStaffStatus(account.staffid);
      }

      alert(`Tài khoản đã được ${action} thành công!`);
    } catch (error) {
      console.error('Toggle status failed:', error);
      alert(`Không thể ${action} tài khoản. Vui lòng thử lại.`);
    }
  };

  // Render parent form fields
  const renderParentForm = () => (
    <>
      <div className="form-group">
        <label htmlFor="fullname">Họ và Tên:</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          value={editFormData.fullname}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={editFormData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Số Điện Thoại:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={editFormData.phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Địa Chỉ:</label>
        <textarea
          id="address"
          name="address"
          value={editFormData.address}
          onChange={handleInputChange}
          rows="3"
          required
        />
      </div>
    </>
  );

  // Render staff form fields
  const renderStaffForm = () => (
    <>
      <div className="form-group">
        <label htmlFor="fullname">Họ và Tên:</label>
        <input
          type="text"
          id="fullname"
          name="fullname"
          value={editFormData.fullname}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={editFormData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Số Điện Thoại:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={editFormData.phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="roleid">Vai Trò:</label>
        <select
          id="roleid"
          name="roleid"
          value={editFormData.roleid}
          onChange={handleInputChange}
          required
          disabled={editFormData.roleid !== 3} // Only allow editing Nurse role
        >
          <option value={1}>Admin</option>
          <option value={2}>Manager</option>
          <option value={3}>Nurse</option>
        </select>
        {editFormData.roleid !== 3 && (
          <small
            style={{ color: '#e74c3c', marginTop: '5px', display: 'block' }}
          >
            Không thể thay đổi vai trò cho tài khoản Admin/Manager
          </small>
        )}
      </div>
    </>
  );

  // Loading state
  if (loading) {
    return (
      <div className="account-management">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>⏳ Đang tải danh sách tài khoản...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="account-management">
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
    <div className="account-management">
      <div className="page-header">
        <h1>👥 Quản Lý Tài Khoản</h1>
        <p>Quản lý tài khoản phụ huynh và nhân viên</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'parents' ? 'active' : ''}`}
          onClick={() => setActiveTab('parents')}
        >
          👨‍👩‍👧‍👦 Phụ Huynh ({parentsList.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          👩‍💼 Nhân Viên ({staffList.length})
        </button>
      </div>

      {/* Parents Tab */}
      {activeTab === 'parents' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Tài Khoản Phụ Huynh</h2>
            <button onClick={() => fetchAllAccounts()} className="refresh-btn">
              🔄 Làm mới
            </button>
          </div>

          {parentsList.length === 0 ? (
            <div className="empty-state">
              <p>Đang tải dữ liệu...</p>
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
                    <th>Ngày Tạo</th>
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
                      <td>{parent.address}</td>
                      <td>
                        <button
                          className={`status-toggle ${getStatusBadgeClass(
                            parent
                          )}`}
                          onClick={() => handleToggleStatus(parent, 'parent')}
                          title={`Nhấp để ${
                            parent.isDeleted ? 'kích hoạt' : 'vô hiệu hóa'
                          } tài khoản`}
                        >
                          {getAccountStatus(parent)}
                        </button>
                      </td>
                      <td>
                        {parent.createdDate
                          ? new Date(parent.createdDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="actions">
                        <button
                          onClick={() => handleEditAccount(parent, 'parent')}
                          className="edit-btn"
                          title="Chỉnh sửa Phụ Huynh"
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Tài Khoản Nhân Viên</h2>
            <button onClick={() => fetchAllAccounts()} className="refresh-btn">
              🔄 Làm mới
            </button>
          </div>

          {staffList.length === 0 ? (
            <div className="empty-state">
              <p>📭 Không tìm thấy tài khoản nhân viên nào</p>
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
                    <th>Vai Trò</th>
                    <th>Trạng Thái</th>
                    <th>Ngày Tạo</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map(staff => (
                    <tr key={staff.staffid}>
                      <td>{staff.staffid}</td>
                      <td>{staff.fullname}</td>
                      <td>{staff.email}</td>
                      <td>{staff.phone}</td>
                      <td>
                        <span className={`role-badge role-${staff.roleid}`}>
                          {staff.roleid === 1
                            ? 'Admin'
                            : staff.roleid === 2
                            ? 'Manager'
                            : 'Nurse'}
                        </span>
                      </td>
                      <td>
                        {canToggleStatus(staff, 'staff') ? (
                          <button
                            className={`status-toggle ${getStatusBadgeClass(
                              staff
                            )}`}
                            onClick={() => handleToggleStatus(staff, 'staff')}
                            title={`Nhấp để ${
                              staff.isDeleted ? 'kích hoạt' : 'vô hiệu hóa'
                            } tài khoản`}
                          >
                            {getAccountStatus(staff)}
                          </button>
                        ) : (
                          <span
                            className={`status-badge ${getStatusBadgeClass(
                              staff
                            )}`}
                            title="Không thể thay đổi trạng thái cho tài khoản Admin/Manager"
                          >
                            {getAccountStatus(staff)}
                          </span>
                        )}
                      </td>
                      <td>
                        {staff.createdAt
                          ? new Date(staff.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="actions">
                        {canEditAccount(staff, 'staff') ? (
                          <button
                            onClick={() => handleEditAccount(staff, 'staff')}
                            className="edit-btn"
                            title="Chỉnh sửa Nhân Viên"
                          >
                            ✏️
                          </button>
                        ) : (
                          <span
                            className="view-only-badge"
                            title="Chỉ Xem - Không Có Quyền Chỉnh Sửa"
                          >
                            👁️ Chỉ Xem
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingAccount(null);
            setEditFormData({});
          }}
          title={`Chỉnh Sửa Tài Khoản ${
            editingAccount?.accountType === 'parent' ? 'Phụ Huynh' : 'Nhân Viên'
          }`}
        >
          <form onSubmit={handleSubmit} className="edit-form">
            {editingAccount?.accountType === 'parent'
              ? renderParentForm()
              : renderStaffForm()}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAccount(null);
                  setEditFormData({});
                }}
                className="cancel-btn"
                disabled={submitLoading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={submitLoading}
              >
                {submitLoading ? '⏳ Đang lưu...' : '💾 Lưu Thay Đổi'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AccountManagement;
