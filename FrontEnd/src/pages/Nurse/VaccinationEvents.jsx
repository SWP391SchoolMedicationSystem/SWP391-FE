import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Nurse/VaccinationEvents.css';
import { vaccinationEventService } from '../../services/vaccinationService';
import InfoIcon from '@mui/icons-material/Info';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import NotesIcon from '@mui/icons-material/Notes';
import CloseIcon from '@mui/icons-material/Close';

function VaccinationEvents() {
  const navigate = useNavigate();

  // States for events management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
      setError('');
      const response = await vaccinationEventService.getAllEvents();
      setEvents(response);
    } catch (error) {
      console.error('Error fetching vaccination events:', error);
      setError('Không thể tải danh sách sự kiện tiêm chủng');
    } finally {
      setLoading(false);
    }
  };

  // Handle view event details
  const handleViewDetails = event => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  // Handle view student list
  const handleViewStudents = eventId => {
    navigate(`/nurse/vaccination-events/${eventId}/students`);
  };

  // Get status badge class
  const getStatusBadgeClass = event => {
    const eventDate = new Date(event.eventDate);
    const today = new Date();

    if (eventDate < today) return 'status-completed';
    return 'status-upcoming';
  };

  // Get status text
  const getStatusText = event => {
    const eventDate = new Date(event.eventDate);
    const today = new Date();

    if (eventDate < today) return 'Đã hoàn thành';
    return 'Sắp diễn ra';
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
              {events.filter(e => getStatusText(e) === 'Sắp diễn ra').length}
            </h3>
            <p>Sắp diễn ra</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>
              {events.filter(e => getStatusText(e) === 'Đã hoàn thành').length}
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
            {events.map(event => (
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
                        {event.eventTime || 'Chưa có'}
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
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto',
              border: '1px solid #c1cbc2',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '25px',
                borderBottom: '1px solid #e9ecef',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: '#2f5148',
                  fontFamily: 'Satoshi, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <InfoIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
                Chi Tiết Sự Kiện Tiêm Chủng
              </h3>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#97a19b',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '5px',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => setShowDetailModal(false)}
              >
                <CloseIcon sx={{ fontSize: '1.5rem' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '25px' }}>
              {/* Basic Information Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 15px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <VaccinesIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Vaccine:
                    </span>
                  </div>
                  <span
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {selectedEvent.vaccineName}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 15px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Ngày tiêm:
                    </span>
                  </div>
                  <span
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {selectedEvent.eventDate}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 15px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Giờ tiêm:
                    </span>
                  </div>
                  <span
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {selectedEvent.eventTime || 'Chưa có'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 15px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <LocationOnIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    <span
                      style={{
                        color: '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Địa điểm:
                    </span>
                  </div>
                  <span
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {selectedEvent.location}
                  </span>
                </div>
              </div>

              {/* Event Title */}
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  marginBottom: '20px',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 10px 0',
                    color: '#2f5148',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                  }}
                >
                  Tiêu đề sự kiện:
                </h4>
                <p
                  style={{
                    margin: 0,
                    color: '#97a19b',
                    fontSize: '0.9rem',
                    fontFamily: 'Satoshi, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  {selectedEvent.title}
                </p>
              </div>

              {/* Description Section */}
              {selectedEvent.description && (
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    marginBottom: '20px',
                  }}
                >
                  <h4
                    style={{
                      margin: '0 0 10px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <DescriptionIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    Mô tả:
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: '#97a19b',
                      fontSize: '0.9rem',
                      fontFamily: 'Satoshi, sans-serif',
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Notes Section */}
              {selectedEvent.notes && (
                <div
                  style={{
                    background: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '12px',
                    border: '1px solid #e9ecef',
                    marginBottom: '20px',
                  }}
                >
                  <h4
                    style={{
                      margin: '0 0 10px 0',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <NotesIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                    Ghi chú:
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: '#97a19b',
                      fontSize: '0.9rem',
                      fontFamily: 'Satoshi, sans-serif',
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedEvent.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '20px 25px',
                borderTop: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                style={{
                  background: '#bfefa1',
                  color: '#1a3a2e',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  fontFamily: 'Satoshi, sans-serif',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setShowDetailModal(false)}
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
