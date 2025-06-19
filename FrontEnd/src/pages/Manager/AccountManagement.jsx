import React, { useState, useEffect } from "react";
import { useManagerAccounts } from "../../utils/hooks/useManager";
import Modal from "../../components/common/Modal";
import "../../css/Manager/AccountManagement.css";

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

  const [activeTab, setActiveTab] = useState("parents");
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
    if (accountType === "parent") return true;
    if (accountType === "staff") {
      // Manager can only edit Nurse accounts (roleid = 3), not Admin (1) or Manager (2)
      return account.roleid === 3;
    }
    return false;
  };

  // Handle edit account
  const handleEditAccount = (account, accountType) => {
    if (!canEditAccount(account, accountType)) {
      alert("You do not have permission to edit this account.");
      return;
    }

    setEditingAccount({ ...account, accountType });

    if (accountType === "parent") {
      setEditFormData({
        parentid: account.parentid,
        fullname: account.fullname || "",
        email: account.email || "",
        phone: account.phone || "",
        address: account.address || "",
      });
    } else {
      setEditFormData({
        staffid: account.staffid,
        fullname: account.fullname || "",
        email: account.email || "",
        phone: account.phone || "",
        roleid: account.roleid || 3,
      });
    }

    setShowEditModal(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      if (editingAccount.accountType === "parent") {
        await updateParent(editFormData);
      } else {
        await updateStaff(editFormData);
      }

      setShowEditModal(false);
      setEditingAccount(null);
      setEditFormData({});

      // Show success message
      alert("Account updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update account. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Get account status display
  const getAccountStatus = (account) => {
    if (account.isDeleted) return "Inactive";
    return "Active";
  };

  // Get status badge class
  const getStatusBadgeClass = (account) => {
    if (account.isDeleted) return "status-inactive";
    return "status-active";
  };

  // Check if status can be toggled
  const canToggleStatus = (account, accountType) => {
    if (accountType === "parent") return true;
    if (accountType === "staff") {
      // Manager can toggle status for Nurse accounts only, not Admin/Manager
      return account.roleid === 3;
    }
    return false;
  };

  // Handle toggle status
  const handleToggleStatus = async (account, accountType) => {
    if (!canToggleStatus(account, accountType)) {
      alert("You do not have permission to change the status of this account.");
      return;
    }

    const action = account.isDeleted ? "activate" : "deactivate";
    const confirmMessage = `Are you sure you want to ${action} ${account.fullname}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      if (accountType === "parent") {
        await toggleParentStatus(account.parentid);
      } else {
        await toggleStaffStatus(account.staffid);
      }

      alert(`Account ${action}d successfully!`);
    } catch (error) {
      console.error("Toggle status failed:", error);
      alert(`Failed to ${action} account. Please try again.`);
    }
  };

  // Render parent form fields
  const renderParentForm = () => (
    <>
      <div className="form-group">
        <label htmlFor="fullname">Full Name:</label>
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
        <label htmlFor="phone">Phone:</label>
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
        <label htmlFor="address">Address:</label>
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
        <label htmlFor="fullname">Full Name:</label>
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
        <label htmlFor="phone">Phone:</label>
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
        <label htmlFor="roleid">Role:</label>
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
            style={{ color: "#e74c3c", marginTop: "5px", display: "block" }}
          >
            Role cannot be changed for Admin/Manager accounts
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
          <p>⏳ Loading accounts...</p>
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
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="account-management">
      <div className="page-header">
        <h1>👥 Account Management</h1>
        <p>Manage parent and staff accounts</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === "parents" ? "active" : ""}`}
          onClick={() => setActiveTab("parents")}
        >
          👨‍👩‍👧‍👦 Parents ({parentsList.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "staff" ? "active" : ""}`}
          onClick={() => setActiveTab("staff")}
        >
          👩‍💼 Staff ({staffList.length})
        </button>
      </div>

      {/* Parents Tab */}
      {activeTab === "parents" && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Parent Accounts</h2>
            <button onClick={() => fetchAllAccounts()} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>

          {parentsList.length === 0 ? (
            <div className="empty-state">
              <p>📭 No parent accounts found</p>
            </div>
          ) : (
            <div className="accounts-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parentsList.map((parent) => (
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
                          onClick={() => handleToggleStatus(parent, "parent")}
                          title={`Click to ${
                            parent.isDeleted ? "activate" : "deactivate"
                          } account`}
                        >
                          {getAccountStatus(parent)}
                        </button>
                      </td>
                      <td>
                        {parent.createdDate
                          ? new Date(parent.createdDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="actions">
                        <button
                          onClick={() => handleEditAccount(parent, "parent")}
                          className="edit-btn"
                          title="Edit Parent"
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
      {activeTab === "staff" && (
        <div className="tab-content">
          <div className="section-header">
            <h2>Staff Accounts</h2>
            <button onClick={() => fetchAllAccounts()} className="refresh-btn">
              🔄 Refresh
            </button>
          </div>

          {staffList.length === 0 ? (
            <div className="empty-state">
              <p>📭 No staff accounts found</p>
            </div>
          ) : (
            <div className="accounts-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr key={staff.staffid}>
                      <td>{staff.staffid}</td>
                      <td>{staff.fullname}</td>
                      <td>{staff.email}</td>
                      <td>{staff.phone}</td>
                      <td>
                        <span className={`role-badge role-${staff.roleid}`}>
                          {staff.roleid === 1
                            ? "Admin"
                            : staff.roleid === 2
                            ? "Manager"
                            : "Nurse"}
                        </span>
                      </td>
                      <td>
                        {canToggleStatus(staff, "staff") ? (
                          <button
                            className={`status-toggle ${getStatusBadgeClass(
                              staff
                            )}`}
                            onClick={() => handleToggleStatus(staff, "staff")}
                            title={`Click to ${
                              staff.isDeleted ? "activate" : "deactivate"
                            } account`}
                          >
                            {getAccountStatus(staff)}
                          </button>
                        ) : (
                          <span
                            className={`status-badge ${getStatusBadgeClass(
                              staff
                            )}`}
                            title="Status cannot be changed for Admin/Manager accounts"
                          >
                            {getAccountStatus(staff)}
                          </span>
                        )}
                      </td>
                      <td>
                        {staff.createdAt
                          ? new Date(staff.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="actions">
                        {canEditAccount(staff, "staff") ? (
                          <button
                            onClick={() => handleEditAccount(staff, "staff")}
                            className="edit-btn"
                            title="Edit Staff"
                          >
                            ✏️
                          </button>
                        ) : (
                          <span
                            className="view-only-badge"
                            title="View Only - No Edit Permission"
                          >
                            👁️ View Only
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
          title={`Edit ${
            editingAccount?.accountType === "parent" ? "Parent" : "Staff"
          } Account`}
        >
          <form onSubmit={handleSubmit} className="edit-form">
            {editingAccount?.accountType === "parent"
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
                Cancel
              </button>
              <button
                type="submit"
                className="save-btn"
                disabled={submitLoading}
              >
                {submitLoading ? "⏳ Saving..." : "💾 Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AccountManagement;
