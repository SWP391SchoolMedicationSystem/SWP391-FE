import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaccinationEventService } from '../../services/vaccinationService';

// Material-UI Icons
import VaccinesIcon from '@mui/icons-material/Vaccines';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import NotesIcon from '@mui/icons-material/Notes';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorIcon from '@mui/icons-material/Error';
import InboxIcon from '@mui/icons-material/Inbox';
import GroupIcon from '@mui/icons-material/Group';

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

  // Get status text
  const getStatusText = event => {
    const eventDate = new Date(event.eventDate);
    const today = new Date();

    if (eventDate < today) return 'Đã phản hồi';
    return 'Chưa phản hồi';
  };

  if (loading) {
    return (
      <div
        style={{
          padding: '20px',
          background: '#f2f6f3',
          minHeight: '100vh',
          fontFamily:
            'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid #c1cbc2',
          }}
        >
          <HourglassEmptyIcon
            sx={{ color: '#97a19b', fontSize: '3rem', marginBottom: '15px' }}
          />
          <p
            style={{
              margin: 0,
              color: '#97a19b',
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
          background: '#f2f6f3',
          minHeight: '100vh',
          fontFamily:
            'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            border: '1px solid #c1cbc2',
          }}
        >
          <ErrorIcon
            sx={{ color: '#c3555c', fontSize: '3rem', marginBottom: '15px' }}
          />
          <p
            style={{
              margin: '0 0 20px 0',
              color: '#c3555c',
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '1.1rem',
            }}
          >
            {error}
          </p>
          <button
            onClick={fetchVaccinationEvents}
            style={{
              background: '#2f5148',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
              fontFamily: 'Satoshi, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
        background: '#f2f6f3',
        minHeight: '100vh',
        fontFamily:
          'Satoshi, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #c1cbc2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <h1
            style={{
              margin: '0 0 8px 0',
              color: '#2f5148',
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '2rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <VaccinesIcon sx={{ color: '#97a19b', fontSize: '2rem' }} />
            Sự Kiện Tiêm Chủng
          </h1>
          <p
            style={{
              margin: 0,
              color: '#97a19b',
              fontFamily: 'Satoshi, sans-serif',
              fontSize: '1.1rem',
            }}
          >
            Xem thông tin các đợt tiêm vaccine cho học sinh
          </p>
        </div>
        <button
          onClick={fetchVaccinationEvents}
          style={{
            background: '#2f5148',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
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
            background: 'white',
            padding: '25px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: '1px solid #c1cbc2',
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
            <VaccinesIcon sx={{ color: '#97a19b', fontSize: '2.5rem' }} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '2rem',
                margin: 0,
                color: '#2f5148',
                fontWeight: 700,
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              {events.length}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              Tổng sự kiện
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            padding: '25px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: '1px solid #c1cbc2',
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
                color: '#2f5148',
                fontWeight: 700,
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              {events.filter(e => getStatusText(e) === 'Chưa phản hồi').length}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              Chưa phản hồi
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'white',
            padding: '25px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 10px rgba(193, 203, 194, 0.3)',
            border: '1px solid #c1cbc2',
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
                color: '#2f5148',
                fontWeight: 700,
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              {events.filter(e => getStatusText(e) === 'Đã phản hồi').length}
            </h3>
            <p
              style={{
                margin: '5px 0 0 0',
                color: '#97a19b',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              Đã phản hồi
            </p>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '25px',
          marginBottom: '30px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid #c1cbc2',
          transition: 'all 0.3s ease',
        }}
      >
        <h2
          style={{
            margin: '0 0 30px 0',
            color: '#2f5148',
            fontFamily: 'Satoshi, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <VaccinesIcon sx={{ color: '#97a19b', fontSize: '1.5rem' }} />
          Danh sách sự kiện
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
                  background: 'white',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Card Header */}
                <div
                  style={{
                    padding: '20px 25px',
                    borderBottom: '1px solid #e9ecef',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 15px 0',
                      color: '#2f5148',
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
                          color: '#97a19b',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Vaccine:
                      </span>
                      <span
                        style={{
                          color: '#2f5148',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {event.title}
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
                          color: '#97a19b',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Ngày tiêm:
                      </span>
                      <span
                        style={{
                          color: '#2f5148',
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
                          color: '#97a19b',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Tổ chức:
                      </span>
                      <span
                        style={{
                          color: '#2f5148',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        {event.organizedBy || 'Chưa có'}
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
                          color: '#97a19b',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          fontWeight: 500,
                        }}
                      >
                        Địa điểm:
                      </span>
                      <span
                        style={{
                          color: '#2f5148',
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
                        background: '#f8f9fa',
                        padding: '15px',
                        borderRadius: '12px',
                        marginBottom: '20px',
                        border: '1px solid #e9ecef',
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          color: '#97a19b',
                          fontSize: '0.9rem',
                          fontFamily: 'Satoshi, sans-serif',
                          lineHeight: 1.5,
                        }}
                      >
                        {event.description}
                      </p>
                    </div>
                  )}

                  {/* Card Footer - Two Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      onClick={() => handleViewDetails(event)}
                      style={{
                        flex: '1',
                        minWidth: '140px',
                        background: '#2f5148',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        fontFamily: 'Satoshi, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <VisibilityIcon sx={{ fontSize: '1.1rem' }} />
                      Xem chi tiết
                    </button>
                    <button
                      onClick={() => handleViewStudents(event.id)}
                      style={{
                        flex: '1',
                        minWidth: '140px',
                        background: '#bfefa1',
                        color: '#1a3a2e',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        fontFamily: 'Satoshi, sans-serif',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <GroupIcon sx={{ fontSize: '1.1rem' }} />
                      Danh sách học sinh
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#97a19b',
            }}
          >
            <InboxIcon
              sx={{ fontSize: '4rem', marginBottom: '20px', color: '#97a19b' }}
            />
            <p
              style={{
                margin: '0 0 10px 0',
                fontSize: '1.2rem',
                fontFamily: 'Satoshi, sans-serif',
                fontWeight: 600,
              }}
            >
              Chưa có sự kiện tiêm chủng nào
            </p>
            <p
              style={{
                margin: 0,
                fontSize: '1rem',
                fontFamily: 'Satoshi, sans-serif',
              }}
            >
              Liên hệ quản lý để biết thêm thông tin
            </p>
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
                    padding: '12px 15px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                  }}
                >
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
                  <span
                    style={{
                      color: '#2f5148',
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
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                  }}
                >
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
                    padding: '12px 15px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <span
                    style={{
                      color: '#97a19b',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                  >
                    Tổ chức:
                  </span>
                  <span
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {selectedEvent.organizedBy || 'Chưa có'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 15px',
                    background: '#f8f9fa',
                    borderRadius: '10px',
                    border: '1px solid #e9ecef',
                  }}
                >
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

              {/* Important Notes */}
              <div
                style={{
                  background: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                }}
              >
                <h4
                  style={{
                    margin: '0 0 10px 0',
                    color: '#2f5148',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  Lưu ý quan trọng:
                </h4>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '20px',
                    color: '#97a19b',
                    fontFamily: 'Satoshi, sans-serif',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                  }}
                >
                  <li>Thông tin chi tiết sẽ được cập nhật thường xuyên</li>
                  <li>Liên hệ quản lý nếu cần thêm thông tin</li>
                  <li>Kiểm tra danh sách học sinh tham gia</li>
                </ul>
              </div>
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
                onClick={() => setShowDetailModal(false)}
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
