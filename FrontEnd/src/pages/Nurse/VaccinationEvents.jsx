import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Nurse/VaccinationEvents.css";
import { vaccinationEventService } from "../../services/vaccinationService";

function VaccinationEvents() {
  const navigate = useNavigate();

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

  // Fetch all vaccination events
  const fetchVaccinationEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await vaccinationEventService.getAllEvents();
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

  // Handle view student list
  const handleViewStudents = (eventId) => {
    navigate(`/nurse/vaccination-events/${eventId}/students`);
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
          <h1> Sự Kiện Tiêm Chủng</h1>
          <p>Xem thông tin các đợt tiêm vaccine cho học sinh</p>
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
            <h3>{events.length}</h3>
            <p>Tổng sự kiện</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🟡</div>
          <div className="stat-content">
            <h3>
              {events.filter((e) => getStatusText(e) === "Sắp diễn ra").length}
            </h3>
            <p>Sắp diễn ra</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>
              {
                events.filter((e) => getStatusText(e) === "Đã hoàn thành")
                  .length
              }
            </h3>
            <p>Đã hoàn thành</p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="events-section">
        <h2> Danh sách sự kiện</h2>

        {events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="card-header">
                  <div className="event-title">
                    <h3>{event.title}</h3>
                    <span
                      className={`status-badge ${getStatusBadgeClass(event)}`}
                    >
                      {getStatusText(event)}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="event-info">
                    <div className="info-row">
                      <span className="label">💉 Vaccine:</span>
                      <span className="value">{event.vaccineName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">📅 Ngày tiêm:</span>
                      <span className="value">{event.eventDate}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">⏰ Giờ tiêm:</span>
                      <span className="value">
                        {event.eventTime || "Chưa có"}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">📍 Địa điểm:</span>
                      <span className="value">{event.location}</span>
                    </div>
                  </div>

                  {event.description && (
                    <div className="event-description">
                      <p>{event.description}</p>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button
                    className="view-btn"
                    onClick={() => handleViewDetails(event)}
                  >
                     Xem chi tiết
                  </button>
                  <button
                    className="students-btn"
                    onClick={() => handleViewStudents(event.id)}
                  >
                    👥 Danh sách học sinh
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <div className="no-events-icon">💉</div>
            <p>Chưa có sự kiện tiêm chủng nào</p>
            <small>Liên hệ quản lý để biết thêm thông tin</small>
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
                    <span className="detail-label">Vaccine:</span>
                    <span className="detail-value">
                      {selectedEvent.vaccineName}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ngày tiêm:</span>
                    <span className="detail-value">
                      {selectedEvent.eventDate}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Giờ tiêm:</span>
                    <span className="detail-value">
                      {selectedEvent.eventTime || "Chưa có"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Địa điểm:</span>
                    <span className="detail-value">
                      {selectedEvent.location}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Trạng thái:</span>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        selectedEvent
                      )}`}
                    >
                      {getStatusText(selectedEvent)}
                    </span>
                  </div>
                </div>
              </div>

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
