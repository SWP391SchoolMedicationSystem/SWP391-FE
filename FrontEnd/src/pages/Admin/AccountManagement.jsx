import React, { useState } from "react";
import "../../css/AccountManagement.css";

function AccountManagement() {
  // Mock data for accounts
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      fullName: "Nguyễn Văn An",
      email: "nguyen.van.an@medadmin.com",
      phone: "0901234567",
      role: "Admin",
      status: "Active",
      createdDate: "2024-01-15",
      lastLogin: "2024-03-15 10:30",
    },
    {
      id: 2,
      fullName: "Trần Thị Bình",
      email: "tran.thi.binh@medadmin.com",
      phone: "0912345678",
      role: "Manager",
      status: "Active",
      createdDate: "2024-01-20",
      lastLogin: "2024-03-14 14:20",
    },
    {
      id: 3,
      fullName: "Lê Văn Cường",
      email: "le.van.cuong@medadmin.com",
      phone: "0923456789",
      role: "Nurse",
      status: "Active",
      createdDate: "2024-02-01",
      lastLogin: "2024-03-13 09:15",
    },
    {
      id: 4,
      fullName: "Phạm Thị Dung",
      email: "pham.thi.dung@parent.com",
      phone: "0934567890",
      role: "Parent",
      status: "Inactive",
      createdDate: "2024-02-10",
      lastLogin: "2024-03-10 16:45",
    },
    {
      id: 5,
      fullName: "Hoàng Văn Em",
      email: "hoang.van.em@medadmin.com",
      phone: "0945678901",
      role: "Nurse",
      status: "Active",
      createdDate: "2024-02-15",
      lastLogin: "2024-03-15 08:30",
    },
  ]);

  // Available roles
  const roles = ["Admin", "Manager", "Nurse", "Parent"];
  const statuses = ["Active", "Inactive", "Suspended"];

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add', 'edit'
  const [currentAccount, setCurrentAccount] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Parent",
    status: "Active",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Open modal for adding new account
  const handleAddAccount = () => {
    setModalMode("add");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "Parent",
      status: "Active",
    });
    setCurrentAccount(null);
    setShowModal(true);
  };

  // Open modal for editing account
  const handleEditAccount = (account) => {
    setModalMode("edit");
    setFormData({
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      role: account.role,
      status: account.status,
    });
    setCurrentAccount(account);
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (modalMode === "add") {
      const newAccount = {
        id: accounts.length + 1,
        ...formData,
        createdDate: new Date().toISOString().split("T")[0],
        lastLogin: "Never",
      };
      setAccounts((prev) => [...prev, newAccount]);
    } else if (modalMode === "edit") {
      setAccounts((prev) =>
        prev.map((account) =>
          account.id === currentAccount.id
            ? { ...account, ...formData }
            : account
        )
      );
    }

    setShowModal(false);
  };

  // Handle delete account
  const handleDeleteAccount = (accountId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      setAccounts((prev) => prev.filter((account) => account.id !== accountId));
    }
  };

  // Handle role change directly from table
  const handleRoleChange = (accountId, newRole) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId ? { ...account, role: newRole } : account
      )
    );
  };

  // Handle status change directly from table
  const handleStatusChange = (accountId, newStatus) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === accountId ? { ...account, status: newStatus } : account
      )
    );
  };

  // Filter accounts based on search and filters
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "" || account.role === filterRole;
    const matchesStatus =
      filterStatus === "" || account.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "Admin":
        return "role-admin";
      case "Manager":
        return "role-manager";
      case "Nurse":
        return "role-nurse";
      case "Parent":
        return "role-parent";
      default:
        return "role-default";
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Active":
        return "status-active";
      case "Inactive":
        return "status-inactive";
      case "Suspended":
        return "status-suspended";
      default:
        return "status-default";
    }
  };

  return (
    <div className="account-management-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Account Management</h1>
          <p>Manage user accounts, roles, and permissions</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddAccount}>
          <i className="icon-plus"></i>
          Add New Account
        </button>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
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
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account) => (
              <tr key={account.id}>
                <td className="name-cell">
                  <div className="user-avatar">
                    {account.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span>{account.fullName}</span>
                </td>
                <td>{account.email}</td>
                <td>{account.phone}</td>
                <td>
                  <select
                    value={account.role}
                    onChange={(e) =>
                      handleRoleChange(account.id, e.target.value)
                    }
                    className={`role-select ${getRoleBadgeClass(account.role)}`}
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={account.status}
                    onChange={(e) =>
                      handleStatusChange(account.id, e.target.value)
                    }
                    className={`status-select ${getStatusBadgeClass(
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
                <td>{account.createdDate}</td>
                <td>{account.lastLogin}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-edit"
                      onClick={() => handleEditAccount(account)}
                      title="Edit Account"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDeleteAccount(account.id)}
                      title="Delete Account"
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
            <p>No accounts found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-label">Total Accounts:</span>
          <span className="stat-value">{accounts.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value">
            {accounts.filter((a) => a.status === "Active").length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Admins:</span>
          <span className="stat-value">
            {accounts.filter((a) => a.role === "Admin").length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Managers:</span>
          <span className="stat-value">
            {accounts.filter((a) => a.role === "Manager").length}
          </span>
        </div>
      </div>

      {/* Modal for Add/Edit Account */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalMode === "add" ? "Add New Account" : "Edit Account"}
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="account-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="role">Role *</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === "add" ? "Add Account" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountManagement;
