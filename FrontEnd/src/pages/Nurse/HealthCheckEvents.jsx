import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthCheckEventService } from '../../services/healthCheckEventService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../css/Nurse/HealthCheckEvents.css';

// Material-UI Icons
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupIcon from '@mui/icons-material/Group';

const HealthCheckEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const eventsData = await healthCheckEventService.getAllHealthCheckEvents();
      
      console.log('All events from API:', eventsData);
      
      // Sort by date (newest first)
      const sortedEvents = (eventsData || []).sort((a, b) => {
        return new Date(b.eventdate) - new Date(a.eventdate);
      });
      
      console.log('Sorted events to display:', sortedEvents);
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty array if API fails
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = async (event) => {
    try {
      if (!event.documentfilename || !event.documentaccesstoken) {
        alert('Không có file để mở');
        return;
      }

      // Sử dụng service function để download/mở file
      await healthCheckEventService.downloadEventDocument(event.healthcheckeventID);
      
    } catch (error) {
      console.error('Error opening file:', error);
      alert('Có lỗi xảy ra khi mở file. Vui lòng thử lại.');
    }
  };

  // Handle view event details
  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  // Handle view student list
  const handleViewStudents = (eventId) => {
    navigate(`/nurse/health-check-events/${eventId}/students`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="review-requests-container" style={{ 
      maxWidth: '100%', 
      padding: '0 20px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div className="review-requests-header" style={{
        background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(47, 81, 72, 0.3)',
        padding: '32px 40px',
        borderRadius: '24px',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '2rem', fontWeight: '600' }}>
            <i className="fas fa-calendar-medical" style={{ marginRight: '12px' }}></i>
            Xem sự kiện khám sức khỏe định kỳ
          </h1>
          <p style={{ color: 'white', opacity: 0.95, margin: '8px 0 0 0', fontSize: '1.1rem' }}>
            Xem danh sách các sự kiện khám sức khỏe cho học sinh
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div style={{
        background: '#e8f5e8',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        boxShadow: '0 2px 10px rgba(115, 173, 103, 0.1)'
      }}>
        <div style={{ fontSize: '24px' }}>📋</div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#2f5148' }}>
            {events.length} Tổng sự kiện
          </h3>
        </div>
      </div>

      {/* Event List Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#2f5148',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <i className="fas fa-list" style={{ color: '#73ad67' }}></i>
          Danh sách sự kiện
        </h2>

        {/* Event Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          maxWidth: '100%'
        }}>
          {events.map((event) => (
            <div
              key={event.healthcheckeventID}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid #e9ecef'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Card Header */}
              <div style={{
                background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                color: 'white',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  flex: 1
                }}>
                  {event.healthcheckeventname}
                </h3>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px' }}>
                {/* Event Details */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <i className="fas fa-calendar-check" style={{ color: '#73ad67', fontSize: '16px' }}></i>
                    <span style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                      Ngày khám: {new Date(event.eventdate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#73ad67', fontSize: '16px' }}></i>
                    <span style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                      Địa điểm: {event.location}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <i className="fas fa-user" style={{ color: '#73ad67', fontSize: '16px' }}></i>
                    <span style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                      Tổ chức: {event.createdby}
                    </span>
                  </div>


                </div>

                {/* Description */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#6c757d',
                    lineHeight: '1.5'
                  }}>
                    {event.healthcheckeventdescription}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <button
                    onClick={() => handleViewDetails(event)}
                    style={{
                      background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flex: 1
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(47, 81, 72, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: '16px' }} />
                    Xem chi tiết
                  </button>
                  
                  <button
                    onClick={() => handleViewStudents(event.healthcheckeventID)}
                    style={{
                      background: 'linear-gradient(135deg, #bfefa1 0%, #a8e68a 100%)',
                      color: '#2f5148',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flex: 1
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(191, 239, 161, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <GroupIcon sx={{ fontSize: '16px' }} />
                    Danh sách học sinh
                  </button>
                </div>

                {/* Read-only Notice */}
                <div style={{
                  background: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-eye" style={{ color: '#856404', marginRight: '8px' }}></i>
                  <span style={{ color: '#856404', fontSize: '0.9rem', fontWeight: '500' }}>
                    Chế độ xem - Chỉ có thể xem thông tin
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#6c757d',
            fontSize: '1.1rem'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
            <p>Không có sự kiện khám sức khỏe nào</p>
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
                Chi Tiết Sự Kiện Khám Sức Khỏe
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
                    Tên sự kiện:
                  </span>
                  <span
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {selectedEvent.healthcheckeventname}
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
                    Ngày khám:
                  </span>
                  <span
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {new Date(selectedEvent.eventdate).toLocaleDateString('vi-VN')}
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
                    {selectedEvent.createdby}
                  </span>
                </div>

                {selectedEvent.documentfilename && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 15px',
                      background: '#f8f9fa',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                      gridColumn: '1 / -1',
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
                      Tài liệu:
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          color: '#2f5148',
                          fontFamily: 'Satoshi, sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                        }}
                      >
                        {selectedEvent.documentfilename}
                      </span>
                      <button
                        onClick={() => handleOpenFile(selectedEvent)}
                        style={{
                          background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <AttachFileIcon sx={{ fontSize: '14px' }} />
                        Mở file
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Description Section */}
              {selectedEvent.healthcheckeventdescription && (
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
                      fontSize: '1rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <DescriptionIcon sx={{ color: '#97a19b', fontSize: '1rem' }} />
                    Mô tả sự kiện:
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
                    {selectedEvent.healthcheckeventdescription}
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
                  <li>Đảm bảo mang đầy đủ giấy tờ cần thiết</li>
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
};

export default HealthCheckEvents; 