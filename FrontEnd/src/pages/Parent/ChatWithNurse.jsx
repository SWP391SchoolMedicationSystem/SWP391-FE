import React, { useState } from "react";
import "../../css/Parent/ChatWithNurse.css";

function ChatWithNurse() {
  const [message, setMessage] = useState("");
  const [selectedNurse, setSelectedNurse] = useState("nurse1");

  // Mock data
  const nurses = [
    {
      id: "nurse1",
      name: "Y tá Nguyễn Thị Hoa",
      specialty: "Y tế học đường",
      status: "online",
      avatar: "🩺",
    },
    {
      id: "nurse2",
      name: "Y tá Trần Văn Minh",
      specialty: "Tiêm chủng",
      status: "busy",
      avatar: "💉",
    },
  ];

  const [chatHistory] = useState([
    {
      id: 1,
      sender: "nurse",
      nurseName: "Y tá Nguyễn Thị Hoa",
      message: "Chào bạn! Tôi có thể giúp gì cho con em của bạn?",
      time: "14:30",
      date: "2024-03-15",
    },
    {
      id: 2,
      sender: "parent",
      message:
        "Chào y tá ạ! Con em có biểu hiện ho khan từ 2 ngày nay, có cần đưa con đến khám không ạ?",
      time: "14:32",
      date: "2024-03-15",
    },
    {
      id: 3,
      sender: "nurse",
      nurseName: "Y tá Nguyễn Thị Hoa",
      message:
        "Con có sốt không ạ? Và ho có đờm hay ho khan? Phụ huynh có thể mô tả thêm về triệu chứng không?",
      time: "14:35",
      date: "2024-03-15",
    },
    {
      id: 4,
      sender: "parent",
      message:
        "Con không sốt ạ, chỉ ho khan thôi. Đặc biệt là vào buổi tối và sáng sớm. Con vẫn ăn uống bình thường.",
      time: "14:38",
      date: "2024-03-15",
    },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage("");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      online: "#28a745",
      busy: "#ffc107",
      offline: "#6c757d",
    };
    return colors[status] || "#6c757d";
  };

  const getStatusText = (status) => {
    const texts = {
      online: "Đang online",
      busy: "Đang bận",
      offline: "Offline",
    };
    return texts[status] || status;
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>💬 Chat Với Y Tá</h1>
          <p>Trao đổi trực tiếp với đội ngũ y tế trường</p>
        </div>
      </div>

      <div className="chat-layout">
        {/* Nurse List Sidebar */}
        <div className="nurses-sidebar">
          <h3>👩‍⚕️ Đội ngũ y tế</h3>
          <div className="nurses-list">
            {nurses.map((nurse) => (
              <div
                key={nurse.id}
                className={`nurse-item ${
                  selectedNurse === nurse.id ? "active" : ""
                }`}
                onClick={() => setSelectedNurse(nurse.id)}
              >
                <div className="nurse-avatar">{nurse.avatar}</div>
                <div className="nurse-info">
                  <h4>{nurse.name}</h4>
                  <p>{nurse.specialty}</p>
                  <span
                    className="nurse-status"
                    style={{ color: getStatusColor(nurse.status) }}
                  >
                    ● {getStatusText(nurse.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h4>⚡ Thao tác nhanh</h4>
            <button className="quick-btn emergency">🚨 Khẩn cấp</button>
            <button className="quick-btn appointment">📅 Đặt lịch hẹn</button>
            <button className="quick-btn health-tips">
              💡 Lời khuyên sức khỏe
            </button>
          </div>
        </div>

        {/* Chat Main Area */}
        <div className="chat-main">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="current-nurse">
              <div className="nurse-avatar">
                {nurses.find((n) => n.id === selectedNurse)?.avatar}
              </div>
              <div className="nurse-details">
                <h3>{nurses.find((n) => n.id === selectedNurse)?.name}</h3>
                <span
                  className="status"
                  style={{
                    color: getStatusColor(
                      nurses.find((n) => n.id === selectedNurse)?.status
                    ),
                  }}
                >
                  ●{" "}
                  {getStatusText(
                    nurses.find((n) => n.id === selectedNurse)?.status
                  )}
                </span>
              </div>
            </div>
            <div className="chat-actions">
              <button className="action-btn">📞 Gọi điện</button>
              <button className="action-btn">📧 Email</button>
              <button className="action-btn">⚙️ Cài đặt</button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`message ${
                  msg.sender === "parent" ? "sent" : "received"
                }`}
              >
                {msg.sender === "nurse" && (
                  <div className="message-sender">
                    <span className="sender-avatar">👩‍⚕️</span>
                    <span className="sender-name">{msg.nurseName}</span>
                  </div>
                )}
                <div className="message-content">
                  <p>{msg.message}</p>
                  <span className="message-time">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="chat-input">
            <div className="input-group">
              <button type="button" className="attachment-btn">
                📎
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="message-input"
              />
              <button type="button" className="emoji-btn">
                😊
              </button>
              <button type="submit" className="send-btn">
                ➤ Gửi
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Chat Guidelines */}
      <div className="chat-guidelines">
        <h3>📋 Hướng dẫn sử dụng</h3>
        <div className="guidelines-content">
          <div className="guideline-item">
            <span className="guideline-icon">⏰</span>
            <div>
              <strong>Thời gian phản hồi:</strong>
              <p>Y tá sẽ phản hồi trong vòng 15-30 phút trong giờ hành chính</p>
            </div>
          </div>
          <div className="guideline-item">
            <span className="guideline-icon">🚨</span>
            <div>
              <strong>Trường hợp khẩn cấp:</strong>
              <p>
                Vui lòng gọi hotline 1900-1234 hoặc đến phòng y tế trực tiếp
              </p>
            </div>
          </div>
          <div className="guideline-item">
            <span className="guideline-icon">🔒</span>
            <div>
              <strong>Bảo mật thông tin:</strong>
              <p>Thông tin y tế được bảo mật theo quy định của trường</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatWithNurse;
