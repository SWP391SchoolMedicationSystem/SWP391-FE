import React, { useState, useEffect } from "react";
import "../../css/Manager/AccountManagement.css";
import userService from "../../services/userService";

function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch accounts from API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const apiData = await userService.getAllUsers();

        // Transform API data to match component structure
        const transformedData = apiData.map((user) => ({
          id: user.userId,
          fullName:
            user.email
              .split("@")[0]
              .replace(/[._]/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A",
          email: user.email,
          phone: "N/A", // API doesn't provide phone
          role: user.isStaff ? getStaffRole(user.email) : "Parent",
          status: "Hoạt động", // API doesn't provide status, default to active
          createdDate: "N/A", // API doesn't provide creation date
          lastLogin: "N/A", // API doesn't provide last login
        }));

        setAccounts(transformedData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching accounts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Helper function to determine staff role based on email
  const getStaffRole = (email) => {
    if (email.includes("admin")) return "Admin";
    if (email.includes("teacher")) return "Teacher";
    if (email.includes("nurse")) return "Nurse";
    if (email.includes("manager")) return "Manager";
    return "Staff";
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // 'view', 'edit', 'create'

  const roles = ["Admin", "Manager", "Teacher", "Nurse", "Staff", "Parent"];
  const statuses = ["Hoạt động", "Tạm khóa", "Vô hiệu hóa"];

  // Show loading state
  if (loading) {
    return (
      <div className="account-management-container">
        <div className="loading-container">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="account-management-container">
        <div className="error-container">
          <p>Lỗi: {error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  // Filter accounts based on search and filters
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.phone.includes(searchTerm);

    const matchesRole = filterRole === "" || account.role === filterRole;
    const matchesStatus =
      filterStatus === "" || account.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewAccount = (account) => {
    setCurrentAccount(account);
    setModalMode("view");
    setShowModal(true);
  };

  const handleEditAccount = (account) => {
    setCurrentAccount(account);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleCreateAccount = () => {
    setCurrentAccount({
      fullName: "",
      email: "",
      phone: "",
      role: "Parent",
      status: "Hoạt động",
    });
    setModalMode("create");
    setShowModal(true);
  };

  const handleDeleteAccount = (accountId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      console.log("Deleting account:", accountId);
      // Here you would typically call an API to delete the account
    }
  };

  const handleSaveAccount = (accountData) => {
    if (modalMode === "create") {
      console.log("Creating new account:", accountData);
      // Here you would typically call an API to create the account
    } else if (modalMode === "edit") {
      console.log("Updating account:", accountData);
      // Here you would typically call an API to update the account
    }
    setShowModal(false);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Hoạt động":
        return "status-active";
      case "Tạm khóa":
        return "status-suspended";
      case "Vô hiệu hóa":
        return "status-disabled";
      default:
        return "status-active";
    }
  };

  const getRoleClass = (role) => {
    switch (role) {
      case "Manager":
        return "role-manager";
      case "Nurse":
        return "role-nurse";
      case "Parent":
        return "role-parent";
      default:
        return "role-parent";
    }
  };

  // Calculate statistics
  const stats = {
    total: accounts.length,
    active: accounts.filter((a) => a.status === "Hoạt động").length,
    suspended: accounts.filter((a) => a.status === "Tạm khóa").length,
    managers: accounts.filter((a) => a.role === "Manager").length,
    nurses: accounts.filter((a) => a.role === "Nurse").length,
    parents: accounts.filter((a) => a.role === "Parent").length,
  };

  return (
    <div className="account-management-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Quản Lý Tài Khoản</h1>
          <p>Quản lý tài khoản người dùng trong hệ thống</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateAccount}>
          ➕ Tạo Tài Khoản Mới
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng tài khoản</p>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>Đang hoạt động</p>
          </div>
        </div>
        <div className="stat-card suspended">
          <div className="stat-icon">⏸️</div>
          <div className="stat-content">
            <h3>{stats.suspended}</h3>
            <p>Tạm khóa</p>
          </div>
        </div>
        <div className="stat-card managers">
          <div className="stat-icon">🛡️</div>
          <div className="stat-content">
            <h3>{stats.managers}</h3>
            <p>Quản lý</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-section">
        <div className="search-filter-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Tất cả vai trò</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="table-container">
        <table className="accounts-table">
          <thead>
            <tr>
              <th>Người dùng</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Đăng nhập cuối</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {account.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-details">
                      <strong>{account.fullName}</strong>
                      <div className="user-email">{account.email}</div>
                      <div className="user-phone">{account.phone}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${getRoleClass(account.role)}`}>
                    {account.role}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(account.status)}`}
                  >
                    {account.status}
                  </span>
                </td>
                <td>{account.createdDate}</td>
                <td>{account.lastLogin}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-view"
                      onClick={() => handleViewAccount(account)}
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                    <button
                      className="btn btn-sm btn-edit"
                      onClick={() => handleEditAccount(account)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDeleteAccount(account.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAccounts.length === 0 && (
          <div className="no-data">
            <p>Không tìm thấy tài khoản nào phù hợp</p>
          </div>
        )}
      </div>

      {/* Account Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalMode === "view" && "Chi Tiết Tài Khoản"}
                {modalMode === "edit" && "Chỉnh Sửa Tài Khoản"}
                {modalMode === "create" && "Tạo Tài Khoản Mới"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {modalMode === "view" ? (
                <div className="account-details">
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Họ và tên:</label>
                      <span>{currentAccount.fullName}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{currentAccount.email}</span>
                    </div>
                    <div className="detail-item">
                      <label>Số điện thoại:</label>
                      <span>{currentAccount.phone}</span>
                    </div>
                    <div className="detail-item">
                      <label>Vai trò:</label>
                      <span
                        className={`role-badge ${getRoleClass(
                          currentAccount.role
                        )}`}
                      >
                        {currentAccount.role}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Trạng thái:</label>
                      <span
                        className={`status-badge ${getStatusClass(
                          currentAccount.status
                        )}`}
                      >
                        {currentAccount.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Ngày tạo:</label>
                      <span>{currentAccount.createdDate}</span>
                    </div>
                    <div className="detail-item">
                      <label>Đăng nhập cuối:</label>
                      <span>{currentAccount.lastLogin}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveAccount(currentAccount);
                  }}
                  className="account-form"
                >
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Họ và tên *</label>
                      <input
                        type="text"
                        value={currentAccount.fullName}
                        onChange={(e) =>
                          setCurrentAccount({
                            ...currentAccount,
                            fullName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        value={currentAccount.email}
                        onChange={(e) =>
                          setCurrentAccount({
                            ...currentAccount,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Số điện thoại *</label>
                      <input
                        type="tel"
                        value={currentAccount.phone}
                        onChange={(e) =>
                          setCurrentAccount({
                            ...currentAccount,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Vai trò *</label>
                      <select
                        value={currentAccount.role}
                        onChange={(e) =>
                          setCurrentAccount({
                            ...currentAccount,
                            role: e.target.value,
                          })
                        }
                        required
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Trạng thái *</label>
                      <select
                        value={currentAccount.status}
                        onChange={(e) =>
                          setCurrentAccount({
                            ...currentAccount,
                            status: e.target.value,
                          })
                        }
                        required
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>

                    {modalMode === "create" && (
                      <div className="form-group">
                        <label>Mật khẩu *</label>
                        <input
                          type="password"
                          placeholder="Nhập mật khẩu"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-cancel"
                      onClick={() => setShowModal(false)}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {modalMode === "create" ? "Tạo Tài Khoản" : "Cập Nhật"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountManagement;
