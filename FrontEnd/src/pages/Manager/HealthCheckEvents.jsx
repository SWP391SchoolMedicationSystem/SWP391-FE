import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { healthCheckEventService } from '../../services/healthCheckEventService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../css/Manager/HealthCheckEvents.css';

// Material-UI Icons
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';

const HealthCheckEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [eventStudentCounts, setEventStudentCounts] = useState({});
  const [formData, setFormData] = useState({
    healthcheckeventname: '',
    healthcheckeventdescription: '',
    location: '',
    eventdate: new Date().toISOString().split('T')[0],
    documentfilename: '',
    documentaccesstoken: '',
    createdby: '',
    createddate: new Date().toISOString(),
    isdeleted: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const eventsData = await healthCheckEventService.getAllHealthCheckEvents();
      
      console.log('All events from API:', eventsData);
      
      // Filter out deleted events and sort by date (newest first)
      const filteredEvents = (eventsData || []).filter(event => !event.isdeleted);
      const sortedEvents = filteredEvents.sort((a, b) => {
        return new Date(b.eventdate) - new Date(a.eventdate);
      });
      
      console.log('Filtered and sorted events to display:', sortedEvents);
      setEvents(sortedEvents);
      
      // Fetch student counts for each event
      const studentCounts = {};
      for (const event of sortedEvents) {
        try {
          const studentsData = await healthCheckEventService.getStudentsByEventId(event.healthcheckeventID);
          studentCounts[event.healthcheckeventID] = studentsData ? studentsData.length : 0;
        } catch (error) {
          console.error(`Error fetching students for event ${event.healthcheckeventID}:`, error);
          studentCounts[event.healthcheckeventID] = 0;
        }
      }
      setEventStudentCounts(studentCounts);
      
      console.log('Updated events state:', sortedEvents);
      console.log('Updated student counts:', studentCounts);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set empty array if API fails
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file PDF, Word hoặc Excel');
        e.target.value = '';
        return;
      }
      
      if (file.size > maxSize) {
        alert('File không được lớn hơn 10MB');
        e.target.value = '';
        return;
      }
      
      setSelectedFile(file);
      setFormData(prev => ({
        ...prev,
        documentfilename: file.name
      }));
    } else {
      setSelectedFile(null);
      setFormData(prev => ({
        ...prev,
        documentfilename: ''
      }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let userInfo = null;
      try {
        userInfo = JSON.parse(localStorage.getItem('userInfo'));
      } catch (error) {
        console.error('Error parsing user info:', error);
      }

      const formDataToSend = new FormData();
      
      // Add file if selected
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }
      
      // Add other form data
      Object.keys(formData).forEach(key => {
        if (key === 'createdby' && !formData[key]) {
          formDataToSend.append(key, userInfo?.fullname || userInfo?.userName || 'Manager');
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (editingEvent) {
        // Send as JSON object instead of FormData for update
        const updateData = {
          healthcheckeventID: editingEvent.healthcheckeventID,
          healthcheckeventname: formData.healthcheckeventname,
          healthcheckeventdescription: formData.healthcheckeventdescription,
          location: formData.location,
          eventdate: new Date(formData.eventdate + 'T00:00:00').toISOString(),
          isdeleted: false
        };
        await healthCheckEventService.updateHealthCheckEvent(editingEvent.healthcheckeventID, updateData);
        
        // Verify the update by fetching the specific event
        try {
          const updatedEvent = await healthCheckEventService.getHealthCheckEventById(editingEvent.healthcheckeventID);
          console.log('Verified updated event:', updatedEvent);
          
          // Update the specific event in the current state
          setEvents(prevEvents => 
            prevEvents.map(event => 
              event.healthcheckeventID === editingEvent.healthcheckeventID 
                ? { ...event, ...updatedEvent }
                : event
            )
          );
        } catch (error) {
          console.error('Error verifying update:', error);
        }
        
        alert('Cập nhật sự kiện thành công!');
      } else {
        await healthCheckEventService.createHealthCheckEvent(formDataToSend);
        alert('Tạo sự kiện thành công!');
      }
      
      setShowModal(false);
      setEditingEvent(null);
      resetForm();
      
      // Thêm một chút delay để đảm bảo modal đóng hoàn toàn trước khi fetch data
      setTimeout(async () => {
        await fetchData(); // Đảm bảo fetchData hoàn thành trước khi tiếp tục
      }, 100);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Có lỗi xảy ra khi lưu sự kiện. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      healthcheckeventname: event.healthcheckeventname || '',
      healthcheckeventdescription: event.healthcheckeventdescription || '',
      location: event.location || '',
      eventdate: event.eventdate ? new Date(event.eventdate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      documentfilename: event.documentfilename || '',
      documentaccesstoken: event.documentaccesstoken || '',
      createdby: event.createdby || '',
      createddate: event.createddate || new Date().toISOString(),
      isdeleted: event.isdeleted || false
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      try {
        await healthCheckEventService.deleteHealthCheckEvent(id);
        alert('Xóa sự kiện thành công!');
        fetchData();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Có lỗi xảy ra khi xóa sự kiện. Vui lòng thử lại.');
      }
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
    navigate(`/manager/health-check-events/${eventId}/students`);
  };

  const resetForm = () => {
    setFormData({
      healthcheckeventname: '',
      healthcheckeventdescription: '',
      location: '',
      eventdate: new Date().toISOString().split('T')[0],
      documentfilename: '',
      documentaccesstoken: '',
      createdby: '',
      createddate: new Date().toISOString(),
      isdeleted: false
    });
    setSelectedFile(null);
    setEditingEvent(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="review-requests-container">
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
            Quản lý sự kiện khám sức khỏe định kỳ
          </h1>
          <p style={{ color: 'white', opacity: 0.95, margin: '8px 0 0 0', fontSize: '1.1rem' }}>
            Tạo và quản lý các sự kiện khám sức khỏe cho học sinh
          </p>
        </div>
      </div>

      {/* Create New Event Button */}
      <div style={{ 
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={openAddModal}
          style={{
            background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(47, 81, 72, 0.3)'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(47, 81, 72, 0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(47, 81, 72, 0.3)';
          }}
        >
          <AddIcon sx={{ fontSize: '20px' }} />
          Tạo sự kiện mới
        </button>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px'
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
                  
                  {/* Organization Section - Hidden */}
                  {/* <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <i className="fas fa-user" style={{ color: '#73ad67', fontSize: '16px' }}></i>
                    <span style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                      Tổ chức: {event.createdby}
                    </span>
                  </div> */}

                  {/* Document Section - Hidden */}
                  {/* {event.documentfilename && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <i className="fas fa-file-alt" style={{ color: '#73ad67', fontSize: '16px' }}></i>
                      <span style={{ fontSize: '0.95rem', color: '#6c757d' }}>
                        Tài liệu: {event.documentfilename}
                      </span>
                      <button
                        onClick={() => handleOpenFile(event)}
                        style={{
                          background: 'linear-gradient(135deg, #73ad67 0%, #5a8c5a 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Mở file
                      </button>
                    </div>
                  )} */}
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
                  gap: '8px',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={() => handleViewDetails(event)}
                    style={{
                      background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flex: 1,
                      minWidth: '120px'
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
                    <VisibilityIcon sx={{ fontSize: '14px' }} />
                    Xem chi tiết
                  </button>
                  
                  <button
                    onClick={() => handleViewStudents(event.healthcheckeventID)}
                    style={{
                      background: 'linear-gradient(135deg, #bfefa1 0%, #a8e68a 100%)',
                      color: '#2f5148',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flex: 1,
                      minWidth: '120px'
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
                    <GroupIcon sx={{ fontSize: '14px' }} />
                    Danh sách học sinh
                  </button>
                  
                  <button
                    onClick={() => handleEdit(event)}
                    style={{
                      background: 'linear-gradient(135deg, #ffc107 0%, #ffb300 100%)',
                      color: '#2f5148',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flex: 1,
                      minWidth: '100px'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.3)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <EditIcon sx={{ fontSize: '14px' }} />
                    Chỉnh sửa
                  </button>
                  
                  {eventStudentCounts[event.healthcheckeventID] === 0 && (
                    <button
                      onClick={() => handleDelete(event.healthcheckeventID)}
                      style={{
                        background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        flex: 1,
                        minWidth: '100px'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: '14px' }} />
                      Xóa
                    </button>
                  )}
                </div>

                {/* Manager Notice */}
                <div style={{
                  background: '#d1ecf1',
                  border: '1px solid #bee5eb',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <i className="fas fa-user-cog" style={{ color: '#0c5460', marginRight: '8px' }}></i>
                  <span style={{ color: '#0c5460', fontSize: '0.9rem', fontWeight: '500' }}>
                    Chế độ quản lý - Có thể chỉnh sửa và xóa
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

      {/* Create/Edit Modal */}
      {showModal && (
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
              maxWidth: '600px',
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
                {editingEvent ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
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
                onClick={() => {
                  setShowModal(false);
                  setEditingEvent(null);
                  resetForm();
                }}
              >
                <CloseIcon sx={{ fontSize: '1.5rem' }} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreate} style={{ padding: '25px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2f5148',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Tên sự kiện *
                </label>
                <input
                  type="text"
                  name="healthcheckeventname"
                  value={formData.healthcheckeventname}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#73ad67'}
                  onBlur={e => e.target.style.borderColor = '#e9ecef'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2f5148',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Mô tả
                </label>
                <textarea
                  name="healthcheckeventdescription"
                  value={formData.healthcheckeventdescription}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                  onFocus={e => e.target.style.borderColor = '#73ad67'}
                  onBlur={e => e.target.style.borderColor = '#e9ecef'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2f5148',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Địa điểm *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#73ad67'}
                  onBlur={e => e.target.style.borderColor = '#e9ecef'}
                />
              </div>

              {/* Examination Date Section - Hidden */}
              {/* <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2f5148',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Ngày khám *
                </label>
                <input
                  type="date"
                  name="eventdate"
                  value={formData.eventdate}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#73ad67'}
                  onBlur={e => e.target.style.borderColor = '#e9ecef'}
                />
              </div> */}

              {/* File Upload Section - Hidden */}
              {/* <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  color: '#2f5148',
                  fontWeight: '600',
                  fontSize: '0.95rem'
                }}>
                  Tài liệu đính kèm
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    transition: 'border-color 0.3s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#73ad67'}
                  onBlur={e => e.target.style.borderColor = '#e9ecef'}
                />
                <small style={{ color: '#6c757d', fontSize: '0.85rem' }}>
                  Chấp nhận file PDF, Word, Excel (tối đa 10MB)
                </small>
              </div> */}

              {/* Modal Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
                marginTop: '30px'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingEvent(null);
                    resetForm();
                  }}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#5a6268';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#6c757d';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    opacity: submitting ? 0.7 : 1
                  }}
                  onMouseEnter={e => {
                    if (!submitting) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(47, 81, 72, 0.3)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!submitting) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }
                  }}
                >
                  {submitting ? 'Đang lưu...' : (editingEvent ? 'Cập nhật' : 'Tạo sự kiện')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

                {/* Document Section - Hidden */}
                {/* {selectedEvent.documentfilename && (
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
                          background: 'linear-gradient(135deg, #73ad67 0%, #5a8c5a 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: '500',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Mở file
                      </button>
                    </div>
                  </div>
                )} */}
              </div>

              {/* Description */}
              {selectedEvent.healthcheckeventdescription && (
                <div style={{ marginBottom: '20px' }}>
                  <h4
                    style={{
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      marginBottom: '10px',
                    }}
                  >
                    Mô tả:
                  </h4>
                  <div
                    style={{
                      background: '#f8f9fa',
                      padding: '15px',
                      borderRadius: '10px',
                      border: '1px solid #e9ecef',
                      color: '#2f5148',
                      fontFamily: 'Satoshi, sans-serif',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                    }}
                  >
                    {selectedEvent.healthcheckeventdescription}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                marginTop: '30px'
              }}>
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{
                    background: 'linear-gradient(135deg, #2f5148 0%, #73ad67 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
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
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCheckEvents; 