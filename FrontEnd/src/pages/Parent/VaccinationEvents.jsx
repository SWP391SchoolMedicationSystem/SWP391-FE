import { useState, useEffect } from "react";
import "../../css/Parent/VaccinationEvents.css";
import { vaccinationEventService } from "../../services/vaccinationService";

function VaccinationEvents() {
  // States for events management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch vaccination events on component mount
  useEffect(() => {
    fetchVaccinationEvents();
  }, []);

  // Fetch all vaccination events with parent responses
  const fetchVaccinationEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await vaccinationEventService.getMyResponses();
      setEvents(response);
    } catch (error) {
      console.error("Error fetching vaccination events:", error);
      setError("Không thể tải danh sách sự kiện tiêm chủng");
    } finally {
      setLoading(false);
    }
  };

  // Handle view event details
  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  // Get status badge class
  const getStatusBadgeClass = (event) => {
    const eventDate = new Date(event.eventDate);
    const today = new Date();

    if (eventDate < today) return "status-completed";
    return "status-upcoming";
  };

  // Get status text
  const getStatusText = (event) => {
    const eventDate = new Date(event.eventDate);
    const today = new Date();

    if (eventDate < today) return "Đã hoàn thành";
    return "Sắp diễn ra";
  };

  // Get response badge class
  const getResponseBadgeClass = (responseStatus) => {
    if (responseStatus.includes("đồng ý (tất cả)")) return "response-confirmed";
    if (responseStatus.includes("từ chối (tất cả)")) return "response-declined";
    if (responseStatus.includes("Đã phản hồi")) return "response-mixed";
    if (responseStatus === "Đã đồng ý") return "response-confirmed";
    if (responseStatus === "Đã từ chối") return "response-declined";
    return "response-pending";
  };

  // Get overall statistics for all children
  const getOverallStats = () => {
    const totalEvents = events.length;
    const totalChildren = events.reduce(
      (sum, event) => sum + (event.totalChildren || 0),
      0
    );
    const confirmedChildren = events.reduce(
      (sum, event) => sum + (event.confirmedChildren || 0),
      0
    );
    const declinedChildren = events.reduce(
      (sum, event) => sum + (event.declinedChildren || 0),
      0
    );
    const pendingChildren = events.reduce(
      (sum, event) => sum + (event.pendingChildren || 0),
      0
    );

    return {
      totalEvents,
      totalChildren,
      confirmedChildren,
      declinedChildren,
      pendingChildren,
    };
  };

  if (loading) {
    return (
      <div className="vaccination-events-container">
        <div className="loading-state">
          <p>⏳ Đang tải danh sách sự kiện tiêm chủng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vaccination-events-container">
        <div className="error-state">
          <p>❌ {error}</p>
          <button onClick={fetchVaccinationEvents} className="retry-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vaccination-events-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>💉 Thông Tin Tiêm Chủng</h1>
          <p>Xem thông tin các đợt tiêm vaccine cho con em</p>
        </div>
        <div className="header-actions">
          <button onClick={fetchVaccinationEvents} className="refresh-btn">
            🔄 Tải lại
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{getOverallStats().totalEvents}</h3>
            <p>Tổng sự kiện</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👶</div>
          <div className="stat-content">
            <h3>{getOverallStats().totalChildren}</h3>
            <p>Tổng lượt tiêm</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{getOverallStats().confirmedChildren}</h3>
            <p>Đã đồng ý</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">❌</div>
          <div className="stat-content">
            <h3>{getOverallStats().declinedChildren}</h3>
            <p>Đã từ chối</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{getOverallStats().pendingChildren}</h3>
            <p>Chưa phản hồi</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="events-section">
        <h2>📋 Lịch tiêm chủng</h2>

        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="card-header">
                  <div className="event-title">
                    <h3>{event.title}</h3>
                    <div className="status-badges">
                      <span
                        className={`status-badge ${getStatusBadgeClass(event)}`}
                      >
                        {getStatusText(event)}
                      </span>
                      <span
                        className={`response-badge ${getResponseBadgeClass(
                          event.responseStatus
                        )}`}
                      >
                        {event.responseStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="event-info">
                    <div className="info-row">
                      <span className="label">📅 Ngày tiêm:</span>
                      <span className="value">{event.eventDate}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">📍 Địa điểm:</span>
                      <span className="value">{event.location}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">👶 Số con tham gia:</span>
                      <span className="value">{event.totalChildren || 0}</span>
                    </div>
                    {event.totalChildren > 0 && (
                      <div className="info-row">
                        <span className="label">📊 Trạng thái chi tiết:</span>
                        <span className="value">
                          ✅ {event.confirmedChildren} • ❌{" "}
                          {event.declinedChildren} • ⏳ {event.pendingChildren}
                        </span>
                      </div>
                    )}
                  </div>

                  {event.description && (
                    <div className="event-description">
                      <p>{event.description}</p>
                    </div>
                  )}

                  {/* Display individual child responses if any */}
                  {event.myResponses && event.myResponses.length > 0 && (
                    <div className="children-responses">
                      <h5>👨‍👩‍👧‍👦 Phản hồi từng con:</h5>
                      <div className="children-list">
                        {Object.entries(event.responsesByStudent || {}).map(
                          ([studentId, responses]) => (
                            <div key={studentId} className="child-response">
                              {responses.map((response, index) => (
                                <div key={index} className="response-item">
                                  <span className="student-info">
                                    Con #{studentId}
                                  </span>
                                  <span
                                    className={`status-badge ${response.statusClass}`}
                                  >
                                    {response.status}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button
                    className="view-btn"
                    onClick={() => handleViewDetails(event)}
                  >
                    👁️ Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <div className="no-events-icon">💉</div>
            <p>Chưa có sự kiện tiêm chủng nào</p>
            <small>Liên hệ nhà trường để biết thêm thông tin</small>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔍 Chi Tiết Sự Kiện Tiêm Chủng</h3>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h4>📋 Thông tin cơ bản</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Tiêu đề:</span>
                    <span className="detail-value">{selectedEvent.title}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ngày tiêm:</span>
                    <span className="detail-value">
                      {selectedEvent.eventDate}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Địa điểm:</span>
                    <span className="detail-value">
                      {selectedEvent.location}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Trạng thái sự kiện:</span>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        selectedEvent
                      )}`}
                    >
                      {getStatusText(selectedEvent)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tổng số con tham gia:</span>
                    <span className="detail-value">
                      {selectedEvent.totalChildren || 0}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phản hồi tổng quan:</span>
                    <span
                      className={`response-badge ${getResponseBadgeClass(
                        selectedEvent.responseStatus
                      )}`}
                    >
                      {selectedEvent.responseStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Children Responses Detail */}
              {selectedEvent.myResponses &&
                selectedEvent.myResponses.length > 0 && (
                  <div className="detail-section">
                    <h4>👨‍👩‍👧‍👦 Chi tiết phản hồi từng con</h4>
                    <div className="children-responses-detail">
                      {Object.entries(
                        selectedEvent.responsesByStudent || {}
                      ).map(([studentId, responses]) => (
                        <div key={studentId} className="child-detail-card">
                          <h5>Con #{studentId}</h5>
                          {responses.map((response, index) => (
                            <div key={index} className="response-detail">
                              <div className="response-status">
                                <span className="label">Trạng thái:</span>
                                <span
                                  className={`status-badge ${response.statusClass}`}
                                >
                                  {response.status}
                                </span>
                              </div>
                              <div className="response-consent">
                                <span className="label">
                                  Đồng ý của phụ huynh:
                                </span>
                                <span
                                  className={`status-badge ${
                                    response.parentConsent
                                      ? "status-confirmed"
                                      : "status-declined"
                                  }`}
                                >
                                  {response.parentConsent
                                    ? "Đã đồng ý"
                                    : "Chưa đồng ý"}
                                </span>
                              </div>
                              {response.willAttend === false &&
                                response.reasonForDecline && (
                                  <div className="response-reason">
                                    <span className="label">
                                      Lý do từ chối:
                                    </span>
                                    <div className="decline-reason-content">
                                      <p>{response.reasonForDecline}</p>
                                    </div>
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedEvent.description && (
                <div className="detail-section">
                  <h4>📝 Mô tả</h4>
                  <div className="description-content">
                    <p>{selectedEvent.description}</p>
                  </div>
                </div>
              )}

              {selectedEvent.notes && (
                <div className="detail-section">
                  <h4>📌 Ghi chú</h4>
                  <div className="notes-content">
                    <p>{selectedEvent.notes}</p>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>⚠️ Lưu ý quan trọng</h4>
                <div className="important-notes">
                  <ul>
                    <li>Vui lòng đảm bảo con em đã ăn sáng trước khi tiêm</li>
                    <li>Mang theo sổ tiêm chủng và giấy tờ tùy thân</li>
                    <li>Thông báo cho y tá nếu con em có tiền sử dị ứng</li>
                    <li>Ở lại quan sát 15-30 phút sau khi tiêm</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setShowDetailModal(false)}
                className="close-btn"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VaccinationEvents;
