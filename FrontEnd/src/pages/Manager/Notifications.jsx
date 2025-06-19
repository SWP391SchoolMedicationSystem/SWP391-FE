import React, { useState, useEffect } from "react";
import { useManagerNotifications } from "../../utils/hooks/useManager";
import Modal from "../../components/common/Modal";
import "../../css/Manager/Notifications.css";

const Notifications = () => {
  const {
    notifications,
    loading,
    error,
    fetchNotifications,
    createNotificationForParents,
    createNotificationForStaff,
    refetch,
  } = useManagerNotifications();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notificationType, setNotificationType] = useState("parent"); // 'parent' or 'staff'
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "general",
  });

  // Load notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle create notification
  const handleCreateNotification = () => {
    setFormData({
      title: "",
      message: "",
      type: "general",
    });
    setNotificationType("parent");
    setShowCreateModal(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      // Multiple DTO options to try - uncomment one at a time

      // Option 1: Minimal lowercase
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
      };

      // Option 2: PascalCase (uncomment if option 1 fails)
      // const notificationData = {
      //   Title: formData.title,
      //   Message: formData.message,
      //   Type: formData.type
      // };

      // Option 3: With content field (uncomment if option 1 fails)
      // const notificationData = {
      //   title: formData.title,
      //   content: formData.message,
      //   type: formData.type
      // };

      // Option 4: Full DTO (uncomment if option 1 fails)
      // const notificationData = {
      //   title: formData.title,
      //   message: formData.message,
      //   type: formData.type,
      //   isDeleted: false,
      //   createdBy: "Manager",
      //   createdDate: new Date().toISOString()
      // };

      console.log("Sending notification data:", notificationData);
      console.log("Notification type:", notificationType);

      if (notificationType === "parent") {
        console.log("Calling createNotificationForParents...");
        await createNotificationForParents(notificationData);
      } else {
        console.log("Calling createNotificationForStaff...");
        await createNotificationForStaff(notificationData);
      }

      setShowCreateModal(false);
      setFormData({
        title: "",
        message: "",
        type: "general",
      });

      alert(`Notification sent to ${notificationType}s successfully!`);
    } catch (error) {
      console.error("Create notification failed:", error);
      console.error("Error details:", error.response?.data);

      // Better error handling
      let errorMessage = "Failed to create notification. ";
      if (error.response?.status === 500) {
        errorMessage +=
          "This appears to be a server issue. Please contact the backend team.";
      } else if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else {
        errorMessage += "Please try again later.";
      }

      alert(errorMessage);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Get notification type badge
  const getTypeBadge = (type) => {
    const typeMap = {
      general: { label: "General", class: "type-general" },
      health: { label: "Health", class: "type-health" },
      event: { label: "Event", class: "type-event" },
      emergency: { label: "Emergency", class: "type-emergency" },
      reminder: { label: "Reminder", class: "type-reminder" },
    };

    const typeInfo = typeMap[type] || typeMap.general;
    return (
      <span className={`type-badge ${typeInfo.class}`}>{typeInfo.label}</span>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="notifications-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>⏳ Loading notifications...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="notifications-page">
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
    <div className="notifications-page">
      <div className="page-header">
        <div className="header-content">
          <h1>📢 Notifications Management</h1>
          <p>Create and manage notifications for parents and staff</p>
        </div>
        <button onClick={handleCreateNotification} className="create-btn">
          ➕ Create Notification
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">📨</div>
          <div className="stat-content">
            <h3>{notifications.length}</h3>
            <p>Total Notifications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👨‍👩‍👧‍👦</div>
          <div className="stat-content">
            <h3>
              {notifications.filter((n) => n.targetType === "parent").length}
            </h3>
            <p>Parent Notifications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👩‍💼</div>
          <div className="stat-content">
            <h3>
              {notifications.filter((n) => n.targetType === "staff").length}
            </h3>
            <p>Staff Notifications</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🆕</div>
          <div className="stat-content">
            <h3>
              {
                notifications.filter((n) => {
                  const today = new Date().toDateString();
                  return new Date(n.createdAt).toDateString() === today;
                }).length
              }
            </h3>
            <p>Today's Notifications</p>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-section">
        <div className="section-header">
          <h2>Recent Notifications</h2>
          <button onClick={fetchNotifications} className="refresh-btn">
            🔄 Refresh
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No notifications yet</h3>
            <p>Create your first notification to get started</p>
            <button onClick={handleCreateNotification} className="create-btn">
              ➕ Create Notification
            </button>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification, index) => (
              <div key={notification.id || index} className="notification-card">
                <div className="notification-header">
                  <div className="notification-title">
                    <h3>{notification.title}</h3>
                    {getTypeBadge(notification.type)}
                  </div>
                  <div className="notification-meta">
                    <span className="notification-date">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`target-badge target-${
                        notification.targetType || "unknown"
                      }`}
                    >
                      {notification.targetType === "parent"
                        ? "👨‍👩‍👧‍👦 Parents"
                        : "👩‍💼 Staff"}
                    </span>
                  </div>
                </div>
                <div className="notification-content">
                  <p>{notification.message}</p>
                </div>
                <div className="notification-footer">
                  <span className="created-by">
                    Created by: {notification.createdby || "Manager"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setFormData({
              title: "",
              message: "",
              type: "general",
            });
          }}
          title="Create New Notification"
        >
          <form onSubmit={handleSubmit} className="notification-form">
            {/* Target Selection */}
            <div className="form-group">
              <label htmlFor="target">Send To:</label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="target"
                    value="parent"
                    checked={notificationType === "parent"}
                    onChange={(e) => setNotificationType(e.target.value)}
                  />
                  <span className="radio-label">👨‍👩‍👧‍👦 All Parents</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="target"
                    value="staff"
                    checked={notificationType === "staff"}
                    onChange={(e) => setNotificationType(e.target.value)}
                  />
                  <span className="radio-label">👩‍💼 All Staff</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter notification title"
                required
                maxLength={100}
              />
            </div>

            {/* Type */}
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
              >
                <option value="general">📋 General</option>
                <option value="health">🏥 Health</option>
                <option value="event">📅 Event</option>
                <option value="emergency">🚨 Emergency</option>
                <option value="reminder">⏰ Reminder</option>
              </select>
            </div>

            {/* Message */}
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter your notification message here..."
                rows="5"
                required
                maxLength={500}
              />
              <small className="char-count">
                {formData.message.length}/500 characters
              </small>
            </div>

            {/* Preview */}
            {(formData.title || formData.message) && (
              <div className="notification-preview">
                <h4>Preview:</h4>
                <div className="preview-card">
                  <div className="preview-header">
                    <strong>{formData.title || "Notification Title"}</strong>
                    {getTypeBadge(formData.type)}
                  </div>
                  <div className="preview-content">
                    {formData.message ||
                      "Your notification message will appear here..."}
                  </div>
                  <div className="preview-footer">
                    <small>
                      To:{" "}
                      {notificationType === "parent"
                        ? "All Parents"
                        : "All Staff"}
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setFormData({
                    title: "",
                    message: "",
                    type: "general",
                  });
                }}
                className="cancel-btn"
                disabled={submitLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="send-btn"
                disabled={submitLoading || !formData.title || !formData.message}
              >
                {submitLoading ? "⏳ Sending..." : "📤 Send Notification"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Notifications;
