import React, { useState } from "react";
import "../../css/Nurse/ChatWithParents.css";

function ChatWithParents() {
  // Mock data for parent contacts
  const [parentContacts] = useState([
    {
      id: 1,
      studentId: "MN001",
      studentName: "Nguyễn Văn An",
      className: "Mầm",
      parentName: "Nguyễn Thị Hoa",
      parentPhone: "0912345678",
      zaloConnected: true,
      lastMessage: "Cảm ơn cô đã chăm sóc con",
      lastMessageTime: "2024-03-20 14:30",
      unreadCount: 0,
      connectionDate: "2024-01-15",
      status: "Hoạt động",
    },
    {
      id: 2,
      studentId: "MN003",
      studentName: "Lê Minh Cường",
      className: "Lá 1",
      parentName: "Lê Thị Mai",
      parentPhone: "0934567890",
      zaloConnected: true,
      lastMessage: "Con hôm nay có uống thuốc chưa ạ?",
      lastMessageTime: "2024-03-20 16:45",
      unreadCount: 2,
      connectionDate: "2024-01-20",
      status: "Hoạt động",
    },
    {
      id: 3,
      studentId: "MN005",
      studentName: "Hoàng Văn Em",
      className: "Lá 3",
      parentName: "Hoàng Thị Lan",
      parentPhone: "0956789012",
      zaloConnected: true,
      lastMessage: "Tình trạng dị ứng của con thế nào rồi ạ?",
      lastMessageTime: "2024-03-19 18:20",
      unreadCount: 1,
      connectionDate: "2024-02-01",
      status: "Hoạt động",
    },
    {
      id: 4,
      studentId: "MN002",
      studentName: "Trần Thị Bình",
      className: "Chồi",
      parentName: "Trần Văn Nam",
      parentPhone: "0923456789",
      zaloConnected: false,
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      connectionDate: null,
      status: "Chưa kết nối",
    },
    {
      id: 5,
      studentId: "MN004",
      studentName: "Phạm Thị Diệu",
      className: "Lá 2",
      parentName: "Phạm Văn Hùng",
      parentPhone: "0945678901",
      zaloConnected: false,
      lastMessage: null,
      lastMessageTime: null,
      unreadCount: 0,
      connectionDate: null,
      status: "Chưa kết nối",
    },
    {
      id: 6,
      studentId: "MN006",
      studentName: "Võ Thị Phượng",
      className: "Chồi",
      parentName: "Võ Văn Giang",
      parentPhone: "0967890123",
      zaloConnected: true,
      lastMessage: "Con hôm nay ăn uống thế nào ạ?",
      lastMessageTime: "2024-03-20 11:15",
      unreadCount: 0,
      connectionDate: "2024-02-10",
      status: "Hoạt động",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Mock chat messages
  const [chatMessages] = useState([
    {
      id: 1,
      sender: "parent",
      message: "Xin chào cô, con hôm nay có bị sốt không ạ?",
      time: "2024-03-20 14:20",
    },
    {
      id: 2,
      sender: "nurse",
      message: "Chào chị, con không bị sốt đâu ạ. Con ăn uống bình thường.",
      time: "2024-03-20 14:25",
    },
    {
      id: 3,
      sender: "parent",
      message: "Cảm ơn cô đã chăm sóc con",
      time: "2024-03-20 14:30",
    },
  ]);

  // Available options
  const classes = ["Mầm", "Chồi", "Lá 1", "Lá 2", "Lá 3"];
  const statuses = ["Hoạt động", "Chưa kết nối"];

  // Filter contacts
  const filteredContacts = parentContacts.filter((contact) => {
    const matchesSearch =
      contact.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.parentPhone.includes(searchTerm) ||
      contact.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" || contact.status === filterStatus;
    const matchesClass =
      filterClass === "" || contact.className === filterClass;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
  };

  const handleOpenChat = (contact) => {
    setSelectedContact(contact);
    setShowChatModal(true);
  };

  const handleSendSMS = (contact) => {
    alert(
      `Đã mở ứng dụng SMS để gửi tin nhắn cho ${contact.parentName} (${contact.parentPhone})`
    );
  };

  const handleOpenZalo = (contact) => {
    if (contact.zaloConnected) {
      setSelectedContact(contact);
      setShowChatModal(true);
    } else {
      alert("Phụ huynh chưa kết nối Zalo");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Hoạt động":
        return "status-active";
      case "Chưa kết nối":
        return "status-inactive";
      default:
        return "status-inactive";
    }
  };

  const getClassBadgeColor = (className) => {
    const colors = {
      Mầm: "badge-mam",
      Chồi: "badge-choi",
      "Lá 1": "badge-la1",
      "Lá 2": "badge-la2",
      "Lá 3": "badge-la3",
    };
    return colors[className] || "badge-default";
  };

  // Statistics
  const stats = {
    total: parentContacts.length,
    connected: parentContacts.filter((c) => c.zaloConnected).length,
    unconnected: parentContacts.filter((c) => !c.zaloConnected).length,
    totalUnread: parentContacts.reduce(
      (sum, contact) => sum + contact.unreadCount,
      0
    ),
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>💬 Chat Với Phụ Huynh</h1>
        <p>Quản lý liên lạc với phụ huynh qua SMS và Zalo</p>
      </div>

      {/* Statistics */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Tổng phụ huynh</p>
          </div>
        </div>
        <div className="stat-card connected">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>{stats.connected}</h3>
            <p>Đã kết nối Zalo</p>
          </div>
        </div>
        <div className="stat-card unconnected">
          <div className="stat-icon">📵</div>
          <div className="stat-content">
            <h3>{stats.unconnected}</h3>
            <p>Chưa kết nối</p>
          </div>
        </div>
        <div className="stat-card unread">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <h3>{stats.totalUnread}</h3>
            <p>Tin nhắn chưa đọc</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls-container">
        <div className="search-controls">
          <input
            type="text"
            placeholder="Tìm kiếm phụ huynh, học sinh, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Tất cả trạng thái</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="filter-select"
          >
            <option value="">Tất cả lớp</option>
            {classes.map((className) => (
              <option key={className} value={className}>
                {className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contacts List */}
      <div className="contacts-list">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact-card ${
              !contact.zaloConnected ? "inactive" : ""
            }`}
          >
            <div className="contact-header">
              <div className="contact-info">
                <div className="contact-main">
                  <h4>{contact.parentName}</h4>
                  <span className="phone">{contact.parentPhone}</span>
                </div>
                <div className="contact-meta">
                  <span
                    className={`class-badge ${getClassBadgeColor(
                      contact.className
                    )}`}
                  >
                    {contact.className}
                  </span>
                  <span
                    className={`status-badge ${getStatusClass(contact.status)}`}
                  >
                    {contact.status}
                  </span>
                  {contact.unreadCount > 0 && (
                    <span className="unread-badge">{contact.unreadCount}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="contact-body">
              <div className="student-info">
                <span className="student-id">{contact.studentId}</span>
                <span className="student-name">{contact.studentName}</span>
              </div>

              {contact.lastMessage && (
                <div className="last-message">
                  <p>{contact.lastMessage}</p>
                  <small>{contact.lastMessageTime}</small>
                </div>
              )}

              {contact.zaloConnected && contact.connectionDate && (
                <div className="connection-info">
                  <small>Kết nối từ: {contact.connectionDate}</small>
                </div>
              )}
            </div>

            <div className="contact-actions">
              <button
                className="btn-info"
                onClick={() => handleViewContact(contact)}
                title="Xem thông tin"
              >
                ℹ️
              </button>
              <button
                className="btn-sms"
                onClick={() => handleSendSMS(contact)}
                title="Gửi SMS"
              >
                📱
              </button>
              <button
                className={`btn-zalo ${
                  !contact.zaloConnected ? "disabled" : ""
                }`}
                onClick={() => handleOpenZalo(contact)}
                title={
                  contact.zaloConnected ? "Chat Zalo" : "Chưa kết nối Zalo"
                }
                disabled={!contact.zaloConnected}
              >
                💬
              </button>
            </div>
          </div>
        ))}

        {filteredContacts.length === 0 && (
          <div className="no-data">
            <p>Không tìm thấy liên hệ nào</p>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      {showContactModal && selectedContact && (
        <div
          className="modal-overlay"
          onClick={() => setShowContactModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thông tin liên hệ - {selectedContact.parentName}</h3>
              <button
                className="modal-close"
                onClick={() => setShowContactModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="contact-detail-grid">
                <div className="detail-item">
                  <label>Tên phụ huynh:</label>
                  <span>{selectedContact.parentName}</span>
                </div>
                <div className="detail-item">
                  <label>Số điện thoại:</label>
                  <span>{selectedContact.parentPhone}</span>
                </div>
                <div className="detail-item">
                  <label>Học sinh:</label>
                  <span>{selectedContact.studentName}</span>
                </div>
                <div className="detail-item">
                  <label>Mã học sinh:</label>
                  <span>{selectedContact.studentId}</span>
                </div>
                <div className="detail-item">
                  <label>Lớp:</label>
                  <span>{selectedContact.className}</span>
                </div>
                <div className="detail-item">
                  <label>Trạng thái Zalo:</label>
                  <span
                    className={`status-badge ${getStatusClass(
                      selectedContact.status
                    )}`}
                  >
                    {selectedContact.zaloConnected
                      ? "Đã kết nối"
                      : "Chưa kết nối"}
                  </span>
                </div>
                {selectedContact.connectionDate && (
                  <div className="detail-item">
                    <label>Ngày kết nối:</label>
                    <span>{selectedContact.connectionDate}</span>
                  </div>
                )}
                {selectedContact.lastMessage && (
                  <>
                    <div className="detail-item">
                      <label>Tin nhắn cuối:</label>
                      <span>{selectedContact.lastMessage}</span>
                    </div>
                    <div className="detail-item">
                      <label>Thời gian:</label>
                      <span>{selectedContact.lastMessageTime}</span>
                    </div>
                  </>
                )}
                {selectedContact.unreadCount > 0 && (
                  <div className="detail-item">
                    <label>Tin nhắn chưa đọc:</label>
                    <span className="unread-count">
                      {selectedContact.unreadCount}
                    </span>
                  </div>
                )}
              </div>

              <div className="contact-actions-modal">
                <button
                  className="btn-sms-modal"
                  onClick={() => handleSendSMS(selectedContact)}
                >
                  📱 Gửi SMS
                </button>
                {selectedContact.zaloConnected && (
                  <button
                    className="btn-zalo-modal"
                    onClick={() => handleOpenChat(selectedContact)}
                  >
                    💬 Mở Zalo Chat
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedContact && (
        <div className="modal-overlay" onClick={() => setShowChatModal(false)}>
          <div
            className="modal-content large"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>💬 Chat với {selectedContact.parentName}</h3>
              <button
                className="modal-close"
                onClick={() => setShowChatModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="chat-interface">
                <div className="chat-messages">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${
                        message.sender === "nurse"
                          ? "message-sent"
                          : "message-received"
                      }`}
                    >
                      <div className="message-content">
                        <p>{message.message}</p>
                        <small>{message.time}</small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="chat-input">
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="message-input"
                  />
                  <button className="send-button">Gửi</button>
                </div>
              </div>

              <div className="chat-note">
                <p>
                  <strong>Lưu ý:</strong> Đây là giao diện mô phỏng. Trên thực
                  tế sẽ tích hợp với API Zalo để gửi/nhận tin nhắn.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatWithParents;
