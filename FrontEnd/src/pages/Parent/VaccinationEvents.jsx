import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { vaccinationEventService } from '../../services/vaccinationService';

// Material-UI Icons
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import NotesIcon from '@mui/icons-material/Notes';
import WarningIcon from '@mui/icons-material/Warning';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorIcon from '@mui/icons-material/Error';
import InboxIcon from '@mui/icons-material/Inbox';

function VaccinationEvents() {
  // Get theme from parent layout
  const context = useOutletContext();
  const { theme, isDarkMode } = context || { theme: null, isDarkMode: false };

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

  // Fetch all vaccination events with parent responses
  const fetchVaccinationEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await vaccinationEventService.getMyResponses();
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

  // Get status text based on parent response
  const getStatusText = event => {
    return event.responseStatus || 'Chưa phản hồi';
  };

  // Get status color based on response
  const getStatusColor = event => {
    const status = getStatusText(event);
    switch (status) {
      case 'Đã phản hồi':
        return {
          background: '#2f5148',
          color: 'white',
        };
      case 'Chưa phản hồi':
      default:
        return {
          background: theme ? (isDarkMode ? '#4a5568' : '#bfefa1') : '#bfefa1',
          color: theme ? (isDarkMode ? '#ffffff' : '#1a3a2e') : '#1a3a2e',
        };
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: '20px',
          background: theme ? theme.background : '#f2f6f3',
          minHeight: '100vh',
          fontFamily:
            "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        }}
      >
        <div
          style={{
            background: theme ? theme.cardBg : 'white',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: theme ? `1px solid ${theme.border}` : '1px solid #c1cbc2',
          }}
        >
          <HourglassEmptyIcon
            sx={{ color: '#97a19b', fontSize: '3rem', marginBottom: '15px' }}
          />
          <p
            style={{
              margin: 0,
              color: theme ? theme.textSecondary : '#97a19b',
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '1.1rem',
            }}
          >
            Đang tải danh sách sự kiện tiêm chủng...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: '20px',
          background: theme ? theme.background : '#f2f6f3',
          minHeight: '100vh',
          fontFamily:
            "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        }}
      >
        <div
          style={{
            background: theme ? theme.cardBg : 'white',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: theme ? `1px solid ${theme.border}` : '1px solid #c1cbc2',
          }}
        >
          <ErrorIcon
            sx={{ color: '#c3555c', fontSize: '3rem', marginBottom: '15px' }}
          />
          <p
            style={{
              margin: '0 0 20px 0',
              color: theme ? theme.textPrimary : '#2f5148',
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '1.1rem',
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchVaccinationEvents}
            style={{
              background: theme
                ? isDarkMode
                  ? '#2d4739'
                  : '#2f5148'
                : '#2f5148',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              fontFamily: 'Satoshi, sans-serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto',
              transition: 'all 0.3s ease',
            }}
          >
            <RefreshIcon sx={{ fontSize: '1.2rem' }} />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '20px',
        background: theme ? theme.background : '#f2f6f3',
        minHeight: '100vh',
        fontFamily:
          "Satoshi, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          padding: '30px',
          borderRadius: '20px',
          background: theme
            ? isDarkMode
              ? 'linear-gradient(135deg, #2a2a2a 0%, #333333 100%)'
              : 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)'
            : 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(47, 81, 72, 0.3)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '2.5rem',
              margin: 0,
              fontWeight: 700,
              fontFamily: 'Satoshi, sans-serif',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
            }}
          >
            <VaccinesIcon sx={{ color: 'white', fontSize: '2.5rem' }} />
            Thông Tin Tiêm Chủng
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              margin: '10px 0 0 0',
              opacity: 0.9,
              fontFamily: 'Satoshi, sans-serif',
              color: 'white',
            }}
          >
            Xem thông tin các đợt tiêm vaccine cho con em
          </p>
        </div>
        <button
          onClick={fetchVaccinationEvents}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 500,
            fontFamily: 'Satoshi, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
          }}
        >
          <RefreshIcon sx={{ fontSize: '1.2rem' }} />
          Tải lại
        </button>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        <div
          style={{
            background: theme ? theme.cardBg : 'white',
            padding: '25px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: theme ? `1px solid ${theme.border}` : '1px solid #c1cbc2',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(191, 239, 161, 0.3)',
            }}
          >
            <CalendarTodayIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: theme ? theme.textPrimary : '#2f5148',
                fontWeight: 700,
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              {events.length}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: theme ? theme.textSecondary : '#97a19b',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              Tổng sự kiện
            </p>
          </div>
        </div>

        <div
          style={{
            background: theme ? theme.cardBg : 'white',
            padding: '25px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: theme ? `1px solid ${theme.border}` : '1px solid #c1cbc2',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(191, 239, 161, 0.3)',
            }}
          >
            <CheckCircleIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: theme ? theme.textPrimary : '#2f5148',
                fontWeight: 700,
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              {events.filter(e => e.hasResponded).length}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: theme ? theme.textSecondary : '#97a19b',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              Đã phản hồi
            </p>
          </div>
        </div>

        <div
          style={{
            background: theme ? theme.cardBg : 'white',
            padding: '25px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: theme ? `1px solid ${theme.border}` : '1px solid #c1cbc2',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div
            style={{
              padding: '15px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(191, 239, 161, 0.3)',
            }}
          >
            <ScheduleIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: theme ? theme.textPrimary : '#2f5148',
                fontWeight: 700,
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              {events.filter(e => !e.hasResponded).length}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: theme ? theme.textSecondary : '#97a19b',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              Chưa phản hồi
            </p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div
        style={{
          background: theme ? theme.cardBg : 'white',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: theme ? `1px solid ${theme.border}` : '1px solid #c1cbc2',
          transition: 'all 0.3s ease',
        }}
      >
        <h2
          style={{
            margin: '0 0 30px 0',
            color: theme ? theme.textPrimary : '#2f5148',
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <VaccinesIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
          Lịch tiêm chủng
        </h2>

        {events.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '25px',
            }}
          >
            {events.map(event => (
              <div
                key={event.id}
                style={{
                  background: theme
                    ? isDarkMode
                      ? '#2a2a2a'
                      : 'white'
                    : 'white',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  border: theme
                    ? `1px solid ${theme.border}`
                    : '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
              >
                {/* Card Header */}
                <div
                  style={{
                    padding: '20px 25px',
                    borderBottom: theme
                      ? `1px solid ${theme.border}`
                      : '1px solid #e9ecef',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 15px 0',
                      color: theme ? theme.textPrimary : '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.3rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {event.title}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span
                      style={{
                        background: getStatusColor(event).background,
                        color: getStatusColor(event).color,
                        padding: '4px 12px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        fontFamily: 'Satoshi, sans-serif',
                      }}
                    >
                      {getStatusText(event)}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '20px 25px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <VaccinesIcon
                        sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                      />
                      <span
                        style={{
                          color: theme ? theme.textSecondary : '#97a19b',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Vaccine:
                      </span>
                      <span
                        style={{
                          color: theme ? theme.textPrimary : '#2f5148',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {event.vaccineName}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <CalendarTodayIcon
                        sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                      />
                      <span
                        style={{
                          color: theme ? theme.textSecondary : '#97a19b',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Ngày tiêm:
                      </span>
                      <span
                        style={{
                          color: theme ? theme.textPrimary : '#2f5148',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {event.eventDate}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <AccessTimeIcon
                        sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                      />
                      <span
                        style={{
                          color: theme ? theme.textSecondary : '#97a19b',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Giờ tiêm:
                      </span>
                      <span
                        style={{
                          color: theme ? theme.textPrimary : '#2f5148',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {event.eventTime || 'Chưa có'}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <LocationOnIcon
                        sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                      />
                      <span
                        style={{
                          color: theme ? theme.textSecondary : '#97a19b',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Địa điểm:
                      </span>
                      <span
                        style={{
                          color: theme ? theme.textPrimary : '#2f5148',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {event.location}
                      </span>
                    </div>
                  </div>

                  {event.description && (
                    <div
                      style={{
                        background: theme
                          ? isDarkMode
                            ? '#333333'
                            : '#f8f9fa'
                          : '#f8f9fa',
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        border: theme
                          ? `1px solid ${theme.border}`
                          : '1px solid #e9ecef',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: theme ? theme.textSecondary : '#97a19b',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          lineHeight: 1.5,
                        }}
                      >
                        {event.description}
                      </p>
                    </div>
                  )}

                  {/* Card Footer */}
                  <button
                    onClick={() => handleViewDetails(event)}
                    style={{
                      width: '100%',
                      background: theme
                        ? isDarkMode
                          ? '#2d4739'
                          : '#2f5148'
                        : '#2f5148',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 500,
                      fontFamily: 'Satoshi, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: '1.2rem' }} />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              background: theme
                ? isDarkMode
                  ? '#333333'
                  : '#f8f9fa'
                : '#f8f9fa',
              borderRadius: '15px',
              border: theme ? `1px solid ${theme.border}` : '1px solid #e9ecef',
            }}
          >
            <VaccinesIcon
              sx={{ color: '#97a19b', fontSize: '4rem', marginBottom: '15px' }}
            />
            <p
              style={{
                margin: '0 0 10px 0',
                color: theme ? theme.textSecondary : '#97a19b',
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '1.1rem',
              }}
            >
              Chưa có sự kiện tiêm chủng nào
            </p>
            <small
              style={{
                color: theme ? theme.textSecondary : '#97a19b',
                fontFamily: 'Satoshi, sans-serif',
                fontSize: '0.9rem',
              }}
            >
              Liên hệ nhà trường để biết thêm thông tin
            </small>
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
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              background: theme ? theme.cardBg : 'white',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto',
              border: theme ? `1px solid ${theme.border}` : '1px solid #c1cbc2',
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
                borderBottom: theme
                  ? `1px solid ${theme.border}`
                  : '1px solid #e9ecef',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: theme ? theme.textPrimary : '#2f5148',
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
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: theme ? theme.textSecondary : '#97a19b',
                  cursor: 'pointer',
                  fontSize: '1.5rem',
                  padding: '5px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                }}
              >
                <CloseIcon sx={{ fontSize: '1.5rem' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '25px' }}>
              {/* Basic Information */}
              <div style={{ marginBottom: '30px' }}>
                <h4
                  style={{
                    margin: '0 0 20px 0',
                    color: theme ? theme.textPrimary : '#2f5148',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <InfoIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                  Thông tin cơ bản
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '15px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: theme
                        ? isDarkMode
                          ? '#333333'
                          : '#f8f9fa'
                        : '#f8f9fa',
                      borderRadius: '10px',
                      border: theme
                        ? `1px solid ${theme.border}`
                        : '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: theme ? theme.textSecondary : '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Tiêu đề:
                    </span>
                    <span
                      style={{
                        color: theme ? theme.textPrimary : '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      {selectedEvent.title}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: theme
                        ? isDarkMode
                          ? '#333333'
                          : '#f8f9fa'
                        : '#f8f9fa',
                      borderRadius: '10px',
                      border: theme
                        ? `1px solid ${theme.border}`
                        : '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: theme ? theme.textSecondary : '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Vaccine:
                    </span>
                    <span
                      style={{
                        color: theme ? theme.textPrimary : '#2f5148',
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
                      padding: '12px 15px',
                      background: theme
                        ? isDarkMode
                          ? '#333333'
                          : '#f8f9fa'
                        : '#f8f9fa',
                      borderRadius: '10px',
                      border: theme
                        ? `1px solid ${theme.border}`
                        : '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: theme ? theme.textSecondary : '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Ngày tiêm:
                    </span>
                    <span
                      style={{
                        color: theme ? theme.textPrimary : '#2f5148',
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
                      padding: '12px 15px',
                      background: theme
                        ? isDarkMode
                          ? '#333333'
                          : '#f8f9fa'
                        : '#f8f9fa',
                      borderRadius: '10px',
                      border: theme
                        ? `1px solid ${theme.border}`
                        : '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: theme ? theme.textSecondary : '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Giờ tiêm:
                    </span>
                    <span
                      style={{
                        color: theme ? theme.textPrimary : '#2f5148',
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
                      padding: '12px 15px',
                      background: theme
                        ? isDarkMode
                          ? '#333333'
                          : '#f8f9fa'
                        : '#f8f9fa',
                      borderRadius: '10px',
                      border: theme
                        ? `1px solid ${theme.border}`
                        : '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: theme ? theme.textSecondary : '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Địa điểm:
                    </span>
                    <span
                      style={{
                        color: theme ? theme.textPrimary : '#2f5148',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                    >
                      {selectedEvent.location}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: theme
                        ? isDarkMode
                          ? '#333333'
                          : '#f8f9fa'
                        : '#f8f9fa',
                      borderRadius: '10px',
                      border: theme
                        ? `1px solid ${theme.border}`
                        : '1px solid #e9ecef',
                    }}
                  >
                    <span
                      style={{
                        color: theme ? theme.textSecondary : '#97a19b',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      Trạng thái:
                    </span>
                    <span
                      style={{
                        background: getStatusColor(selectedEvent).background,
                        color: getStatusColor(selectedEvent).color,
                        padding: '4px 12px',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        fontFamily: 'Satoshi, sans-serif',
                      }}
                    >
                      {getStatusText(selectedEvent)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div style={{ marginBottom: '30px' }}>
                  <h4
                    style={{
                      margin: '0 0 15px 0',
                      color: theme ? theme.textPrimary : '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <DescriptionIcon
                      sx={{ color: '#97a19b', fontSize: '1.2rem' }}
                    />
                    Mô tả
                  </h4>
                  <div
                    style={{
                      background: theme
                        ? isDarkMode
                          ? '#333333'
                          : '#f8f9fa'
                        : '#f8f9fa',
                      padding: '15px',
                      borderRadius: '12px',
                      border: theme
                        ? `1px solid ${theme.border}`
                        : '1px solid #e9ecef',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: theme ? theme.textSecondary : '#97a19b',
                        fontSize: '0.9rem',
                        fontFamily: 'Satoshi, sans-serif',
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedEvent.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedEvent.notes && (
                <div style={{ marginBottom: '30px' }}>
                  <h4
                    style={{
                      margin: '0 0 15px 0',
                      color: theme ? theme.textPrimary : '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.2rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <NotesIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                    Ghi chú
                  </h4>
                  <div
                    style={{
                      background: theme
                        ? isDarkMode
                          ? '#333333'
                          : '#f8f9fa'
                        : '#f8f9fa',
                      padding: '15px',
                      borderRadius: '12px',
                      border: theme
                        ? `1px solid ${theme.border}`
                        : '1px solid #e9ecef',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: theme ? theme.textSecondary : '#97a19b',
                        fontSize: '0.9rem',
                        fontFamily: 'Satoshi, sans-serif',
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedEvent.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Parent Response Details */}
              <div style={{ marginBottom: '30px' }}>
                <h4
                  style={{
                    margin: '0 0 15px 0',
                    color: theme ? theme.textPrimary : '#2f5148',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <InfoIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                  Thông tin phản hồi
                </h4>
                <div
                  style={{
                    background: theme
                      ? isDarkMode
                        ? '#333333'
                        : '#f8f9fa'
                      : '#f8f9fa',
                    padding: '15px',
                    borderRadius: '12px',
                    border: theme
                      ? `1px solid ${theme.border}`
                      : '1px solid #e9ecef',
                  }}
                >
                  {selectedEvent.hasResponded ? (
                    <div>
                      <div style={{ marginBottom: '10px' }}>
                        <strong
                          style={{
                            color: theme ? theme.textPrimary : '#2f5148',
                          }}
                        >
                          Tình trạng phản hồi:
                        </strong>
                        <span
                          style={{
                            background:
                              getStatusColor(selectedEvent).background,
                            color: getStatusColor(selectedEvent).color,
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            marginLeft: '10px',
                          }}
                        >
                          {getStatusText(selectedEvent)}
                        </span>
                      </div>

                      {selectedEvent.myResponses &&
                        selectedEvent.myResponses.length > 0 && (
                          <div>
                            <strong
                              style={{
                                color: theme ? theme.textPrimary : '#2f5148',
                              }}
                            >
                              Chi tiết con em:
                            </strong>
                            <div style={{ marginTop: '10px' }}>
                              {selectedEvent.myResponses.map(
                                (response, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      padding: '8px',
                                      marginBottom: '8px',
                                      background: 'white',
                                      borderRadius: '8px',
                                      border: '1px solid #e9ecef',
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontWeight: 500,
                                        marginBottom: '4px',
                                      }}
                                    >
                                      Học sinh ID: {response.studentId}
                                    </div>
                                    <div style={{ fontSize: '0.9rem' }}>
                                      <span style={{ marginRight: '15px' }}>
                                        <strong>Tham gia:</strong>{' '}
                                        {response.willAttend ? 'Có' : 'Không'}
                                      </span>
                                      {response.reasonForDecline && (
                                        <span>
                                          <strong>Lý do:</strong>{' '}
                                          {response.reasonForDecline}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    <p
                      style={{
                        margin: 0,
                        color: theme ? theme.textSecondary : '#97a19b',
                      }}
                    >
                      Bạn chưa phản hồi cho sự kiện tiêm chủng này.
                    </p>
                  )}
                </div>
              </div>

              {/* Decline Reason */}
              {selectedEvent.hasResponded &&
                selectedEvent.parentConsent === false &&
                selectedEvent.myResponses &&
                selectedEvent.myResponses.length > 0 && (
                  <div style={{ marginBottom: '30px' }}>
                    <h4
                      style={{
                        margin: '0 0 15px 0',
                        color: '#c3555c',
                        fontFamily: 'Satoshi, sans-serif',
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <CancelIcon
                        sx={{ color: '#c3555c', fontSize: '1.2rem' }}
                      />
                      Lý do từ chối
                    </h4>
                    <div
                      style={{
                        background: 'rgba(195, 85, 92, 0.1)',
                        padding: '15px',
                        borderRadius: '12px',
                        border: '1px solid rgba(195, 85, 92, 0.3)',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: '#c3555c',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          lineHeight: 1.6,
                        }}
                      >
                        {selectedEvent.myResponses.find(r => r.reasonForDecline)
                          ?.reasonForDecline || 'Không có lý do cụ thể'}
                      </p>
                    </div>
                  </div>
                )}

              {/* Important Notes */}
              <div style={{ marginBottom: '20px' }}>
                <h4
                  style={{
                    margin: '0 0 15px 0',
                    color: theme ? theme.textPrimary : '#2f5148',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <WarningIcon sx={{ color: '#97a19b', fontSize: '1.2rem' }} />
                  Lưu ý quan trọng
                </h4>
                <div
                  style={{
                    background: theme
                      ? isDarkMode
                        ? '#333333'
                        : '#f8f9fa'
                      : '#f8f9fa',
                    padding: '15px',
                    borderRadius: '12px',
                    border: theme
                      ? `1px solid ${theme.border}`
                      : '1px solid #e9ecef',
                  }}
                >
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '20px',
                      color: theme ? theme.textSecondary : '#97a19b',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.9rem',
                      lineHeight: 1.6,
                    }}
                  >
                    <li>Vui lòng đảm bảo con em đã ăn sáng trước khi tiêm</li>
                    <li>Mang theo sổ tiêm chủng và giấy tờ tùy thân</li>
                    <li>Thông báo cho y tá nếu con em có tiền sử dị ứng</li>
                    <li>Ở lại quan sát 15-30 phút sau khi tiêm</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '20px 25px',
                borderTop: theme
                  ? `1px solid ${theme.border}`
                  : '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: theme
                    ? isDarkMode
                      ? '#3a3a3a'
                      : '#bfefa1'
                    : '#bfefa1',
                  color: theme
                    ? isDarkMode
                      ? '#ffffff'
                      : '#1a3a2e'
                    : '#1a3a2e',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                  fontFamily: 'Satoshi, sans-serif',
                  transition: 'all 0.3s ease',
                }}
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
