import React, { useEffect } from "react";
import "../../css/Manager/AccountManagement.scss";
import userService from "../../services/userService";
import { useCRUD, useFilter, useModal } from "../../utils/hooks/useCRUD";

function AccountManagement() {
  // Use custom hooks
  const crud = useCRUD([], {
    baseEndpoint: "/api/manager/accounts",
    endpoints: {
      fetchAll: "/api/manager/accounts",
      create: "/api/manager/accounts",
      update: "/api/manager/accounts",
      delete: "/api/manager/accounts",
    },
  });

  const { filters, searchTerm, filteredData, updateFilter, setSearchTerm } =
    useFilter(crud.data, {
      role: "",
      status: "",
    });

  const modal = useModal();

  // Fetch accounts from API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
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

        crud.setData(transformedData);
      } catch (err) {
        crud.setError(err.message);
        console.error("Error fetching accounts:", err);
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

  const roles = ["Admin", "Manager", "Teacher", "Nurse", "Staff", "Parent"];
  const statuses = ["Hoạt động", "Tạm khóa", "Vô hiệu hóa"];

  // Show loading state
  if (crud.loading) {
    return (
      <div className="account-management-container">
        <div className="loading-container">
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (crud.error) {
    return (
      <div className="account-management-container">
        <div className="error-container">
          <p>Lỗi: {crud.error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  const handleViewAccount = (account) => {
    modal.open(account, "view");
  };

  const handleEditAccount = (account) => {
    modal.open(account, "edit");
  };

  const handleCreateAccount = () => {
    modal.open(
      {
        fullName: "",
        email: "",
        phone: "",
        role: "Parent",
        status: "Hoạt động",
      },
      "create"
    );
  };

  const handleStatusChange = async (accountId, newStatus) => {
    try {
      await crud.update(accountId, { status: newStatus });
    } catch (error) {
      console.error("Error updating account status:", error);
    }
  };

  const handleSaveAccount = async (accountData) => {
    try {
      if (modal.mode === "create") {
        await crud.create(accountData);
      } else if (modal.mode === "edit") {
        await crud.update(accountData.id, accountData);
      }
      modal.close();
    } catch (error) {
      console.error("Error saving account:", error);
    }
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
    total: crud.data.length,
    active: crud.data.filter((a) => a.status === "Hoạt động").length,
    suspended: crud.data.filter((a) => a.status === "Tạm khóa").length,
    managers: crud.data.filter((a) => a.role === "Manager").length,
    nurses: crud.data.filter((a) => a.role === "Nurse").length,
    parents: crud.data.filter((a) => a.role === "Parent").length,
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
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng Tài Khoản</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.active}</h3>
            <p>Đang Hoạt Động</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏸️</div>
          <div className="stat-content">
            <h3>{stats.suspended}</h3>
            <p>Tạm Khóa</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍💼</div>
          <div className="stat-content">
            <h3>{stats.managers}</h3>
            <p>Quản Lý</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👩‍⚕️</div>
          <div className="stat-content">
            <h3>{stats.nurses}</h3>
            <p>Y Tá</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍👩‍👧‍👦</div>
          <div className="stat-content">
            <h3>{stats.parents}</h3>
            <p>Phụ Huynh</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select
            value={filters.role}
            onChange={(e) => updateFilter("role", e.target.value)}
            className="filter-select"
          >
            <option value="">Tất cả vai trò</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="filter-select"
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

      {/* Accounts Table */}
      <div className="table-container">
        <table className="accounts-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>Vai Trò</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((account) => (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td>{account.fullName}</td>
                <td>{account.email}</td>
                <td>
                  <span className={`role-badge ${getRoleClass(account.role)}`}>
                    {account.role}
                  </span>
                </td>
                <td>
                  <select
                    value={account.status}
                    onChange={(e) =>
                      handleStatusChange(account.id, e.target.value)
                    }
                    className={`status-select ${getStatusClass(
                      account.status
                    )}`}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleViewAccount(account)}
                      className="btn btn-view"
                      title="Xem chi tiết"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleEditAccount(account)}
                      className="btn btn-edit"
                      title="Chỉnh sửa"
                    >
                      ✏️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {modal.mode === "view" && "Chi Tiết Tài Khoản"}
                {modal.mode === "edit" && "Chỉnh Sửa Tài Khoản"}
                {modal.mode === "create" && "Tạo Tài Khoản Mới"}
              </h2>
              <button className="modal-close" onClick={modal.close}>
                ✕
              </button>
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveAccount(modal.data);
                }}
              >
                <div className="form-row">
                  <div className="form-group">
                    <label>Họ Tên:</label>
                    <input
                      type="text"
                      value={modal.data?.fullName || ""}
                      onChange={(e) =>
                        modal.updateData({ fullName: e.target.value })
                      }
                      disabled={modal.mode === "view"}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={modal.data?.email || ""}
                      onChange={(e) =>
                        modal.updateData({ email: e.target.value })
                      }
                      disabled={modal.mode === "view"}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Vai Trò:</label>
                    <select
                      value={modal.data?.role || ""}
                      onChange={(e) =>
                        modal.updateData({ role: e.target.value })
                      }
                      disabled={modal.mode === "view"}
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
                    <label>Trạng Thái:</label>
                    <select
                      value={modal.data?.status || ""}
                      onChange={(e) =>
                        modal.updateData({ status: e.target.value })
                      }
                      disabled={modal.mode === "view"}
                      required
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {modal.mode !== "view" && (
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={modal.close}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {modal.mode === "create" ? "Tạo Mới" : "Cập Nhật"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountManagement;
